# 🏛️ Diagramas de Arquitectura - TaskRewardPro

## 📐 Arquitectura General del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        CAPA DE PRESENTACIÓN                      │
│                         (Frontend - React)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐      │
│  │     Login     │  │   Register    │  │   Dashboard   │      │
│  │   (público)   │  │   (público)   │  │  (protegido)  │      │
│  └───────────────┘  └───────────────┘  └───────────────┘      │
│                                                                  │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐      │
│  │  TaskRegister │  │   Recompensas │  │    Ranking    │      │
│  │  (protegido)  │  │  (protegido)  │  │  (protegido)  │      │
│  └───────────────┘  └───────────────┘  └───────────────┘      │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              AuthContext (Estado Global)                 │   │
│  │  - user, login, register, logout                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           API Services (services/api.js)                 │   │
│  │  - Todas las llamadas HTTP al backend                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/REST (JSON)
                             │ Authorization: Bearer <token>
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                       CAPA DE APLICACIÓN                         │
│                    (Backend - Node.js/Express)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    RUTAS (Routes)                        │   │
│  │                                                          │   │
│  │  /api/auth/*        → authRoutes                        │   │
│  │  /api/tasks/*       → tareaRoutes                       │   │
│  │  /api/usuarios/*    → usuarioRoutes                     │   │
│  │  /api/recompensas/* → recompensaRoutes                  │   │
│  │  /api/rankings/*    → rankingRoutes                     │   │
│  │  /api/metas/*       → metaRoutes                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                             │                                    │
│                             ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   MIDDLEWARE                             │   │
│  │                                                          │   │
│  │  • authRequired      → Valida JWT token                 │   │
│  │  • requireRol        → Valida rol del usuario           │   │
│  │  • upload            → Maneja subida de archivos        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                             │                                    │
│                             ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  CONTROLADORES                           │   │
│  │                                                          │   │
│  │  • authController       → Login, Register, Me           │   │
│  │  • tareaController      → CRUD de Tareas                │   │
│  │  • submissionController → Gestión de Entregas           │   │
│  │  • usuarioController    → CRUD de Usuarios              │   │
│  │  • recompensaController → CRUD de Recompensas           │   │
│  │  • rankingController    → Gestión de Rankings           │   │
│  │  • metaController       → Gestión de Metas              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                             │                                    │
│                             ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    MODELOS (Mongoose)                    │   │
│  │                                                          │   │
│  │  • Usuario (base)    → Admin, Trabajador (discriminators)│  │
│  │  • Tarea             → Tareas del sistema               │   │
│  │  • Submission        → Entregas de trabajadores         │   │
│  │  • Recompensa        → Premios disponibles              │   │
│  │  • HistorialCanje    → Registro de canjes               │   │
│  │  • Meta              → Objetivos del equipo             │   │
│  │  • Ranking           → Posiciones de usuarios           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Mongoose ODM
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      CAPA DE PERSISTENCIA                        │
│                        (MongoDB Database)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Colecciones:                                                    │
│  • usuarios          → Todos los usuarios (con discriminator)   │
│  • tareas            → Tareas del sistema                       │
│  • submissions       → Entregas de tareas                       │
│  • recompensas       → Catálogo de premios                      │
│  • historialcanjes   → Log de canjes                            │
│  • metas             → Objetivos                                │
│  • rankings          → Clasificaciones                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      SISTEMA DE ARCHIVOS                         │
│                                                                  │
│  /uploads/submissions/   → Archivos de evidencia de tareas      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Diagrama de Flujo: Ciclo Completo de una Tarea

```
┌─────────────────────────────────────────────────────────────────┐
│                    FASE 1: CREACIÓN DE TAREA                     │
└─────────────────────────────────────────────────────────────────┘

   [ADMIN]
      │
      │ Completa formulario
      ▼
┌──────────────┐
│ TaskRegister │
│   (React)    │
└──────┬───────┘
       │ POST /api/tasks
       │ { title, description, points, dueDate }
       ▼
┌──────────────────┐
│ authRequired     │ ✓ Valida token JWT
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ requireRol(Admin)│ ✓ Valida rol = "Admin"
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ crearTarea()     │ • Crea documento en BD
│ (Controller)     │ • status: "Pendiente"
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│   Tarea Model    │ Guarda en MongoDB
└──────┬───────────┘
       │
       │ 201 Created
       ▼
   [Respuesta]
   { _id, title, description, points, status: "Pendiente" }


┌─────────────────────────────────────────────────────────────────┐
│                FASE 2: TRABAJADOR SUBE EVIDENCIA                 │
└─────────────────────────────────────────────────────────────────┘

   [TRABAJADOR]
      │
      │ Selecciona archivo (PDF, imagen)
      ▼
┌──────────────┐
│ Upload Form  │
│   (React)    │
└──────┬───────┘
       │ POST /api/tasks/:id/submit
       │ FormData { file: archivo.pdf }
       ▼
┌──────────────────────┐
│ authRequired         │ ✓ Valida token JWT
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│requireRol(Trabajador)│ ✓ Valida rol = "Trabajador"
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ upload.single("file")│ • Guarda en /uploads/submissions/
│  (Multer)            │ • Valida tipo y tamaño
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ submitTask()         │ • Elimina entregas previas
│ (Controller)         │ • Crea nuevo Submission
│                      │   - status: "Pendiente"
│                      │   - claimed: false
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Submission Model     │ Guarda en MongoDB
└──────┬───────────────┘
       │
       │ 201 Created
       ▼
   [Respuesta]
   { _id, task, user, status: "Pendiente", filePath }


┌─────────────────────────────────────────────────────────────────┐
│                 FASE 3: ADMIN REVISA Y DECIDE                    │
└─────────────────────────────────────────────────────────────────┘

   [ADMIN]
      │
      │ Ve lista de entregas pendientes
      ▼
┌──────────────────┐
│ GET /api/tasks/  │
│ :id/submissions  │
└──────┬───────────┘
       │ Lista de Submissions con status "Pendiente"
       ▼
   [ADMIN revisa archivo]
      │
      │ Decide: approve o reject
      │ Escribe feedback (opcional)
      ▼
┌──────────────────┐
│ Decision Form    │
│   (React)        │
└──────┬───────────┘
       │ PATCH /api/tasks/:taskId/submission/:subId/decision
       │ { action: "approve", feedback: "Excelente" }
       ▼
┌──────────────────────┐
│ authRequired         │ ✓ Valida token JWT
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ requireRol(Admin)    │ ✓ Valida rol = "Admin"
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ decideSubmission()   │ SI action = "approve":
│ (Controller)         │   • Submission.status = "Aprobada"
│                      │   • Tarea.status = "Completada"
│                      │ SI action = "reject":
│                      │   • Submission.status = "Rechazada"
│                      │   • Tarea.status = "Pendiente"
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Models actualizados  │ Guarda cambios en MongoDB
└──────┬───────────────┘
       │
       │ 200 OK
       ▼
   [Respuesta]
   { ok: true, submission: { status: "Aprobada", feedback } }


┌─────────────────────────────────────────────────────────────────┐
│                FASE 4: TRABAJADOR RECLAMA PUNTOS                 │
└─────────────────────────────────────────────────────────────────┘

   [TRABAJADOR]
      │
      │ Ve tarea con status "Aprobada"
      │ Botón: "Reclamar puntos"
      ▼
┌──────────────────┐
│ Claim Button     │
│   (React)        │
└──────┬───────────┘
       │ POST /api/tasks/:taskId/claim
       ▼
┌──────────────────────┐
│ authRequired         │ ✓ Valida token JWT
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│requireRol(Trabajador)│ ✓ Valida rol = "Trabajador"
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ claimPoints()        │ 1. Busca Submission aprobada
│ (Controller)         │ 2. Valida claimed = false
│                      │ 3. Obtiene puntos de Tarea
│                      │ 4. Suma puntos a Usuario
│                      │ 5. Marca Submission.claimed = true
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Usuario.points       │ Usuario.points += Tarea.points
│ actualizado          │ Ejemplo: 0 → 100
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Submission.claimed   │ claimed: true
│ actualizado          │
└──────┬───────────────┘
       │
       │ 200 OK
       ▼
   [Respuesta]
   { ok: true, claimed: true, message: "Puntos reclamados" }


┌─────────────────────────────────────────────────────────────────┐
│                  FASE 5: CANJE DE RECOMPENSA                     │
└─────────────────────────────────────────────────────────────────┘

   [TRABAJADOR]
      │
      │ Ve sus puntos: 100
      │ Ve recompensas disponibles
      ▼
┌──────────────────────┐
│ GET /api/recompensas │
└──────┬───────────────┘
       │ Lista de recompensas
       │ [
       │   { nombre: "Almuerzo", puntosRequeridos: 75 },
       │   { nombre: "Día libre", puntosRequeridos: 200 }
       │ ]
       ▼
   [TRABAJADOR selecciona "Almuerzo" (75 pts)]
      │
      ▼
┌────────────────────────┐
│ POST /api/canjes       │ (endpoint a implementar)
│ { recompensaId }       │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ Validar puntos         │ Usuario.points >= Recompensa.puntosRequeridos
│                        │ 100 >= 75 ✓
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ Restar puntos          │ Usuario.points = 100 - 75 = 25
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ Crear HistorialCanje   │ {
│                        │   usuario: userId,
│                        │   recompensa: recompensaId,
│                        │   fechaCanje: Date.now()
│                        │ }
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│ Actualizar Recompensa  │ cantidadCanjes++
└──────┬─────────────────┘
       │
       │ 201 Created
       ▼
   [Respuesta]
   { ok: true, puntosRestantes: 25 }
```

---

## 🗄️ Diagrama de Base de Datos (Relaciones)

```
┌────────────────────────────────────────────────────────────────┐
│                      USUARIOS                                   │
│  _id, name, email, password (hash), rol, points, timestamps    │
└─────┬──────────────────────────────────────────┬───────────────┘
      │ createdBy                                 │ user
      │ (1:N)                                     │ (1:N)
      │                                           │
      ▼                                           ▼
┌─────────────────┐                    ┌─────────────────────────┐
│     TAREAS      │                    │      SUBMISSIONS        │
│  _id            │                    │  _id                    │
│  title          │◄───────────────────│  task (ref: Tarea)      │
│  description    │        task        │  user (ref: Usuario)    │
│  dueDate        │       (N:1)        │  filePath               │
│  points         │                    │  originalName           │
│  attachments[]  │                    │  mimeType               │
│  createdBy      │                    │  size                   │
│  status         │                    │  status                 │
└─────┬───────────┘                    │  feedback               │
      │                                │  claimed                │
      │ tareas[]                       │  timestamps             │
      │ (N:M)                          └─────────────────────────┘
      │
      ▼
┌─────────────────┐
│      METAS      │
│  _id            │
│  metaId         │
│  nombreMeta     │
│  descripcion    │
│  estado         │
│  tareas[]       │ (array de ObjectId)
└─────────────────┘


┌────────────────────────────────────────────────────────────────┐
│                      USUARIOS                                   │
└─────┬──────────────────────────────────────┬───────────────────┘
      │ usuario                               │ usuarios[]
      │ (1:N)                                 │ (N:M)
      │                                       │
      ▼                                       ▼
┌─────────────────────┐              ┌─────────────────┐
│  HISTORIAL CANJES   │              │    RANKINGS     │
│  _id                │              │  _id            │
│  historialId        │              │  rankingId      │
│  usuario            │              │  usuarios[]     │
│  recompensa         │              │  posicion       │
│  fechaCanje         │              │  fechaActualizada│
└─────┬───────────────┘              └─────────────────┘
      │ recompensa
      │ (N:1)
      │
      ▼
┌─────────────────────┐
│    RECOMPENSAS      │
│  _id                │
│  nombre             │
│  descripcion        │
│  puntosRequeridos   │
│  cantidadCanjes     │
│  limiteCanjes       │
│  fechaLimiteCanje   │
└─────────────────────┘


HERENCIA CON DISCRIMINATORS:

┌─────────────────────┐
│      USUARIO        │
│  (base model)       │
│  - name             │
│  - email            │
│  - password         │
│  - rol              │
│  - points           │
└──────┬──────────────┘
       │
       ├─────────────────────┐
       │                     │
       ▼                     ▼
┌─────────────┐      ┌──────────────────┐
│    ADMIN    │      │   TRABAJADOR     │
│ (extends)   │      │   (extends)      │
│             │      │   + cargo        │
│             │      │   + puntos       │
└─────────────┘      └──────────────────┘

Nota: Ambos se guardan en la colección "usuarios"
con campo __t que indica el discriminator
```

---

## 🔐 Diagrama de Flujo: Autenticación JWT

```
┌──────────────────────────────────────────────────────────────┐
│                     FLUJO DE REGISTRO                         │
└──────────────────────────────────────────────────────────────┘

[Usuario] → Completa formulario
            (name, email, password, rol)
              │
              ▼
         ┌──────────┐
         │  React   │ POST /api/auth/register
         │  Form    │ { name, email, password, rol }
         └────┬─────┘
              │
              ▼
     ┌────────────────┐
     │ authController │
     │   .register()  │
     └────┬───────────┘
          │
          │ 1. Valida datos
          │ 2. Verifica email no existe
          ▼
     ┌──────────────┐
     │    bcrypt    │ hash(password, 10)
     │   .hash()    │ → "$2b$10$...hashed..."
     └────┬─────────┘
          │
          ▼
     ┌──────────────┐
     │   Usuario    │ create({
     │   .create()  │   name, email,
     │              │   password: hash,
     │              │   rol, points: 0
     │              │ })
     └────┬─────────┘
          │
          ▼
     ┌──────────────┐
     │     JWT      │ sign({
     │   .sign()    │   id, email, rol
     │              │ }, SECRET, { expiresIn: "7d" })
     └────┬─────────┘
          │
          │ token = "eyJhbGciOi..."
          ▼
     ┌──────────────┐
     │   Response   │ 201 Created
     │              │ {
     │              │   token: "eyJhbGci...",
     │              │   user: { id, name, email, rol, points }
     │              │ }
     └────┬─────────┘
          │
          ▼
     ┌──────────────────┐
     │  localStorage    │ setItem("token", token)
     │                  │
     └────┬─────────────┘
          │
          ▼
     ┌──────────────────┐
     │   AuthContext    │ setUser(user)
     │                  │
     └────┬─────────────┘
          │
          ▼
     [ Redirige a /app/dashboard ]


┌──────────────────────────────────────────────────────────────┐
│                     FLUJO DE LOGIN                            │
└──────────────────────────────────────────────────────────────┘

[Usuario] → Ingresa credenciales
            (email, password)
              │
              ▼
         ┌──────────┐
         │  React   │ POST /api/auth/login
         │  Form    │ { email, password }
         └────┬─────┘
              │
              ▼
     ┌────────────────┐
     │ authController │
     │    .login()    │
     └────┬───────────┘
          │
          │ 1. Busca usuario por email
          ▼
     ┌──────────────┐
     │   Usuario    │ findOne({ email })
     │  .findOne()  │
     └────┬─────────┘
          │
          │ user encontrado
          ▼
     ┌──────────────┐
     │    bcrypt    │ compare(password, user.password)
     │  .compare()  │ → true/false
     └────┬─────────┘
          │
          │ SI coincide
          ▼
     ┌──────────────┐
     │     JWT      │ sign({
     │   .sign()    │   id, email, rol
     │              │ }, SECRET, { expiresIn: "7d" })
     └────┬─────────┘
          │
          │ token generado
          ▼
     ┌──────────────┐
     │   Response   │ 200 OK
     │              │ {
     │              │   token: "eyJhbGci...",
     │              │   user: { id, name, email, role, points }
     │              │ }
     └────┬─────────┘
          │
          ▼
     ┌──────────────────┐
     │  localStorage    │ setItem("token", token)
     └────┬─────────────┘
          │
          ▼
     ┌──────────────────┐
     │   AuthContext    │ setUser(user)
     └────┬─────────────┘
          │
          ▼
     [ Redirige a /app/dashboard ]


┌──────────────────────────────────────────────────────────────┐
│              FLUJO DE PETICIÓN AUTENTICADA                    │
└──────────────────────────────────────────────────────────────┘

[Usuario autenticado] → Hace acción (ej: crear tarea)
                           │
                           ▼
                    ┌──────────────┐
                    │    React     │ POST /api/tasks
                    │              │ Headers: {
                    │              │   Authorization: "Bearer eyJh..."
                    │              │ }
                    └────┬─────────┘
                         │
                         ▼
                ┌─────────────────┐
                │  authRequired   │ (middleware)
                │  (middleware)   │
                └────┬────────────┘
                     │
                     │ 1. Lee header Authorization
                     │ 2. Extrae token
                     ▼
                ┌──────────────┐
                │     JWT      │ verify(token, SECRET)
                │  .verify()   │
                └────┬─────────┘
                     │
                     │ SI válido: payload = { id, email, rol }
                     ▼
                ┌──────────────┐
                │  req.user    │ = payload
                │              │ { id, email, rol }
                └────┬─────────┘
                     │
                     │ next()
                     ▼
                ┌──────────────────┐
                │ requireRol(Admin)│ (middleware)
                └────┬─────────────┘
                     │
                     │ Compara req.user.rol === "Admin"
                     │
                     │ SI coincide: next()
                     ▼
                ┌──────────────┐
                │ crearTarea() │ (controller)
                │              │ req.user.id disponible
                └──────────────┘


Token JWT decodificado:

HEADER:
{
  "alg": "HS256",
  "typ": "JWT"
}

PAYLOAD:
{
  "id": "507f1f77bcf86cd799439011",
  "email": "juan@example.com",
  "rol": "Admin",
  "iat": 1706097600,
  "exp": 1706702400
}

SIGNATURE:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  JWT_SECRET
)
```

---

## 📁 Estructura de Archivos del Proyecto

```
TaskRewardPro/
│
├── Back/                              # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                  # Conexión a MongoDB
│   │   │
│   │   ├── controllers/               # Lógica de negocio
│   │   │   ├── authController.js      # Login, register, me
│   │   │   ├── historialCanjeController.js
│   │   │   ├── metaController.js
│   │   │   ├── rankingController.js
│   │   │   ├── recompensaController.js
│   │   │   ├── submissionController.js # Entregas de tareas
│   │   │   ├── tareaController.js     # CRUD de tareas
│   │   │   └── usuariocontroller.js
│   │   │
│   │   ├── middleware/                # Funciones intermedias
│   │   │   ├── auth.js                # authRequired (valida JWT)
│   │   │   ├── rolmiddleware.js       # requireRol (valida rol)
│   │   │   └── upload.js              # Multer config (archivos)
│   │   │
│   │   ├── models/                    # Esquemas de Mongoose
│   │   │   ├── admin.js               # Discriminator de Usuario
│   │   │   ├── historialCanje.js
│   │   │   ├── meta.js
│   │   │   ├── ranking.js
│   │   │   ├── recompensa.js
│   │   │   ├── submission.js          # Entregas de tareas
│   │   │   ├── tarea.js
│   │   │   ├── trabajador.js          # Discriminator de Usuario
│   │   │   └── usuario.js             # Modelo base
│   │   │
│   │   ├── routes/                    # Definición de endpoints
│   │   │   ├── authRoutes.js          # /api/auth/*
│   │   │   ├── historialCanjeRoutes.js
│   │   │   ├── metaRoutes.js
│   │   │   ├── rankingRoutes.js
│   │   │   ├── recompensaRoutes.js
│   │   │   ├── tareaRoutes.js         # /api/tasks/*
│   │   │   └── usuarioRoutes.js
│   │   │
│   │   └── index.js                   # Entry point del servidor
│   │
│   ├── uploads/                       # Archivos subidos
│   │   └── submissions/               # Evidencias de tareas
│   │
│   ├── .env                           # Variables de entorno
│   ├── package.json                   # Dependencias backend
│   └── index.js                       # Alias a src/index.js
│
├── Front/                             # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/                # Componentes reutilizables
│   │   │   ├── ProtectedRoute.jsx     # Guard de rutas privadas
│   │   │   └── Sidebar.jsx            # Menú lateral
│   │   │
│   │   ├── context/                   # Estado global
│   │   │   └── AuthContext.jsx        # Autenticación global
│   │   │
│   │   ├── pages/                     # Páginas/Vistas
│   │   │   ├── Dashboard.jsx          # Panel principal
│   │   │   ├── Login.jsx              # Inicio de sesión
│   │   │   ├── Register.jsx           # Registro de usuarios
│   │   │   └── TaskRegister.jsx       # Crear tarea
│   │   │
│   │   ├── services/                  # Lógica de API
│   │   │   └── api.js                 # Todas las llamadas HTTP
│   │   │
│   │   ├── App.jsx                    # Componente raíz, rutas
│   │   ├── main.jsx                   # Entry point de React
│   │   └── styles.css                 # Estilos globales
│   │
│   ├── public/                        # Archivos estáticos
│   │   ├── logo-taskreward.png
│   │   └── ...
│   │
│   ├── .env                           # Variables de entorno
│   ├── index.html                     # HTML base
│   ├── package.json                   # Dependencias frontend
│   └── vite.config.js                 # Configuración de Vite
│
├── public/                            # Imágenes del README
│   ├── logo-taskreward.png
│   ├── VistaAdmin.png
│   └── ...
│
└── README.md                          # Documentación principal
```

---

## 🎭 Diagrama de Roles y Permisos

```
┌──────────────────────────────────────────────────────────────┐
│                         ROLES                                 │
└──────────────────────────────────────────────────────────────┘

                    ┌─────────────┐
                    │   USUARIO   │
                    │   (base)    │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
      ┌─────────┐    ┌─────────┐    ┌─────────┐
      │  ADMIN  │    │  LIDER  │    │TRABAJADOR│
      └─────────┘    └─────────┘    └─────────┘


┌──────────────────────────────────────────────────────────────┐
│                PERMISOS POR ROL                               │
└──────────────────────────────────────────────────────────────┘

╔══════════════════════════════════════════════════════════════╗
║                         ADMIN                                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                               ║
║  TAREAS:                                                      ║
║    ✅ POST   /api/tasks              → Crear tarea           ║
║    ✅ GET    /api/tasks              → Listar todas          ║
║    ✅ PUT    /api/tasks/:id          → Actualizar tarea      ║
║    ✅ DELETE /api/tasks/:id          → Eliminar tarea        ║
║                                                               ║
║  ENTREGAS:                                                    ║
║    ✅ GET    /api/tasks/:id/submissions → Ver entregas       ║
║    ✅ PATCH  /api/tasks/.../decision    → Aprobar/Rechazar   ║
║                                                               ║
║  USUARIOS:                                                    ║
║    ✅ POST   /api/usuarios           → Crear usuario         ║
║    ✅ GET    /api/usuarios           → Listar usuarios       ║
║    ✅ PUT    /api/usuarios/:id       → Actualizar usuario    ║
║    ✅ DELETE /api/usuarios/:id       → Eliminar usuario      ║
║                                                               ║
║  RECOMPENSAS:                                                 ║
║    ✅ POST   /api/recompensas        → Crear recompensa      ║
║    ✅ GET    /api/recompensas        → Listar recompensas    ║
║    ✅ PUT    /api/recompensas/:id    → Actualizar recompensa ║
║    ✅ DELETE /api/recompensas/:id    → Eliminar recompensa   ║
║                                                               ║
║  METAS Y RANKINGS:                                            ║
║    ✅ Acceso completo a CRUD                                  ║
║                                                               ║
╚══════════════════════════════════════════════════════════════╝


╔══════════════════════════════════════════════════════════════╗
║                       TRABAJADOR                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                               ║
║  TAREAS:                                                      ║
║    ✅ GET    /api/tasks/user/list    → Ver mis tareas        ║
║    ❌ POST   /api/tasks              → Crear tarea           ║
║    ❌ PUT    /api/tasks/:id          → Actualizar tarea      ║
║    ❌ DELETE /api/tasks/:id          → Eliminar tarea        ║
║                                                               ║
║  ENTREGAS:                                                    ║
║    ✅ POST   /api/tasks/:id/submit   → Subir evidencia       ║
║    ✅ GET    /api/tasks/:id/submission → Ver mi entrega      ║
║    ✅ POST   /api/tasks/:id/claim    → Reclamar puntos       ║
║    ❌ GET    /api/tasks/:id/submissions → Ver todas          ║
║    ❌ PATCH  /api/tasks/.../decision → Aprobar/Rechazar      ║
║                                                               ║
║  RECOMPENSAS:                                                 ║
║    ✅ GET    /api/recompensas        → Ver recompensas       ║
║    ✅ POST   /api/canjes (futuro)    → Canjear puntos        ║
║    ❌ POST   /api/recompensas        → Crear recompensa      ║
║    ❌ PUT    /api/recompensas/:id    → Actualizar            ║
║    ❌ DELETE /api/recompensas/:id    → Eliminar              ║
║                                                               ║
║  RANKINGS:                                                    ║
║    ✅ GET    /api/rankings           → Ver posiciones        ║
║                                                               ║
╚══════════════════════════════════════════════════════════════╝


╔══════════════════════════════════════════════════════════════╗
║                   LIDER (En desarrollo)                       ║
╠══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Funcionalidad planeada:                                      ║
║    - Ver tareas de su equipo                                 ║
║    - Aprobar entregas de su equipo                           ║
║    - Ver reportes de su equipo                               ║
║    - Crear metas para su equipo                              ║
║                                                               ║
╚══════════════════════════════════════════════════════════════╝


Implementación en código:

router.post(
  "/api/tasks",
  authRequired,           // ← Todos los usuarios autenticados
  requireRol("Admin"),    // ← Solo Admin
  crearTarea
)

router.post(
  "/api/tasks/:id/submit",
  authRequired,           // ← Todos los usuarios autenticados
  requireRol("Trabajador"), // ← Solo Trabajador
  upload.single("file"),
  submitTask
)
```

---

## 🔄 Diagrama de Estados: Tarea y Submission

```
┌──────────────────────────────────────────────────────────────┐
│                  ESTADOS DE TAREA                             │
└──────────────────────────────────────────────────────────────┘

    ┌───────────────┐
    │   PENDIENTE   │ ← Estado inicial al crear
    └───────┬───────┘
            │
            │ Trabajador sube evidencia
            ▼
    ┌───────────────┐
    │   PENDIENTE   │ ← Esperando aprobación
    └───────┬───────┘
            │
            ├──────────────────┐
            │                  │
            │ Admin aprueba    │ Admin rechaza
            ▼                  ▼
    ┌───────────────┐  ┌───────────────┐
    │  COMPLETADA   │  │   PENDIENTE   │
    └───────────────┘  └───────────────┘
                               │
                               │ Trabajador reenvía
                               ▼
                       ┌───────────────┐
                       │   PENDIENTE   │
                       └───────────────┘


┌──────────────────────────────────────────────────────────────┐
│              ESTADOS DE SUBMISSION (Entrega)                  │
└──────────────────────────────────────────────────────────────┘

            ┌───────────────┐
            │  (No existe)  │ ← Sin submission
            └───────┬───────┘
                    │
                    │ Trabajador sube archivo
                    ▼
            ┌───────────────┐
            │   PENDIENTE   │ ← Esperando revisión admin
            └───────┬───────┘
                    │
                    ├──────────────────┐
                    │                  │
                    │ Admin aprueba    │ Admin rechaza
                    ▼                  ▼
            ┌───────────────┐  ┌───────────────┐
            │   APROBADA    │  │   RECHAZADA   │
            │               │  │               │
            │ claimed:false │  └───────────────┘
            └───────┬───────┘          │
                    │                  │
                    │ Trabajador       │ Trabajador
                    │ reclama puntos   │ sube nuevo archivo
                    ▼                  │
            ┌───────────────┐          │
            │   APROBADA    │          │
            │               │          │
            │ claimed:true  │◄─────────┘
            └───────────────┘
                    │
                    │ (No puede volver a reclamar)
                    ▼
                  [FIN]


Estados de Submission:
• PENDIENTE  → Admin debe revisar
• APROBADA   → Admin aprobó, puntos disponibles para reclamar
• RECHAZADA  → Admin rechazó, trabajador puede reenviar

Campo adicional en APROBADA:
• claimed: false → Puntos NO reclamados aún
• claimed: true  → Puntos YA reclamados
```

---

## 📊 Diagrama de Secuencia Completo

```
┌──────────────────────────────────────────────────────────────┐
│   SECUENCIA: Trabajador completa tarea y obtiene puntos      │
└──────────────────────────────────────────────────────────────┘

Trabajador    Frontend      Backend       Middleware   Controller    Database
    │             │            │               │            │            │
    │ Login       │            │               │            │            │
    ├─────────────>│           │               │            │            │
    │             │ POST /api/auth/login       │            │            │
    │             ├────────────>│              │            │            │
    │             │            │ authController.login()     │            │
    │             │            ├───────────────────────────>│            │
    │             │            │               │            │ findOne    │
    │             │            │               │            ├───────────>│
    │             │            │               │            │<───────────┤
    │             │            │               │  bcrypt.compare()       │
    │             │            │               │  jwt.sign()             │
    │             │<───────────┼───────────────┼────────────┤            │
    │<────────────┤ { token }  │               │            │            │
    │             │            │               │            │            │
    │ Guarda token│            │               │            │            │
    │ en localStorage          │               │            │            │
    │             │            │               │            │            │
    ├─ Navega a lista de tareas                             │            │
    ├─────────────>│           │               │            │            │
    │             │ GET /api/tasks/user/list   │            │            │
    │             ├────────────>│              │            │            │
    │             │            ├─ authRequired ─>│          │            │
    │             │            │               │ verify JWT │            │
    │             │            │               │ req.user=payload        │
    │             │            │<──────────────┤            │            │
    │             │            ├─ requireRol(Trabajador) ──>│            │
    │             │            │               │<───────────┤            │
    │             │            │ obtenerTareasUsuario()     │            │
    │             │            ├───────────────────────────>│            │
    │             │            │               │            │ find tareas│
    │             │            │               │            ├───────────>│
    │             │            │               │            │<───────────┤
    │             │            │               │            │find submissions
    │             │            │               │            ├───────────>│
    │             │            │               │            │<───────────┤
    │             │<───────────┼───────────────┼────────────┤            │
    │<────────────┤ [tareas con mySubmission]  │            │            │
    │             │            │               │            │            │
    ├─ Selecciona tarea        │               │            │            │
    ├─ Sube archivo PDF        │               │            │            │
    ├─────────────>│           │               │            │            │
    │             │ POST /api/tasks/:id/submit │            │            │
    │             │ FormData(file)             │            │            │
    │             ├────────────>│              │            │            │
    │             │            ├─ authRequired ─>│          │            │
    │             │            │<──────────────┤            │            │
    │             │            ├─ requireRol(Trabajador) ──>│            │
    │             │            │<──────────────┤            │            │
    │             │            ├─ upload.single("file") ───>│            │
    │             │            │               │ Guarda archivo en disco │
    │             │            │               │ req.file={...}          │
    │             │            │<──────────────┤            │            │
    │             │            │ submitTask()  │            │            │
    │             │            ├───────────────────────────>│            │
    │             │            │               │            │ deleteMany │
    │             │            │               │            │ (prev sub) │
    │             │            │               │            ├───────────>│
    │             │            │               │            │<───────────┤
    │             │            │               │            │ create     │
    │             │            │               │            │ Submission │
    │             │            │               │            ├───────────>│
    │             │            │               │            │<───────────┤
    │             │            │               │            │ update     │
    │             │            │               │            │ Tarea      │
    │             │            │               │            ├───────────>│
    │             │            │               │            │<───────────┤
    │             │<───────────┼───────────────┼────────────┤            │
    │<────────────┤ 201 { submission }         │            │            │
    │             │            │               │            │            │
    │ "Entrega en revisión"    │               │            │            │
    │             │            │               │            │            │
    │             │            │               │            │            │
    ├─ [ADMIN APRUEBA] ────────────────────────────────────────────────┤
    │             │            │               │            │            │
Admin│            │            │               │            │            │
    │ Revisa      │            │               │            │            │
    ├─────────────>│           │               │            │            │
    │             │ PATCH /api/tasks/:taskId/submission/:subId/decision │
    │             │ { action: "approve" }      │            │            │
    │             ├────────────>│              │            │            │
    │             │            ├─ authRequired ─>│          │            │
    │             │            │<──────────────┤            │            │
    │             │            ├─ requireRol(Admin) ───────>│            │
    │             │            │<──────────────┤            │            │
    │             │            │ decideSubmission()         │            │
    │             │            ├───────────────────────────>│            │
    │             │            │               │            │ findOne    │
    │             │            │               │            │ Submission │
    │             │            │               │            ├───────────>│
    │             │            │               │            │<───────────┤
    │             │            │               │            │ update     │
    │             │            │               │            │ status:    │
    │             │            │               │            │ "Aprobada" │
    │             │            │               │            ├───────────>│
    │             │            │               │            │<───────────┤
    │             │            │               │            │ update     │
    │             │            │               │            │ Tarea      │
    │             │            │               │            │ status:    │
    │             │            │               │            │ "Completada"│
    │             │            │               │            ├───────────>│
    │             │            │               │            │<───────────┤
    │             │<───────────┼───────────────┼────────────┤            │
    │<────────────┤ 200 { ok: true }           │            │            │
    │             │            │               │            │            │
Trabajador        │            │               │            │            │
    │ Ve "Aprobada - Reclamar puntos"          │            │            │
    ├─────────────>│           │               │            │            │
    │             │ POST /api/tasks/:taskId/claim          │            │
    │             ├────────────>│              │            │            │
    │             │            ├─ authRequired ─>│          │            │
    │             │            │<──────────────┤            │            │
    │             │            ├─ requireRol(Trabajador) ──>│            │
    │             │            │<──────────────┤            │            │
    │             │            │ claimPoints() │            │            │
    │             │            ├───────────────────────────>│            │
    │             │            │               │            │ findOne    │
    │             │            │               │            │ Submission │
    │             │            │               │            ├───────────>│
    │             │            │               │            │<───────────┤
    │             │            │               │            │ validate:  │
    │             │            │               │            │ claimed=false│
    │             │            │               │            │ findById   │
    │             │            │               │            │ Tarea      │
    │             │            │               │            ├───────────>│
    │             │            │               │            │<───────────┤
    │             │            │               │            │ findById   │
    │             │            │               │            │ Usuario    │
    │             │            │               │            ├───────────>│
    │             │            │               │            │<───────────┤
    │             │            │               │            │ update     │
    │             │            │               │            │ Usuario.   │
    │             │            │               │            │ points +=  │
    │             │            │               │            │ Tarea.points│
    │             │            │               │            ├───────────>│
    │             │            │               │            │<───────────┤
    │             │            │               │            │ update     │
    │             │            │               │            │ Submission.│
    │             │            │               │            │ claimed:true│
    │             │            │               │            ├───────────>│
    │             │            │               │            │<───────────┤
    │             │<───────────┼───────────────┼────────────┤            │
    │<────────────┤ 200 { ok: true, claimed: true }        │            │
    │             │            │               │            │            │
    │ "¡100 puntos reclamados!"                │            │            │
    │             │            │               │            │            │
```

---

¡Con estos diagramas tendrás una visualización clara de cómo funciona TaskRewardPro! 🚀
