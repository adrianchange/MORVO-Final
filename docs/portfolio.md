# MORVO — Dossier digital interactivo

**Tipo de proyecto:** Dossier escénico · Identidad visual · Frontend creativo  
**Cliente / contexto:** Compañía OBSCENA Teatral · Producción teatral MORVO  
**Stack:** React 19 · TypeScript · Vite · Motion · SVG · CSS-in-JS

---

## Resumen

Dossier web para la obra de teatro **MORVO**, desarrollado como SPA en **React, TypeScript y Vite**, con animaciones complejas en **Motion**. Responde a dos necesidades complementarias: una **herramienta de presentación profesional** para teatros y festivales, y un **laboratorio de identidad visual** con **11 paletas de color** intercambiables — una para el dossier institucional y el resto para campañas en redes y material gráfico de difusión.

---

## Problema y enfoque

Las producciones teatrales independientes suelen repartir su identidad visual entre PDF estáticos, imágenes sueltas para redes y presentaciones poco cohesionadas. **MORVO** unifica el dossier en una experiencia web navegable y, al mismo tiempo, permite explorar variantes cromáticas de la marca sin duplicar contenido ni rehacer maquetaciones.

La decisión de arquitectura clave fue un **sistema de temas centralizado** (`palettes.ts`, `typography.ts`, `swap.ts`) que desacopla identidad visual de estructura de slides.

---

## Elemento distintivo: el título MORVO

El logotipo tipográfico **MORVO** — referencia directa a la estética de *Killing Eve* — constituye el núcleo gráfico del proyecto:

- Glifo **V** vectorizado desde la fuente **Killing Eve**, con métricas reales de tipografía digital.
- **Cuatro variantes de animación de goteo** según paleta (Helecho, Niebla, Pino, Selva), implementadas con keyframes SVG y Motion.
- Créditos (*Naz Montés*, *Compañía OBSCENA Teatral*) sincronizados con el ciclo de la gota.
- Calibración responsive independiente para móvil y escritorio.

---

## Contenido del dossier (8 slides)

1. Portada animada  
2. Imagen promocional / flyer  
3. Sinopsis  
4–6. Fichas de personaje (Mario, Cristian, Víctor)  
7. Directora (Naz Montés)  
8. Teaser audiovisual y contacto  

Navegación por teclado, swipe táctil e indicadores de progreso.

---

## Rol desempeñado

- Diseño e implementación frontend completa  
- Sistema de diseño multi-tema y tokens cromáticos  
- Animación SVG y sincronización temporal con Motion  
- Integración tipográfica custom (Killing Eve + Google Fonts)  
- UX de presentación escénica y adaptación responsive  

---

## Resultado

Aplicación web ligera (~390 KB JS gzip), desplegable como sitio estático, que funciona como dossier institucional y como banco de variantes visuales para la campaña de la obra en redes sociales.

---

## Enlaces

- Repositorio: [morvo-dossier](https://github.com/) *(actualizar URL)*  
- Demo: *(añadir URL de despliegue si existe)*
