import { Graphics } from "./classes/Graphics.js";
import { gameOver } from "./gameover.js";
import { pauseGame } from "./pausegame.js";
/*
	FPS Restriction setup
*/
let renderRequestID = null;

const Render = () => {
	/*
		Keep rendering the game as long as the player is alive.
		Otherwise call game over.
	*/
	PLAYER.isDead ? gameOver() : renderRequestID = requestAnimationFrame(Render);
	
	/*
		Checking whether game has been paused.
	*/
	if (GAME_PAUSED){
		pauseGame();
	}
	
	// Player is playing a game and the game is not paused
	if (INGAME && !GAME_PAUSED){
		/*
			Clear canvases.
		*/
		Graphics.clearScreen();

		/*
			Parse game canvas margins.
		*/
		let canvasMarginLeft = parseFloat(CANVAS_GAME.style.marginLeft) || 0;
		let canvasMarginRight = parseFloat(CANVAS_GAME.style.marginRight) || 0;
		let canvasMarginTop = parseFloat(CANVAS_GAME.style.marginTop) || 0;
		let canvasMarginBottom = parseFloat(CANVAS_GAME.style.marginBottom) || 0;

		/*
			Horizontal and Vertical camera follow.
		*/
		canvasMarginLeft = -1 * (PLAYER.center.x - CANVAS_WRAPPER.clientWidth / 2);
		canvasMarginRight = -CANVAS_GAME.width + CANVAS_WRAPPER.clientWidth / 2 + PLAYER.center.x;
		// canvasMarginTop = -1 * (PLAYER.center.y - CANVAS_WRAPPER.clientHeight / 2);
		// canvasMarginBottom = -CANVAS_GAME.height + CANVAS_WRAPPER.clientHeight / 2 + PLAYER.center.y;

		/*
			Preventing moving camera further leftwards than the left edge of the game.
		*/
		if (canvasMarginLeft > 0){
			canvasMarginLeft = 0;
			canvasMarginRight = CANVAS_WRAPPER.clientWidth - CANVAS_GAME.width;
		}

		/*
			Preventing moving camera further rightwards than the right edge of the game.
		*/
		else if (canvasMarginRight > 0){
			canvasMarginRight = 0;
			canvasMarginLeft = CANVAS_WRAPPER.clientWidth - CANVAS_GAME.width;
		}

		/*
			Preventing moving camera further upwards than the top edge of the game.
		*/
		if (canvasMarginTop > 0){
			canvasMarginTop = 0;
			canvasMarginBottom = CANVAS_WRAPPER.clientHeight - CANVAS_GAME.height;
		}

		/*
			Preventing moving camera further downwards than the bottom edge of the game.
		*/
		else if (canvasMarginBottom > 0){
			canvasMarginBottom = 0;
			canvasMarginTop = CANVAS_WRAPPER.clientHeight - CANVAS_GAME.height;
		}

		// Player holds down A key (Moves left)
		if (PLAYER.keys.A.pressed && !PLAYER.keys.D.pressed && !PLAYER.isCrouching){
			PLAYER.velocity.x =	-PLAYER.movespeed;		// Set player X velocity to negative movespeed
		}

		// Player holds down D key (Moves right)
		else if (PLAYER.keys.D.pressed && !PLAYER.keys.A.pressed && !PLAYER.isCrouching){
			PLAYER.velocity.x =	PLAYER.movespeed;		// Set player X velocity to movespeed
		}
		// Player isn't holding down A nor D key, or is aiming upwards (Stationary), or is crouching
		else {
			PLAYER.velocity.x = 0;
		}
		/*
			Player character is crouching by holding down the S key.
		*/
		if (!PLAYER.keys.W.pressed) PLAYER.isCrouching = (PLAYER.keys.S.pressed && PLAYER.isGrounded) || false;
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
		CANVAS_GAME.style.marginLeft = canvasMarginLeft + "px";
		CANVAS_GAME.style.marginRight = canvasMarginRight + "px";
		CANVAS_GAME.style.marginTop = canvasMarginTop + "px";
		CANVAS_GAME.style.marginBottom = canvasMarginBottom + "px";
		GENERIC_OBJECTS.forEach(genericObject => {if (genericObject) genericObject.update()});
		PLATFORMS.forEach(platform => {if (platform) platform.update()});
		ENEMIES.forEach(enemy => {if (enemy) enemy.update()});
		ORBS.forEach(orb => {if (orb) orb.update()});
		MISSILES.forEach(bullet => {if (bullet) bullet.update()});
		EFFECTS.forEach(effect => {if (effect) effect.update()});
		FIREBALLS.forEach(fireball => {if (fireball) fireball.update()});
		PLAYER.update();

		/*
			Printing debugging text for player character if debug mode is turned on.
		*/
		if (DEBUG_MODE) PLAYER.printDebugText();
	}
}

/*
	CALL THIS FUNCTION WHEN YOU WANT TO RENDER GAME
*/
export function startRendering() {
    Render();
}

/*
	CALL THIS FUNCTION WHEN YOU WANT TO STOP RENDERING GAME
*/
export function stopRendering() {
	cancelAnimationFrame(renderRequestID);
	renderRequestID = null;
}