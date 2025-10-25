# 🎬 Movie App React Native: Un Explorador de Películas

Este proyecto es una aplicación móvil construida con **React Native (Expo)** que permite a los usuarios explorar películas populares, ver detalles y guardar títulos en una lista de favoritos. El sistema de gestión de favoritos ha sido migrado de un almacenamiento local (AsyncStorage) a un *backend* en la nube: **Appwrite**, asegurando que los favoritos sean personales para cada usuario.

## 🚀 Características Principales

* **Exploración de Películas:** Muestra listados de películas usando la API de TMDB.
* **Gestión de Favoritos:** Permite a los usuarios autenticados guardar, eliminar y consultar películas de su lista personal.
* **Autenticación de Usuario:** Integración de inicio de sesión y registro mediante Appwrite.
* **Persistencia en la Nube:** Uso de Appwrite para la persistencia de datos (favoritos) vinculados al `userId`.
* **Estilo Moderno:** Utiliza **NativeWind** (Tailwind CSS for React Native) para un desarrollo de interfaz eficiente.

***

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React Native (Expo)
* **Backend & DB:** [Appwrite Cloud](https://cloud.appwrite.io/) (Autenticación y Base de Datos)
* **API Externa:** The Movie Database (TMDB)
* **Estilo:** NativeWind

***

## ☁️ Configuración del Backend (Appwrite)

Para que la gestión de favoritos funcione, debes configurar una Base de Datos y una Colección específica en tu proyecto de Appwrite.

### 1. Base de Datos y Colección (`Favorites`)

1.  Crea una Base de Datos (si aún no tienes una).
2.  Crea una Colección (Tabla) dentro de esa Base de Datos. El **Collection ID** de esta tabla debe coincidir con el valor de la variable `EXPO_PUBLIC_APPWRITE_FAVORITES_ID`. (En nuestro caso, el ID es `'favorites'` o su código alfanumérico).

#### A. Atributos (Columnas) Requeridos

La colección de favoritos debe tener estos campos para que el servicio `favorites.ts` pueda guardar y leer los datos correctamente:

| Nombre del Atributo | Tipo de Dato | Requerido | Propósito |
| :--- | :--- | :--- | :--- |
| **`user_id`** | String | Sí | ID del usuario logueado (CRUCIAL para el filtrado). |
| **`movie_id`** | Integer | Sí | ID numérico de la película (TMDB). |
| **`title`** | String | Sí | Título de la película. |
| **`poster_url`** | String | No | URL completa del póster. |

#### B. Permisos de la Colección

Configura los permisos de la colección **`Favorites`** en la pestaña `Settings` para asegurar que solo los usuarios logueados puedan interactuar con ella:

| Rol | Create | Read | Update | Delete |
| :--- | :--- | :--- | :--- | :--- |
| **Users** | ✅ | ✅ | ✅ | ✅ |
| **Any** | ❌ | ❌ | ❌ | ❌ |

> **Nota de Seguridad:** Es fundamental que el rol **`Any`** no tenga permisos de `Create` o `Read` para evitar el error de autorización cuando los usuarios anónimos visiten la pestaña "Guardados".

***

## ⚙️ Configuración Local del Proyecto

### 1. Clonar e Instalar

```bash
git clone [https://github.com/Totti-Coder/Movie-App-React.git](https://github.com/Totti-Coder/Movie-App-React.git)
cd Movie-App-React
npm install
# o yarn install
