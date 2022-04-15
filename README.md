# Two-Link Manipulator Simulation

Web Application of Two-Link Manipulator Simulation

URL: <https://muneue-suwa.github.io/two-link-manipulator-simulation/>

## Simulator Settings

```javascript:manipultor-settings
/**
 * --------------------
 * MANIPULATOR SETTINGS
 * --------------------
 */
// Instance of Manipulator()
const manipulator = new Manipulator(te=15, dt=1/100);
// Target coordinate and allowable error
const targetXY = [1.2, -0.8];
const allowableError = 0.03;
// FPS of simulator
const fps = 60;
/**
 * --------------------
 */
```
