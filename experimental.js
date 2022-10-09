function drawTransition(r, g, b) {
  let r = r;
  let g = g;
  let b = b;

  if (rgbArray['color1'][0] - 1 > rgbArray['color2'][0]) {
    r -= 1;
  }
  if (rgbArray['color1'][1] - 1 > rgbArray['color2'][1]) {
    g -= 1;
  }
  if (rgbArray['color1'][2] - 1 > rgbArray['color2'][2]) {
    b -= 1;
  }
  if (r === rgbArray['color2'][0]) {
    r = rgbArray['color1'][0];
    g = rgbArray['color1'][1]
    b = rgbArray['color1'][2]
  }

  return `rgb(${r}, ${g}, ${b})`
}

if (rectsArray[i].strategy === 'Cu' && rectsArray[i].strategyNew === 'Du') {
  rectsArray[i].strategy = 'wasCu';
}
else if (rectsArray[i].strategy === 'Du' && rectsArray[i].strategyNew === 'Cu') {
  rectsArray[i].strategy = 'wasDu';
}
else if (rectsArray[i].strategy != 'empty') {
  rectsArray[i].strategy = rectsArray[i].strategyNew;
}
rectsArray[i].score = 0;
//rectsArray[i].color = colorDict[rectsArray[i].strategy];
