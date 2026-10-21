import fs from 'fs';
import path from 'path';

// Content lives in public/work/<collection>/<season>/<project>/<images>
// Each level may have an optional meta.json (title, description, order, ...)
const WORK_DIR = path.join(process.cwd(), 'public/work');
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)$/i;

function formatName(str) {
  return str.split('-').map(word => {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

function readMeta(dir) {
  const file = path.join(dir, 'meta.json');
  if (!fs.existsSync(file)) return {};
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error(`Invalid JSON in ${file}`);
    return {};
  }
}

function listDirs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
    .map(entry => entry.name);
}

// Lower `order` first; items without `order` go last, alphabetically
function byOrderThenTitle(a, b) {
  const orderA = a.order ?? Infinity;
  const orderB = b.order ?? Infinity;
  if (orderA !== orderB) return orderA - orderB;
  return a.title.localeCompare(b.title);
}

function readProject(dir, slug, urlBase) {
  const meta = readMeta(dir);
  const images = fs.readdirSync(dir)
    .filter(file => IMAGE_EXT.test(file) && !file.startsWith('.'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map(file => encodeURI(`${urlBase}/${slug}/${file}`));
  if (images.length === 0) return null;

  const cover = meta.cover ? encodeURI(`${urlBase}/${slug}/${meta.cover}`) : images[0];
  return { ...meta, slug, title: meta.title ?? formatName(slug), cover, images };
}

function readSeason(dir, slug, urlBase) {
  const meta = readMeta(dir);
  const projects = listDirs(dir)
    .map(name => readProject(path.join(dir, name), name, `${urlBase}/${slug}`))
    .filter(Boolean)
    .sort(byOrderThenTitle);
  if (projects.length === 0) return null;

  return { ...meta, slug, title: meta.title ?? slug, projects };
}

function readCollection(dir, slug) {
  const meta = readMeta(dir);
  const seasons = listDirs(dir)
    .map(name => readSeason(path.join(dir, name), name, `/work/${slug}`))
    .filter(Boolean)
    // Seasons are years: newest first
    .sort((a, b) => b.slug.localeCompare(a.slug, undefined, { numeric: true }));
  if (seasons.length === 0) return null;

  return { ...meta, slug, title: meta.title ?? formatName(slug), seasons };
}

export function getCollections() {
  return listDirs(WORK_DIR)
    .map(name => readCollection(path.join(WORK_DIR, name), name))
    .filter(Boolean)
    .sort(byOrderThenTitle);
}

export function getCollectionSeason(collectionSlug, seasonSlug) {
  const collection = getCollections().find(c => c.slug === collectionSlug);
  const season = collection?.seasons.find(s => s.slug === seasonSlug);
  if (!season) return null;
  return { collection, season };
}

// One entry per collection + season, used for listing pages and static params
export function getCollectionSeasons() {
  return getCollections().flatMap(collection =>
    collection.seasons.map(season => ({
      collection,
      season,
      href: `/projects/${collection.slug}/${season.slug}`,
    }))
  );
}

// Flat list of every project, in display order (used by the home slider)
export function getAllProjects() {
  return getCollectionSeasons().flatMap(({ collection, season, href }) =>
    season.projects.map(project => ({
      slug: project.slug,
      brand: project.title,
      collection: `${collection.title} ${season.title}`,
      image: project.cover,
      href,
    }))
  ).map((project, index) => ({ id: index + 1, ...project }));
}
