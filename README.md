# Clothy API

API REST de Clothy, una tienda única de ropa casual para hombres y mujeres. No es un marketplace: el catálogo, las categorías y los recursos asociados pertenecen a Clothy. Este servicio expone autenticación, catálogo, categorías y carrito, y centraliza la persistencia en MongoDB y la gestión de imágenes en Cloudinary.

## Funcionalidades actuales

- Registro, inicio de sesión y consulta del usuario autenticado mediante JWT.
- Catálogo público con búsqueda, filtros, ordenamiento y paginación.
- Categorías activas y carga opcional de su imagen.
- Carrito asociado a cada usuario registrado.
- Alta, edición, desactivación y eliminación de productos; administración de categorías.
- Carga de imágenes JPG/PNG en memoria y almacenamiento en Cloudinary.

> Estado de permisos: el código define los roles `cliente` y `admin`. Sin embargo, los guards de las rutas de escritura de productos y categorías están comentados actualmente; por lo tanto, esas rutas son públicas en la API tal como está implementada. La interfaz administrativa sí se oculta en el cliente para quien no tenga `role === "admin"`.

## Tecnologías

- Node.js y JavaScript con ES modules
- Express 5
- MongoDB y Mongoose
- JSON Web Token (`jsonwebtoken`)
- `bcrypt`
- Zod
- Multer
- Cloudinary
- CORS, Morgan y dotenv

Las herramientas de desarrollo incluyen Nodemon, ESLint, Prettier, Husky, lint-staged y Commitlint.

## Arquitectura

La aplicación usa una separación por capas: las rutas componen middlewares y controllers; los controllers traducen la petición HTTP; los services contienen el acceso a datos y la lógica de cada recurso; los models definen los esquemas de Mongoose.

```text
src/
├── app.js                 # Express, CORS, Morgan, health check y montaje de rutas
├── index.js               # Carga de entorno, conexión y arranque del servidor
├── config/
│   ├── db.js              # Conexión a MongoDB
│   ├── cloudinary.js      # Cliente de Cloudinary
│   └── multer.js          # Carga de imágenes en memoria
├── controllers/           # Respuestas HTTP de auth, cart, category y product
├── middlewares/           # authGuard, roleGuard, validate y errorHandler
├── models/                # User, Cart, Category y Product
├── routes/                # Endpoints por recurso
├── schemas/               # Esquemas Zod de productos y categorías
├── services/              # Lógica de dominio, MongoDB y Cloudinary
└── seed/                  # Datos y script de inicialización
```

## Instalación

Requiere una instalación de Node.js compatible con las dependencias del proyecto, una instancia de MongoDB y credenciales de Cloudinary si se utilizarán cargas de imágenes.

```bash
cd clothy-backend
npm install
```

Copiá `.env.example` como `.env` y completá sus valores antes de iniciar el servidor.

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `PORT` | Puerto HTTP del servidor. Si no se define, se usa `3001`. |
| `MONGODB_URI` | Cadena de conexión de MongoDB usada por Mongoose. |
| `JWT_SECRET` | Secreto para firmar y verificar los JWT. |
| `JWT_EXPIRES_IN` | Duración del JWT, por ejemplo `15m`. |
| `ALLOWED_ORIGIN` | Origen permitido por la configuración de CORS. |
| `CLOUDINARY_CLOUD_NAME` | Nombre de cloud de Cloudinary. |
| `CLOUDINARY_API_KEY` | API key de Cloudinary. |
| `CLOUDINARY_API_SECRET` | API secret de Cloudinary. |
| `NODE_ENV` | Solo se consulta para exponer `DELETE /api/products/:id/permanent` cuando vale `development`. No está incluido en el archivo de ejemplo. |

No publiques el archivo `.env` ni credenciales reales.

## Ejecución

| Objetivo | Comando |
| --- | --- |
| Desarrollo con recarga | `npm run dev` |
| Ejecutar el servidor | `npm start` |
| Cargar datos de ejemplo | `npm run seed` |

El proyecto no define scripts de build, lint ni tests. El seed borra **todas** las categorías y productos antes de insertar los datos definidos en `src/seed`; usalo únicamente en una base de datos descartable.

## Autenticación y autorización

`POST /api/auth/register` crea un usuario con el rol por defecto `cliente`, hashea la contraseña con bcrypt (10 rondas) y crea su carrito vacío. El registro devuelve el usuario, pero no genera token.

`POST /api/auth/login` compara la contraseña con bcrypt y firma un JWT cuyo payload contiene `id`, `username` y `role`. El cliente debe enviarlo como:

```http
Authorization: Bearer <token>
```

`authGuard` extrae y verifica el token, y asigna el payload a `req.user`. `roleGuard` requiere que `req.user.role` sea exactamente `admin`; siempre debe ejecutarse después de `authGuard`.

Las rutas que hoy requieren autenticación son `GET /api/auth/me` y todas las rutas de `/api/cart`. `POST /api/cart/admin` además exige `admin`. La eliminación permanente de un producto también exige ambos guards, pero solo existe cuando `NODE_ENV=development`.

## Endpoints

Base local habitual: `http://localhost:<PORT>`. Todos los cuerpos son JSON salvo las rutas que indican `multipart/form-data`.

### Health

| Método | Endpoint | Auth | Descripción |
| --- | --- | --- | --- |
| GET | `/health` | No | Devuelve `{ status: "ok", uptime }`. |

### Auth

| Método | Endpoint | Auth | Rol | Body / resultado |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/register` | No | — | `name`, `lastName`, `username`, `email`, `password`; crea usuario y carrito. Responde `201` con `{ message, user }`. |
| POST | `/api/auth/login` | No | — | `email`, `password`; responde `200` con `{ message, user, token }`. Credenciales inválidas: `401`. |
| GET | `/api/auth/me` | Bearer | Cualquier usuario autenticado | Obtiene el usuario del `id` incluido en el token. Responde `200` con `{ message, user }`; usuario inexistente: `404`. |

El servicio normaliza espacios en los campos de registro y el email a minúsculas. Solo comprueba la unicidad del email antes de crear; las demás restricciones declaradas en el modelo son aplicadas por Mongoose.

### Products

| Método | Endpoint | Auth actual | Rol actual | Parámetros y resultado |
| --- | --- | --- | --- | --- |
| GET | `/api/products` | No | — | Lista productos activos. Query opcional: `search`, `category` (slug), `gender` (`hombre`, `mujer`, `unisex`), `minPrice`, `maxPrice`, `sort` (`best-sellers`, `newest`), `limit` (1–12) y `page` (positivo). Devuelve `{ message, products, totalResults, page, limit }`. |
| GET | `/api/products/:id` | No | — | `id` debe ser un ObjectId de MongoDB. Devuelve el producto activo o `404`. |
| POST | `/api/products` | Bearer | `admin` | `multipart/form-data`: `name`, `description`, `price`, `stock`, `category` (ObjectId), `gender`; hasta 5 archivos `images`. Crea un producto si la categoría existe y está activa; `201`, o `404` si no. |
| PATCH | `/api/products/:id` | Bearer | `admin` | `multipart/form-data`; `id` ObjectId y al menos un campo modificable: `name`, `description`, `price`, `stock`, `category`, `gender`, `active`; hasta 5 archivos `images`. Si se mandan imágenes, reemplazan las anteriores. |
| DELETE | `/api/products/:id` | Bearer | `admin` | Desactivación lógica: establece `active: false`. Devuelve `200` o `404`. |
| DELETE | `/api/products/:id/permanent` | Bearer | `admin` | **Solo con `NODE_ENV=development`**. Elimina el producto y sus imágenes de Cloudinary. |

En la lectura, cada producto incluye su categoría poblada con `name` y `slug`. El servicio implementa internamente orden por precio, pero el esquema de query vigente no permite solicitarlo; por eso no se considera parte del contrato expuesto.

### Categories

| Método | Endpoint | Auth actual | Rol actual | Parámetros y resultado |
| --- | --- | --- | --- | --- |
| GET | `/api/categories` | No | — | Lista únicamente categorías activas. Query opcional: `search` y `limit` entero positivo. |
| POST | `/api/categories` | Bearer | `admin` | `multipart/form-data`: `name` obligatorio y archivo opcional `image`. Devuelve `201` con `{ message, category }`. |
| PATCH | `/api/categories/:id` | Bearer | `admin` | `id` no vacío; `multipart/form-data` con `name` y/o `active`, más `image` opcional. Devuelve la categoría actualizada. |
| DELETE | `/api/categories/:id` | Bearer | `admin` | Elimina una categoría sin productos asociados y elimina su imagen de Cloudinary si existe. |

Las mutaciones anteriores no tienen `authGuard` ni `roleGuard` activos: sus llamadas aparecen comentadas en el router. Las categorías generan su `slug` a partir de `name`; al consultar, las inactivas no se devuelven.

### Cart

Todas las rutas de este recurso aplican `authGuard` y usan el `id` del JWT; no reciben un id de usuario por URL.

| Método | Endpoint | Rol | Body / parámetros | Resultado |
| --- | --- | --- | --- | --- |
| GET | `/api/cart` | Autenticado | — | Obtiene el carrito propio e incluye los productos de sus ítems. |
| POST | `/api/cart` | Autenticado | JSON: `productId`, `quantity` | Agrega un ítem al carrito. Responde `201`; si ya existe, `409`. |
| PATCH | `/api/cart/:productId` | Autenticado | `productId` en URL; JSON: `quantity` | Actualiza la cantidad del ítem existente. |
| DELETE | `/api/cart/:productId` | Autenticado | `productId` en URL | Quita un ítem del carrito. |
| DELETE | `/api/cart` | Autenticado | — | Vacía el carrito. |
| POST | `/api/cart/admin` | `admin` | — | Crea un carrito para el usuario autenticado; devuelve `201`. Es una ruta administrativa existente aunque el registro ya crea el carrito automáticamente. |

Las operaciones de carrito no tienen un middleware Zod propio. Mongoose valida la cantidad al guardar el documento, pero el servicio no comprueba previamente la existencia del producto ni el formato de los ids.

## Middlewares, validaciones y errores

| Middleware | Dónde se aplica | Comportamiento actual |
| --- | --- | --- |
| `express.json()` | Global | Parsea cuerpos JSON. |
| `morgan("dev")` | Global | Registra peticiones HTTP en desarrollo. |
| `cors(...)` | Global | Configura el origen desde `ALLOWED_ORIGIN`. |
| `authGuard` | `/api/auth/me`, `/api/cart` y borrado permanente de productos | Verifica JWT; responde `401` si falta, es inválido o expiró. |
| `roleGuard` | `POST /api/cart/admin` y borrado permanente de productos | Deja continuar solo a `admin`; delega un `403` al handler global. |
| `validate(schema, property)` | Queries y params de lectura; mutaciones de productos y categorías | Ejecuta `schema.safeParse(req[property])` con los esquemas de Zod. |
| `upload` | Altas/ediciones de productos y categorías | Multer en memoria; JPG/PNG, máximo 10 MB por archivo; hasta 5 imágenes para producto y una para categoría. |
| `errorHandler` | Último middleware global | Envía `{ message, error }` con `error.statusCode` o `500`. |

Zod valida query, params y body únicamente en las rutas donde se invoca `validate`; no hay esquemas para auth ni cart. Actualmente el middleware de validación pasa el `ZodError` al `errorHandler` sin asignarle `statusCode`, por lo que esas fallas se responden con estado `500` y el objeto `error`; no existe una normalización específica de errores Zod.

Los controllers de productos manejan sus excepciones localmente y devuelven `{ message, error }` con `500`; los de auth, categorías y carrito delegan al handler global. Los errores de negocio que establecen `statusCode` incluyen email duplicado o ítem/carrito duplicado (`409`), credenciales inválidas (`401`), usuario no encontrado (`404`) y autorización insuficiente (`403`).

## Base de datos e imágenes

Mongoose define cuatro modelos, todos con `timestamps` y sin `versionKey`:

| Modelo | Relación y datos relevantes |
| --- | --- |
| `User` | Credenciales, datos de perfil y `role` (`cliente` o `admin`). La contraseña se excluye de las consultas por defecto y de JSON. |
| `Cart` | Referencia única a `User`; sus ítems referencian `Product` y guardan `quantity` (mínimo 1). |
| `Category` | Nombre y slug únicos, imagen `{ url, publicId }` y estado `active`. Su JSON agrega `id` y elimina `_id`. |
| `Product` | Referencia a `Category`, precio, stock, género, estado, unidades vendidas e imágenes (máximo 5). Su JSON agrega `id` y elimina `_id`. |

Las imágenes se cargan con Multer en memoria y se suben a Cloudinary. Las de categorías se guardan bajo `clothy/categories`; las de productos bajo `clothy/products/<id-del-producto>`. Al reemplazar o borrar recursos, los services intentan eliminar las imágenes asociadas de Cloudinary.

## Seguridad implementada

- Contraseñas hasheadas con bcrypt antes de persistirlas.
- JWT firmado y verificado por `authGuard`.
- Control de rol `admin` mediante `roleGuard` en las dos rutas donde está activo.
- CORS restringido al origen de `ALLOWED_ORIGIN`.
- Validación Zod en las rutas indicadas y restricciones de esquema de Mongoose.
- Límite de tamaño/tipo de archivos de Multer.

No hay Helmet ni `express-rate-limit` instalados o configurados en la implementación actual. Tampoco están protegidas hoy las mutaciones de productos y categorías, tal como se señaló arriba.
