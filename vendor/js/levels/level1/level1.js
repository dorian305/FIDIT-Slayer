import { startRendering } 			from "../../render.js";
import { PlayerCharacter } 			from "../../classes/Characters/PlayerCharacter.js";
import { EnemyCharacter } 			from "../../classes/Characters/EnemyCharacter.js";
import { Weapon } 					from "../../classes/Weapons/Weapon.js";
import { Platform } 				from "../../classes/Platform.js";
import { GenericObject }    		from "../../classes/GenericObject.js";
import { OrbOfHealth } 				from "../../classes/Orbs/OrbOfHealth.js";
import { OrbOfRejuvenation } 		from "../../classes/Orbs/OrbOfRejuvenation.js";
import { createSound } 				from "../../functions/createsound.js";
import { spawnFireballs }			from "./fireballs.js";

export function level1(){
	/*
		Initializing level.
	*/
	GENERIC_OBJECTS.length =  		0;					// Emptying array of generic objects
	PLATFORMS.length = 				0;					// Emptying array of platforms
	ENEMIES.length = 				0;					// Emptying array of enemy units
	MISSILES.length = 				0;					// Emptying array of missiles
	EFFECTS.length = 				0;					// Emptying array of effects
	BUTTONS.length = 				0;					// Emptying array of game buttons
	ORBS.length = 					0;					// Emptying array of orbs
	FIREBALLS.length = 				0;					// Emptying array of fireballs
	LEVEL_BEGINNING_EDGE = 			0;					// Setting beginning of the level
	LEVEL_END_EDGE = 				12000;				// Setting end of the level
	INGAME = 						true;				// Setting INGAME flag to true when starting level
	GAME_PAUSED = 					false;				// Setting GAME_PAUSED flag to false when starting level
	CANVAS.width =                  LEVEL_END_EDGE;		// Setting width of the canvas to the level width
	CANVAS.height =                 1000;				// Setting height of the canvas to 1080
	CANVAS_EDGES = {									// Resetting the canvas edge positions
		left: LEVEL_BEGINNING_EDGE,
		right: LEVEL_END_EDGE,
		top: 0,
		bottom: CANVAS.height,
	}
	const ENEMY_SPRITE = {								// Setting sprites for the enemy characters
		idle: {
			left: `${PATH_SPRITES}/Player/PlayerIdleLeft.png`,
			right: `${PATH_SPRITES}/Player/PlayerIdleRight.png`,
		},
		move: {
			left: `${PATH_SPRITES}/Player/PlayerMoveLeft.png`,
			right: `${PATH_SPRITES}/Player/PlayerMoveRight.png`,
		},
		default: `${PATH_SPRITES}/Player/PlayerIdleRight.png`,
	}
	// Clearing all timers
	TIMERS.forEach(timer => {
		if (timer) timer.destroy();
	});
	TIMERS.length = 0;

	/*
		Creating the background image for the level as a generic object with the length of the level.
	*/
	new GenericObject({
		x: 0,
		y: 0,
		w: LEVEL_END_EDGE,
		h: CANVAS.height,
		sprite: {
			default: `${PATH_SPRITES}/Level 1/Background.png`,
		},
	});
	
	/*
		Building the level terrain.
	*/
	Platform.generateRectangle({x: 0, 	 y: 0, 	    w: 100,  h: 1000, sprite: {default: `${PATH_SPRITES}/Level 1/Ground_100x1000.png`}});
	Platform.generateRectangle({x: 100,  y: 900,    w: 450,  h: 100,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_450x100.png`}});
	Platform.generateRectangle({x: 200,  y: 0,  	w: 400,  h: 200,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_400x200.png`}});
	Platform.generateRectangle({x: 200,  y: 200,	w: 50,   h: 600,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_50x600.png`}});
	Platform.generateRectangle({x: 200,  y: 800,	w: 50,   h: 100,  sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x100.png`}, destroyable: true, HP: 10});
	Platform.generateRectangle({x: 600,  y: 150,	w: 1500, h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground_1500x50.png`}});
	Platform.generateRectangle({x: 550,  y: 950,	w: 100,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Spikes_100x50.png`}, killOnTouch: true});
	Platform.generateRectangle({x: 600,  y: 150,	w: 1500, h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground_1500x50.png`}});
	Platform.generateRectangle({x: 2000, y: 100,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundTop_50x50.png`}});
	Platform.generateRectangle({x: 650,  y: 900,	w: 500,  h: 100,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_500x100.png`}});
	Platform.generateRectangle({x: 700,  y: 850,	w: 450,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground_450x50.png`}});
	Platform.generateRectangle({x: 750,  y: 800,	w: 400,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground_400x50.png`}});
	Platform.generateRectangle({x: 1000, y: 750,	w: 150,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground_150x50.png`}});
	Platform.generateRectangle({x: 1050, y: 700,	w: 100,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground_100x50.png`}});
	Platform.generateRectangle({x: 1150, y: 900,	w: 1000, h: 100,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_1000x100.png`}});
	Platform.generateRectangle({x: 1350, y: 750,	w: 700,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground_700x50.png`}});
	Platform.generateRectangle({x: 2300, y: 650,	w: 1750, h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground_1750x50.png`}});
	Platform.generateRectangle({x: 3000, y: 550,	w: 400,  h: 100,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_400x100.png`}});
	Platform.generateRectangle({x: 3175, y: 400,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundTop_50x50.png`}, visible: false});
	Platform.generateRectangle({x: 2875, y: 300,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundTop_50x50.png`}, visible: false});
	Platform.generateRectangle({x: 2575, y: 350,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundTop_50x50.png`}, visible: false});
	Platform.generateRectangle({x: 2300, y: 250,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundTop_50x50.png`}, visible: false});
	Platform.generateRectangle({x: 2150, y: 950,	w: 2100, h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Spikes_2100x50.png`}, killOnTouch: true});
	Platform.generateRectangle({x: 2300, y: 700,	w: 1750, h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Spikes_1750x50.png`}, killOnTouch: true});
	Platform.generateRectangle({x: 4250, y: 0,	    w: 2500, h: 150,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_2500x150.png`}});
	Platform.generateRectangle({x: 4250, y: 900,    w: 2500, h: 100,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_2500x100.png`}});
	Platform.generateRectangle({x: 4750, y: 450,    w: 50,   h: 200,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_50x200.png`}});
	Platform.generateRectangle({x: 4750, y: 650,    w: 1500, h: 100,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_1500x100.png`}});
	Platform.generateRectangle({x: 6900, y: 0,      w: 200,  h: 750,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_200x750.png`}});
	Platform.generateRectangle({x: 6900, y: 950,    w: 200,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground_200x50.png`}});
	Platform.generateRectangle({x: 7250, y: 0,      w: 100,  h: 650,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_100x650.png`}});
	Platform.generateRectangle({x: 7250, y: 900,    w: 800,  h: 100,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_800x100.png`}});
	Platform.generateRectangle({x: 7350, y: 0,      w: 1750, h: 100,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_1750x100.png`}});
	Platform.generateRectangle({x: 8150, y: 300,    w: 150,  h: 700,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_150x700.png`}});
	Platform.generateRectangle({x: 8100, y: 800,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundLeft_50x50.png`}});
	Platform.generateRectangle({x: 8100, y: 650,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundLeft_50x50.png`}});
	Platform.generateRectangle({x: 8100, y: 500,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundLeft_50x50.png`}});
	Platform.generateRectangle({x: 8100, y: 350,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundLeft_50x50.png`}});
	Platform.generateRectangle({x: 8300, y: 400,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundRight_50x50.png`}});
	Platform.generateRectangle({x: 8300, y: 550,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundRight_50x50.png`}});
	Platform.generateRectangle({x: 8300, y: 700,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundRight_50x50.png`}});
	Platform.generateRectangle({x: 8600, y: 100,    w: 250,  h: 300,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_250x300.png`}});
	Platform.generateRectangle({x: 8600, y: 600,    w: 250,  h: 150,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_250x150.png`}});
	Platform.generateRectangle({x: 8600, y: 400,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundLeft_50x50.png`}});
	Platform.generateRectangle({x: 8700, y: 550,    w: 150,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground2_150x50.png`}});
	Platform.generateRectangle({x: 8500, y: 700,    w: 100,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground_100x50.png`}});
	Platform.generateRectangle({x: 8300, y: 900,    w: 550,  h: 100,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_550x100.png`}});
	Platform.generateRectangle({x: 8300, y: 850,	w: 550,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Spikes_550x50.png`}, killOnTouch: true});
	Platform.generateRectangle({x: 8500, y: 750,	w: 350,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Spikes_350x50.png`}, killOnTouch: true});
	Platform.generateRectangle({x: 8550, y: 650,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Spikes_50x50.png`}, killOnTouch: true});
	Platform.generateRectangle({x: 8600, y: 450,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 50});
	Platform.generateRectangle({x: 8600, y: 500,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 50});
	Platform.generateRectangle({x: 8600, y: 550,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 50});
	Platform.generateRectangle({x: 8650, y: 400,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 50});
	Platform.generateRectangle({x: 8650, y: 450,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 50});
	Platform.generateRectangle({x: 8650, y: 500,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 50});
	Platform.generateRectangle({x: 8650, y: 550,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 50});
	Platform.generateRectangle({x: 8700, y: 400,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 50});
	Platform.generateRectangle({x: 8700, y: 450,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 50});
	Platform.generateRectangle({x: 8700, y: 500,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 50});
	Platform.generateRectangle({x: 8750, y: 400,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 50});
	Platform.generateRectangle({x: 8750, y: 450,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 50});
	Platform.generateRectangle({x: 8750, y: 500,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 50});
	Platform.generateRectangle({x: 8800, y: 400,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 50});
	Platform.generateRectangle({x: 8800, y: 450,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 50});
	Platform.generateRectangle({x: 8800, y: 500,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 50});
	Platform.generateRectangle({x: 9050, y: 450,	w: 600,  h: 100,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_600x100.png`}});
	Platform.generateRectangle({x: 9050, y: 400,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundTop_50x50.png`}});
	Platform.generateRectangle({x: 9600, y: 400,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundTop_50x50.png`}});
	Platform.generateRectangle({x: 9850, y: 0,		w: 100,  h: 400,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_100x400.png`}});
	Platform.generateRectangle({x: 9950, y: 0,		w: 2050, h: 150,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_2050x150.png`}});
	Platform.generateRectangle({x: 9950, y: 900,	w: 2050, h: 100,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_2050x100.png`}});
	Platform.generateRectangle({x: 11900, y: 150,	w: 100,  h: 550,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_100x550.png`}});
	Platform.generateRectangle({x: 11950, y: 700,	w: 50,   h: 200,  sprite: {default: `${PATH_SPRITES}/Level 1/WallDestroy_50x200.png`}, destroyable: true, HP: 200});

	/*
		Starting fireball spawning.
	*/
	spawnFireballs();
	
	/*
		Creating player character.
	*/
	PLAYER = new PlayerCharacter({
		x: 125,
		y: 0,
		w: PLAYER_SIZE.w,
		h: PLAYER_SIZE.h,
		jumpHeight: 15,
		jumps: 1,
		movespeed: 5,
		HP: 100.0,
		sprite: {
			idle: {
				left: `${PATH_SPRITES}/Player/PlayerIdleLeft.png`,
				right: `${PATH_SPRITES}/Player/PlayerIdleRight.png`,
			},
			move: {
				left: `${PATH_SPRITES}/Player/PlayerMoveLeft.png`,
				right: `${PATH_SPRITES}/Player/PlayerMoveRight.png`,
			},
			default: `${PATH_SPRITES}/Player/PlayerIdleRight.png`,
		},
		playerName: "Dorian",
		weapon: new Weapon({
			name: "Izanagi",
			damage: 20,
			sound: createSound(`${PATH_AUDIO}/Weapons/Ranged/Izanagi/Fire.mp3`),
			missileSpeed: 15,
			missileSize: {w: 21, h: 10},
			fireEffectSize: {w: 64, h: 64},
			missileSprite: {
				left: `${PATH_SPRITES}/Weapons/Ranged/Izanagi/MissileLeft.png`,
				right: `${PATH_SPRITES}/Weapons/Ranged/Izanagi/MissileRight.png`,
				up: `${PATH_SPRITES}/Weapons/Ranged/Izanagi/MissileUp.png`,
				fire: `${PATH_SPRITES}/Weapons/Ranged/Izanagi/FiredLeft.png`,
			},
		}),
	});
	/*
		Creating enemy characters.
	*/
	// new EnemyCharacter({
	// 	x: 1700,
	// 	y: 650,
	// 	w: PLAYER_SIZE.w,
	// 	h: PLAYER_SIZE.h,
	// 	jumpHeight: 10,
	// 	jumps: 1,
	// 	movespeed: 2,
	// 	HP: 300,
	// 	sprite: ENEMY_SPRITE,
	// 	contactDamage: 18,
	// 	patrolDistance: 300,
	// 	attackCooldown: 3000,
	// });
	/*
		Creating Orb Of Health.
	*/
	new OrbOfHealth({
		x: 600,
		y: 120,
		w: 30,
		h: 30,
		sprite: {
			default: `${PATH_SPRITES}/Orbs/OrbOfHealth.png`,
		},
		HPIncrease: 50,
	});

	/*
		Creating Orbs Of Rejuvenation.
	*/
	const ORB_POSITIONS = [
		{x: 3185, 	y: 250},
		{x: 9610, 	y: 350},
		{x: 10300, 	y: 850},
	];
	ORB_POSITIONS.forEach(orb_position => {
		new OrbOfRejuvenation({
			x: orb_position.x,
			y: orb_position.y,
			w: 30,
			h: 30,
			sprite: {
				default: `${PATH_SPRITES}/Orbs/OrbOfRejuvenation.png`,
			},
			healPercentage: 0.20,
		});
	});

	/*
		After done creating and setting up the level, begin gameplay.
	*/
	startRendering();
}