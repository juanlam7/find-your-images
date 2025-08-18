import { UnsplashPhoto } from "@core/types";

export interface PhotoResult {
  photo: UnsplashPhoto | null;
  error: boolean;
  loading: boolean;
}
