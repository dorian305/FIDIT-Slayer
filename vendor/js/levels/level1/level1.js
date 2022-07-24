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
	LEVEL_END_EDGE = 9600;
	// BOSS_AREA.left = 10500;
	// BOSS_AREA.right = 11800;
	CANVAS_EDGES = {
		left: CANVAS_WRAPPER.getBoundingClientRect().left,
		right: CANVAS_WRAPPER.getBoundingClientRect().right,
		top: CANVAS_WRAPPER.getBoundingClientRect().top,
		bottom: CANVAS_WRAPPER.getBoundingClientRect().bottom,
	};
	CANVAS_GAME.width = LEVEL_END_EDGE; // Setting width of the game canvas to the level width
	CANVAS_GAME.height = 800;
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
	Platform.generateRectangle({x: 0, y: 750, w: 500, h: 50, color: "blue"});

	/*
		Starting fireball spawning.
	*/
	// spawnFireballs();
	
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
	// const ENEMY_RANGED = {
	// 	idle: {
	// 		left: `${PATH_SPRITES}/Level 1/Enemies/RottenKauIdleLeft.png`,
	// 		right: `${PATH_SPRITES}/Level 1/Enemies/RottenKauIdleRight.png`,
	// 	},
	// 	move: {
	// 		left: `${PATH_SPRITES}/Level 1/Enemies/RottenKauMoveLeft.png`,
	// 		right: `${PATH_SPRITES}/Level 1/Enemies/RottenKauMoveRight.png`,
	// 	},
	// 	jump: {
	// 		left: `${PATH_SPRITES}/Level 1/Enemies/RottenKauJumpLeft.png`,
	// 		right: `${PATH_SPRITES}/Level 1/Enemies/RottenKauJumpRight.png`,
	// 	},
	// 	fall: {
	// 		left: `${PATH_SPRITES}/Level 1/Enemies/RottenKauFallLeft.png`,
	// 		right: `${PATH_SPRITES}/Level 1/Enemies/RottenKauFallRight.png`,
	// 	},
	// 	fire: {
	// 		left: `${PATH_SPRITES}/Level 1/Enemies/RottenKauFireLeft.png`,
	// 		right: `${PATH_SPRITES}Level 1/Enemies/RottenKauFireRight.png`,
	// 	},
	// 	death: {
	// 		src: `${PATH_SPRITES}/Level 1/Enemies/Death.png`,
	// 		w: 150,
	// 		h: 150,
	// 	},
	// 	default: `${PATH_SPRITES}/Level 1/Enemies/RottenKauIdleRight.png`,
	// }
	// // Melee enemy sprites
	// const ENEMY_MELEE = {
	// 	idle: {
	// 		left: `${PATH_SPRITES}/Level 1/Enemies/ShieldDroneIdleLeft.png`,
	// 		right: `${PATH_SPRITES}/Level 1/Enemies/ShieldDroneIdleRight.png`,
	// 	},
	// 	move: {
	// 		left: `${PATH_SPRITES}/Level 1/Enemies/ShieldDroneMoveLeft.png`,
	// 		right: `${PATH_SPRITES}/Level 1/Enemies/ShieldDroneMoveRight.png`,
	// 	},
	// 	death: {
	// 		src: `${PATH_SPRITES}/Level 1/Enemies/Death.png`,
	// 		w: 150,
	// 		h: 150,
	// 	},
	// 	default: `${PATH_SPRITES}/Level 1/Enemies/ShieldDroneIdleRight.png`,
	// }
	// // Melee enemies
	// const meele_enemy_properties = [
	// 	{x: 950, y: 70, w: 50, h: 58, jumpHeight: 0, jumps: 0, movespeed: 3, seekingMovespeedFactor: 1.5, HP: 50, contactDamage: 15, patrolDistance: 500, attackCooldown: 3000},
	// 	{x: 1650, y: 70, w: 50, h: 58, jumpHeight: 0, jumps: 0, movespeed: 3, seekingMovespeedFactor: 1.5, HP: 50, contactDamage: 15, patrolDistance: 500, attackCooldown: 3000},
	// 	{x: 5400, y: 400, w: 50, h: 58, jumpHeight: 0, jumps: 0, movespeed: 3, seekingMovespeedFactor: 1.5, HP: 50, contactDamage: 15, patrolDistance: 200, attackCooldown: 1000},
	// 	{x: 5550, y: 550, w: 50, h: 58, jumpHeight: 0, jumps: 0, movespeed: 3, seekingMovespeedFactor: 1.5, HP: 50, contactDamage: 15, patrolDistance: 900, attackCooldown: 2000},
	// 	{x: 4625, y: 840, w: 50, h: 58, jumpHeight: 0, jumps: 0, movespeed: 3, seekingMovespeedFactor: 1.5, HP: 50, contactDamage: 5, patrolDistance: 750, attackCooldown: 3000},
	// 	{x: 5375, y: 840, w: 50, h: 58, jumpHeight: 0, jumps: 0, movespeed: 3, seekingMovespeedFactor: 1.5, HP: 50, contactDamage: 5, patrolDistance: 750, attackCooldown: 3000},
	// 	{x: 6375, y: 840, w: 50, h: 58, jumpHeight: 0, jumps: 0, movespeed: 3, seekingMovespeedFactor: 1.5, HP: 50, contactDamage: 5, patrolDistance: 750, attackCooldown: 3000},
	// 	{x: 7000, y: 850, w: 50, h: 58, jumpHeight: 0, jumps: 0, movespeed: 1, seekingMovespeedFactor: 1.5, HP: 50, contactDamage: 5, patrolDistance: 200, attackCooldown: 3000},
	// 	{x: 8225, y: 200, w: 50, h: 58, jumpHeight: 0, jumps: 0, movespeed: 1, seekingMovespeedFactor: 1.5, HP: 50, contactDamage: 5, patrolDistance: 150, attackCooldown: 3000},
	// 	{x: 9350, y: 350, w: 50, h: 58, jumpHeight: 0, jumps: 0, movespeed: 3, seekingMovespeedFactor: 1.5, HP: 50, contactDamage: 5, patrolDistance: 500, attackCooldown: 3000},
	// ];
	// meele_enemy_properties.forEach(prop => {
	// 	new EnemyCharacter({
	// 		x: prop.x - prop.w / 2,
	// 		y: prop.y,
	// 		w: prop.w,
	// 		h: prop.h,
	// 		jumpHeight: prop.jumpHeight,
	// 		jumps: prop.jumps,
	// 		movespeed: prop.movespeed,
	// 		deathSound: `${PATH_AUDIO}/Level 1/EnemyDeath.mp3`,
	// 		seekingMovespeedFactor: prop.seekingMovespeedFactor,
	// 		HP: prop.HP,
	// 		contactDamage: prop.contactDamage,
	// 		patrolDistance: prop.patrolDistance,
	// 		attackCooldown: prop.attackCooldown,
	// 		enemyType: "melee",
	// 		sprite: ENEMY_MELEE,
	// 	});
	// });

	// // Ranged enemies
	// const ranged_enemy_properties = [
	// 	{x: 1700, y: 650, w: PLAYER_SIZE.w, h: PLAYER_SIZE.h, jumpHeight: 10, jumps: 1, movespeed: 0, HP: 30, contactDamage: 5, patrolDistance: 1000, attackCooldown: 500, weapon: new Weapon({
	// 		name: "Izazgrabi",
	// 		damage: 10,
	// 		sound: createSound(`${PATH_AUDIO}/Weapons/Ranged/Izazgrabi/Fire.mp3`),
	// 		missileSpeed: 7,
	// 		missileSize: {w: 30, h: 15},
	// 		fireEffectSize: {w: 64, h: 64},
	// 		missileSprite: {
	// 			left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileLeft.png`,
	// 			right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileRight.png`,
	// 			up: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileUp.png`,
	// 			fire: {
	// 				left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredLeft.png`,	
	// 				right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredRight.png`,
	// 			}
	// 		},
	// 	})},
	// 	{x: 3200, y: 450, w: PLAYER_SIZE.w, h: PLAYER_SIZE.h, jumpHeight: 10, jumps: 0, movespeed: 0, HP: 30, contactDamage: 5, patrolDistance: 1750, attackCooldown: 500, weapon: new Weapon({
	// 		name: "Izazgrabi",
	// 		damage: 10,
	// 		sound: createSound(`${PATH_AUDIO}/Weapons/Ranged/Izazgrabi/Fire.mp3`),
	// 		missileSpeed: 7,
	// 		missileSize: {w: 30, h: 15},
	// 		fireEffectSize: {w: 64, h: 64},
	// 		missileSprite: {
	// 			left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileLeft.png`,
	// 			right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileRight.png`,
	// 			up: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileUp.png`,
	// 			fire: {
	// 				left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredLeft.png`,	
	// 				right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredRight.png`,
	// 			}
	// 		},
	// 	})},
	// 	{x: 6100, y: 350, w: PLAYER_SIZE.w, h: PLAYER_SIZE.h, jumpHeight: 0, jumps: 0, movespeed: 0, HP: 30, contactDamage: 5, patrolDistance: 3000, attackCooldown: 500, weapon: new Weapon({
	// 		name: "Izazgrabi",
	// 		damage: 10,
	// 		sound: createSound(`${PATH_AUDIO}/Weapons/Ranged/Izazgrabi/Fire.mp3`),
	// 		missileSpeed: 7,
	// 		missileSize: {w: 30, h: 15},
	// 		fireEffectSize: {w: 64, h: 64},
	// 		missileSprite: {
	// 			left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileLeft.png`,
	// 			right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileRight.png`,
	// 			up: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileUp.png`,
	// 			fire: {
	// 				left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredLeft.png`,	
	// 				right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredRight.png`,
	// 			}
	// 		},
	// 	})},
	// 	{x: 6150, y: 550, w: PLAYER_SIZE.w, h: PLAYER_SIZE.h, jumpHeight: 0, jumps: 0, movespeed: 0, HP: 30, contactDamage: 5, patrolDistance: 2500, attackCooldown: 500, weapon: new Weapon({
	// 		name: "Izazgrabi",
	// 		damage: 10,
	// 		sound: createSound(`${PATH_AUDIO}/Weapons/Ranged/Izazgrabi/Fire.mp3`),
	// 		missileSpeed: 7,
	// 		missileSize: {w: 30, h: 15},
	// 		fireEffectSize: {w: 64, h: 64},
	// 		missileSprite: {
	// 			left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileLeft.png`,
	// 			right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileRight.png`,
	// 			up: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileUp.png`,
	// 			fire: {
	// 				left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredLeft.png`,	
	// 				right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredRight.png`,
	// 			}
	// 		},
	// 	})},
	// 	{x: 7500, y: 550, w: PLAYER_SIZE.w, h: PLAYER_SIZE.h, jumpHeight: 0, jumps: 0, movespeed: 0, HP: 30, contactDamage: 5, patrolDistance: 1500, attackCooldown: 1000, weapon: new Weapon({
	// 		name: "Izazgrabi",
	// 		damage: 10,
	// 		sound: createSound(`${PATH_AUDIO}/Weapons/Ranged/Izazgrabi/Fire.mp3`),
	// 		missileSpeed: 7,
	// 		missileSize: {w: 30, h: 15},
	// 		fireEffectSize: {w: 64, h: 64},
	// 		missileSprite: {
	// 			left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileLeft.png`,
	// 			right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileRight.png`,
	// 			up: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileUp.png`,
	// 			fire: {
	// 				left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredLeft.png`,	
	// 				right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredRight.png`,
	// 			}
	// 		},
	// 	})},
	// 	{x: 7500, y: 400, w: PLAYER_SIZE.w, h: PLAYER_SIZE.h, jumpHeight: 0, jumps: 0, movespeed: 0, HP: 30, contactDamage: 5, patrolDistance: 1500, attackCooldown: 1000, weapon: new Weapon({
	// 		name: "Izazgrabi",
	// 		damage: 10,
	// 		sound: createSound(`${PATH_AUDIO}/Weapons/Ranged/Izazgrabi/Fire.mp3`),
	// 		missileSpeed: 7,
	// 		missileSize: {w: 30, h: 15},
	// 		fireEffectSize: {w: 64, h: 64},
	// 		missileSprite: {
	// 			left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileLeft.png`,
	// 			right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileRight.png`,
	// 			up: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileUp.png`,
	// 			fire: {
	// 				left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredLeft.png`,	
	// 				right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredRight.png`,
	// 			}
	// 		},
	// 	})},
	// 	{x: 7500, y: 250, w: PLAYER_SIZE.w, h: PLAYER_SIZE.h, jumpHeight: 0, jumps: 0, movespeed: 0, HP: 30, contactDamage: 5, patrolDistance: 1500, attackCooldown: 1000, weapon: new Weapon({
	// 		name: "Izazgrabi",
	// 		damage: 10,
	// 		sound: createSound(`${PATH_AUDIO}/Weapons/Ranged/Izazgrabi/Fire.mp3`),
	// 		missileSpeed: 7,
	// 		missileSize: {w: 30, h: 15},
	// 		fireEffectSize: {w: 64, h: 64},
	// 		missileSprite: {
	// 			left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileLeft.png`,
	// 			right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileRight.png`,
	// 			up: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileUp.png`,
	// 			fire: {
	// 				left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredLeft.png`,	
	// 				right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredRight.png`,
	// 			}
	// 		},
	// 	})},
	// 	{x: 9625, y: 300, w: PLAYER_SIZE.w, h: PLAYER_SIZE.h, jumpHeight: 0, jumps: 0, movespeed: 0, HP: 30, contactDamage: 5, patrolDistance: 1200, attackCooldown: 500, weapon: new Weapon({
	// 		name: "Izazgrabi",
	// 		damage: 10,
	// 		sound: createSound(`${PATH_AUDIO}/Weapons/Ranged/Izazgrabi/Fire.mp3`),
	// 		missileSpeed: 7,
	// 		missileSize: {w: 30, h: 15},
	// 		fireEffectSize: {w: 64, h: 64},
	// 		missileSprite: {
	// 			left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileLeft.png`,
	// 			right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileRight.png`,
	// 			up: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/MissileUp.png`,
	// 			fire: {
	// 				left: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredLeft.png`,	
	// 				right: `${PATH_SPRITES}/Weapons/Ranged/Izazgrabi/FiredRight.png`,
	// 			}
	// 		},
	// 	})},
	// ];
	// ranged_enemy_properties.forEach(prop => {
	// 	new EnemyCharacter({
	// 		x: prop.x - prop.w / 2,
	// 		y: prop.y,
	// 		w: prop.w,
	// 		h: prop.h,
	// 		jumpHeight: prop.jumpHeight,
	// 		jumps: prop.jumps,
	// 		weapon: prop.weapon,
	// 		movespeed: prop.movespeed,
	// 		deathSound: `${PATH_AUDIO}/Level 1/EnemyDeath.mp3`,
	// 		HP: prop.HP,
	// 		contactDamage: prop.contactDamage,
	// 		patrolDistance: prop.patrolDistance,
	// 		attackCooldown: prop.attackCooldown,
	// 		enemyType: "range",
	// 		sprite: ENEMY_RANGED,
	// 	});
	// });

	// /*
	// 	Creating Orb Of Health.
	// */
	// const ORB_HEALTH_POSITIONS = [
	// 	{x: 600, 	y: 120},
	// 	{x: 6220, 	y: 620},
	// ];
	// ORB_HEALTH_POSITIONS.forEach(orb_position => {
	// 	new OrbOfHealth({
	// 		x: orb_position.x,
	// 		y: orb_position.y,
	// 		w: 30,
	// 		h: 30,
	// 		sprite: {
	// 			default: `${PATH_SPRITES}/Orbs/OrbOfHealth.png`,
	// 		},
	// 		HPIncrease: 10,
	// 	});
	// });
		
	// /*
	// 	Creating Orbs Of Rejuvenation.
	// */
	// const ORB_REJUVENATION_POSITIONS = [
	// 	{x: 3185, 	y: 250},
	// 	{x: 9610, 	y: 200},
	// ];
	// ORB_REJUVENATION_POSITIONS.forEach(orb_position => {
	// 	new OrbOfRejuvenation({
	// 		x: orb_position.x,
	// 		y: orb_position.y,
	// 		w: 30,
	// 		h: 30,
	// 		sprite: {
	// 			default: `${PATH_SPRITES}/Orbs/OrbOfRejuvenation.png`,
	// 		},
	// 		healPercentage: 0.25,
	// 	});
	// });
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