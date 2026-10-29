/**
 * ASTRAYA - Utilitários de Imagens Resilientes para Mobile & Web
 * Garante carregamento de fotos no celular, em conexões 4G/5G móveis,
 * Google Drive, Dropbox, CDNs e arquivos locais estáticos embutidos no build.
 */

export const FALLBACK_DEFICIENCY_IMAGE = '/images/deficiencies/nitrogen.jpg';
export const FALLBACK_PEST_IMAGE = '/images/pests/spidermite.jpg';
export const FALLBACK_MADRE_IMAGE = '/images/cultivo/mother_plant.jpg';
export const FALLBACK_OUTDOOR_IMAGE = '/images/cultivo/outdoor_crop.jpg';
export const FALLBACK_GENERIC_PLANT = 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80';

/**
 * Extrai o ID de arquivo do Google Drive a partir de qualquer formato de link
 */
export function extractGoogleDriveFileId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // drive.google.com/file/d/ID/...
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) return fileDMatch[1];

  // drive.google.com/open?id=ID ou /uc?id=ID
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) return idParamMatch[1];

  // lh3.googleusercontent.com/d/ID
  const lh3Match = trimmed.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match && lh3Match[1]) return lh3Match[1];

  return null;
}

/**
 * Verifica se o link é uma pasta do Google Drive
 */
export function isGoogleDriveFolder(url: string): boolean {
  if (!url) return false;
  return url.includes('drive.google.com/drive/folders/') || url.includes('/folders/');
}

/**
 * Formata qualquer URL para o formato mais direto e compatível com visualização móvel
 */
export function formatImageUrl(url: string, defaultFallback = FALLBACK_GENERIC_PLANT): string {
  if (!url || typeof url !== 'string') return defaultFallback;
  let trimmed = url.trim();
  if (!trimmed) return defaultFallback;

  // Se for caminho local estático (/images/...) ou data:image (base64)
  if (trimmed.startsWith('/') || trimmed.startsWith('data:image/') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // Se for Google Drive File
  const driveId = extractGoogleDriveFileId(trimmed);
  if (driveId) {
    // lh3.googleusercontent.com/d/{id} é o CDN direto de alta performance do Google
    return `https://lh3.googleusercontent.com/d/${driveId}`;
  }

  // Se for Dropbox
  if (trimmed.includes('dropbox.com')) {
    return trimmed.replace('dl=0', 'raw=1');
  }

  // Previne bloqueio de conteúdo misto em HTTPS (Cloud Run / Mobile)
  if (trimmed.startsWith('http://')) {
    return trimmed.replace('http://', 'https://');
  }

  return trimmed;
}

/**
 * Gera URL de contingência caso o primeiro link falhe (ex: espelho secundário do Drive)
 */
export function getSecondaryFallbackUrl(url: string, defaultFallback: string): string {
  const driveId = extractGoogleDriveFileId(url);
  if (driveId) {
    // Espelho de thumbnail do Google Drive (muito estável para visualização móvel)
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`;
  }
  return defaultFallback;
}
