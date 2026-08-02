/**
 * Genera las tarjetas de estadísticas del perfil como SVG dentro del repo.
 *
 * Existe porque los servicios públicos de tarjetas (github-readme-stats,
 * github-profile-trophy) se caen por cuota: devolvían 503 y 402 el día que se
 * montó este perfil, dejando imágenes rotas. Generarlas aquí las hace
 * deterministas y con la paleta exacta del portafolio.
 *
 * Uso: GITHUB_TOKEN=... node scripts/generate-stats.mjs [usuario]
 */

const USER = process.argv[2] ?? "enmanuel2028";
const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
  console.error("Falta GITHUB_TOKEN.");
  process.exit(1);
}

const QUERY = `
  query ($login: String!) {
    user(login: $login) {
      followers { totalCount }
      repositories(
        first: 100
        ownerAffiliations: OWNER
        isFork: false
        privacy: PUBLIC
      ) {
        totalCount
        nodes {
          stargazerCount
          languages(first: 12, orderBy: { field: SIZE, direction: DESC }) {
            edges { size node { name } }
          }
        }
      }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalRepositoriesWithContributedCommits
        contributionCalendar { totalContributions }
      }
    }
  }
`;

const response = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
    "User-Agent": "perfil-enmanuel2028",
  },
  body: JSON.stringify({ query: QUERY, variables: { login: USER } }),
});

if (!response.ok) {
  console.error(`GitHub respondió ${response.status}`);
  process.exit(1);
}

const payload = await response.json();
if (payload.errors) {
  console.error(JSON.stringify(payload.errors, null, 2));
  process.exit(1);
}

const user = payload.data.user;
const repos = user.repositories.nodes;
const contrib = user.contributionsCollection;

const stars = repos.reduce((total, repo) => total + repo.stargazerCount, 0);

/** Bytes por lenguaje, sumados sobre todos los repos públicos propios. */
const byLanguage = new Map();
for (const repo of repos) {
  for (const edge of repo.languages.edges) {
    byLanguage.set(edge.node.name, (byLanguage.get(edge.node.name) ?? 0) + edge.size);
  }
}

const totalBytes = [...byLanguage.values()].reduce((a, b) => a + b, 0);
const languages = [...byLanguage.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 6)
  .map(([name, size]) => ({ name, share: totalBytes ? size / totalBytes : 0 }));

/**
 * Tarjetas: números de titular, no un gráfico de barras de una sola barra.
 * Las estrellas solo aparecen si hay: un cero no aporta nada y ocupa un hueco.
 */
const tiles = [
  { value: user.repositories.totalCount, label: "Repositorios públicos" },
  { value: contrib.contributionCalendar.totalContributions, label: "Contribuciones · 12 meses" },
  { value: contrib.totalCommitContributions, label: "Commits · 12 meses" },
  stars > 0
    ? { value: stars, label: "Estrellas recibidas" }
    : { value: contrib.totalPullRequestContributions, label: "Pull requests · 12 meses" },
];

const nf = new Intl.NumberFormat("es-CO");
const pf = new Intl.NumberFormat("es-CO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const escape = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const updated = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Bogota",
}).format(new Date());

const THEMES = {
  dark: {
    surface: "#0b1120",
    border: "#1e293b",
    ink: "#f8fafc",
    muted: "#94a3b8",
    faint: "#64748b",
    accent: "#38bdf8",
    track: "#16203a",
  },
  light: {
    surface: "#ffffff",
    border: "#e2e8f0",
    ink: "#0f172a",
    muted: "#475569",
    faint: "#94a3b8",
    accent: "#0284c7",
    track: "#e2e8f0",
  },
};

const SANS = "'Segoe UI',Inter,Helvetica,Arial,sans-serif";
const MONO = "'JetBrains Mono','SFMono-Regular',Consolas,monospace";

const W = 900;
const H = 388;
const PAD = 34;

/** Barra con el extremo de dato redondeado (4px) y la base cuadrada. */
function barPath(x, y, width, height) {
  const r = Math.min(4, width / 2, height / 2);
  if (width <= 0) return "";
  return [
    `M${x} ${y}`,
    `H${x + width - r}`,
    `a${r} ${r} 0 0 1 ${r} ${r}`,
    `V${y + height - r}`,
    `a${r} ${r} 0 0 1 ${-r} ${r}`,
    `H${x}`,
    "Z",
  ].join(" ");
}

function card(theme) {
  const t = THEMES[theme];
  const tileWidth = (W - PAD * 2) / tiles.length;

  const tileMarkup = tiles
    .map((tile, index) => {
      const x = PAD + tileWidth * index;
      return `
    <text x="${x.toFixed(1)}" y="132" font-family="${SANS}" font-size="34" font-weight="600" fill="${t.ink}">${nf.format(tile.value)}</text>
    <text x="${x.toFixed(1)}" y="155" font-family="${SANS}" font-size="12.5" fill="${t.muted}">${escape(tile.label)}</text>`;
    })
    .join("");

  // Barras: una sola serie, un solo tono. La magnitud manda en la longitud y
  // el orden; la opacidad hace de rampa secuencial. La identidad va en el
  // texto, nunca solo en el color.
  const barX = 178;
  const barMax = W - PAD - barX - 58;
  const rowPitch = 25;
  const barHeight = 11;

  const barMarkup = languages
    .map((lang, index) => {
      const y = 226 + rowPitch * index;
      const width = Math.max(3, barMax * lang.share);
      const opacity = (1 - index * 0.115).toFixed(3);
      return `
    <text x="${barX - 14}" y="${y + barHeight - 1}" text-anchor="end" font-family="${SANS}" font-size="12.5" fill="${t.muted}">${escape(lang.name)}</text>
    <rect x="${barX}" y="${y}" width="${barMax}" height="${barHeight}" rx="4" fill="${t.track}" opacity="0.55" />
    <path d="${barPath(barX, y, width, barHeight)}" fill="${t.accent}" opacity="${opacity}" />
    <text x="${(barX + width + 10).toFixed(1)}" y="${y + barHeight - 1}" font-family="${MONO}" font-size="11.5" fill="${t.faint}">${pf.format(lang.share * 100)} %</text>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Estadisticas de GitHub de ${USER}">
  <title>Actividad de ${USER} en GitHub</title>
  <rect width="${W}" height="${H}" rx="14" fill="${t.surface}" />
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" fill="none" stroke="${t.border}" />

  <text x="${PAD}" y="60" font-family="${SANS}" font-size="19" font-weight="600" fill="${t.ink}">Actividad en GitHub</text>
  <text x="${W - PAD}" y="60" text-anchor="end" font-family="${MONO}" font-size="11.5" fill="${t.faint}">Actualizado el ${updated}</text>
  <rect x="${PAD}" y="76" width="46" height="2.5" rx="1.25" fill="${t.accent}" />
${tileMarkup}

  <line x1="${PAD}" y1="184" x2="${W - PAD}" y2="184" stroke="${t.border}" stroke-width="1" />
  <text x="${PAD}" y="209" font-family="${SANS}" font-size="13" font-weight="600" fill="${t.muted}">Lenguajes por volumen de código en repositorios públicos</text>
${barMarkup}
</svg>
`;
}

const { writeFile } = await import("node:fs/promises");
for (const theme of ["dark", "light"]) {
  await writeFile(new URL(`../assets/stats-${theme}.svg`, import.meta.url), card(theme), "utf8");
}

console.log(
  `Tarjetas generadas · ${user.repositories.totalCount} repos · ` +
    `${contrib.contributionCalendar.totalContributions} contribuciones · ` +
    `${languages.length} lenguajes`,
);
