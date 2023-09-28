const Bad = {
  name: "quality.bad",
  dataset: "bad",
} as const;

const Moderate = {
  name: "quality.moderate",
  dataset: "moderate",
} as const;

const Good = {
  name: "quality.good",
  dataset: "good",
} as const;

const Qualities = [Bad, Moderate, Good];

export type QualityValues = (typeof Qualities)[number]["dataset"];

export default Qualities;
