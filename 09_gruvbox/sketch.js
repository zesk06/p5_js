function setup() {
  createCanvas(1920, 1080);
}

function get_colors() {
  var colors = {
    "red_light": "#cc241d",
    "green_light": "#98971a",
    "yellow_light": "#d79921",
    "blue_light": "#458588",
    "purple_light": "#b16286",
    "aqua_light":"#689d6a", 
    "gray_light": "#7c6f64",
    "fg_dark": "#3c3836",
    "bg0" : "#fbf1c7",

  };
  var result = {};
  for (color_name in colors){
    result[color_name] = color(colors[color_name]);
  }
  return result;
}

function draw() {
  let colors = get_colors();
  background(colors["fg_dark"]);
  let x = 10 + 500;
  let y = 500;
  let width = 100;
  let height= 100;
  textSize(32);
  let text_color = colors["bg0"];
  let text_char = "GRUVBOX!";
  let index = 0;
  for (color_name in colors){
    fill(colors[color_name]);
    rect(x, y, width, height);
    fill(text_color);
    text(text_char[index], x+ width/2 - 15, y+height/2+15);
    x = x + width;
    index += 1;
  }
}
