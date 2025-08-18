import { UnsplashPhoto } from "./images.interface";

export interface LastQuery {
  lastQuery: string;
}

export interface FavoriteStorage {
  data: UnsplashPhoto[]
}