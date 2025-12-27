import { Bucket } from "encore.dev/storage/objects";

export const postImages = new Bucket("post-images", {
  public: true,
});
