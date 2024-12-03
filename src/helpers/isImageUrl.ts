export async function isImageUrl(url?: string): Promise<boolean> {
  if (!url) return false;
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('Content-Type');
    return contentType?.startsWith('image/') ?? false;
  } catch {
    return false; // If fetch fails, treat as not an image
  }
}
