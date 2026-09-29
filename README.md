# MORVO-Final — Dossier institucional (Petróleo)

> Dossier web de entrega para la producción teatral **MORVO** (*Compañía OBSCENA Teatral*), fijado en la identidad **Raíz Petróleo**.  
> React · TypeScript · Vite · Motion · Teaser audiovisual definitivo.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Demo](https://img.shields.io/badge/Demo-morvo--final.vercel.app-black?logo=vercel)](https://morvo-final.vercel.app)

**Demo en vivo:** [https://morvo-final.vercel.app](https://morvo-final.vercel.app)

> **Laboratorio multi-paleta** (exploración previa): [Morvo](https://github.com/adrianchange/Morvo)

---

## Qué es este repo

**MORVO-Final** es la **versión de presentación** del dossier: la que se muestra a salas, festivales y equipos de producción.

Abre directamente el dossier en **Raíz Petróleo** (sin selector de colores). Incluye el **teaser definitivo** en MP4 (`Teaser_v18`, 16:9) integrado en la última slide, con créditos de vídeo y layout pensado para escritorio y móvil.

El trabajo de exploración cromática vive en [Morvo](https://github.com/adrianchange/Morvo); este repositorio concentra el resultado listo para enseñar.

---

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | **React 19** + **TypeScript 6** |
| Build | **Vite 8** |
| Animación | **Motion** |
| Tipografía | **Cinzel** + Google Fonts + **Killing Eve** |
| Despliegue | **Vercel** (build estático) |

Sin backend: SPA 100 % cliente.

---

## Contenido del dossier (8 slides)

1. Portada animada (identidad Petróleo)  
2. Imagen promocional / flyer  
3. Sinopsis  
4–6. Fichas de personaje (Mario, Cristian, Víctor)  
7. Directora (Naz Montés)  
8. **Teaser** (`Teaser_v18.mp4`) + créditos y contacto  

Navegación por teclado (← →, espacio), swipe táctil e indicadores de progreso. Viewport escénico **16:9** en PC; pantalla completa en móvil.

---

## Identidad Raíz Petróleo

Paleta institucional seleccionada tras el laboratorio:

- Fondo oscuro, tipografía de portada en línea Cinzel.
- Acento salmón / esmeralda en título y UI.
- Teaser con portada «COMPAÑÍA / PRESENTA», montaje audiovisual y créditos (incl. vídeo).
- Composición responsive: en landscape, teaser + créditos en dos columnas; en portrait, flujo vertical.

El sistema de temas (`src/theme/`) sigue presente por arquitectura compartida con el laboratorio, pero la app **bloquea** `raiz_petroleo` en `App.tsx`.

---

## Destacados técnicos

- Integración de vídeo de teaser a pantalla completa dentro del marco del dossier (`TeaserFileVideo`).
- Shell de presentación tipo producto desplegado (contenedor ~920 px en escritorio, sin recortar el 16:9).
- Modos de grabación auxiliares (`?record=petroleo`, `?record=v09-credits`) para exportar piezas sueltas.
- Animación del título MORVO con glifo **V** vectorial (fuente Killing Eve).

---

## Estructura

```
src/
├── App.tsx                      # Dossier fijo → raiz_petroleo
├── assets/teaserFile.ts         # URL del Teaser_v18.mp4
├── components/
│   ├── CoverTitle.tsx           # Título MORVO + V animada
│   ├── Dossier.tsx              # Orquestación de slides
│   ├── TeaserFileVideo.tsx      # Reproductor del teaser final
│   ├── TeaserVideo.tsx          # Motor de montaje (legado / record)
│   └── slides/                  # Portada, sinopsis, elenco, teaser…
├── theme/                       # Tokens (paleta activa: Petróleo)
└── hooks/
```

---

## Arrancar

```bash
npm install
npm run dev
npm run build
npm run preview
```

Abre la URL de Vite (normalmente `http://localhost:5173`). En móvil de la misma red: `http://192.168.x.x:5173`.

### Uso

1. Entras directo al dossier Petróleo (sin selector).
2. Navega con **← →** / **espacio**, clic o swipe.
3. En la última slide, reproduce el teaser y consulta créditos / contacto.

---

## Relación con Morvo

| | **MORVO-Final** (este repo) | **Morvo** |
|--|----------------------------|-----------|
| Rol | Entrega para teatros | Laboratorio visual |
| Paleta | Fija: Raíz Petróleo | 13 identidades |
| Teaser | MP4 `Teaser_v18` | Montaje interactivo por tema |
| Demo | [morvo-final.vercel.app](https://morvo-final.vercel.app) | — |

---

## Documentación

- [Ficha de portfolio](docs/portfolio.md)
- [CV académico](docs/cv-academico.md)
- [LinkedIn](docs/linkedin.md)

---

## Licencia de fuentes

La fuente **Killing Eve** es freeware con condiciones de uso comercial — ver `public/fonts/KILLING-EVE-LICENSE.txt`.

---

## Tags

`react` · `typescript` · `vite` · `motion` · `theater` · `interactive-dossier` · `video` · `vercel` · `spa` · `branding`
