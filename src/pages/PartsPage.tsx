import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { partsAPI } from '../services/api';
import type { Part } from '../types';
import { FiSearch, FiFilter, FiShoppingCart, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCartStore } from '../store';
import { Skeleton } from '../components/ui/Skeleton';
import { PartModal } from '../components/parts/PartModal';
import './PartsPage.css';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '').replace(/\/$/, '') || 'http://localhost:3000';

const getImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${API_BASE}${cleanUrl}`;
};

export const PartsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  const { addItem } = useCartStore();

  const categories = ['Бүх төрөл', 'Хөдөлгүүр', 'Явах эд анги', 'Цахилгаан', 'Кузов', 'Тос, шингэн', 'Ерөнхий'];

  useEffect(() => {
    const fetchParts = async () => {
      try {
        setLoading(true);
        const res = await partsAPI.getAll();
        setParts(res.data || []);
      } catch (error) {
        console.error('Error fetching parts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchParts();
  }, []);

  // Update URL params when state changes
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory && selectedCategory !== 'Бүх төрөл') params.category = selectedCategory;
    setSearchParams(params);
  }, [searchTerm, selectedCategory, setSearchParams]);

  const filteredParts = parts.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (part.partNumber && part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    // Category mapping logic could be more complex depending on actual data
    const matchesCategory = !selectedCategory || selectedCategory === 'Бүх төрөл' ||
      (part.category && part.category.toLowerCase().includes(selectedCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (part: Part) => {
    const partId = part._id || part.id || '';
    addItem({
      id: partId,
      name: part.name,
      price: part.price,
      quantity: 1,
      imageUrl: part.imageUrl
    });
    setAddedItems(prev => ({ ...prev, [partId]: true }));
    toast.success(`${part.name} сагсанд нэмэгдлээ`);
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [partId]: false }));
    }, 2000);
  };

  const handleModalAddToCart = (part: Part, quantity: number) => {
    const partId = part._id || part.id || '';
    addItem({
      id: partId,
      name: part.name,
      price: part.price,
      quantity: quantity,
      imageUrl: part.imageUrl
    });
    toast.success(`${part.name} (${quantity}ш) сагсанд нэмэгдлээ`);
  };

  return (
    <div className="client-parts-page">
      <div className="page-header">
        <div className="container animate-slide-up">
          <h1>Сэлбэгийн каталог</h1>
          <p>Бүх төрлийн машины баталгаат сэлбэгүүд</p>
        </div>
      </div>

      <div className="container parts-container">
        <aside className="parts-sidebar animate-slide-up">
          <div className="filter-group">
            <h3 className="filter-title">
              <FiFilter /> Шүүлтүүр
            </h3>

            <div className="search-box">
              <input
                type="text"
                placeholder="Сэлбэг хайх..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="search-icon" />
            </div>

            <h4 className="filter-subtitle">Ангилал</h4>
            <ul className="category-list">
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    className={`category-btn ${selectedCategory === cat || (!selectedCategory && cat === 'Бүх төрөл') ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat === 'Бүх төрөл' ? '' : cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="parts-main">
          {loading ? (
            <div className="parts-grid">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} type="card" />
              ))}
            </div>
          ) : filteredParts.length === 0 ? (
            <div className="empty-state">
              <h3>Илэрц олдсонгүй</h3>
              <p>Та өөр түлхүүр үгээр хайж үзнэ үү.</p>
              <button
                className="btn-clear"
                onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
              >
                Шүүлтүүр цэвэрлэх
              </button>
            </div>
          ) : (
            <>
              <div className="results-header">
                <span>Нийт <strong>{filteredParts.length}</strong> илэрц</span>
              </div>
              <div className="parts-grid">
                {filteredParts.map(part => {
                  const partId = part._id || part.id || '';
                  return (
                    <div key={partId} className="part-card" onClick={() => setSelectedPart(part)} style={{ cursor: 'pointer' }}>
                      <div className="part-image">
                        {part.imageUrl ? (
                          <img src={getImageUrl(part.imageUrl)} alt={part.name} />
                        ) : (
                          <div className="no-image">Зураггүй</div>
                        )}
                      </div>
                      <div className="part-info">
                        <span className="part-brand">{part.brand || 'Бренд тодорхойгүй'}</span>
                        <h3 className="part-name">{part.name}</h3>
                        <div className="part-price">
                          <span className="price-value">₮{part.price.toLocaleString()}</span>
                        </div>
                        <button
                          className="btn-add-cart"
                          onClick={(e) => { e.stopPropagation(); handleAddToCart(part); }}
                          style={addedItems[partId] ? { background: 'var(--accent-secondary)' } : {}}
                        >
                          {addedItems[partId] ? (
                            <><FiCheck /> Нэмэгдлээ</>
                          ) : (
                            <><FiShoppingCart /> Сагсанд нэмэх</>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </main>
      </div>

      <PartModal 
        part={selectedPart}
        isOpen={!!selectedPart}
        onClose={() => setSelectedPart(null)}
        onAddToCart={handleModalAddToCart}
      />
    </div>
  );
};
