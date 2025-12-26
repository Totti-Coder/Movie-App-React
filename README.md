# 🎬 Movie App React Native: Un Explorador de Películas

Este proyecto es una aplicación móvil construida con **React Native (Expo)** que permite a los usuarios explorar películas populares, ver detalles y guardar títulos en una lista de favoritos. El sistema de gestión de favoritos ha sido migrado de un almacenamiento local (AsyncStorage) a un *backend* en la nube: **Appwrite**, asegurando que los favoritos sean personales para cada usuario.

---

## 🚀 Características Funcionales

| Característica | Descripción | Estado |
| :--- | :--- | :--- |
| **Búsqueda y Exploración** | Muestra listados dinámicos de películas populares y permite la navegación por colecciones de TMDB. | ✅ Implementado |
| **Gestión de Favoritos** | Permite a los usuarios autenticados **Guardar, Listar y Eliminar** películas de su colección personal. | ✅ Implementado |
| **Autenticación Segura** | Integración completa de los flujos de `Login`, `Registro` y `Gestión de Sesión` vía el SDK de Appwrite. | ✅ Implementado |
| **Persistencia Sincronizada** | Los datos de favoritos se almacenan en la nube, garantizando su disponibilidad en cualquier dispositivo tras iniciar sesión. | ✅ Implementado |
| **Estilo Adaptativo** | Diseño responsivo implementado mediante NativeWind (Tailwind CSS for React Native). | ✅ Implementado |

---

## 🛠️ Stack Tecnológico.

La aplicación se fundamenta en el **Stack MERN** simplificado con la inclusión de Expo y Appwrite como servicios desacoplados.

| Componente | Tecnología | Versión | Rol Principal |
| :--- | :--- | :--- | :--- |
| **Lenguaje** | **TypeScript** | Latest | Lenguaje principal de desarrollo, ofreciendo tipado estático para la robustez del código. |
| **Frontend Core** | **React Native (Expo)** | Latest | Desarrollo de interfaz de usuario móvil multiplataforma. |
| **Backend & BaaS** | **Appwrite Cloud** | v1.5+ | Autenticación, Base de Datos (NoSQL) y gestión de permisos. |
| **API Externa** | **The Movie Database (TMDB)** | v3/v4 | Fuente de datos de películas (títulos, pósters, metadatos). |
| **Estilo** | **NativeWind** | Latest | Utilidades para la aplicación de estilos de Tailwind CSS. |
| **Navegación** | **React Navigation** | Latest | Gestión de la pila de navegación y pestañas (Tabs). |

---

## 🧠 Arquitectura y Diseño del Servicio

El diseño del servicio de favoritos se adhiere al principio de **Separación de Responsabilidades** (SoC), garantizando que la lógica de negocio y la interacción con la base de datos residan en la capa de servicios, desacoplada de los componentes de la interfaz de usuario.

### Estructura Clave de la Migración
1.  **Capa de Servicios (`src/services/favorites.ts`)**: Este archivo encapsula toda la interacción con el SDK de Appwrite. Las funciones (`saveMovieToUser`, `getFavorites`, `removeFromFavorites`) exigen el `userId` como parámetro para el filtrado, asegurando que las consultas sean atómicas y privadas.
2.  **Estrategia de Seguridad en el Cliente (`src/app/(tabs)/saved.tsx`)**: Para prevenir errores de autorización (`AppwriteException`) cuando el usuario es **anónimo**, la pantalla de favoritos implementa una **Salida Rápida (Early Exit)**.
    ```typescript
    // En loadSavedMovies(userId)
    if (!userId) {
        // Establece estados a vacío y detiene la llamada a la base de datos
        return; 
    }
    // ... Procede con la llamada a Appwrite solo si está logueado
    ```

---

## ☁️ Configuración del Entorno de Desarrollo

La configuración de variables de entorno y el *backend* es crítica para la funcionalidad y seguridad del proyecto.

### Configuración de Seguridad en Appwrite

| Rol | Create | Read | Update | Delete | Justificación de Seguridad |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Users** | ✅ | ✅ | ✅ | ✅ | Permite la funcionalidad a usuarios autenticados. |
| **Any** | ❌ | ❌ | ❌ | ❌ | Impide la inyección de datos (Creación) y la visualización de datos de usuario (Lectura) por parte de usuarios anónimos. |

### Variables de Entorno (`.env`)

Se requiere un archivo `.env` en la raíz del proyecto para inicializar el cliente de Appwrite y las APIs.

```env
# TMDB API (Bearer Token)
EXPO_PUBLIC_MOVIE_API_KEY=TU_API_KEY_DE_TMDB

# Credenciales de Appwrite
EXPO_PUBLIC_APPWRITE_PROJECT_ID=ID_DEL_PROYECTO
EXPO_PUBLIC_APPWRITE_ENDPOINT=[https://cloud.appwrite.io/v1](https://cloud.appwrite.io/v1)

# IDs de Base de Datos y Colecciones
EXPO_PUBLIC_APPWRITE_DATABASE_ID=ID_DE_TU_BASE_DE_DATOS
EXPO_PUBLIC_APPWRITE_TABLE_ID=ID_COLECCION_METRICAS 
EXPO_PUBLIC_APPWRITE_FAVORITES_ID=ID_DE_LA_COLECCION_FAVORITES 

```
