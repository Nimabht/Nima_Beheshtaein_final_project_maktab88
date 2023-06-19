import fs from "node:fs/promises";
import { join } from "node:path";

export default async () => {
  const thumbnailsDirectory = join("public", "thumbnails");
  const articleImagesDirectory = join("public", "articleImages");

  try {
    // Check if the thumbnails directory exists
    const thumbnailsExists = await fs.stat(thumbnailsDirectory);
    if (!thumbnailsExists.isDirectory()) {
      await fs.mkdir(thumbnailsDirectory);
      console.log("[✅] Thumbnails directory created successfully!");
    }

    // Check if the articleImages directory exists
    const articleImagesExists = await fs.stat(articleImagesDirectory);
    if (!articleImagesExists.isDirectory()) {
      await fs.mkdir(articleImagesDirectory);
      console.log("[✅] Article Images directory created successfully!");
    }
  } catch (error) {
    console.error("Error setting up directories:", error);
  }
};
