import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

/** Inline style that paints a tiny blurred copy of the photo behind it, so the box is never blank while it loads. */
export async function placeholder(src: ImageMetadata) {
  const tiny = await getImage({ src, width: 24, format: 'webp', quality: 40 });
  return `background-image:url(${tiny.src});background-size:cover;background-position:center`;
}
