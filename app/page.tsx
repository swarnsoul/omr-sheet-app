"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { Toolbar } from "../components/Toolbar";
import { DownloadModal } from "../components/DownloadModal";
import { SavedSheetsModal } from "../components/SavedSheetsModal";
import { AnswerKeySummary } from "../components/AnswerKeySummary";
import { Check, Loader2 } from "lucide-react";

export default function Home() {
  const [data, setData] = useState<OMRData>(INITIAL_OMR_DATA);
  const [savedSheets, setSavedSheets] = useState<SavedSheet[]>([]);
  const [zoom, setZoom] = useState<number>(1.0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [savedModalOpen, setSavedModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const draft = loadCurrentDraft();
    setData(draft);
    setSavedSheets(getSavedSheets());
  }, []);

  // Continuous auto-save
  useEffect(() => {
    saveCurrentDraft(data);
  }, [data]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleDirectDownloadPdf = async (customData?: OMRData, customName?: string) => {
    if (!svgRef.current) return;
    setIsProcessing(true);
    showToast("Generating crisp SVG vector-exact PDF...");

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

  return (
    <div className="min-h-screen flex flex-col bg-[#e9ecef]">
      {/* Top Application Toolbar */}
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
        savedCount={savedSheets.length}
        zoom={zoom}
        setZoom={setZoom}
        showToast={showToast}
      />

      {/* Main OMR Sheet Viewport */}
      <main className="flex-1 overflow-auto flex items-start justify-center p-4 md:p-8">
        <div
          style={{
            width: `${920 * zoom}px`,
            height: `${1300 * zoom}px`,
            position: "relative",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "920px",
              height: "1300px",
              transform: `scale(${zoom})`,
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

      {/* Download Options Modal */}
      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        data={data}
        onDownloadPdf={handleModalDownloadPdf}
        onDownloadImage={handleModalDownloadImage}
        onPrint={handlePrint}
        isProcessing={isProcessing}
      />

      {/* Saved Sheets Manager Modal */}
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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
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
