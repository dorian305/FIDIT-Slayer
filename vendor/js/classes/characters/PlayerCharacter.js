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
  }

  /*
    Drawing HP bar in the left top corner of the screen
    HP bar consists of HP shell and remaining HP which is reduced from left to right.
  */
  drawHPBar() {
    // Health bar UI
    Graphics.drawImage({
      x: -CANVAS_EDGES.left + 50,
      y: -CANVAS_EDGES.top + 25,
      sprite: Graphics.createImage(`${PATH_IMAGES}/HealthBarUI.png`),
    });

		// HP Shell properties
		const HPShellBorderSize = 	0;
		const HPShellBorderColor =  "#552f2f";
		const HPShellWidth = 				(this.maxHP * 2) - (HPShellBorderSize * 2);
		const HPShellHeight = 			27 - (HPShellBorderSize * 2);
		const HPShellColor = 				"#552f2f";
		const HPShellPositionX = 		-CANVAS_EDGES.left + 127;
		const HPShellPositionY = 		-CANVAS_EDGES.top + 39;
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
    Graphics.drawLine({x1: HPShellPositionX, y1: HPShellPositionY, x2: HPShellPositionX + HPShellWidth, y2: HPShellPositionY, thickness: HPShellBorderSize, color: HPShellBorderColor});      // Top border
    Graphics.drawLine({x1: HPShellPositionX, y1: HPShellPositionY, x2: HPShellPositionX, y2: HPShellPositionY + HPShellHeight, thickness: HPShellBorderSize, color: HPShellBorderColor});     // Left border
    Graphics.drawLine({x1: HPShellPositionX + HPShellWidth, y1: HPShellPositionY, x2: HPShellPositionX + HPShellWidth, y2: HPShellPositionY + HPShellHeight, thickness: HPShellBorderSize, color: HPShellBorderColor});     // Right border
    Graphics.drawLine({x1: HPShellPositionX, y1: HPShellPositionY + HPShellHeight, x2: HPShellPositionX + HPShellWidth, y2: HPShellPositionY + HPShellHeight, thickness: HPShellBorderSize, color: HPShellBorderColor});    // Bottom border
    Graphics.drawRectangle({x: HPShellPositionX, y: HPShellPositionY, w: HPShellWidth, h: HPShellHeight, color: HPShellColor}); // Drawing HP Shell
    Graphics.drawRectangle({x: HPBarPositionX, y: HPBarPositionY, w: HPBarWidth, h: HPBarHeight, color: HPBarColor});           // Drawing HP Bar
    // Graphics.drawText({x: HPShellPositionX + HPShellWidth / 2 - 10, y: HPShellPositionY + HPShellHeight / 2 + 4, size: 15, color: "White", content: HPBarHealthNumber, align: "Center", font: GAME_FONT});
  }

  /*
    DEBUG Mode
    In this mode, some player properties are displayed on a screen, collision lines and other things.
  */
  printDebugText() {

    // Drawing debug backdrop
    Graphics.drawRectangle({
      x: -CANVAS_EDGES.left + 50,
      y: -CANVAS_EDGES.top + 100,
      w: 750,
      h: 550,
      color: DIMMED_BACKGROUND_COLOR
    });

    // Debug title
    Graphics.drawText({x: -CANVAS_EDGES.left + 100, y: -CANVAS_EDGES.top + 150, size: 25, color: "yellow", content: `DEBUG MODE ENABLED`, align: "left", font: "Consolas"});

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
    ];
    debugContent.forEach((content, index) => {
      Graphics.drawText({
        x: -CANVAS_EDGES.left + 110,
        y: -CANVAS_EDGES.top + 150 + (25 * (index + 1)),
        size: 18,
        color: "yellow",
        content: content,
        align: "left",
        font: "Consolas"
      });
    });

    // Center of PLAYER
    Graphics.drawLine({x1: 0, y1: this.center.y, x2: CANVAS.width, y2: this.center.y, thickness: 1, color: 'yellow'});   // Horizontal line
    Graphics.drawLine({x1: this.center.x, y1: 0, x2: this.center.x, y2: CANVAS.height, thickness: 1, color: 'yellow'});  // Vertical line
    
    // Bounding box of PLAYER current sides
    Graphics.drawLine({x1: this.left, y1: this.top, x2: this.right, y2: this.top, thickness: 1, color: 'yellow'});          // Top line
    Graphics.drawLine({x1: this.left, y1: this.bottom, x2: this.right, y2: this.bottom, thickness: 1, color: 'yellow'});    // Bottom line
    Graphics.drawLine({x1: this.left, y1: this.top, x2: this.left, y2: this.bottom, thickness: 1, color: 'yellow'});        // Left line
    Graphics.drawLine({x1: this.right, y1: this.top, x2: this.right, y2: this.bottom, thickness: 1, color: 'yellow'});      // Right line
    
    // Bounding box of PLAYER old sides
    Graphics.drawLine({x1: this.oldLeft, y1: this.oldTop, x2: this.oldRight, y2: this.oldTop, thickness: 1, color: 'red'});          // Top line
    Graphics.drawLine({x1: this.oldLeft, y1: this.oldBottom, x2: this.oldRight, y2: this.oldBottom, thickness: 1, color: 'red'});    // Bottom line
    Graphics.drawLine({x1: this.oldLeft, y1: this.oldTop, x2: this.oldLeft, y2: this.oldBottom, thickness: 1, color: 'red'});        // Left line
    Graphics.drawLine({x1: this.oldRight, y1: this.oldTop, x2: this.oldRight, y2: this.oldBottom, thickness: 1, color: 'red'});      // Right line
  }
}