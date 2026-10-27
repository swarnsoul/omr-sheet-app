import { svgToCanvas } from "./exportPdf";

export async function exportToImage(
  svgElement: SVGSVGElement,
  fileName: string,
  format: "png" | "jpeg" = "png"
): Promise<void> {
  // 3x scale: 920 * 3 = 2760, 1300 * 3 = 3900 px
  const canvas = await svgToCanvas(svgElement, 3);

  const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
  const quality = format === "jpeg" ? 0.95 : 1.0;
  const dataUrl = canvas.toDataURL(mimeType, quality);

  const downloadLink = document.createElement("a");
  const ext = format === "jpeg" ? "jpg" : "png";
  downloadLink.download = fileName.endsWith(`.${ext}`) ? fileName : `${fileName}.${ext}`;
  downloadLink.href = dataUrl;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
