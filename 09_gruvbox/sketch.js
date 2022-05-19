function setup() {
  createCanvas(1920, 1080);
  noLoop();
}

function get_colors() {

  var colors = {
    "red_dark": "#cc241d",
    "orange_dark": "#d65d0e",
    "green_dark": "#98971a",
    "yellow_dark": "#d79921",
    "purple_dark": "#b16286",
    "blue_dark": "#458588",
    "aqua_dark":"#689d6a", 
    "gray_dark": "#7c6f64",
    "bg": "#3c3836",

    "red_light": "#fb4934",
    "orange_light": "#fe8019",
    "green_light": "#b8bb26",
    "yellow_light": "#fabd2f",
    "purple_light": "#d3869b",
    "blue_light": "#83a598",
    "aqua_light":"#8ec07c", 
    "gray_light": "#ebdbb2",
    "fg" : "#fbf1c7",

  };

  var result = {};
  for (color_name in colors){
    result[color_name] = color(colors[color_name]);
  }
  return result;
}

function draw() {
  let colors = get_colors();
  background(colors["bg"]);
  let x = 10 + 500;
  let y = 500;
  let width = 100;
  let height= 100;
  textSize(32);
  let text_color = colors["fg"];
  let text_char = "GRUVBOX!";
  let index = 0;
  for (color_name in colors){
    fill(colors[color_name]);
    rect(x, y, width, height);
    fill(text_color);
    text(text_char[index], x+ width/2 - 15, y+height/2+15);
    x = x + width;
    index += 1;
    if(index % 9 == 0){
      y += height;
      x = 10 + 500;
    }
  }
}
