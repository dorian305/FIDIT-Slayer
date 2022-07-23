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
import { bossFight }				from "./bossfight.js";
import { stopSound } 				from "../../functions/stopsound.js";

export function level1(){
	/*
		Initializing variables.
	*/
	ENEMIES.length = 0;
	PLATFORMS.length = 0;
	GENERIC_OBJECTS.length = 0;
	BUTTONS.length = 0;
	ORBS.length = 0;
	MISSILES.length = 0;
	FIREBALLS.length = 0;
	EFFECTS.length = 0;
	PLAYER = null;
	DEBUG_MODE = false;
	INGAME = true; 
	GAME_PAUSED = false;
	PLAYER_ENTERED_BOSS_AREA = false;
	BOSS = null;
	BOSS_FIGHT = null;
	BOSS_AREA = {};
	CURRENT_LEVEL = level1;
	LEVEL_BEGINNING_EDGE = 0;
	LEVEL_END_EDGE = 12000;
	BOSS_AREA.left = 10500;
	BOSS_AREA.right = 11800;
	CANVAS_EDGES = {
		left: CANVAS_WRAPPER.getBoundingClientRect().left,
		right: CANVAS_WRAPPER.getBoundingClientRect().right,
		top: CANVAS_WRAPPER.getBoundingClientRect().top,
		bottom: CANVAS_WRAPPER.getBoundingClientRect().bottom,
	};
	CANVAS_GAME.width = LEVEL_END_EDGE; // Setting width of the game canvas to the level width
	CANVAS_GAME.height = 1000;
	BOSS_FIGHT = bossFight; // Saving boss fight function handler to global variable (accessed in gameloop.js)

	/*
		Clearing running timers, if any.
	*/
	TIMERS.forEach(timer => {if (timer) timer.destroy()});
	TIMERS.length = 0;

	/*
		Creating the background image for the level.
	*/
	new GenericObject({
		x: 0,
		y: 0,
		w: CANVAS_GAME.width,
		h: CANVAS_GAME.height,
		sprite: {
			default: `${PATH_SPRITES}/Level 1/Background.jpg`,
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
	Platform.generateRectangle({x: 3175, y: 400,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundTop_50x50.png`}, visible: false, landingOnly: true});
	Platform.generateRectangle({x: 2875, y: 300,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundTop_50x50.png`}, visible: false, landingOnly: true});
	Platform.generateRectangle({x: 2575, y: 350,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundTop_50x50.png`}, visible: false, landingOnly: true});
	Platform.generateRectangle({x: 2300, y: 250,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundTop_50x50.png`}, visible: false, landingOnly: true});
	Platform.generateRectangle({x: 2150, y: 950,	w: 2100, h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Spikes_2100x50.png`}, killOnTouch: true});
	Platform.generateRectangle({x: 2300, y: 700,	w: 1750, h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Spikes_1750x50.png`}, killOnTouch: true});
	Platform.generateRectangle({x: 4250, y: 0,	    w: 2500, h: 150,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_2500x150.png`}});
	Platform.generateRectangle({x: 4250, y: 900,    w: 2500, h: 100,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_2500x100.png`}});
	Platform.generateRectangle({x: 4750, y: 450,    w: 50,   h: 200,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_50x200.png`}});
	Platform.generateRectangle({x: 4800, y: 450,	w: 50, 	 h: 100,  sprite: {default: `${PATH_SPRITES}/Level 1/Spikes_50x100.png`}, killOnTouch: true});
	Platform.generateRectangle({x: 4800, y: 550,	w: 50, 	 h: 100,  sprite: {default: `${PATH_SPRITES}/Level 1/Spikes_50x100.png`}, killOnTouch: true});
	Platform.generateRectangle({x: 5300, y: 500,    w: 200,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground_200x50.png`}});
	Platform.generateRectangle({x: 6050, y: 450,    w: 100,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground_100x50.png`}});
	Platform.generateRectangle({x: 4700, y: 750,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundTop_50x50.png`}, visible: false});
	Platform.generateRectangle({x: 4500, y: 650,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundTop_50x50.png`}, visible: false});
	Platform.generateRectangle({x: 4500, y: 500,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundTop_50x50.png`}, visible: false});
	Platform.generateRectangle({x: 4750, y: 650,    w: 1500, h: 100,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_1500x100.png`}});
	Platform.generateRectangle({x: 6250, y: 650,	w: 50, 	 h: 100,  sprite: {default: `${PATH_SPRITES}/Level 1/Spikes_50x100.png`}, killOnTouch: true});
	Platform.generateRectangle({x: 6900, y: 0,      w: 200,  h: 750,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_200x750.png`}});
	Platform.generateRectangle({x: 6900, y: 950,    w: 200,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground_200x50.png`}});
	Platform.generateRectangle({x: 7250, y: 0,      w: 100,  h: 650,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_100x650.png`}});
	Platform.generateRectangle({x: 7250, y: 900,    w: 800,  h: 100,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_800x100.png`}});
	Platform.generateRectangle({x: 7450, y: 650,    w: 100,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground_100x50.png`}});
	Platform.generateRectangle({x: 7450, y: 500,    w: 100,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground_100x50.png`}});
	Platform.generateRectangle({x: 7450, y: 350,    w: 100,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground_100x50.png`}});
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
	Platform.generateRectangle({x: 8600, y: 450,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 20});
	Platform.generateRectangle({x: 8600, y: 500,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 20});
	Platform.generateRectangle({x: 8600, y: 550,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 20});
	Platform.generateRectangle({x: 8650, y: 400,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 20});
	Platform.generateRectangle({x: 8650, y: 450,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 20});
	Platform.generateRectangle({x: 8650, y: 500,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 20});
	Platform.generateRectangle({x: 8650, y: 550,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 20});
	Platform.generateRectangle({x: 8700, y: 400,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 20});
	Platform.generateRectangle({x: 8700, y: 450,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 20});
	Platform.generateRectangle({x: 8700, y: 500,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 20});
	Platform.generateRectangle({x: 8750, y: 400,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 20});
	Platform.generateRectangle({x: 8750, y: 450,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 20});
	Platform.generateRectangle({x: 8750, y: 500,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 20});
	Platform.generateRectangle({x: 8800, y: 400,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 20});
	Platform.generateRectangle({x: 8800, y: 450,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 20});
	Platform.generateRectangle({x: 8800, y: 500,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundDestroy_50x50.png`}, destroyable: true, HP: 20});
	Platform.generateRectangle({x: 9050, y: 450,	w: 600,  h: 100,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_600x100.png`}});
	Platform.generateRectangle({x: 9050, y: 400,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundTop_50x50.png`}});
	Platform.generateRectangle({x: 9600, y: 400,	w: 50,   h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/GroundTop_50x50.png`}});
	Platform.generateRectangle({x: 9850, y: 0,		w: 100,  h: 400,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_100x400.png`}});
	Platform.generateRectangle({x: 9950, y: 0,		w: 2050, h: 150,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_2050x150.png`}});
	Platform.generateRectangle({x: 9950, y: 900,	w: 2050, h: 100,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_2050x100.png`}});
	Platform.generateRectangle({x: 11900,y: 150,	w: 100,  h: 550,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_100x550.png`}});
	Platform.generateRectangle({x: 9870, y: 950,	w: 100,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground_100x50.png`}});
	Platform.generateRectangle({x: 11950,y: 700,	w: 50,   h: 200,  sprite: {default: `${PATH_SPRITES}/Level 1/WallDestroy_50x200.png`}, destroyable: true, HP: 200});
	Platform.generateRectangle({x: 11900,y: 700,	w: 50,   h: 200,  sprite: {default: `${PATH_SPRITES}/Level 1/Ground_50x200_2.png`}});
	Platform.generateRectangle({x: 10500,y: 750,	w: 200,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground_200x50.png`}, landingOnly: true});
	Platform.generateRectangle({x: 10500,y: 600,	w: 100,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground_100x50.png`}, landingOnly: true});
	Platform.generateRectangle({x: 11600,y: 600,	w: 100,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground_100x50.png`}, landingOnly: true});
	Platform.generateRectangle({x: 11500,y: 750,	w: 200,  h: 50,   sprite: {default: `${PATH_SPRITES}/Level 1/Ground_200x50.png`}, landingOnly: true});

	/*
		Starting fireball spawning.
	*/
	spawnFireballs();
	
	/*
		Creating player character.
	*/
	PLAYER = new PlayerCharacter({
		x: 125,
		y: 600,
		w: PLAYER_SIZE.w,
		h: PLAYER_SIZE.h,
		crouchHeight: 62,
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
			crouch: {
				left: `${PATH_SPRITES}/Player/PlayerCrouchLeft.png`,
				right: `${PATH_SPRITES}/Player/PlayerCrouchRight.png`,
			},
			jump: {
				left: `${PATH_SPRITES}/Player/PlayerJumpLeft.png`,
				right: `${PATH_SPRITES}/Player/PlayerJumpRight.png`,
			},
			fall: {
				left: `${PATH_SPRITES}/Player/PlayerFallLeft.png`,
				right: `${PATH_SPRITES}/Player/PlayerFallRight.png`,
			},
			default: `${PATH_SPRITES}/Player/PlayerIdleRight.png`,
		},
		playerName: "Pobar",
		weapon: new Weapon({
			name: "Izanagi",
			damage: 10,
			sound: createSound(`${PATH_AUDIO}/Weapons/Ranged/Izanagi/Fire.mp3`),
			missileSpeed: 20,
			missileSize: {w: 21, h: 10},
			fireEffectSize: {w: 64, h: 64},
			missileSprite: {
				left: `${PATH_SPRITES}/Weapons/Ranged/Izanagi/MissileLeft.png`,
				right: `${PATH_SPRITES}/Weapons/Ranged/Izanagi/MissileRight.png`,
				up: `${PATH_SPRITES}/Weapons/Ranged/Izanagi/MissileUp.png`,
				fire: {
					left: `${PATH_SPRITES}/Weapons/Ranged/Izanagi/FiredLeft.png`,	
					right: `${PATH_SPRITES}/Weapons/Ranged/Izanagi/FiredRight.png`,
				},
			},
		}),
	});
	
	/*
		Creating enemy characters.
	*/
	// Ranged enemy sprites
	const ENEMY_RANGED = {
		idle: {
			left: `${PATH_SPRITES}/Level 1/Enemies/RottenKauIdleLeft.png`,
			right: `${PATH_SPRITES}/Level 1/Enemies/RottenKauIdleRight.png`,
		},
		move: {
			left: `${PATH_SPRITES}/Level 1/Enemies/RottenKauMoveLeft.png`,
			right: `${PATH_SPRITES}/Level 1/Enemies/RottenKauMoveRight.png`,
		},
		jump: {
			left: `${PATH_SPRITES}/Level 1/Enemies/RottenKauJumpLeft.png`,
			right: `${PATH_SPRITES}/Level 1/Enemies/RottenKauJumpRight.png`,
		},
		fall: {
			left: `${PATH_SPRITES}/Level 1/Enemies/RottenKauFallLeft.png`,
			right: `${PATH_SPRITES}/Level 1/Enemies/RottenKauFallRight.png`,
		},
		fire: {
			left: `${PATH_SPRITES}/Level 1/Enemies/RottenKauFireLeft.png`,
			right: `${PATH_SPRITES}Level 1/Enemies/RottenKauFireRight.png`,
		},
		death: {
			src: `${PATH_SPRITES}/Level 1/Enemies/Death.png`,
			w: 150,
			h: 150,
		},
		default: `${PATH_SPRITES}/Level 1/Enemies/RottenKauIdleRight.png`,
	}
	// Melee enemy sprites
	const ENEMY_MELEE = {
		idle: {
			left: `${PATH_SPRITES}/Level 1/Enemies/ShieldDroneIdleLeft.png`,
			right: `${PATH_SPRITES}/Level 1/Enemies/ShieldDroneIdleRight.png`,
		},
		move: {
			left: `${PATH_SPRITES}/Level 1/Enemies/ShieldDroneMoveLeft.png`,
			right: `${PATH_SPRITES}/Level 1/Enemies/ShieldDroneMoveRight.png`,
		},
		death: {
			src: `${PATH_SPRITES}/Level 1/Enemies/Death.png`,
			w: 150,
			h: 150,
		},
		default: `${PATH_SPRITES}/Level 1/Enemies/ShieldDroneIdleRight.png`,
	}
	// Melee enemies
	const meele_enemy_properties = [
		{x: 950, y: 70, w: 50, h: 58, jumpHeight: 0, jumps: 0, movespeed: 3, seekingMovespeedFactor: 1.5, HP: 50, contactDamage: 15, patrolDistance: 500, attackCooldown: 3000},
		{x: 1650, y: 70, w: 50, h: 58, jumpHeight: 0, jumps: 0, movespeed: 3, seekingMovespeedFactor: 1.5, HP: 50, contactDamage: 15, patrolDistance: 500, attackCooldown: 3000},
		{x: 5400, y: 400, w: 50, h: 58, jumpHeight: 0, jumps: 0, movespeed: 3, seekingMovespeedFactor: 1.5, HP: 50, contactDamage: 15, patrolDistance: 200, attackCooldown: 1000},
		{x: 5550, y: 550, w: 50, h: 58, jumpHeight: 0, jumps: 0, movespeed: 3, seekingMovespeedFactor: 1.5, HP: 50, contactDamage: 15, patrolDistance: 900, attackCooldown: 2000},
		{x: 4625, y: 840, w: 50, h: 58, jumpHeight: 0, jumps: 0, movespeed: 3, seekingMovespeedFactor: 1.5, HP: 50, contactDamage: 5, patrolDistance: 750, attackCooldown: 3000},
		{x: 5375, y: 840, w: 50, h: 58, jumpHeight: 0, jumps: 0, movespeed: 3, seekingMovespeedFactor: 1.5, HP: 50, contactDamage: 5, patrolDistance: 750, attackCooldown: 3000},
		{x: 6375, y: 840, w: 50, h: 58, jumpHeight: 0, jumps: 0, movespeed: 3, seekingMovespeedFactor: 1.5, HP: 50, contactDamage: 5, patrolDistance: 750, attackCooldown: 3000},
		{x: 7000, y: 850, w: 50, h: 58, jumpHeight: 0, jumps: 0, movespeed: 1, seekingMovespeedFactor: 1.5, HP: 50, contactDamage: 5, patrolDistance: 200, attackCooldown: 3000},
		{x: 8225, y: 200, w: 50, h: 58, jumpHeight: 0, jumps: 0, movespeed: 1, seekingMovespeedFactor: 1.5, HP: 50, contactDamage: 5, patrolDistance: 150, attackCooldown: 3000},
		{x: 9350, y: 350, w: 50, h: 58, jumpHeight: 0, jumps: 0, movespeed: 3, seekingMovespeedFactor: 1.5, HP: 50, contactDamage: 5, patrolDistance: 500, attackCooldown: 3000},
	];
	meele_enemy_properties.forEach(prop => {
		new EnemyCharacter({
			x: prop.x - prop.w / 2,
			y: prop.y,
			w: prop.w,
			h: prop.h,
			jumpHeight: prop.jumpHeight,
			jumps: prop.jumps,
			movespeed: prop.movespeed,
			deathSound: `${PATH_AUDIO}/Level 1/EnemyDeath.mp3`,
			seekingMovespeedFactor: prop.seekingMovespeedFactor,
			HP: prop.HP,
			contactDamage: prop.contactDamage,
			patrolDistance: prop.patrolDistance,
			attackCooldown: prop.attackCooldown,
			enemyType: "melee",
			sprite: ENEMY_MELEE,
		});
	});

	// Ranged enemies
	const ranged_enemy_properties = [
		{x: 1700, y: 650, w: PLAYER_SIZE.w, h: PLAYER_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 0, HP: 30, contactDamage: 5, patrolDistance: 1000, attackCooldown: 500, weapon: new Weapon({
			name: "Izazgrabi",
			damage: 10,
			sound: createSound(`${PATH_AUDIO}/Weapons/Ranged/Izazgrabi/Fire.mp3`),
			missileSpeed: 7,
			missileSize: {w: 30, h: 15},
			fireEffectSize: {w: 64, h: 64},
			missileSprite: {
				left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileLeft.png`,
				right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileRight.png`,
				up: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileUp.png`,
				fire: {
					left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredLeft.png`,	
					right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredRight.png`,
				}
			},
		})},
		{x: 3200, y: 450, w: PLAYER_SIZE.w, h: PLAYER_SIZE.h, jumpHeight: 10, jumps: 0, movespeed: 0, HP: 30, contactDamage: 5, patrolDistance: 1750, attackCooldown: 500, weapon: new Weapon({
			name: "Izazgrabi",
			damage: 10,
			sound: createSound(`${PATH_AUDIO}/Weapons/Ranged/Izazgrabi/Fire.mp3`),
			missileSpeed: 7,
			missileSize: {w: 30, h: 15},
			fireEffectSize: {w: 64, h: 64},
			missileSprite: {
				left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileLeft.png`,
				right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileRight.png`,
				up: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileUp.png`,
				fire: {
					left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredLeft.png`,	
					right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredRight.png`,
				}
			},
		})},
		{x: 6100, y: 350, w: PLAYER_SIZE.w, h: PLAYER_SIZE.h, jumpHeight: 0, jumps: 0, movespeed: 0, HP: 30, contactDamage: 5, patrolDistance: 3000, attackCooldown: 500, weapon: new Weapon({
			name: "Izazgrabi",
			damage: 10,
			sound: createSound(`${PATH_AUDIO}/Weapons/Ranged/Izazgrabi/Fire.mp3`),
			missileSpeed: 7,
			missileSize: {w: 30, h: 15},
			fireEffectSize: {w: 64, h: 64},
			missileSprite: {
				left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileLeft.png`,
				right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileRight.png`,
				up: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileUp.png`,
				fire: {
					left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredLeft.png`,	
					right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredRight.png`,
				}
			},
		})},
		{x: 6150, y: 550, w: PLAYER_SIZE.w, h: PLAYER_SIZE.h, jumpHeight: 0, jumps: 0, movespeed: 0, HP: 30, contactDamage: 5, patrolDistance: 2500, attackCooldown: 500, weapon: new Weapon({
			name: "Izazgrabi",
			damage: 10,
			sound: createSound(`${PATH_AUDIO}/Weapons/Ranged/Izazgrabi/Fire.mp3`),
			missileSpeed: 7,
			missileSize: {w: 30, h: 15},
			fireEffectSize: {w: 64, h: 64},
			missileSprite: {
				left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileLeft.png`,
				right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileRight.png`,
				up: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileUp.png`,
				fire: {
					left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredLeft.png`,	
					right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredRight.png`,
				}
			},
		})},
		{x: 7500, y: 550, w: PLAYER_SIZE.w, h: PLAYER_SIZE.h, jumpHeight: 0, jumps: 0, movespeed: 0, HP: 30, contactDamage: 5, patrolDistance: 1500, attackCooldown: 1000, weapon: new Weapon({
			name: "Izazgrabi",
			damage: 10,
			sound: createSound(`${PATH_AUDIO}/Weapons/Ranged/Izazgrabi/Fire.mp3`),
			missileSpeed: 7,
			missileSize: {w: 30, h: 15},
			fireEffectSize: {w: 64, h: 64},
			missileSprite: {
				left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileLeft.png`,
				right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileRight.png`,
				up: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileUp.png`,
				fire: {
					left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredLeft.png`,	
					right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredRight.png`,
				}
			},
		})},
		{x: 7500, y: 400, w: PLAYER_SIZE.w, h: PLAYER_SIZE.h, jumpHeight: 0, jumps: 0, movespeed: 0, HP: 30, contactDamage: 5, patrolDistance: 1500, attackCooldown: 1000, weapon: new Weapon({
			name: "Izazgrabi",
			damage: 10,
			sound: createSound(`${PATH_AUDIO}/Weapons/Ranged/Izazgrabi/Fire.mp3`),
			missileSpeed: 7,
			missileSize: {w: 30, h: 15},
			fireEffectSize: {w: 64, h: 64},
			missileSprite: {
				left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileLeft.png`,
				right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileRight.png`,
				up: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileUp.png`,
				fire: {
					left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredLeft.png`,	
					right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredRight.png`,
				}
			},
		})},
		{x: 7500, y: 250, w: PLAYER_SIZE.w, h: PLAYER_SIZE.h, jumpHeight: 0, jumps: 0, movespeed: 0, HP: 30, contactDamage: 5, patrolDistance: 1500, attackCooldown: 1000, weapon: new Weapon({
			name: "Izazgrabi",
			damage: 10,
			sound: createSound(`${PATH_AUDIO}/Weapons/Ranged/Izazgrabi/Fire.mp3`),
			missileSpeed: 7,
			missileSize: {w: 30, h: 15},
			fireEffectSize: {w: 64, h: 64},
			missileSprite: {
				left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileLeft.png`,
				right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileRight.png`,
				up: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileUp.png`,
				fire: {
					left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredLeft.png`,	
					right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredRight.png`,
				}
			},
		})},
		{x: 9625, y: 300, w: PLAYER_SIZE.w, h: PLAYER_SIZE.h, jumpHeight: 0, jumps: 0, movespeed: 0, HP: 30, contactDamage: 5, patrolDistance: 1200, attackCooldown: 500, weapon: new Weapon({
			name: "Izazgrabi",
			damage: 10,
			sound: createSound(`${PATH_AUDIO}/Weapons/Ranged/Izazgrabi/Fire.mp3`),
			missileSpeed: 7,
			missileSize: {w: 30, h: 15},
			fireEffectSize: {w: 64, h: 64},
			missileSprite: {
				left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileLeft.png`,
				right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileRight.png`,
				up: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileUp.png`,
				fire: {
					left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredLeft.png`,	
					right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredRight.png`,
				}
			},
		})},
	];
	ranged_enemy_properties.forEach(prop => {
		new EnemyCharacter({
			x: prop.x - prop.w / 2,
			y: prop.y,
			w: prop.w,
			h: prop.h,
			jumpHeight: prop.jumpHeight,
			jumps: prop.jumps,
			weapon: prop.weapon,
			movespeed: prop.movespeed,
			deathSound: `${PATH_AUDIO}/Level 1/EnemyDeath.mp3`,
			HP: prop.HP,
			contactDamage: prop.contactDamage,
			patrolDistance: prop.patrolDistance,
			attackCooldown: prop.attackCooldown,
			enemyType: "range",
			sprite: ENEMY_RANGED,
		});
	});

	/*
		Creating Orb Of Health.
	*/
	const ORB_HEALTH_POSITIONS = [
		{x: 600, 	y: 120},
		{x: 6220, 	y: 620},
	];
	ORB_HEALTH_POSITIONS.forEach(orb_position => {
		new OrbOfHealth({
			x: orb_position.x,
			y: orb_position.y,
			w: 30,
			h: 30,
			sprite: {
				default: `${PATH_SPRITES}/Orbs/OrbOfHealth.png`,
			},
			HPIncrease: 10,
		});
	});
		
	/*
		Creating Orbs Of Rejuvenation.
	*/
	const ORB_REJUVENATION_POSITIONS = [
		{x: 3185, 	y: 250},
		{x: 9610, 	y: 200},
	];
	ORB_REJUVENATION_POSITIONS.forEach(orb_position => {
		new OrbOfRejuvenation({
			x: orb_position.x,
			y: orb_position.y,
			w: 30,
			h: 30,
			sprite: {
				default: `${PATH_SPRITES}/Orbs/OrbOfRejuvenation.png`,
			},
			healPercentage: 0.25,
		});
	});
	/*
		Starting level music
	*/
	stopSound(MUSIC);
	MUSIC = createSound(`${PATH_AUDIO}/Level 1/Level1Music.mp3`);
	MUSIC.loop = true;
	MUSIC.play();

	/*
		After done creating and setting up the level, begin gameplay.
	*/
	startRendering();
}