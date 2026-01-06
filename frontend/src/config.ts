function normalizeApiUrl(url: string | undefined): string {
  if (!url) {
    return "http://localhost:8000";
  }

  // Auto-fix missing protocol
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    console.warn(`[Config] VITE_API_URL missing protocol, adding https://`);
    return `https://${url}`;
  }

  return url;
}

export const config = {
  apiUrl: normalizeApiUrl(import.meta.env.VITE_API_URL),
};
