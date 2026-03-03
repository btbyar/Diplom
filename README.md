# Автомашины Засварын Төвийн Цаг Захиалах Систем

Энэ нь React Vite + Node.js/Express-ээр хийсэн цаг захиалах админ системийн фуллстэк веб сайт юм.

## Features

- **Admin Dashboard** - Захиалга болон үйлчилгээ удирдлага
- **Цаг захиалах систем** - Захиалгын CRUD операции
- **Үйлчилгээ удирдлага** - Засварын төрөл болон үнэ удирдлага
- **Статистик** - Захиалгын тайлан
- **Authentication** - Нэвтрэх систем
- **Responsive Design** - Мобайл дээр сайн ажилладаг

## Ажиллуулах арга

### Frontend (React Vite)

```bash
# Dependencies суулгах
npm install

# Development server эхлүүлэх
npm run dev

# Build
npm run build
```

Frontend нь `http://localhost:5173`-д ажиллана.

### Backend (Node.js/Express)

```bash
# backend папка руу орох
cd backend

# Dependencies суулгах
npm install

# Development server эхлүүлэх
npm run dev

# Build
npm run build
```

Backend нь `http://localhost:3000`-д ажиллана.

## Demo хаяг

**Имэйл:** admin@gmail.com
**Нууц үг:** admin123

## Папка структур

```
.
├── src/
│   ├── pages/           # Pages (Login, AdminDashboard)
│   ├── components/      # React components
│   ├── store/          # Zustand state management
│   ├── services/       # API service layer
│   ├── styles/         # CSS styles
│   ├── types/          # TypeScript types
│   └── App.tsx
├── backend/
│   ├── src/
│   │   ├── routes/     # API routes
│   │   ├── models/     # Database models
│   │   ├── middleware/ # Express middleware
│   │   └── server.ts   # Express server
│   └── package.json
└── package.json
```

## Технологи

**Frontend:**
- React 18
- Vite
- TypeScript
- Zustand (State management)
- React Router
- Axios

**Backend:**
- Node.js
- Express
- TypeScript
- MongoDB (суулгахаар)
- JWT Authentication

## API Endpoints

### Auth
- `POST /api/auth/login` - Нэвтрэх
- `POST /api/auth/logout` - Гарах
- `GET /api/auth/me` - Идэвхтэй хэрэглэгч

### Bookings
- `GET /api/bookings` - Бүх захиалга
- `GET /api/bookings/:id` - Нэг захиалга
- `POST /api/bookings` - Шинэ захиалга
- `PUT /api/bookings/:id` - Захиалга засах
- `DELETE /api/bookings/:id` - Захиалга устгах

### Services
- `GET /api/services` - Бүх үйлчилгээ
- `GET /api/services/:id` - Нэг үйлчилгээ
- `POST /api/services` - Шинэ үйлчилгээ
- `PUT /api/services/:id` - Үйлчилгээ засах
- `DELETE /api/services/:id` - Үйлчилгээ устгах

## Дараагийн алхамууд

1. **MongoDB холболт** - Database суулгаж холбох
2. **JWT Authentication** - Бат бөхтэй нэвтрэх систем
3. **Booking system** - Өмнөөс захиалах арга
4. **Email notifications** - Имэйлээр мессеж илгээх
5. **Calendar view** - Календарийн харц
6. **User portal** - Хэрэглэгчийн үйлчилгээ

## Ажиллахад туслах

Асуултаа байвал холбоогдоорой!
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
