import jsPDF from "jspdf";
import { OMRData } from "../types/omr";

export function generateDefaultFileName(data: OMRData, extension: string): string {
  const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_").trim();
  const exam = sanitize(data.examName || "");
  const subject = sanitize(data.subject || "");
  const set = sanitize(data.selectedSet ? `Set${data.selectedSet}` : "");
  const dateStr = data.date ? sanitize(data.date) : new Date().toISOString().split("T")[0];

  const parts = ["OMR", exam, subject, set, dateStr].filter(Boolean);
  if (parts.length <= 1) {
    return `OMR_Sheet_${dateStr}.${extension}`;
  }
  return `${parts.join("_")}.${extension}`;
}

/**
 * Converts an SVG element to a 3x high-resolution HTMLCanvasElement (2760 x 3900 px)
 * Uses clean off-screen clone with exact dimensions and no transforms.
 */
export async function svgToCanvas(svgElement: SVGSVGElement, scale: number = 3): Promise<HTMLCanvasElement> {
  await (document as any).fonts?.ready;

  const width = 920;
  const height = 1300;
  const targetWidth = width * scale;
  const targetHeight = height * scale;

  // Clean off-screen clone with exact dimensions and no transforms
  const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
  svgClone.setAttribute("width", width.toString());
  svgClone.setAttribute("height", height.toString());
  svgClone.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svgClone.style.transform = "none";
  svgClone.style.boxShadow = "none";

  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(svgClone);

  // Ensure xmlns is present
  if (!svgString.includes("xmlns=\"http://www.w3.org/2000/svg\"")) {
    svgString = svgString.replace("<svg ", "<svg xmlns=\"http://www.w3.org/2000/svg\" ");
  }

  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const URLObj = window.URL || window.webkitURL || window;
  const blobUrl = URLObj.createObjectURL(svgBlob);

  const img = new Image();
  img.crossOrigin = "anonymous";

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => {
      URLObj.revokeObjectURL(blobUrl);
      reject(new Error("Failed to render SVG to image"));
    };
    img.src = blobUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    URLObj.revokeObjectURL(blobUrl);
    throw new Error("Canvas context is not available");
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  URLObj.revokeObjectURL(blobUrl);

  return canvas;
}

export async function exportToPdf(
  svgElement: SVGSVGElement,
  summaryElement: HTMLElement | null,
  fileName: string,
  includeSummary: boolean = false
): Promise<void> {
  await (document as any).fonts?.ready;

  // A4 dimensions: 210mm x 297mm
  const a4Width = 210;
  const a4Height = 297;
  const contentAspect = 920 / 1300; // ~0.70769

  let renderWidth = a4Width;
  let renderHeight = a4Width / contentAspect; // ~296.74mm
  let offsetX = 0;
  let offsetY = (a4Height - renderHeight) / 2; // ~0.13mm centering

  if (renderHeight > a4Height) {
    renderHeight = a4Height;
    renderWidth = a4Height * contentAspect;
    offsetX = (a4Width - renderWidth) / 2;
    offsetY = 0;
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  // Render Page 1 using the EXACT same 3x canvas pipeline as PNG
  const canvas = await svgToCanvas(svgElement, 3);
  const imgData = canvas.toDataURL("image/png");

  pdf.addImage(
    imgData,
    "PNG",
    offsetX,
    offsetY,
    renderWidth,
    renderHeight,
    undefined,
    "FAST"
  );

  // Optional Page 2: Answer Key Summary Page
  if (includeSummary && summaryElement) {
    const summarySvg = summaryElement.querySelector("svg");
    if (summarySvg) {
      pdf.addPage("a4", "portrait");
      const summaryCanvas = await svgToCanvas(summarySvg as SVGSVGElement, 3);
      const summaryImgData = summaryCanvas.toDataURL("image/png");
      pdf.addImage(
        summaryImgData,
        "PNG",
        offsetX,
        offsetY,
        renderWidth,
        renderHeight,
        undefined,
        "FAST"
      );
    }
  }

  pdf.save(fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`);
}
