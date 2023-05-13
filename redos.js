const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');

// Test data
const testInputs = [
  'a',
  'aaaaaaaaaaaaaaaaaaaaaaaaa!',
  'aaaaaaaaaaaaaaaaaaaaaaaaaa!',
  'aaaaaaaaaaaaaaaaaaaaaaaaaaa!',
  'aaaaaaaaaaaaaaaaaaaaaaaaaaaa!',
  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaa!',
  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!',
];

async function benchmark(regexPattern, testInput) {
  const start = process.hrtime.bigint();
  testInput.match(regexPattern);
  const end = process.hrtime.bigint();
  const executionTime = Number(end - start) / 1e9; // Convert to seconds
  return executionTime;
}

const normalRegexPattern = /a+/;
const evilRegexPattern = /^(a+)+$/;

const normalExecutionTimes = [];
const evilExecutionTimes = [];

(async () => {
  for (const testInput of testInputs) {
    const normalExecutionTime = await benchmark(normalRegexPattern, testInput);
    const evilExecutionTime = await benchmark(evilRegexPattern, testInput);
    normalExecutionTimes.push(normalExecutionTime);
    evilExecutionTimes.push(evilExecutionTime);
  }

  // Create the chart
  const width = 800;
  const height = 400;
  const configuration = {
    type: 'line',
    data: {
      labels: testInputs,
      datasets: [
        {
          label: 'Normal Regex',
          data: normalExecutionTimes,
          backgroundColor: 'rgba(0, 123, 255, 0.5)',
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1,
          fill: false,
        },
        {
          label: 'Evil Regex',
          data: evilExecutionTimes,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          fill: false,
        },
      ],
    },
    options: {
      responsive: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Test Inputs',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Execution Time (seconds)',
          },
        },
      },
    },
  };

  const canvasRenderService = new ChartJSNodeCanvas({ width, height });
  const image = await canvasRenderService.renderToBuffer(configuration, 'image/png');

  // Save the image as PNG file
  fs.writeFileSync('image.png', image);
  console.log('Image saved as image.png');
})();
