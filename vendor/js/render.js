import { Graphics } from "./classes/Graphics.js";
import { gameOver } from "./gameover.js";
/*
	FPS Restriction setup
*/
let stop = false;
let fpsInterval, startTime, now, then, elapsed;
let requestID = null;
let frameCounter = 0;

function Render(){
	/**
	 * Count frames in debug mode
	 */
	if (DEBUG_MODE){
		frameCounter >= GAME_FPS ? 0 : frameCounter++;
	}
	/*
		This shit handles FPS restriction
	*/
	if (stop) return;
	/*
		Keep the game running as long as the player character is alive.
	*/
	if (!PLAYER.isDead){
		requestID = requestAnimationFrame(Render);
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
			// Player holds down A key (Moves left)
			if (PLAYER.keys.A.pressed && !PLAYER.keys.D.pressed && !PLAYER.isCrouching){
				PLAYER.velocity.x =	-PLAYER.movespeed;		// Set player X velocity to negative movespeed
				/*
					Preventing moving further leftwards than the left edge of the game.
				*/
				if (CANVAS_EDGES.left + PLAYER.movespeed > 0){
					CANVAS_EDGES.left = 0;
					CANVAS_EDGES.right = LEVEL_END_EDGE;
				}
				/*
					Move camera leftwards only if player is at least halfway through the screen width.
				*/
				else if (PLAYER.left <= -CANVAS_EDGES.left + innerWidth / 2 - PLAYER.size.w / 2) {
					CANVAS_EDGES.left = CANVAS_EDGES.left + PLAYER.movespeed;
					CANVAS_EDGES.right = CANVAS_EDGES.right + PLAYER.movespeed;
				}
			}
			// Player holds down D key (Moves right)
			else if (PLAYER.keys.D.pressed && !PLAYER.keys.A.pressed && !PLAYER.isCrouching){
				PLAYER.velocity.x =	PLAYER.movespeed;		// Set player X velocity to movespeed
				/*
				Preventing moving further rightwards than the right edge of the game.
				*/
				if (CANVAS_EDGES.right - PLAYER.movespeed < innerWidth){
					CANVAS_EDGES.left = innerWidth - LEVEL_END_EDGE;
					CANVAS_EDGES.right = innerWidth;
				}
				/*
					Move camera rightwards only if player is at least halfway through the screen width.
				*/
				else if (PLAYER.right >= -CANVAS_EDGES.left + innerWidth / 2 + PLAYER.size.w / 2){
					CANVAS_EDGES.left = CANVAS_EDGES.left - PLAYER.movespeed;
					CANVAS_EDGES.right = CANVAS_EDGES.right - PLAYER.movespeed;
				}
			}
			// Player isn't holding down A nor D key, or is aiming upwards (Stationary), or is crouching
			else {
				PLAYER.velocity.x = 0;
			}
			/*
				Player character is crouching by holding down the S key.
			*/
			if (!PLAYER.keys.W.pressed){
				PLAYER.isCrouching = (PLAYER.keys.S.pressed && PLAYER.isGrounded) || false;
			}
			/*
				Player character is looking upwards
			*/
			PLAYER.direction.up = PLAYER.keys.W.pressed || false;

			/*
				Player has entered boss area
			*/
			if (PLAYER.center.x >= BOSS_AREA.left && !PLAYER_ENTERED_BOSS_AREA){
				PLAYER_ENTERED_BOSS_AREA = true;
				BOSS_FIGHT();
			}

			/*
				Render the game objects and other game logic
			*/
			CANVAS.style.marginLeft = 	`${CANVAS_EDGES.left}px`;
			CANVAS.style.marginTop =	`${CANVAS_EDGES.top}px`;
			Graphics.clearScreen();
			GENERIC_OBJECTS.forEach(genericObject => {
				if (genericObject) genericObject.update();
			});
			PLATFORMS.forEach(platform => {
				if (platform) platform.update();
			});
			ENEMIES.forEach(enemy => {
				if (enemy) enemy.update();
			});
			ORBS.forEach(orb => {
				if (orb) orb.update();
			});
			MISSILES.forEach(bullet => {
				if (bullet) bullet.update();
			});
			EFFECTS.forEach(effect => {
				if (effect) effect.update();
			});
			FIREBALLS.forEach(fireball => {
				if (fireball) fireball.update();
			});
			PLAYER.update();

			/*
				Printing debugging text for player character if debug mode is turned on.
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
/*
	CALL THIS FUNCTION WHEN YOU WANT TO STOP RENDERING GAME
*/
export function stopRendering() {
	cancelAnimationFrame(requestID);
	requestID = null;
}