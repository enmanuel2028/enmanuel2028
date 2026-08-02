# Mantenimiento del perfil

Este repositorio se llama igual que la cuenta (`enmanuel2028`), por eso su `README.md`
se muestra en la portada de <https://github.com/enmanuel2028>.

## Estructura

| Ruta | Qué es |
| :-- | :-- |
| `README.md` | Lo que ve todo el mundo en el perfil. |
| `assets/header-dark.svg` / `header-light.svg` | Banner animado propio (SVG + SMIL). Sin dependencias externas. |
| `assets/divider.svg` | Separador con haz animado, reutilizado entre secciones. |
| `.github/workflows/snake.yml` | Genera la animación de la serpiente cada 12 horas. |

## Tema claro y oscuro

Cada imagen usa `<picture>` con `prefers-color-scheme`. Si editas una versión,
edita también la otra: la paleta clara es la misma identidad con contraste invertido.

| Rol | Oscuro | Claro |
| :-- | :-- | :-- |
| Fondo | `#0B1120` | `#FFFFFF` |
| Acento primario | `#38BDF8` | `#0284C7` |
| Acento secundario | `#8B5CF6` | `#7C3AED` |
| Texto | `#94A3B8` | `#475569` |
| Borde | `#1E293B` | `#E2E8F0` |

Es la misma paleta del portafolio (`src/app/globals.css`), para que perfil y sitio
se lean como una sola marca.

## La animación de la serpiente

El workflow publica `snake-dark.svg` y `snake-light.svg` en una rama llamada `output`.
**Hasta que corra por primera vez, esa imagen aparece rota.** Después del primer push a
`main` se ejecuta solo; también puedes lanzarlo a mano desde la pestaña *Actions*.

Si el workflow falla con un error de permisos, entra en
`Settings → Actions → General → Workflow permissions` y activa **Read and write permissions**.

## Servicios externos usados

El banner y los separadores son propios. Las tarjetas de estadísticas sí dependen de
servicios de terceros gratuitos; si alguno cae, la imagen deja de cargar y basta con
borrar ese bloque:

- `github-readme-stats.vercel.app` — estadísticas y lenguajes
- `streak-stats.demolab.com` — racha de contribuciones
- `github-readme-activity-graph.vercel.app` — gráfico de actividad
- `github-profile-trophy.vercel.app` — trofeos
- `readme-typing-svg.demolab.com` — titulares que se escriben solos
- `komarev.com/ghpvc` — contador de visitas
- `img.shields.io` — insignias

## Pendientes marcados en el README

Hay un bloque comentado al final con los enlaces que aún no existen: **dominio del
portafolio** y **LinkedIn**. Están comentados a propósito: un enlace sin configurar
no se renderiza, para no dejar enlaces rotos en el perfil.

## Datos personales expuestos

El README publica el correo y el número de WhatsApp. Son los mismos que ya aparecen en
`src/content/personal.ts` del portafolio. Si prefieres no exponer el teléfono en GitHub,
borra la insignia de WhatsApp en las dos secciones (cabecera y "Hablemos").
