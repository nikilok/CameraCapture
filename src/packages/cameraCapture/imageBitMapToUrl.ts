/**
 * A utility function that converts a ImageBitmap to a blob encoded string
 * @param imageBitMap An Image bitmap
 * @returns Promise<string>
 */
export const convertImageBitMapToString = async (
  imageBitMap: ImageBitmap
): Promise<string> => {
  const canvas = document.createElement("canvas");
  // Set the width and height of the canvas
  canvas.width = imageBitMap.width;
  canvas.height = imageBitMap.height;

  // Transfer control to offscreen
  const offscreen = canvas.transferControlToOffscreen();
  const ctx = offscreen.getContext("2d");
  if (ctx) {
    ctx.drawImage(imageBitMap, 0, 0);
  }
  // Convert the canvas to a blob
  const blob = await offscreen.convertToBlob();

  return URL.createObjectURL(blob) as string;
};
