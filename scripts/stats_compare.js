import {
  calculateDifference,
  mdCompareRow,
  mdStringValues,
  statsComparisonRow,
} from "./object_compare";

const stats1 = JSON.parse(process.argv[2]);
const stats2 = JSON.parse(process.argv[3]);

const difference = calculateDifference(stats1, stats2);

const diffHeaderRow = [
  "|           | main          | this PR      | change          | % change        |",
  "|-----------|--------------:|-------------:|----------------:|----------------:|",
];

/**
 * Show comparison of overall aggregate statistics between this PR and previous
 */

const pctFormat = {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
};

const layersRow = mdCompareRow(
  "Layers",
  stats1.layerCount,
  stats2.layerCount,
  difference.layerCount
);

const sizeRow = mdCompareRow(
  "Size (b)",
  stats1.styleSize,
  stats2.styleSize,
  difference.styleSize
);

const summaryChangeTable = [...diffHeaderRow, layersRow, sizeRow].join("\n");

const summaryChange = `

## Style size statistics

${summaryChangeTable}
`;

console.log(summaryChange);

/**
 * Show comparison of the number of layers in each group before and after
 */

const layerCountChangeRows = [];

for (const layer in difference.layerGroup) {
  const stats1LayerCount = stats1.layerGroup[layer]?.layerCount || 0;
  const stats2LayerCount = stats2.layerGroup[layer]?.layerCount || 0;
  const differenceLayerCount = difference.layerGroup[layer].layerCount;
  const percentageChange = differenceLayerCount / stats1LayerCount;

  const row = [
    layer,
    stats1LayerCount.toLocaleString("en"),
    stats2LayerCount.toLocaleString("en"),
    differenceLayerCount.toLocaleString("en"),
    percentageChange.toLocaleString("en", pctFormat),
  ];

  layerCountChangeRows.push(row);
}

const layerCountChangeTable = [
  ...diffHeaderRow,
  ...layerCountChangeRows.map((row) => row.join(" | ")),
].join("\n");

const layerCountChange = `

## Layer count comparison

${layerCountChangeTable}
`;

console.log(layerCountChange);

/**
 * Show comparison of the aggregate size of layers in each group before and after
 */

const layerSizeChangeRows = [];

for (const layer in difference.layerGroup) {
  const stats1LayerSize = stats1.layerGroup[layer]?.size || 0;
  const stats2LayerSize = stats2.layerGroup[layer]?.size || 0;
  const differenceLayerSize = difference.layerGroup[layer].size;

  const percentageChange =
    stats1LayerSize !== 0 ? differenceLayerSize / stats1LayerSize : 0;

  const row = [
    layer,
    stats1LayerSize.toLocaleString("en"),
    stats2LayerSize.toLocaleString("en"),
    differenceLayerSize.toLocaleString("en"),
    percentageChange.toLocaleString("en", pctFormat),
  ];

  layerSizeChangeRows.push(row);
}

const layerSizeChangeTable = [
  ...diffHeaderRow,
  ...layerSizeChangeRows.map((row) => row.join(" | ")),
].join("\n");

const layerSizeChange = `

## Layer size comparison

${layerSizeChangeTable}
`;

console.log(layerSizeChange);
