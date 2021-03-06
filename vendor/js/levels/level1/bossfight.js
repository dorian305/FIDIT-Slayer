import { EnemyBoss } from "../../classes/Characters/EnemyBoss.js";
import { Timer } from "../../classes/Timer.js";
import { randomNumber } from "../../functions/randomnumber.js";
import { Missile } from "../../classes/Weapons/Missile.js";
import { stopSound } from "../../functions/stopsound.js";
import { removeFromArray } 	from "../../functions/removefromarray.js";
import { Button } from "../../classes/Button.js";
import { OrbOfRejuvenation } from "../../classes/Orbs/OrbOfRejuvenation.js";
import { Graphics } from "../../classes/Graphics.js";
import { MainMenu } from "../../mainmenu.js";
import { stopRendering }  from "../../render.js";

export const bossFight = () => {
    // Spawning the boss
    BOSS = new EnemyBoss({
        x: 11000,
        y: 200,
        w: 281,
        h: 206,
        jumpHeight: 20,
        jumps: 1,
        enemyType: "boss",
        movespeed: 3,
        HP: 2000,
        sprite: {
            idle: {
                left: `${PATH_SPRITES}/Level 1/Boss/BossIdleLeft.png`,
                right: `${PATH_SPRITES}/Level 1/Boss/BossIdleRight.png`,
            },
            move: {
                left: `${PATH_SPRITES}/Level 1/Boss/BossIdleLeft.png`,
                right: `${PATH_SPRITES}/Level 1/Boss/BossIdleRight.png`,
            },
            jump: {
                left: `${PATH_SPRITES}/Level 1/Boss/BossJumpLeft.png`,
                right: `${PATH_SPRITES}/Level 1/Boss/BossJumpRight.png`,
            },
            fall: {
                left: `${PATH_SPRITES}/Level 1/Boss/BossFallLeft.png`,
                right: `${PATH_SPRITES}/Level 1/Boss/BossFallRight.png`,
            },
            death: {
                src: `${PATH_SPRITES}/Level 1/Enemies/Death.png`,
                w: 150,
                h: 150,
            },
            default: `${PATH_SPRITES}/Level 1/Boss/BossIdleRight.png`,
        },
        healthUI: Graphics.createImage(`${PATH_SPRITES}/Level 1/Boss/HealthBarUIBoss.png`),
        attackCooldown: 3000,
    });

    // Creating BOSS attack properties
    BOSS.isCharging = false;
    BOSS.shurikens = [];

    // Playing boss fight Music
    stopSound(MUSIC);
    MUSIC.src = `${PATH_AUDIO}/Level 1/BossFight.mp3`;
    MUSIC.loop = true;
    MUSIC.play();

    // Starting boss fight
    const bossFightTimer = new Timer(() => {
        bossAttack();
        bossFightRender();
    }, 1000);
    bossFightTimer.start();

    // Creating orb of rejuvenation
    orbHealTimer = new Timer(createOrbOfRejuvenation, orbHealSpawnTime);
    orbHealTimer.start();
}


/*
    Rendering boss fight
*/
let bossRenderFrame = null;
const bossFightRender = () => {
    /*
        Boss attack 1
    */
   if (BOSS.shurikens.length > 0){
        attack1Check();
   }
    /*
        Boss attack 2
    */
    if (BOSS.isCharging){
        attack2Check();
    }
    /*
        Collection orb of rejuvenation
    */
    if (orbHeal && PLAYER.checkCollision(orbHeal)){
        orbHeal = null;
    }

    /*
        Drawing boss HP UI Bar
    */
        drawBossHealthBar();

    // Death of the boss
    if (BOSS.isDead){
        BOSS.shurikens.length = 0;
        stopSound(MUSIC);
        cancelAnimationFrame(bossRenderFrame);
        bossAttackTimer.destroy();
        orbHealTimer.destroy();

        // Endgame
        const cigan = new Timer(() => {
            INGAME = false;
            stopRendering();
            Graphics.clearScreen();
                        
            // Drawing endscreen
            const endscreen = Graphics.createImage(`${PATH_SPRITES}/Level 1/Endscreen.jpg`);
            endscreen.onload = () => {
                Graphics.drawImage({
                    x: CANVAS_UI.width / 2 - endscreen.width / 2,
                    y: CANVAS_UI.height / 2 - endscreen.height / 2,
                    sprite: endscreen,
                    ctx: UI_CTX,
                });

                // Drawing endscreen button
                const timer = new Timer(() => {
                    new Button({
                        w: 200,
                        h: 50,
                        x: CANVAS_UI.width / 2 - 100,
                        y: CANVAS_UI.height / 2 + 325,
                        sprite: `${PATH_IMAGES}/Button.png`,
                        text: "Main menu",
                        action: () => {
                            MainMenu();
                        },
                        ctx: UI_CTX,
                    });
                }, 2000);
                timer.start();

                // Playing endscreen music
                MUSIC.src = `${PATH_AUDIO}/Level 1/Endscreen.mp3`;
                MUSIC.play();
            }
        }, 2000);
        cigan.start();
    }

    // Death of the player
    else if (PLAYER.isDead){
        cancelAnimationFrame(bossRenderFrame);
        bossAttackTimer.destroy();
        orbHealTimer.destroy();
    }

    // Keep rendering
    else {
        bossRenderFrame = requestAnimationFrame(bossFightRender);
    }
}

/*
    Looping boss attacks
*/
let bossAttackTimer = null;
const bossAttack = () => {
    // If player is outside of the boss area, always use attack 1
    if (PLAYER.center.x < BOSS_AREA.left || PLAYER.center.x > BOSS_AREA.right){
        attack1();
    }
    else {
        // Randomizing attack
        if (randomNumber(1, 4) === 1){
            attack1();
        }
        else {
            if (!BOSS.isCharging){
                attack2();
            }
        }
    }

    if (randomNumber(1, 2) === 1){
        BOSS.jump();
    }

    // Queueing next attack
    if (BOSS){
        bossAttackTimer = new Timer(bossAttack, BOSS.attackCooldown);
        bossAttackTimer.start();
    }
}

/*
    Drawing boss health bar UI
*/
const drawBossHealthBar = () => {
    // Drawing health UI
    Graphics.drawImage({
        x: CANVAS_UI.width - BOSS.healthUI.width - 25,
        y: 25,
        sprite: BOSS.healthUI,
        ctx: UI_CTX,
    });

    // HP Shell properties
    const HPShellBorderSize = 	    0;
    const HPShellBorderColor =      "#552f2f";
    const HPShellWidth = 			(BOSS.maxHP / 4) - (HPShellBorderSize * 2);
    const HPShellHeight = 			27 - (HPShellBorderSize * 2);
    const HPShellColor = 			"#552f2f";
    const HPShellPositionX = 		CANVAS_UI.width - BOSS.healthUI.width - 5;
    const HPShellPositionY = 		39;
    // HP Bar properties
    const HPScale = 				HPShellWidth / BOSS.maxHP;
    const HPBarWidth = 				BOSS.currentHP * HPScale;
    const HPBarHealthNumber =       BOSS.currentHP;
    const HPBarHeight = 			HPShellHeight;
    const HPBarColors = 			{healthy: "#226d34", weakened: "#6d6c22", critical: "#a92d2d"};
    let   HPBarColor = 			    null;
    const HPBarPositionX = 			HPShellPositionX + (BOSS.maxHP / 4 - BOSS.currentHP / 4);
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
    // Graphics.drawText({x: HPShellPositionX + HPShellWidth / 2 - 10, y: HPShellPositionY + HPShellHeight / 2 + 4, size: 15, color: "White", content: HPBarHealthNumber, align: "Center", font: GAME_FONT});
}

/*
    Spawning orbs of rejuvenation every 30 seconds
*/
let orbHeal = null;
let orbHealTimer = null;
let orbHealSpawnTime = 30000;
const createOrbOfRejuvenation = () => {
    // Create new orb if the old one was collected
    if (!orbHeal){
        // Randomizing location where the orb will spawn
        const randomPos = randomNumber(1, 2) === 1 ? {x: 10525,	y: 450} : {x: 11645, y: 450};
        orbHeal = new OrbOfRejuvenation({
            x: randomPos.x,
            y: randomPos.y,
            w: 30,
            h: 30,
            sprite: {
                default: `${PATH_SPRITES}/Orbs/OrbOfRejuvenation.png`,
            },
            healPercentage: 0.25,
        });
    }

    orbHealTimer = new Timer(createOrbOfRejuvenation, orbHealSpawnTime);
    orbHealTimer.start();
}

/*
    Attack 1
*/
const attack1 = () => {
    // Face the player before initiating an attack
    if (PLAYER.center.x < BOSS.center.x){
        BOSS.direction.left = true;
        BOSS.direction.right = false;
    }
    else if (PLAYER.center.x > BOSS.center.x){
        BOSS.direction.right = true;
        BOSS.direction.left = false;
    }

    BOSS.shurikenSize = {           // Shuriken size
        w: 50,
        h: 50
    };
    BOSS.shurikenVelocity = {       // Shuriken velocity
        x: 1,
        y: 1
    };
    BOSS.shurikenPosition = {       // Shuriken spawn position
        x: BOSS.direction.left ? BOSS.left + BOSS.shurikenSize.w / 2 : BOSS.right - BOSS.shurikenSize.w / 2,
        y: BOSS.top + BOSS.shurikenSize.h / 2,
    }
    BOSS.shurikenDamage = 20;           // Shuriken damage
    BOSS.shurikenLifeDuration = 100000;   // How long will shuriken exist before it disappears
    BOSS.shurikenSeekingDuration = 5000; // For how long the shuriken will actively seek an enemy

    // Creating the shuriken
    let shuriken = new Missile({
        x: BOSS.shurikenPosition.x,
        y: BOSS.shurikenPosition.y,
        w: BOSS.shurikenSize.w,
        h: BOSS.shurikenSize.h,
        velocity: {
            x: 0,
            y: 0,
        },
        sprite: {
            left: `${PATH_SPRITES}/Level 1/Boss/Attack 1/MissileLeft.png`,
            right: `${PATH_SPRITES}/Level 1/Boss/Attack 1/MissileRight.png`,
            default: `${PATH_SPRITES}/Level 1/Boss/Attack 1/MissileLeft.png`,
        },
        damage: BOSS.shurikenDamage,
        owner: BOSS,
    });

    // Creating additional shuriken properties
    shuriken.isSeeking = true;

    // Adding shuriken to the shuriken array
    BOSS.shurikens.push(shuriken);

    // Removing shuriken after its duration time
    const shurikenDeathTimer = new Timer(() => {
        removeFromArray(BOSS.shurikens, shuriken);
        removeFromArray(MISSILES, shuriken);
        shuriken = null;
    }, BOSS.shurikenLifeDuration);
    shurikenDeathTimer.start();

    // Disabling shuriken seeking after seeking duration
    const shurikenSeekingTimer = new Timer(() => shuriken.isSeeking = false, BOSS.shurikenSeekingDuration);
    shurikenSeekingTimer.start();
}
const attack1Check = () => {
    BOSS.shurikens.forEach(shuriken => {
        if (shuriken){
            /**
             * Shuriken is following the enemy
             */
            if (shuriken.isSeeking){
                /**
                 * distX < 0 means that the shuriken is on the right side relative to the player, > 0 means it is on the left side
                 * distY < 0 means that the shuriken is on the top side relative to the player, > 0 means it is on the bottom side
                 */
                const distX = PLAYER.center.x - shuriken.center.x;
                const distY = PLAYER.center.y - shuriken.center.y;

                // Following on X axis
                if (distX < 0){
                    shuriken.velocity.x = distX < -BOSS.shurikenVelocity.x ? -BOSS.shurikenVelocity.x : distX;
                }
                else if (distX > 0) {
                    shuriken.velocity.x = distX > BOSS.shurikenVelocity.x ? BOSS.shurikenVelocity.x : distX;
                }
                
                // Following on Y axis
                if (distY < 0){
                    shuriken.velocity.y = distY < -BOSS.shurikenVelocity.y ? -BOSS.shurikenVelocity.y : distY;
                }
                else if (distY > 0) {
                    shuriken.velocity.y = distY > BOSS.shurikenVelocity.y ? BOSS.shurikenVelocity.y : distY;
                }
            }

            // Updating shuriken position
            shuriken.position.x += shuriken.velocity.x;
            shuriken.position.y += shuriken.velocity.y;
        }
    });
}

/*
    Attack 2
*/
const attack2 = () => {
    // Face the player before initiating an attack
    if (PLAYER.center.x < BOSS.center.x){
        BOSS.direction.left = true;
        BOSS.direction.right = false;
    }
    else if (PLAYER.center.x > BOSS.center.x){
        BOSS.direction.right = true;
        BOSS.direction.left = false;
    }

    BOSS.chargeVelocityMax = 15;                                      // Maximum charging speed
    BOSS.chargeVelocityIncrement = BOSS.chargeVelocityMax / GAME_FPS; // Over the course of 1 second boss charges to its maximum speed
    BOSS.chargeVelocityX = 0;                                         // Charging velocity
    BOSS.contactDamage = 40;                                          // Damage you receive when colliding with the boss
    BOSS.chargePoint = PLAYER.center.x;                               // Point towards which the boss will be charging
    BOSS.chargeDirection = BOSS.direction.left ? -1 : 1;              // Determines which way the boss is charging based on its facing direction

    // Start charging
    BOSS.isCharging = true;
}
const attack2Check = () => {
    /*
        Increasing charging speed
    */
    if (BOSS.chargeVelocityX >= BOSS.chargeVelocityMax){
        BOSS.chargeVelocityX = BOSS.chargeVelocityMax;
    }
    else {
        BOSS.chargeVelocityX = BOSS.chargeVelocityX + BOSS.chargeVelocityIncrement;
    }

    // Updating boss velocity
    BOSS.velocity.x = BOSS.chargeVelocityX * BOSS.chargeDirection;

    // Checking which direction boss is charging
    if (BOSS.chargeDirection === -1){
        // Charging left
        // Checking whether boss has reached chargePoint
        if (BOSS.left <= BOSS.chargePoint){
            // Stop the attack
            BOSS.isCharging = false;
            BOSS.velocity.x = 0;
            BOSS.contactDamage = 10;
            return;
        }
    }
    else if (BOSS.chargeDirection === 1){
        // Charging right
        // Checking whether boss has reached chargePoint
        if (BOSS.right >= BOSS.chargePoint){
            // Stop the attack and reset contact damage
            BOSS.isCharging = false;
            BOSS.velocity.x = 0;
            BOSS.contactDamage = 10;
            return;
        }
    }
}