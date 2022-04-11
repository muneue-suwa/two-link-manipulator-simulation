/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
const DATA_COUNT = 7;
const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};

const labels = [0];
const data = {
  labels: labels,
  datasets: [
    {
      label: 'Theta 1',
      data: [0],
      borderColor: 'rgb(75, 192, 192)',
      // backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
    },
    {
      label: 'Theta 2',
      data: [0],
      borderColor: 'rgb(75, 192, 192)',
      // backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
    },
  ],
};

const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  },
};

const myChart = new Chart(
    document.getElementById('myChart'),
    config,
    data,
);

function addData(chart, label, theta1, theta2) {
  chart.data.labels.push(label);
  chart.data.datasets[0].data.push(theta1);
  chart.data.datasets[1].data.push(theta2);
  chart.update();
}
