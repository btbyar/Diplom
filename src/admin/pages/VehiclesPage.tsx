import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiPlus, FiTrash2, FiTruck } from 'react-icons/fi';
import { useAuthStore } from '../../store';
import { vehiclesAPI, usersAPI } from '../../services/api';
import type { Vehicle, User } from '../../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Sidebar } from '../components/Sidebar';
import { Table } from '../components/Table';
import { TopBar } from '../components/TopBar';
import '../styles/Layout.css';

export const VehiclesPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [formData, setFormData] = useState({
        ownerId: '',
        plateNumber: '',
        make: '',
        modelName: '',
        year: new Date().getFullYear(),
        color: '',
        vin: '',
        notes: '',
    });

    useEffect(() => {
        if (!user) navigate('/login');
        else {
            loadData();
        }
    }, [user, navigate]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [vRes, uRes] = await Promise.all([
                vehiclesAPI.getAll(),
                usersAPI.getAll()
            ]);
            setVehicles(vRes.data || []);
            setUsers(uRes.data || []);
        } catch (err) {
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingVehicle(null);
        setFormData({
            ownerId: '',
            plateNumber: '',
            make: '',
            modelName: '',
            year: new Date().getFullYear(),
            color: '',
            vin: '',
            notes: '',
        });
        setShowModal(true);
    };

    const handleEdit = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
        setFormData({
            ownerId: vehicle.ownerId ? (typeof vehicle.ownerId === 'string' ? vehicle.ownerId : (vehicle.ownerId as User)._id || (vehicle.ownerId as User).id || '') : '',
            plateNumber: vehicle.plateNumber,
            make: vehicle.make,
            modelName: vehicle.modelName,
            year: vehicle.year || new Date().getFullYear(),
            color: vehicle.color || '',
            vin: vehicle.vin || '',
            notes: vehicle.notes || '',
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        const plate = formData.plateNumber.trim();
        if (!plate || !formData.make.trim() || !formData.modelName.trim()) {
            alert('Улсын дугаар, марк, загвар заавал бөглөнө үү.');
            return;
        }

        try {
            const payload: Partial<Vehicle> = {
                plateNumber: plate,
                make: formData.make.trim(),
                modelName: formData.modelName.trim(),
                year: formData.year,
                color: formData.color.trim(),
                vin: formData.vin.trim(),
                notes: formData.notes.trim(),
            };

            // Since API uses ownerId as user ref
            if (formData.ownerId) {
                (payload as any).ownerId = formData.ownerId;
            }

            if (editingVehicle) {
                const id = editingVehicle._id || editingVehicle.id || '';
                const res = await vehiclesAPI.update(id, payload);
                const updated = res.data;
                setVehicles(vehicles.map((v) => ((v._id === id || v.id === id) ? updated : v)));
            } else {
                const res = await vehiclesAPI.create(payload);
                setVehicles([res.data, ...vehicles]);
            }

            setShowModal(false);
            setEditingVehicle(null);
        } catch (err: any) {
            console.error('Error saving vehicle:', err);
            alert(err.response?.data?.error || 'Хадгалахад алдаа гарлаа');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Энэ машиныг устгахдаа итгэлтэй байна уу?')) return;
        try {
            await vehiclesAPI.delete(id);
            setVehicles(vehicles.filter((v) => v._id !== id && v.id !== id));
        } catch (err) {
            console.error('Error deleting vehicle:', err);
        }
    };

    const columns = [
        { key: 'plateNumber' as const, label: 'Улсын Дугаар', render: (val: any) => <span style={{ fontWeight: 700, textTransform: 'uppercase' }}>{val}</span> },
        { key: 'make' as const, label: 'Марк' },
        { key: 'modelName' as const, label: 'Загвар' },
        { key: 'year' as const, label: 'Он', render: (val: any) => (val ? String(val) : '-') },
        {
            key: 'ownerId' as const,
            label: 'Эзэмшигч',
            render: (val: any) => {
                if (!val) return <span style={{ color: '#9ca3af' }}>Бүртгэлгүй</span>;
                const oName = typeof val === 'object' ? val.name : '';
                const oPhone = typeof val === 'object' ? val.phone : '';
                return oName ? `${oName} (${oPhone})` : 'Тодорхойгүй';
            }
        },
    ];

    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="admin-layout-content">
                <TopBar title="Машины бүртгэл" />
                <main className="admin-main">
                    <Card
                        title="Бүртгэлтэй Машинууд"
                        headerAction={
                            <Button variant="primary" size="sm" onClick={handleAdd} icon={<FiPlus size={16} />}>
                                Шинэ машин
                            </Button>
                        }
                    >
                        <Table
                            columns={columns}
                            data={vehicles}
                            loading={loading}
                            emptyMessage="Машин бүртгэгдээгүй байна"
                            actions={(vehicle) => (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        icon={<FiEdit2 size={14} />}
                                        onClick={() => handleEdit(vehicle)}
                                    >
                                        Засах
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        icon={<FiTrash2 size={14} />}
                                        onClick={() => handleDelete(vehicle._id || vehicle.id || '')}
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
                            setEditingVehicle(null);
                        }}
                        title={editingVehicle ? 'Машин засах' : 'Шинэ машин'}
                        footer={
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Button variant="primary" onClick={handleSave}>
                                    Хадгалах
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingVehicle(null);
                                    }}
                                >
                                    Цуцлах
                                </Button>
                            </div>
                        }
                    >
                        <div className="form-group">
                            <label>Улсын дугаар *</label>
                            <input
                                type="text"
                                value={formData.plateNumber}
                                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                                placeholder="жишээ: 1234УНБ"
                                style={{ textTransform: 'uppercase' }}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group">
                                <label>Марк *</label>
                                <input
                                    type="text"
                                    value={formData.make}
                                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                                    placeholder="Toyota"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Загвар *</label>
                                <input
                                    type="text"
                                    value={formData.modelName}
                                    onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                                    placeholder="Prius 30"
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group">
                                <label>Үйлдвэрлэсэн он</label>
                                <input
                                    type="number"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                                    placeholder="2010"
                                />
                            </div>
                            <div className="form-group">
                                <label>Өнгө</label>
                                <input
                                    type="text"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    placeholder="Сувдан цагаан"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Арлын дугаар (VIN)</label>
                            <input
                                type="text"
                                value={formData.vin}
                                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                                placeholder="JTDB..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Эзэмшигч</label>
                            <select
                                value={formData.ownerId}
                                onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                            >
                                <option value="">-- Бүртгэлгүй эсвэл шинэ харилцагч --</option>
                                {users.map(u => (
                                    <option key={u.id || u._id} value={u.id || u._id}>{u.name} ({u.phone})</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Нэмэлт тайлбар</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Машины тухай нэмэлт мэдээлэл..."
                                style={{ minHeight: '60px' }}
                            />
                        </div>
                    </Modal>
                </main>
            </div>
        </div>
    );
};
