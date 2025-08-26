# Sistema de Flujo de Aprobaciones - Frontend

Este repositorio contiene el frontend para el Sistema de Flujo de Aprobaciones. Es una aplicación web moderna construida con **Next.js**, **React** y **Tailwind CSS**, utilizando la librería de componentes **shadcn/ui**.

## ✨ Características Principales

-   **Dashboard Intuitivo:** Vista general de las estadísticas de solicitudes.
-   **Creación de Solicitudes:** Formulario dinámico para crear nuevas solicitudes de aprobación.
-   **Bandejas de Entrada/Salida:** Vistas dedicadas para:
    -   Mis Solicitudes (creadas por mí).
    -   Por Aprobar (pendientes de mi acción).
    -   Asignadas a Mí (historial completo de asignaciones).
-   **Vista de Detalle:** Visualización completa de una solicitud, incluyendo su historial de cambios.
-   **Acciones de Aprobación:** Interfaz para aprobar o rechazar solicitudes con comentarios.
-   **Secciones de Administración:** (Para usuarios con rol de Admin)
    -   Gestión de Usuarios.
    -   Historial Global de Cambios.
-   **Diseño Responsivo:** Interfaz adaptable a diferentes tamaños de pantalla.

---

## 🛠️ Tecnologías Utilizadas

-   **Framework:** [Next.js](https://nextjs.org/) (con App Router)
-   **Librería UI:** [React](https://react.dev/)
-   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
-   **Componentes:** [shadcn/ui](https://ui.shadcn.com/)
-   **Iconos:** [Lucide React](https://lucide.dev/)
-   **Contenerización:** [Docker](https://www.docker.com/)

---

## 🚀 Puesta en Marcha (Desarrollo Local)

### Prerrequisitos

-   Node.js (v18 o superior)
-   npm o yarn
-   El [backend de la aplicación](#) debe estar corriendo.
-   Git

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO_FRONTEND>
cd approval_flow_frontend
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto. Este archivo contendrá la URL donde se está ejecutando la API del backend.

```env
# .env.local

# URL del backend para el entorno de desarrollo local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Iniciar la Aplicación de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

---

## 🐳 Despliegue con Docker

Este proyecto está preparado para ser desplegado con Docker.

### 1. Construir la Imagen

Desde la raíz del proyecto, ejecuta:

```bash
# Reemplaza la URL con la dirección pública de tu API en producción
docker build --build-arg NEXT_PUBLIC_API_URL=http://tu-api-en-produccion.com:3001 -t approval-flow-frontend -f Dockerfile.frontend .
```

### 2. Ejecutar el Contenedor

Puedes ejecutar el contenedor pasando la variable de entorno:

```bash
docker run -p 3000:3000 \
  --name approval-flow-frontend \
  -e NEXT_PUBLIC_API_URL=http://tu-api-en-produccion.com:3001 \
  approval-flow-frontend
```

Para un despliegue completo junto con el backend, consulta el archivo `docker-compose.yml` en el despliegue de producción.

---

## 🔑 Usuarios de Prueba (Seeding)

El backend crea automáticamente los siguientes usuarios al iniciar:

-   **Usuario Administrador:**
    -   **Username:** `admin1`
    -   **Password:** `Password123!`
-   **Usuario Estándar:**
    -   **Username:** `standard1`
    -   **Password:** `Password123!`