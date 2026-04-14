import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '../../store';
import { usersAPI } from '../../services/api';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import type { User } from '../../types';
import '../styles/Layout.css';

export const UsersPage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAdminAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'admin' | 'user';
  }>({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
  });

  useEffect(() => {
    if (!currentUser) navigate('/login');
    else loadUsers();
  }, [currentUser, navigate]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await usersAPI.getAll();
      setUsers(res.data || []);
    } catch (err: any) {
      console.error('Error loading users:', err);
      const message = err.response?.data?.error || err.message || 'Хэрэглэгчийн мэдээлэл ачаалахад алдаа гарлаа';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', phone: '', password: '', role: 'user' });
    setShowModal(true);
  };

  const handleEdit = (u: User) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      phone: u.phone || '',
      password: '',
      role: (u.role as 'admin' | 'user'),
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) return;
    try {
      if (editingUser) {
        await usersAPI.update(editingUser.id || '', formData);
        setUsers(users.map(u =>
          (u.id === editingUser.id)
            ? { ...u, ...formData }
            : u
        ));
      } else {
        const res = await usersAPI.create(formData);
        setUsers([...users, res.data]);
      }
      setShowModal(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', phone: '', password: '', role: 'user' });
    } catch (err) {
      console.error('Error saving user:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Та итгэлтэй байна уу?')) return;
    try {
      await usersAPI.delete(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const columns = [
    { key: 'name' as const, label: 'Нэр' },
    { key: 'email' as const, label: 'Имэйл' },
    { key: 'phone' as const, label: 'Утас' },
    { key: 'role' as const, label: 'Эрх' },
  ];

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-layout-content">
        <TopBar title="Хэрэглэгчийн менежмент" />
        <main className="admin-main">
          {error && (
            <Card className="mb-6">
              <div className="flex-between">
                <div className="text-danger">{error}</div>
                <Button variant="secondary" size="sm" onClick={loadUsers}>
                  Дахин оролдох
                </Button>
              </div>
            </Card>
          )}
          <Card
            title="Хэрэглэгчид"
            headerAction={
              <Button variant="primary" size="sm" onClick={handleAdd} icon={<FiPlus size={16} />}>
                Шинэ хэрэглэгч
              </Button>
            }
          >
            <Table
              columns={columns}
              data={users}
              loading={loading}
              actions={(u) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<FiEdit2 size={14} />}
                    onClick={() => handleEdit(u)}
                  >
                    Засах
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<FiTrash2 size={14} />}
                    onClick={() => handleDelete(u.id || '')}
                    disabled={u.id === currentUser?.id}
                  >
                    Устгах
                  </Button>
                </div>
              )}
            />
          </Card>

          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingUser(null);
            }}
            title={editingUser ? 'Хэрэглэгч засах' : 'Шинэ хэрэглэгч'}
            footer={
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  variant="primary"
                  onClick={handleSave}
                >
                  Хадгалах
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingUser(null);
                  }}
                >
                  Цуцлах
                </Button>
              </div>
            }
          >
            <div className="form-group">
              <label>Бүтэн нэр</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Бүтэн нэр оруулна уу"
              />
            </div>
            <div className="form-group">
              <label>Имэйл</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Имэйл оруулна уу"
              />
            </div>
            <div className="form-group">
              <label>Утас</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Утасны дугаар оруулна уу"
              />
            </div>
            {!editingUser && (
              <div className="form-group">
                <label>Нууц үг</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Нууц үг оруулна уу"
                />
              </div>
            )}
            <div className="form-group">
              <label>Эрх</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: (e.target.value as 'admin' | 'user') })}
              >
                <option value="user">Хэрэглэгч</option>
                <option value="admin">Админ</option>
              </select>
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
};
