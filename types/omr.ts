export interface OMRData {
  // Top fields
  classSec: string;
  examName: string;
  date: string;
  subject: string;

  // Name (21 letters)
  candidateName: string[];

  // Class selection (6th to 12th)
  selectedClass: string | null;

  // Section selection (A to J)
  selectedSection: string | null;

  // Roll No (2 digits)
  rollNo: (string | null)[];

  // Stream (PCM, PCB, COM, HUM)
  selectedStream: string | null;

  // Set Number (1, 2, 3)
  selectedSet: string | null;

  // Subject Code (3 digits)
  subjectCode: (string | null)[];

  // Admission No (4 digits)
  admissionNo: (string | null)[];

  // Answers 1 to 100: values 'A' | 'B' | 'C' | 'D' | null
  answers: (string | null)[];

  // Marks obtained & signatures
  marksObtained: string;
  candidateSignature: string;
  invigilatorSignature: string;

  // Barcode value
  barcode: string;
}

export interface SavedSheet {
  id: string;
  name: string;
  savedAt: string;
  data: OMRData;
}

// DEFAULT STATE IS COMPLETELY EMPTY - No prefilled demo values
export const INITIAL_OMR_DATA: OMRData = {
  classSec: "",
  examName: "",
  date: "",
  subject: "",
  candidateName: Array(21).fill(""),
  selectedClass: null,
  selectedSection: null,
  rollNo: [null, null],
  selectedStream: null,
  selectedSet: null,
  subjectCode: [null, null, null],
  admissionNo: [null, null, null, null],
  answers: Array(100).fill(null),
  marksObtained: "",
  candidateSignature: "",
  invigilatorSignature: "",
  barcode: "123456789",
};
