"use client";

import React from "react";
import { OMRData } from "../types/omr";

interface OMRSheetProps {
  data: OMRData;
  onChange: (data: OMRData) => void;
  svgRef: React.RefObject<SVGSVGElement>;
  isInteractive?: boolean;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const CLASSES = ["6th", "7th", "8th", "9th", "10th", "11th", "12th"];
const SECTIONS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const STREAMS = ["PCM", "PCB", "COM", "HUM"];
const SETS = ["1", "2", "3"];

export const OMRSheet: React.FC<OMRSheetProps> = ({
  data,
  onChange,
  svgRef,
  isInteractive = true,
}) => {
  const handleFieldChange = (field: keyof OMRData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleNameLetterChange = (colIdx: number, letter: string) => {
    const updated = [...data.candidateName];
    updated[colIdx] = letter.toUpperCase().slice(0, 1);
    onChange({ ...data, candidateName: updated });
  };

  const handleNameBubbleClick = (colIdx: number, letter: string) => {
    if (!isInteractive) return;
    const current = data.candidateName[colIdx];
    const updated = [...data.candidateName];
    updated[colIdx] = current === letter ? "" : letter;
    onChange({ ...data, candidateName: updated });
  };

  const handleDigitBubbleClick = (
    field: "rollNo" | "subjectCode" | "admissionNo",
    colIdx: number,
    digit: string
  ) => {
    if (!isInteractive) return;
    const arr = [...data[field]];
    arr[colIdx] = arr[colIdx] === digit ? null : digit;
    onChange({ ...data, [field]: arr });
  };

  const handleDigitBoxChange = (
    field: "rollNo" | "subjectCode" | "admissionNo",
    colIdx: number,
    val: string
  ) => {
    const cleaned = val.replace(/[^0-9]/g, "").slice(0, 1);
    const arr = [...data[field]];
    arr[colIdx] = cleaned || null;
    onChange({ ...data, [field]: arr });
  };

  const handleAnswerClick = (qIndex: number, option: string) => {
    if (!isInteractive) return;
    const updatedAnswers = [...data.answers];
    if (updatedAnswers[qIndex] === option) {
      updatedAnswers[qIndex] = null;
    } else {
      updatedAnswers[qIndex] = option;
    }
    onChange({ ...data, answers: updatedAnswers });
  };

  return (
    <div
      className="relative select-none print-page"
      style={{
        width: "920px",
        height: "1300px",
        position: "relative",
        backgroundColor: "#ffffff",
      }}
    >
      {/* ============================================================ */}
      {/* 1. MASTER SVG SHEET (Renders everything: vectors, borders, text, bubbles) */}
      {/* ============================================================ */}
      <svg
        ref={svgRef}
        id="omr-master-svg"
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
        {/* Background */}
        <rect x="0" y="0" width="920" height="1300" fill="#ffffff" />

        {/* ============================================================ */}
        {/* TIMING MARKS: LEFT (x: 36) & RIGHT (x: 868) */}
        {/* 52 marks, pitch 21.5px from y=173 to y=1270 */}
        {/* ============================================================ */}
        {Array.from({ length: 52 }).map((_, i) => {
          const yPos = 173 + i * 21.5;
          return (
            <React.Fragment key={`tm-${i}`}>
              <rect x="36" y={yPos} width="18" height="8" fill="#000000" />
              <rect x="868" y={yPos} width="18" height="8" fill="#000000" />
            </React.Fragment>
          );
        })}

        {/* ============================================================ */}
        {/* HEADER: LOGO, TITLE, ADDRESS, SAMPLE OMR SHEET */}
        {/* ============================================================ */}
        {/* Logo Stylized M */}
        <path
          d="M 115 65 L 115 34 L 128 50 L 141 34 L 141 65 L 134 65 L 134 44 L 128 52 L 122 44 L 122 65 Z"
          fill="#E6007E"
        />
        {/* Logo Stylized G */}
        <path
          d="M 144 49 C 144 39, 151 34, 162 34 C 167 34, 170 35, 172 37 L 168 42 C 166 40, 164 39, 161 39 C 155 39, 151 43, 151 49 C 151 54, 155 58, 161 58 C 164 58, 166 57, 168 56 L 168 51 L 160 51 L 160 46 L 174 46 L 174 58 C 172 61, 167 63, 161 63 C 151 63, 144 58, 144 49 Z"
          fill="#E6007E"
        />
        <text
          x="144"
          y="76"
          textAnchor="middle"
          fontSize="9.5"
          fontWeight="bold"
          fill="#E6007E"
          fontFamily="Arial, Helvetica, sans-serif"
        >
          Multigraphics Group
        </text>

        {/* Main Title: MULTIGRAPHICS GROUP */}
        <text
          x="213"
          y="62"
          fontSize="36"
          fontWeight="900"
          fill="#E6007E"
          fontFamily="Arial, Helvetica, sans-serif"
          letterSpacing="-0.5px"
        >
          MULTIGRAPHICS GROUP
        </text>

        {/* Address */}
        <text
          x="213"
          y="86"
          fontSize="10.5"
          fontWeight="500"
          fill="#4b5563"
          fontFamily="Arial, Helvetica, sans-serif"
        >
          A-86, DDA SHEDS, OKHLA INDUSTRIAL AREA PHASE – 2, | New Delhi, 110020 | +91 9811211828, 7827946435
        </text>

        {/* Title: SAMPLE OMR SHEET */}
        <text
          x="460"
          y="114"
          textAnchor="middle"
          fontSize="15"
          fontWeight="800"
          fill="#000000"
          fontFamily="Arial, Helvetica, sans-serif"
          letterSpacing="1px"
        >
          SAMPLE OMR SHEET
        </text>

        {/* ============================================================ */}
        {/* INFO ROW FRAME (x: 68-856, y: 124-164, 1.5px magenta border) */}
        {/* ============================================================ */}
        <rect
          x="68"
          y="124"
          width="788"
          height="40"
          fill="#ffffff"
          stroke="#E6007E"
          strokeWidth="1.5"
        />

        {/* Class & Sec. */}
        <text
          x="82"
          y="150"
          fontSize="17"
          fontWeight="bold"
          fontStyle="italic"
          fill="#E6007E"
          fontFamily="Georgia, 'Times New Roman', serif"
        >
          Class &amp; Sec.
        </text>
        <line x1="178" y1="152" x2="295" y2="152" stroke="#9ca3af" strokeWidth="1" />
        <text
          x="184"
          y="148"
          fontSize="13"
          fontWeight="600"
          fill="#000000"
          fontFamily="Arial, Helvetica, sans-serif"
        >
          {data.classSec}
        </text>

        {/* Name of Exam */}
        <text
          x="315"
          y="150"
          fontSize="17"
          fontWeight="bold"
          fontStyle="italic"
          fill="#E6007E"
          fontFamily="Georgia, 'Times New Roman', serif"
        >
          Name of Exam
        </text>
        <line x1="432" y1="152" x2="680" y2="152" stroke="#9ca3af" strokeWidth="1" />
        <text
          x="438"
          y="148"
          fontSize="13"
          fontWeight="600"
          fill="#000000"
          fontFamily="Arial, Helvetica, sans-serif"
        >
          {data.examName}
        </text>

        {/* Date */}
        <text
          x="700"
          y="150"
          fontSize="17"
          fontWeight="bold"
          fontStyle="italic"
          fill="#E6007E"
          fontFamily="Georgia, 'Times New Roman', serif"
        >
          Date
        </text>
        <line x1="745" y1="152" x2="845" y2="152" stroke="#9ca3af" strokeWidth="1" />
        <text
          x="750"
          y="148"
          fontSize="13"
          fontWeight="600"
          fill="#000000"
          fontFamily="Arial, Helvetica, sans-serif"
        >
          {data.date}
        </text>

        {/* ============================================================ */}
        {/* NAME OF CANDIDATE (x: 68-522, y: 173-686) */}
        {/* ============================================================ */}
        <rect
          x="68"
          y="173"
          width="454"
          height="513"
          fill="#ffffff"
          stroke="#E6007E"
          strokeWidth="1"
        />
        {/* Header bar */}
        <rect
          x="68"
          y="173"
          width="454"
          height="21"
          fill="#FBDCEB"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <text
          x="295"
          y="188"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="#000000"
        >
          NAME OF CANDIDATE (IN CAPITAL LETTERS)
        </text>

        {/* 21 Write-in boxes: y: 199 to 222 */}
        {Array.from({ length: 21 }).map((_, cIdx) => {
          const cx = 83 + cIdx * 21.15;
          return (
            <React.Fragment key={`name-box-svg-${cIdx}`}>
              <rect
                x={cx - 9}
                y="199"
                width="18"
                height="23"
                fill="#ffffff"
                stroke="#E6007E"
                strokeWidth="1"
              />
              <text
                x={cx}
                y="215"
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#000000"
              >
                {data.candidateName[cIdx] || ""}
              </text>
            </React.Fragment>
          );
        })}

        {/* 26 Rows of bubbles (A to Z): first row y-center 232, row pitch 17.6 */}
        {ALPHABET.map((letter, rIdx) => {
          const cy = 232 + rIdx * 17.6;
          return Array.from({ length: 21 }).map((_, cIdx) => {
            const cx = 83 + cIdx * 21.15;
            const isFilled = data.candidateName[cIdx] === letter;
            return (
              <g
                key={`name-b-${cIdx}-${letter}`}
                onClick={() => handleNameBubbleClick(cIdx, letter)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r="7"
                  fill={isFilled ? "#000000" : "#ffffff"}
                  stroke={isFilled ? "#000000" : "#E6007E"}
                  strokeWidth="1"
                />
                {!isFilled && (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#E6007E"
                    fontFamily="Arial, Helvetica, sans-serif"
                    pointerEvents="none"
                  >
                    {letter}
                  </text>
                )}
              </g>
            );
          });
        })}

        {/* ============================================================ */}
        {/* CLASS BLOCK (x: 531-609, y: 173-408) */}
        {/* ============================================================ */}
        <rect
          x="531"
          y="173"
          width="78"
          height="235"
          fill="#ffffff"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <rect
          x="531"
          y="173"
          width="78"
          height="21"
          fill="#FBDCEB"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <text
          x="570"
          y="188"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="#000000"
        >
          CLASS
        </text>

        {CLASSES.map((cls, idx) => {
          const cy = 218 + idx * 26;
          const isFilled = data.selectedClass === cls;
          return (
            <g
              key={cls}
              onClick={() =>
                isInteractive && handleFieldChange("selectedClass", isFilled ? null : cls)
              }
              style={{ cursor: "pointer" }}
            >
              <text
                x="542"
                y={cy}
                dominantBaseline="central"
                fontSize="10.5"
                fontWeight="bold"
                fill="#000000"
              >
                {cls}
              </text>
              <circle
                cx="592"
                cy={cy}
                r="7"
                fill={isFilled ? "#000000" : "#ffffff"}
                stroke={isFilled ? "#000000" : "#E6007E"}
                strokeWidth="1"
              />
            </g>
          );
        })}

        {/* ============================================================ */}
        {/* SECTION BLOCK (x: 615-675, y: 173-408) */}
        {/* ============================================================ */}
        <rect
          x="615"
          y="173"
          width="60"
          height="235"
          fill="#ffffff"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <rect
          x="615"
          y="173"
          width="60"
          height="21"
          fill="#FBDCEB"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <text
          x="645"
          y="188"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="#000000"
        >
          SECTION
        </text>

        {SECTIONS.map((sec, idx) => {
          const cy = 208 + idx * 19;
          const isFilled = data.selectedSection === sec;
          return (
            <g
              key={sec}
              onClick={() =>
                isInteractive && handleFieldChange("selectedSection", isFilled ? null : sec)
              }
              style={{ cursor: "pointer" }}
            >
              <text
                x="626"
                y={cy}
                dominantBaseline="central"
                fontSize="10.5"
                fontWeight="bold"
                fill="#000000"
              >
                {sec}
              </text>
              <circle
                cx="655"
                cy={cy}
                r="7"
                fill={isFilled ? "#000000" : "#ffffff"}
                stroke={isFilled ? "#000000" : "#E6007E"}
                strokeWidth="1"
              />
            </g>
          );
        })}

        {/* ============================================================ */}
        {/* ROLL No. BLOCK (x: 681-755, y: 173-408) */}
        {/* ============================================================ */}
        <rect
          x="681"
          y="173"
          width="74"
          height="235"
          fill="#ffffff"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <rect
          x="681"
          y="173"
          width="74"
          height="21"
          fill="#FBDCEB"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <text
          x="718"
          y="188"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="#000000"
        >
          ROLL No.
        </text>

        {/* 2 write-in boxes */}
        {[0, 1].map((cIdx) => {
          const cx = cIdx === 0 ? 704 : 732;
          return (
            <React.Fragment key={`roll-box-svg-${cIdx}`}>
              <rect
                x={cx - 9}
                y="200"
                width="18"
                height="22"
                fill="#ffffff"
                stroke="#E6007E"
                strokeWidth="1"
              />
              <text
                x={cx}
                y="215"
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#000000"
              >
                {data.rollNo[cIdx] || ""}
              </text>
            </React.Fragment>
          );
        })}

        {/* 10 rows of bubbles (0..9) */}
        {DIGITS.map((d, rIdx) => {
          const cy = 236 + rIdx * 16.8;
          return [0, 1].map((cIdx) => {
            const cx = cIdx === 0 ? 704 : 732;
            const isFilled = data.rollNo[cIdx] === d;
            return (
              <g
                key={`roll-${cIdx}-${d}`}
                onClick={() => handleDigitBubbleClick("rollNo", cIdx, d)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r="7"
                  fill={isFilled ? "#000000" : "#ffffff"}
                  stroke={isFilled ? "#000000" : "#E6007E"}
                  strokeWidth="1"
                />
                {!isFilled && (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#E6007E"
                    fontFamily="Arial, Helvetica, sans-serif"
                    pointerEvents="none"
                  >
                    {d}
                  </text>
                )}
              </g>
            );
          });
        })}

        {/* ============================================================ */}
        {/* STREAM (x: 761-856, y: 173-295) & SET NUMBER (y: 300-408) */}
        {/* ============================================================ */}
        {/* STREAM */}
        <rect
          x="761"
          y="173"
          width="95"
          height="122"
          fill="#ffffff"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <rect
          x="761"
          y="173"
          width="95"
          height="21"
          fill="#FBDCEB"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <text
          x="808"
          y="188"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="#000000"
        >
          STREAM
        </text>
        {STREAMS.map((stm, idx) => {
          const cy = 208 + idx * 22;
          const isFilled = data.selectedStream === stm;
          return (
            <g
              key={stm}
              onClick={() =>
                isInteractive && handleFieldChange("selectedStream", isFilled ? null : stm)
              }
              style={{ cursor: "pointer" }}
            >
              <text
                x="770"
                y={cy}
                dominantBaseline="central"
                fontSize="10.5"
                fontWeight="bold"
                fill="#000000"
              >
                {stm}
              </text>
              <circle
                cx="835"
                cy={cy}
                r="7"
                fill={isFilled ? "#000000" : "#ffffff"}
                stroke={isFilled ? "#000000" : "#E6007E"}
                strokeWidth="1"
              />
            </g>
          );
        })}

        {/* SET NUMBER */}
        <rect
          x="761"
          y="300"
          width="95"
          height="108"
          fill="#ffffff"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <rect
          x="761"
          y="300"
          width="95"
          height="21"
          fill="#FBDCEB"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <text
          x="808"
          y="315"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="#000000"
        >
          SET NUMBER
        </text>
        {SETS.map((setNum, idx) => {
          const cy = 338 + idx * 24;
          const isFilled = data.selectedSet === setNum;
          return (
            <g
              key={`set-${setNum}`}
              onClick={() =>
                isInteractive && handleFieldChange("selectedSet", isFilled ? null : setNum)
              }
              style={{ cursor: "pointer" }}
            >
              <text
                x="780"
                y={cy}
                dominantBaseline="central"
                fontSize="11"
                fontWeight="bold"
                fill="#000000"
              >
                {setNum}
              </text>
              <circle
                cx="835"
                cy={cy}
                r="7"
                fill={isFilled ? "#000000" : "#ffffff"}
                stroke={isFilled ? "#000000" : "#E6007E"}
                strokeWidth="1"
              />
            </g>
          );
        })}

        {/* ============================================================ */}
        {/* SUBJECT BAR (x: 531-856, y: 415-440) */}
        {/* ============================================================ */}
        <rect
          x="531"
          y="415"
          width="325"
          height="25"
          fill="#ffffff"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <text
          x="542"
          y="432"
          fontSize="11"
          fontWeight="bold"
          fill="#000000"
        >
          SUBJECT :
        </text>
        <line x1="608" y1="433" x2="845" y2="433" stroke="#9ca3af" strokeWidth="1" />
        <text
          x="612"
          y="430"
          fontSize="12"
          fontWeight="600"
          fill="#000000"
        >
          {data.subject}
        </text>

        {/* ============================================================ */}
        {/* SUBJECT CODE (x: 531-675, y: 446-686) */}
        {/* ============================================================ */}
        <rect
          x="531"
          y="446"
          width="144"
          height="240"
          fill="#ffffff"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <rect
          x="531"
          y="446"
          width="144"
          height="21"
          fill="#FBDCEB"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <text
          x="603"
          y="461"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="#000000"
        >
          SUBJECT CODE
        </text>

        {/* 3 write-in boxes */}
        {[0, 1, 2].map((cIdx) => {
          const cx = 567 + cIdx * 36;
          return (
            <React.Fragment key={`subj-box-svg-${cIdx}`}>
              <rect
                x={cx - 9}
                y="474"
                width="18"
                height="22"
                fill="#ffffff"
                stroke="#E6007E"
                strokeWidth="1"
              />
              <text
                x={cx}
                y="489"
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#000000"
              >
                {data.subjectCode[cIdx] || ""}
              </text>
            </React.Fragment>
          );
        })}

        {/* 10 rows of bubbles (0..9) */}
        {DIGITS.map((d, rIdx) => {
          const cy = 512 + rIdx * 17;
          return [0, 1, 2].map((cIdx) => {
            const cx = 567 + cIdx * 36;
            const isFilled = data.subjectCode[cIdx] === d;
            return (
              <g
                key={`subj-${cIdx}-${d}`}
                onClick={() => handleDigitBubbleClick("subjectCode", cIdx, d)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r="7"
                  fill={isFilled ? "#000000" : "#ffffff"}
                  stroke={isFilled ? "#000000" : "#E6007E"}
                  strokeWidth="1"
                />
                {!isFilled && (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#E6007E"
                    fontFamily="Arial, Helvetica, sans-serif"
                    pointerEvents="none"
                  >
                    {d}
                  </text>
                )}
              </g>
            );
          });
        })}

        {/* ============================================================ */}
        {/* ADMISSION No. (x: 681-856, y: 446-686) */}
        {/* ============================================================ */}
        <rect
          x="681"
          y="446"
          width="175"
          height="240"
          fill="#ffffff"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <rect
          x="681"
          y="446"
          width="175"
          height="21"
          fill="#FBDCEB"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <text
          x="768"
          y="461"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="#000000"
        >
          ADMISSION No.
        </text>

        {/* 4 write-in boxes */}
        {[0, 1, 2, 3].map((cIdx) => {
          const cx = 712 + cIdx * 36;
          return (
            <React.Fragment key={`adm-box-svg-${cIdx}`}>
              <rect
                x={cx - 9}
                y="474"
                width="18"
                height="22"
                fill="#ffffff"
                stroke="#E6007E"
                strokeWidth="1"
              />
              <text
                x={cx}
                y="489"
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#000000"
              >
                {data.admissionNo[cIdx] || ""}
              </text>
            </React.Fragment>
          );
        })}

        {/* 10 rows of bubbles (0..9) */}
        {DIGITS.map((d, rIdx) => {
          const cy = 512 + rIdx * 17;
          return [0, 1, 2, 3].map((cIdx) => {
            const cx = 712 + cIdx * 36;
            const isFilled = data.admissionNo[cIdx] === d;
            return (
              <g
                key={`adm-${cIdx}-${d}`}
                onClick={() => handleDigitBubbleClick("admissionNo", cIdx, d)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r="7"
                  fill={isFilled ? "#000000" : "#ffffff"}
                  stroke={isFilled ? "#000000" : "#E6007E"}
                  strokeWidth="1"
                />
                {!isFilled && (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#E6007E"
                    fontFamily="Arial, Helvetica, sans-serif"
                    pointerEvents="none"
                  >
                    {d}
                  </text>
                )}
              </g>
            );
          });
        })}

        {/* ============================================================ */}
        {/* 100-QUESTION ANSWER GRID (x: 68-676, y: 698-1205) */}
        {/* ============================================================ */}
        <rect
          x="68"
          y="698"
          width="608"
          height="507"
          fill="#ffffff"
          stroke="#E6007E"
          strokeWidth="1"
        />
        {/* Column dividing lines */}
        {[1, 2, 3].map((divIdx) => (
          <line
            key={`grid-div-${divIdx}`}
            x1={68 + divIdx * 152}
            y1="698"
            x2={68 + divIdx * 152}
            y2="1205"
            stroke="#E6007E"
            strokeWidth="1"
          />
        ))}

        {/* 4 Columns */}
        {[
          { start: 0, end: 25 },
          { start: 25, end: 50 },
          { start: 50, end: 75 },
          { start: 75, end: 100 },
        ].map((col, cIdx) => {
          const colLeft = 68 + cIdx * 152;
          return Array.from({ length: 25 }).map((_, rIdx) => {
            const qNum = col.start + rIdx + 1;
            const qIndex = col.start + rIdx;
            const cy = 708 + rIdx * 20.2;
            const currentAnswer = data.answers[qIndex];

            return (
              <React.Fragment key={`q-${qNum}`}>
                {/* Question Number */}
                <text
                  x={colLeft + 28}
                  y={cy}
                  textAnchor="end"
                  dominantBaseline="central"
                  fontSize="11"
                  fontWeight="800"
                  fill="#000000"
                >
                  {qNum}
                </text>

                {/* 4 Option Bubbles: A, B, C, D */}
                {["A", "B", "C", "D"].map((opt, optIdx) => {
                  const cx = colLeft + 46 + optIdx * 26;
                  const isFilled = currentAnswer === opt;
                  return (
                    <g
                      key={`q-${qNum}-${opt}`}
                      onClick={() => handleAnswerClick(qIndex, opt)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle
                        cx={cx}
                        cy={cy}
                        r="7"
                        fill={isFilled ? "#000000" : "#ffffff"}
                        stroke={isFilled ? "#000000" : "#E6007E"}
                        strokeWidth="1"
                      />
                      {!isFilled && (
                        <text
                          x={cx}
                          y={cy}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="9"
                          fontWeight="bold"
                          fill="#E6007E"
                          fontFamily="Arial, Helvetica, sans-serif"
                          pointerEvents="none"
                        >
                          {opt}
                        </text>
                      )}
                    </g>
                  );
                })}
              </React.Fragment>
            );
          });
        })}

        {/* ============================================================ */}
        {/* RIGHT UTILITY BLOCK (x: 684-856, y: 698-1205) */}
        {/* ============================================================ */}
        {/* Barcode */}
        <g transform="translate(695, 706)">
          <rect x="0" y="0" width="3" height="38" fill="black" />
          <rect x="5" y="0" width="1.5" height="38" fill="black" />
          <rect x="9" y="0" width="4" height="38" fill="black" />
          <rect x="15" y="0" width="1.5" height="38" fill="black" />
          <rect x="19" y="0" width="3" height="38" fill="black" />
          <rect x="25" y="0" width="2" height="38" fill="black" />
          <rect x="30" y="0" width="4" height="38" fill="black" />
          <rect x="37" y="0" width="1.5" height="38" fill="black" />
          <rect x="42" y="0" width="3" height="38" fill="black" />
          <rect x="47" y="0" width="2" height="38" fill="black" />
          <rect x="52" y="0" width="5" height="38" fill="black" />
          <rect x="60" y="0" width="1.5" height="38" fill="black" />
          <rect x="64" y="0" width="3" height="38" fill="black" />
          <rect x="70" y="0" width="4" height="38" fill="black" />
          <rect x="77" y="0" width="2" height="38" fill="black" />
          <rect x="82" y="0" width="1.5" height="38" fill="black" />
          <rect x="86" y="0" width="4" height="38" fill="black" />
          <rect x="93" y="0" width="3" height="38" fill="black" />
          <rect x="99" y="0" width="1.5" height="38" fill="black" />
          <rect x="103" y="0" width="4" height="38" fill="black" />
          <rect x="110" y="0" width="2" height="38" fill="black" />
          <rect x="115" y="0" width="3" height="38" fill="black" />
          <rect x="121" y="0" width="5" height="38" fill="black" />
          <rect x="129" y="0" width="2" height="38" fill="black" />
          <rect x="134" y="0" width="3" height="38" fill="black" />
          <rect x="140" y="0" width="2" height="38" fill="black" />
          <rect x="145" y="0" width="4" height="38" fill="black" />
        </g>
        <text
          x="770"
          y="760"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="11"
          fontWeight="bold"
          fill="#000000"
          letterSpacing="2px"
        >
          {data.barcode || "123456789"}
        </text>

        {/* Instructions Box */}
        <rect
          x="684"
          y="782"
          width="172"
          height="300"
          fill="#ffffff"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <rect
          x="684"
          y="782"
          width="172"
          height="32"
          fill="#FBDCEB"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <text
          x="770"
          y="796"
          textAnchor="middle"
          fontSize="10.5"
          fontWeight="bold"
          fill="#000000"
        >
          INSTRUCTIONS FOR MARKING
        </text>
        <text
          x="770"
          y="809"
          textAnchor="middle"
          fontSize="10.5"
          fontWeight="bold"
          fill="#000000"
        >
          OMR SHEET
        </text>

        <text x="692" y="830" fontSize="9" fill="#1f2937">
          1. Use Black/Blue ball point pen for
        </text>
        <text x="692" y="842" fontSize="9" fill="#1f2937">
          writing
        </text>

        <text x="692" y="860" fontSize="9" fill="#1f2937">
          2. Darken only one circle for marking
        </text>
        <text x="692" y="872" fontSize="9" fill="#1f2937">
          response against the question to answer
        </text>

        <text x="692" y="890" fontSize="9" fill="#1f2937">
          3. To record response.
        </text>

        {/* Instruction divider line */}
        <line x1="692" y1="910" x2="848" y2="910" stroke="#fbcfe8" strokeWidth="1" />

        {/* CORRECT METHOD */}
        <text x="692" y="934" fontSize="8.5" fontWeight="bold" fill="#000000">
          CORRECT METHOD
        </text>
        <circle cx="806" cy="931" r="6" fill="#ffffff" stroke="#E6007E" strokeWidth="1" />
        <circle cx="828" cy="931" r="6" fill="#000000" stroke="#000000" strokeWidth="1" />

        {/* WRONG METHOD */}
        <text x="692" y="966" fontSize="8.5" fontWeight="bold" fill="#000000">
          WRONG METHOD
        </text>
        {/* Checkmark */}
        <circle cx="780" cy="963" r="6" fill="#ffffff" stroke="#E6007E" strokeWidth="1" />
        <text
          x="780"
          y="963"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="8"
          fontWeight="bold"
          fill="#000000"
        >
          ✓
        </text>
        {/* Cross */}
        <circle cx="802" cy="963" r="6" fill="#ffffff" stroke="#E6007E" strokeWidth="1" />
        <text
          x="802"
          y="963"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="8"
          fontWeight="bold"
          fill="#000000"
        >
          ✕
        </text>
        {/* Half filled */}
        <circle cx="824" cy="963" r="6" fill="#ffffff" stroke="#E6007E" strokeWidth="1" />
        <path d="M 824 957 A 6 6 0 0 0 824 969 Z" fill="#000000" />
        {/* Dot inside */}
        <circle cx="846" cy="963" r="6" fill="#ffffff" stroke="#E6007E" strokeWidth="1" />
        <circle cx="846" cy="963" r="2" fill="#000000" />

        {/* MARKS OBTAINED */}
        <rect
          x="684"
          y="1093"
          width="82"
          height="112"
          fill="#ffffff"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <rect
          x="684"
          y="1093"
          width="82"
          height="32"
          fill="#FBDCEB"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <text
          x="725"
          y="1106"
          textAnchor="middle"
          fontSize="9.5"
          fontWeight="bold"
          fill="#000000"
        >
          MARKS
        </text>
        <text
          x="725"
          y="1119"
          textAnchor="middle"
          fontSize="9.5"
          fontWeight="bold"
          fill="#000000"
        >
          OBTAINED
        </text>
        <text
          x="725"
          y="1165"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="16"
          fontWeight="bold"
          fill="#000000"
        >
          {data.marksObtained}
        </text>

        {/* EXAMINER'S SIGNATURE */}
        <rect
          x="774"
          y="1093"
          width="82"
          height="112"
          fill="#ffffff"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <rect
          x="774"
          y="1093"
          width="82"
          height="32"
          fill="#FBDCEB"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <text
          x="815"
          y="1106"
          textAnchor="middle"
          fontSize="9.5"
          fontWeight="bold"
          fill="#000000"
        >
          EXAMINER&apos;S
        </text>
        <text
          x="815"
          y="1119"
          textAnchor="middle"
          fontSize="9.5"
          fontWeight="bold"
          fill="#000000"
        >
          SIGNATURE
        </text>
        <text
          x="815"
          y="1165"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Georgia, serif"
          fontStyle="italic"
          fontSize="13"
          fontWeight="bold"
          fill="#000000"
        >
          {data.invigilatorSignature}
        </text>

        {/* ============================================================ */}
        {/* SIGNATURE BOXES (y: 1215 to 1275) */}
        {/* ============================================================ */}
        {/* Candidate Signature Box */}
        <rect
          x="68"
          y="1215"
          width="387"
          height="60"
          fill="#ffffff"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <text
          x="261"
          y="1265"
          textAnchor="middle"
          fontSize="11.5"
          fontWeight="bold"
          fill="#000000"
        >
          Signature of Candidate
        </text>
        <text
          x="261"
          y="1240"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Georgia, serif"
          fontStyle="italic"
          fontSize="14"
          fontWeight="bold"
          fill="#000000"
        >
          {data.candidateSignature}
        </text>

        {/* Invigilator Signature Box */}
        <rect
          x="469"
          y="1215"
          width="387"
          height="60"
          fill="#ffffff"
          stroke="#E6007E"
          strokeWidth="1"
        />
        <text
          x="662"
          y="1265"
          textAnchor="middle"
          fontSize="11.5"
          fontWeight="bold"
          fill="#000000"
        >
          Signature of Invigilator
        </text>
        <text
          x="662"
          y="1240"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Georgia, serif"
          fontStyle="italic"
          fontSize="14"
          fontWeight="bold"
          fill="#000000"
        >
          {data.invigilatorSignature}
        </text>
      </svg>

      {/* ============================================================ */}
      {/* 2. ON-SCREEN INTERACTIVE INPUT OVERLAYS (No-print, screened inputs) */}
      {/* These transparent/styled inputs sit exactly over write-in positions */}
      {/* ============================================================ */}
      {isInteractive && (
        <div
          className="absolute inset-0 pointer-events-none no-print"
          style={{ width: "920px", height: "1300px" }}
        >
          {/* Class & Sec. Input */}
          <input
            type="text"
            value={data.classSec}
            onChange={(e) => handleFieldChange("classSec", e.target.value)}
            style={{
              position: "absolute",
              left: "182px",
              top: "132px",
              width: "115px",
              height: "24px",
              border: "none",
              outline: "none",
              fontSize: "13px",
              fontWeight: "600",
              color: "transparent",
              caretColor: "#000",
              backgroundColor: "transparent",
              pointerEvents: "auto",
            }}
          />

          {/* Name of Exam Input */}
          <input
            type="text"
            value={data.examName}
            onChange={(e) => handleFieldChange("examName", e.target.value)}
            style={{
              position: "absolute",
              left: "436px",
              top: "132px",
              width: "246px",
              height: "24px",
              border: "none",
              outline: "none",
              fontSize: "13px",
              fontWeight: "600",
              color: "transparent",
              caretColor: "#000",
              backgroundColor: "transparent",
              pointerEvents: "auto",
            }}
          />

          {/* Date Input */}
          <input
            type="text"
            value={data.date}
            onChange={(e) => handleFieldChange("date", e.target.value)}
            style={{
              position: "absolute",
              left: "748px",
              top: "132px",
              width: "100px",
              height: "24px",
              border: "none",
              outline: "none",
              fontSize: "13px",
              fontWeight: "600",
              color: "transparent",
              caretColor: "#000",
              backgroundColor: "transparent",
              pointerEvents: "auto",
            }}
          />

          {/* 21 Candidate Name Write-in Box Inputs */}
          {Array.from({ length: 21 }).map((_, cIdx) => {
            const cx = 83 + cIdx * 21.15;
            return (
              <input
                key={`input-name-${cIdx}`}
                type="text"
                maxLength={1}
                value={data.candidateName[cIdx] || ""}
                onChange={(e) => handleNameLetterChange(cIdx, e.target.value)}
                style={{
                  position: "absolute",
                  left: `${cx - 9}px`,
                  top: "199px",
                  width: "18px",
                  height: "23px",
                  border: "none",
                  outline: "none",
                  textAlign: "center",
                  fontSize: "11px",
                  fontWeight: "bold",
                  color: "transparent",
                  caretColor: "#000",
                  backgroundColor: "transparent",
                  pointerEvents: "auto",
                  padding: 0,
                }}
              />
            );
          })}

          {/* 2 Roll No Inputs */}
          {[0, 1].map((cIdx) => {
            const cx = cIdx === 0 ? 704 : 732;
            return (
              <input
                key={`input-roll-${cIdx}`}
                type="text"
                maxLength={1}
                value={data.rollNo[cIdx] || ""}
                onChange={(e) => handleDigitBoxChange("rollNo", cIdx, e.target.value)}
                style={{
                  position: "absolute",
                  left: `${cx - 9}px`,
                  top: "200px",
                  width: "18px",
                  height: "22px",
                  border: "none",
                  outline: "none",
                  textAlign: "center",
                  fontSize: "11px",
                  fontWeight: "bold",
                  color: "transparent",
                  caretColor: "#000",
                  backgroundColor: "transparent",
                  pointerEvents: "auto",
                  padding: 0,
                }}
              />
            );
          })}

          {/* Subject Bar Input */}
          <input
            type="text"
            value={data.subject}
            onChange={(e) => handleFieldChange("subject", e.target.value)}
            style={{
              position: "absolute",
              left: "610px",
              top: "418px",
              width: "238px",
              height: "20px",
              border: "none",
              outline: "none",
              fontSize: "12px",
              fontWeight: "600",
              color: "transparent",
              caretColor: "#000",
              backgroundColor: "transparent",
              pointerEvents: "auto",
            }}
          />

          {/* 3 Subject Code Inputs */}
          {[0, 1, 2].map((cIdx) => {
            const cx = 567 + cIdx * 36;
            return (
              <input
                key={`input-subj-${cIdx}`}
                type="text"
                maxLength={1}
                value={data.subjectCode[cIdx] || ""}
                onChange={(e) => handleDigitBoxChange("subjectCode", cIdx, e.target.value)}
                style={{
                  position: "absolute",
                  left: `${cx - 9}px`,
                  top: "474px",
                  width: "18px",
                  height: "22px",
                  border: "none",
                  outline: "none",
                  textAlign: "center",
                  fontSize: "11px",
                  fontWeight: "bold",
                  color: "transparent",
                  caretColor: "#000",
                  backgroundColor: "transparent",
                  pointerEvents: "auto",
                  padding: 0,
                }}
              />
            );
          })}

          {/* 4 Admission No Inputs */}
          {[0, 1, 2, 3].map((cIdx) => {
            const cx = 712 + cIdx * 36;
            return (
              <input
                key={`input-adm-${cIdx}`}
                type="text"
                maxLength={1}
                value={data.admissionNo[cIdx] || ""}
                onChange={(e) => handleDigitBoxChange("admissionNo", cIdx, e.target.value)}
                style={{
                  position: "absolute",
                  left: `${cx - 9}px`,
                  top: "474px",
                  width: "18px",
                  height: "22px",
                  border: "none",
                  outline: "none",
                  textAlign: "center",
                  fontSize: "11px",
                  fontWeight: "bold",
                  color: "transparent",
                  caretColor: "#000",
                  backgroundColor: "transparent",
                  pointerEvents: "auto",
                  padding: 0,
                }}
              />
            );
          })}

          {/* Marks Obtained Input */}
          <input
            type="text"
            value={data.marksObtained}
            onChange={(e) => handleFieldChange("marksObtained", e.target.value)}
            style={{
              position: "absolute",
              left: "686px",
              top: "1130px",
              width: "78px",
              height: "70px",
              border: "none",
              outline: "none",
              textAlign: "center",
              fontSize: "16px",
              fontWeight: "bold",
              color: "transparent",
              caretColor: "#000",
              backgroundColor: "transparent",
              pointerEvents: "auto",
            }}
          />

          {/* Examiner Signature Input */}
          <input
            type="text"
            value={data.invigilatorSignature}
            onChange={(e) => handleFieldChange("invigilatorSignature", e.target.value)}
            style={{
              position: "absolute",
              left: "776px",
              top: "1130px",
              width: "78px",
              height: "70px",
              border: "none",
              outline: "none",
              textAlign: "center",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: "13px",
              fontWeight: "bold",
              color: "transparent",
              caretColor: "#000",
              backgroundColor: "transparent",
              pointerEvents: "auto",
            }}
          />

          {/* Candidate Signature Input */}
          <input
            type="text"
            value={data.candidateSignature}
            onChange={(e) => handleFieldChange("candidateSignature", e.target.value)}
            placeholder="Click to sign as candidate"
            style={{
              position: "absolute",
              left: "72px",
              top: "1220px",
              width: "379px",
              height: "36px",
              border: "none",
              outline: "none",
              textAlign: "center",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: "14px",
              fontWeight: "bold",
              color: data.candidateSignature ? "transparent" : "#9ca3af",
              caretColor: "#000",
              backgroundColor: "transparent",
              pointerEvents: "auto",
            }}
          />

          {/* Invigilator Signature Input */}
          <input
            type="text"
            value={data.invigilatorSignature}
            onChange={(e) => handleFieldChange("invigilatorSignature", e.target.value)}
            placeholder="Click to sign as invigilator"
            style={{
              position: "absolute",
              left: "473px",
              top: "1220px",
              width: "379px",
              height: "36px",
              border: "none",
              outline: "none",
              textAlign: "center",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: "14px",
              fontWeight: "bold",
              color: data.invigilatorSignature ? "transparent" : "#9ca3af",
              caretColor: "#000",
              backgroundColor: "transparent",
              pointerEvents: "auto",
            }}
          />
        </div>
      )}
    </div>
  );
};
