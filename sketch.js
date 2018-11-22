/*
 * Tempest 1
 * © 2018 Owen Graham
 */

let AUTHORS = [
	{ name:"Owen Graham",  role:"Everything" }
];

let timer = 0;

function konami() {
	$("#page").append($("<audio/>")
		.attr("preload", "auto")
		.attr("src", "assets/rickroll.mp3")
		.attr("autoplay", true)
		.attr("id", "rickroll")
	);
	$("#rickroll")[0].currentTime = 43;
}
konami.progress = 0;

function setup() {
	createCanvas(1024, 640);

	$("#copyright").append(" | " + AUTHORS[0].name);
	$("#alt div").html("Loading game...");
	$("canvas").appendTo("#page");
	$("#footer").appendTo("#page");

	konami.code = [
		UP_ARROW,
		UP_ARROW,
		DOWN_ARROW,
		DOWN_ARROW,
		LEFT_ARROW,
		RIGHT_ARROW,
		LEFT_ARROW,
		RIGHT_ARROW,
		66,
		65
	];

	imgBgMenu = loadImage("assets/bg-menu.png");
	imgTitle  = loadImage("assets/title.png");
}

function draw() {
	image(imgBgMenu, 0, 0, 1024, 640);
	image(imgTitle, 192, 60, 640, 360);

	if (timer % 64 < 32 && imgBgMenu) {
		let offset = 3;
		let splash = "COMING SOON";

		textSize(32);
		textFont("Ubuntu Mono");
		textAlign(CENTER);
		fill(0);
		text(splash, width / 2 + offset, 480 + offset);
		fill(255);
		text(splash, width / 2, 480);
	}

	if (keyIsPressed) {
		if (keyIsDown(konami.code[konami.progress])) {
			konami.progress++;
		} else if (keyIsDown(konami.code[konami.progress - 1])) {
			// nothing
		} else {
			konami.progress = 0;
		}
	}
	if (konami.progress >= konami.code.length) {
		konami();
		konami.progress = 0;
	}

	timer++;
}
