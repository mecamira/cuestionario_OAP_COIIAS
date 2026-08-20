import data from "../../../data/videos.json";
import type { CatalogoVideos, Video } from "../types/videos";

export const catalogoVideos = data as unknown as CatalogoVideos;

const porId = new Map<string, Video>(catalogoVideos.videos.map((v) => [v.id, v]));

export function videoPorId(id: string): Video | undefined {
  return porId.get(id);
}
