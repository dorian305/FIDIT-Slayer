import { Graphics } from "./classes/Graphics.js";
import { gameOver } from "./gameover.js";
/*
  This is an animation file which handles periodic redrawing of the game components, such as platforms, characters, background
*/
/*
	Help variables for component velocity
*/
let PLATFORMS_VELOCITY =             {x: 0, y: 0};                       // Velocity which will apply to all the platforms
let CHARACTERS_VELOCITY =            {x: 0, y: 0};                       // Velocity which will apply to all the characters
let GENERIC_OBJECTS_VELOCITY =       {x: 0, y: 0};                       // Velocity which will apply to all the generic objects
let ORBS_VELOCITY =       			 {x: 0, y: 0};                       // Velocity which will apply to all the orb collectibles;

/*
	FPS Restriction setup
*/
let stop = false;
let frameCount = 0;
let fpsInterval, startTime, now, then, elapsed;

function Render(){
	/*
		This shit handles FPS restriction
	*/
	if (stop) return;
	/*
		Keep the game running as long as the player character is alive.
	*/
	if (!PLAYER.isDead){
		requestAnimationFrame(Render);
	}
	/*
		Player character has died.
		Run game over function.
	*/
	else {
		gameOver();
	}
	now = Date.now();
	elapsed = now - then;
	if (elapsed > fpsInterval){
		then = now - (elapsed % fpsInterval);

		// Player is playing a game and the game is not paused
	  	if (INGAME && !GAME_PAUSED){
			/*
			This piece of code handles player character movement,
			and movement of any other game object in relation to the player character movement.
			*/
			// Player holds down A key (Moves left)
			if (PLAYER.keys.A.pressed && !PLAYER.keys.D.pressed){
				PLAYER.velocity.x =					-PLAYER.movespeed;
				PLAYER.lastDirection =				 PLAYER.direction;	 // Update last direction to current direction
				PLAYER.direction =					 "left";						 // Update current direction
				if (LEFT_WALL.position.x + PLAYER.movespeed > 0){
					/*
					The left edge of the left game wall is within viewport, which means that the player character
					is at the beginning of the level, on the left side of the screen.
					Allow player character to move left and right, and do not move other game objects.
					*/
					LEFT_WALL.position.x =					0;          				 // Fixating left wall to the correct position
					// Removing velocities of all other game objects
					GENERIC_OBJECTS_VELOCITY.x =			0;
					PLATFORMS_VELOCITY.x =					0;
					CHARACTERS_VELOCITY.x =					0;
					ORBS_VELOCITY.x =						0;
				}
				/*
					The left edge of the left wall is out of viewport, which means player character is
					not at the beginning of the level.
				*/
				else {
					/*
					Check first if, when the player character starts moving leftwards,
					that the its left edge is past the middle line of the screen.
					If so, remove its velocity and move all other game objects to the right.
					*/
					if (PLAYER.left <= CANVAS.width / 2 - PLAYER.size.w / 2){
						PLAYER.velocity.x =					0;        					// Fixate player character
						// Add right velocity to all other game objects
						GENERIC_OBJECTS_VELOCITY.x =		PLAYER.movespeed / 2;
						PLATFORMS_VELOCITY.x =				PLAYER.movespeed;
						CHARACTERS_VELOCITY.x =				PLAYER.movespeed;
						ORBS_VELOCITY.x =					PLAYER.movespeed;
					}
					/*
					Player character isn't past the middle line of the screen, do not remove
					its velocity, but also do not move any other game objects.
					*/
					else {
						GENERIC_OBJECTS_VELOCITY.x =		0;
						PLATFORMS_VELOCITY.x =				0;
						CHARACTERS_VELOCITY.x =				0;
						ORBS_VELOCITY.x =					0;
					}
				}
			}
			/*
			Same thing but for the right side.
			*/
			// Player holds down D key (Moves right)
			else if (PLAYER.keys.D.pressed && !PLAYER.keys.A.pressed){
				PLAYER.velocity.x =					PLAYER.movespeed;
				PLAYER.lastDirection =				PLAYER.direction;
				PLAYER.direction =					"right";
				if (RIGHT_WALL.position.x + RIGHT_WALL.size.w <= CANVAS.width){
					RIGHT_WALL.position.x =					CANVAS.width - RIGHT_WALL.size.w;
					GENERIC_OBJECTS_VELOCITY.x =			0;
					PLATFORMS_VELOCITY.x =					0;
					CHARACTERS_VELOCITY.x =					0;
					ORBS_VELOCITY.x =						0;
				}
				else {
					if (PLAYER.right >= CANVAS.width / 2 + PLAYER.size.w / 2){
						PLAYER.velocity.x =                    	  0;
						GENERIC_OBJECTS_VELOCITY.x =             -PLAYER.movespeed / 2;
						PLATFORMS_VELOCITY.x =                   -PLAYER.movespeed;
						CHARACTERS_VELOCITY.x =            		 -PLAYER.movespeed;
						ORBS_VELOCITY.x =						 -PLAYER.movespeed;
					}
					else {
						GENERIC_OBJECTS_VELOCITY.x =			0;
						PLATFORMS_VELOCITY.x =					0;
						CHARACTERS_VELOCITY.x =					0;
						ORBS_VELOCITY.x =						0;
					}
				}
			}
			// Player isn't holding down A nor D key (Stationary)
			else {
				PLAYER.velocity.x =					0;
				GENERIC_OBJECTS_VELOCITY.x =		0;
				PLATFORMS_VELOCITY.x =				0;
				CHARACTERS_VELOCITY.x =				0;
				ORBS_VELOCITY.x =					0;
			}
			/*
			Player character is crouching by holding down the S key.
			*/
			PLAYER.isCrouching = PLAYER.keys.S.pressed || false;
			/*
				Player character is looking upwards
			*/
			if (PLAYER.keys.W.pressed){
				PLAYER.lastDirection =					PLAYER.direction;
				PLAYER.direction =						"up";
			} else {
				PLAYER.direction =						PLAYER.lastDirection;
				PLAYER.lastDirection =					"up";
			}
			/*
			This code handles game component drawing,srbija
			character to platform collisions, character to enemy collisions,
			character and platform position updating, generic objects movements etc...
			*/
			Graphics.clearScreen();
			GENERIC_OBJECTS.forEach(genericObject => {
				genericObject.velocity.x = GENERIC_OBJECTS_VELOCITY.x;
				genericObject.velocity.y = GENERIC_OBJECTS_VELOCITY.y;
				genericObject.update();
			});
			PLATFORMS.forEach(platform => {
				platform.velocity.x = PLATFORMS_VELOCITY.x;
				platform.velocity.y = PLATFORMS_VELOCITY.y;
				platform.update();
			});
			CHARACTERS.forEach(character => {
				if (character.isEnemy){
					character.velocity.x = CHARACTERS_VELOCITY.x;
					PLAYER.checkEnemyCollision(character);
				}
				character.update();
			});
			ORBS.forEach(orb => {
				orb.velocity.x = ORBS_VELOCITY.x;
				orb.velocity.y = ORBS_VELOCITY.y;
				orb.checkCollected();
				orb.update();
			});
			/* */
			/*
			Printing debugging text for player character
			if debug mode is turned on
			*/
			if (DEBUG_MODE){
				PLAYER.printDebugText();
			}
		}
	}
}

/*
	CALL THIS FUNCTION WHEN YOU WANT TO RENDER GAME
*/
export function startRendering() {
    fpsInterval = 1000 / GAME_FPS;
    then = Date.now();
    startTime = then;
    Render();
}