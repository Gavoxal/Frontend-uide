# Especificación de Requisitos de Software (SRS)
## Sistema de Gestión de Titulación

**Versión:** 1.0
**Fecha:** 14 de Enero de 2026

---

## 1. Introducción

### 1.1 Propósito
El propósito de este documento es definir los requisitos funcionales y no funcionales para el "Sistema de Gestión de Titulación" de la carrera de Tecnologías de la Información de la Universidad Internacional del Ecuador. Este sistema gestionará todo el ciclo de vida de los proyectos de titulación, desde la postulación de temas hasta la defensa final.

### 1.2 Alcance
El sistema permitirá:
*   La carga masiva de estudiantes por parte de la Dirección/Coordinación.
*   La postulación y aprobación de anteproyectos de tesis.
*   El seguimiento semanal de avances (Evidencias) durante la materia de Trabajo de Integración Curricular (15 semanas).
*   La gestión de revisiones, comentarios y calificaciones por parte de Tutores y Docentes.
*   La administración de tribunales y fechas de defensa.
*   El repositorio de entregables finales (Tesis, Manuales, Artículos).

---

## 2. Actores y Roles

| Rol | Descripción |
| :--- | :--- |
| **Estudiante** | Usuario principal que postula temas, sube avances semanales y entregables finales. |
| **Tutor** | Docente asignado para guiar al estudiante temáticamente. Revisa y comenta avances. |
| **Docente de Integración** | Responsable de la materia. Califica los avances y supervisa el cumplimiento académico. |
| **Dirección** | Máxima autoridad. Carga estudiantes, designa tribunales, define fechas de defensa y tiene permisos totales. |
| **Coordinador** | Apoyo a la Dirección. Supervisa el proceso genel (lectura y seguimiento). |
| **Comité (Tribunal)** | Grupo de docentes (Jurados y Presidente) que evalúan la defensa final. |

---

## 3. Requisitos Funcionales

### 3.1 Módulo de Gestión de Usuarios
*   **RF-001 (Carga Masiva):** El sistema debe permitir a la Dirección cargar un archivo Excel con la nómina de estudiantes (Cédula, Nombres, Correo).
*   **RF-002 (Generación de Credenciales):** Al cargar la nómina, el sistema debe generar automáticamente credenciales de acceso para cada estudiante.
*   **RF-003 (Login):** Los usuarios deben poder ingresar al sistema mediante correo institucional y contraseña.

### 3.2 Módulo de Propuestas (Anteproyectos)
*   **RF-004 (Postulación):** El estudiante debe poder postular hasta 3 propuestas de tesis, indicando: Título, Objetivos, Línea de Investigación (IA, Ciberseguridad, Desarrollo, Calidad) y cargando un archivo PDF.
*   **RF-005 (Evaluación de Propuesta):** La Dirección debe poder APROBAR, RECHAZAR o APROBAR CON COMENTARIOS una propuesta.
*   **RF-006 (Validación de Requisitos):** El sistema debe restringir el paso a la siguiente fase hasta que se validen los prerrequisitos documentales (Certificados, etc.).

### 3.3 Módulo de Seguimiento (Materia de Integración)
*   **RF-007 (Avances Semanales):** El sistema debe gestionar un ciclo de 15 semanas donde el estudiante sube "Evidencias" de su trabajo.
*   **RF-008 (Retroalimentación):** El Tutor debe poder ingresar comentarios a las evidencias subidas.
*   **RF-009 (Calificación):** El Docente de Integración debe poder calificar las evidencias.
*   **RF-010 (Supervisión):** El Coordinador debe poder visualizar si el Tutor ha realizado la retroalimentación correspondiente (Dashboard de cumplimiento).

### 3.4 Módulo de Defensa y Cierre
*   **RF-011 (Entregables Finales):** El sistema debe permitir la carga de: Documento de Tesis, Manual de Usuario, Enlace al Repositorio y Artículo Científico.
*   **RF-012 (Designación de Tribunal):** La Dirección debe poder asignar fecha, hora y miembros del tribunal (Presidente, Jurados) para la defensa.
*   **RF-013 (Registro de Defensa):** El Tribunal debe poder registrar el resultado de la defensa (Aprobado/Reprobado) y la calificación final.
*   **RF-014 (Notificaciones):** El sistema debe notificar a los usuarios sobre cambios de estado (Aprobación de tema, Asignación de fecha, etc.).

---

## 4. Requisitos No Funcionales

*   **RNF-001 (Usabilidad):** La interfaz debe ser intuitiva, utilizando la paleta de colores institucional.
*   **RNF-002 (Disponibilidad):** El sistema debe estar disponible 24/7 para la carga de tareas.
*   **RNF-003 (Seguridad):** Las contraseñas deben estar encriptadas. Solo usuarios autorizados pueden ver calificaciones.
*   **RNF-004 (Performance):** La carga de archivos no debe exceder los 30 segundos por documento promedio (PDFs).

---

## 5. Modelo de Datos (Validado)

El sistema se basa en un esquema relacional validado (`titulacion_correccion`) que incluye las siguientes entidades principales:

*   `usuarios` (Incluye rol y cédula).
*   `propuestas` (Vincula estudiante y estado de aprobación).
*   `entregables_finales` (Repositorio de documentos de cierre).
*   `actividades` y `evidencia` (Control semanal).
*   `comite` (Gestión de tribunales y defensas).
*   `notificaciones` (Historial de alertas).

---
