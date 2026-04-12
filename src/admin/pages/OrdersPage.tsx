import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAdminAuthStore } from '../../store';
import { ordersAPI } from '../../services/api';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { FiEdit2 } from 'react-icons/fi';
import type { Order } from '../../types';
import '../styles/Layout.css';

export const OrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useAdminAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [statusMenu, setStatusMenu] = useState({
    status: 'pending',
    paymentStatus: 'pending'
  });

  useEffect(() => {
    if (!user) navigate('/admin/login');
    else loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await ordersAPI.getAll();
      setOrders(res.data || []);
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setStatusMenu({
      status: order.status,
      paymentStatus: order.paymentStatus
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingOrder) return;

    try {
      const id = editingOrder._id || editingOrder.id || '';
      await ordersAPI.updateStatus(id, statusMenu);
      loadData();
      setShowModal(false);
      setEditingOrder(null);
      toast.success('Захиалгын төлөв шинэчлэгдлээ');
    } catch (err: any) {
      console.error('Error saving order:', err);
      toast.error(err.response?.data?.error || 'Хадгалахад алдаа гарлаа');
    }
  };

  const columns = [
    {
      key: 'createdAt' as const,
      label: 'Огноо',
      render: (val: any) => new Date(val).toLocaleDateString()
    },
    {
      key: 'userId' as const,
      label: 'Хэрэглэгч',
      render: (val: any) => typeof val === 'object' && val ? `${val.name} (${val.phone})` : val
    },
    {
      key: 'items' as const,
      label: 'Сэлбэгүүд',
      render: (items: any[]) => items.map(i => `${i.name} x${i.quantity}`).join(', ')
    },
    {
      key: 'totalAmount' as const,
      label: 'Дүн',
      render: (val: number) => `₮${val.toLocaleString()}`
    },
    {
      key: 'status' as const,
      label: 'Төлөв',
      render: (val: any) => {
        const orderMap: Record<string, string> = {
          'pending': 'Хүлээгдэж буй',
          'processing': 'Боловсруулж байна',
          'shipped': 'Хүргэлтэнд гарсан',
          'delivered': 'Хүргэгдсэн',
          'cancelled': 'Цуцлагдсан'
        };
        return orderMap[val] || val;
      }
    },
    {
      key: 'paymentStatus' as const,
      label: 'Төлбөр',
      render: (val: any) => val === 'paid' ? 'Төлөгдсөн' : 'Хүлээгдэж байна'
    },
  ];

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-layout-content">
        <TopBar title="Сэлбэгийн захиалгууд" />
        <main className="admin-main">
          <Card title="Сүүлийн захиалгууд">
            <Table
              columns={columns}
              data={orders}
              loading={loading}
              actions={(order) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<FiEdit2 size={14} />}
                    onClick={() => handleEdit(order)}
                  >
                    Засах
                  </Button>
                </div>
              )}
            />
          </Card>

          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingOrder(null);
            }}
            title="Захиалгын төлөв өөрчлөх"
            footer={
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="primary" onClick={handleSave}>
                  Хадгалах
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingOrder(null);
                  }}
                >
                  Цуцлах
                </Button>
              </div>
            }
          >
            {editingOrder && (
              <div style={{ marginBottom: '20px' }}>
                <p><strong>Хүлээн авах:</strong> {editingOrder.deliveryMethod === 'pickup' ? 'Засварын төвөөс' : 'Хүргэлт'}</p>
                {editingOrder.deliveryMethod === 'delivery' && (
                  <p><strong>Хүргүүлэх хаяг:</strong> {editingOrder.shippingAddress}</p>
                )}
                <p><strong>Утас:</strong> {editingOrder.phone}</p>
                <p><strong>Төлбөрийн хэлбэр:</strong> {editingOrder.paymentMethod === 'byl' ? 'Byl Систем' : editingOrder.paymentMethod}</p>
              </div>
            )}
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Захиалгын төлөв</label>
                <select
                  value={statusMenu.status}
                  onChange={(e) => setStatusMenu({ ...statusMenu, status: e.target.value })}
                >
                  <option value="pending">Хүлээгдэж буй</option>
                  <option value="processing">Боловсруулж байна</option>
                  <option value="shipped">Хүргэлтэнд гарсан</option>
                  <option value="delivered">Хүргэгдсэн</option>
                  <option value="cancelled">Цуцлагдсан</option>
                </select>
              </div>
              <div className="form-group">
                <label>Төлбөрийн төлөв</label>
                <select
                  value={statusMenu.paymentStatus}
                  onChange={(e) => setStatusMenu({ ...statusMenu, paymentStatus: e.target.value })}
                >
                  <option value="pending">Хүлээгдэж буй</option>
                  <option value="paid">Төлөгдсөн</option>
                </select>
              </div>
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
};
