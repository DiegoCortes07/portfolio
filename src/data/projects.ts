export type Project = {
  name: string;
  repo: string;
  description: string;
  highlights: string[];
  stack: string[];
  language: string;
  accent: string;
  pushedAt: string;
  stars: number;
  award?: string;
  pairLinks?: { emoji: string; role: string; url: string }[];
};

const USER = "DiegoCortes07";

/** Repos que no se muestran: el perfil, el propio sitio y pruebas sueltas. */
const EXCLUDED = new Set(["Test", "DiegoCortes07", "portfolio"]);

/** Repos que no llevan tarjeta propia porque se muestran junto a otro. */
const HIDDEN_FROM_LIST = new Set(["Backend_Proyecto_Soluciones_Moviles"]);

const ACCENTS = ["#5eead4", "#a5b4fc", "#f9a8d4", "#fcd34d", "#7dd3fc", "#fdba74"];

type CuratedInfo = {
  description: string;
  highlights: string[];
  stack: string[];
  award?: string;
  /** Repositorios que se muestran lado a lado (frontend + backend). */
  pair?: { emoji: string; role: string; name: string }[];
};

/** Descripciones curadas: tienen prioridad sobre la descripción del repo en GitHub. */
const curated: Record<string, CuratedInfo> = {
  Frontend_Proyecto_Soluciones_Moviles: {
    description:
      "Tunesly: proyecto full stack completo — app móvil multiplataforma (Android, iOS y web) tipo Spotify con React Native + Expo + TypeScript, más su API REST con JWT, Sequelize y Cloudinary.",
    highlights: [
      "Reproductor global con cola, seek, avance automático y mini-reproductor persistente entre pantallas",
      "API REST propia con autenticación JWT, verificación de correo y subida de audio e imágenes a Cloudinary",
      "Biblioteca personal: favoritos con actualización optimista y playlists con portada personalizable",
      "Tema claro/oscuro, idioma, filtro de contenido explícito y selección de plan persistidos vía API",
    ],
    stack: ["React Native", "Expo", "TypeScript", "Node.js", "Express", "Sequelize", "JWT"],
    pair: [
      { emoji: "📱", role: "Frontend", name: "Frontend_Proyecto_Soluciones_Moviles" },
      { emoji: "🖥️", role: "Backend", name: "Backend_Proyecto_Soluciones_Moviles" },
    ],
  },
  Hackadisc2026: {
    description:
      "Dashboard de ventas de Insecap: KPIs por vendedor y por equipo, metas, pronóstico de cierre mensual y oportunidades comerciales priorizadas, con vistas separadas para gerencia y ejecutivos.",
    highlights: [
      "ETL de Excel a SQLite re-ejecutable (24.664 comercializaciones, 18.570 cotizaciones)",
      "Autenticación con roles gerencial/ejecutivo y seed de usuarios con claves aleatorias",
      "CI en GitHub Actions: suite de backend con pytest y build + tests del frontend",
      "Bandeja de alertas, recomendaciones internas y exportación a CSV",
    ],
    stack: ["Python", "FastAPI", "Next.js", "SQLite", "ETL", "CI"],
    award: "🥈 2° lugar en Hackadisc 2026",
  },
  "Backend-Ayudantia-DSM": {
    description:
      "Backend educativo construido sesión a sesión para ayudantías: API REST sobre Express con Sequelize, migraciones, seeds transaccionales y una simulación de delivery en tiempo real con Socket.IO.",
    highlights: [
      "Modelos Role, User y Product con migraciones y asociaciones Sequelize",
      "Validación de duplicados con una sola query usando Op.or",
      "Contraseñas hasheadas con bcrypt y seeds que corren dentro de una transacción",
      "Simulación pub/sub de ubicación de delivery con Socket.IO",
    ],
    stack: ["Node.js", "Express", "Sequelize", "SQLite", "Socket.IO", "bcrypt"],
  },
  "Frontend-Ayudantia-DSM": {
    description:
      "Proyecto de apoyo para las ayudantías de DSM construido con Expo y Expo Router, donde se implementan pantalla a pantalla las funcionalidades del curso.",
    highlights: [
      "Navegación con Expo Router y ruta raíz que redirige a /login",
      "Pantalla de login con campos controlados y contador para practicar estado en React Native",
      "Documentación progresiva por ayudantía dentro del propio README",
    ],
    stack: ["React Native", "Expo Router", "JavaScript"],
  },
  "Proyecto-Rayman-5": {
    description:
      "Experiencia de Realidad Aumentada desarrollada en Unity, explorando la integración de objetos virtuales en entornos físicos reales.",
    highlights: [
      "Desarrollado en Unity con C#",
      "Experiencia interactiva de AR",
    ],
    stack: ["Unity", "C#", "AR"],
  },
  "ProyectoIngSoftware2025-1": {
    description:
      "Proyecto del curso de Ingeniería de Software, aplicando el ciclo completo de análisis, diseño e implementación de una aplicación web.",
    highlights: [
      "Desarrollado en PHP como parte del ramo de Ingeniería de Software",
      "Enfoque en procesos de levantamiento de requerimientos y diseño",
    ],
    stack: ["PHP", "SQL"],
  },
  "vite-project": {
    description:
      "Calculadora web construida como proyecto de prueba con React y Vite, explorando el manejo de estado y la lógica de eventos en el frontend.",
    highlights: [
      "Bundle con Vite para desarrollo rápido",
      "Componentes de React con estado controlado",
    ],
    stack: ["React", "Vite", "CSS"],
  },
};

type GhRepo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  stargazers_count: number;
};

function toProject(
  repo: GhRepo,
  index: number,
  info?: CuratedInfo,
  byName?: Map<string, GhRepo>,
): Project {
  const language = repo.language ?? "Código";
  return {
    name: repo.name,
    repo: repo.html_url,
    description:
      info?.description ??
      repo.description ??
      `Proyecto público desarrollado en ${language}.`,
    highlights: info?.highlights ?? [],
    stack: info?.stack ?? (repo.language ? [repo.language] : []),
    language,
    accent: ACCENTS[index % ACCENTS.length],
    pushedAt: repo.pushed_at,
    stars: repo.stargazers_count,
    award: info?.award,
    pairLinks: info?.pair?.map((p) => ({
      emoji: p.emoji,
      role: p.role,
      url: byName?.get(p.name)?.html_url ?? `https://github.com/${USER}/${p.name}`,
    })),
  };
}

/** Respaldo estático por si la API de GitHub no responde durante el build. */
function fallback(): Project[] {
  return Object.entries(curated).map(([name, info], i) =>
    toProject(
      {
        name,
        html_url: `https://github.com/${USER}/${name}`,
        description: null,
        language: info.stack[0] ?? null,
        fork: false,
        archived: false,
        pushed_at: "",
        stargazers_count: 0,
      },
      i,
      info,
    ),
  );
}

/**
 * Obtiene los repositorios públicos de GitHub en tiempo de build.
 * Los repos nuevos aparecen automáticamente; los curados conservan su descripción.
 */
export async function fetchProjects(): Promise<Project[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": `${USER}-portfolio`,
  };
  const token = import.meta.env.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(
      `https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed&direction=desc`,
      { headers },
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);

    const repos = (await res.json()) as GhRepo[];
    const all = repos.filter(
      (r) => !r.fork && !r.archived && !EXCLUDED.has(r.name),
    );
    // El mapa incluye los repos emparejados, aunque no lleven tarjeta propia.
    const byName = new Map(all.map((r) => [r.name, r]));
    const usable = all.filter((r) => !HIDDEN_FROM_LIST.has(r.name));
    if (usable.length === 0) throw new Error("Sin repositorios públicos utilizables");

    console.info(`[projects] ${usable.length} repositorios públicos cargados desde la API`);
    return usable.map((repo, i) => toProject(repo, i, curated[repo.name], byName));
  } catch (error) {
    console.warn(
      `[projects] No se pudo consultar la API de GitHub (${error}); usando la lista curada.`,
    );
    return fallback();
  }
}
