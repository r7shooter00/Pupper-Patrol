//Goals met:
//Add your own (copyright-free) background music to the Play scene (10)
//Replace the UI borders with new artwork (15)
//Create a new animated sprite for the Spaceship enemies (15)
//Create a new title screen (15)
//Create new artwork for all of the in-game assets (rocket, spaceships, explosion) (25) 

let config = {
	type: Phaser.CANVAS,
	width: 640,
	height: 480,
	scene: [Menu, Play],
};

let game = new Phaser.Game(config);

// define game settings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000    
}

// reserve keyboard vars
let keyF, keyLEFT, keyRIGHT;