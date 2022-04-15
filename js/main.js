// Input: Open torque file
const torqueFileInput = document.getElementById('torque-file');
// Buttons: Start and reset the simulator
const startSimulatorBtn = document.getElementById('start-simulator');
const resetSimulatorBtn = document.getElementById('reset-simulator');
// Button: Show or hide target
const showTargetBtn = document.getElementById('show-target');
// Button: Save simulator canvas
const saveSimulatorBtn = document.getElementById('save-simulator');
// Div: Elapsed time of simulation
const elapsedTimeDiv = document.getElementById('elapsed-time');
// Progress of simulation
const simulationProgress = document.getElementById('simulation-progress');
// Div: Canvas holder
const canvasHolderDivId = 'canvas-holder';
const canvasHolderDiv = document.getElementById(canvasHolderDivId);
// Div: footer
const footerDiv = document.getElementById('footer');

/**
 * ------------------
 * SIMULATOR SETTINGS
 * ------------------
 */
// Instance of Manipulator()
const manipulator = new Manipulator(te=15, dt=1/100);
// Target coordinate and allowable error
const targetXY = [1.2, -0.8];
const allowableError = 0.03;
// FPS of simulator
const fps = 60;
// Background color of simulator canvas
const BACKGROUND_COLOR = 240;
/**
 * ------------------
 */

/**
 * ----------------
 * GLOABL VARIABLES
 * ----------------
 */
let coordinates; // Instance of CoordinatesConverter()
let startTime; // Record start time of simulation

let xy1Array; // Manipulator coordinate: [[x1, y1], ...]
let xy2Array; // Manipulator coordinate: [[x2, y2], ...]

let doDraw = false; // Do or do not execute draw()
let count = 0; // Count frame of simulator for draw()
let frameNum; // Frame number of simulator
let doShowTarget = 0; // Do or do not show target coordinate

// Get p5.js canvas size and calculate pixel-coordinate ratio
let canvasSize = getCanvasSize(); // Canvas size: [canvasWidth, canvasHeight]
// Half of min(canvasWidth, canvasHeight) / manipulator arm full length
let pixelRatio;
/**
 * ----------------
 */

// Torque array read from csv file
const torqueArray = [];
// When torque is selected, format data and assign them to torqueArray
torqueFileInput.addEventListener('change', (e) => {
  // Blob interface of the selected file
  const file = e.target.files;
  // Read text data
  file[0].text().then((text) => {
    // Split text with newline characters (\n for macOS or \r\n for Windows OS)
    const lines = text.split(/\n|\r\n/);
    // Read lines
    let isFirstLine = true;
    for (const line of lines) {
      if (isFirstLine === true) {
        // When the firt line, continue
        isFirstLine = false;
        continue;
      } else if (line.length === 0) {
        // When the end line, break
        break;
      }
      // Split line and convert the strings to torque number array
      const torqueStr = line.split(',');
      const torque = [parseFloat(torqueStr[0]), parseFloat(torqueStr[1])];
      // Add the converted torque array to torqueArray
      torqueArray.push(torque);
    }
    // Enable start simulation button
    startSimulatorBtn.disabled = false;
  });
});

// When start simulation button is clicked, start simulation
startSimulatorBtn.addEventListener('click', () => {
  // Calculate manipulator coordinate per frame
  [xy1Array, xy2Array] = manipulator.calcPositionPerFrame(torqueArray, fps);
  // Get frame number
  frameNum = xy1Array.length;
  // Check and disable start simulator button
  startSimulatorBtn.checked = true;
  startSimulatorBtn.disabled = true;

  // Get start time of simulation
  startTime = Date.now();
  // Start animation of progress bar
  simulationProgress.classList.add('progress-bar-striped');
  simulationProgress.classList.add('progress-bar-animated');
  // Start loop of draw()
  doDraw = true;
  loop();
});

// When reset simulation button is clicked, reset simulation
resetSimulatorBtn.addEventListener('click', () => {
  resetSimulator();
  // Disable start simulatior button
  startSimulatorBtn.disabled = false;
});

// When show target button is clicked, show or hide target position
showTargetBtn.addEventListener('click', () => {
  // Switch show or hide target position
  doShowTarget = 1 - doShowTarget;
  if (doShowTarget > 0) {
    // Activate show target button
    showTargetBtn.checked = true;
  } else {
    // Dectivate show target button
    showTargetBtn.checked = false;
  }
  if (doDraw != true) {
    // When draw() does not loop, execute draw() once
    draw();
  }
});

// When window is resized,
// notice that canvas can be resized by reloading page only once
window.addEventListener('resize', () => {
  alert('If you want to resize simulator, RELOAD THIS WINDOW.');
}, {once: true});

/**
 * Reset simulator
 */
function resetSimulator() {
  // Resize p5.js canvas
  canvasSize = getCanvasSize();
  resizeCanvas(canvasSize[0], canvasSize[1]);
  pixelRatio = manipulator.calcPixelRatio(canvasSize);
  coordinates = new CoordinatesConverter(
      canvasSize[0] / 2, canvasSize[1] / 2, pixelRatio,
  );

  // Uncheck and disable reset simulator button
  resetSimulatorBtn.checked = false;
  resetSimulatorBtn.disabled = true;

  // Uncheck show target button and disable doShowTarget
  showTargetBtn.checked = false;
  doShowTarget = 0;

  // Reset elapsed time and progress bar
  elapsedTimeDiv.textContent = 'Time (sec): 0';
  simulationProgress.setAttribute('style', 'width: 0%;');
  simulationProgress.ariaValueNow = '0';

  // Reset count of frame and canvas
  count = 0;
  background(BACKGROUND_COLOR);
  redraw();
}

/**
 * Setup function executed by p5.js
 */
function setup() { // eslint-disable-line no-unused-vars
  const simulationCanvas = createCanvas(canvasSize[0], canvasSize[1]);
  simulationCanvas.parent(canvasHolderDivId);
  resetSimulator();
  frameRate(fps);
  console.log('start:', new Date());
  background(BACKGROUND_COLOR);
  noLoop();

  saveSimulatorBtn.addEventListener('click', () => {
    saveCanvas(simulationCanvas, 'result', 'png');
  });
}

/**
 * Draw function executed by p5.js
 *
 * @return {Number} Return 0 when draw() must not be executed.
 */
function draw() {
  background(240);
  if (doShowTarget > 0) {
    drawTarget();
  }
  if (doDraw != true) {
    if (count === 0) {
      drawManipulator(
          [manipulator.initX1, manipulator.initY1],
          [manipulator.initX2, manipulator.initY2],
      );
    } else {
      drawManipulator(xy1Array[count], xy2Array[count]);
    }
    return 0;
  }
  drawManipulator(xy1Array[count], xy2Array[count]);
  const currentTime = (Date.now() - startTime) / 1000;

  const progress = count * 100 / (frameNum - 1);
  elapsedTimeDiv.textContent = `Time (sec): ${currentTime}`;
  simulationProgress.setAttribute('style', `width: ${progress}%;`);
  simulationProgress.ariaValueNow = `${progress}`;

  if (count === frameNum - 1) {
    doDraw = false;
    noLoop();
    console.log('end:', new Date());
    elapsedTimeDiv.textContent += ' Completed!';
    simulationProgress.setAttribute('style', `width: 100%;`);
    simulationProgress.ariaValueNow = '100';
    simulationProgress.classList.remove('progress-bar-striped');
    simulationProgress.classList.remove('progress-bar-animated');
    startSimulatorBtn.checked = false;
    resetSimulatorBtn.disabled = false;
  } else {
    count += 1;
  }
}

/**
 * Draw target coordinate
 */
function drawTarget() {
  strokeWeight(1);
  // console.log(doShowTarget);
  stroke(200, 50, 50);
  coordinates.circle(targetXY[0], targetXY[1], allowableError * 2);
}

/**
 * Draw manipulator from [x1, y1] and [x2, y2]
 *
 * @param {Array} xy1 [x1, y1]
 * @param {Array} xy2 [x2, y2]
 */
function drawManipulator(xy1, xy2) {
  strokeWeight(1);
  stroke(0, 0, 0);
  coordinates.drawAxes();
  strokeWeight(5);
  stroke(50, 50, 200);
  coordinates.line(0, 0, xy1[0], xy1[1]);
  stroke(50, 200, 50);
  coordinates.line(xy1[0], xy1[1], xy2[0], xy2[1]);
}

/**
 * Get canvas size of p5.js canvas from HTML elements
 *
 * @return {Array} [canvasWidth, canvasHeight] of p5.js canvas
 */
function getCanvasSize() {
  const canvasWidth = canvasHolderDiv.clientWidth;
  const canvasTop = canvasHolderDiv.getBoundingClientRect().top;
  const footerDivHeight = footerDiv.offsetHeight;
  const simulatorDivTop = canvasTop + window.pageYOffset;
  let canvasHeight = window.innerHeight - simulatorDivTop - footerDivHeight;
  canvasHeight -= 15;
  return [canvasWidth, canvasHeight];
}
