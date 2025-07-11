# Instrucciones para recrear el proyecto

## 1. Crear nuevo proyecto Bolt
- Ir a bolt.new
- Seleccionar: React + TypeScript + Tailwind CSS

## 2. Instalar dependencias
```bash
npm add @supabase/supabase-js@latest lucide-react@latest
```

## 3. Copiar archivos en este orden:

### Tipos y configuración:
1. `src/types/index.ts`
2. `tailwind.config.js` 
3. `index.html`

### Utilidades:
4. `src/utils/validation.ts`
5. `src/utils/storage.ts`
6. `src/utils/database.ts`
7. `src/lib/supabase.ts`

### Componentes:
8. `src/components/AdminLogin.tsx`
9. `src/components/Navigation.tsx`
10. `src/components/DatabaseStatus.tsx`
11. `src/components/Statistics.tsx`
12. `src/components/CheckoutForm.tsx`

### Archivos principales:
13. `src/App.tsx`
14. `src/main.tsx`

## 4. Configurar Supabase (opcional)
- Hacer clic en "Connect to Supabase"
- Crear tabla `card_data` con la migración SQL

## 5. Probar funcionalidad
- Checkout form
- Admin login (password: admin123)
- Estadísticas
- Base de datos

## Estructura completa del proyecto:
```
proyecto/
├── src/
│   ├── components/
│   │   ├── AdminLogin.tsx
│   │   ├── CheckoutForm.tsx
│   │   ├── DatabaseStatus.tsx
│   │   ├── Navigation.tsx
│   │   └── Statistics.tsx
│   ├── lib/
│   │   └── supabase.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── database.ts
│   │   ├── storage.ts
│   │   └── validation.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

## Funcionalidades incluidas:
- ✅ Formulario de checkout con validación
- ✅ Timer de 10 minutos
- ✅ Procesamiento de 30 segundos + error
- ✅ Sistema de admin (triple clic + password)
- ✅ Panel de estadísticas
- ✅ Base de datos local + Supabase
- ✅ Diseño responsive
- ✅ Tema The Home Depot