const PIXEL_DENSITY = 2;
let theShader;
let canvas;
let capture;

let texture_base;

let texture_A0; let texture_A1; let texture_A2; let texture_A3; let texture_A4; let texture_A5;
let texture_B0; let texture_B1; let texture_B2; let texture_B3; let texture_B4; let texture_B5;
let texture_C0; let texture_C1; let texture_C2; let texture_C3; let texture_C4; let texture_C5;
let texture_D0; let texture_D1; let texture_D2; let texture_D3; let texture_D4; let texture_D5;
let texture_E0; let texture_E1; let texture_E2; let texture_E3; let texture_E4; let texture_E5;

let control = {
	density_texture: 10.0,
	density_picture: 1.0,

	speed_x: 0.05,
	speed_y: 0.05,

	color_ink: [99, 125, 117],
	color_backgroung: [247, 222, 212],
}

var dropDown = {
	selectedOption: '1. Grid',
	options: [
		'1. Grid',
		'2. Cross',
		'3. Circle',
		'4. Pencil',
		'5. Crayon',
	]
};

window.onload = function() {
	var gui = new dat.GUI();
	gui.domElement.id = 'gui';

	let gui_density = gui.addFolder("Density");
	gui_density.open();
	gui_density.add(control, 'density_texture', 1, 20).name("Texture").step(1);
	gui_density.add(control, 'density_picture', 1, 10).name("Picture").step(1);

	let gui_speed = gui.addFolder("Speed");
	gui_speed.open();
	gui_speed.add(control, 'speed_x', -0.2, 0.2).name("X-axis").step(0.01);
	gui_speed.add(control, 'speed_y', -0.2, 0.2).name("Y-axis").step(0.01);
	
	let gui_color = gui.addFolder("Color");
	gui_color.open();
	gui_color.addColor(control, 'color_ink').name("Ink");
	gui_color.addColor(control, 'color_backgroung').name("Backgroung");

	gui.add(dropDown, 'selectedOption', dropDown.options).name("Style");
};

// -------------------- preload -------------------- //

function preload(){
	theShader = loadShader('vert.glsl', 'HW02.frag');

	// texture_base = loadImage("data/data_Monalisa.jpg");
	texture_base = loadImage("data/TheStarryNight.jpg");

	texture_A0 = loadImage("data/1_grid/hatch_0.jpg");
	texture_A1 = loadImage("data/1_grid/hatch_1.jpg");
	texture_A2 = loadImage("data/1_grid/hatch_2.jpg");
	texture_A3 = loadImage("data/1_grid/hatch_3.jpg");
	texture_A4 = loadImage("data/1_grid/hatch_4.jpg");
	texture_A5 = loadImage("data/1_grid/hatch_5.jpg");

	texture_B0 = loadImage("data/2_cross/hatch_0.jpg");
	texture_B1 = loadImage("data/2_cross/hatch_1.jpg");
	texture_B2 = loadImage("data/2_cross/hatch_2.jpg");
	texture_B3 = loadImage("data/2_cross/hatch_3.jpg");
	texture_B4 = loadImage("data/2_cross/hatch_4.jpg");
	texture_B5 = loadImage("data/2_cross/hatch_5.jpg");

	texture_C0 = loadImage("data/3_circle/hatch_0.jpg");
	texture_C1 = loadImage("data/3_circle/hatch_1.jpg");
	texture_C2 = loadImage("data/3_circle/hatch_2.jpg");
	texture_C3 = loadImage("data/3_circle/hatch_3.jpg");
	texture_C4 = loadImage("data/3_circle/hatch_4.jpg");
	texture_C5 = loadImage("data/3_circle/hatch_5.jpg");

	texture_D0 = loadImage("data/4_pencil/hatch_0.jpg");
	texture_D1 = loadImage("data/4_pencil/hatch_1.jpg");
	texture_D2 = loadImage("data/4_pencil/hatch_2.jpg");
	texture_D3 = loadImage("data/4_pencil/hatch_3.jpg");
	texture_D4 = loadImage("data/4_pencil/hatch_4.jpg");
	texture_D5 = loadImage("data/4_pencil/hatch_5.jpg");

	texture_E0 = loadImage("data/5_crayon/hatch_0.jpg");
	texture_E1 = loadImage("data/5_crayon/hatch_1.jpg");
	texture_E2 = loadImage("data/5_crayon/hatch_2.jpg");
	texture_E3 = loadImage("data/5_crayon/hatch_3.jpg");
	texture_E4 = loadImage("data/5_crayon/hatch_4.jpg");
	texture_E5 = loadImage("data/5_crayon/hatch_5.jpg");
}

// -------------------- setup -------------------- //

function setup() {
	pixelDensity(PIXEL_DENSITY);
	// canvas = createCanvas(1000,1000, WEBGL);
	canvas = createCanvas(windowWidth, windowHeight, WEBGL);

	// capture = createCapture(VIDEO);
  	// capture.hide();

	flipImage(texture_base);

	flipImage(texture_A0); flipImage(texture_A1); flipImage(texture_A2); flipImage(texture_A3); flipImage(texture_A4); flipImage(texture_A5);
	flipImage(texture_B0); flipImage(texture_B1); flipImage(texture_B2); flipImage(texture_B3); flipImage(texture_B4); flipImage(texture_B5);
	flipImage(texture_C0); flipImage(texture_C1); flipImage(texture_C2); flipImage(texture_C3); flipImage(texture_C4); flipImage(texture_C5);
	flipImage(texture_D0); flipImage(texture_D1); flipImage(texture_D2); flipImage(texture_D3); flipImage(texture_D4); flipImage(texture_D5);
	flipImage(texture_E0); flipImage(texture_E1); flipImage(texture_E2); flipImage(texture_E3); flipImage(texture_E4); flipImage(texture_E5);

	background(0);
	noStroke();
	shader(theShader);
}

// -------------------- draw -------------------- //

function draw() {
	// flipVideo(capture);
	// flipImage(capture);

	var y = (mouseY - 500) / min(1, windowWidth / windowHeight) + 500;
	
	theShader.setUniform("u_resolution", [width * PIXEL_DENSITY, height * PIXEL_DENSITY]);
	theShader.setUniform("u_mouse", [mouseX * PIXEL_DENSITY, (height-y) * PIXEL_DENSITY]);
  	theShader.setUniform("u_time", millis() / 1000.0);

	theShader.setUniform("u_density_texture", control.density_texture);
	theShader.setUniform("u_density_picture", control.density_picture);

	theShader.setUniform("u_speed_x", control.speed_x);
	theShader.setUniform("u_speed_y", control.speed_y);

	theShader.setUniform("u_color_ink", control.color_ink);
	theShader.setUniform("u_color_background", control.color_backgroung);
	
	theShader.setUniform("u_texture_base", texture_base);
	// theShader.setUniform("u_texture_base", capture);

	if(dropDown.selectedOption == '1. Grid') {
		theShader.setUniform("u_texture_0", texture_A0);
		theShader.setUniform("u_texture_1", texture_A1);
		theShader.setUniform("u_texture_2", texture_A2);
		theShader.setUniform("u_texture_3", texture_A3);
		theShader.setUniform("u_texture_4", texture_A4);
		theShader.setUniform("u_texture_5", texture_A5);
	}
	else if(dropDown.selectedOption == '2. Cross') {
		theShader.setUniform("u_texture_0", texture_B0);
		theShader.setUniform("u_texture_1", texture_B1);
		theShader.setUniform("u_texture_2", texture_B2);
		theShader.setUniform("u_texture_3", texture_B3);
		theShader.setUniform("u_texture_4", texture_B4);
		theShader.setUniform("u_texture_5", texture_B5);
	}
	else if(dropDown.selectedOption == '3. Circle') {
		theShader.setUniform("u_texture_0", texture_C0);
		theShader.setUniform("u_texture_1", texture_C1);
		theShader.setUniform("u_texture_2", texture_C2);
		theShader.setUniform("u_texture_3", texture_C3);
		theShader.setUniform("u_texture_4", texture_C4);
		theShader.setUniform("u_texture_5", texture_C5);
	}
	else if(dropDown.selectedOption == '4. Pencil') {
		theShader.setUniform("u_texture_0", texture_D0);
		theShader.setUniform("u_texture_1", texture_D1);
		theShader.setUniform("u_texture_2", texture_D2);
		theShader.setUniform("u_texture_3", texture_D3);
		theShader.setUniform("u_texture_4", texture_D4);
		theShader.setUniform("u_texture_5", texture_D5);
	}
	else if(dropDown.selectedOption == '5. Crayon') {
		theShader.setUniform("u_texture_0", texture_E0);
		theShader.setUniform("u_texture_1", texture_E1);
		theShader.setUniform("u_texture_2", texture_E2);
		theShader.setUniform("u_texture_3", texture_E3);
		theShader.setUniform("u_texture_4", texture_E4);
		theShader.setUniform("u_texture_5", texture_E5);
	}
	
	rect(width * -0.5, height * -0.5, width, height);
}

// -------------------- windowResized -------------------- //

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

// -------------------- keyPressed -------------------- //

function keyPressed() {
	if (keyCode == ESCAPE) { dat.GUI.toggleHide(); }
}

// -------------------- flipImage -------------------- //

function flipImage(img) {
	img.loadPixels();

	let w = img.width;
	let h = img.height;

	let flippedPixels = new Uint8Array(4 * w * h);
  
	for (let y = 0; y < h; y++) {
	  for (let x = 0; x < w; x++) {
		let index = (y * w + x) * 4;
		let flippedIndex = ((h - y - 1) * w + x) * 4;

		flippedPixels[flippedIndex] = img.pixels[index]; // Red
		flippedPixels[flippedIndex + 1] = img.pixels[index + 1]; // Green
		flippedPixels[flippedIndex + 2] = img.pixels[index + 2]; // Blue
		flippedPixels[flippedIndex + 3] = img.pixels[index + 3]; // Alpha
	  }
	}
  
	img.pixels.set(flippedPixels);
	img.updatePixels();
}

// -------------------- flipVideo -------------------- //

function flipVideo(video) {
	video.loadPixels();
  
	let flippedPixels = new Uint8Array(video.pixels);
  
	for (let y = 0; y < video.height; y++) {
	  for (let x = 0; x < video.width; x++) {
		let index = (x + y * video.width) * 4;
  
		let flippedIndex = ((video.width - 1 - x) + y * video.width) * 4;
  
		flippedPixels[flippedIndex] = video.pixels[index];
		flippedPixels[flippedIndex + 1] = video.pixels[index + 1];
		flippedPixels[flippedIndex + 2] = video.pixels[index + 2];
		flippedPixels[flippedIndex + 3] = video.pixels[index + 3];
	  }
	}
  
	video.pixels.set(flippedPixels);
	video.updatePixels();
}
