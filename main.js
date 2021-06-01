//README: This is a P5.JS photobooth in the style of Windows 95 that has capabilities of adding layered filters, and saving screenshots to desktop.

// A global variable for holding the browser input capture instance
let capture;
//Step size for pixel walker filter (anything smaller than this is laggy)
let step = 40;
//Array holding active
let active = [false, false, false, false, false];
//Filter array respective to values in active[] array, so we can toggle them on and off with their index value
let filters = [pixelWalker, invertImage, thresholdImage, posterizeImage, grayImage];
//Define dimensions of canvas (windowWidth and windowHeight didn't seem to scale the video capture correctly, so using hardcoded values instead)
let w = 680;
let h = 600;
//Defining standard height for filter toggle buttons, so they are all aligned
let btnY = 530;

function setup() {
  //Initialize properties of canvas
  createCanvas(w, h);
  noStroke();
  rectMode(CORNER);
  background("#C3C3C3");

  // Instantiate a capture instance for video input (Such as a webcam)
  // This is a P5JS DOM method which creates a html element.
  // The sketch can use the stream from the html element to get video input.
  capture = createCapture(VIDEO);

  //Create HTML H2 heading for a photobooth title
  let header = createElement("h3", "P5.JS Photobooth <3");
  //Define properties and styles of element
  header.position(5, -10);
  header.style("color", "#FFFFFF");
  header.style("font-family", "Courier New, monospace");

  // Hide the HTML5 video element on the page.
  capture.hide();

  //Button that saves screenshot of current capture frame to desktop
  let takeScreenshot = createButton("Take Picture");
  takeScreenshot.position(w - 110, 6);
  takeScreenshot.size(100, 25);
  takeScreenshot.style("background", "#FF3828");
  //Run saveImage function when pressed, executes the functionality for us
  takeScreenshot.mousePressed(saveImage);
  
  //The rest of setup initializes state buttons for each filter (5 total)
  //Pixel Walker Button (manual implementation)
  let pixelWalkerbtn = createButton("Pixel Walker");
  pixelWalkerbtn.position(30, btnY);
  pixelWalkerbtn.size(100, 50);
  pixelWalkerbtn.style("background", "#C3C3C3");
  //In-line function to pass necessary parameters (index of function in filters array, and the     button object itself, so the color can be green on state change)
  pixelWalkerbtn.mousePressed(function () {
    toggleState(0, this);
  });

  //Invert Filter Button
  let invertButton = createButton("Invert Image");
  invertButton.position(160, btnY);
  invertButton.size(100, 50);
  invertButton.style("background", "#C3C3C3");
  invertButton.mousePressed(function () {
    toggleState(1, this);
  });

  //Threshold Filter Button
  let thresholdButton = createButton("Threshold Image");
  thresholdButton.position(290, btnY);
  thresholdButton.size(100, 50);
  thresholdButton.style("background", "#C3C3C3");
  thresholdButton.mousePressed(function () {
    toggleState(2, this);
  });

  //Posterize Filter Button
  let posterizeButton = createButton("Posterize Image");
  posterizeButton.position(420, btnY);
  posterizeButton.size(100, 50);
  posterizeButton.style("background", "#C3C3C3");
  posterizeButton.mousePressed(function () {
    toggleState(3, this);
  });
  
  //Grayscale Filter Button
  let grayButton = createButton("Grayscale Image");
  grayButton.position(550, btnY);
  grayButton.size(100, 50);
  grayButton.style("background", "#C3C3C3");
  grayButton.mousePressed(function () {
    toggleState(4, this);
  });
}

function draw() {
  background("#C3C3C3");
  //Initialize the video capture element, drawing webcam input to canvas
  if (capture.loadedmetadata) {
    // The four argument .get() method returns an image object.
    let c = capture.get(0, 0, w, h-120);
    // Draw the captured image
    image(c, 20, 20);
  }

  //Blue navbar, holds header and screenshot button
  fill("#000082");
  rect(3, 3, w-6, 30);
  //Check the active[] array, if any index value == true, run the function in filters[] array   corresponding to same index (like a switchboard)
  for (let i = 0; i < active.length; i++) {
    if (active[i]) {
      filters[i]();
    }
  }
}

//Saves screenshot of webcam input (including filters) to canvas
function saveImage() {
  save('myCanvas.png');
}

//If a filter state button is pressed, toggle its state (either from on => off, or off => on). Change the style of the button background so we can see which filters are active.
function toggleState(index, btn) {
  if (active[index]) {
    active[index] = false;
    btn.style("background", "#C3C3C3");
    btn.style("color", "#000000");
  } else {
    active[index] = true;
    btn.style("background", "#000080");
    btn.style("color", "#FFFFFF")
  }
}

//Take a color sample the width of the step size, and draw it onto the canvas. The amount of rectangles that are drawn makes this very laggy depending on the step size, so it's predefined.
function pixelWalker() {
  for (let y = 30; y < h - 120; y += step) {
    for (let x = 20; x < w - 30; x += step) {
      // The two argument version of the .get() method returns an array.
      // The array contains the RGB and alpha values in that order.
      let myColour = capture.get(x, y);

      // Fill the rectangle with a point sample.
      fill(myColour[0], myColour[1], myColour[2]); //hint: [R] [G] [B]
      rect(x, y, step, step);
    }
  }
}

//Invert the image using P5.JS built-in function.
function invertImage() {
  filter(INVERT);
}

//Threshold image filter using P5.JS built-in function.
function thresholdImage() {
  filter(THRESHOLD);
}

//Posterize the image using P5.JS built-in function.
function posterizeImage() {
  filter(POSTERIZE, 3);
}

//Make the image grayscale using P5.JS built-in function.
function grayImage() {
  filter(GRAY);
}
