class Menu extends Phaser.Scene
{
	constructor()
	{
		super("menuScene");
	}

	preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.mp3');
		this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
		this.load.audio('doggo_music', './assets/pupper_patrol.mp3');
		this.load.image('pupper_portrait', './assets/menu.png');
	}
	
	create()
	{
		let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

		let centerX = game.config.width/2;
		let centerY = game.config.height/2;
		let textSpacer = 192;
		let music = this.sound.add('doggo_music');

		if (this.sound.context.state === 'suspended')
		{
			this.sound.context.resume();
		}

		this.add.image(game.config.width/2, game.config.height/2, 'pupper_portrait');
		this.add.text(centerX, centerY - textSpacer, 'PUPPER PATROL').setOrigin(0.5);
		this.add.text(centerX, centerY + textSpacer - 32, 'Use <--> arrows to move and (F) to run').setOrigin(0.5);
		menuConfig.backgroundColor = '#00FF00';
		menuConfig.color = '#000';
		this.add.text(centerX, centerY + textSpacer + 12, 'Press <- for Easy or -> for Hard').setOrigin(0.5);

		// define keys
		keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
		keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

		music.setLoop(true);
		music.setVolume(1);
		music.play();
	}

	update() 
	{
		if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
		  // easy mode
		  game.settings = {
			spaceshipSpeed: 3,
			gameTimer: 60000    
		  }
		  this.sound.play('sfx_select');
		  this.scene.start("playScene");    
		}
		if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
		  // hard mode
		  game.settings = {
			spaceshipSpeed: 4,
			gameTimer: 45000    
		  }
		  this.sound.play('sfx_select');
		  this.scene.start("playScene");    
		}
	}
}