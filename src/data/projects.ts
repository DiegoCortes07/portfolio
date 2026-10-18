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
};

const USER = "DiegoCortes07";

/** Repos que no se muestran: el perfil, el propio sitio y pruebas sueltas. */
const EXCLUDED = new Set(["Test", "DiegoCortes07", "portfolio"]);

const ACCENTS = ["#5eead4", "#a5b4fc", "#f9a8d4", "#fcd34d", "#7dd3fc", "#fdba74"];

type CuratedInfo = {
  description: string;
  highlights: string[];
  stack: string[];
};

/** Descripciones curadas: tienen prioridad sobre la descripción del repo en GitHub. */
const curated: Record<string, CuratedInfo> = {
  Frontend_Proyecto_Soluciones_Moviles: {
    description:
      "Tunesly: app móvil multiplataforma (Android, iOS y web) tipo Spotify construida con React Native + Expo + TypeScript, con catálogo de música y podcasts, reproductor global y playlists.",
    highlights: [
      "Reproductor global con cola, seek, avance automático y mini-reproductor persistente entre pantallas",
      "Autenticación (registro, login, verificación de correo) y contexto de sesión con token",
      "Biblioteca personal: favoritos con actualización optimista y playlists con portada personalizable",
      "Tema claro/oscuro, idioma, filtro de contenido explícito y selección de plan persistidos vía API",
    ],
    stack: ["React Native", "Expo", "TypeScript", "React Navigation", "expo-audio", "axios"],
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

function toProject(repo: GhRepo, index: number, info?: CuratedInfo): Project {
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
    const usable = repos.filter(
      (r) => !r.fork && !r.archived && !EXCLUDED.has(r.name),
    );
    if (usable.length === 0) throw new Error("Sin repositorios públicos utilizables");

    console.info(`[projects] ${usable.length} repositorios públicos cargados desde la API`);
    return usable.map((repo, i) => toProject(repo, i, curated[repo.name]));
  } catch (error) {
    console.warn(
      `[projects] No se pudo consultar la API de GitHub (${error}); usando la lista curada.`,
    );
    return fallback();
  }
}
