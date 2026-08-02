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
Se actualiza cada 12 horas, con cada push a `main` o manualmente desde *Actions*.

Si el workflow falla con un error de permisos, entra en
`Settings → Actions → General → Workflow permissions` y activa **Read and write permissions**.

## La tarjeta de estadísticas es nuestra

`scripts/generate-stats.mjs` consulta la API GraphQL de GitHub y dibuja
`assets/stats-dark.svg` y `stats-light.svg`. El workflow `stats.yml` lo ejecuta cada
12 horas y hace commit solo si el resultado cambió.

Existe por una razón concreta: el 2 de agosto de 2026, al montar este perfil,
`github-readme-stats.vercel.app` devolvía **503** y `github-profile-trophy.vercel.app`
**402** (cuota agotada). Las dos imágenes salían rotas en el README. Generarlas aquí
las vuelve deterministas y con la paleta exacta.

Decisiones de la tarjeta, por si la editas:

- Los cuatro números de arriba son **tarjetas de estadística**, no un gráfico: para un
  número de titular, una barra sola no aporta nada.
- Los lenguajes van en **barras horizontales de un solo tono**. La identidad la lleva
  la etiqueta de texto, no el color, así que no depende de distinguir matices.
- **Las estrellas solo aparecen si hay alguna.** Con cero, el hueco lo ocupa el número
  de pull requests.
- Mide **bytes de código**, que es lo que dice el título. Un repositorio con
  dependencias versionadas dentro infla su lenguaje; si algún día distorsiona
  demasiado, hay que excluir ese repo en el script.

Para probarlo en local:

```bash
GITHUB_TOKEN=$(gh auth token) node scripts/generate-stats.mjs
```

## Servicios externos que quedan

El banner, los separadores y la tarjeta de estadísticas son propios. Lo demás depende
de terceros gratuitos; si alguno cae, la imagen deja de cargar y basta con borrar ese
bloque del README:

- `streak-stats.demolab.com` — racha de contribuciones
- `github-readme-activity-graph.vercel.app` — gráfico de actividad
- `readme-typing-svg.demolab.com` — titulares que se escriben solos
- `komarev.com/ghpvc` — contador de visitas
- `img.shields.io` — insignias

## Pendientes marcados en el README

Hay un bloque comentado al final de la sección "Hablemos" con lo que aún no se publica:
**dominio del portafolio**, **LinkedIn** y **WhatsApp**. Están comentados a propósito: un
enlace sin configurar no se renderiza, para no dejar enlaces rotos en el perfil.

## Datos personales expuestos

El único canal público del perfil es el **correo** (`manosalvaaceros@gmail.com`).

El **WhatsApp está fuera a propósito**: un perfil de GitHub recibe mucha más exposición al
spam que el portafolio. La insignia queda lista dentro del comentario de "Hablemos";
descoméntala si en algún momento lo quieres visible.
