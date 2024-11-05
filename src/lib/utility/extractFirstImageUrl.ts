export function extractFirstImageUrl(html: string): string | null {
    const imgTagRegex = /<img[^>]+src="([^">]+)"/;
    const match = html.match(imgTagRegex);
    return match ? match[1] : null;
}