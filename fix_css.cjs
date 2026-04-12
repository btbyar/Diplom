const fs = require('fs');

// 1. SERVICES PAGE TSX
let servicesTsxPath = './src/pages/ServicesPage.tsx';
let servicesTsx = fs.readFileSync(servicesTsxPath, 'utf8');

const listBlockRegex = /<div className="services-list-view">[\s\S]*?<\/div>\s*<\/div>\s*\)\}\s*<\/div>/;
const newBlock = `<div className="services-grid">
            {services.map(service => {
              const svcId = service._id || service.id || '';
              return (
                <div key={svcId} className="service-card">
                  <div className="service-icon-wrap">
                    <FiSettings size={26} />
                  </div>
                  <div className="service-body">
                    <h3 className="service-title">{service.name}</h3>
                    <p className="service-desc">
                      {service.description || 'Дэлгэрэнгүй мэдээлэл ороогүй байна.'}
                    </p>
                    <Link
                      to={\`/book?service=\${svcId}\`}
                      className="service-detail-btn"
                    >
                      ЦАГ АВАХ
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>`;

servicesTsx = servicesTsx.replace(listBlockRegex, newBlock);
fs.writeFileSync(servicesTsxPath, servicesTsx, 'utf8');

// 2. SERVICES PAGE CSS
let servicesCssPath = './src/pages/ServicesPage.css';
let servicesCss = fs.readFileSync(servicesCssPath, 'utf8');

servicesCss = servicesCss.replace(/background: var\(--gradient-primary\);\s*-webkit-background-clip: text;\s*background-clip: text;\s*-webkit-text-fill-color: transparent;/g, "color: #ffffff;\n  text-transform: uppercase;\n  font-family: 'Outfit', 'Inter', sans-serif;");
servicesCss = servicesCss.replace(/text-shadow: [^;]+;/g, ""); // remove shadow from headers just in case
servicesCss = servicesCss.replace(/\.page-header::before \{[\s\S]*?pointer-events: none;\s*\}/, `.page-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}`);

// Inject services-grid CSS into ServicesPage.css
const gridStyles = `
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.service-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 28px 24px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.service-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(224, 93, 16, 0.06), transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}
.service-card:hover {
  border-color: rgba(224, 93, 16, 0.35);
  transform: translateY(-4px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
}
.service-card:hover::before {
  opacity: 1;
}
.service-icon-wrap {
  width: 52px;
  height: 52px;
  min-width: 52px;
  background: rgba(224, 93, 16, 0.15);
  border: 1px solid rgba(224, 93, 16, 0.3);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f08030;
  font-size: 1.3rem;
  transition: all 0.3s ease;
}
.service-card:hover .service-icon-wrap {
  background: rgba(224, 93, 16, 0.25);
  border-color: rgba(224, 93, 16, 0.5);
}
.service-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.service-title {
  font-family: 'Outfit', 'Inter', sans-serif;
  font-size: 0.92rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  color: #ffffff !important;
  margin: 0 0 8px 0;
}
.service-desc {
  font-size: 0.84rem;
  color: rgba(255, 255, 255, 0.72) !important;
  line-height: 1.6;
  margin: 0 0 18px 0;
  flex: 1;
}
.service-detail-btn {
  display: inline-block;
  background: linear-gradient(135deg, #e05d10, #f07820);
  color: #ffffff;
  font-family: 'Outfit', 'Noto Sans', 'Inter', sans-serif;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 8px 18px;
  border-radius: 4px;
  text-decoration: none;
  width: fit-content;
  transition: all 0.25s ease;
  box-shadow: 0 2px 10px rgba(224, 93, 16, 0.35);
}
.service-detail-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(224, 93, 16, 0.55);
  color: #fff;
}
@media (max-width: 900px) {
  .services-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .services-grid { grid-template-columns: 1fr; }
}
`;
servicesCss += gridStyles;
fs.writeFileSync(servicesCssPath, servicesCss, 'utf8');

// 3. PARTS PAGE CSS
let partsCssPath = './src/pages/PartsPage.css';
let partsCss = fs.readFileSync(partsCssPath, 'utf8');
partsCss = partsCss.replace(/background: var\(--gradient-primary\);\s*-webkit-background-clip: text;\s*background-clip: text;\s*-webkit-text-fill-color: transparent;/g, "color: #ffffff;\n  text-transform: uppercase;\n  font-family: 'Outfit', 'Inter', sans-serif;");
partsCss = partsCss.replace(/text-shadow: [^;]+;/g, ""); 
partsCss = partsCss.replace(/\.page-header::before \{[\s\S]*?pointer-events: none;\s*\}/, `.page-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}`);

const oldPartCardRegex = /\.part-card \{[\s\S]*?\.part-card:hover .part-image img \{[\s\S]*?\}/;
const homePartCard = `
.part-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  cursor: pointer;
}
.part-card::before {
  content: '';
  position: absolute;
  top: 0; left: -75%; width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.04), transparent);
  transform: skewX(-15deg);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 2;
}
.part-card:hover::before {
  animation: cardShimmer 0.7s ease forwards;
  opacity: 1;
}
@keyframes cardShimmer {
  0% { left: -75%; }
  100% { left: 150%; }
}
.part-card:hover {
  transform: translateY(-8px) scale(1.01);
  border-color: rgba(224, 93, 16, 0.4);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(224, 93, 16, 0.15), 0 0 30px rgba(224, 93, 16, 0.1);
}
.part-image {
  height: 200px;
  background: linear-gradient(145deg, #f8f8f8 0%, #efefef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 20px;
  position: relative;
}
.part-image img {
  width: 100%; height: 100%;
  object-fit: contain;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
}
.part-card:hover .part-image img { transform: scale(1.1) rotate(-1deg); }
`;
partsCss = partsCss.replace(oldPartCardRegex, homePartCard);

const btnAddCartRegex = /\.btn-add-cart \{[\s\S]*?\.part-card:hover \.btn-add-cart \{[\s\S]*?\}/;
const homeBtnAddCart = `
.btn-add-cart {
  width: 100%;
  background: rgba(224, 93, 16, 0.08);
  border: 1px solid rgba(224, 93, 16, 0.25);
  color: #f08030;
  padding: 12px;
  border-radius: 10px;
  font-family: 'Outfit', 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.03em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}
.btn-add-cart::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #e05d10, #f07820);
  opacity: 0;
  transition: opacity 0.25s ease;
}
.btn-add-cart:hover::before { opacity: 1; }
.btn-add-cart > * { position: relative; z-index: 1; }
.btn-add-cart:hover {
  border-color: transparent;
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(224, 93, 16, 0.45);
}
`;
partsCss = partsCss.replace(btnAddCartRegex, homeBtnAddCart);

partsCss = partsCss.replace(/background: rgba\(0, 240, 255, 0.1\);/g, "background: rgba(224, 93, 16, 0.1);");
partsCss = partsCss.replace(/rgba\(0, 240, 255, 0.3\)/g, "rgba(224, 93, 16, 0.3)");
fs.writeFileSync(partsCssPath, partsCss, 'utf8');

// 4. PROFILE PAGE CSS
let profileCssPath = './src/pages/ProfilePage.css';
let profileCss = fs.readFileSync(profileCssPath, 'utf8');
profileCss = profileCss.replace(/background: var\(--gradient-primary\);\s*-webkit-background-clip: text;\s*background-clip: text;\s*-webkit-text-fill-color: transparent;/g, "color: #ffffff;\n  text-transform: uppercase;\n  font-family: 'Outfit', 'Inter', sans-serif;");
profileCss = profileCss.replace(/\.profile-page::before \{[\s\S]*?pointer-events: none;\s*\}/, `.profile-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}`);
fs.writeFileSync(profileCssPath, profileCss, 'utf8');

// 5. BOOKING PAGE CSS
let bookingCssPath = './src/pages/BookingPage.css';
let bookingCss = fs.readFileSync(bookingCssPath, 'utf8');
bookingCss = bookingCss.replace(/\.booking-header h2 \{[\s\S]*?\}/, `.booking-header h2 {
  font-family: 'Outfit', 'Inter', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 12px;
  color: #ffffff;
  letter-spacing: -0.5px;
  text-transform: uppercase;
}`);
fs.writeFileSync(bookingCssPath, bookingCss, 'utf8');

console.log("ALL FILES FIXED DIRECTLY.");
