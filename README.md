# MORVO — Dossier digital interactivo

> Dossier web interactivo para la producción teatral **MORVO** (*Compañía OBSCENA Teatral*).  
> React · TypeScript · Vite · Motion · Sistema multi-paleta de identidad visual.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)

---

## Descripción

**MORVO** es un dossier digital de presentación para una obra de teatro, concebido como aplicación web de una sola página (SPA). Permite a salas, festivales y equipos de producción recorrer la información esencial de la pieza — portada, sinopsis, elenco, directora y teaser — en un formato visual cuidado y navegable.

El proyecto incluye un **sistema de identidad visual modular** con **11 paletas cromáticas** intercambiables:

- **Una paleta principal** seleccionada para el dossier institucional.
- **Diez variantes adicionales** orientadas a **publicidad en redes sociales**, flyers y exploración gráfica de la línea visual de la obra, sin duplicar la estructura de contenido.

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | **React 19** + **TypeScript 6** |
| Build | **Vite 8** |
| Animación | **Motion** (API compatible con Framer Motion) |
| Tipografía | Google Fonts + fuente custom **Killing Eve** (réplica tipográfica de la serie) |
| Despliegue | Build estático (`dist/`) — GitHub Pages, Netlify, Vercel… |

Sin backend: contenido embebido en componentes, navegación 100 % cliente.

---

## Funcionalidades

- **Selector de paletas** con previsualización animada del logotipo MORVO.
- **Dossier de 8 slides**: portada, imagen promocional, sinopsis, tres fichas de personaje, directora y teaser audiovisual con contacto.
- **Navegación accesible**: teclado (← →, espacio, Escape), swipe táctil en móvil, indicadores de progreso y controles laterales.
- **Viewport escénico 16:9** en escritorio; pantalla completa en móvil.
- Servidor de desarrollo accesible en red local (`host: true`) para pruebas en dispositivos reales.

---

## Sistema de diseño multi-paleta

Arquitectura de temas centralizada en `src/theme/`:

| Archivo | Responsabilidad |
|---------|-----------------|
| `palettes.ts` | 11 identidades visuales con tokens (`greenDark`, `accent`, `bg`, `text`, `titleLetters`, `titleV`…) |
| `typography.ts` | Familias tipográficas, escalas del título MORVO, constantes de composición |
| `swap.ts` | Paleta cromática compartida y utilidades de transición |

### Paletas originales (concepto dramático)

Litúrgico · Hospital · Podredumbre · Invertida · Mezcla

### Serie Raíz (identidad Killing Eve / difusión)

Selva · Pino · Petróleo · Helecho · Niebla · Esmeralda

Cada paleta altera fondo, tipografía, créditos de portada y animaciones del título sin reescribir el dossier.

---

## Animaciones de marca (portada)

El componente `CoverTitle.tsx` actúa como motor gráfico del título **MORVO**:

- Glifo **V** como **SVG vectorial** extraído de `KillingEve.ttf`, con métricas tipográficas reales (`advance`, junta interior, punta exterior).
- **Variantes de chorreo animado** por paleta: clásico Helecho, lágrima Niebla, gota Pino, gota Selva (formación en junta → hilo → caída → impacto).
- Créditos sincronizados con la animación (*Naz Montés*, *Compañía OBSCENA Teatral*).
- Camuflaje cromático de la gota dentro del contorno de la V; cambio de color al impacto.
- Composición responsive (breakpoint 768 px) con calibración fina de posicionamiento en móvil y escritorio.

---

## Estructura del proyecto

```
src/
├── App.tsx                 # Stage 16:9 + enrutado paleta → dossier
├── components/
│   ├── VColorPicker.tsx    # Selector de identidad visual
│   ├── CoverTitle.tsx      # Título MORVO + animaciones V
│   ├── Dossier.tsx         # Orquestación de slides y navegación
│   ├── TeaserVideo.tsx     # Montaje audiovisual del teaser
│   ├── helechoVGlyph.ts    # Datos del glifo V (Killing Eve)
│   └── slides/             # Portada, sinopsis, personajes, flyer, teaser…
├── theme/                  # Paletas, tipografía, tokens de color
└── hooks/useIsMobile.ts    # Breakpoint responsive
```

---

## Arrancar

```bash
npm install
npm run dev      # desarrollo (localhost + LAN)
npm run build    # TypeScript + bundle de producción
npm run preview  # vista previa del build
```

Abre la URL que muestra la terminal (normalmente `http://localhost:5173`). En móvil, usa la IP de red local del equipo (p. ej. `http://192.168.x.x:5173`).

### Uso

1. Elige una **paleta** en el selector inicial.
2. Navega el dossier con **← →** o **espacio**, clic en los lados o swipe en móvil.
3. **Escape** o «cambiar paleta» vuelve al selector.

---

## Exportación PDF

El PDF para teatros se genera aparte (captura de pantalla o «Imprimir → PDF» del navegador). Las animaciones viven en la versión web.

---

## Documentación adicional

Versiones del proyecto adaptadas a distintos contextos profesionales:

- [Ficha de portfolio](docs/portfolio.md)
- [CV académico](docs/cv-academico.md)
- [LinkedIn](docs/linkedin.md)

---

## Licencia de fuentes

La fuente **Killing Eve** es freeware con condiciones de uso comercial — ver `public/fonts/KILLING-EVE-LICENSE.txt`.

---

## Tags

`react` · `typescript` · `vite` · `motion` · `svg-animation` · `design-system` · `theater` · `interactive-dossier` · `branding` · `responsive-design` · `spa`
