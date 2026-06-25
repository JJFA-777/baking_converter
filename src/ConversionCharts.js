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

function ozFromGrams(g) {
  return Math.round((g / G_PER_OZ) * 10) / 10;
}

function gramsForMl(gpc, ml) {
  return Math.round((gpc / ML_PER_CUP) * ml);
}

export default function ConversionCharts() {
  return (
    <section
      className="bc-conversion-charts"
      aria-labelledby="conversion-charts-heading"
    >
      <h2
        id="conversion-charts-heading"
        className="bc-charts-heading bc-handwriting-title"
      >
        Common Ingredient Conversions
      </h2>
      <p className="bc-charts-description">
        Quick-reference baking measurement charts — cups to grams and ounces for
        the most popular ingredients. Each value reflects the ingredient's actual
        density for precise baking.
      </p>

      <div className="bc-charts-table-wrap">
        <table className="bc-charts-table">
          <caption className="bc-visually-hidden">
            Baking ingredient density chart for cups, ounces, and millilitres
          </caption>
          <thead>
            <tr>
              <th scope="col" className="bc-charts-th bc-charts-th-left">Ingredient</th>
              <th scope="col" className="bc-charts-th bc-charts-th-right">1 cup (g)</th>
              <th scope="col" className="bc-charts-th bc-charts-th-right">1 cup (oz)</th>
              <th scope="col" className="bc-charts-th bc-charts-th-right">240 ml (g)</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.name} className="bc-charts-row">
                <td className="bc-charts-td bc-charts-td-name">{r.name}</td>
                <td className="bc-charts-td bc-charts-td-val">{r.gpc}</td>
                <td className="bc-charts-td bc-charts-td-val">{ozFromGrams(r.gpc)}</td>
                <td className="bc-charts-td bc-charts-td-val">{gramsForMl(r.gpc, 240)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
