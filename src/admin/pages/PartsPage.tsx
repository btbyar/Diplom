import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiImage, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useAdminAuthStore } from '../../store';
import { partsAPI, uploadAPI } from '../../services/api';
import type { Part } from '../../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Sidebar } from '../components/Sidebar';
import { Table } from '../components/Table';
import { TopBar } from '../components/TopBar';
import '../styles/Layout.css';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

export const PartsPage = () => {
  const navigate = useNavigate();
  const { user } = useAdminAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    partNumber: '',
    category: 'Ерөнхий',
    brand: 'Бүх марк',
    price: 0,
    quantity: 0,
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (!user) navigate('/login');
    else loadParts();
  }, [user, navigate]);

  const loadParts = async () => {
    try {
      setLoading(true);
      const res = await partsAPI.getAll();
      setParts(res.data || []);
    } catch (err) {
      console.error('Error loading parts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPart(null);
    setImagePreview(null);
    setFormData({
      name: '',
      partNumber: '',
      category: 'Ерөнхий',
      brand: 'Бүх марк',
      price: 0,
      quantity: 0,
      description: '',
      imageUrl: '',
    });
    setShowModal(true);
  };

  const handleEdit = (part: Part) => {
    setEditingPart(part);
    setImagePreview(part.imageUrl ? `${API_BASE}${part.imageUrl}` : null);
    setFormData({
      name: part.name,
      partNumber: part.partNumber || '',
      category: part.category || 'Ерөнхий',
      brand: part.brand || 'Бүх марк',
      price: part.price,
      quantity: part.quantity,
      description: part.description || '',
      imageUrl: part.imageUrl || '',
    });
    setShowModal(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadAPI.uploadImage(file);
      const url = res.data.url;
      setFormData((prev) => ({ ...prev, imageUrl: url }));
      setImagePreview(`${API_BASE}${url}`);
    } catch (err) {
      console.error('Image upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const name = formData.name.trim();
    if (!name || Number.isNaN(formData.price) || formData.price <= 0 || formData.quantity < 0) return;

    try {
      const payload = {
        name,
        partNumber: formData.partNumber.trim(),
        category: formData.category.trim(),
        brand: formData.brand.trim(),
        price: formData.price,
        quantity: formData.quantity,
        description: formData.description.trim(),
        imageUrl: formData.imageUrl,
      };

      if (editingPart) {
        const id = editingPart._id || editingPart.id || '';
        const res = await partsAPI.update(id, payload);
        const updated = res.data;
        setParts(parts.map((p) => ((p._id === id || p.id === id) ? updated : p)));
      } else {
        const res = await partsAPI.create(payload);
        setParts([...parts, res.data]);
      }

      setShowModal(false);
      setEditingPart(null);
      setImagePreview(null);
    } catch (err) {
      console.error('Error saving part:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Та итгэлтэй байна уу?')) return;
    try {
      await partsAPI.delete(id);
      setParts(parts.filter((p) => p._id !== id && p.id !== id));
    } catch (err) {
      console.error('Error deleting part:', err);
    }
  };

  const columns = [
    {
      key: 'imageUrl' as const,
      label: 'Зураг',
      render: (val: any) =>
        val ? (
          <img
            src={`${API_BASE}${val}`}
            alt="part"
            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }}
          />
        ) : (
          <div style={{ width: 80, height: 80, background: '#f3f4f6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
            <FiImage size={24} />
          </div>
        ),
    },
    { key: 'partNumber' as const, label: 'Сэлбэгийн #', render: (val: any) => (val ? String(val) : '-') },
    { key: 'name' as const, label: 'Нэр' },
    { key: 'category' as const, label: 'Төрөл', render: (val: any) => (val ? String(val) : '-') },
    { key: 'brand' as const, label: 'Марк', render: (val: any) => (val ? String(val) : '-') },
    { key: 'price' as const, label: 'Үнэ', render: (val: any) => `₮${val}` },
    {
      key: 'quantity' as const,
      label: 'Үлдэгдэл',
      render: (val: any) => {
        const qty = Number(val);
        const color = qty === 0 ? '#ff4d4f' : qty <= 2 ? '#ffa940' : 'inherit';
        return <span style={{ color, fontWeight: 700 }}>{Number.isNaN(qty) ? '-' : qty}</span>;
      },
    },
  ];

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-layout-content">
        <TopBar title="Сэлбэгийн агуулах" />
        <main className="admin-main">
          <Card
            title="Сэлбэгүүд"
            headerAction={
              <Button variant="primary" size="sm" onClick={handleAdd} icon={<FiPlus size={16} />}>
                Шинэ сэлбэг
              </Button>
            }
          >
            <Table
              columns={columns}
              data={parts}
              loading={loading}
              emptyMessage="Сэлбэг бүртгэгдээгүй байна"
              actions={(part) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<FiEdit2 size={14} />}
                    onClick={() => handleEdit(part)}
                  >
                    Засах
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<FiTrash2 size={14} />}
                    onClick={() => handleDelete(part._id || part.id || '')}
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
              setEditingPart(null);
              setImagePreview(null);
            }}
            title={editingPart ? 'Сэлбэг засах' : 'Шинэ сэлбэг'}
            footer={
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="primary" onClick={handleSave}>
                  Хадгалах
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPart(null);
                    setImagePreview(null);
                  }}
                >
                  Цуцлах
                </Button>
              </div>
            }
          >
            {/* Image upload */}
            <div className="form-group">
              <label>Зураг</label>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '10px',
                }}
              >
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="preview"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 8,
                      border: '1px solid #e5e7eb',
                    }}
                  />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<FiImage size={14} />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? 'Байршуулж байна...' : imagePreview ? 'Зураг солих' : 'Зураг оруулах'}
                </Button>
              </div>
            </div>

            <div className="form-group">
              <label>Сэлбэгийн нэр</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Сэлбэгийн нэр оруулна уу"
              />
            </div>
            <div className="form-group">
              <label>Сэлбэгийн дугаар</label>
              <input
                type="text"
                value={formData.partNumber}
                onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                placeholder="Нэмэлт"
              />
            </div>
            <div className="form-group">
              <label>Төрөл</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Ерөнхий">Ерөнхий</option>
                <option value="Хөдөлгүүр">Хөдөлгүүр</option>
                <option value="Явах эд анги">Явах эд анги</option>
                <option value="Цахилгаан">Цахилгаан</option>
                <option value="Кузов">Кузов</option>
                <option value="Тос, шингэн">Тос, шингэн</option>
              </select>
            </div>
            <div className="form-group">
              <label>Марк</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="жишээ: Toyota"
              />
            </div>
            <div className="form-group">
              <label>Үнэ (₮)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label>Үлдэгдэл тоо</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Тайлбар</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Нэмэлт"
                style={{ minHeight: '80px' }}
              />
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
};
