import { startRendering } 			from "../render.js";
import { PlayerCharacter } 			from "../classes/characters/PlayerCharacter.js";
import { EnemyCharacter } 			from "../classes/characters/EnemyCharacter.js";
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
	CHARACTERS.length = 			0;
	BUTTONS.length = 				0;
	LEVEL_BEGINNING_EDGE = 			0;
	LEVEL_END_EDGE = 				12000;
	INGAME = 						true;
	GAME_PAUSED = 					false;
	/*
		Setting up properties for level design
	*/
	GROUND_PLATFORM_SIZE =    		{w: 50, h: 50}; 								// Ground platform size
	const ground_sprite = 			`${PATH_SPRITES}level1/ground.png`;  			// Terrain sprites
	const ground_level = 			CANVAS.height - GROUND_PLATFORM_SIZE.h;			// Ground level
	const sky_level = 				0;												// Top screen level
	/*
		Setting up enemy properties
	*/
	let ENEMY_SPRITE = 				`${PATH_SPRITES}level1/enemysmall.png`;
	let ENEMY_SIZE =          		{w: 35, h: 36};

	// Creating background
	new GenericObject({x: 0, y: 0, w: LEVEL_END_EDGE, h: CANVAS.height, sprite: `${PATH_SPRITES}level1/background.png`});
	// Creating terrain
	LEFT_WALL = Platform.createLeftWall({sprite: ground_sprite});
	RIGHT_WALL = Platform.createRightWall({sprite: ground_sprite});
	Platform.generateRectangle({x: GROUND_PLATFORM_SIZE.w, y: ground_level, w: 13, h: 1, sprite: ground_sprite});
	// -
	Platform.generateRectangle({x:  900, y: ground_level,								w: 30, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x:  900, y: sky_level,   							 	w: 2,  h: 4, sprite: ground_sprite});
	Platform.generateRectangle({x:  950, y: sky_level + GROUND_PLATFORM_SIZE.h * 3,     w: 29, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 2300, y: sky_level + GROUND_PLATFORM_SIZE.h * 2,     w: 1,  h: 1, sprite: ground_sprite});
	Platform.generateTriangle({ x:  900, y: ground_level - GROUND_PLATFORM_SIZE.h * 2, 	h: 2, direction: "left", sprite: ground_sprite});
	Platform.generateRectangle({x: 1000, y: ground_level - GROUND_PLATFORM_SIZE.h * 3,  w: 8,  h: 3, sprite: ground_sprite});
	Platform.generateTriangle({ x: 1250, y: ground_level - GROUND_PLATFORM_SIZE.h * 6,	h: 3, direction: "left", sprite: ground_sprite});
	Platform.generateRectangle({x: 1600, y: ground_level - GROUND_PLATFORM_SIZE.h * 3,  w: 12, h: 1, sprite: ground_sprite});
	// -
	Platform.generateRectangle({x: 2500, y: ground_level - GROUND_PLATFORM_SIZE.h * 4,  w: 35, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 3125, y: ground_level - GROUND_PLATFORM_SIZE.h * 6,  w: 10, h: 2, sprite: ground_sprite});
	Platform.generateRectangle({x: 3150, y: ground_level - GROUND_PLATFORM_SIZE.h * 9,  w: 1,  h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 2925, y: ground_level - GROUND_PLATFORM_SIZE.h * 11, w: 1,  h: 1, sprite: ground_sprite, visible: false});
	Platform.generateRectangle({x: 2650, y: ground_level - GROUND_PLATFORM_SIZE.h * 13, w: 1,  h: 1, sprite: ground_sprite, visible: false});
	// -
	Platform.generateRectangle({x: 4500, y: ground_level,								w: 50, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 4500, y: sky_level,									w: 50, h: 3, sprite: ground_sprite});
	Platform.generateRectangle({x: 5000, y: ground_level - GROUND_PLATFORM_SIZE.h * 5,  w: 30, h: 2, sprite: ground_sprite});
	Platform.generateRectangle({x: 5000, y: ground_level - GROUND_PLATFORM_SIZE.h * 9,  w: 1,  h: 4, sprite: ground_sprite});
	Platform.generateTriangle({ x: 6700, y: ground_level - GROUND_PLATFORM_SIZE.h * 3,  h: 3, direction: "right", sprite: ground_sprite});
	// -
	Platform.generateRectangle({x: 7200, y: sky_level,									w: 4, h: 15, sprite: ground_sprite});
	Platform.generateRectangle({x: 7200, y: ground_level,								w: 4, h: 1,  sprite: ground_sprite});
	Platform.generateRectangle({x: 7600, y: sky_level,									w: 2, h: 13, sprite: ground_sprite});
	Platform.generateRectangle({x: 7600, y: ground_level - GROUND_PLATFORM_SIZE.h * 2,  w: 8, h: 1,  sprite: ground_sprite});
	Platform.generateRectangle({x: 7700, y: sky_level,									w: 33, h: 2, sprite: ground_sprite});
	Platform.generateRectangle({x: 8000, y: ground_level - GROUND_PLATFORM_SIZE.h * 3,  w: 8, h: 2,  sprite: ground_sprite});
	Platform.generateRectangle({x: 8050, y: ground_level - GROUND_PLATFORM_SIZE.h * 4,  w: 7, h: 1,  sprite: ground_sprite});
	Platform.generateRectangle({x: 8300, y: ground_level - GROUND_PLATFORM_SIZE.h * 7,  w: 1, h: 1,  sprite: ground_sprite});
	Platform.generateRectangle({x: 8350, y: ground_level - GROUND_PLATFORM_SIZE.h * 10, w: 1, h: 1,  sprite: ground_sprite});
	Platform.generateRectangle({x: 8350, y: ground_level - GROUND_PLATFORM_SIZE.h * 7,  w: 1, h: 1,  sprite: ground_sprite});
	Platform.generateRectangle({x: 8500, y: ground_level - GROUND_PLATFORM_SIZE.h * 13, w: 3, h: 14, sprite: ground_sprite});
	Platform.generateRectangle({x: 8650, y: ground_level - GROUND_PLATFORM_SIZE.h * 9,  w: 1, h: 1,  sprite: ground_sprite});
	Platform.generateRectangle({x: 8650, y: ground_level - GROUND_PLATFORM_SIZE.h * 3,  w: 1, h: 1,  sprite: ground_sprite});
	Platform.generateRectangle({x: 8650, y: ground_level,								w: 11, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 8950, y: sky_level + GROUND_PLATFORM_SIZE.h * 2,     w: 1, h: 6, sprite: ground_sprite});
	Platform.generateRectangle({x: 8950, y: sky_level + GROUND_PLATFORM_SIZE.h * 8,     w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 8950, y: sky_level + GROUND_PLATFORM_SIZE.h * 9,     w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 8950, y: sky_level + GROUND_PLATFORM_SIZE.h * 10,    w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 8950, y: sky_level + GROUND_PLATFORM_SIZE.h * 11,    w: 1, h: 3, sprite: ground_sprite});
	Platform.generateRectangle({x: 8850, y: sky_level + GROUND_PLATFORM_SIZE.h * 13,    w: 2, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 9000, y: sky_level + GROUND_PLATFORM_SIZE.h * 2,     w: 1, h: 6, sprite: ground_sprite});
	Platform.generateRectangle({x: 9000, y: sky_level + GROUND_PLATFORM_SIZE.h * 8,     w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 9000, y: sky_level + GROUND_PLATFORM_SIZE.h * 9,     w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 9000, y: sky_level + GROUND_PLATFORM_SIZE.h * 10,    w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 9000, y: sky_level + GROUND_PLATFORM_SIZE.h * 11,    w: 1, h: 3, sprite: ground_sprite});
	Platform.generateRectangle({x: 9050, y: sky_level + GROUND_PLATFORM_SIZE.h * 2,     w: 1, h: 6, sprite: ground_sprite});
	Platform.generateRectangle({x: 9050, y: sky_level + GROUND_PLATFORM_SIZE.h * 8,     w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 9050, y: sky_level + GROUND_PLATFORM_SIZE.h * 9,     w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 9050, y: sky_level + GROUND_PLATFORM_SIZE.h * 10,    w: 1, h: 4, sprite: ground_sprite});
	Platform.generateRectangle({x: 9100, y: sky_level + GROUND_PLATFORM_SIZE.h * 2,     w: 1, h: 5, sprite: ground_sprite});
	Platform.generateRectangle({x: 9100, y: sky_level + GROUND_PLATFORM_SIZE.h * 7,     w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 9100, y: sky_level + GROUND_PLATFORM_SIZE.h * 8,     w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 9100, y: sky_level + GROUND_PLATFORM_SIZE.h * 9,     w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 9100, y: sky_level + GROUND_PLATFORM_SIZE.h * 10,    w: 1, h: 4, sprite: ground_sprite});
	Platform.generateRectangle({x: 9150, y: sky_level + GROUND_PLATFORM_SIZE.h * 2,     w: 1, h: 5, sprite: ground_sprite});
	Platform.generateRectangle({x: 9150, y: sky_level + GROUND_PLATFORM_SIZE.h * 7,     w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 9150, y: sky_level + GROUND_PLATFORM_SIZE.h * 8,     w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 9150, y: sky_level + GROUND_PLATFORM_SIZE.h * 9,     w: 1, h: 1, sprite: ground_sprite, destroyOnTouch: true});
	Platform.generateRectangle({x: 9150, y: sky_level + GROUND_PLATFORM_SIZE.h * 10,    w: 1, h: 4, sprite: ground_sprite});
	Platform.generateRectangle({x: 9400, y: ground_level - GROUND_PLATFORM_SIZE.h * 8,  w: 12, h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 9400, y: ground_level - GROUND_PLATFORM_SIZE.h * 9,  w: 1,  h: 1, sprite: ground_sprite});
	Platform.generateRectangle({x: 9950, y: ground_level - GROUND_PLATFORM_SIZE.h * 9,  w: 1,  h: 1, sprite: ground_sprite});
	// -
	Platform.generateRectangle({x: 10200, y: sky_level,								    w: 2,  h: 8, sprite: ground_sprite});
	Platform.generateRectangle({x: 10200, y: ground_level,								w: 35,  h: 1, sprite: ground_sprite});
	// -
	/**/
	
	/*
	  Creating player character.
	*/
	PLAYER = new PlayerCharacter({
	  x: 200,
	  y: 200 + PLAYER_SIZE.h,
	  w: PLAYER_SIZE.w,
	  h: PLAYER_SIZE.h,
	  jumpHeight: 13,
	  jumps: 1,
	  movespeed: 8,
	  HP: 100.0,
	  sprite: PLAYER_SPRITE,
	  playerName: "BloodDrunk"
	});
	/*
		Creating enemies
	*/
	new EnemyCharacter({x: 600, y: CANVAS.height - GROUND_PLATFORM_SIZE.h * 3, w: ENEMY_SIZE.w, h: ENEMY_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 10, HP: 50, sprite: ENEMY_SPRITE});
	new OrbOfHealth({x: 500, y: ground_level - 32, w: 32, h: 32, sprite: `${PATH_SPRITES}orbs/orbofheal.png`, HPIncrease: 50});

	// Start the level rendering
	startRendering();
}