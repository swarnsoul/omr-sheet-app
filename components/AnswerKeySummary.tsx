import React from "react";
import { OMRData } from "../types/omr";

interface AnswerKeySummaryProps {
  data: OMRData;
  summaryRef: React.RefObject<HTMLDivElement>;
}

export const AnswerKeySummary: React.FC<AnswerKeySummaryProps> = ({ data, summaryRef }) => {
  const answeredCount = data.answers.filter((a) => a !== null).length;
  const countOption = (opt: string) => data.answers.filter((a) => a === opt).length;

  const cols = [
    { start: 0, end: 25 },
    { start: 25, end: 50 },
    { start: 50, end: 75 },
    { start: 75, end: 100 },
  ];

  return (
    <div
      ref={summaryRef}
      style={{
        width: "920px",
        height: "1300px",
        backgroundColor: "#ffffff",
      }}
    >
      <svg
        viewBox="0 0 920 1300"
        width="920"
        height="1300"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: "block",
          width: "920px",
          height: "1300px",
          backgroundColor: "#ffffff",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <rect x="0" y="0" width="920" height="1300" fill="#ffffff" />

        {/* Top Header */}
        <text x="68" y="70" fontSize="32" fontWeight="900" fill="#E6007E">
          MULTIGRAPHICS GROUP
        </text>
        <text x="68" y="92" fontSize="11" fill="#4b5563">
          A-86, DDA SHEDS, OKHLA INDUSTRIAL AREA PHASE – 2, New Delhi 110020
        </text>

        {/* Badge */}
        <rect x="580" y="48" width="276" height="38" rx="6" fill="#FBDCEB" stroke="#E6007E" strokeWidth="1" />
        <text x="718" y="72" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#000000">
          ANSWER KEY &amp; RESPONSE SUMMARY
        </text>

        <line x1="68" y1="110" x2="856" y2="110" stroke="#E6007E" strokeWidth="2" />

        {/* Paper details box */}
        <rect x="68" y="125" width="788" height="90" rx="4" fill="#fff5f9" stroke="#fbcfe8" strokeWidth="1" />

        {/* Row 1 */}
        <text x="88" y="150" fontSize="11" fill="#6b7280">Exam Name:</text>
        <text x="165" y="150" fontSize="12" fontWeight="bold" fill="#000000">{data.examName || "—"}</text>

        <text x="460" y="150" fontSize="11" fill="#6b7280">Subject:</text>
        <text x="520" y="150" fontSize="12" fontWeight="bold" fill="#000000">{data.subject || "—"}</text>

        {/* Row 2 */}
        <text x="88" y="175" fontSize="11" fill="#6b7280">Class &amp; Sec:</text>
        <text x="165" y="175" fontSize="12" fontWeight="bold" fill="#000000">{data.classSec || data.selectedClass || "—"}</text>

        <text x="460" y="175" fontSize="11" fill="#6b7280">Set Number:</text>
        <text x="545" y="175" fontSize="12" fontWeight="bold" fill="#E6007E">{data.selectedSet ? `Set ${data.selectedSet}` : "—"}</text>

        {/* Row 3 */}
        <text x="88" y="200" fontSize="11" fill="#6b7280">Candidate Name:</text>
        <text x="195" y="200" fontSize="12" fontWeight="bold" fill="#000000">{data.candidateName.filter(Boolean).join("") || "—"}</text>

        <text x="460" y="200" fontSize="11" fill="#6b7280">Roll / Adm No:</text>
        <text x="560" y="200" fontSize="12" fontWeight="bold" fill="#000000">
          {data.rollNo.filter(Boolean).join("") || "—"} / {data.admissionNo.filter(Boolean).join("") || "—"}
        </text>

        <text x="730" y="200" fontSize="11" fill="#6b7280">Answered:</text>
        <text x="795" y="200" fontSize="12" fontWeight="bold" fill="#000000">
          {answeredCount} / 100
        </text>

        {/* 4-Column Table */}
        {cols.map((col, cIdx) => {
          const colX = 68 + cIdx * 200;
          return (
            <g key={`summary-col-${cIdx}`}>
              {/* Column Frame */}
              <rect x={colX} y="235" width="188" height="910" fill="#ffffff" stroke="#fbcfe8" strokeWidth="1" />
              {/* Header */}
              <rect x={colX} y="235" width="188" height="28" fill="#FBDCEB" stroke="#fbcfe8" strokeWidth="1" />
              <text x={colX + 45} y="253" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#000000">
                Q. No.
              </text>
              <line x1={colX + 94} y1="235" x2={colX + 94} y2="1145" stroke="#fbcfe8" strokeWidth="1" />
              <text x={colX + 140} y="253" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#000000">
                Key / Response
              </text>

              {/* Rows */}
              {Array.from({ length: 25 }).map((_, rIdx) => {
                const qNum = col.start + rIdx + 1;
                const ans = data.answers[qNum - 1];
                const rowY = 263 + rIdx * 35.2;

                return (
                  <g key={`q-sum-${qNum}`}>
                    {rIdx % 2 === 1 && (
                      <rect x={colX + 1} y={rowY} width="186" height="35" fill="#fdf2f8" opacity="0.4" />
                    )}
                    <line x1={colX} y1={rowY + 35} x2={colX + 188} y2={rowY + 35} stroke="#fce7f3" strokeWidth="1" />
                    <text x={colX + 45} y={rowY + 22} textAnchor="middle" fontSize="12" fontWeight="600" fill="#374151">
                      {qNum}
                    </text>
                    {ans ? (
                      <g>
                        <circle cx={colX + 140} cy={rowY + 18} r="11" fill="#E6007E" />
                        <text
                          x={colX + 140}
                          y={rowY + 18}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="11"
                          fontWeight="bold"
                          fill="#ffffff"
                        >
                          {ans}
                        </text>
                      </g>
                    ) : (
                      <text x={colX + 140} y={rowY + 22} textAnchor="middle" fontSize="12" fill="#d1d5db">
                        —
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Footer Statistics */}
        <line x1="68" y1="1165" x2="856" y2="1165" stroke="#e5e7eb" strokeWidth="1" />

        <text x="68" y="1195" fontSize="11" fontWeight="bold" fill="#374151">
          Answer Distribution:
        </text>
        <text x="200" y="1195" fontSize="11" fill="#4b5563">
          A: <tspan fontWeight="bold" fill="#000">{countOption("A")}</tspan>
        </text>
        <text x="260" y="1195" fontSize="11" fill="#4b5563">
          B: <tspan fontWeight="bold" fill="#000">{countOption("B")}</tspan>
        </text>
        <text x="320" y="1195" fontSize="11" fill="#4b5563">
          C: <tspan fontWeight="bold" fill="#000">{countOption("C")}</tspan>
        </text>
        <text x="380" y="1195" fontSize="11" fill="#4b5563">
          D: <tspan fontWeight="bold" fill="#000">{countOption("D")}</tspan>
        </text>
        <text x="440" y="1195" fontSize="11" fill="#6b7280">|</text>
        <text x="460" y="1195" fontSize="11" fill="#b45309">
          Unanswered: <tspan fontWeight="bold">{100 - answeredCount}</tspan>
        </text>

        {/* Signatures */}
        <line x1="560" y1="1230" x2="690" y2="1230" stroke="#9ca3af" strokeWidth="1" />
        <text x="625" y="1248" textAnchor="middle" fontSize="11" fill="#4b5563">
          Evaluator Signature
        </text>

        <line x1="720" y1="1230" x2="850" y2="1230" stroke="#9ca3af" strokeWidth="1" />
        <text x="785" y="1248" textAnchor="middle" fontSize="11" fill="#4b5563">
          Verified By
        </text>
      </svg>
    </div>
  );
};
