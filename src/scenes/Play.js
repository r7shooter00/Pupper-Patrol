class Play extends Phaser.Scene
{
	constructor()
	{
		super("playScene");
	}

	preload()
	{
		//load images/tile sprite
		this.load.image('starfield', './assets/starfield.png');
		
		// load spritesheet
		this.load.spritesheet('rocket', './assets/girl.png', {frameWidth: 64, frameHeight: 96, startFrame: 0, endFrame: 4});
		this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 9});
		this.load.spritesheet('spaceship', './assets/spaceship.png', {frameWidth: 80, frameHeight: 48, startFrame: 0, endFrame: 1});
	}

	create()
	{
		//place tile sprite
		this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

		// add rocket (p1)
		this.p1Rocket = new Rocket(this, game.config.width/2 - 8, 350, 'rocket').setOrigin(0, 0);

		keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
  		keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
		keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
		  
		// add spaceships (x3)
  		this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceship', 0, 1).setOrigin(0,0);
  		this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceship', 0, 1).setOrigin(0,0);
  		this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceship', 0, 1).setOrigin(0,0);
		
		// animation config
		this.anims.create({
    		key: 'explode',
    		frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
			frameRate: 10 
		});

		this.anims.create({
			key: 'doggo',
			frames: this.anims.generateFrameNumbers('spaceship', {start: 0, end: 9, first: 0}),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'walking',
			frames: this.anims.generateFrameNumbers('rocket', {start: 0, end: 4, first: 0}),
			frameRate: 10,
			repeat: -1
		});

		// score
		this.p1Score = 0;

		// score display
		this.add.text(60, 54, 'Hugs:');
		this.scoreLeft = this.add.text(120, 54, this.p1Score);
		
		// game over flag
		this.gameOver = false;

		// 60-second play clock
		this.clock = this.time.delayedCall(60000, () => {
    	this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER').setOrigin(0.5);
    	this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or <- for Menu').setOrigin(0.5);
    	this.gameOver = true;
		}, null, this);
	}

	update()
	{
		this.ship01.anims.play('doggo', true);
		this.ship02.anims.play('doggo', true);
		this.ship03.anims.play('doggo', true);

		if(!this.p1Rocket.isFiring)
        {
            if(keyLEFT.isDown && this.p1Rocket.x >= 47)
            {
                this.p1Rocket.anims.play('walking', true);
            }
            else if(keyRIGHT.isDown && this.p1Rocket.x <= 578)
            {
                this.p1Rocket.anims.play('walking', true);
			}
			else
			{
				this.p1Rocket.anims.stop(null, true);
			}
		}
		
		if(this.p1Rocket.isFiring && this.p1Rocket.y >= 108)
        {
            this.p1Rocket.anims.play('walking', true);
		}
		else
		{
			this.p1Rocket.anims.stop(null, true);
		}
		
		// check key input for restart
		if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
			this.scene.restart(this.p1Score);
		}

		if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
		}

		if (!this.gameOver) {               
			this.p1Rocket.update();         // update rocket sprite
			this.ship01.update();           // update spaceships (x3)
			this.ship02.update();
			this.ship03.update();
		}

		// check collisions
		if(this.checkCollision(this.p1Rocket, this.ship03)) 
		{
			this.p1Rocket.visible = false;
			this.shipExplode(this.ship03);
			this.p1Rocket.reset();
  		}
		  
		if (this.checkCollision(this.p1Rocket, this.ship02)) 
		{
			this.p1Rocket.visible = false;
			this.shipExplode(this.ship02);
			this.p1Rocket.reset();
  		}
		if (this.checkCollision(this.p1Rocket, this.ship01)) 
		{
			this.p1Rocket.visible = false;
			this.shipExplode(this.ship01);
			this.p1Rocket.reset();
  		}
	}

	checkCollision(rocket, ship) 
	{
    	// simple AABB checking
    	if (rocket.x < ship.x + ship.width && 
        	rocket.x + rocket.width > ship.x && 
        	rocket.y < ship.y + ship.height &&
			rocket.height + rocket.y > ship. y) 
		{
        	return true;
		}
	
		else 
		{
        	return false;
    	}
	}

	shipExplode(ship) {
        ship.alpha = 0;                         // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
			ship.reset();						// reset ship position                       
            ship.alpha = 1;                     // make ship visible again
			boom.destroy();                     // remove explosion sprite
			this.p1Rocket.visible = true;
		}); 

		// score increment and repaint
		this.p1Score += ship.points;
		this.scoreLeft.text = this.p1Score;   
		this.sound.play('sfx_explosion');
    }
}