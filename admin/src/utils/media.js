import { API_BASE_URL } from "../app/config";

export function toAbsoluteUrl(url) {
    if (!url) return null;
    return url.startsWith("/") ? `${API_BASE_URL}${url}` : url;
}

export function pickFirstMediaUrl(entity) {
    const media =
        entity?.Logo ||
        entity?.Photos ||
        entity?.attributes?.Logo?.data ||
        entity?.attributes?.Photos?.data;

    if (!media) return null;

    const url = Array.isArray(media)
        ? media[0]?.url || media[0]?.attributes?.url
        : media?.url || media?.attributes?.url;

    return toAbsoluteUrl(url);
}
