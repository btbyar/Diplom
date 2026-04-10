import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { partsAPI } from '../services/api';
import type { Part } from '../types';
import { FiSearch, FiFilter, FiShoppingCart, FiCheck } from 'react-icons/fi';
import { useCartStore } from '../store';
import './PartsPage.css';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

export const PartsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

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
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [partId]: false }));
    }, 2000);
  };

  return (
    <div className="client-parts-page">
      <div className="page-header">
        <div className="container">
          <h1>Сэлбэгийн каталог</h1>
          <p>Бүх төрлийн машины баталгаат сэлбэгүүд</p>
        </div>
      </div>

      <div className="container parts-container">
        <aside className="parts-sidebar">
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
            <div className="loading-state">Сэлбэгүүдийг уншиж байна...</div>
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
                  <div key={partId} className="part-card">
                    <div className="part-image">
                      {part.imageUrl ? (
                        <img src={`${API_BASE}${part.imageUrl}`} alt={part.name} />
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
                        onClick={() => handleAddToCart(part)}
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
                )})}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};
