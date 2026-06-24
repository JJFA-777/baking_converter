import React from "react";

const ML_PER_CUP = 236.588;
const G_PER_OZ = 28.3495;

const ROWS = [
  { name: "All-Purpose Flour",             gpc: 120 },
  { name: "Granulated Sugar",              gpc: 200 },
  { name: "Brown Sugar (packed)",          gpc: 220 },
  { name: "Butter",                        gpc: 227 },
  { name: "Powdered / Icing Sugar",        gpc: 120 },
  { name: "Whole Wheat Flour",             gpc: 130 },
  { name: "Honey",                         gpc: 340 },
  { name: "Cocoa Powder",                  gpc:  85 },
  { name: "Rolled Oats (old-fashioned)",   gpc:  90 },
  { name: "Heavy / Whipping Cream",        gpc: 238 },
];

const TD_LEFT = { padding: "8px", textAlign: "left" };
const TD_RIGHT = { padding: "8px", textAlign: "right" };

function gramsForMl(gpc, ml) {
  return Math.round((gpc / ML_PER_CUP) * ml);
}

function ozFromGrams(g) {
  return Math.round((g / G_PER_OZ) * 10) / 10;
}

function buildRow(r) {
  var name = r.name;
  var gpc = r.gpc;
  return (
    <tr key={name} style={{ borderTop: "1px solid var(--border)" }}>
      <td style={TD_LEFT}>{name}</td>
      <td style={TD_RIGHT}>{gpc}</td>
      <td style={TD_RIGHT}>{ozFromGrams(gpc)}</td>
      <td style={TD_RIGHT}>{gramsForMl(gpc, 240)}</td>
    </tr>
  );
}

export default function ConversionCharts() {
  var rows = ROWS.map(buildRow);

  return (
    <section
      className="bc-conversion-charts"
      aria-labelledby="conversion-charts-heading"
      style={{
        margin: "24px 16px",
        padding: "16px",
        borderRadius: "16px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <h2
        id="conversion-charts-heading"
        style={{ fontSize: "20px", marginBottom: "8px" }}
      >
        Common Ingredient Conversion Charts
      </h2>
      <p style={{ margin: "0 0 16px", lineHeight: 1.5, fontSize: "15px" }}>
        Use these quick-reference baking measurement charts to convert cups to
        grams and ounces for the most-searched baking ingredients. Every value
        reflects the density of the ingredient and not a one-size-fits-all
        approximation, so your baking measurements stay precise.
      </p>
      <table
        className="bc-conversion-table"
        style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}
      >
        <caption className="bc-visually-hidden">
          Baking ingredient density chart for cups, ounces, and millilitres
        </caption>
        <thead>
          <tr>
            <th scope="col" style={TD_LEFT}>Ingredient</th>
            <th scope="col" style={TD_RIGHT}>1 US cup in grams</th>
            <th scope="col" style={TD_RIGHT}>1 US cup in ounces</th>
            <th scope="col" style={TD_RIGHT}>240 ml in grams</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </section>
  );
}
