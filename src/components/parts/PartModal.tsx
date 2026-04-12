import React, { useState } from 'react';
import { FiX, FiShoppingCart, FiMinus, FiPlus, FiCheck } from 'react-icons/fi';
import type { Part } from '../../types';
import './PartModal.css';

interface PartModalProps {
  part: Part | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (part: Part, quantity: number) => void;
}

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

export const PartModal: React.FC<PartModalProps> = ({ part, isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Reset quantity when new part opens
  React.useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen, part]);

  if (!isOpen || !part) return null;

  const handleAdd = () => {
    onAddToCart(part, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="part-modal-overlay" onClick={onClose} style={{ animation: 'fadeIn 0.2s ease-out forwards' }}>
      <div className="part-modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
        <button className="part-modal-close" onClick={onClose}>
          <FiX />
        </button>

        <div className="part-modal-grid">
          <div className="part-modal-image">
            {part.imageUrl ? (
              <img src={`${API_BASE}${part.imageUrl}`} alt={part.name} />
            ) : (
              <div className="no-image">Зураггүй</div>
            )}
          </div>
          
          <div className="part-modal-info">
            <span className="part-modal-brand">{part.brand || 'Бренд тодорхойгүй'}</span>
            <h2>{part.name}</h2>
            {part.partNumber && <p className="part-modal-number">Код: {part.partNumber}</p>}
            
            <div className="part-modal-price">
              ₮{part.price.toLocaleString()}
            </div>
            
            <div className="part-modal-desc">
              <p>{part.description || 'Дэлгэрэнгүй мэдээлэл ороогүй байна.'}</p>
            </div>
            
            <div className="part-modal-actions">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><FiMinus /></button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(10, quantity + 1))}><FiPlus /></button>
              </div>
              
              <button 
                className={`btn-add-to-cart-modal ${added ? 'added' : ''}`}
                onClick={handleAdd}
              >
                {added ? <><FiCheck /> Нэмэгдлээ</> : <><FiShoppingCart /> Сагсанд үүсгэх</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
