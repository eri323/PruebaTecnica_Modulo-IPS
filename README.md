# Módulo de Seguimiento de Pacientes (IPS)

Prueba Técnica Full Stack 2026 — GoEcosystem (Digital Health).

Aplicación Full Stack que permite al personal asistencial de una IPS autenticarse, gestionar el CRUD de pacientes pendientes de atención (búsqueda, filtros y paginación) y visualizar un dashboard con indicadores operativos.

Construida con apoyo de Claude Code. Las decisiones de diseño, el criterio técnico y la validación final del funcionamiento son responsabilidad del autor.

---

## 1. Stack técnico

| Capa | Tecnología |
| --- | --- |
| Backend | Node.js + Express 5 |
| Frontend | React 19 + Vite + Tailwind CSS 4 |
| Base de datos | PostgreSQL |
| Autenticación | JWT (`jsonwebtoken`) + `bcrypt` para hash de contraseñas |
| Validación | `zod` (backend) |
| HTTP client | `axios` (frontend) |

## 2. Estructura del repositorio

```
PruebaTecnica_Modulo-IPS/
├── Backend/
│   ├── bd/
│   │   ├── script                  # DDL: tipos, tablas, índices, extensiones
│   │   ├── migracion_unaccent.sql  # Migración idempotente para BD ya creadas
│   │   └── seed.js                 # Carga de datos sintéticos desde el .xlsx
│   ├── src/
│   │   ├── config/db.js            # Pool de conexión a PostgreSQL (pg)
│   │   ├── controllers/            # auth, patient, eps, dashboard
│   │   ├── middleware/auth.middleware.js
│   │   ├── validators/             # Esquemas zod (auth, patient)
│   │   ├── routes/
│   │   └── index.js                # Punto de entrada de la API
│   └── .env.example
└── Frontend/
    ├── src/
    │   ├── pages/                  # Login, Dashboard, Pacientes
    │   ├── components/             # layout, pacientes, dashboard, ui
    │   ├── context/AuthContext.jsx # Sesión (token + usuario) en localStorage
    │   ├── hooks/                  # usePacientes, useDashboard, useEps, useDebounce
    │   ├── services/                # Cliente axios y servicios por recurso
    │   └── routes/ProtectedRoute.jsx
    └── .env.example
```

## 3. Requisitos previos

- Node.js 18 o superior
- PostgreSQL 14 o superior (con permisos para crear extensiones)
- El archivo `Datos_Sinteticos_Prueba_Full_Stack_Junior_2026.xlsx`, ubicado **un nivel por encima** de la raíz de este repositorio (`../Datos_Sinteticos_Prueba_Full_Stack_Junior_2026.xlsx`), tal como lo espera `Backend/bd/seed.js`.

## 4. Instalación

### 4.1 Backend

```bash
cd Backend
npm install
cp .env.example .env
```

Completar `.env`:

```
DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_bd
JWT_SECRET=reemplaza_por_un_secreto_largo_y_aleatorio
PORT=4000
```

### 4.2 Frontend

```bash
cd Frontend
npm install
cp .env.example .env
```

Completar `.env`:

```
VITE_API_URL=http://localhost:4000
```

## 5. Base de datos

### 5.1 Crear el esquema

Con la base de datos ya creada en PostgreSQL, ejecutar el script de estructura:

```bash
psql -d <tu_base> -f Backend/bd/script
```

Este script crea los tipos `ENUM` (`rol_usuario`, `prioridad_paciente`, `estado_paciente`, `tipo_doc`), las tablas `eps`, `usuarios` y `pacientes`, las extensiones `unaccent`/`pg_trgm` y los índices de búsqueda.

> Si ya tienes una base creada con una versión anterior del script (sin búsqueda insensible a tildes), aplica además la migración idempotente:
> ```bash
> psql -d <tu_base> -f Backend/bd/migracion_unaccent.sql
> ```

### 5.2 Cargar datos sintéticos (seed)

```bash
cd Backend
npm run seed
```

El script `bd/seed.js`:
- Lee las hojas `Catalogos`, `Usuarios_Login` y `Pacientes` del archivo `.xlsx`.
- Inserta EPS y usuarios con `ON CONFLICT ... DO NOTHING` (re-ejecutable sin duplicar).
- Inserta pacientes con `ON CONFLICT (tipo_documento, documento) DO NOTHING`.
- Hashea las contraseñas demo con `bcrypt` antes de guardarlas — nunca se persiste texto plano.

## 6. Ejecución

```bash
# Terminal 1 — API
cd Backend
npm run dev        # http://localhost:4000

# Terminal 2 — Frontend
cd Frontend
npm run dev         # http://localhost:5173 (o el puerto que indique Vite)
```

## 7. Credenciales demo

| Usuario | Contraseña | Rol |
| --- | --- | --- |
| `admin.demo` | `Demo2026*` | ADMIN |
| `operador.demo` | `Demo2026*` | OPERADOR |

Provienen de la hoja `Usuarios_Login` del archivo de datos sintéticos y quedan hasheadas en BD tras el seed. Este proyecto no implementa restricciones distintas por rol: cualquier usuario activo tiene acceso completo al CRUD y al dashboard.

## 8. Modelo de datos

```mermaid
erDiagram
    EPS ||--o{ PACIENTES : atiende
    USUARIOS {
        serial usuario_id PK
        varchar usuario UK
        varchar nombre
        varchar password_hash
        enum rol
        boolean activo
    }
    EPS {
        varchar eps_codigo PK
        varchar eps_nombre
    }
    PACIENTES {
        serial paciente_id PK
        enum tipo_documento
        varchar documento UK
        varchar nombre_completo
        date fecha_nacimiento
        varchar genero
        varchar telefono
        varchar correo
        varchar eps_codigo FK
        varchar ciudad
        enum prioridad
        enum estado
        timestamp fecha_creacion
        timestamp fecha_actualizacion
    }
```

- `usuarios` no tiene relación con `pacientes`: la autenticación es independiente de la gestión clínica.
- `(tipo_documento, documento)` es único en `pacientes`: evita duplicar el mismo paciente con distintos IDs.
- `estado` por defecto es `'Pendiente'` al crear un paciente.
- `fecha_nacimiento` tiene un `CHECK (fecha_nacimiento <= CURRENT_DATE)` a nivel de BD, además de la validación en el backend.
- Búsqueda por nombre insensible a tildes vía `f_unaccent()` (envoltorio `IMMUTABLE` de `unaccent()`) + índice GIN con `pg_trgm`.

## 9. API REST

Todas las rutas salvo `/auth/login` requieren header `Authorization: Bearer <token>`.

### Auth

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/auth/login` | Valida `usuario`/`password`, devuelve `{ token, usuario }` (JWT expira en 8h) |
| GET | `/auth/me` | Devuelve el usuario autenticado a partir del token |

### Pacientes

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/patients` | Listado paginado. Query: `search`, `estado`, `prioridad`, `page`, `limit` |
| GET | `/patients/:id` | Detalle de un paciente |
| POST | `/patients` | Crea un paciente (`estado` opcional, por defecto `Pendiente`) |
| PUT | `/patients/:id` | Reemplazo completo (`estado` obligatorio) |
| DELETE | `/patients/:id` | Borrado físico (sin relaciones dependientes) |

### EPS

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/eps` | Catálogo completo, para poblar selects |

### Dashboard

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/dashboard` | `{ registrados, pendientes, en_atencion, atendidos, prioridad_alta }` |

## 10. Decisiones técnicas

- **Sesión en `localStorage`**: se eligió sobre memoria para que la sesión sobreviva a un refresh de página; el interceptor de axios limpia la sesión y redirige a `/login` ante un 401.
- **Búsqueda por nombre/documento en un solo query**: `nombre_completo` usa `f_unaccent()` + `ILIKE` con índice GIN (`pg_trgm`) para tolerar tildes; `documento` se compara directo por ser solo dígitos.
- **`PUT` exige `estado`**: a diferencia de `POST`, el esquema de edición no le da un default a `estado` para evitar que una edición sin ese campo resetee silenciosamente a `'Pendiente'` un paciente que ya estaba en atención.
- **Dashboard con un solo query agregado**: los 5 indicadores se calculan con `COUNT(*) FILTER (WHERE ...)` en una sola consulta en vez de 5 queries separados.
- **Mensajes de error homogéneos en login**: "usuario no existe", "usuario inactivo" y "contraseña incorrecta" devuelven el mismo mensaje genérico para evitar enumeración de usuarios.
- **Sin sistema de roles diferenciado**: `ADMIN`/`OPERADOR` se cargan y quedan disponibles en el JWT, pero no se usan para restringir permisos — está fuera del alcance definido para esta prueba.

## 11. Limitaciones conocidas

- No hay rate limiting ni protección contra fuerza bruta en `/auth/login`.
- El borrado de pacientes es físico (no hay soft delete ni auditoría de cambios).
- No se implementó refresh token: al expirar el JWT (8h) el usuario debe volver a iniciar sesión.
- El catálogo de EPS es de solo lectura desde la API (no hay endpoints de administración de EPS).
- No hay tests automatizados (unitarios ni de integración).
