import { Character }    from "./Character.js";
import { Graphics }     from "../Graphics.js";
import { createSound }  from "../../functions/createsound.js";

/*
  Class for character which will be controlled by the player
*/
export class PlayerCharacter extends Character {
  constructor({x, y, w, h, jumpHeight, jumps, movespeed, HP, sprite, playerName, weapon}){
    super({x, y, w, h, jumpHeight, jumps, movespeed, HP, sprite, weapon});
    this.name =           playerName;                                       // Name of the player character
    // this.deathSound =  createSound(`${PATH_AUDIO}/sounds/death.mp3`);
    this.jumpSound1 =      createSound(`${PATH_AUDIO}/Player/Jump1.mp3`);
    this.jumpSound2 =      createSound(`${PATH_AUDIO}/Player/Jump2.mp3`);
    this.keys = {
      A: { pressed: false },                                      // A = moving left
      D: { pressed: false },                                      // D = moving right
      W: { pressed: false },                                      // W = jumping
      S: { pressed: false },                                      // S = crouching
    };
  }

  /*
    Drawing HP bar in the left top corner of the screen
    HP bar consists of HP shell and remaining HP which is reduced from left to right.
  */
  drawHPBar() {
		// HP Shell properties
		const HPShellBorderSize = 	2;
		const HPShellBorderColor =  "#d7d7d7";
		const HPShellWidth = 				this.maxHP - (HPShellBorderSize * 2);
		const HPShellHeight = 			25 - (HPShellBorderSize * 2);
		const HPShellColor = 				"#262626";
		const HPShellPositionX = 		-CANVAS_EDGES.left + 100;
		const HPShellPositionY = 		-CANVAS_EDGES.top + 50;
		// HP Bar properties
		const HPScale = 						HPShellWidth / this.maxHP;
		const HPBarWidth = 					this.currentHP * HPScale;
    const HPBarHealthNumber =   this.currentHP;
		const HPBarHeight = 				HPShellHeight;
		const HPBarColors = 				{healthy: "#09de25", weakened: "#deb009", critical: "#de1709"};
		let 	HPBarColor = 					null;
		const HPBarPositionX = 			HPShellPositionX;
		const HPBarPositionY = 			HPShellPositionY;
		// Determining HP bar color based on current health percentage
		const HPRatio = HPBarWidth / HPShellWidth;
		if (HPRatio > 0.66 && HPRatio <= 1){
			HPBarColor = HPBarColors.healthy;					// Heath percentage is in healthy range
		}
    else if (HPRatio > 0.33 && HPRatio < 0.66){
			HPBarColor = HPBarColors.weakened;				// Heath percentage is in weakened range
		}
    else {
			HPBarColor = HPBarColors.critical;				// Heath percentage is in critical range
		}
    Graphics.drawLine({x1: HPShellPositionX, y1: HPShellPositionY, x2: HPShellPositionX + HPShellWidth, y2: HPShellPositionY, thickness: HPShellBorderSize, color: HPShellBorderColor});      // Top border
    Graphics.drawLine({x1: HPShellPositionX, y1: HPShellPositionY, x2: HPShellPositionX, y2: HPShellPositionY + HPShellHeight, thickness: HPShellBorderSize, color: HPShellBorderColor});     // Left border
    Graphics.drawLine({x1: HPShellPositionX + HPShellWidth, y1: HPShellPositionY, x2: HPShellPositionX + HPShellWidth, y2: HPShellPositionY + HPShellHeight, thickness: HPShellBorderSize, color: HPShellBorderColor});     // Right border
    Graphics.drawLine({x1: HPShellPositionX, y1: HPShellPositionY + HPShellHeight, x2: HPShellPositionX + HPShellWidth, y2: HPShellPositionY + HPShellHeight, thickness: HPShellBorderSize, color: HPShellBorderColor});    // Bottom border
    Graphics.drawRectangle({x: HPShellPositionX, y: HPShellPositionY, w: HPShellWidth, h: HPShellHeight, color: HPShellColor}); // Drawing HP Shell
    Graphics.drawRectangle({x: HPBarPositionX, y: HPBarPositionY, w: HPBarWidth, h: HPBarHeight, color: HPBarColor});           // Drawing HP Bar
    Graphics.drawText({x: HPShellPositionX + HPShellWidth / 2 - 10, y: HPShellPositionY + HPShellHeight / 2 + 4, size: 15, color: "White", content: HPBarHealthNumber, align: "Center", font: GAME_FONT});
  }

  printDebugText() {
    /*
      DEBUG MODE
      When this is enabled, player character properties are displayed on the screen.
    */
    Graphics.drawText({x: -CANVAS_EDGES.left + 100, y: -CANVAS_EDGES.top + 125, size: 20, color: "yellow", content: `DEBUG MODE ENABLED`, align: "left", font: "Consolas"});
    Graphics.drawText({x: -CANVAS_EDGES.left + 110, y: -CANVAS_EDGES.top + 150, size: 15, color: "yellow", content: `Position =      (${this.position.x}, ${this.position.y})`, align: "left", font: "Consolas"});
    Graphics.drawText({x: -CANVAS_EDGES.left + 110, y: -CANVAS_EDGES.top + 170, size: 15, color: "yellow", content: `Velocity =      (${this.velocity.x}, ${this.velocity.y})`, align: "left", font: "Consolas"});
    Graphics.drawText({x: -CANVAS_EDGES.left + 110, y: -CANVAS_EDGES.top + 190, size: 15, color: "yellow", content: `W and H =       (${this.size.w}, ${this.size.h})`, align: "left", font: "Consolas"});
    Graphics.drawText({x: -CANVAS_EDGES.left + 110, y: -CANVAS_EDGES.top + 210, size: 15, color: "yellow", content: `Left =          ${this.left}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: -CANVAS_EDGES.left + 110, y: -CANVAS_EDGES.top + 230, size: 15, color: "yellow", content: `Right =         ${this.right}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: -CANVAS_EDGES.left + 110, y: -CANVAS_EDGES.top + 250, size: 15, color: "yellow", content: `Top =           ${this.top}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: -CANVAS_EDGES.left + 110, y: -CANVAS_EDGES.top + 270, size: 15, color: "yellow", content: `Bottom =        ${this.bottom}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: -CANVAS_EDGES.left + 110, y: -CANVAS_EDGES.top + 290, size: 15, color: "yellow", content: `Movespeed =     ${this.movespeed}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: -CANVAS_EDGES.left + 110, y: -CANVAS_EDGES.top + 310, size: 15, color: "yellow", content: `Max HP =        ${this.maxHP}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: -CANVAS_EDGES.left + 110, y: -CANVAS_EDGES.top + 330, size: 15, color: "yellow", content: `Jump height =   ${this.jumpHeight}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: -CANVAS_EDGES.left + 110, y: -CANVAS_EDGES.top + 350, size: 15, color: "yellow", content: `Jumps =         ${this.jumps}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: -CANVAS_EDGES.left + 110, y: -CANVAS_EDGES.top + 370, size: 15, color: "yellow", content: `Remaining =     ${this.remainingJumps}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: -CANVAS_EDGES.left + 110, y: -CANVAS_EDGES.top + 390, size: 15, color: "yellow", content: `Crouching =     ${this.isCrouching}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: -CANVAS_EDGES.left + 110, y: -CANVAS_EDGES.top + 410, size: 15, color: "yellow", content: `Damaged =       ${this.damaged}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: -CANVAS_EDGES.left + 110, y: -CANVAS_EDGES.top + 430, size: 15, color: "yellow", content: `Keys =          (W: ${this.keys.W.pressed}, A: ${this.keys.A.pressed}, S: ${this.keys.S.pressed}, D: ${this.keys.D.pressed})`, align: "left", font: "Consolas"});
    Graphics.drawText({x: -CANVAS_EDGES.left + 110, y: -CANVAS_EDGES.top + 450, size: 15, color: "yellow", content: `Facing =        (Up: ${this.direction.up}, Left: ${this.direction.left}, Right: ${this.direction.right})`, align: "left", font: "Consolas"});
    Graphics.drawText({x: -CANVAS_EDGES.left + 110, y: -CANVAS_EDGES.top + 470, size: 15, color: "yellow", content: `Visible =       ${this.visible}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: -CANVAS_EDGES.left + 110, y: -CANVAS_EDGES.top + 490, size: 15, color: "yellow", content: `Weapon =        ${this.weapon.name}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: -CANVAS_EDGES.left + 110, y: -CANVAS_EDGES.top + 510, size: 15, color: "yellow", content: `Damage =        ${this.weapon.damage}`, align: "left", font: "Consolas"});
    Graphics.drawText({x: -CANVAS_EDGES.left + 110, y: -CANVAS_EDGES.top + 530, size: 15, color: "yellow", content: `Missile speed = ${this.weapon.missileSpeed}`, align: "left", font: "Consolas"});
  }
}