export type Project = {
  name: string;
  repo: string;
  description: string;
  highlights: string[];
  stack: string[];
  language: string;
  accent: string;
};

export const projects: Project[] = [
  {
    name: "Hackadisc2026",
    repo: "https://github.com/DiegoCortes07/Hackadisc2026",
    description:
      "Dashboard de ventas de Insecap: KPIs por vendedor y por equipo, metas, pronóstico de cierre mensual y oportunidades comerciales priorizadas, con vistas separadas para gerencia y ejecutivos.",
    highlights: [
      "ETL de Excel a SQLite re-ejecutable (24.664 comercializaciones, 18.570 cotizaciones)",
      "Autenticación con roles gerencial/ejecutivo y seed de usuarios con claves aleatorias",
      "CI en GitHub Actions: suite de backend con pytest y build + tests del frontend",
      "Bandeja de alertas, recomendaciones internas y exportación a CSV",
    ],
    stack: ["Python", "FastAPI", "Next.js", "SQLite", "ETL", "CI"],
    language: "Python",
    accent: "#5eead4",
  },
  {
    name: "Backend-Ayudantia-DSM",
    repo: "https://github.com/DiegoCortes07/Backend-Ayudantia-DSM",
    description:
      "Backend educativo construido sesión a sesión para ayudantías: API REST sobre Express con Sequelize, migraciones, seeds transaccionales y una simulación de delivery en tiempo real con Socket.IO.",
    highlights: [
      "Modelos Role, User y Product con migraciones y asociaciones Sequelize",
      "Validación de duplicados con una sola query usando Op.or",
      "Contraseñas hasheadas con bcrypt y seeds que corren dentro de una transacción",
      "Simulación pub/sub de ubicación de delivery con Socket.IO",
    ],
    stack: ["Node.js", "Express", "Sequelize", "SQLite", "Socket.IO", "bcrypt"],
    language: "JavaScript",
    accent: "#a5b4fc",
  },
  {
    name: "Proyecto-Rayman-5",
    repo: "https://github.com/DiegoCortes07/Proyecto-Rayman-5",
    description:
      "Experiencia de Realidad Aumentada desarrollada en Unity, explorando la integración de objetos virtuales en entornos físicos reales.",
    highlights: [
      "Desarrollado en Unity con C#",
      "Experiencia interactiva de AR",
      "Proyecto validado y colaborativo (con star de la comunidad)",
    ],
    stack: ["Unity", "C#", "AR"],
    language: "C#",
    accent: "#f9a8d4",
  },
  {
    name: "ProyectoIngSoftware2025-1",
    repo: "https://github.com/DiegoCortes07/ProyectoIngSoftware2025-1",
    description:
      "Proyecto del curso de Ingeniería de Software, aplicando el ciclo completo de análisis, diseño e implementación de una aplicación web.",
    highlights: [
      "Desarrollado en PHP como parte del ramo de Ingeniería de Software",
      "Enfoque en procesos de levantamiento de requerimientos y diseño",
    ],
    stack: ["PHP", "SQL", "Ingeniería de Software"],
    language: "PHP",
    accent: "#fcd34d",
  },
  {
    name: "vite-project",
    repo: "https://github.com/DiegoCortes07/vite-project",
    description:
      "Calculadora web construida como proyecto de prueba con React y Vite, explorando el manejo de estado y la lógica de eventos en el frontend.",
    highlights: [
      "Bundle con Vite para desarrollo rápido",
      "Componentes de React con estado controlado",
    ],
    stack: ["React", "Vite", "CSS"],
    language: "CSS",
    accent: "#7dd3fc",
  },
];
