  function createSquares() {
    numSquares = gridDimension * gridDimension;
    for (let i = 0; i < numSquares; i++) {
      const square = document.createElement('div');
      square.classList.add('square');
      square.id = i.toString();
      grid.appendChild(square);
    }
  }

  function removeSquares() {
    let elements = document.getElementsByClassName('square');
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
  }

  function calcSizes() {
    gridHeightLimit = window.innerHeight * 0.8;
    gridWidthLimit = window.innerWidth * 0.95;
    gridLimit = gridHeightLimit;
    if (gridLimit > gridWidthLimit) {gridLimit = gridWidthLimit;} // Set grid side-length to less than smallest window dimension (x or y)
    gridSize = gridLimit.toString() + "px";
    headerLimit = Math.floor(gridLimit * 0.2);
    headerHeight = headerLimit.toString() + "px";
    headerWidth = (gridLimit + 8).toString() + "px"; // Add 8px to header width to account for grid drop shadow
    ribbonWidth = (gridLimit + 4).toString() + "px"; // Subtract 4px from ribbon width to account for border
    let rowHeightNum = (gridLimit - (gridDimension - 1))/ gridDimension; // Account for 1px grid-gap
    rowHeight = rowHeightNum.toString() + "px";
    gridColumns = "repeat(" + gridDimension.toString() + ", 1fr)"
  }

  function drawPage() {
    calcSizes();
    document.getElementById('header').style.height = headerHeight;
    document.getElementById('header').style.width = headerWidth;
    document.getElementById('ribbon').style.width = ribbonWidth;
    document.getElementById('grid').style.width = gridSize;
    document.getElementById('grid').style.gridAutoRows = rowHeight;
    document.getElementById('grid').style.gridTemplateColumns = gridColumns;
  }

  function reset() {
    let oldGrid = gridDimension;
    do {
      gridDimension = window.prompt("Change number of squares per side? (16 - 64)", oldGrid), 10;
      if (gridDimension === null) {
        gridDimension = oldGrid;
        return;
      } else {gridDimension = parseInt(gridDimension);}
    } while(isNaN(gridDimension) || gridDimension > 64 || gridDimension < 16);

    removeSquares();
    createSquares();
    drawPage();
    sliderLabelUpdate();
    titleTooltipUpdate()
    squareHoverListen();
  }

  function sliderLabelUpdate() {
    sliderValue = document.getElementById('myRange').value;
    if (sliderValue < 100) {
      sliderDiv.innerHTML = "&nbsp;" + sliderValue + "%";
    } else {
      sliderDiv.innerHTML = sliderValue + "%";
    }
    titleTooltipUpdate()
  }

  function titleTooltipUpdate() {
    let titleElement = document.getElementById('title');
    titleElement.title = `current settings:\ngrid: ${gridDimension} x `
    + `${gridDimension}\nmode: ${mode}\ndraw weight: ${sliderValue}%`;
  }

  function parseRGB(rgbString) {
    let red = "";
    let green = "";
    let blue = "";
    let char = "";
    let color = "";
    let rgbArray = [];

    for (let i = 1; i < 4; i++) { // this code block strips rgb values out of css rgb string (background-color of a 'square' element)
      if (i == 1) {
        rgbString = rgbString.slice(4);
      } else {
        rgbString = rgbString.slice(2);
      }
      char = rgbString.slice(0, 1);
      color = "";
      do {
        color = color + char;
        rgbString = rgbString.slice(1);
        char = rgbString.slice(0, 1);
      } while (char != "," && char != ")");
      if (i == 1) {red = color;}
      else if (i == 2) {blue = color;}
      else {green = color;}
    }

    rgbArray[0] = parseInt(red);
    rgbArray[1] = parseInt(green);
    rgbArray[2] = parseInt(blue);
    return rgbArray;
  }

  function randNum(a) {
    let rand = Math.floor(Math.random() * a);
    return rand;
  }

  function changeColor() {
    let squareID = this.id.toString();
    let element = document.getElementById(squareID);
    let style = window.getComputedStyle(element,"");
    let bgColor = style.getPropertyValue("background-color");
    let rgbValues = parseRGB(bgColor);
    let rgbNewString = "";
    let red = 0;
    let green = 0;
    let blue = 0;

    if (rgbValues[0] === 238 && rgbValues[1] === 238 && rgbValues[2] === 238) { // if 'white', though actually very light grey
      if (mode === "monochrome") {
        let grey = Math.floor(238 - (238 * (sliderValue / 100)));
        rgbNewString = "rgb(" + grey.toString() + ", " + grey.toString() + ", " + grey.toString() + ")";
      } else { // create color square (avoiding very faint colors that tend to grey / brown on darkening)
        let randLimit = (((sliderValue - 10) / 90) * 160) + 78;
        red = Math.floor((238 - randLimit) + (randNum(randLimit + 1)));
        blue = Math.floor((238 - randLimit) + (randNum(randLimit + 1)));
        green = Math.floor((238 - randLimit) + (randNum(randLimit + 1)));
        rgbNewString = "rgb(" + red + ", " + blue + ", " + green + ")";
      }
    } else {
      red = rgbValues[0];
      green = rgbValues[1];
      blue = rgbValues[2];
      red = Math.floor(red - (238 * (sliderValue / 100)));
      green = Math.floor(green - (238 * (sliderValue / 100)));
      blue = Math.floor(blue - (238 * (sliderValue / 100)));
      if (red < 25) {red = 0;} // err on darker side of rounding errors, with 24 being 10% of lightest possible value of 238 (minimum weight)
      if (red < 25) {red = 0;}
      if (red < 25) {red = 0;}
      rgbNewString = "rgb(" + red + ", " + blue + ", " + green + ")";
    }
    document.getElementById(squareID).style.backgroundColor = rgbNewString;
  }

  function squareHoverListen() {
    squares = document.querySelectorAll('.square');
    squares.forEach(square => square.addEventListener('mouseover', changeColor));
  }

  function toggleMode() {
    if (mode === "monochrome") {
      mode = "color";
    } else {
      mode = "monochrome";
    }
    titleTooltipUpdate()
  }

  let gridDimension = 32;
  let numSquares = 0;
  let gridWidthLimit = 0;
  let gridHeightLimit = 0;
  let gridLimit = 0;
  let rowHeight = "not set";
  let gridSize = "not set";
  let headerLimit = 0;
  let headerHeight = "not set";
  let headerWidth = "not set";
  let ribbonWidth = "not set";
  let gridColumns = "not set";
  let sliderValue = 25;
  let mode = "monochrome";
  let squares = [];

  document.getElementById('myRange').oninput = function() {sliderLabelUpdate()};
  document.getElementById('myRange').onchange = function() {sliderLabelUpdate()};
  sliderDiv = document.getElementById("sliderLabel");
  document.getElementById('myRange').value = sliderValue;
  document.getElementById('toggle').onclick = function() {toggleMode()};

  createSquares();
  drawPage();
  document.getElementById("toggleBox").checked = false;
  sliderLabelUpdate();
  titleTooltipUpdate();
  squareHoverListen();
