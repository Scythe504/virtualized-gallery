// In-memory cache for already decoded image blob URLs
export const decodedImageCache = new Map<string, string>();

// In-memory cache for high-res preview images (used in the Modal)
export const previewImageCache = new Map<string, string>();
