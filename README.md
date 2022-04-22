# Two-Link Manipulator Simulation

Web Application of Two-Link Manipulator Simulation

## User's Manual for End Users

[エンドユーザ向けの日本語のマニュアル](manual-for-end-users.md)

## Environment

The operation is confirmed in the following environment.

- OS: Windows 10, Windows 11
- Web Browser: Google Chrome, Microsoft Edge

This application does **NOT** support Internet Explorer. The operation in macOS is confirmed, because I do not have Mac computers.

## Usage

### Using GitHub Pages

Access GitHub Pages link: <https://muneue-suwa.github.io/two-link-manipulator-simulation/>

### Using Your HTTP Server

1. Download the released zip file (e.g. release_v.x.x.x; x.x.x is version information) from [releases page](https://github.com/muneue-suwa/two-link-manipulator-simulation/releases).
2. Unzip and upload the file to your server.

## Simulator Settings

Edit *SIMULATION SETTINGS* in [js/main.js](js/main.js).

```javascript
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
...
/**
 * ------------------
 */
```

`Manipulator` class has parameters as follow.

```javascript
class Manipulator { // eslint-disable-line no-unused-vars
  /**
   * Initialize manipulator
   *
   * @param {Number} te Simulation time
   * @param {Number} dt delta-time
   * @param {Number} th1 theta 1
   * @param {Number} th2 theta 2
   * @param {Number} dth1 d theta 1
   * @param {Number} dth2 d theta 2
   * @param {Number} m1 Mass of arm 1
   * @param {Number} m2 Mass of arm 2
   * @param {Number} l1 Length of arm 1
   * @param {Number} l2 Length of arm 2
   * @param {Number} D1 D1
   * @param {Number} D2 D2
   */
  constructor(
      te = 15, dt = 1 / 100,
      th1 = Math.PI / 2, th2 = Math.PI,
      dth1 = 0, dth2 = 0,
      m1 = 1, m2 = 1,
      l1 = 0.5, l2 = 0.3,
      D1 = 3, D2 = 3,
  )
```
