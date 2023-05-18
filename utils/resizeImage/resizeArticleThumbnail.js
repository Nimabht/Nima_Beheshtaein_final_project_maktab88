import sharp from "sharp";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async (file) => {
  if (!file) return null;

  const fileExtension = extname(file.originalname);
  const originalFileNameWithoutExtension = file.originalname.replace(
    fileExtension,
    ""
  );

  const articleThumbnailName = `${Date.now()}-${originalFileNameWithoutExtension}.jpeg`;

  await sharp(file.buffer)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(join(__dirname, `../../public/thumbnails/${articleThumbnailName}`));

  return articleThumbnailName;
};
