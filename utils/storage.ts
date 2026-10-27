import { OMRData, SavedSheet, INITIAL_OMR_DATA } from "../types/omr";

const STORAGE_KEY_CURRENT = "multigraphics_omr_current_draft_v2";
const STORAGE_KEY_SAVED_LIST = "multigraphics_omr_saved_sheets_v2";

export function loadCurrentDraft(): OMRData {
  if (typeof window === "undefined") return INITIAL_OMR_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT);
    if (!raw) return INITIAL_OMR_DATA;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_OMR_DATA,
      ...parsed,
      candidateName: parsed.candidateName || Array(21).fill(""),
      answers: parsed.answers || Array(100).fill(null),
      rollNo: parsed.rollNo || [null, null],
      subjectCode: parsed.subjectCode || [null, null, null],
      admissionNo: parsed.admissionNo || [null, null, null, null],
    };
  } catch (e) {
    console.error("Failed to load OMR draft:", e);
    return INITIAL_OMR_DATA;
  }
}

export function saveCurrentDraft(data: OMRData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save OMR draft:", e);
  }
}

export function getSavedSheets(): SavedSheet[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_LIST);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load saved sheets list:", e);
    return [];
  }
}

export function saveSheet(name: string, data: OMRData, id?: string): SavedSheet {
  const sheets = getSavedSheets();
  const existingIdx = id ? sheets.findIndex((s) => s.id === id) : -1;
  const newSheet: SavedSheet = {
    id: id || "sheet_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
    name: name.trim() || `OMR Sheet ${new Date().toLocaleDateString()}`,
    savedAt: new Date().toISOString(),
    data: JSON.parse(JSON.stringify(data)),
  };

  if (existingIdx >= 0) {
    sheets[existingIdx] = newSheet;
  } else {
    sheets.unshift(newSheet);
  }

  localStorage.setItem(STORAGE_KEY_SAVED_LIST, JSON.stringify(sheets));
  return newSheet;
}

export function renameSheet(id: string, newName: string): void {
  const sheets = getSavedSheets();
  const idx = sheets.findIndex((s) => s.id === id);
  if (idx >= 0) {
    sheets[idx].name = newName.trim();
    localStorage.setItem(STORAGE_KEY_SAVED_LIST, JSON.stringify(sheets));
  }
}

export function duplicateSheet(id: string): SavedSheet | null {
  const sheets = getSavedSheets();
  const target = sheets.find((s) => s.id === id);
  if (!target) return null;

  const copy: SavedSheet = {
    id: "sheet_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
    name: `${target.name} (Copy)`,
    savedAt: new Date().toISOString(),
    data: JSON.parse(JSON.stringify(target.data)),
  };

  sheets.unshift(copy);
  localStorage.setItem(STORAGE_KEY_SAVED_LIST, JSON.stringify(sheets));
  return copy;
}

export function deleteSheet(id: string): void {
  const sheets = getSavedSheets();
  const filtered = sheets.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY_SAVED_LIST, JSON.stringify(filtered));
}

export function exportSheetsAsJSON(): string {
  const sheets = getSavedSheets();
  return JSON.stringify(sheets, null, 2);
}

export function importSheetsFromJSON(jsonString: string): { success: boolean; count: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      return { success: false, count: 0, error: "JSON must be an array of saved sheets." };
    }
    const current = getSavedSheets();
    const existingIds = new Set(current.map((s) => s.id));
    let addedCount = 0;

    for (const item of parsed) {
      if (item && item.id && item.name && item.data) {
        if (existingIds.has(item.id)) {
          item.id = "sheet_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
        }
        current.unshift(item);
        existingIds.add(item.id);
        addedCount++;
      }
    }

    localStorage.setItem(STORAGE_KEY_SAVED_LIST, JSON.stringify(current));
    return { success: true, count: addedCount };
  } catch (e: any) {
    return { success: false, count: 0, error: e.message || "Invalid JSON syntax" };
  }
}
