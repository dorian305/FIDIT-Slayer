import { startRendering } 			from "../render.js";
import { PlayerCharacter } 			from "../classes/Characters/PlayerCharacter.js";
import { EnemyCharacter } 			from "../classes/Characters/EnemyCharacter.js";
import { Platform } 				from "../classes/Platform.js";
import { GenericObject }    		from "../classes/GenericObject.js";
import { OrbOfHealth } 				from "../classes/Orbs/OrbOfHealth.js";
import { OrbOfRejuvenation } 		from "../classes/Orbs/OrbOfRejuvenation.js";

export function level1(){
	/*
		Initializing level.
	*/
	GENERIC_OBJECTS.length =  		0;
	PLATFORMS.length = 				0;
	ENEMIES.length = 				0;
	BULLETS.length = 				0;
	BUTTONS.length = 				0;
	ORBS.length = 					0;
	LEVEL_BEGINNING_EDGE = 			0;
	LEVEL_END_EDGE = 				12000;
	INGAME = 						true;
	GAME_PAUSED = 					false;
	/*
		Setting up properties for level design
	*/
	GROUND_PLATFORM_SIZE =    		{w: 50, h: 50}; 								// Ground platform size
	const ground_sprite = {															// Terrain sprites
		default: `${PATH_SPRITES}level1/ground.png`,
	}
	/*
		Setting up enemy properties
	*/
	let ENEMY_SIZE =          		{w: 50, h: 50};
	let ENEMY_SPRITE = {
		stand: {
			left: `${PATH_SPRITES}level1/enemystandleft.png`,
			right: `${PATH_SPRITES}level1/enemystandright.png`,
		},
		default: `${PATH_SPRITES}level1/enemystandleft.png`
	}

	// Creating background
	new GenericObject({x: 0, y: 0, w: LEVEL_END_EDGE, h: CANVAS.height, sprite: {default: `${PATH_SPRITES}level1/background.png`}});
	
	// Creating terrain
	LEFT_WALL = Platform.createLeftWall({sprite: ground_sprite});
	RIGHT_WALL = Platform.createRightWall({sprite: ground_sprite});
	Platform.generateRectangle({x: 50, y: 1030, w: 10, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 200, y: 0, w: 9, h: 4, sprite: ground_sprite});
	Platform.generateRectangle({x: 650, y: 150, w: 30, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 2050, y: 100, w: 1, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 650, y: 1030, w: 30, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 650, y: 980, w: 10, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 700, y: 930, w: 9, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 750, y: 880, w: 8, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 1000, y: 830, w: 3, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 1050, y: 780, w: 2, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 1100, y: 730, w: 1, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 1350 , y: 880, w: 14, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 2300 , y: 830, w: 35, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 2900 , y: 730, w: 10, h: 2, sprite: ground_sprite});
	Platform.generateRectangle({x: 3125 , y: 580, w: 1, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 2900 , y: 480, w: 1, h: 1, sprite: ground_sprite, visible: false});
	Platform.generateRectangle({x: 2650 , y: 380, w: 1, h: 1, sprite: ground_sprite, visible: false});
	Platform.generateRectangle({x: 2350 , y: 280, w: 1, h: 1, sprite: ground_sprite, visible: false});
	Platform.generateRectangle({x: 4250 , y: 0, w: 50, h: 3, sprite: ground_sprite});
	Platform.generateRectangle({x: 4250 , y: 1030, w: 50, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 4750 , y: 580, w: 1, h: 4, sprite: ground_sprite});
	Platform.generateRectangle({x: 4750 , y: 780, w: 30, h: 2, sprite: ground_sprite});
	Platform.generateTriangle({x: 6450, y: 880, h: 3, direction: "right", sprite: ground_sprite});
	Platform.generateRectangle({x: 6900, y: 0, w: 4, h: 15, sprite: ground_sprite});
	Platform.generateRectangle({x: 6900, y: 1030, w: 4, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 7250, y: 0, w: 2, h: 13, sprite: ground_sprite});
	Platform.generateRectangle({x: 7350, y: 0, w: 35, h: 2, sprite: ground_sprite});
	Platform.generateRectangle({x: 7250, y: 930, w: 16, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 7650, y: 880, w: 8, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 7700, y: 830, w: 7, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 7950, y: 680, w: 2, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 8000, y: 530, w: 1, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 8100, y: 380, w: 3, h: 14, sprite: ground_sprite});
	Platform.generateRectangle({x: 8250, y: 580, w: 1, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 8250, y: 880, w: 1, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 8250, y: 1030, w: 11, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 8500, y: 800, w: 2, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 8600, y: 100, w: 1, h: 9, sprite: ground_sprite});
	Platform.generateRectangle({x: 8600, y: 550, w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 8600, y: 600, w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 8600, y: 650, w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 8600, y: 700, w: 1, h: 3, sprite: ground_sprite});
	Platform.generateRectangle({x: 8650, y: 100, w: 1, h: 8, sprite: ground_sprite});
	Platform.generateRectangle({x: 8650, y: 500, w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 8650, y: 550, w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 8650, y: 600, w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 8650, y: 650, w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 8650, y: 700, w: 1, h: 3, sprite: ground_sprite});
	Platform.generateRectangle({x: 8700, y: 100, w: 1, h: 8, sprite: ground_sprite});
	Platform.generateRectangle({x: 8700, y: 500, w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 8700, y: 550, w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 8700, y: 600, w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 8700, y: 650, w: 1, h: 4, sprite: ground_sprite});
	Platform.generateRectangle({x: 8750, y: 100, w: 1, h: 8, sprite: ground_sprite});
	Platform.generateRectangle({x: 8750, y: 500, w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 8750, y: 550, w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 8750, y: 600, w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 8750, y: 650, w: 1, h: 4, sprite: ground_sprite});
	Platform.generateRectangle({x: 8800, y: 100, w: 1, h: 8, sprite: ground_sprite});
	Platform.generateRectangle({x: 8800, y: 500, w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 8800, y: 550, w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 8800, y: 600, w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 8800, y: 650, w: 1, h: 4, sprite: ground_sprite});
	Platform.generateRectangle({x: 9050, y: 600, w: 12, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 9050, y: 550, w: 1, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 9600, y: 550, w: 1, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 9850, y: 0, w: 2, h: 8, sprite: ground_sprite});
	Platform.generateRectangle({x: 9850, y: 1030, w: 42, h: 1, sprite: ground_sprite});
	/**/
	
	/*
	  Creating player character.
	*/
	PLAYER = new PlayerCharacter({
	  x: 100,
	  y: 0,
	  w: PLAYER_SIZE.w,
	  h: PLAYER_SIZE.h,
	  jumpHeight: 15,
	  jumps: 1,
	  movespeed: 5,
	  HP: 100.0,
	  sprite: {
		  stand: {
			  left: `${PATH_SPRITES}playerstandleft.png`,
			  right: `${PATH_SPRITES}playerstandright.png`,
			},
			default: `${PATH_SPRITES}playerstandright.png`
	  },
	  playerName: "BloodDrunk",
	  attackDamage: 20,
	});
	/*
		Creating enemies
	*/
	new EnemyCharacter({x: 400, y: 978, w: ENEMY_SIZE.w, h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 1000, y: 90, w: ENEMY_SIZE.w, h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 1300, y: 90, w: ENEMY_SIZE.w, h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 1670, y: 90, w: ENEMY_SIZE.w, h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 1150, y: 978, w: ENEMY_SIZE.w, h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 1500, y: 828, w: ENEMY_SIZE.w, h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 1800, y: 828, w: ENEMY_SIZE.w, h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 2400, y: 778, w: ENEMY_SIZE.w, h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 2800, y: 778, w: ENEMY_SIZE.w, h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 3100, y: 678, w: ENEMY_SIZE.w, h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 3400, y: 778, w: ENEMY_SIZE.w, h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 4700, y: 978, w: ENEMY_SIZE.w, h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 4800, y: 728, w: ENEMY_SIZE.w, h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 5350, y: 728, w: ENEMY_SIZE.w, h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 5800, y: 728, w: ENEMY_SIZE.w, h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 5500, y: 978, w: ENEMY_SIZE.w, h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 6700, y: 978, w: ENEMY_SIZE.w, h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 7400, y: 878, w: ENEMY_SIZE.w , h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 8000, y: 778, w: ENEMY_SIZE.w , h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 8000, y: 478, w: ENEMY_SIZE.w , h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 8250, y: 328, w: ENEMY_SIZE.w , h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 9150, y: 550, w: ENEMY_SIZE.w , h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});
	new EnemyCharacter({x: 9500, y: 550, w: ENEMY_SIZE.w , h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 5, HP: 50, contactDamage: 20, attackDamage: 5, sprite: ENEMY_SPRITE});

	/*
		Creating orbs Of Health
	*/
	new OrbOfHealth({
		x: 663,
		y: 120,
		w: 30,
		h: 30,
		sprite: {
			default: `${PATH_SPRITES}orbs/OrbOfHealth.png`
		},
		HPIncrease: 50
	});
	/*
		Creating orbs Of Rejuvenation
	*/
	const ORB_POSITIONS = [
		{x: 3135, y: 492},
		{x: 9613, y: 500},
	];
	ORB_POSITIONS.forEach(orb_position => {
		new OrbOfRejuvenation({
			x: orb_position.x,
			y: orb_position.y,
			w: 30,
			h: 30,
			sprite: {
				default: `${PATH_SPRITES}orbs/OrbOfRejuvenation.png`
			},
			healPercentage: 0.20,
		});
	});

	// Start the level rendering
	startRendering();
}