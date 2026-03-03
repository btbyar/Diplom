import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useAuthStore } from '../../store';
import { partsAPI } from '../../services/api';
import type { Part } from '../../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Sidebar } from '../components/Sidebar';
import { Table } from '../components/Table';
import { TopBar } from '../components/TopBar';
import '../styles/Layout.css';

export const PartsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    partNumber: '',
    category: 'General',
    brand: 'All brands',
    price: 0,
    quantity: 0,
    description: '',
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
    setFormData({
      name: '',
      partNumber: '',
      category: 'General',
      brand: 'All brands',
      price: 0,
      quantity: 0,
      description: '',
    });
    setShowModal(true);
  };

  const handleEdit = (part: Part) => {
    setEditingPart(part);
    setFormData({
      name: part.name,
      partNumber: part.partNumber || '',
      category: part.category || 'General',
      brand: part.brand || 'All brands',
      price: part.price,
      quantity: part.quantity,
      description: part.description || '',
    });
    setShowModal(true);
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
    } catch (err) {
      console.error('Error saving part:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await partsAPI.delete(id);
      setParts(parts.filter((p) => p._id !== id && p.id !== id));
    } catch (err) {
      console.error('Error deleting part:', err);
    }
  };

  const columns = [
    { key: 'partNumber' as const, label: 'Part #', render: (val: any) => (val ? String(val) : '-') },
    { key: 'name' as const, label: 'Name' },
    { key: 'category' as const, label: 'Category', render: (val: any) => (val ? String(val) : '-') },
    { key: 'brand' as const, label: 'Brand', render: (val: any) => (val ? String(val) : '-') },
    { key: 'price' as const, label: 'Price', render: (val: any) => `₮${val}` },
    {
      key: 'quantity' as const,
      label: 'Stock',
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
        <TopBar title="Parts Inventory" />
        <main className="admin-main">
          <Card
            title="Spare Parts"
            headerAction={
              <Button variant="primary" size="sm" onClick={handleAdd} icon={<FiPlus size={16} />}>
                New Part
              </Button>
            }
          >
            <Table
              columns={columns}
              data={parts}
              loading={loading}
              emptyMessage="No parts yet"
              actions={(part) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<FiEdit2 size={14} />}
                    onClick={() => handleEdit(part)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<FiTrash2 size={14} />}
                    onClick={() => handleDelete(part._id || part.id || '')}
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
              setEditingPart(null);
            }}
            title={editingPart ? 'Edit Part' : 'New Part'}
            footer={
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="primary" onClick={handleSave}>
                  Save
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPart(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            }
          >
            <div className="form-group">
              <label>Part Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter part name"
              />
            </div>
            <div className="form-group">
              <label>Part Number</label>
              <input
                type="text"
                value={formData.partNumber}
                onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Filters"
              />
            </div>
            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Toyota"
              />
            </div>
            <div className="form-group">
              <label>Price (₮)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional"
                style={{ minHeight: '80px' }}
              />
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
};

