# LigaCoyohuatzinFrontend
# ⚽ Frontend del Sistema de Gestión para la Liga Coyohuatzin Coyoacán

Este repositorio contiene el **frontend** del sistema de gestión para la **Liga Coyohuatzin Coyoacán**, una liga de fútbol local en Coyoacán, CDMX. El frontend está diseñado para proporcionar una interfaz web intuitiva y moderna, conectándose al backend (disponible en [FRAGATA--Backend](https://github.com/osdan-flo/FRAGATA--Backend)) para gestionar torneos, equipos, jugadores, partidos y estadísticas.

---

## 🧠 Objetivo del proyecto
- 📱 Ofrecer una interfaz web responsive para administradores, jugadores y aficionados.
- 🔄 Integrarse con el backend para visualizar y gestionar datos en tiempo real.
- 🎨 Diseñar una experiencia de usuario atractiva y funcional.
- ⚙️ Construido con un enfoque escalable usando componentes reutilizables.

---

## 🏗️ Arquitectura del frontend
- **Lenguaje**: JavaScript/TypeScript
- **Framework**: React
- **Gestión de estados**: (pendiente, e.g., Redux o Zustand)
- **Estilos**: CSS puro o Tailwind CSS (próximamente)
- **Construcción y dependencias**: Node.js con npm
- **Conexión al backend**: Axios para APIs REST

---

## 🧱 Estructura del proyecto
El frontend se organiza en componentes modulares y servicios para interactuar con las APIs:

```
LigaCoyohuatzinFrontend/
├── public/
├── src/
│   ├── components/    # Componentes reutilizables (e.g., JugadorForm, ListaJugadores)
│   ├── api/           # Servicios para llamadas a la API (e.g., jugadorApi.ts)
│   ├── pages/         # Páginas principales (e.g., Home, AdminDashboard)
│   ├── App.tsx        # Componente raíz
│   ├── index.tsx      # Punto de entrada
│   └── ...
├── package.json       # Dependencias y scripts
├── tsconfig.json      # Configuración de TypeScript (si aplica)
└── README.md

````

---

## 📦 Funcionalidades clave (actuales y futuras)

| Módulo                  | Estado          | Descripción                                |
|-------------------------|-----------------|--------------------------------------------|
| Lista de Jugadores      | ✅ Completado  | Visualiza jugadores desde la API           |
| Formulario de Jugadores | ⚙️ En progreso | Crear y actualizar jugadores con fotos     |
| Dashboard Admin         | 🚧 Pendiente   | Panel para gestionar torneos y partidos    |
| Autenticación           | 🚧 Pendiente   | Login con JWT                              |
| Estilos Responsivos     | 🚧 Pendiente   | Diseño adaptable a móviles                 |

---

## 🛡️ Reglas de ramas y buenas prácticas
- `main`: Rama estable, contiene solo versiones productivas.
- `dev`: Rama de integración para features nuevas.
- `feature/*`: Ramas de desarrollo por funcionalidad (e.g., `feature/jugador-form`).
- Pushs directos a `main` están prohibidos mediante reglas de protección.
- Los cambios deben subirse vía Pull Request, con revisión (1 aprobación mínimo).

---

## 🧪 Cómo levantar el proyecto

1. Asegúrate de tener [Node.js](https://nodejs.org/) instalado (versión 14+ recomendada).
2. Clona el repositorio:
   ```bash
   git clone https://github.com/Osdan-flo/Fragata--FRONTEND.git
   cd LigaCoyohuatzinFrontend
3. Instala dependencias:
  ```bash
  npm install
````
4. Inicia el servidor de desarrollo:
  ```bash
  npm start
````
5. Asegúrate de que el backend (FRAGATA--Backend) esté corriendo en http://localhost:8080.

---

## 📲 Backend del proyecto
El backend de este sistema se encuentra en su propio repositorio: 👉 [Fragata--BACKEND](https://github.com/osdan-flo/Fragata--BACKEND)

---

## 🧠 Créditos y autores
Proyecto creado por Oscar Daniel Flores Linares como parte de una solución digital para mejorar la visibilidad y administración de ligas deportivas locales.

---

📄 Licencia
Este proyecto está licenciado bajo MIT. Puedes utilizarlo, modificarlo y distribuirlo libremente con fines educativos o sin fines de lucro.

---

- **Notas**:
  - Ajusta `tu-usuario` por tu nombre de usuario de GitHub.
  - La estructura y las funcionalidades reflejan el estado actual y planes futuros basados en tu backend.
  - Mantuvimos consistencia con las ramas y buenas prácticas del backend.

---
