// Input: Open torque file
const TORQUE_FILE_INPUT = document.getElementById('torque-file');
// Buttons: Start and reset the simulator
const START_SIMULATOR_BTN = document.getElementById('start-simulator');
const RESET_SIMULATOR_BTN = document.getElementById('reset-simulator');
// Button: Show or hide target
const SHOW_TARGET_BTN = document.getElementById('show-target');
// Button: Save simulator canvas
const SAVE_SIMULATOR_BTN = document.getElementById('save-simulator');
// Div: Elapsed time of simulation
const ELAPSED_TIME_DIV = document.getElementById('elapsed-time');
// Progress of simulation
const SIMULATION_PROGRESS = document.getElementById('simulation-progress');
// Div: Canvas holder
const CANVAS_HOLDER_DIV_ID = 'canvas-holder';
const CANVAS_HOLDER_DIV = document.getElementById(CANVAS_HOLDER_DIV_ID);
// Div: footer
const FOOTER_DIV = document.getElementById('footer');

/**
 * ------------------
 * SIMULATOR SETTINGS
 * ------------------
 */
// Instance of Manipulator()
const te = 8;
const dt = 1/100;
const manipulator = new Manipulator(te, dt, th1=Math.PI, th2=Math.PI);
// Target coordinate and allowable error
const targetXY = [1.2, -0.8];
const allowableError = 0.03;
// FPS of simulator
const fps = 60;

// Color settings: [R, G, B], 0 <= R,G,B <= 255
// Background color of simulator canvas
const BACKGROUND_COLOR = [240, 240, 240];
// Arms color
const ARM_ONE_COLOR = [50, 50, 200];
const ARM_TWO_COLOR = [50, 200, 50];
// Target circle and axes color
const TARGET_COLOR = [200, 50, 50];
const AXES_COLOR = [0, 0, 0];
// Line Weight
const TARGET_LINE_WEIGHT = 1;
const AXES_LINE_WEIGHT = 1;
const ARM_LINE_WEIGHT = 5;
/**
 * ------------------
 */

/**
 * ----------------
 * GLOABL VARIABLES
 * ----------------
 */
let coordinates; // Instance of CoordinatesConverter()

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

// Insert version information in title
document.title += ` ${version}`;

// Torque array read from csv file
let torqueArray;
/**
 * When torque is selected, format data and assign them to torqueArray
 */
TORQUE_FILE_INPUT.addEventListener('change', (e) => {
  // Blob interface of the selected file
  const file = e.target.files;
  // Read text data
  file[0].text().then((text) => {
    // Split text with newline characters (\n for macOS or \r\n for Windows OS)
    const lines = text.split(/\n|\r\n/);
    // Initialize torqueArray
    torqueArray = [];
    // Read lines
    for (const line of lines) {
      if (line.length === 0) {
        // When the end line, break
        break;
      }
      // Split line and convert the strings to torque number array
      const torqueStr = line.split(',');
      const torque = [parseFloat(torqueStr[0]), parseFloat(torqueStr[1])];
      // Add the converted torque array to torqueArray
      torqueArray.push(torque);
    }
    // If torque file has enough torque values, enable start simulation button
    if (manipulator.isEnoughTorqueArray(torqueArray)) {
      START_SIMULATOR_BTN.disabled = false;
      ELAPSED_TIME_DIV.textContent = 'Time (sec): 0';
      ELAPSED_TIME_DIV.style.color = '';
    } else {
      START_SIMULATOR_BTN.disabled = true;
      RESET_SIMULATOR_BTN.disabled = true;
      ELAPSED_TIME_DIV.textContent = 'Has not enough torque values';
      ELAPSED_TIME_DIV.style.color = 'red';
    }
  });
});

/**
 * When start simulation button is clicked, start simulation
 */
START_SIMULATOR_BTN.addEventListener('click', () => {
  // Calculate manipulator coordinate per frame
  [xy1Array, xy2Array] = manipulator.calcPositionPerFrame(torqueArray, fps);
  // Get frame number
  frameNum = xy1Array.length;
  // Check and disable start simulator button
  START_SIMULATOR_BTN.checked = true;
  START_SIMULATOR_BTN.disabled = true;

  // Print start time of simulation
  console.log('start:', new Date()); // Print start datetime
  // Start animation of progress bar
  SIMULATION_PROGRESS.classList.add('progress-bar-striped');
  SIMULATION_PROGRESS.classList.add('progress-bar-animated');
  // Start loop of draw()
  doDraw = true;
  loop();
});

/**
 * When reset simulation button is clicked, reset simulation
 */
RESET_SIMULATOR_BTN.addEventListener('click', () => {
  resetSimulator();
  // Disable start simulatior button
  START_SIMULATOR_BTN.disabled = false;
});

/**
 * When show target button is clicked, show or hide target position
 */
SHOW_TARGET_BTN.addEventListener('click', () => {
  // Switch show or hide target position
  doShowTarget = 1 - doShowTarget;
  if (doShowTarget > 0) {
    // Activate show target button
    SHOW_TARGET_BTN.checked = true;
  } else {
    // Dectivate show target button
    SHOW_TARGET_BTN.checked = false;
  }
  if (doDraw != true) {
    // When draw() does not loop, execute draw() once
    draw();
  }
});

/**
 * When save button is clicked, capture and save simulator canvas
 */
SAVE_SIMULATOR_BTN.addEventListener('click', () => {
  saveCanvas('result', 'png');
});

/**
 * When window is resized,
 * notice that canvas cannot be resized after starting simulation only once
 */
window.addEventListener('resize', () => {
  if (doDraw === false) {
    alert(
        'CAUSION: You cannot resize simulator after starting simulation',
    );
  }
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
  RESET_SIMULATOR_BTN.checked = false;
  RESET_SIMULATOR_BTN.disabled = true;

  // Reset elapsed time and progress bar
  ELAPSED_TIME_DIV.textContent = 'Time (sec): 0';
  SIMULATION_PROGRESS.setAttribute('style', 'width: 0%;');
  SIMULATION_PROGRESS.ariaValueNow = '0';

  // Reset count of frame and canvas
  count = 0;
  background(BACKGROUND_COLOR[0], BACKGROUND_COLOR[1], BACKGROUND_COLOR[2]);
  redraw();
}

/**
 * Setup function executed by p5.js
 */
function setup() { // eslint-disable-line no-unused-vars
  // Create canvas and set the position to div#canvas-holer
  const simulationCanvas = createCanvas(canvasSize[0], canvasSize[1]);
  simulationCanvas.parent(CANVAS_HOLDER_DIV_ID);

  resetSimulator(); // Reset Simulator
  frameRate(fps); // Set framerate of simulator

  // Disable loop because xy1Array, xy2Array are not caluculated
  noLoop();
}

/**
 * Draw function executed by p5.js
 *
 * @return {Number} Return 0 when draw() must not be executed.
 */
function draw() {
  // Fill canvas with BACKGROUND_COLOR
  background(BACKGROUND_COLOR[0], BACKGROUND_COLOR[1], BACKGROUND_COLOR[2]);

  if (doShowTarget > 0) {
    // Draw target position
    drawTarget();
  }

  if (doDraw === false) {
    // When doDraw is false, draw manipulaltor on the moment and return 0
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

  // Draw manipulator
  drawManipulator(xy1Array[count], xy2Array[count]);

  // Calculate elapsed ratio
  const progress = count / (frameNum - 1);

  // Show elapsed time
  const currentTime = progress * te;
  ELAPSED_TIME_DIV.textContent = `Time (sec): ${currentTime.toFixed(3)}`;

  // Show elapsed percentage
  const progressPercentage = progress * 100;
  SIMULATION_PROGRESS.setAttribute('style', `width: ${progressPercentage}%;`);
  SIMULATION_PROGRESS.ariaValueNow = `${progressPercentage}`;

  if (count === frameNum - 1) {
    // When the current frame is the last one, stop simulation
    doDraw = false;
    noLoop();
    // Print end datetime
    console.log('end:', new Date());
    // Show completed message
    ELAPSED_TIME_DIV.textContent += ' Completed!';
    // Stop progress bar
    SIMULATION_PROGRESS.setAttribute('style', `width: 100%;`);
    SIMULATION_PROGRESS.ariaValueNow = '100';
    SIMULATION_PROGRESS.classList.remove('progress-bar-striped');
    SIMULATION_PROGRESS.classList.remove('progress-bar-animated');

    START_SIMULATOR_BTN.checked = false; // Uncheck start simulator button
    RESET_SIMULATOR_BTN.disabled = false; // Deactivate reset simulator button
  } else {
    // Add count of frame
    count += 1;
  }
}

/**
 * Redraw canvas when window is resized
 */
function windowResized() { // eslint-disable-line no-unused-vars
  if (doDraw === false && count === 0) {
    // Resize p5.js canvas
    canvasSize = getCanvasSize();
    resizeCanvas(canvasSize[0], canvasSize[1]);
    pixelRatio = manipulator.calcPixelRatio(canvasSize);
    coordinates = new CoordinatesConverter(
        canvasSize[0] / 2, canvasSize[1] / 2, pixelRatio,
    );

    // Redraw canvas
    background(BACKGROUND_COLOR[0], BACKGROUND_COLOR[1], BACKGROUND_COLOR[2]);
    redraw();
  }
}

/**
 * Draw target coordinate
 */
function drawTarget() {
  strokeWeight(TARGET_LINE_WEIGHT);
  stroke(TARGET_COLOR[0], TARGET_COLOR[1], TARGET_COLOR[2]);
  coordinates.circle(targetXY[0], targetXY[1], allowableError * 2);
}

/**
 * Draw manipulator from [x1, y1] and [x2, y2]
 *
 * @param {Array} xy1 [x1, y1]
 * @param {Array} xy2 [x2, y2]
 */
function drawManipulator(xy1, xy2) {
  // Draw axes
  strokeWeight(AXES_LINE_WEIGHT);
  stroke(AXES_COLOR[0], AXES_COLOR[1], AXES_COLOR[2]);
  coordinates.drawAxes();

  // Draw manipulator
  strokeWeight(ARM_LINE_WEIGHT);
  stroke(ARM_ONE_COLOR[0], ARM_ONE_COLOR[1], ARM_ONE_COLOR[2]);
  coordinates.line(0, 0, xy1[0], xy1[1]);
  stroke(ARM_TWO_COLOR[0], ARM_TWO_COLOR[1], ARM_TWO_COLOR[2]);
  coordinates.line(xy1[0], xy1[1], xy2[0], xy2[1]);
}

/**
 * Get canvas size of p5.js canvas from HTML elements
 *
 * @return {Array} [canvasWidth, canvasHeight] of p5.js canvas
 */
function getCanvasSize() {
  // Calculate canvas width
  const canvasWidth = CANVAS_HOLDER_DIV.clientWidth;

  // Calculate canvas Height
  const canvasTop = CANVAS_HOLDER_DIV.getBoundingClientRect().top;
  const footerDivHeight = FOOTER_DIV.offsetHeight;
  const simulatorDivTop = canvasTop + window.pageYOffset;
  let canvasHeight = window.innerHeight - simulatorDivTop - footerDivHeight;
  // Reduce canvasHeight because canvas is slightly smaller
  // than div#canvas-holder
  canvasHeight -= 15;

  return [canvasWidth, canvasHeight];
}
