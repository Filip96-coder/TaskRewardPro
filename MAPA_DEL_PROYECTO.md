# 🗺️ Mapa Visual del Proyecto TaskRewardPro

## 🎯 Vista de 10,000 pies (Big Picture)

```
╔══════════════════════════════════════════════════════════════╗
║                      TASKREWARDPRO                           ║
║         Sistema de Gestión de Tareas y Recompensas          ║
╚══════════════════════════════════════════════════════════════╝

                         ┌────────────┐
                         │  USUARIOS  │
                         └─────┬──────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
           ┌─────▼─────┐ ┌────▼─────┐ ┌────▼──────┐
           │   ADMIN   │ │  LÍDER   │ │TRABAJADOR │
           └─────┬─────┘ └────┬─────┘ └─────┬─────┘
                 │            │              │
                 │            │              │
        ┌────────▼────────────▼──────────────▼────────┐
        │                                              │
        │            FUNCIONALIDADES CORE              │
        │                                              │
        │  • Gestión de Tareas                         │
        │  • Sistema de Entregas (Submissions)         │
        │  • Aprobación/Rechazo                        │
        │  • Sistema de Puntos                         │
        │  • Recompensas y Canjes                      │
        │  • Autenticación y Autorización              │
        │                                              │
        └──────────────────────────────────────────────┘
```

---

## 📦 Estructura de Carpetas (Con Explicaciones)

```
TaskRewardPro/
│
├── �� README.md                          ← Documentación principal
├── 📄 DOCUMENTACION_DETALLADA.md         ← Explicación de cada clase
├── 📄 DIAGRAMAS_ARQUITECTURA.md          ← Diagramas visuales
├── 📄 GUIA_EXPOSICION.md                 ← Guía para presentar
├── 📄 RESUMEN_PARA_EXPOSICION.md         ← Resumen rápido
├── 📄 MAPA_DEL_PROYECTO.md               ← Este archivo
│
├── 📂 Back/                              ← BACKEND (Node.js + Express)
│   │
│   ├── 📂 src/
│   │   │
│   │   ├── 📂 config/
│   │   │   └── 📄 db.js                  ← Conexión a MongoDB
│   │   │       └── Función: connectDB()
│   │   │           • Conecta a MongoDB usando Mongoose
│   │   │           • Lee MONGO_URI de .env
│   │   │
│   │   ├── 📂 controllers/               ← LÓGICA DE NEGOCIO
│   │   │   │
│   │   │   ├── 📄 authController.js      ← Autenticación
│   │   │   │   ├── register()  → Crear usuario con JWT
│   │   │   │   ├── login()     → Iniciar sesión
│   │   │   │   └── me()        → Obtener perfil
│   │   │   │
│   │   │   ├── 📄 tareaController.js     ← Gestión de tareas
│   │   │   │   ├── crearTarea()          → Admin crea tarea
│   │   │   │   ├── obtenerTareas()       → Listar todas
│   │   │   │   ├── obtenerTareasUsuario()→ Lista con mis entregas
│   │   │   │   ├── actualizarTarea()     → Modificar tarea
│   │   │   │   └── eliminarTarea()       → Eliminar tarea
│   │   │   │
│   │   │   ├── 📄 submissionController.js ← Entregas de tareas
│   │   │   │   ├── submitTask()          → Trabajador sube archivo
│   │   │   │   ├── listSubmissionsForTask() → Admin ve entregas
│   │   │   │   ├── mySubmissionForTask() → Mi entrega
│   │   │   │   ├── decideSubmission()    → Aprobar/Rechazar
│   │   │   │   └── claimPoints()         → Reclamar puntos
│   │   │   │
│   │   │   ├── 📄 usuariocontroller.js   ← Gestión de usuarios
│   │   │   │   ├── crearUsuario()
│   │   │   │   ├── obtenerUsuarios()
│   │   │   │   ├── actualizausuario()
│   │   │   │   ├── eliminarusuario()
│   │   │   │   └── obtenerPorRol()
│   │   │   │
│   │   │   ├── 📄 recompensaController.js ← Gestión de recompensas
│   │   │   ├── 📄 historialCanjeController.js
│   │   │   ├── 📄 metaController.js       ← (En desarrollo)
│   │   │   └── 📄 rankingController.js    ← (En desarrollo)
│   │   │
│   │   ├── 📂 middleware/                ← SEGURIDAD Y UTILIDADES
│   │   │   │
│   │   │   ├── 📄 auth.js                ← Autenticación JWT
│   │   │   │   └── authRequired()
│   │   │   │       • Valida token JWT
│   │   │   │       • Extrae payload → req.user
│   │   │   │       • Si inválido → 401
│   │   │   │
│   │   │   ├── 📄 rolmiddleware.js       ← Control de roles
│   │   │   │   └── requireRol(rol)
│   │   │   │       • Valida req.user.rol
│   │   │   │       • Si no coincide → 403
│   │   │   │
│   │   │   └── 📄 upload.js              ← Manejo de archivos
│   │   │       └── Configuración Multer
│   │   │           • Destino: /uploads/submissions/
│   │   │           • Tipos: PDF, PNG, JPEG, TXT
│   │   │           • Max: 10MB
│   │   │
│   │   ├── 📂 models/                    ← ESQUEMAS DE DATOS
│   │   │   │
│   │   │   ├── 📄 usuario.js             ← MODELO BASE
│   │   │   │   └── Schema: Usuario
│   │   │   │       • name, email, password, rol, points
│   │   │   │       • Base para herencia
│   │   │   │
│   │   │   ├── 📄 admin.js               ← Hereda de Usuario
│   │   │   │   └── Discriminator de Usuario
│   │   │   │
│   │   │   ├── 📄 trabajador.js          ← Hereda de Usuario
│   │   │   │   └── Discriminator de Usuario
│   │   │   │       • Campos extra: cargo, puntos
│   │   │   │
│   │   │   ├── 📄 tarea.js               ← Tareas del sistema
│   │   │   │   └── Schema: Tarea
│   │   │   │       • title, description, points
│   │   │   │       • dueDate, status, createdBy
│   │   │   │
│   │   │   ├── 📄 submission.js          ← Entregas de trabajadores
│   │   │   │   └── Schema: Submission
│   │   │   │       • task, user, filePath
│   │   │   │       • status, claimed, feedback
│   │   │   │
│   │   │   ├── 📄 recompensa.js          ← Catálogo de premios
│   │   │   │   └── Schema: Recompensa
│   │   │   │       • nombre, puntosRequeridos
│   │   │   │       • cantidadCanjes, limiteCanjes
│   │   │   │
│   │   │   ├── 📄 historialCanje.js      ← Log de canjes
│   │   │   ├── 📄 meta.js                ← Objetivos (en desarrollo)
│   │   │   └── 📄 ranking.js             ← Clasificaciones (en desarrollo)
│   │   │
│   │   ├── 📂 routes/                    ← DEFINICIÓN DE ENDPOINTS
│   │   │   │
│   │   │   ├── 📄 authRoutes.js          ← /api/auth/*
│   │   │   │   ├── POST /register
│   │   │   │   ├── POST /login
│   │   │   │   └── GET  /me (auth)
│   │   │   │
│   │   │   ├── 📄 tareaRoutes.js         ← /api/tasks/*
│   │   │   │   ├── GET    /              (auth)
│   │   │   │   ├── GET    /user/list     (auth + Trabajador)
│   │   │   │   ├── POST   /              (auth + Admin)
│   │   │   │   ├── PUT    /:id           (auth + Admin)
│   │   │   │   ├── DELETE /:id           (auth + Admin)
│   │   │   │   ├── POST   /:id/submit    (auth + Trabajador + upload)
│   │   │   │   ├── GET    /:id/submissions (auth + Admin)
│   │   │   │   ├── PATCH  /:taskId/submission/:subId/decision (auth + Admin)
│   │   │   │   └── POST   /:taskId/claim (auth + Trabajador)
│   │   │   │
│   │   │   ├── 📄 usuarioRoutes.js       ← /api/usuarios/*
│   │   │   ├── 📄 recompensaRoutes.js    ← /api/recompensas/*
│   │   │   ├── 📄 historialCanjeRoutes.js
│   │   │   ├── 📄 metaRoutes.js
│   │   │   └── 📄 rankingRoutes.js
│   │   │
│   │   └── 📄 index.js                   ← ENTRY POINT del servidor
│   │       └── Inicializa:
│   │           • Express app
│   │           • Conecta a MongoDB
│   │           • Monta todas las rutas
│   │           • Sirve archivos estáticos (/uploads)
│   │           • Escucha en puerto 4000
│   │
│   ├── 📂 uploads/                       ← ARCHIVOS SUBIDOS
│   │   └── 📂 submissions/               ← Evidencias de tareas
│   │       └── timestamp__archivo.ext
│   │
│   ├── 📄 .env                           ← Variables de entorno
│   │   ├── PORT=4000
│   │   ├── MONGO_URI=mongodb://...
│   │   └── JWT_SECRET=...
│   │
│   ├── 📄 package.json                   ← Dependencias backend
│   └── 📄 index.js                       ← Alias a src/index.js
│
├── 📂 Front/                             ← FRONTEND (React + Vite)
│   │
│   ├── 📂 src/
│   │   │
│   │   ├── 📂 components/                ← Componentes reutilizables
│   │   │   │
│   │   │   ├── 📄 ProtectedRoute.jsx     ← Guard de rutas privadas
│   │   │   │   └── Verifica autenticación
│   │   │   │       • Si no auth → redirect /login
│   │   │   │       • Si auth → renderiza contenido
│   │   │   │
│   │   │   └── 📄 Sidebar.jsx            ← Menú lateral
│   │   │       └── Navegación y logout
│   │   │
│   │   ├── 📂 context/                   ← Estado global
│   │   │   │
│   │   │   └── 📄 AuthContext.jsx        ← Contexto de autenticación
│   │   │       ├── Estado: user, loading
│   │   │       ├── login()   → Llama API y guarda token
│   │   │       ├── register()→ Llama API y guarda token
│   │   │       └── logout()  → Elimina token
│   │   │
│   │   ├── 📂 pages/                     ← Páginas/Vistas
│   │   │   │
│   │   │   ├── 📄 Login.jsx              ← Página de login
│   │   │   │   └── Formulario email/password
│   │   │   │
│   │   │   ├── 📄 Register.jsx           ← Página de registro
│   │   │   │   └── Formulario con rol
│   │   │   │
│   │   │   ├── 📄 Dashboard.jsx          ← Panel principal
│   │   │   │   └── KPIs y estadísticas
│   │   │   │       • Tareas completadas
│   │   │   │       • Puntos acumulados
│   │   │   │       • Recompensas disponibles
│   │   │   │
│   │   │   └── 📄 TaskRegister.jsx       ← Crear tarea (Admin)
│   │   │       └── Formulario de tarea
│   │   │
│   │   ├── 📂 services/                  ← Lógica de API
│   │   │   │
│   │   │   └── 📄 api.js                 ← Todas las llamadas HTTP
│   │   │       ├── Función http() auxiliar
│   │   │       │
│   │   │       ├── AUTENTICACIÓN:
│   │   │       │   ├── login()
│   │   │       │   ├── register()
│   │   │       │   └── getProfile()
│   │   │       │
│   │   │       ├── TAREAS:
│   │   │       │   ├── createTask()
│   │   │       │   ├── listTasks()
│   │   │       │   ├── listUserTasks()
│   │   │       │   ├── updateTask()
│   │   │       │   └── deleteTask()
│   │   │       │
│   │   │       └── ENTREGAS:
│   │   │           ├── submitTaskFile()
│   │   │           ├── listTaskSubmissions()
│   │   │           ├── decideSubmission()
│   │   │           └── claimPoints()
│   │   │
│   │   ├── 📄 App.jsx                    ← Componente raíz
│   │   │   └── Define rutas:
│   │   │       • /login
│   │   │       • /register
│   │   │       • /app/dashboard (protegida)
│   │   │       • /app/tareas/registro (protegida)
│   │   │
│   │   ├── 📄 main.jsx                   ← Entry point de React
│   │   │   └── ReactDOM.render(<App />)
│   │   │
│   │   └── 📄 styles.css                 ← Estilos globales
│   │
│   ├── 📂 public/                        ← Archivos estáticos
│   │
│   ├── 📄 .env                           ← Variables de entorno
│   │   └── VITE_API_URL=http://localhost:4000
│   │
│   ├── 📄 index.html                     ← HTML base
│   ├── 📄 package.json                   ← Dependencias frontend
│   └── 📄 vite.config.js                 ← Config de Vite
│
└── 📂 public/                            ← Imágenes del README
    ├── 📄 logo-taskreward.png
    ├── 📄 VistaAdmin.png
    └── ...
```

---

## 🔄 Flujo de Datos (Diagrama Simplificado)

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO EN NAVEGADOR                      │
│                                                              │
│  1. Usuario interactúa con interfaz                         │
│  2. React maneja eventos (onClick, onChange)                │
│  3. Llama funciones de api.js                               │
│                                                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP Request
                         │ Authorization: Bearer <token>
                         │ { data }
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   EXPRESS BACKEND                            │
│                                                              │
│  4. Router recibe petición                                  │
│  5. Middleware authRequired valida JWT                      │
│  6. Middleware requireRol valida rol                        │
│  7. Middleware upload (si hay archivo)                      │
│  8. Controlador ejecuta lógica                              │
│                                                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Mongoose Query
                         │ find(), create(), update()
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    MONGODB DATABASE                          │
│                                                              │
│  9. Ejecuta operación en colección                          │
│  10. Devuelve resultado                                     │
│                                                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Resultado
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   EXPRESS BACKEND                            │
│                                                              │
│  11. Controlador procesa resultado                          │
│  12. Devuelve JSON response                                 │
│                                                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP Response
                         │ { success: true, data: {...} }
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    USUARIO EN NAVEGADOR                      │
│                                                              │
│  13. api.js recibe respuesta                                │
│  14. React actualiza estado                                 │
│  15. Componente re-renderiza                                │
│  16. Usuario ve cambios en pantalla                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗺️ Mapa de Relaciones entre Archivos

```
                    FRONTEND
                    ========

         ┌─────────────────────┐
         │      main.jsx       │ (Entry point)
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │      App.jsx        │ (Rutas)
         └──────────┬──────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
   ┌────────┐ ┌─────────┐ ┌──────────┐
   │ Login  │ │Dashboard│ │TaskReg   │
   └───┬────┘ └────┬────┘ └────┬─────┘
       │           │           │
       │      ┌────▼────┐      │
       └─────►│api.js   │◄─────┘
              └────┬────┘
                   │
                   ▼
              [Backend API]


                    BACKEND
                    =======

         ┌─────────────────────┐
         │     index.js        │ (Entry point)
         └──────────┬──────────┘
                    │
                    ├─► connectDB() [config/db.js]
                    │
                    └─► Monta rutas:
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    authRoutes      tareaRoutes    recompensaRoutes
         │               │               │
         ▼               ▼               ▼
    authController  tareaController  recompensaController
         │               │               │
         │          ┌────┴────┐          │
         │          │         │          │
         ▼          ▼         ▼          ▼
      Usuario    Tarea    Submission  Recompensa
       (Model)   (Model)    (Model)    (Model)
         │          │         │          │
         └──────────┴─────────┴──────────┘
                    │
                    ▼
                [MongoDB]
```

---

## 🔐 Cadena de Seguridad

```
Petición HTTP
     │
     ▼
┌─────────────────┐
│   authRequired  │  ← Valida JWT
│                 │    • Token válido? ✓/✗
│                 │    • No expirado? ✓/✗
│                 │    • Firma correcta? ✓/✗
└────────┬────────┘
         │ SI válido: req.user = { id, email, rol }
         │ SI inválido: 401 Unauthorized
         │
         ▼
┌─────────────────┐
│  requireRol(X)  │  ← Valida rol
│                 │    • req.user.rol === X? ✓/✗
└────────┬────────┘
         │ SI coincide: next()
         │ SI no coincide: 403 Forbidden
         │
         ▼
┌─────────────────┐
│   Controller    │  ← Ejecuta acción
│                 │    • Lógica de negocio
│                 │    • Acceso a BD
└─────────────────┘
```

---

## 🎯 Ciclo de Vida de una Tarea (Completo)

```
┌──────────────────────────────────────────────────────────┐
│                      CICLO COMPLETO                       │
└──────────────────────────────────────────────────────────┘

1. CREACIÓN
   ┌─────────┐
   │  ADMIN  │ → POST /api/tasks
   └─────────┘   { title, description, points }
        │
        ▼
   [ Tarea creada ]
   status: "Pendiente"
   createdBy: admin_id


2. VISUALIZACIÓN
   ┌─────────────┐
   │ TRABAJADOR  │ → GET /api/tasks/user/list
   └─────────────┘
        │
        ▼
   [ Lista de tareas ]
   [{ title, points, mySubmission: null }]


3. ENTREGA
   ┌─────────────┐
   │ TRABAJADOR  │ → POST /api/tasks/:id/submit
   └─────────────┘   FormData { file: certificado.pdf }
        │
        ▼
   [ Submission creada ]
   status: "Pendiente"
   claimed: false
   filePath: "/uploads/..."
        │
        ▼
   [ Tarea actualizada ]
   status: "Pendiente" (en revisión)


4. REVISIÓN
   ┌─────────┐
   │  ADMIN  │ → GET /api/tasks/:id/submissions
   └─────────┘
        │
        ▼
   [ Ve lista de entregas ]
        │
        ├──── Descarga archivo
        │
        └──── Decide


5A. APROBACIÓN
   ┌─────────┐
   │  ADMIN  │ → PATCH .../decision
   └─────────┘   { action: "approve" }
        │
        ▼
   [ Submission actualizada ]
   status: "Aprobada"
        │
        ▼
   [ Tarea actualizada ]
   status: "Completada"


5B. RECHAZO
   ┌─────────┐
   │  ADMIN  │ → PATCH .../decision
   └─────────┘   { action: "reject" }
        │
        ▼
   [ Submission actualizada ]
   status: "Rechazada"
        │
        ▼
   [ Tarea actualizada ]
   status: "Pendiente"
        │
        └─→ Trabajador puede reenviar (vuelve a paso 3)


6. RECLAMAR PUNTOS
   ┌─────────────┐
   │ TRABAJADOR  │ → POST /api/tasks/:id/claim
   └─────────────┘
        │
        ▼
   [ Validaciones ]
   • Submission aprobada? ✓
   • claimed === false? ✓
        │
        ▼
   [ Usuario actualizado ]
   points += tarea.points
   (ej: 0 → 100)
        │
        ▼
   [ Submission actualizada ]
   claimed: true
        │
        ▼
   [ Trabajador ve mensaje ]
   "¡100 puntos reclamados!"


7. CANJE (Futuro)
   ┌─────────────┐
   │ TRABAJADOR  │ → POST /api/canjes
   └─────────────┘   { recompensaId }
        │
        ▼
   [ Validar puntos suficientes ]
        │
        ▼
   [ Usuario actualizado ]
   points -= recompensa.puntosRequeridos
   (ej: 100 → 25)
        │
        ▼
   [ HistorialCanje creado ]
        │
        ▼
   [ Recompensa actualizada ]
   cantidadCanjes++
```

---

## 📊 Estados Posibles

### Estados de Tarea:
```
┌─────────────┐
│  Pendiente  │ ← Inicial o rechazada
└─────┬───────┘
      │
      │ (Admin aprueba entrega)
      ▼
┌─────────────┐
│ Completada  │ ← Final
└─────────────┘
```

### Estados de Submission:
```
┌─────────────┐
│  Pendiente  │ ← Esperando revisión
└─────┬───────┘
      │
      ├──────────────────┐
      │                  │
      │ Admin aprueba    │ Admin rechaza
      ▼                  ▼
┌─────────────┐    ┌─────────────┐
│  Aprobada   │    │  Rechazada  │
│             │    │             │
│claimed:false│    └─────────────┘
└─────┬───────┘
      │
      │ Trabajador reclama
      ▼
┌─────────────┐
│  Aprobada   │
│             │
│ claimed:true│ ← Final
└─────────────┘
```

---

## 🔑 Conceptos Clave por Capa

### Frontend (React):
```
• Componentes → Interfaz de usuario
• Context API → Estado global (user, loading)
• React Router → Navegación entre páginas
• api.js → Centraliza llamadas HTTP
• ProtectedRoute → Guard de autenticación
```

### Backend (Express):
```
• Routes → Define endpoints y métodos HTTP
• Middleware → Valida auth, roles, archivos
• Controllers → Lógica de negocio
• Models → Esquemas de datos (Mongoose)
• JWT → Autenticación sin estado
• bcrypt → Hash de contraseñas
```

### Database (MongoDB):
```
• Colecciones → usuarios, tareas, submissions, etc.
• Discriminators → Herencia (Usuario → Admin, Trabajador)
• Referencias → ObjectId vincula documentos
• Timestamps → Fechas automáticas (createdAt, updatedAt)
```

---

## 🎯 Puntos de Integración

```
1. Login/Register
   Frontend (Login.jsx)
   → api.login()
   → POST /api/auth/login
   → authController.login()
   → Usuario.findOne()
   → bcrypt.compare()
   → jwt.sign()
   → Response { token, user }
   → localStorage.setItem("token")
   → AuthContext.setUser()

2. Crear Tarea
   Frontend (TaskRegister.jsx)
   → api.createTask()
   → POST /api/tasks
   → authRequired ✓
   → requireRol("Admin") ✓
   → tareaController.crearTarea()
   → Tarea.create()
   → Response { tarea }

3. Subir Evidencia
   Frontend (Upload Form)
   → api.submitTaskFile()
   → POST /api/tasks/:id/submit
   → authRequired ✓
   → requireRol("Trabajador") ✓
   → upload.single("file") ✓
   → submissionController.submitTask()
   → Submission.deleteMany() (previas)
   → Submission.create()
   → Tarea.update()
   → Response { submission }

4. Aprobar/Rechazar
   Frontend (Decision Form)
   → api.decideSubmission()
   → PATCH /api/tasks/:taskId/submission/:subId/decision
   → authRequired ✓
   → requireRol("Admin") ✓
   → submissionController.decideSubmission()
   → Submission.update(status)
   → Tarea.update(status)
   → Response { ok: true }

5. Reclamar Puntos
   Frontend (Claim Button)
   → api.claimPoints()
   → POST /api/tasks/:id/claim
   → authRequired ✓
   → requireRol("Trabajador") ✓
   → submissionController.claimPoints()
   → Submission.findOne()
   → Usuario.update(points)
   → Submission.update(claimed)
   → Response { ok: true }
```

---

## 🚀 Para tu Presentación

**Usa este mapa para:**

1. **Explicar la estructura general** → Mostrar carpetas
2. **Seguir un flujo completo** → Desde frontend hasta BD
3. **Demostrar integración** → Cómo se comunican las capas
4. **Visualizar seguridad** → Cadena de middleware
5. **Entender estados** → Ciclo de vida de tarea/submission

**Imprime o ten abierto:**
- Este archivo (MAPA_DEL_PROYECTO.md)
- DIAGRAMAS_ARQUITECTURA.md
- RESUMEN_PARA_EXPOSICION.md

---

¡Con este mapa visual tienes una vista completa del proyecto! 🗺️
