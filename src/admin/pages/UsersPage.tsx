import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
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
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
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
      const res = await usersAPI.getAll();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Error loading users:', err);
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
    if (!window.confirm('Are you sure?')) return;
    try {
      await usersAPI.delete(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const columns = [
    { key: 'name' as const, label: 'Name' },
    { key: 'email' as const, label: 'Email' },
    { key: 'phone' as const, label: 'Phone' },
    { key: 'role' as const, label: 'Role' },
  ];

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-layout-content">
        <TopBar title="Users Management" />
        <main className="admin-main">
          <Card 
            title="Users" 
            headerAction={
              <Button variant="primary" size="sm" onClick={handleAdd} icon={<FiPlus size={16} />}>
                New User
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
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    icon={<FiTrash2 size={14} />}
                    onClick={() => handleDelete(u.id || '')}
                    disabled={u.id === currentUser?.id}
                  >
                    Delete
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
            title={editingUser ? 'Edit User' : 'New User'}
            footer={
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button 
                  variant="primary"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingUser(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            }
          >
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter email"
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
            {!editingUser && (
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Enter password"
                />
              </div>
            )}
            <div className="form-group">
              <label>Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: (e.target.value as 'admin' | 'user')})}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
};
