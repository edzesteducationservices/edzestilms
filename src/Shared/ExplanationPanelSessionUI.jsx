import React from "react";

/** EXACT same UI feel as submit page */
export default function ExplanationPanelSessionUI({ results = [] }) {
  const norm = (v) =>
    Array.isArray(v) ? v.map(String) : v ? [String(v)] : [];

  const has = (arr, val) =>
    arr.map((x) => x.toUpperCase().trim()).includes(String(val).toUpperCase().trim());

  return (
    <div style={wrap}>
      <h3 style={heading}>Answer Explanation</h3>

      {results.map((r, idx) => {
        const options  = Array.isArray(r.options) ? r.options : [];
        const submitted = norm(r.submitted);
        const correct   = norm(r.correct);

        return (
          <div key={r.questionId || idx} style={qCard}>
            <div style={qTitle}>
              <span style={qIndex}>Q{idx + 1}:</span> {r.questionText}
            </div>

            <div>
              {options.map((opt, i) => {
                const label = String.fromCharCode(65 + i);
                const sel   = has(submitted, label);
                const ok    = has(correct, label);

                let style = optRow;                            // neutral
                if (sel && ok)       style = {...optRow, ...optRowCorrectFilled};   // green filled
                else if (sel && !ok) style = {...optRow, ...optRowWrongFilled};     // red filled
                else if (!sel && ok) style = {...optRow, ...optRowCorrectOutline};  // light green

                return (
                  <div key={i} style={style}>
                    <div style={optLabel}>{label}.</div>
                    <div style={optText}>{opt}</div>
                  </div>
                );
              })}
            </div>

            {!!r.explanation && (
              <div style={explainBox}>
                <strong>Explanation:&nbsp;</strong>{r.explanation}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---- styles mimic your submit view ---- */
const wrap = { maxWidth: 880, margin: "12px auto", padding: "0 8px" };
const heading = { textAlign: "center", margin: "8px 0 14px", fontWeight: 700 };

const qCard = {
  background: "#e7f0ff",
  border: "1px solid #cfe0ff",
  borderRadius: 12,
  padding: 14,
  marginBottom: 16,
  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
};
const qTitle = { fontSize: "1rem", marginBottom: 10, lineHeight: 1.4 };
const qIndex = { fontWeight: 700, marginRight: 6 };

const optRow = {
  display: "grid",
  gridTemplateColumns: "36px 1fr",
  alignItems: "center",
  gap: 10,
  padding: "10px 12px",
  marginBottom: 8,
  borderRadius: 10,
  border: "1px solid #d9d9d9",
  background: "#fff",
  fontWeight: 600,
};
const optLabel = { width: 36, textAlign: "center" };
const optText  = { whiteSpace: "pre-wrap", wordBreak: "break-word" };

const optRowCorrectFilled  = { background: "#2e7d32", borderColor: "#2e7d32", color: "#fff" };
const optRowWrongFilled    = { background: "#d32f2f", borderColor: "#d32f2f", color: "#fff" };
const optRowCorrectOutline = { background: "#d4edda", borderColor: "#28a745", color: "#155724" };

const explainBox = {
  marginTop: 12, padding: "10px 12px",
  background: "#fff",
  border: "1px solid #cddafc",
  borderLeft: "4px solid #4748ac",
  borderRadius: 8, color: "#333",
};
