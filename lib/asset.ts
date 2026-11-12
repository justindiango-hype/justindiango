/**
 * Prefixes a file in /public with the site's base path, so images and videos
 * also load when the site lives in a sub-folder (GitHub Pages: /justindiango).
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (path: string) => (path.startsWith("/") ? `${BASE_PATH}${path}` : path);
