// Prismodell – Målerioffert
// All logic matches Prismodell.xlsx exactly

export interface QuoteInput {
  wallsAreaM2: number;
  ceilingAreaM2: number;
  ceilingHeightM: number;
  scope: "Väggar" | "Väggar+Tak";
  zone: "Zon A" | "Zon B" | "Zon C";
  substrate: "Målad vägg (gips/puts)" | "Tapet" | "Betong/tegel" | "Träpanel";
  wallpaperAction: "Måla på" | "Tapet bort";
  condition: "Bra" | "Normal" | "Dåligt";
  furnishing: "Tomt" | "Halvmöblerat" | "Fullt";
  colorChange: "Ljust→ljust" | "Mörkt→ljust" | "Ljust→mörkt" | "Uppfräschning";
  coats: "Auto" | "1" | "2" | "3";
  quality: "Budget" | "Standard" | "Premium";
  materialProvidedBy: "Målare" | "Kund";
  rotEnabled: "Ja" | "Nej";
  rotPercent: number; // 0–0.30
}

export interface QuoteOutput {
  totalAreaM2: number;
  coatsNumeric: number;
  laborBeforeROT: number;
  rotDeduction: number;
  laborAfterROT: number;
  materialCost: number;
  travelCost: number;
  totalBeforeROT: number;
  totalAfterROT: number;
  pricePerM2BeforeROT: number;
  pricePerM2AfterROT: number;
}

// --- Constants ---
const BASE_LABOR_PER_M2 = 280;
const BASE_MATERIAL_PER_COAT_PER_M2 = 35;
const HEIGHT_SURCHARGE_PER_03M = 0.05;

const TRAVEL_COST: Record<string, number> = {
  "Zon A": 500,
  "Zon B": 900,
  "Zon C": 1300,
};

const COLOR_CHANGE: Record<string, { autoCoats: number; factor: number }> = {
  "Ljust→ljust": { autoCoats: 2, factor: 1.0 },
  "Mörkt→ljust": { autoCoats: 3, factor: 1.15 },
  "Ljust→mörkt": { autoCoats: 2, factor: 1.05 },
  "Uppfräschning": { autoCoats: 1, factor: 0.9 },
};

const SUBSTRATE_FACTOR: Record<string, number> = {
  "Målad vägg (gips/puts)": 1.0,
  "Tapet": 1.05,
  "Betong/tegel": 1.1,
  "Träpanel": 1.1,
};

const WALLPAPER_ACTION_FACTOR: Record<string, number> = {
  "Måla på": 1.0,
  "Tapet bort": 1.35,
};

const CONDITION_FACTOR: Record<string, number> = {
  "Bra": 0.9,
  "Normal": 1.0,
  "Dåligt": 1.35,
};

const FURNISHING_FACTOR: Record<string, number> = {
  "Tomt": 0.95,
  "Halvmöblerat": 1.0,
  "Fullt": 1.15,
};

const QUALITY_FACTOR: Record<string, number> = {
  "Budget": 0.85,
  "Standard": 1.0,
  "Premium": 1.25,
};

export function calculateQuote(input: QuoteInput): QuoteOutput {
  // 1) Total area
  const totalAreaM2 =
    input.wallsAreaM2 + (input.scope === "Väggar+Tak" ? input.ceilingAreaM2 : 0);

  // 2) Number of coats
  const coatsNumeric =
    input.coats === "Auto"
      ? COLOR_CHANGE[input.colorChange].autoCoats
      : parseInt(input.coats, 10);

  // 3) Substrate factor (incl. wallpaper action)
  const factorSubstrate =
    SUBSTRATE_FACTOR[input.substrate] *
    (input.substrate === "Tapet" ? WALLPAPER_ACTION_FACTOR[input.wallpaperAction] : 1);

  // 4-8) Other factors
  const factorCondition = CONDITION_FACTOR[input.condition];
  const factorFurnishing = FURNISHING_FACTOR[input.furnishing];
  const factorHeight =
    1 + Math.max(0, (input.ceilingHeightM - 2.4) / 0.3) * HEIGHT_SURCHARGE_PER_03M;
  const factorColorChange = COLOR_CHANGE[input.colorChange].factor;
  const factorQuality = QUALITY_FACTOR[input.quality];

  // 9) Combined factors
  const totalFactorLabor =
    factorSubstrate * factorCondition * factorFurnishing * factorHeight * factorColorChange;
  const totalFactorMaterial = factorSubstrate * factorColorChange * factorQuality;

  // 11-17) Costs
  const laborBeforeROT = BASE_LABOR_PER_M2 * totalFactorLabor * totalAreaM2;

  const materialCost =
    input.materialProvidedBy === "Kund"
      ? 0
      : BASE_MATERIAL_PER_COAT_PER_M2 * coatsNumeric * totalAreaM2 * totalFactorMaterial;

  const travelCost = TRAVEL_COST[input.zone];

  const rotDeduction =
    input.rotEnabled === "Ja" ? laborBeforeROT * input.rotPercent : 0;

  const laborAfterROT = laborBeforeROT - rotDeduction;

  const totalBeforeROT = laborBeforeROT + materialCost + travelCost;
  const totalAfterROT = laborAfterROT + materialCost + travelCost;

  const pricePerM2BeforeROT = totalAreaM2 > 0 ? totalBeforeROT / totalAreaM2 : 0;
  const pricePerM2AfterROT = totalAreaM2 > 0 ? totalAfterROT / totalAreaM2 : 0;

  return {
    totalAreaM2,
    coatsNumeric,
    laborBeforeROT: Math.round(laborBeforeROT),
    rotDeduction: Math.round(rotDeduction),
    laborAfterROT: Math.round(laborAfterROT),
    materialCost: Math.round(materialCost),
    travelCost,
    totalBeforeROT: Math.round(totalBeforeROT),
    totalAfterROT: Math.round(totalAfterROT),
    pricePerM2BeforeROT: Math.round(pricePerM2BeforeROT * 10) / 10,
    pricePerM2AfterROT: Math.round(pricePerM2AfterROT * 10) / 10,
  };
}
