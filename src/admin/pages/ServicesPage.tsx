import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '../../store';
import { servicesAPI } from '../../services/api';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import type { Service } from '../../types';
import '../styles/Layout.css';

export const ServicesPage = () => {
  const navigate = useNavigate();
  const { user } = useAdminAuthStore();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 0,
  });

  useEffect(() => {
    if (!user) navigate('/login');
    else loadServices();
  }, [user, navigate]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await servicesAPI.getAll();
      setServices(res.data || []);
    } catch (err) {
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingService(null);
    setFormData({ name: '', description: '', price: 0, duration: 0 });
    setShowModal(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.duration) return;
    try {
      if (editingService) {
        await servicesAPI.update(editingService._id || editingService.id || '', formData);
        setServices(services.map(s =>
          (s._id === editingService._id || s.id === editingService.id)
            ? { ...s, ...formData }
            : s
        ));
      } else {
        const res = await servicesAPI.create(formData);
        setServices([...services, res.data]);
      }
      setShowModal(false);
      setEditingService(null);
      setFormData({ name: '', description: '', price: 0, duration: 0 });
    } catch (err) {
      console.error('Error saving service:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Та итгэлтэй байна уу?')) return;
    try {
      await servicesAPI.delete(id);
      setServices(services.filter(s => s._id !== id && s.id !== id));
    } catch (err) {
      console.error('Error deleting service:', err);
    }
  };

  const columns = [
    { key: 'name' as const, label: 'Нэр' },
    { key: 'description' as const, label: 'Тайлбар' },
    { key: 'price' as const, label: 'Үнэ', render: (val: any) => `₮${val}` },
    { key: 'duration' as const, label: 'Хугацаа (минут)' },
  ];

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-layout-content">
        <TopBar title="Үйлчилгээ удирдах" />
        <main className="admin-main">
          <Card
            title="Үйлчилгээнүүд"
            headerAction={
              <Button variant="primary" size="sm" onClick={handleAdd} icon={<FiPlus size={16} />}>
                Шинэ үйлчилгээ
              </Button>
            }
          >
            <Table
              columns={columns}
              data={services}
              loading={loading}
              actions={(service) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<FiEdit2 size={14} />}
                    onClick={() => handleEdit(service)}
                  >
                    Засах
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<FiTrash2 size={14} />}
                    onClick={() => handleDelete(service._id || service.id || '')}
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
              setEditingService(null);
            }}
            title={editingService ? 'Үйлчилгээ засах' : 'Шинэ үйлчилгээ'}
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
                    setEditingService(null);
                  }}
                >
                  Цуцлах
                </Button>
              </div>
            }
          >
            <div className="form-group">
              <label>Үйлчилгээний нэр</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Үйлчилгээний нэр оруулна уу"
              />
            </div>
            <div className="form-group">
              <label>Тайлбар</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Тайлбар оруулна уу"
                style={{ minHeight: '80px' }}
              />
            </div>
            <div className="form-group">
              <label>Үнэ (₮)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label>Хугацаа (минут)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) })}
                placeholder="0"
              />
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
};
