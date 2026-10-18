# Portafolio — Diego Cortes

Sitio portafolio construido con [Astro](https://astro.build) que **se sincroniza solo**
con los repositorios públicos de [@DiegoCortes07](https://github.com/DiegoCortes07).

🔗 **Sitio en vivo:** https://diegocortes07.github.io/portfolio/

## Cómo funciona la sincronización

En tiempo de build, `src/data/projects.ts` consulta la API de GitHub y arma las tarjetas
del portafolio:

- Los repositorios **nuevos y públicos aparecen automáticamente**, sin tocar código.
- Se excluyen los forks, los repos archivados y una lista de nombres en `EXCLUDED`.
- Los repos con descripción y viñetas curadas en `src/data/projects.ts` conservan ese
  texto; el resto usa la descripción del propio repositorio de GitHub.
- Si la API falla, el sitio usa la lista curada como respaldo y el build no se rompe.

El workflow `.github/workflows/deploy.yml` reconstruye y publica el sitio en cada push a
`main` **y además todos los días a las 06:00 UTC**, así que un repositorio nuevo aparece
en el sitio sin que tengas que hacer nada.

## Stack

- [Astro](https://astro.build) (sitio estático)
- CSS puro, sin dependencias extra de frontend

## Desarrollo

```bash
npm install
npm run dev
```

## Añadir o destacar un proyecto

1. Si solo quieres que aparezca: crea el repo público en GitHub con una descripción. Listo.
2. Si quieres viñetas y una descripción propia: agrega una entrada en el objeto `curated`
   de `src/data/projects.ts` usando el nombre exacto del repositorio como clave.

## Proyectos relacionados

- [`DiegoCortes07/DiegoCortes07`](https://github.com/DiegoCortes07/DiegoCortes07) — README
  del perfil de GitHub, también autogenerado.
