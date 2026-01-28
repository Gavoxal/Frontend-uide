# 📚 Documentación de Componentes - Proyecto UIDE

> Guía completa de integración y uso de todos los componentes creados hasta la fecha

## 📑 Índice

1. [Introducción](#introducción)
2. [Instalación y Dependencias](#instalación-y-dependencias)
3. [Componentes Básicos](#componentes-básicos)
   - [TextMui](#textmui)
   - [ButtonMUI](#buttonmui)
   - [InputMui](#inputmui)
4. [Componentes de Interfaz](#componentes-de-interfaz)
   - [AlertMui](#alertmui)
   - [HeaderMui](#headermui)
   - [SidebarMui](#sidebarmui)
   - [LoadingScreen](#loadingscreen)
5. [Componentes de Datos](#componentes-de-datos)
   - [BasicTable](#basictable)
   - [FileUpload](#fileupload)
6. [Componentes Especializados](#componentes-especializados)
   - [StatsCard](#statscard)
   - [StatusBadge](#statusbadge)
   - [StudentCard](#studentcard)
7. [Ejemplos de Integración](#ejemplos-de-integración)
8. [Mejores Prácticas](#mejores-prácticas)

---

## 🎯 Introducción

Este proyecto utiliza **Material-UI (MUI)** como biblioteca principal de componentes. Todos los componentes están diseñados para ser reutilizables, personalizables y mantener una coherencia visual en toda la aplicación.

### Ubicación de los Componentes

```
frontend/src/components/
├── alert.mui.component.jsx       # Diálogos y alertas
├── button.mui.component.jsx      # Botones
├── file.mui.component.jsx        # Carga de archivos
├── header.mui.component.jsx      # Encabezado de página
├── input.mui.component.jsx       # Campos de entrada
├── load.mui.component.jsx        # Pantalla de carga
├── sidebar.mui.component.jsx     # Menú lateral
├── table.mui.component.jsx       # Tablas de datos
├── text.mui.component.jsx        # Texto con tipografía
└── common/                       # Componentes comunes
    ├── StatsCard.jsx             # Tarjetas estadísticas
    ├── StatusBadge.jsx           # Badges de estado
    └── StudentCard.jsx           # Tarjetas de estudiante
```

---

## 📦 Instalación y Dependencias

### Dependencias Principales

```json
{
  "@emotion/react": "^11.14.0",
  "@emotion/styled": "^11.14.1",
  "@mui/icons-material": "^7.3.6",
  "@mui/material": "^7.3.6",
  "react": "^19.2.0",
  "react-dom": "^19.2.0"
}
```

### Instalación

```bash
npm install
```

---

## 🧱 Componentes Básicos

### TextMui

Componente para renderizar texto con tipografía consistente de Material-UI.

**Ubicación:** `components/text.mui.component.jsx`

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `value` | `string` | `"Sample Text"` | Texto a mostrar |
| `variant` | `string` | `"h1"` | Variante de tipografía MUI (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `body1`, `body2`, `caption`, etc.) |

#### Ejemplo de Uso

```jsx
import TextMui from '../components/text.mui.component';

function MyPage() {
  return (
    <div>
      <TextMui value="Título Principal" variant="h1" />
      <TextMui value="Subtítulo" variant="h4" />
      <TextMui value="Contenido del párrafo" variant="body1" />
    </div>
  );
}
```

---

### ButtonMUI

Botón personalizado con estilos de Material-UI.

**Ubicación:** `components/button.mui.component.jsx`

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `name` | `string` | - | Texto del botón (requerido) |
| `onClick` | `function` | `() => {}` | Función a ejecutar al hacer clic |
| `backgroundColor` | `string` | `'white'` | Color de fondo del botón |
| `color` | `string` | `'white'` | Color del texto |
| `type` | `string` | `'submit'` | Tipo de botón (`submit`, `button`, `reset`) |

#### Ejemplo de Uso

```jsx
import ButtonMUI from '../components/button.mui.component';

function MyForm() {
  const handleClick = () => {
    console.log('Botón presionado');
  };

  return (
    <div>
      <ButtonMUI 
        name="Guardar" 
        onClick={handleClick}
        backgroundColor="#000A9B"
        color="white"
        type="submit"
      />
      
      <ButtonMUI 
        name="Cancelar" 
        onClick={handleClick}
        backgroundColor="red"
        color="white"
        type="button"
      />
    </div>
  );
}
```

---

### InputMui

Campo de entrada de texto con soporte para iconos y validación.

**Ubicación:** `components/input.mui.component.jsx`

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `type` | `string` | `'text'` | Tipo de input (`text`, `password`, `email`, `number`, etc.) |
| `placeholder` | `string` | `''` | Texto de ayuda |
| `value` | `string` | `''` | Valor del campo |
| `onChange` | `function` | `() => {}` | Función manejadora de cambios |
| `required` | `boolean` | `false` | Campo obligatorio |
| `helperText` | `string` | `''` | Texto de ayuda debajo del campo |
| `error` | `boolean` | `false` | Muestra el estado de error |
| `label` | `string` | `''` | Etiqueta del campo |
| `startIcon` | `ReactNode` | `null` | Icono al inicio del campo |
| `endIcon` | `ReactNode` | `null` | Icono al final del campo |

#### Ejemplo de Uso

```jsx
import { useState } from 'react';
import InputMui from '../components/input.mui.component';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  return (
    <div>
      <InputMui
        type="email"
        label="Correo Electrónico"
        placeholder="ejemplo@correo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        startIcon={<AccountCircle />}
        error={error}
        helperText={error ? "Correo inválido" : ""}
      />
      
      <InputMui
        type="password"
        label="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        endIcon={<Visibility />}
      />
    </div>
  );
}
```

---

## 🎨 Componentes de Interfaz

### AlertMui

Diálogo modal personalizable para mostrar mensajes, alertas y confirmaciones.

**Ubicación:** `components/alert.mui.component.jsx`

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controla la visibilidad del diálogo |
| `handleClose` | `function` | `() => {}` | Función para cerrar el diálogo |
| `title` | `string` | `null` | Título del diálogo |
| `message` | `string` | `null` | Mensaje del diálogo |
| `status` | `string` | `'info'` | Tipo de alerta (`info`, `warning`, `error`, `success`) |
| `showBtnL` | `boolean` | `false` | Mostrar botón izquierdo |
| `showBtnR` | `boolean` | `false` | Mostrar botón derecho |
| `btnNameL` | `string` | `'Aceptar'` | Texto del botón izquierdo |
| `btnNameR` | `string` | `'Cancelar'` | Texto del botón derecho |
| `actionBtnL` | `function` | `() => {}` | Acción del botón izquierdo |
| `actionBtnR` | `function` | `() => {}` | Acción del botón derecho |

#### Ejemplo de Uso

```jsx
import { useState } from 'react';
import AlertMui from '../components/alert.mui.component';

function MyComponent() {
  const [openAlert, setOpenAlert] = useState(false);

  const handleDelete = () => {
    console.log('Elemento eliminado');
    setOpenAlert(false);
  };

  return (
    <>
      <button onClick={() => setOpenAlert(true)}>
        Eliminar
      </button>

      <AlertMui
        open={openAlert}
        handleClose={() => setOpenAlert(false)}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este elemento?"
        status="warning"
        showBtnL={true}
        showBtnR={true}
        btnNameL="Confirmar"
        btnNameR="Cancelar"
        actionBtnL={handleDelete}
        actionBtnR={() => setOpenAlert(false)}
      />
    </>
  );
}
```

---

### HeaderMui

Barra de encabezado superior con título, subtítulo y notificaciones.

**Ubicación:** `components/header.mui.component.jsx`

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `title` | `string` | `"Tablero"` | Título principal del encabezado |
| `subtitle` | `string` | `null` | Subtítulo opcional |
| `onBack` | `function` | `null` | Función para botón de retroceso |
| `sidebarWidth` | `number` | `0` | Ancho del sidebar para ajuste |
| `showNotifications` | `boolean` | `true` | Mostrar icono de notificaciones |

#### Ejemplo de Uso

```jsx
import { useNavigate } from 'react-router-dom';
import HeaderMui from '../components/header.mui.component';

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <>
      <HeaderMui
        title="Panel de Control"
        subtitle="Gestión de estudiantes"
        sidebarWidth={240}
        showNotifications={true}
      />
      
      {/* Contenido de la página */}
    </>
  );
}

function DetailPage() {
  const navigate = useNavigate();

  return (
    <>
      <HeaderMui
        title="Detalle del Estudiante"
        onBack={() => navigate(-1)}
        sidebarWidth={240}
      />
    </>
  );
}
```

---

### SidebarMui

Menú lateral de navegación con soporte para múltiples roles.

**Ubicación:** `components/sidebar.mui.component.jsx`

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `onNavigate` | `function` | - | Función de navegación (requerida) |
| `currentPage` | `string` | - | Ruta actual para highlighting |
| `isExpanded` | `boolean` | - | Estado expandido/colapsado |
| `toggleSidebar` | `function` | - | Función para toggle |

#### Roles Soportados

- `director`: Dashboard, Estudiantes, Prerrequisitos, Propuestas, Tutores, Defensas
- `student`: Dashboard, Prerrequisitos, Mis Propuestas, Anteproyecto, Mi Tutor, Avances, Defensa
- `tutor`: Dashboard, Mis Estudiantes, Revisar Avances
- `reviewer`: Dashboard, Propuestas, Defensas
- `admin`: Dashboard, Estudiantes

#### Ejemplo de Uso

```jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SidebarMui from '../components/sidebar.mui.component';

function Layout({ children }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ display: 'flex' }}>
      <SidebarMui
        onNavigate={(path) => navigate(path)}
        currentPage={location.pathname}
        isExpanded={sidebarExpanded}
        toggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
      />
      
      <main style={{ marginLeft: sidebarExpanded ? 240 : 60, flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
```

---

### LoadingScreen

Pantalla de carga animada con logo de la aplicación.

**Ubicación:** `components/load.mui.component.jsx`

#### Props

No recibe props. Es un componente autónomo.

#### Ejemplo de Uso

```jsx
import { useState, useEffect } from 'react';
import LoadingScreen from '../components/load.mui.component';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      {/* Contenido de la aplicación */}
    </div>
  );
}
```

---

## 📊 Componentes de Datos

### BasicTable

Tabla básica de Material-UI para mostrar datos tabulares.

**Ubicación:** `components/table.mui.component.jsx`

> **Nota:** Este componente actualmente tiene datos de ejemplo hardcodeados. Se recomienda refactorizar para aceptar datos dinámicos.

#### Refactorización Sugerida

```jsx
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function CustomTable({ columns, rows }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="table">
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index} align={column.align || 'left'}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex} align={column.align || 'left'}>
                  {row[column.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CustomTable;
```

#### Ejemplo de Uso (Refactorizado)

```jsx
import CustomTable from '../components/table.mui.component';

function StudentsList() {
  const columns = [
    { field: 'name', label: 'Nombre', align: 'left' },
    { field: 'cedula', label: 'Cédula', align: 'right' },
    { field: 'email', label: 'Correo', align: 'left' },
    { field: 'cycle', label: 'Ciclo', align: 'right' },
  ];

  const rows = [
    { name: 'Juan Pérez', cedula: '1234567890', email: 'juan@example.com', cycle: '8' },
    { name: 'María García', cedula: '0987654321', email: 'maria@example.com', cycle: '7' },
  ];

  return <CustomTable columns={columns} rows={rows} />;
}
```

---

### FileUpload

Componente para carga de archivos con drag & drop.

**Ubicación:** `components/file.mui.component.jsx`

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `onFileSelect` | `function` | - | Callback cuando se selecciona un archivo |
| `uploadedFile` | `object` | `null` | Archivo ya subido (objeto con `name` y `size`) |
| `onRemoveFile` | `function` | - | Callback para eliminar archivo |

#### Ejemplo de Uso

```jsx
import { useState } from 'react';
import FileUpload from '../components/file.mui.component';

function DocumentUpload() {
  const [file, setFile] = useState(null);

  const handleFileSelect = (selectedFile) => {
    setFile({
      name: selectedFile.name,
      size: `${(selectedFile.size / 1024).toFixed(2)} KB`,
      file: selectedFile
    });
  };

  const handleRemove = () => {
    setFile(null);
  };

  return (
    <div>
      <h2>Subir Documento</h2>
      <FileUpload
        onFileSelect={handleFileSelect}
        uploadedFile={file}
        onRemoveFile={handleRemove}
      />
    </div>
  );
}
```

---

## 🎁 Componentes Especializados

### StatsCard

Tarjeta para mostrar estadísticas con icono.

**Ubicación:** `components/common/StatsCard.jsx`

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `title` | `string` | - | Título de la estadística |
| `value` | `string/number` | - | Valor principal |
| `icon` | `ReactNode` | `null` | Icono a mostrar |
| `color` | `string` | `'primary'` | Color del tema MUI (`primary`, `secondary`, `success`, `error`, `warning`, `info`) |
| `subtitle` | `string` | `null` | Subtítulo opcional |

#### Ejemplo de Uso

```jsx
import StatsCard from '../components/common/StatsCard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';

function Dashboard() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      <StatsCard
        title="Total Estudiantes"
        value="156"
        icon={<PeopleIcon />}
        color="primary"
        subtitle="+12 este mes"
      />
      
      <StatsCard
        title="Propuestas Pendientes"
        value="23"
        icon={<AssignmentIcon />}
        color="warning"
      />
      
      <StatsCard
        title="Defensas Programadas"
        value="8"
        icon={<AssignmentIcon />}
        color="success"
        subtitle="Próximas 2 semanas"
      />
    </div>
  );
}
```

---

### StatusBadge

Badge (chip) para mostrar estados con colores predefinidos.

**Ubicación:** `components/common/StatusBadge.jsx`

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `status` | `string` | - | Estado (`pending`, `in-progress`, `approved`, `rejected`, `completed`) |
| `label` | `string` | `null` | Etiqueta personalizada (opcional) |

#### Estados Predefinidos

| Status | Color | Etiqueta |
|--------|-------|----------|
| `pending` | Warning (Amarillo) | Pendiente |
| `in-progress` | Info (Azul) | En Progreso |
| `approved` | Success (Verde) | Aprobado |
| `rejected` | Error (Rojo) | Rechazado |
| `completed` | Success (Verde) | Completado |

#### Ejemplo de Uso

```jsx
import StatusBadge from '../components/common/StatusBadge';

function ProposalItem({ proposal }) {
  return (
    <div>
      <h3>{proposal.title}</h3>
      <StatusBadge status={proposal.status} />
      
      {/* Badge con etiqueta personalizada */}
      <StatusBadge status="approved" label="Aprobado por Director" />
    </div>
  );
}
```

---

### StudentCard

Tarjeta completa para mostrar información de un estudiante.

**Ubicación:** `components/common/StudentCard.jsx`

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `student` | `object` | - | Objeto con datos del estudiante (requerido) |
| `onClick` | `function` | `null` | Función al hacer clic en la tarjeta |

#### Estructura del Objeto Student

```javascript
{
  name: "Juan Pérez",
  cedula: "1234567890",
  email: "juan.perez@example.com",
  cycle: "8",
  phase: "Anteproyecto",
  status: "in-progress"
}
```

#### Ejemplo de Uso

```jsx
import StudentCard from '../components/common/StudentCard';
import { useNavigate } from 'react-router-dom';

function StudentsList() {
  const navigate = useNavigate();
  
  const students = [
    {
      name: "Juan Pérez",
      cedula: "1234567890",
      email: "juan.perez@example.com",
      cycle: "8",
      phase: "Anteproyecto",
      status: "in-progress"
    },
    {
      name: "María García",
      cedula: "0987654321",
      email: "maria.garcia@example.com",
      cycle: "9",
      phase: "Defensa",
      status: "approved"
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
      {students.map((student, index) => (
        <StudentCard
          key={index}
          student={student}
          onClick={() => navigate(`/student/${student.cedula}`)}
        />
      ))}
    </div>
  );
}
```

---

## 🔗 Ejemplos de Integración

### Ejemplo 1: Página de Login Completa

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper } from '@mui/material';
import InputMui from '../components/input.mui.component';
import ButtonMUI from '../components/button.mui.component';
import TextMui from '../components/text.mui.component';
import AlertMui from '../components/alert.mui.component';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Lock from '@mui/icons-material/Lock';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setAlertMessage('Por favor, complete todos los campos');
      setShowAlert(true);
      return;
    }

    // Lógica de autenticación
    console.log('Login:', { email, password });
    navigate('/dashboard');
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <TextMui value="Iniciar Sesión" variant="h4" />
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ mt: 3 }}>
            <InputMui
              type="email"
              label="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              startIcon={<AccountCircle />}
              required
            />
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <InputMui
              type="password"
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              startIcon={<Lock />}
              required
            />
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <ButtonMUI
              name="Ingresar"
              type="submit"
              backgroundColor="#000A9B"
              color="white"
            />
          </Box>
        </form>
      </Paper>

      <AlertMui
        open={showAlert}
        handleClose={() => setShowAlert(false)}
        message={alertMessage}
        status="error"
        showBtnL={true}
        btnNameL="Entendido"
        actionBtnL={() => setShowAlert(false)}
      />
    </Box>
  );
}

export default LoginPage;
```

---

### Ejemplo 2: Dashboard con Layout Completo

```jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import SidebarMui from '../components/sidebar.mui.component';
import HeaderMui from '../components/header.mui.component';
import StatsCard from '../components/common/StatsCard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';

function DashboardPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarWidth = sidebarExpanded ? 240 : 60;

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Sidebar */}
      <SidebarMui
        onNavigate={(path) => navigate(path)}
        currentPage={location.pathname}
        isExpanded={sidebarExpanded}
        toggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
      />

      {/* Main Content */}
      <Box sx={{ flex: 1, marginLeft: `${sidebarWidth}px`, transition: 'margin-left 0.3s' }}>
        {/* Header */}
        <HeaderMui
          title="Panel de Control"
          subtitle="Vista general del sistema"
          sidebarWidth={sidebarWidth}
          showNotifications={true}
        />

        {/* Content */}
        <Box sx={{ p: 3, mt: 8 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: 2,
            mb: 3
          }}>
            <StatsCard
              title="Total Estudiantes"
              value="156"
              icon={<PeopleIcon />}
              color="primary"
              subtitle="+12 este mes"
            />
            
            <StatsCard
              title="Propuestas Pendientes"
              value="23"
              icon={<AssignmentIcon />}
              color="warning"
            />
            
            <StatsCard
              title="Aprobadas"
              value="45"
              icon={<AssignmentIcon />}
              color="success"
            />
          </Box>

          {/* Más contenido aquí */}
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardPage;
```

---

### Ejemplo 3: Formulario de Carga de Documentos

```jsx
import { useState } from 'react';
import { Box, Paper } from '@mui/material';
import TextMui from '../components/text.mui.component';
import InputMui from '../components/input.mui.component';
import FileUpload from '../components/file.mui.component';
import ButtonMUI from '../components/button.mui.component';
import AlertMui from '../components/alert.mui.component';

function ProposalForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title || !description || !file) {
      alert('Complete todos los campos');
      return;
    }

    // Enviar datos
    console.log({ title, description, file });
    setShowSuccess(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <TextMui value="Nueva Propuesta de Tesis" variant="h4" />

        <form onSubmit={handleSubmit}>
          <Box sx={{ mt: 3 }}>
            <InputMui
              label="Título de la Propuesta"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <InputMui
              label="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <TextMui value="Documento PDF" variant="body1" />
            <Box sx={{ mt: 1 }}>
              <FileUpload
                onFileSelect={(selectedFile) => setFile({
                  name: selectedFile.name,
                  size: `${(selectedFile.size / 1024).toFixed(2)} KB`,
                  file: selectedFile
                })}
                uploadedFile={file}
                onRemoveFile={() => setFile(null)}
              />
            </Box>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <ButtonMUI
              name="Guardar Propuesta"
              type="submit"
              backgroundColor="#000A9B"
              color="white"
            />
            <ButtonMUI
              name="Cancelar"
              type="button"
              backgroundColor="#gray"
              color="white"
              onClick={() => window.history.back()}
            />
          </Box>
        </form>
      </Paper>

      <AlertMui
        open={showSuccess}
        handleClose={() => setShowSuccess(false)}
        title="¡Éxito!"
        message="La propuesta ha sido guardada correctamente"
        status="success"
        showBtnL={true}
        btnNameL="Aceptar"
        actionBtnL={() => setShowSuccess(false)}
      />
    </Box>
  );
}

export default ProposalForm;
```

---

## ✨ Mejores Prácticas

### 1. Importación de Componentes

```jsx
// ✅ Correcto
import ButtonMUI from '../components/button.mui.component';
import InputMui from '../components/input.mui.component';

// ❌ Incorrecto
import { ButtonMUI } from '../components/button.mui.component';
```

### 2. Gestión de Estado

```jsx
// ✅ Usar hooks de React para estado local
import { useState } from 'react';

function MyComponent() {
  const [value, setValue] = useState('');
  
  return (
    <InputMui
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

### 3. Validación de Formularios

```jsx
// ✅ Validar antes de enviar
const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!email || !password) {
    setError('Complete todos los campos');
    return;
  }
  
  // Procesar formulario
};
```

### 4. Uso de Colores Consistentes

```jsx
// Colores predefinidos del proyecto
const COLORS = {
  primary: '#000A9B',     // Azul UIDE
  secondary: '#FBBF24',   // Amarillo
  error: '#EF4444',       // Rojo
  success: '#10B981',     // Verde
  warning: '#F59E0B',     // Naranja
};

// Usar en componentes
<ButtonMUI
  name="Guardar"
  backgroundColor={COLORS.primary}
  color="white"
/>
```

### 5. Responsive Design

```jsx
import { Box, useMediaQuery, useTheme } from '@mui/material';

function ResponsiveGrid() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: 2
    }}>
      {/* Contenido */}
    </Box>
  );
}
```

### 6. Manejo de Errores en FileUpload

```jsx
const handleFileSelect = (selectedFile) => {
  // Validar tipo de archivo
  if (selectedFile.type !== 'application/pdf') {
    setAlertMessage('Solo se permiten archivos PDF');
    setShowAlert(true);
    return;
  }
  
  // Validar tamaño (5MB máximo)
  if (selectedFile.size > 5 * 1024 * 1024) {
    setAlertMessage('El archivo no debe superar 5MB');
    setShowAlert(true);
    return;
  }
  
  setFile({
    name: selectedFile.name,
    size: `${(selectedFile.size / 1024).toFixed(2)} KB`,
    file: selectedFile
  });
};
```

### 7. Estructura de Carpetas Recomendada

```
src/
├── components/          # Componentes reutilizables
│   ├── common/         # Componentes comunes especializados
│   └── *.jsx          # Componentes individuales
├── pages/              # Páginas de la aplicación
│   ├── Admin/
│   ├── Student/
│   ├── Director/
│   └── ...
├── storage/            # Modelos de almacenamiento
├── assets/             # Recursos estáticos
└── App.jsx            # Componente principal
```

### 8. Nomenclatura

- **Componentes**: PascalCase (`ButtonMUI`, `InputMui`)
- **Archivos**: kebab-case o PascalCase (`button.mui.component.jsx` o `ButtonMUI.jsx`)
- **Funciones**: camelCase (`handleSubmit`, `toggleSidebar`)
- **Constantes**: UPPER_SNAKE_CASE (`MENU_BY_ROLE`, `STATUS_COLORS`)

---

## 🚀 Próximos Pasos

### Componentes Sugeridos para Crear

1. **SelectMui**: Dropdown/Select personalizado
2. **CheckboxMui**: Checkbox con estilos consistentes
3. **RadioMui**: Radio buttons
4. **DatePickerMui**: Selector de fechas
5. **SearchBar**: Barra de búsqueda
6. **Pagination**: Componente de paginación
7. **ConfirmDialog**: Diálogo de confirmación específico
8. **Breadcrumbs**: Navegación breadcrumb

### Mejoras Sugeridas

1. **Refactorizar BasicTable** para aceptar datos dinámicos
2. **Agregar tests** unitarios a cada componente
3. **Documentar PropTypes** o usar TypeScript
4. **Crear Storybook** para visualizar componentes
5. **Implementar temas** personalizables
6. **Agregar animaciones** con Framer Motion

---

## 📞 Soporte

Para dudas o mejoras sobre los componentes, consultar con el equipo de desarrollo.

**Última actualización:** Enero 2026

---

## 📄 Licencia

Este proyecto y sus componentes son propiedad de UIDE - Universidad Internacional del Ecuador.
