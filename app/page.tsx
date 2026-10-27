"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { OMRData, SavedSheet, INITIAL_OMR_DATA } from "../types/omr";
import {
  loadCurrentDraft,
  saveCurrentDraft,
  getSavedSheets,
  saveSheet,
} from "../utils/storage";
import { exportToPdf, generateDefaultFileName } from "../utils/exportPdf";
import { exportToImage } from "../utils/exportImage";
import { OMRSheet } from "../components/OMRSheet";
import { Toolbar, ZoomMode } from "../components/Toolbar";
import { DownloadModal } from "../components/DownloadModal";
import { SavedSheetsModal } from "../components/SavedSheetsModal";
import { QuickEntryModal } from "../components/QuickEntryModal";
import { PaperDetailsModal } from "../components/PaperDetailsModal";
import { AnswerKeySummary } from "../components/AnswerKeySummary";
import { Check, Loader2 } from "lucide-react";

const STORAGE_KEY_ZOOM = "multigraphics_omr_zoom_pref";

export default function Home() {
  const [data, setData] = useState<OMRData>(INITIAL_OMR_DATA);
  const [savedSheets, setSavedSheets] = useState<SavedSheet[]>([]);
  
  // Responsive Zoom State
  const [zoomMode, setZoomMode] = useState<ZoomMode>("fit-width");
  const [customScale, setCustomScale] = useState<number>(1.0);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 1200,
    height: 800,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [savedModalOpen, setSavedModalOpen] = useState(false);
  const [quickEntryOpen, setQuickEntryOpen] = useState(false);
  const [paperDetailsOpen, setPaperDetailsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLElement>(null);
  const sheetWrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Initialize draft and saved sheets
  useEffect(() => {
    const draft = loadCurrentDraft();
    setData(draft);
    setSavedSheets(getSavedSheets());

    // Restore saved zoom preference if available
    try {
      const savedZoom = localStorage.getItem(STORAGE_KEY_ZOOM);
      if (savedZoom) {
        const parsed = JSON.parse(savedZoom);
        if (parsed.mode) setZoomMode(parsed.mode);
        if (parsed.scale) setCustomScale(parsed.scale);
      }
    } catch (e) {
      // default to fit-width
    }
  }, []);

  // Save zoom preference
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_ZOOM,
        JSON.stringify({ mode: zoomMode, scale: customScale })
      );
    } catch (e) {}
  }, [zoomMode, customScale]);

  // Continuous auto-save of sheet draft
  useEffect(() => {
    saveCurrentDraft(data);
  }, [data]);

  // Measure container using ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setContainerSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Calculate effective scale
  // fit-width: min(1.0, (containerWidth - 24) / 920)
  // fit-page: min((containerWidth - 24) / 920, (containerHeight - 32) / 1300)
  const calculateEffectiveScale = useCallback((): number => {
    const availableW = Math.max(280, containerSize.width - 24);
    const availableH = Math.max(400, containerSize.height - 32);

    if (zoomMode === "fit-width") {
      return Math.min(1.0, Number((availableW / 920).toFixed(3)));
    } else if (zoomMode === "fit-page") {
      return Math.min(
        1.0,
        Number((availableW / 920).toFixed(3)),
        Number((availableH / 1300).toFixed(3))
      );
    } else {
      return customScale;
    }
  }, [zoomMode, customScale, containerSize]);

  const effectiveScale = calculateEffectiveScale();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Direct 1-Click PDF Download
  const handleDirectDownloadPdf = async (customData?: OMRData, customName?: string) => {
    if (!svgRef.current) return;
    setIsProcessing(true);
    showToast("Generating crisp A4 PDF...");

    try {
      const activeData = customData || data;
      const fileName = customName
        ? `${customName}.pdf`
        : generateDefaultFileName(activeData, "pdf");

      await exportToPdf(svgRef.current, summaryRef.current, fileName, false);
      showToast("PDF saved to your device!");
    } catch (err: any) {
      console.error("PDF export error:", err);
      alert("Failed to export PDF: " + (err.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };

  // Direct 1-Click PNG Download
  const handleDirectDownloadPng = async (customData?: OMRData, customName?: string) => {
    if (!svgRef.current) return;
    setIsProcessing(true);
    showToast("Generating 3x high-resolution PNG image...");

    try {
      const activeData = customData || data;
      const fileName = customName
        ? `${customName}.png`
        : generateDefaultFileName(activeData, "png");

      await exportToImage(svgRef.current, fileName, "png");
      showToast("PNG image saved to your device!");
    } catch (err: any) {
      console.error("PNG export error:", err);
      alert("Failed to export PNG: " + (err.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDirectDownloadJpg = async () => {
    if (!svgRef.current) return;
    setIsProcessing(true);
    showToast("Generating JPG image...");

    try {
      const fileName = generateDefaultFileName(data, "jpg");
      await exportToImage(svgRef.current, fileName, "jpeg");
      showToast("JPG image saved to your device!");
    } catch (err: any) {
      console.error("JPG export error:", err);
      alert("Failed to export JPG: " + (err.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleModalDownloadPdf = async (fileName: string, includeSummary: boolean) => {
    if (!svgRef.current) return;
    setIsProcessing(true);
    showToast("Generating PDF document...");

    try {
      await exportToPdf(svgRef.current, summaryRef.current, fileName, includeSummary);
      setDownloadModalOpen(false);
      showToast("PDF successfully downloaded to your device!");
    } catch (err: any) {
      console.error("PDF export error:", err);
      alert("Failed to export PDF: " + (err.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleModalDownloadImage = async (fileName: string, format: "png" | "jpeg") => {
    if (!svgRef.current) return;
    setIsProcessing(true);
    showToast(`Generating 3x ${format.toUpperCase()} image...`);

    try {
      await exportToImage(svgRef.current, fileName, format);
      setDownloadModalOpen(false);
      showToast(`${format.toUpperCase()} successfully downloaded!`);
    } catch (err: any) {
      console.error("Image export error:", err);
      alert("Failed to export image: " + (err.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveCurrentSheet = () => {
    const defaultName = data.examName
      ? `${data.examName} - ${new Date().toLocaleDateString()}`
      : `OMR Sheet - ${new Date().toLocaleDateString()}`;
    const name = prompt("Enter a name for this saved sheet:", defaultName);
    if (name) {
      saveSheet(name, data);
      setSavedSheets(getSavedSheets());
      showToast(`Saved "${name}" successfully!`);
    }
  };

  const handleLoadSheet = (loadedData: OMRData, name: string) => {
    setData(loadedData);
    showToast(`Loaded sheet: "${name}"`);
  };

  const handleRefreshSheetsList = () => {
    setSavedSheets(getSavedSheets());
  };

  // Double-tap on mobile to toggle zoom between fit-width and 1.25x
  const lastTapRef = useRef<number>(0);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double tap detected
      e.preventDefault();
      if (zoomMode === "fit-width") {
        setZoomMode("custom");
        setCustomScale(1.25);
        showToast("Zoomed in to 125%");
      } else {
        setZoomMode("fit-width");
        showToast("Reset to Fit Width");
      }
    }
    lastTapRef.current = now;
  };

  const scaledWidth = Math.round(920 * effectiveScale);
  const scaledHeight = Math.round(1300 * effectiveScale);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#e9ecef] overscroll-none">
      {/* Top Responsive Toolbar (Desktop / Tablet / Mobile header) */}
      <Toolbar
        data={data}
        onChange={setData}
        onOpenDownloadModal={() => setDownloadModalOpen(true)}
        onQuickDownloadPdf={() => handleDirectDownloadPdf()}
        onQuickDownloadPng={() => handleDirectDownloadPng()}
        onQuickDownloadJpg={handleDirectDownloadJpg}
        onPrint={handlePrint}
        onSaveCurrent={handleSaveCurrentSheet}
        onOpenSavedModal={() => setSavedModalOpen(true)}
        onOpenQuickEntry={() => setQuickEntryOpen(true)}
        onOpenPaperDetails={() => setPaperDetailsOpen(true)}
        savedCount={savedSheets.length}
        zoomMode={zoomMode}
        setZoomMode={setZoomMode}
        customScale={customScale}
        setCustomScale={setCustomScale}
        effectiveScale={effectiveScale}
        showToast={showToast}
      />

      {/* Main OMR Sheet Viewport */}
      {/* Container measures available size via ResizeObserver */}
      <main
        ref={containerRef}
        onTouchEnd={handleTouchEnd}
        className="flex-1 overflow-x-auto overflow-y-auto flex items-start justify-center p-3 sm:p-6 pb-24 sm:pb-8 omr-canvas-area"
      >
        {/* Scaled Wrapper sized to exact (920*scale by 1300*scale) */}
        {/* Center aligned on screens > 920px */}
        <div
          ref={sheetWrapperRef}
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
            position: "relative",
            flexShrink: 0,
            margin: "0 auto",
          }}
        >
          {/* Inner fixed 920x1300 sheet with scale transform */}
          <div
            style={{
              width: "920px",
              height: "1300px",
              transform: `scale(${effectiveScale})`,
              transformOrigin: "top left",
              boxShadow: "0 20px 45px -10px rgba(0, 0, 0, 0.25)",
              backgroundColor: "#ffffff",
              position: "relative",
            }}
          >
            <OMRSheet
              data={data}
              onChange={setData}
              svgRef={svgRef}
              isInteractive={true}
            />
          </div>
        </div>
      </main>

      {/* Hidden Offscreen 2nd Page Summary Container for PDF generation */}
      <div
        className="fixed -left-[9999px] -top-[9999px] pointer-events-none"
        aria-hidden="true"
      >
        <AnswerKeySummary data={data} summaryRef={summaryRef} />
      </div>

      {/* Mobile & Desktop Quick Entry Modal (Stepper & Grid for Q1-100) */}
      <QuickEntryModal
        isOpen={quickEntryOpen}
        onClose={() => setQuickEntryOpen(false)}
        data={data}
        onChange={setData}
        showToast={showToast}
      />

      {/* Paper & Candidate Details Editor Modal */}
      <PaperDetailsModal
        isOpen={paperDetailsOpen}
        onClose={() => setPaperDetailsOpen(false)}
        data={data}
        onChange={setData}
        showToast={showToast}
      />

      {/* Download Options Modal (Responsive Bottom Sheet / Modal) */}
      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        data={data}
        onDownloadPdf={handleModalDownloadPdf}
        onDownloadImage={handleModalDownloadImage}
        onPrint={handlePrint}
        isProcessing={isProcessing}
      />

      {/* Saved Sheets Manager Modal (Responsive Bottom Sheet / Modal) */}
      <SavedSheetsModal
        isOpen={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
        sheets={savedSheets}
        currentData={data}
        onLoadSheet={handleLoadSheet}
        onRefreshList={handleRefreshSheetsList}
        onDirectDownloadPdf={(d, n) => handleDirectDownloadPdf(d, n)}
        onDirectDownloadPng={(d, n) => handleDirectDownloadPng(d, n)}
        showToast={showToast}
      />

      {/* Toast Notification (Centered on mobile, bottom-right on desktop) */}
      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 z-50 bg-slate-900/95 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200 whitespace-nowrap">
          {isProcessing ? (
            <Loader2 className="w-4 h-4 text-[#E6007E] animate-spin" />
          ) : (
            <Check className="w-4 h-4 text-emerald-400" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
