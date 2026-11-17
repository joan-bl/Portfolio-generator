# 🎨 Generador de Portafolios

Aplicación web en React para crear un portafolio personal paso a paso y descargarlo como **un único archivo HTML** listo para publicar en cualquier hosting estático.

## Qué hace

1. **Datos personales:** nombre, título, ubicación, contacto, redes sociales y vídeo de fondo opcional. La biografía se puede escribir a mano o rellenar con un borrador ("Generar borrador"), que se monta con una plantilla a partir de tu título, ubicación y habilidades. No usa IA ni ningún servicio externo.
2. **Habilidades:** se añaden a mano o con "Sugerir Skills".
3. **Proyectos:** se añaden a mano o se importan los 6 repositorios más recientes de tu perfil de GitHub (API pública, sin token).
4. **Experiencia y testimonios**, en una línea de tiempo y en tarjetas con valoración.
5. **Diseño:** 7 temas (Minimal, Creative, Tech, Warm, Nature, Elegant y Dark), 3 distribuciones (Grid, Bento y Masonry), colores personalizables y modo oscuro.
6. **Vista previa** en móvil, tablet o escritorio, y **exportación** a un HTML con SEO básico (Open Graph y Twitter Cards), modo oscuro y, opcionalmente, Google Analytics 4 con tu ID.

El trabajo se guarda automáticamente en el `localStorage` del navegador.

### Limitaciones conocidas

- El HTML exportado carga Tailwind desde su CDN, así que necesita internet para verse con estilos.
- El "PWA" exportado incluye solo un *manifest*: se puede añadir a la pantalla de inicio, pero **no funciona sin conexión**.

## Ejecutar en local

Necesitas Node.js 16 o superior.

```bash
git clone https://github.com/joan-bl/Portfolio-generator.git
cd Portfolio-generator
npm install
npm start            # http://localhost:3000
```

En Windows también puedes hacer doble clic en `start-portfolio.bat`: arranca el servidor y abre el navegador.

Para generar la versión de producción, ejecuta `npm run build`. El resultado queda en `build/`.

## Estructura

```
src/
├── App.jsx      # Toda la aplicación: editor, vista previa y generador del HTML exportado
├── index.js     # Punto de entrada
└── index.css    # Tailwind y animaciones
```

## Tecnologías

React 18, Tailwind CSS 3 y Lucide React (iconos).
