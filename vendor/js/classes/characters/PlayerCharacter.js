import { Character }    from "./Character.js";
import { Graphics }     from "../Graphics.js";
import { createSound }  from "../../functions/createsound.js";

/*
  Class for character which will be controlled by the player
*/
export class PlayerCharacter extends Character {
  constructor({x, y, w, h, crouchHeight, jumpHeight, jumps, movespeed, HP, sprite, playerName, weapon}){
    super({x, y, w, h, crouchHeight, jumpHeight, jumps, movespeed, HP, sprite, weapon});
    this.name =           playerName;                                       // Name of the player character
    // this.deathSound =  createSound(`${PATH_AUDIO}/sounds/death.mp3`);
    this.jumpSound1 =      createSound(`${PATH_AUDIO}/Player/Jumping/Jump1.mp3`);
    this.jumpSound2 =      createSound(`${PATH_AUDIO}/Player/Jumping/Jump2.mp3`);
    this.keys = {
      A: { pressed: false },                                      // A = moving left
      D: { pressed: false },                                      // D = moving right
      W: { pressed: false },                                      // W = jumping
      S: { pressed: false },                                      // S = crouching
    };
    this.healthUI =        Graphics.createImage(`${PATH_IMAGES}/HealthBarUI.png`);
  }

  /*
    Drawing HP bar in the left top corner of the screen
    HP bar consists of HP shell and remaining HP which is reduced from left to right.
  */
  drawHPBar() {

    // Drawing health UI
    Graphics.drawImage({
      x: 25,
      y: 25,
      sprite: this.healthUI,
      ctx: UI_CTX,
    });

		// HP Shell properties
		const HPShellBorderSize = 	0;
		const HPShellBorderColor =  "#552f2f";
		const HPShellWidth = 				this.maxHP - (HPShellBorderSize * 2);
		const HPShellHeight = 			27 - (HPShellBorderSize * 2);
		const HPShellColor = 				"#552f2f";
		const HPShellPositionX = 	  120;
		const HPShellPositionY = 		39;
		// HP Bar properties
		const HPScale = 						HPShellWidth / this.maxHP;
		const HPBarWidth = 					this.currentHP * HPScale;
    const HPBarHealthNumber =   this.currentHP;
		const HPBarHeight = 				HPShellHeight;
		const HPBarColors = 				{healthy: "#226d34", weakened: "#6d6c22", critical: "#a92d2d"};
		let 	HPBarColor = 					null;
		const HPBarPositionX = 			HPShellPositionX;
		const HPBarPositionY = 			HPShellPositionY;
		// Determining HP bar color based on current health percentage
		const HPRatio = HPBarWidth / HPShellWidth;
		if (HPRatio > 0.66 && HPRatio <= 1){
			HPBarColor = HPBarColors.healthy;					// Heath percentage is in healthy range
		}
    else if (HPRatio > 0.33 && HPRatio <= 0.66){
			HPBarColor = HPBarColors.weakened;				// Heath percentage is in weakened range
		}
    else {
			HPBarColor = HPBarColors.critical;				// Heath percentage is in critical range
		}
    Graphics.drawLine({x1: HPShellPositionX, y1: HPShellPositionY, x2: HPShellPositionX + HPShellWidth, y2: HPShellPositionY, thickness: HPShellBorderSize, color: HPShellBorderColor, ctx: UI_CTX});      // Top border
    Graphics.drawLine({x1: HPShellPositionX, y1: HPShellPositionY, x2: HPShellPositionX, y2: HPShellPositionY + HPShellHeight, thickness: HPShellBorderSize, color: HPShellBorderColor, ctx: UI_CTX});     // Left border
    Graphics.drawLine({x1: HPShellPositionX + HPShellWidth, y1: HPShellPositionY, x2: HPShellPositionX + HPShellWidth, y2: HPShellPositionY + HPShellHeight, thickness: HPShellBorderSize, color: HPShellBorderColor, ctx: UI_CTX});     // Right border
    Graphics.drawLine({x1: HPShellPositionX, y1: HPShellPositionY + HPShellHeight, x2: HPShellPositionX + HPShellWidth, y2: HPShellPositionY + HPShellHeight, thickness: HPShellBorderSize, color: HPShellBorderColor, ctx: UI_CTX});    // Bottom border
    Graphics.drawRectangle({x: HPShellPositionX, y: HPShellPositionY, w: HPShellWidth, h: HPShellHeight, color: HPShellColor, ctx: UI_CTX}); // Drawing HP Shell
    Graphics.drawRectangle({x: HPBarPositionX, y: HPBarPositionY, w: HPBarWidth, h: HPBarHeight, color: HPBarColor, ctx: UI_CTX});           // Drawing HP Bar
    // Graphics.drawText({x: HPShellPositionX + HPShellWidth / 2 - 10, y: HPShellPositionY + HPShellHeight / 2 + 4, size: 15, color: "White", content: HPBarHealthNumber, align: "Center", font: GAME_FONT, ctx: UI_CTX});
  }

  /*
    DEBUG Mode
    In this mode, some player properties are displayed on a screen, collision lines and other things.
  */
  printDebugText() {

    // Drawing debug backdrop
    Graphics.drawRectangle({
      x: 25,
      y: 110,
      w: 550,
      h: 385,
      color: DIMMED_BACKGROUND_COLOR,
      ctx: UI_CTX,
    });

    // Debug title
    Graphics.drawText({
      x: 50,
      y: 135,
      size: 18,
      color: "yellow",
      content: `DEBUG MODE ENABLED`,
      align: "left",
      font: "Consolas",
      ctx: UI_CTX,
    });

    const debugContent = [
      `Name:          ${this.name}`,
      `Position:      { x: ${this.position.x}, y: ${this.position.y} }`,
      `Center:        { x: ${this.center.x}, y: ${this.center.y} }`,
      `Size:          { w: ${this.size.w}, h: ${this.size.h} }`,
      `Velocity:      { x: ${this.velocity.x}, y: ${this.velocity.y} }`,
      `Keys:          { A: ${this.keys.A.pressed}, D: ${this.keys.D.pressed}, W: ${this.keys.W.pressed}, S: ${this.keys.S.pressed} }`,
      `Direction:     { Left: ${this.direction.left}, Right: ${this.direction.left}, Up: ${this.direction.left}}`,
      `State:         ${this.currentState}`,
      `Speed:         ${this.movespeed}`,
      `HP:            ${this.maxHP}`,
      `Height:        { Original: ${this.originalHeight}, Crouching: ${this.crouchHeight} }`,
      `Jump:          { Jumps: ∞, Remaining: ∞, Jump height: ${this.jumpHeight} }`,
      `Crouching:     ${this.isCrouching}`,
      `Grounded:      ${this.isGrounded}`,
      `Damaged:       ${this.damaged}`,
      `Visible:       ${this.visible}`,
      `Weapon:        { Name: ${this.weapon.name}, Damage: ${this.weapon.damage}, Missile speed: ${this.weapon.missileSpeed} }`,
      `Visible:       ${this.visible}`,
      `Positions:     { Left: ${this.left}, Right: ${this.right}, Top: ${this.top}, Bottom: ${this.bottom}`,
    ];
    debugContent.forEach((content, index) => {
      Graphics.drawText({
        x: 60,
        y: 135 + (18 * (index + 1)),
        size: 12,
        color: "yellow",
        content: content,
        align: "left",
        font: "Consolas",
        ctx: UI_CTX,
      });
    });

    // Center of PLAYER
    Graphics.drawLine({x1: 0, y1: this.center.y, x2: CANVAS_GAME.width, y2: this.center.y, thickness: 1, color: 'yellow', ctx: GAME_CTX});   // Horizontal line
    Graphics.drawLine({x1: this.center.x, y1: 0, x2: this.center.x, y2: CANVAS_GAME.height, thickness: 1, color: 'yellow', ctx: GAME_CTX});  // Vertical line
    
    // Bounding box of PLAYER current sides and old sides
    Graphics.drawOutline({
			x: this.left,
			y: this.top,
			w: this.size.w,
			h: this.size.h,
			thickness: 1,
			color: "yellow",
			ctx: GAME_CTX,
		});
    Graphics.drawOutline({
			x: this.oldLeft,
			y: this.oldTop,
			w: this.size.w,
			h: this.size.h,
			thickness: 1,
			color: "red",
			ctx: GAME_CTX,
		});
  }
}