# 🎤 Guía para la Exposición - TaskRewardPro

## 🎯 Estructura Sugerida de la Presentación (30-45 minutos)

### 1. INTRODUCCIÓN (5 minutos)

#### Slide 1: Portada
```
TaskRewardPro
Sistema de Gestión de Tareas y Recompensas

Equipo:
• Juan Felipe Hincapié Machado
• Daniel Alberto Ospina Zarza
• Sebastián Quiceno Muñoz
• Juan Sebastián Pérez Moncada
```

#### Slide 2: Problema que Resuelve
**Puntos clave:**
- La motivación del equipo es crucial para la productividad
- Muchas empresas no tienen sistemas claros de reconocimiento
- Los trabajadores no ven el impacto de su esfuerzo
- Falta transparencia en evaluaciones de desempeño

**Solución:**
TaskRewardPro gamifica el trabajo mediante:
- Puntos por tareas completadas
- Recompensas canjeables
- Rankings visibles
- Reconocimiento automático

---

### 2. VISIÓN GENERAL DEL SISTEMA (5 minutos)

#### Slide 3: ¿Qué es TaskRewardPro?
```
Un sistema web que:
✅ Permite a ADMINS crear tareas con puntos
✅ TRABAJADORES completan tareas y suben evidencia
✅ ADMINS aprueban o rechazan entregas
✅ TRABAJADORES reclaman puntos
✅ Puntos se canjean por recompensas
```

#### Slide 4: Arquitectura General
```
[Mostrar diagrama de arquitectura de 3 capas]

Frontend (React)
    ↓
Backend (Node.js + Express)
    ↓
Database (MongoDB)
```

**Explicar:**
- Frontend maneja la interfaz de usuario
- Backend procesa la lógica de negocio
- MongoDB almacena toda la información
- Comunicación vía REST API (JSON)

---

### 3. TECNOLOGÍAS UTILIZADAS (5 minutos)

#### Slide 5: Stack Tecnológico

**Backend:**
```javascript
• Node.js        → Runtime de JavaScript en servidor
• Express        → Framework web minimalista y rápido
• MongoDB        → Base de datos NoSQL flexible
• Mongoose       → ODM (Object Document Mapper)
• JWT            → Autenticación sin estado
• bcrypt         → Hash seguro de contraseñas
• Multer         → Manejo de archivos
```

**Frontend:**
```javascript
• React          → Librería de interfaces interactivas
• Vite           → Build tool super rápido
• React Router   → Navegación entre páginas
• Context API    → Manejo de estado global
```

**¿Por qué estas tecnologías?**
- Node.js: JavaScript en todo el stack (mismo lenguaje)
- MongoDB: Flexibilidad para cambiar esquemas
- React: Componentes reutilizables, gran comunidad
- JWT: Autenticación escalable sin sesiones en servidor

---

### 4. ARQUITECTURA DEL BACKEND (10 minutos)

#### Slide 6: Modelos de Datos

**Mostrar diagrama de entidad-relación**

**Modelos principales:**

1. **Usuario** (modelo base)
   - name, email, password (hasheado), rol, points
   - Herencia: Admin y Trabajador

2. **Tarea**
   - title, description, points, dueDate, status
   - Creada por Admin

3. **Submission** (Entrega)
   - Vincula Tarea + Usuario
   - Almacena archivo subido
   - Estados: Pendiente, Aprobada, Rechazada
   - Campo claimed: si ya reclamó puntos

4. **Recompensa**
   - nombre, descripcion, puntosRequeridos
   - limiteCanjes, cantidadCanjes

#### Slide 7: Controladores (Lógica de Negocio)

**Explicar con ejemplos:**

```javascript
authController.js
→ register(): Crea usuario, hashea password, genera JWT
→ login(): Valida credenciales, genera JWT
→ me(): Devuelve datos del usuario autenticado

tareaController.js
→ crearTarea(): Admin crea nueva tarea
→ obtenerTareas(): Lista todas las tareas
→ obtenerTareasUsuario(): Lista con info de entregas

submissionController.js
→ submitTask(): Trabajador sube evidencia
→ decideSubmission(): Admin aprueba/rechaza
→ claimPoints(): Trabajador reclama puntos
```

#### Slide 8: Middleware (Seguridad)

**Explicar capas de seguridad:**

```javascript
1. authRequired
   • Valida que el token JWT sea válido
   • Extrae información del usuario (id, email, rol)
   • Si inválido → 401 Unauthorized

2. requireRol(rol)
   • Valida que el usuario tenga el rol requerido
   • Si no coincide → 403 Forbidden

3. upload
   • Maneja subida de archivos con Multer
   • Valida tipo de archivo (PDF, PNG, JPEG)
   • Limita tamaño (10MB)
```

**Ejemplo de uso:**
```javascript
router.post(
  "/api/tasks",
  authRequired,        // ← Paso 1: Usuario autenticado
  requireRol("Admin"), // ← Paso 2: Usuario es Admin
  crearTarea          // ← Paso 3: Ejecuta controlador
)
```

---

### 5. ARQUITECTURA DEL FRONTEND (5 minutos)

#### Slide 9: Componentes de React

**Estructura:**
```
App.jsx                → Rutas principales
├── Login              → Página pública
├── Register           → Página pública
└── ProtectedRoute     → Rutas privadas
    ├── Dashboard      → Panel principal
    ├── TaskRegister   → Crear tarea (Admin)
    └── ...
```

**Componentes clave:**

1. **AuthContext.jsx**
   - Maneja estado global de autenticación
   - Funciones: login, register, logout
   - Almacena usuario actual

2. **ProtectedRoute.jsx**
   - Guard para rutas privadas
   - Redirige a /login si no está autenticado

3. **api.js**
   - Centraliza todas las llamadas HTTP
   - Maneja headers (Authorization)
   - Gestiona errores

---

### 6. FLUJO DE TRABAJO COMPLETO (10 minutos)

#### Slide 10: Demostración del Flujo

**PASO 1: Admin crea tarea**
```
[Mostrar captura de pantalla o hacer demo en vivo]

Admin ingresa:
• Título: "Completar capacitación en ventas"
• Descripción: "Ver curso completo y aprobar examen"
• Puntos: 100
• Fecha límite: 2025-02-15

→ Se crea tarea con status "Pendiente"
```

**PASO 2: Trabajador sube evidencia**
```
[Mostrar captura]

Trabajador:
1. Ve lista de tareas disponibles
2. Selecciona "Completar capacitación en ventas"
3. Sube archivo PDF (certificado del curso)
4. Sistema crea Submission con status "Pendiente"
5. Ve mensaje: "Entrega en revisión"
```

**PASO 3: Admin aprueba entrega**
```
[Mostrar captura]

Admin:
1. Ve lista de entregas pendientes
2. Descarga y revisa el certificado
3. Decide: "Aprobar"
4. (Opcional) Escribe feedback: "Excelente trabajo"
5. Sistema actualiza:
   - Submission → status "Aprobada"
   - Tarea → status "Completada"
```

**PASO 4: Trabajador reclama puntos**
```
[Mostrar captura]

Trabajador:
1. Ve tarea con status "Aprobada"
2. Click en "Reclamar puntos"
3. Sistema:
   - Valida que no haya reclamado antes
   - Suma 100 puntos al usuario
   - Marca Submission.claimed = true
4. Ve mensaje: "¡100 puntos reclamados!"
5. Contador de puntos actualizado
```

**PASO 5: Canjear recompensa**
```
[Mostrar captura]

Trabajador:
1. Ve sus puntos: 100
2. Navega a "Recompensas disponibles"
3. Ve:
   - Almuerzo gratis (75 pts) ✅
   - Día libre (200 pts) ❌
4. Selecciona "Almuerzo gratis"
5. Sistema:
   - Resta 75 puntos (100 → 25)
   - Crea registro en HistorialCanje
6. Ve: "¡Recompensa canjeada! Te quedan 25 puntos"
```

---

### 7. SEGURIDAD Y AUTENTICACIÓN (5 minutos)

#### Slide 11: Sistema de Autenticación JWT

**¿Cómo funciona?**

```
1. Usuario envía email + password
   ↓
2. Backend valida con bcrypt
   ↓
3. Si correcto, genera token JWT
   ↓
4. Token incluye: { id, email, rol }
   ↓
5. Frontend guarda token en localStorage
   ↓
6. Cada petición incluye: Authorization: Bearer <token>
   ↓
7. Middleware authRequired valida el token
```

**Ventajas de JWT:**
- ✅ Sin estado (stateless): no requiere sesiones en servidor
- ✅ Escalable: funciona en múltiples servidores
- ✅ Seguro: firmado con secreto (JWT_SECRET)
- ✅ Expirable: válido por 7 días

**Seguridad de contraseñas:**
```javascript
// Nunca guardamos contraseñas en texto plano
const hash = await bcrypt.hash(password, 10)

// En BD se guarda:
"$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36..."

// Para validar:
const ok = await bcrypt.compare(passwordIngresado, hash)
```

#### Slide 12: Sistema de Roles y Permisos

**Roles definidos:**
- **Admin**: Gestiona todo el sistema
- **Trabajador**: Completa tareas y canjea puntos
- **Líder**: (En desarrollo) Gestiona su equipo

**Control de acceso:**
```javascript
// Solo Admin puede crear tareas
POST /api/tasks
→ authRequired + requireRol("Admin")

// Solo Trabajador puede subir entregas
POST /api/tasks/:id/submit
→ authRequired + requireRol("Trabajador")
```

---

### 8. ESTADO ACTUAL Y ROADMAP (3 minutos)

#### Slide 13: Funcionalidades Implementadas

**✅ Ya funciona:**
- Registro y login de usuarios
- Autenticación con JWT
- Crear y listar tareas
- Subir evidencia (archivos)
- Aprobar/rechazar entregas
- Reclamar puntos
- Sistema de roles (Admin, Trabajador)
- Gestión de recompensas

**🚧 En desarrollo:**
- Rankings dinámicos
- Metas y seguimiento de progreso
- Dashboard con datos reales (usa estáticos ahora)
- Interfaz para canje de recompensas
- Rol de Líder completo

**📝 Futuro:**
- Notificaciones por email
- Reportes y analytics
- Exportar a PDF/Excel
- Notificaciones en tiempo real

---

### 9. DEMO EN VIVO (Si es posible) (5 minutos)

**Preparar antes:**
- Tener MongoDB corriendo
- Backend iniciado en http://localhost:4000
- Frontend iniciado en http://localhost:5173
- Usuario Admin creado
- Usuario Trabajador creado

**Demo sugerida:**
1. Login como Admin
2. Crear una tarea rápida
3. Logout y login como Trabajador
4. Subir evidencia de la tarea
5. Logout y login como Admin
6. Aprobar la entrega
7. Logout y login como Trabajador
8. Reclamar puntos
9. Mostrar puntos actualizados

---

### 10. CONCLUSIONES (2 minutos)

#### Slide 14: Conclusiones

**Logros del proyecto:**
- ✅ Sistema completo y funcional
- ✅ Arquitectura escalable y mantenible
- ✅ Buenas prácticas de seguridad
- ✅ Código modular y bien estructurado
- ✅ Autenticación robusta con JWT
- ✅ Manejo seguro de archivos

**Aprendizajes:**
- Desarrollo full-stack con tecnologías modernas
- Diseño de APIs RESTful
- Autenticación y autorización
- Gestión de estado en React
- Mongoose y modelado de datos NoSQL
- Middleware y arquitectura por capas

**Impacto esperado:**
- Mejora en motivación del equipo
- Reconocimiento transparente de esfuerzos
- Aumento en productividad
- Cultura de logros y competencia saludable

---

## 🎯 Tips para la Presentación

### Antes de Presentar:
1. **Practica el flujo completo** al menos 3 veces
2. **Prepara la demo** con datos de prueba
3. **Ten capturas de pantalla** por si falla la demo
4. **Revisa todos los diagramas** y asegúrate de entenderlos
5. **Prepara respuestas** a preguntas comunes (ver más abajo)

### Durante la Presentación:
1. **Habla claro y pausado**
2. **Usa ejemplos concretos** ("Imaginen que Juan completa una tarea...")
3. **Señala en los diagramas** mientras explicas
4. **Involucra a la audiencia** ("¿Han usado sistemas similares?")
5. **Controla el tiempo** (usa alarmas cada 10 minutos)

### Lenguaje Técnico:
- **Explica acrónimos** la primera vez (JWT, API, REST, CRUD)
- **Usa analogías** ("JWT es como una credencial que llevas siempre")
- **Simplifica cuando sea necesario** ("Mongoose es como un traductor entre JavaScript y MongoDB")

---

## ❓ Preguntas Frecuentes y Respuestas

### Sobre Arquitectura:

**P1: ¿Por qué separaron frontend y backend?**
```
R: Separación de responsabilidades (SoC):
- Frontend: Solo interfaz y experiencia de usuario
- Backend: Solo lógica de negocio y datos
- Permite escalar independientemente
- Facilita trabajo en equipo (unos en frontend, otros en backend)
- Posibilidad de tener múltiples frontends (web, móvil)
```

**P2: ¿Por qué MongoDB y no MySQL?**
```
R: 
- Flexibilidad: Esquemas cambiantes sin migraciones complejas
- Escalabilidad horizontal: Sharding nativo
- JSON nativo: Misma estructura en BD y API
- Mongoose: ODM potente con validaciones
- Mejor para desarrollo ágil donde los requisitos cambian

Para TaskRewardPro:
- Discriminators de Mongoose para herencia (Usuario → Admin, Trabajador)
- Esquemas flexibles para agregar campos sin romper nada
```

**P3: ¿Por qué JWT y no sesiones tradicionales?**
```
R:
- Stateless: No requiere memoria en servidor
- Escalable: Funciona con múltiples servidores (load balancing)
- Mobile-friendly: Fácil de usar en apps móviles
- Microservicios: Token se puede validar en cualquier servicio
- Info en el token: Incluye datos del usuario (id, rol)

Desventajas que consideramos:
- No se puede revocar fácilmente (pero expira en 7 días)
- Tamaño del token es mayor que session ID
```

---

### Sobre Seguridad:

**P4: ¿Cómo protegen las contraseñas?**
```
R:
1. Nunca guardamos contraseñas en texto plano
2. Usamos bcrypt con salt rounds = 10
3. Hash es irreversible (one-way)
4. Cada hash es único aunque password sea igual

Ejemplo:
Password: "123456"
Hash: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36..."
→ Imposible obtener "123456" del hash
```

**P5: ¿Qué pasa si alguien roba el token JWT?**
```
R:
- Token expira en 7 días (configuramos expiresIn: "7d")
- Se puede acortar el tiempo de expiración (ej: 1 hora)
- Implementar refresh tokens (en roadmap)
- HTTPS en producción para evitar man-in-the-middle
- No guardar info sensible en el payload del JWT

Mejoras futuras:
- Token blacklist para revocación
- Refresh tokens para renovar sin login
- IP validation
```

**P6: ¿Cómo evitan inyección de código?**
```
R:
- Mongoose sanitiza automáticamente queries
- Express.json() parsea body de forma segura
- Validaciones en controladores
- No usamos eval() ni similar
- Multer filtra tipos de archivo

Ejemplo de protección:
Usuario envía: { email: "admin@x.com", $ne: null }
Mongoose lo trata como string, no como operador
```

---

### Sobre Funcionalidad:

**P7: ¿Qué pasa si un trabajador sube múltiples evidencias?**
```
R:
- submitTask() elimina entregas previas del mismo usuario/tarea
- Solo la última evidencia cuenta
- Admin siempre ve la más reciente

Código:
await Submission.deleteMany({ task: taskId, user: userId })
await Submission.create({ ... })
```

**P8: ¿Puede un trabajador reclamar puntos múltiples veces?**
```
R: NO
- Campo "claimed" en Submission lo previene
- claimPoints() valida: if (claimed) → error
- Una vez claimed: true, no se puede volver a reclamar

Flujo:
1. Submission aprobada, claimed: false
2. Trabajador reclama → claimed: true, puntos sumados
3. Intenta reclamar de nuevo → Error: "Ya reclamaste"
```

**P9: ¿Qué pasa si admin rechaza una entrega?**
```
R:
- Submission status → "Rechazada"
- Tarea status → "Pendiente" (vuelve a estar disponible)
- Trabajador ve feedback del admin
- Trabajador puede subir nueva evidencia
- Nueva evidencia reemplaza la rechazada
```

**P10: ¿Cómo se calculan los rankings?**
```
R: (Funcionalidad en desarrollo)
Plan:
- Job programado (cron) cada X tiempo
- Ordena usuarios por:
  1. Total de puntos
  2. Tareas completadas
  3. Velocidad de completado
- Actualiza colección Rankings
- Frontend muestra tabla ordenada

Ranking actual es placeholder con datos estáticos
```

---

### Sobre Implementación:

**P11: ¿Cómo manejan los archivos subidos?**
```
R:
- Multer guarda archivos en /uploads/submissions/
- Nombre único: timestamp__nombre_original.ext
- Tipos permitidos: PDF, PNG, JPEG, TXT
- Tamaño máximo: 10MB
- Backend sirve archivos: app.use("/uploads", express.static(...))

Estructura:
/uploads/submissions/1706097600__certificado.pdf

Mejora futura:
- Subir a S3, Google Cloud Storage
- CDN para distribución
- Compresión de imágenes
```

**P12: ¿Por qué usan discriminators en Mongoose?**
```
R:
- Permite herencia de modelos
- Todos en misma colección (usuarios)
- Campo __t indica el tipo (Admin, Trabajador)
- Cada discriminator puede tener campos adicionales
- Evita colecciones separadas

Beneficio:
- Una query trae todos los usuarios
- Fácil agregar nuevos roles
- Polimorfismo en BD NoSQL

Usuario base: name, email, password, rol, points
Admin: (hereda todo de Usuario)
Trabajador: (hereda todo + cargo + puntos adicionales)
```

---

### Sobre Escalabilidad:

**P13: ¿Puede el sistema manejar 1000 usuarios?**
```
R: Sí, con optimizaciones:

Actualmente:
- Arquitectura preparada para escalar
- JWT sin estado (stateless)
- MongoDB escala horizontalmente

Optimizaciones necesarias:
- Índices en MongoDB (email, userId, taskId)
- Paginación en queries grandes
- Caché con Redis
- Load balancer para múltiples instancias backend
- CDN para archivos estáticos

Bottlenecks potenciales:
- Uploads de archivos (mover a S3)
- Queries sin índices (agregar índices)
```

**P14: ¿Funcionaría con múltiples equipos?**
```
R: Sí, con ajustes:

Agregar entidad "Equipo":
- Usuario pertenece a Equipo
- Tarea asignada a Equipo
- Líder gestiona su Equipo
- Rankings por Equipo

Cambios en BD:
- Usuario: equipoId (ref: Equipo)
- Tarea: equipoId (ref: Equipo)
- Filtros en queries por equipo

Rol de Líder cobra sentido:
- Ve solo tareas de su equipo
- Aprueba solo entregas de su equipo
```

---

### Sobre Testing y Calidad:

**P15: ¿Tienen tests?**
```
R: (Depende del estado real)

Respuesta honesta:
"Actualmente no tenemos tests automatizados. 
Hemos probado manualmente todas las funcionalidades.

Para producción, implementaríamos:
- Unit tests (Jest) para funciones críticas
- Integration tests para endpoints
- E2E tests (Cypress) para flujos completos
- Tests de seguridad (SQL injection, XSS)

Ejemplos de tests importantes:
- authController.login() con credenciales válidas/inválidas
- claimPoints() no permite reclamar 2 veces
- requireRol() bloquea accesos no autorizados"
```

**P16: ¿Cómo manejan errores?**
```
R:
1. Try-catch en todos los controladores
2. Respuestas con códigos HTTP apropiados:
   - 200: OK
   - 201: Created
   - 400: Bad Request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 500: Internal Server Error
3. Mensajes de error descriptivos
4. Console.error para debugging

Ejemplo:
try {
  const user = await Usuario.findById(id)
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" })
  res.json(user)
} catch (e) {
  console.error(e)
  res.status(500).json({ message: "Error del servidor" })
}
```

---

## 🎨 Consejos de Diseño de Slides

### Colores:
- Fondo: Blanco o gris muy claro
- Títulos: Azul oscuro (#1a365d)
- Texto: Gris oscuro (#2d3748)
- Acentos: Verde (#38a169) para positivo, Rojo (#e53e3e) para negativo
- Código: Fondo gris claro (#f7fafc), texto monoespacio

### Tipografía:
- Títulos: Sans-serif (Arial, Helvetica, Roboto) tamaño 36-44pt
- Texto: Sans-serif tamaño 20-24pt
- Código: Monospace (Consolas, Courier New) tamaño 16-18pt
- Máximo 6 líneas por slide

### Diagramas:
- Usa flechas claras
- Colores consistentes (ej: verde para aprobado, rojo para rechazado)
- Leyendas cuando sea necesario
- No sobrecargues (máximo 7 elementos)

---

## 📝 Checklist Final

**Un día antes:**
- [ ] Revisar todos los documentos
- [ ] Practicar presentación completa 3 veces
- [ ] Preparar demo con datos de prueba
- [ ] Tomar capturas de pantalla de backup
- [ ] Verificar que MongoDB, Backend y Frontend inician correctamente
- [ ] Preparar respuestas a preguntas comunes
- [ ] Dormir bien

**1 hora antes:**
- [ ] Llegar temprano
- [ ] Probar proyector/pantalla
- [ ] Iniciar MongoDB
- [ ] Iniciar Backend
- [ ] Iniciar Frontend
- [ ] Hacer login de prueba
- [ ] Tener agua a mano

**Durante:**
- [ ] Respirar profundo
- [ ] Hablar claro y pausado
- [ ] Sonreír
- [ ] Mantener contacto visual
- [ ] Usar ejemplos concretos
- [ ] Involucrar a la audiencia

**Después:**
- [ ] Agradecer a la audiencia
- [ ] Estar disponible para preguntas
- [ ] Recoger feedback

---

## 🌟 Frases Clave para Usar

1. "TaskRewardPro gamifica el trabajo para aumentar la motivación"
2. "Usamos arquitectura de 3 capas para separación de responsabilidades"
3. "JWT nos permite autenticación sin estado, ideal para escalar"
4. "Mongoose con discriminators nos da herencia en MongoDB"
5. "Middleware en capas garantiza seguridad en cada petición"
6. "El flujo completo asegura que solo se otorgan puntos por trabajo validado"
7. "React con Context API nos da estado global sin librerías adicionales"
8. "bcrypt garantiza que las contraseñas nunca se almacenan en texto plano"

---

## 🚀 Cierre Fuerte

**Últimas palabras sugeridas:**

"TaskRewardPro no es solo un proyecto académico, es una solución real a un problema real: la motivación en equipos de trabajo.

Hemos aplicado las mejores prácticas de desarrollo:
- Arquitectura escalable
- Seguridad robusta
- Código limpio y mantenible
- Tecnologías modernas

Pero más importante, hemos creado una herramienta que puede mejorar la vida laboral de personas reales.

Gracias por su atención. ¿Preguntas?"

---

**¡Mucha suerte en tu exposición! 🎉**

Recuerda: Conoces tu proyecto mejor que nadie. Confía en ti mismo y disfruta la presentación.
