import { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import type { User } from '../../types';
import '../styles/UserManagement.css';

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'admin' | 'user';
}

const INITIAL_FORM_DATA: FormData = {
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'user',
};

const ERROR_MESSAGES = {
  LOAD: 'Хэрэглэгчид ачаалахад алдаа гарлаа',
  REQUIRED_FIELDS: 'Нэр болон утасны дугаар шаардлагатай',
  SAVE: 'Хэрэглэгч хадгалахад алдаа гарлаа',
  DELETE: 'Хэрэглэгч устгахад алдаа гарлаа',
};

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let result = users;

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (err: any) {
      console.error('Users load алдаа:', err);
      setError(ERROR_MESSAGES.LOAD);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user?: User) => {
    setError('');
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: '',
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData(INITIAL_FORM_DATA);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData(INITIAL_FORM_DATA);
    setError('');
  };

  const handleSaveUser = async () => {
    if (!formData.name || !formData.phone) {
      setError(ERROR_MESSAGES.REQUIRED_FIELDS);
      return;
    }

    // For new users, require email and password
    if (!editingUser && (!formData.email || !formData.password)) {
      setError('Шинэ хэрэглэгчийн эмэйл болон нууц үг шаардлагатай');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (editingUser) {
        // Update existing user
        await usersAPI.update(editingUser.id, {
          name: formData.name,
          phone: formData.phone,
          role: formData.role,
        });
        setUsers(
          users.map((u) =>
            u.id === editingUser.id
              ? { ...u, name: formData.name, phone: formData.phone, role: formData.role }
              : u
          )
        );
      } else {
        // Create new user
        const newUser = await usersAPI.create({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          password: formData.password,
        });
        setUsers([...users, newUser.data]);
      }

      handleCloseModal();
    } catch (err: any) {
      console.error('User save алдаа:', err);
      setError(ERROR_MESSAGES.SAVE);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setDeletingUserId(userId);
  };

  const confirmDeleteUser = async (userId: string) => {
    try {
      setLoading(true);
      setError('');
      await usersAPI.delete(userId);
      setUsers(users.filter((u) => u.id !== userId));
      setDeletingUserId(null);
    } catch (err: any) {
      console.error('User delete алдаа:', err);
      setError(ERROR_MESSAGES.DELETE);
      setDeletingUserId(null);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeletingUserId(null);
  };

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h2>Хэрэглэгчийн хянах</h2>
        <button onClick={() => handleOpenModal()} className="add-user-btn">
          + Шинэ хэрэглэгч
        </button>
      </div>

      <div className="user-search-filter">
        <div className="search-box">
          <input
            type="text"
            placeholder="Нэр, email хайх..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as 'all' | 'admin' | 'user')}
          className="filter-select"
        >
          <option value="all">Бүх</option>
          <option value="admin">Админ</option>
          <option value="user">Хэрэглэгч</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Ачаалж байна...</div>}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingUser ? 'Хэрэглэгч засах' : 'Шинэ хэрэглэгч нэмэх'}</h3>
            <div className="form-group">
              <label>Нэр</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="Хэрэглэгчийн нэр"
              />
            </div>
            {!editingUser && (
              <>
                <div className="form-group">
                  <label>Имэйл</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                    placeholder="example@email.com"
                  />
                </div>
                <div className="form-group">
                  <label>Нууц үг</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input"
                    placeholder="••••••••"
                  />
                </div>
              </>
            )}
            <div className="form-group">
              <label>Утасны дугаар</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input"
                placeholder="Утасны дугаар"
              />
            </div>
            <div className="form-group">
              <label>Үүрэг</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                className="input"
              >
                <option value="user">Хэрэглэгч</option>
                <option value="admin">Админ</option>
              </select>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="modal-actions">
              <button onClick={handleSaveUser} className="save-btn" disabled={loading}>
                Хадгалах
              </button>
              <button onClick={handleCloseModal} className="cancel-btn" disabled={loading}>
                Цуцлах
              </button>
            </div>
          </div>
        </div>
      )}

      {deletingUserId && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Хэрэглэгчийг устгах уу?</h3>
            <p>Та энэ хэрэглэгчийг устгахыг хүсэж байгаа юу? Үйлдэл буцаах боломжгүй.</p>
            <div className="modal-actions">
              <button
                onClick={() => confirmDeleteUser(deletingUserId)}
                className="delete-btn"
                disabled={loading}
              >
                Устгах
              </button>
              <button
                onClick={cancelDelete}
                className="cancel-btn"
                disabled={loading}
              >
                Цуцлах
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="users-container">
        {users.length === 0 ? (
          <div className="empty-message">Хэрэглэгч байхгүй</div>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ХЭРЭГЛЭГЧ</th>
                  <th>УТАС</th>
                  <th>ЭМЭ</th>
                  <th>ТӨРӨЛ</th>
                  <th>СТАТУС</th>
                  <th>ҮЙЛДЭЛ</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-name-cell">
                        <div className="user-avatar">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-name-info">
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.phone}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role === 'admin' ? 'Админ' : 'Хэрэглэгч'}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge active">Идэвхтэй</span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="action-btn edit-btn"
                        title="Засах"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="action-btn delete-btn"
                        title="Устгах"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
