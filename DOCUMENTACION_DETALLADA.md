# 📚 Documentación Detallada de TaskRewardPro

## 📋 Índice
1. [Visión General del Proyecto](#visión-general-del-proyecto)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Backend - Modelos de Datos](#backend---modelos-de-datos)
4. [Backend - Controladores](#backend---controladores)
5. [Backend - Middleware](#backend---middleware)
6. [Backend - Rutas](#backend---rutas)
7. [Frontend - Componentes](#frontend---componentes)
8. [Frontend - Servicios](#frontend---servicios)
9. [Flujo de Trabajo del Sistema](#flujo-de-trabajo-del-sistema)
10. [Stack Tecnológico](#stack-tecnológico)

---

## 🎯 Visión General del Proyecto

**TaskRewardPro** es un sistema de gestión de tareas y recompensas diseñado para pequeñas empresas y equipos. El objetivo es **motivar a los trabajadores** mediante un sistema de puntos que se obtienen al completar tareas y pueden canjearse por recompensas.

### Características Principales:
- ✅ **Gestión de Tareas**: Los administradores crean y asignan tareas
- 🎁 **Sistema de Recompensas**: Los trabajadores canjean puntos por premios
- 🎯 **Metas SMART**: Seguimiento de objetivos del equipo
- 🏆 **Rankings**: Tablas de clasificación por desempeño
- 👥 **Roles y Permisos**: Admin, Líder y Trabajador
- 📎 **Validación de Entregas**: Los trabajadores suben evidencia y los admins la aprueban/rechazan

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────┐
│              FRONTEND (React + Vite)             │
│  - Interfaz de usuario                          │
│  - Gestión de autenticación                     │
│  - Llamadas a API                               │
└────────────────┬────────────────────────────────┘
                 │ HTTP/REST
                 │ (JSON)
┌────────────────▼────────────────────────────────┐
│           BACKEND (Node.js + Express)           │
│  ┌──────────────────────────────────────────┐  │
│  │           Middleware Layer               │  │
│  │  - Autenticación JWT                     │  │
│  │  - Control de roles                      │  │
│  │  - Manejo de archivos                    │  │
│  └──────────────┬───────────────────────────┘  │
│                 │                               │
│  ┌──────────────▼───────────────────────────┐  │
│  │           Controllers                    │  │
│  │  - Lógica de negocio                     │  │
│  │  - Validaciones                          │  │
│  └──────────────┬───────────────────────────┘  │
│                 │                               │
│  ┌──────────────▼───────────────────────────┐  │
│  │             Models (Mongoose)            │  │
│  │  - Esquemas de datos                     │  │
│  │  - Validaciones de modelo                │  │
│  └──────────────┬───────────────────────────┘  │
└─────────────────┼───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│            DATABASE (MongoDB)                   │
│  - Almacenamiento persistente                   │
│  - Colecciones: usuarios, tareas, recompensas   │
└─────────────────────────────────────────────────┘
```

### Flujo de Comunicación:
1. **Cliente** (navegador) → Envía peticiones HTTP
2. **Middleware** → Valida autenticación y permisos
3. **Controlador** → Procesa la lógica de negocio
4. **Modelo** → Interactúa con MongoDB
5. **Respuesta** → Devuelve JSON al cliente

---

## 📊 Backend - Modelos de Datos

Los modelos definen la estructura de los datos en MongoDB usando Mongoose.

### 1. **Usuario (usuario.js)**
```javascript
Campos:
- name: String (requerido) - Nombre del usuario
- email: String (único, requerido) - Correo electrónico
- password: String (requerido) - Contraseña hasheada
- rol: String (enum) - "Admin", "Lider", "Trabajador"
- points: Number (default: 0) - Puntos acumulados
- timestamps: true - Fechas de creación y actualización
```

**Funcionalidad**: 
- Es el modelo base para todos los usuarios
- Almacena credenciales de acceso
- Guarda los puntos acumulados por cada usuario
- Usa herencia con discriminadores para Admin y Trabajador

**Relaciones**:
- Un usuario puede tener muchas tareas creadas
- Un usuario puede tener muchas entregas (submissions)
- Un usuario puede tener muchos canjes de recompensas

---

### 2. **Admin (admin.js)**
```javascript
Hereda de: Usuario
Campos adicionales: ninguno (por ahora)
```

**Funcionalidad**:
- Discriminador de Mongoose para usuarios con rol Admin
- Hereda todos los campos de Usuario
- Permite extensibilidad futura (agregar campos específicos de admin)

**Permisos**:
- Crear, modificar y eliminar tareas
- Aprobar o rechazar entregas de trabajadores
- Crear recompensas
- Gestionar usuarios

---

### 3. **Trabajador (trabajador.js)**
```javascript
Hereda de: Usuario
Campos adicionales:
- cargo: String - Puesto/rol laboral
- puntos: Number (default: 0) - Puntos del trabajador
```

**Funcionalidad**:
- Discriminador de Mongoose para usuarios trabajadores
- Campos adicionales para información laboral
- Almacena puntos ganados por completar tareas

**Permisos**:
- Ver tareas asignadas
- Subir evidencia de tareas completadas
- Canjear puntos por recompensas

---

### 4. **Tarea (tarea.js)**
```javascript
Campos:
- title: String (requerido) - Título de la tarea
- description: String - Descripción detallada
- dueDate: Date - Fecha límite
- points: Number (requerido, min: 1) - Puntos que otorga
- attachments: [String] - URLs de archivos adjuntos
- createdBy: ObjectId (ref: Usuario) - Quién creó la tarea
- status: String (default: "Pendiente") - Estado de la tarea
```

**Funcionalidad**:
- Define las tareas que los trabajadores deben completar
- Asigna puntos a las tareas
- Rastrea el estado de las tareas

**Estados posibles**:
- "Pendiente" - Tarea sin completar o entrega pendiente de revisión
- "Completada" - Tarea aprobada por el administrador

**Relaciones**:
- Una tarea pertenece a un usuario creador (Admin)
- Una tarea puede tener múltiples entregas (Submissions)
- Una tarea puede estar asociada a una meta

---

### 5. **Submission (submission.js)**
```javascript
Campos:
- task: ObjectId (ref: Tarea, requerido) - Tarea asociada
- user: ObjectId (ref: Usuario, requerido) - Usuario que entrega
- claimed: Boolean (default: false) - Si ya reclamó puntos
- filePath: String (requerido) - Ruta del archivo subido
- originalName: String (requerido) - Nombre original del archivo
- mimeType: String (requerido) - Tipo MIME del archivo
- size: Number (requerido) - Tamaño del archivo en bytes
- status: String (enum, default: "Pendiente") - Estado de la entrega
- feedback: String - Comentarios del revisor
- timestamps: true - Fechas de creación y actualización
```

**Funcionalidad**:
- Almacena las entregas de evidencia de los trabajadores
- Guarda información del archivo subido
- Rastrea el estado de aprobación
- Controla si los puntos ya fueron reclamados

**Estados posibles**:
- "Pendiente" - Esperando revisión del admin
- "Aprobada" - Admin aprobó la entrega
- "Rechazada" - Admin rechazó la entrega

**Flujo**:
1. Trabajador sube archivo (status: "Pendiente")
2. Admin revisa y decide (status: "Aprobada" o "Rechazada")
3. Si aprobada, trabajador puede reclamar puntos (claimed: true)

---

### 6. **Recompensa (recompensa.js)**
```javascript
Campos:
- nombre: String (requerido) - Nombre de la recompensa
- descripcion: String - Descripción detallada
- puntosRequeridos: Number (requerido) - Costo en puntos
- cantidadCanjes: Number (default: 0) - Veces que se ha canjeado
- limiteCanjes: Number - Límite de canjes disponibles
- fechaLimiteCanje: Date - Fecha límite para canjear
```

**Funcionalidad**:
- Define las recompensas disponibles
- Establece el costo en puntos
- Controla la disponibilidad (límites y fechas)
- Rastrea cuántas veces se ha canjeado

**Ejemplo de recompensas**:
- Día de teletrabajo (100 puntos)
- Salida anticipada (50 puntos)
- Almuerzo gratis (75 puntos)

---

### 7. **HistorialCanje (historialCanje.js)**
```javascript
Campos:
- historialId: Number (requerido, único) - ID del historial
- usuario: ObjectId (ref: Usuario) - Usuario que canjeó
- recompensa: ObjectId (ref: Recompensa) - Recompensa canjeada
- fechaCanje: Date (default: Date.now) - Fecha del canje
```

**Funcionalidad**:
- Registra todos los canjes de recompensas
- Permite auditoría de canjes
- Vincula usuarios con recompensas canjeadas
- Genera reportes históricos

---

### 8. **Meta (meta.js)**
```javascript
Campos:
- metaId: Number (requerido, único) - ID de la meta
- nombreMeta: String (requerido) - Nombre de la meta
- descripcion: String - Descripción de la meta
- estado: Boolean (default: false) - Si está completada
- tareas: [ObjectId] (ref: Tarea) - Tareas asociadas
```

**Funcionalidad**:
- Define objetivos SMART para el equipo
- Agrupa múltiples tareas relacionadas
- Rastrea el progreso del equipo
- Permite planificación estratégica

**Ejemplo**:
- Meta: "Mejorar proceso de ventas"
- Tareas: Capacitación, documentación, implementación
- Estado: false (en progreso)

---

### 9. **Ranking (ranking.js)**
```javascript
Campos:
- rankingId: Number (requerido, único) - ID del ranking
- usuarios: [ObjectId] (ref: Usuario) - Lista de usuarios
- posicion: Number - Posición en el ranking
- fechaActualizada: Date (default: Date.now) - Última actualización
```

**Funcionalidad**:
- Calcula y almacena posiciones de usuarios
- Genera tablas de clasificación
- Motiva competencia saludable
- Se actualiza periódicamente

**Nota**: Esta funcionalidad está en desarrollo y no está completamente implementada.

---

## 🎮 Backend - Controladores

Los controladores contienen la lógica de negocio de la aplicación.

### 1. **authController.js** - Autenticación y Autorización

#### Función: `register(req, res)`
```javascript
Propósito: Registrar nuevos usuarios en el sistema
```
**Proceso**:
1. Recibe: name, email, password, rol
2. Valida que no exista el email
3. Hashea la contraseña con bcrypt (10 rounds)
4. Crea el usuario en la BD con 0 puntos
5. Genera token JWT con id, email y rol
6. Devuelve token y datos del usuario (sin password)

**Respuestas**:
- 201: Usuario creado exitosamente
- 400: Faltan datos requeridos
- 409: Email ya registrado
- 500: Error del servidor

---

#### Función: `login(req, res)`
```javascript
Propósito: Iniciar sesión de usuarios existentes
```
**Proceso**:
1. Recibe: email, password
2. Busca usuario por email
3. Compara password con bcrypt
4. Genera token JWT
5. Devuelve token y datos del usuario

**Respuestas**:
- 200: Login exitoso
- 401: Credenciales inválidas
- 500: Error del servidor

**Token JWT incluye**:
- id: ID del usuario
- email: Email del usuario
- rol: Rol del usuario (Admin/Lider/Trabajador)
- expiresIn: "7d" (válido por 7 días)

---

#### Función: `me(req, res)`
```javascript
Propósito: Obtener perfil del usuario autenticado
```
**Proceso**:
1. Extrae el ID del usuario del token (req.user.id)
2. Busca el usuario en BD (sin devolver password)
3. Devuelve información del perfil

**Uso**: Para mantener la sesión activa y cargar datos del usuario

---

### 2. **usuarioController.js** - Gestión de Usuarios

#### Función: `crearUsuario(req, res)`
```javascript
Propósito: Crear diferentes tipos de usuarios (discriminators)
```
**Proceso**:
1. Lee el rol del body
2. Según el rol, crea instancia de Admin o Trabajador
3. Guarda en BD usando el discriminador correcto
4. Devuelve el usuario creado

**Nota**: Esta función es alternativa a register para crear usuarios con discriminadores.

---

#### Función: `obtenerUsuarios(req, res)`
```javascript
Propósito: Listar todos los usuarios del sistema
```
**Uso**: Para administradores que gestionan el equipo

---

#### Función: `actualizarusuario(req, res)`
```javascript
Propósito: Modificar datos de un usuario existente
```
**Proceso**:
1. Recibe ID del usuario en params
2. Recibe datos a actualizar en body
3. Usa findByIdAndUpdate con validaciones
4. Devuelve usuario actualizado

---

#### Función: `eliminarusuario(req, res)`
```javascript
Propósito: Eliminar un usuario del sistema
```
**Precaución**: Esta operación es permanente.

---

#### Función: `obtenerPorRol(req, res)`
```javascript
Propósito: Filtrar usuarios por rol
```
**Uso**: Obtener solo admins, solo líderes o solo trabajadores.

---

### 3. **tareaController.js** - Gestión de Tareas

#### Función: `crearTarea(req, res)`
```javascript
Propósito: Crear nuevas tareas en el sistema
```
**Proceso**:
1. Recibe: title, description, dueDate, points, attachments
2. Asigna createdBy desde req.user.id (del token)
3. Establece status inicial como "Pendiente"
4. Guarda en BD
5. Devuelve tarea creada

**Validaciones**:
- title es requerido
- points es requerido y debe ser mínimo 1

---

#### Función: `obtenerTareas(req, res)`
```javascript
Propósito: Listar todas las tareas del sistema
```
**Uso**: Para que admins vean todas las tareas disponibles.

---

#### Función: `obtenerTareasUsuario(req, res)`
```javascript
Propósito: Listar tareas con info de entregas del usuario actual
```
**Proceso**:
1. Obtiene userId del token
2. Busca todas las tareas
3. Busca entregas (submissions) del usuario
4. Combina la info: cada tarea incluye su submission si existe
5. Devuelve tareas con campo "mySubmission"

**Estructura de respuesta**:
```javascript
[
  {
    _id: "...",
    title: "Capacitación",
    points: 100,
    mySubmission: {
      status: "Aprobada",
      claimed: false
    }
  }
]
```

**Uso**: Para que trabajadores vean qué tareas han entregado y su estado.

---

#### Función: `actualizarTarea(req, res)`
```javascript
Propósito: Modificar datos de una tarea
```
**Restricción**: Solo admins pueden actualizar tareas.

---

#### Función: `eliminarTarea(req, res)`
```javascript
Propósito: Eliminar una tarea del sistema
```
**Restricción**: Solo admins pueden eliminar tareas.

---

### 4. **submissionController.js** - Gestión de Entregas

#### Función: `submitTask(req, res)`
```javascript
Propósito: Trabajador sube evidencia de tarea completada
```
**Proceso**:
1. Recibe taskId en params
2. Recibe archivo en req.file (multer)
3. Valida que exista archivo
4. Elimina entregas anteriores del mismo usuario/tarea
5. Crea nueva entrega con:
   - Ruta del archivo
   - Nombre original
   - Tipo MIME
   - Tamaño
   - Status: "Pendiente"
   - claimed: false
6. Actualiza tarea a status "Pendiente"
7. Devuelve la submission creada

**Validaciones**:
- Requiere archivo
- Solo trabajadores pueden subir
- Archivos permitidos: PDF, PNG, JPEG, TXT
- Tamaño máximo: 10MB

---

#### Función: `listSubmissionsForTask(req, res)`
```javascript
Propósito: Admin lista todas las entregas de una tarea
```
**Uso**: Para que admin revise las entregas pendientes de aprobación.

**Incluye**: Datos del usuario que hizo la entrega (populate).

---

#### Función: `mySubmissionForTask(req, res)`
```javascript
Propósito: Trabajador consulta su propia entrega de una tarea
```
**Devuelve**: La submission del usuario para esa tarea específica, o null.

---

#### Función: `decideSubmission(req, res)`
```javascript
Propósito: Admin aprueba o rechaza una entrega
```
**Proceso**:
1. Recibe taskId y subId en params
2. Recibe action ("approve" o "reject") y feedback en body
3. Busca la submission
4. Actualiza status a "Aprobada" o "Rechazada"
5. Guarda feedback si lo hay
6. Actualiza estado de la tarea:
   - Si aprueba: tarea → "Completada"
   - Si rechaza: tarea → "Pendiente"
7. Devuelve submission actualizada

**Importante**: Aprobar NO otorga puntos automáticamente. El trabajador debe reclamarlos.

---

#### Función: `claimPoints(req, res)`
```javascript
Propósito: Trabajador reclama puntos de tarea aprobada
```
**Proceso**:
1. Recibe taskId en params
2. Busca submission aprobada del usuario
3. Valida que no haya sido reclamada antes
4. Busca la tarea para obtener los puntos
5. Suma puntos al usuario
6. Marca submission como claimed: true
7. Guarda cambios
8. Devuelve confirmación

**Validaciones**:
- Submission debe estar "Aprobada"
- No debe estar ya reclamada (claimed: false)
- Tarea debe existir

**Ejemplo**:
- Tarea vale 50 puntos
- Admin aprueba entrega
- Trabajador reclama
- Usuario pasa de 100 → 150 puntos

---

### 5. **recompensaController.js** - Gestión de Recompensas

#### Función: `crearRecompensa(req, res)`
```javascript
Propósito: Crear nuevas recompensas disponibles
```
**Campos**:
- nombre: "Día libre"
- descripcion: "Un día de descanso adicional"
- puntosRequeridos: 200
- limiteCanjes: 10 (opcional)
- fechaLimiteCanje: "2025-12-31" (opcional)

---

#### Función: `obtenerRecompensas(req, res)`
```javascript
Propósito: Listar todas las recompensas disponibles
```
**Uso**: Para que trabajadores vean qué pueden canjear.

---

#### Función: `actualizarRecompensa(req, res)`
```javascript
Propósito: Modificar una recompensa existente
```
**Casos de uso**:
- Cambiar el costo en puntos
- Ajustar límite de canjes
- Modificar descripción

---

#### Función: `eliminarRecompensa(req, res)`
```javascript
Propósito: Eliminar una recompensa
```

---

### 6. **historialCanjeController.js** - Historial de Canjes

#### Funciones CRUD básicas:
- `crearHistorialCanje`: Registrar un nuevo canje
- `obtenerHistorialesCanje`: Listar todos los canjes (con populate de usuario y recompensa)
- `actualizarHistorialCanje`: Modificar un registro
- `eliminarHistorialCanje`: Eliminar un registro

**Uso**: Mantener registro auditable de todos los canjes realizados.

---

### 7. **metaController.js** - Gestión de Metas

#### Funciones CRUD básicas:
- `crearMeta`: Crear nueva meta con tareas asociadas
- `obtenerMetas`: Listar metas (con populate de tareas)
- `actualizarMeta`: Modificar meta o su estado
- `eliminarMeta`: Eliminar meta

**Nota**: Esta funcionalidad está en desarrollo.

---

### 8. **rankingController.js** - Gestión de Rankings

#### Funciones CRUD básicas:
- `crearRanking`: Crear ranking
- `obtenerRankings`: Listar rankings (con populate de usuarios)
- `actualizarRanking`: Actualizar posiciones
- `eliminarRanking`: Eliminar ranking

**Nota**: Esta funcionalidad está en desarrollo.

---

## 🛡️ Backend - Middleware

### 1. **auth.js** - Middleware de Autenticación

#### Función: `authRequired(req, res, next)`
```javascript
Propósito: Verificar que el usuario esté autenticado
```

**Proceso**:
1. Lee header "Authorization"
2. Extrae el token (formato: "Bearer TOKEN")
3. Verifica el token con JWT_SECRET
4. Si válido: decodifica payload y lo asigna a req.user
5. Si válido: llama next() para continuar
6. Si inválido: devuelve 401

**Uso**: 
```javascript
router.get("/tareas", authRequired, obtenerTareas)
```

**req.user contiene**:
```javascript
{
  id: "usuario_id",
  email: "usuario@email.com",
  rol: "Trabajador"
}
```

---

### 2. **rolmiddleware.js** - Middleware de Roles

#### Función: `requireRol(rol)`
```javascript
Propósito: Verificar que el usuario tenga un rol específico
```

**Proceso**:
1. Recibe rol requerido como parámetro
2. Compara con req.user.rol
3. Si coincide: llama next()
4. Si no coincide: devuelve 403 (acceso denegado)

**Uso**:
```javascript
router.post("/tareas", authRequired, requireRol("Admin"), crearTarea)
```

**Esto significa**: 
- Usuario debe estar autenticado (authRequired)
- Usuario debe ser Admin (requireRol("Admin"))

---

### 3. **upload.js** - Middleware de Subida de Archivos

```javascript
Configuración de Multer para manejar uploads
```

**Configuración**:
- **Destino**: `/uploads/submissions/`
- **Nombre**: `timestamp__nombre_original.ext`
- **Tipos permitidos**: PDF, PNG, JPEG, TXT
- **Tamaño máximo**: 10MB

**Proceso**:
1. Crea directorio si no existe
2. Guarda archivo en disco
3. Filtra tipos de archivo permitidos
4. Valida tamaño
5. Adjunta info a req.file

**Uso**:
```javascript
router.post("/:id/submit", upload.single("file"), submitTask)
```

**req.file contiene**:
```javascript
{
  fieldname: "file",
  originalname: "evidencia.pdf",
  filename: "1234567890__evidencia.pdf",
  mimetype: "application/pdf",
  size: 2048576,
  path: "/uploads/submissions/1234567890__evidencia.pdf"
}
```

---

## 🛣️ Backend - Rutas

### 1. **authRoutes.js** - Rutas de Autenticación

```javascript
POST /api/auth/register  - Registrar nuevo usuario
POST /api/auth/login     - Iniciar sesión
GET  /api/auth/me        - Obtener perfil (requiere auth)
```

---

### 2. **tareaRoutes.js** - Rutas de Tareas y Entregas

```javascript
// Tareas
GET    /api/tasks/                        - Listar todas (auth)
GET    /api/tasks/user/list               - Listar mis tareas (trabajador)
POST   /api/tasks/                        - Crear tarea (admin)
PUT    /api/tasks/:id                     - Actualizar tarea (admin)
DELETE /api/tasks/:id                     - Eliminar tarea (admin)

// Entregas
POST   /api/tasks/:id/submit              - Subir entrega (trabajador)
GET    /api/tasks/:id/submissions         - Listar entregas (admin)
GET    /api/tasks/:id/submission          - Ver mi entrega (trabajador)
PATCH  /api/tasks/:taskId/submission/:subId/decision - Aprobar/Rechazar (admin)
POST   /api/tasks/:taskId/claim           - Reclamar puntos (trabajador)
```

---

### 3. **usuarioRoutes.js** - Rutas de Usuarios

```javascript
POST   /api/usuarios/           - Crear usuario
GET    /api/usuarios/           - Listar usuarios
GET    /api/usuarios/rol/:rol   - Filtrar por rol
PUT    /api/usuarios/:id        - Actualizar usuario
DELETE /api/usuarios/:id        - Eliminar usuario
```

---

### 4. **recompensaRoutes.js** - Rutas de Recompensas

```javascript
POST   /api/recompensas/     - Crear recompensa
GET    /api/recompensas/     - Listar recompensas
PUT    /api/recompensas/:id  - Actualizar recompensa
DELETE /api/recompensas/:id  - Eliminar recompensa
```

---

### 5. **historialCanjeRoutes.js** - Rutas de Historial

```javascript
POST   /api/historial-canje/     - Registrar canje
GET    /api/historial-canje/     - Listar canjes
PUT    /api/historial-canje/:id  - Actualizar registro
DELETE /api/historial-canje/:id  - Eliminar registro
```

---

### 6. **metaRoutes.js** - Rutas de Metas

```javascript
POST   /api/metas/     - Crear meta
GET    /api/metas/     - Listar metas
PUT    /api/metas/:id  - Actualizar meta
DELETE /api/metas/:id  - Eliminar meta
```

---

### 7. **rankingRoutes.js** - Rutas de Rankings

```javascript
POST   /api/rankings/     - Crear ranking
GET    /api/rankings/     - Listar rankings
PUT    /api/rankings/:id  - Actualizar ranking
DELETE /api/rankings/:id  - Eliminar ranking
```

---

## �� Frontend - Componentes

### 1. **App.jsx** - Componente Principal

```javascript
Propósito: Configurar rutas y estructura general de la app
```

**Rutas configuradas**:
- `/` → Redirige a `/login`
- `/login` → Página de inicio de sesión
- `/register` → Página de registro
- `/app/dashboard` → Dashboard (protegido)
- `/app/tareas/registro` → Crear tarea (protegido)
- `*` → Página 404

**Características**:
- Envuelve todo en `AuthProvider`
- Usa `ProtectedRoute` para rutas privadas
- React Router para navegación

---

### 2. **AuthContext.jsx** - Contexto de Autenticación

```javascript
Propósito: Gestionar estado global de autenticación
```

**Estado**:
- `user`: Datos del usuario actual o null
- `loading`: Si está cargando datos iniciales

**Funciones**:
- `login(email, password)`: Inicia sesión
- `register(data)`: Registra nuevo usuario
- `logout()`: Cierra sesión

**Proceso de boot**:
1. Al cargar la app, verifica si hay token en localStorage
2. Si hay token, llama a `/api/auth/me`
3. Si válido: carga datos del usuario
4. Si inválido: elimina token

**Uso en componentes**:
```javascript
const { user, login, logout } = useAuth()
```

---

### 3. **ProtectedRoute.jsx** - Ruta Protegida

```javascript
Propósito: Proteger rutas que requieren autenticación
```

**Lógica**:
1. Si loading: muestra cargando
2. Si no hay user: redirige a /login
3. Si hay user: renderiza el contenido (Outlet)

**Uso**: Envuelve rutas privadas en App.jsx

---

### 4. **Sidebar.jsx** - Barra Lateral de Navegación

```javascript
Propósito: Menú de navegación para usuarios autenticados
```

**Contenido típico**:
- Logo
- Enlaces a Dashboard
- Enlaces a Tareas
- Enlaces a Recompensas
- Botón de Logout
- Información del usuario actual

---

### 5. **Login.jsx** - Página de Inicio de Sesión

```javascript
Propósito: Formulario para iniciar sesión
```

**Campos**:
- Email
- Password

**Proceso**:
1. Usuario ingresa credenciales
2. Llama a `login(email, password)` del contexto
3. Si exitoso: redirige a Dashboard
4. Si error: muestra mensaje

---

### 6. **Register.jsx** - Página de Registro

```javascript
Propósito: Formulario para crear cuenta
```

**Campos**:
- Name
- Email
- Password
- Rol (Admin/Lider/Trabajador)

**Proceso**:
1. Usuario completa formulario
2. Llama a `register(data)` del contexto
3. Si exitoso: redirige a Dashboard
4. Si error: muestra mensaje

---

### 7. **Dashboard.jsx** - Panel Principal

```javascript
Propósito: Vista principal después de login
```

**Muestra** (versión actual con datos estáticos):
- **KPIs**:
  - Tareas completadas
  - Metas alcanzadas
  - Puntos acumulados
  - Recompensas canjeadas
- **Progreso de tareas** (barra de progreso)
- **Recompensas disponibles** (lista)
- **Tareas recientes** (lista)
- **Canjes recientes** (lista)

**Nota**: Actualmente usa datos de ejemplo. Debe conectarse a la API.

---

### 8. **TaskRegister.jsx** - Registro de Tareas

```javascript
Propósito: Formulario para crear nuevas tareas (Admin)
```

**Campos típicos**:
- Título
- Descripción
- Fecha límite
- Puntos
- Archivos adjuntos (opcional)

**Proceso**:
1. Admin completa formulario
2. Llama a `createTask(data)` del servicio API
3. Si exitoso: muestra confirmación
4. Redirige o actualiza lista

---

## 🔌 Frontend - Servicios

### **api.js** - Servicio de API

```javascript
Propósito: Centralizar todas las llamadas HTTP al backend
```

#### Función: `http(path, options)`
```javascript
Función auxiliar para hacer peticiones HTTP
```
**Maneja**:
- Headers (Content-Type, Authorization)
- FormData para uploads
- JSON para datos normales
- Errores y mensajes de error

---

#### Funciones de Autenticación:

**`login(email, password)`**
- POST /api/auth/login
- Devuelve: { token, user }

**`register(payload)`**
- POST /api/auth/register
- Devuelve: { token, user }

**`getProfile(token)`**
- GET /api/auth/me
- Devuelve: Datos del usuario

---

#### Funciones de Tareas:

**`createTask(payload)`**
- POST /api/tasks
- Crea nueva tarea

**`listTasks()`**
- GET /api/tasks
- Lista todas las tareas

**`listUserTasks()`**
- GET /api/tasks/user/list
- Lista tareas del usuario con info de entregas

**`updateTask(id, data)`**
- PUT /api/tasks/:id
- Actualiza tarea

**`deleteTask(id)`**
- DELETE /api/tasks/:id
- Elimina tarea

---

#### Funciones de Entregas:

**`submitTaskFile(taskId, file)`**
- POST /api/tasks/:id/submit
- Sube archivo de evidencia (FormData)

**`listTaskSubmissions(taskId)`**
- GET /api/tasks/:id/submissions
- Lista entregas de una tarea (admin)

**`decideSubmission(taskId, subId, action, feedback)`**
- PATCH /api/tasks/:taskId/submission/:subId/decision
- Aprueba o rechaza entrega
- action: "approve" o "reject"

**`claimPoints(taskId)`**
- POST /api/tasks/:taskId/claim
- Reclama puntos de tarea aprobada

**`completeTask(id)`**
- PUT /api/tasks/:id
- Marca tarea como completada

---

## 🔄 Flujo de Trabajo del Sistema

### 🎯 Flujo 1: Creación y Asignación de Tarea

```
1. ADMIN: Inicia sesión
2. ADMIN: Va a "Crear Tarea"
3. ADMIN: Completa formulario:
   - Título: "Capacitación en ventas"
   - Descripción: "Completar curso online"
   - Puntos: 100
   - Fecha límite: 2025-02-15
4. ADMIN: Envía formulario
5. BACKEND: Valida que es Admin
6. BACKEND: Crea tarea con status "Pendiente"
7. BACKEND: Guarda en MongoDB
8. FRONTEND: Muestra confirmación
9. TRABAJADOR: Puede ver la tarea en su lista
```

---

### 📤 Flujo 2: Entrega de Tarea por Trabajador

```
1. TRABAJADOR: Inicia sesión
2. TRABAJADOR: Ve lista de tareas disponibles
3. TRABAJADOR: Selecciona tarea "Capacitación en ventas"
4. TRABAJADOR: Completa la tarea
5. TRABAJADOR: Sube evidencia (PDF del certificado)
6. FRONTEND: Envía archivo con FormData
7. BACKEND: Middleware de upload guarda archivo
8. BACKEND: Crea Submission con:
   - task: ID de la tarea
   - user: ID del trabajador
   - filePath: ruta del archivo
   - status: "Pendiente"
   - claimed: false
9. BACKEND: Actualiza tarea a status "Pendiente"
10. FRONTEND: Muestra "Entrega en revisión"
```

---

### ✅ Flujo 3: Aprobación de Entrega

```
1. ADMIN: Inicia sesión
2. ADMIN: Ve lista de entregas pendientes
3. ADMIN: Selecciona entrega de "Juan - Capacitación"
4. ADMIN: Descarga y revisa el archivo
5. ADMIN: Decide aprobar
6. ADMIN: (Opcional) Escribe feedback: "Excelente trabajo"
7. ADMIN: Confirma aprobación
8. BACKEND: Actualiza Submission:
   - status: "Aprobada"
   - feedback: "Excelente trabajo"
9. BACKEND: Actualiza Tarea:
   - status: "Completada"
10. FRONTEND: Trabajador ve "Tarea aprobada - Reclamar puntos"
```

---

### 💰 Flujo 4: Reclamar Puntos

```
1. TRABAJADOR: Ve tarea aprobada
2. TRABAJADOR: Click en "Reclamar puntos"
3. BACKEND: Valida que submission está aprobada
4. BACKEND: Valida que claimed = false
5. BACKEND: Busca puntos de la tarea (100 puntos)
6. BACKEND: Suma puntos al usuario:
   - Usuario.points: 0 → 100
7. BACKEND: Marca Submission.claimed = true
8. FRONTEND: Muestra "¡100 puntos reclamados!"
9. FRONTEND: Actualiza contador de puntos del usuario
```

---

### 🎁 Flujo 5: Canje de Recompensa

```
1. TRABAJADOR: Ve sus puntos (100 puntos)
2. TRABAJADOR: Navega a "Recompensas"
3. TRABAJADOR: Ve lista:
   - Almuerzo gratis (75 puntos) ✅ Puede canjear
   - Día libre (200 puntos) ❌ No tiene suficientes
4. TRABAJADOR: Selecciona "Almuerzo gratis"
5. TRABAJADOR: Confirma canje
6. BACKEND: Valida puntos suficientes
7. BACKEND: Resta puntos:
   - Usuario.points: 100 → 25
8. BACKEND: Crea HistorialCanje:
   - usuario: ID del trabajador
   - recompensa: ID de "Almuerzo gratis"
   - fechaCanje: ahora
9. BACKEND: Incrementa Recompensa.cantidadCanjes
10. FRONTEND: Muestra "¡Recompensa canjeada! Te quedan 25 puntos"
```

---

### ❌ Flujo 6: Rechazo de Entrega

```
1. ADMIN: Revisa entrega
2. ADMIN: Encuentra que el archivo no es válido
3. ADMIN: Selecciona "Rechazar"
4. ADMIN: Escribe feedback: "El certificado está incompleto"
5. ADMIN: Confirma rechazo
6. BACKEND: Actualiza Submission:
   - status: "Rechazada"
   - feedback: "El certificado está incompleto"
7. BACKEND: Actualiza Tarea:
   - status: "Pendiente"
8. FRONTEND: Trabajador ve mensaje de rechazo y feedback
9. TRABAJADOR: Puede subir nueva evidencia corregida
```

---

## 🔐 Sistema de Roles y Permisos

### Rol: **Admin**

**Puede**:
- ✅ Crear, editar y eliminar tareas
- ✅ Ver todas las tareas del sistema
- ✅ Ver todas las entregas (submissions)
- ✅ Aprobar o rechazar entregas
- ✅ Crear, editar y eliminar recompensas
- ✅ Crear, editar y eliminar usuarios
- ✅ Ver rankings y metas
- ✅ Ver historial de canjes

**No puede**:
- ❌ Subir entregas de tareas
- ❌ Reclamar puntos
- ❌ Canjear recompensas (como trabajador)

---

### Rol: **Lider**

**Estado**: Rol definido pero funcionalidad en desarrollo

**Puede (planeado)**:
- Ver tareas de su equipo
- Aprobar entregas de su equipo
- Ver reportes de su equipo

---

### Rol: **Trabajador**

**Puede**:
- ✅ Ver tareas disponibles
- ✅ Subir entregas (evidencia) de tareas
- ✅ Ver estado de sus entregas
- ✅ Reclamar puntos de tareas aprobadas
- ✅ Ver recompensas disponibles
- ✅ Canjear puntos por recompensas
- ✅ Ver su historial de canjes
- ✅ Ver su ranking

**No puede**:
- ❌ Crear, editar o eliminar tareas
- ❌ Aprobar o rechazar entregas
- ❌ Ver entregas de otros usuarios
- ❌ Gestionar recompensas
- ❌ Gestionar usuarios

---

## 🛠️ Stack Tecnológico

### Backend:
```
- Node.js v18+           → Runtime de JavaScript
- Express 4.x            → Framework web minimalista
- MongoDB 6.x            → Base de datos NoSQL
- Mongoose 7.x           → ODM para MongoDB
- JWT (jsonwebtoken)     → Autenticación con tokens
- bcrypt                 → Hash de contraseñas
- multer                 → Manejo de archivos
- dotenv                 → Variables de entorno
- cors                   → CORS para peticiones cross-origin
```

### Frontend:
```
- React 18.x             → Librería de UI
- Vite 4.x               → Build tool y dev server
- React Router DOM 6.x   → Navegación y rutas
- CSS3                   → Estilos personalizados
```

### Herramientas de Desarrollo:
```
- nodemon                → Auto-reload del servidor
- ESLint                 → Linter de código
- Git                    → Control de versiones
```

### Base de Datos:
```
MongoDB
├── usuarios             → Usuarios (Admin, Lider, Trabajador)
├── tareas               → Tareas del sistema
├── submissions          → Entregas de trabajadores
├── recompensas          → Recompensas disponibles
├── historialcanjes      → Registro de canjes
├── metas                → Metas del equipo
└── rankings             → Rankings de desempeño
```

---

## 📦 Variables de Entorno

### Backend (.env):
```bash
PORT=4000                                    # Puerto del servidor
MONGO_URI=mongodb://localhost:27017/taskrewardpro  # URI de MongoDB
JWT_SECRET=tu_secreto_super_seguro_aqui     # Secreto para JWT
```

### Frontend (.env):
```bash
VITE_API_URL=http://localhost:4000          # URL del backend
```

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Configuración Inicial

```bash
# Clonar repositorio
git clone <url-del-repo>
cd TaskRewardPro

# Instalar dependencias del backend
cd Back
npm install

# Instalar dependencias del frontend
cd ../Front
npm install
```

### 2. Configurar Variables de Entorno

**Backend**: Crear `Back/.env`:
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/taskrewardpro
JWT_SECRET=cambiar_este_secreto_en_produccion
```

**Frontend**: Crear `Front/.env`:
```
VITE_API_URL=http://localhost:4000
```

### 3. Iniciar MongoDB

```bash
# Con Docker:
docker run -d -p 27017:27017 --name mongodb mongo

# O con instalación local:
mongod
```

### 4. Ejecutar Backend

```bash
cd Back
npm run dev     # con nodemon (desarrollo)
# o
npm start       # con node (producción)
```

El servidor estará en: `http://localhost:4000`

### 5. Ejecutar Frontend

```bash
cd Front
npm run dev
```

La aplicación estará en: `http://localhost:5173`

---

## 🎓 Conceptos Clave para tu Exposición

### 1. **Arquitectura MVC (Modelo-Vista-Controlador)**
- **Modelos** (models/): Definen la estructura de datos
- **Vistas** (Frontend): Interfaz de usuario
- **Controladores** (controllers/): Lógica de negocio

### 2. **REST API**
- Comunicación mediante HTTP
- Endpoints bien definidos
- Respuestas en JSON
- Códigos de estado HTTP (200, 201, 400, 401, 403, 404, 500)

### 3. **Autenticación JWT**
- Token generado al login
- Incluido en cada petición (header Authorization)
- Contiene información del usuario (id, email, rol)
- Válido por 7 días

### 4. **Mongoose Discriminators**
- Herencia en modelos
- Usuario base → Admin y Trabajador heredan de él
- Misma colección, diferentes tipos

### 5. **Middleware en Express**
- Funciones que se ejecutan entre petición y respuesta
- authRequired: Valida token
- requireRol: Valida rol
- upload: Maneja archivos

### 6. **Context API de React**
- Gestión de estado global
- AuthContext: Estado de autenticación compartido
- Evita prop drilling

### 7. **Rutas Protegidas**
- ProtectedRoute: Verifica autenticación
- Redirige a login si no está autenticado

---

## 📊 Diagramas para tu Exposición

### Diagrama de Flujo de Autenticación:
```
Usuario → Login Form → API /auth/login → Valida credenciales
                                        ↓
                      Token JWT ← Genera token
                         ↓
              localStorage.setItem("token")
                         ↓
              AuthContext actualiza user
                         ↓
              Redirige a Dashboard
```

### Diagrama de Entidad-Relación:
```
Usuario (1) ──── crea ───→ (N) Tarea
Usuario (1) ──── entrega ─→ (N) Submission
Submission (N) ─ pertenece → (1) Tarea
Usuario (N) ──── canjea ──→ (N) Recompensa
HistorialCanje registra relación Usuario-Recompensa
Meta (1) ──── incluye ───→ (N) Tarea
Ranking (1) ─── ordena ──→ (N) Usuario
```

---

## ⚠️ Estado Actual del Proyecto

### ✅ Funcionalidades Implementadas:
- Registro y login de usuarios
- Autenticación con JWT
- Crear y listar tareas
- Subir evidencia de tareas (archivos)
- Aprobar/rechazar entregas
- Reclamar puntos
- Sistema de roles (Admin, Trabajador)
- Gestión de recompensas (CRUD)
- Historial de canjes (CRUD)

### 🚧 En Desarrollo:
- Rankings dinámicos
- Metas y seguimiento
- Dashboard con datos reales (actualmente usa datos estáticos)
- Canje de recompensas (interfaz)
- Notificaciones por email
- Mejoras en UI/UX

### 📝 Pendiente:
- Rol de Líder (funcionalidad completa)
- Analytics y reportes
- Gestión avanzada de permisos
- Filtros y búsquedas avanzadas
- Exportar reportes (PDF, Excel)
- Sistema de notificaciones en tiempo real

---

## 💡 Puntos Fuertes para Destacar

1. **Arquitectura Escalable**: Separación clara entre frontend y backend
2. **Seguridad**: Contraseñas hasheadas, JWT, middleware de roles
3. **RESTful**: API bien estructurada siguiendo convenciones REST
4. **Validaciones**: A nivel de modelo (Mongoose) y controlador
5. **Herencia de Modelos**: Uso inteligente de discriminadores
6. **Manejo de Archivos**: Configuración robusta con multer
7. **Gestión de Estado**: Context API para auth
8. **Código Modular**: Fácil de mantener y extender

---

## 🎯 Objetivos del Proyecto

### Para la Empresa:
- Aumentar productividad
- Mejorar motivación del equipo
- Reconocer esfuerzo individual
- Fomentar cultura de logros
- Transparencia en desempeño

### Para los Trabajadores:
- Visibilidad de su progreso
- Recompensas tangibles
- Competencia saludable
- Claridad en expectativas
- Reconocimiento por esfuerzo

### Para los Administradores:
- Seguimiento de tareas
- Métricas de desempeño
- Gestión eficiente de recompensas
- Control de presupuesto de puntos
- Reportes de productividad

---

## 🔍 Preguntas Comunes para tu Exposición

**P: ¿Por qué MongoDB y no SQL?**
R: MongoDB ofrece flexibilidad para esquemas cambiantes, es ideal para desarrollo ágil y escala bien horizontalmente.

**P: ¿Por qué JWT y no sesiones?**
R: JWT es stateless, funciona bien en arquitecturas distribuidas y permite autenticación sin almacenar sesiones en el servidor.

**P: ¿Cómo se evita que un trabajador reclame puntos múltiples veces?**
R: El campo `claimed` en Submission se valida antes de otorgar puntos.

**P: ¿Qué pasa si un admin rechaza una entrega?**
R: El trabajador puede subir nueva evidencia; la anterior se elimina automáticamente.

**P: ¿Cómo se protegen las rutas?**
R: Mediante middleware authRequired y requireRol que validan token y rol.

**P: ¿Dónde se almacenan los archivos subidos?**
R: En el servidor, en `/uploads/submissions/` con nombres únicos basados en timestamp.

---

## 📝 Conclusión

TaskRewardPro es un sistema completo de gestión de tareas y recompensas que integra:
- **Backend robusto** con Node.js, Express y MongoDB
- **Frontend reactivo** con React y Vite
- **Seguridad** mediante JWT y bcrypt
- **Roles y permisos** bien definidos
- **Gestión de archivos** con multer
- **API RESTful** bien estructurada

El proyecto está en desarrollo activo y ya cuenta con funcionalidades core funcionando. Es una solución escalable y mantenible para mejorar la productividad y motivación en equipos de trabajo.

---

## 👥 Equipo de Desarrollo

- Juan Felipe Hincapié Machado
- Daniel Alberto Ospina Zarza
- Sebastián Quiceno Muñoz
- Juan Sebastián Pérez Moncada

---

## 📚 Referencias y Recursos

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [React Documentation](https://react.dev/)
- [JWT.io](https://jwt.io/)
- [MongoDB Manual](https://docs.mongodb.com/)

---

**¡Buena suerte con tu exposición! 🚀**
