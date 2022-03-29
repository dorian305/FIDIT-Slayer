import { Character } from "./Character.js";
import { Graphics } from "../Graphics.js";
import { createSound } from "../../functions/createsound.js";

/*
  Class for character which will be controlled by the player
*/
export class PlayerCharacter extends Character {
  constructor({x, y, w, h, jumpHeight, jumps, movespeed, HP, sprite, playerName}){
    super({x, y, w, h, jumpHeight, jumps, movespeed, HP, sprite});
    this.name =           playerName;                             // Name of the player character
    this.deathSound =     createSound(`${PATH_AUDIO}/sounds/death.mp3`);
    this.keys = {
      A: { pressed: false },                                      // A = moving left
      D: { pressed: false },                                      // D = moving right
      W: { pressed: false },                                      // W = jumping
      S: { pressed: false },                                      // S = crouching
    };
  }

  draw() {
    Graphics.drawImage({x: this.position.x, y: this.position.y, sprite: this.sprite});
		
    /*
			Drawing HP bar in the left top corner of the screen
			HP bar consists of HP shell and remaining HP which is reduced from left to right.
		*/
		// HP Shell properties
		const HPShellBorderSize = 	2;
		const HPShellBorderColor =  "#d7d7d7";
		const HPShellWidth = 				this.maxHP - (HPShellBorderSize * 2);
		const HPShellHeight = 			20 - (HPShellBorderSize * 2);
		const HPShellColor = 				"#262626";
		const HPShellPositionX = 		100;
		const HPShellPositionY = 		50;
		// HP Bar properties
		const HPScale = 						HPShellWidth / this.maxHP;
		const HPBarWidth = 					this.currentHP * HPScale;
		const HPBarHeight = 				HPShellHeight;
		const HPBarColors = 				{healthy: "#09de25", weakened: "#deb009", critical: "#de1709"};
		let 	HPBarColor = 					null;
		const HPBarPositionX = 			HPShellPositionX;
		const HPBarPositionY = 			HPShellPositionY;
		// Determining HP bar color based on current health percentage
		const HPRatio = HPBarWidth / HPShellWidth;
		if (HPRatio > 0.66 && HPRatio <= 1){
			HPBarColor = HPBarColors.healthy;					// Heath percentage is in healthy range
		} else if (HPRatio > 0.33 && HPRatio < 0.66){
			HPBarColor = HPBarColors.weakened;				// Heath percentage is in weakened range
		} else {
			HPBarColor = HPBarColors.critical;				// Heath percentage is in critical range
		}

		// Drawing border
		Graphics.drawLine({					// Top border
			x1: HPShellPositionX,
			y1: HPShellPositionY,
			x2: HPShellPositionX + HPShellWidth,
			y2: HPShellPositionY,
			thickness: HPShellBorderSize,
			color: HPShellBorderColor
		});
		Graphics.drawLine({					// Left border
			x1: HPShellPositionX,
			y1: HPShellPositionY,
			x2: HPShellPositionX,
			y2: HPShellPositionY + HPShellHeight,
			thickness: HPShellBorderSize,
			color: HPShellBorderColor
		});
		Graphics.drawLine({					// Right border
			x1: HPShellPositionX + HPShellWidth,
			y1: HPShellPositionY,
			x2: HPShellPositionX + HPShellWidth,
			y2: HPShellPositionY + HPShellHeight,
			thickness: HPShellBorderSize,
			color: HPShellBorderColor
		});
		Graphics.drawLine({					// Bottom border
			x1: HPShellPositionX,
			y1: HPShellPositionY + HPShellHeight,
			x2: HPShellPositionX + HPShellWidth,
			y2: HPShellPositionY + HPShellHeight,
			thickness: HPShellBorderSize,
			color: HPShellBorderColor
		});
		// Drawing HP Shell
    Graphics.drawText({x: HPShellPositionX - 50, y: HPShellPositionY + 17, size: 35, color: "White", content: "HP", align: "left", font: GAME_FONT});
    Graphics.drawRectangle({
      x: HPShellPositionX,
      y: HPShellPositionY,
      w: HPShellWidth,
      h: HPShellHeight,
      color: HPShellColor,
    });
		// Drawing HP Bar
    Graphics.drawRectangle({
      x: HPBarPositionX,
      y: HPBarPositionY,
      w: HPBarWidth,
      h: HPBarHeight,
      color: HPBarColor,
    });
  }

  /*
    Player character to enemy character collision
    detection. Checks whether the player character
    has collided with an enemy character, and damages it.
  */
  checkEnemyCollision(enemy) {
    if (!(this.left > enemy.right || this.right < enemy.left || this.top > enemy.bottom || this.bottom < enemy.top) && !this.damaged){
      this.damaged = 				true;
			this.currentHP = 			this.currentHP - enemy.contactDamage;
			if (this.currentHP < 0){
				this.currentHP = 			0;
				this.isDead = 				true
			}
      setTimeout(() => this.damaged = false, PLAYER_DAMAGED_DELAY);
    }
  }

  printDebugText() {
    /*
      DEBUG MODE
      When this is enabled, player character properties are displayed on the screen.
    */
    Graphics.drawText({x: 50, y: 25, size: 20, color: "yellow", content: `DEBUG MODE ENABLED`, align: "left", font: "Consolas"});
    Graphics.drawText({x: 60, y: 50, size: 15, color: "yellow", content: `Position =      (${this.position.x}, ${this.position.y})`, align: "left", font: "Consolas"});
    Graphics.drawText({x: 60, y: 70, size: 15, color: "yellow", content: `Velocity =      (${this.velocity.x}, ${this.velocity.y})`, align: "left", font: "Consolas"});
    Graphics.drawText({x: 60, y: 100, size: 15, color: "yellow", content: `W and H =       (${this.size.w}, ${this.size.h})`, align: "left", font: "Consolas"});
    Graphics.drawText({x: 60, y: 130, size: 15, color: "yellow", content: `Left =          ${this.left}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: 60, y: 150, size: 15, color: "yellow", content: `Right =         ${this.right}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: 60, y: 170, size: 15, color: "yellow", content: `Top =           ${this.top}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: 60, y: 190, size: 15, color: "yellow", content: `Bottom =        ${this.bottom}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: 60, y: 210, size: 15, color: "yellow", content: `oldLeft =       ${this.oldLeft}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: 60, y: 230, size: 15, color: "yellow", content: `oldRight =      ${this.oldRight}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: 60, y: 250, size: 15, color: "yellow", content: `oldTop =        ${this.oldTop}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: 60, y: 270, size: 15, color: "yellow", content: `oldBottom =     ${this.oldBottom}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: 60, y: 300, size: 15, color: "yellow", content: `Jumps =         ${this.jumps}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: 60, y: 320, size: 15, color: "yellow", content: `Remaining =     ${this.remainingJumps}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: 60, y: 340, size: 15, color: "yellow", content: `Jump height =   ${this.jumpHeight}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: 60, y: 360, size: 15, color: "yellow", content: `Movespeed =     ${this.movespeed}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: 60, y: 380, size: 15, color: "yellow", content: `HP =            ${this.currentHP}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: 60, y: 440, size: 15, color: "yellow", content: `Crouching =     ${this.isCrouching}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: 60, y: 460, size: 15, color: "yellow", content: `Dead =          ${this.isDead}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: 60, y: 480, size: 15, color: "yellow", content: `Keys =          (W: ${this.keys.W.pressed}, A: ${this.keys.A.pressed}, S: ${this.keys.S.pressed}, D: ${this.keys.D.pressed})`, align: "left", font: "Consolas"});
  }
}