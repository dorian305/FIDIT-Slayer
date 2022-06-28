import { EnemyBoss } from "../../classes/Characters/EnemyBoss.js";
import { Timer } from "../../classes/Timer.js";
import { randomNumber } from "../../functions/randomnumber.js";
import { Missile } from "../../classes/Weapons/Missile.js";
import { stopSound } from "../../functions/stopsound.js";
import { removeFromArray } 	from "../../functions/removefromarray.js";

let bossRenderFrame = null;
let bossAttackTimer = null;

export const bossFight = () => {
    // Spawning the boss
    BOSS = new EnemyBoss({
        x: 11000,
        y: 200,
        w: 281,
        h: 165,
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
            default: `${PATH_SPRITES}/Level 1/Boss/BossIdleRight.png`,
        },
        attackCooldown: 3000,
    });

    // Creating BOSS attack properties
    BOSS.isCharging = false;
    BOSS.shurikens = [];

    // Playing boss fight Music
    stopSound(LEVEL_MUSIC);
    LEVEL_MUSIC.src = `${PATH_AUDIO}/Level 1/BossFight.mp3`;
    LEVEL_MUSIC.play();

    // Starting boss fight
    const timer = new Timer(() => {
        bossAttack();
        bossFightRender();
    }, 1000);
    timer.start();
}


// Rendering boss fight
const bossFightRender = () => {
    /*
        Boss attack 1
    */
   if (BOSS.shurikens.length > 0){
        attack1Check();
   }
    /*
        Boss attack 2 checking
    */
    if (BOSS.isCharging){
        attack2Check();
    }

    // Death of the boss
    if (BOSS.currentHP <= 0){
        BOSS = null;
        stopSound(LEVEL_MUSIC);
        cancelAnimationFrame(bossRenderFrame);
        bossAttackTimer.destroy();

        // Endgame
        // ...
    }

    // Keep rendering
    else {
        bossRenderFrame = requestAnimationFrame(bossFightRender);
    }
}

// Looping attacks
const bossAttack = () => {
    // If player is outside of the boss area, always use attack 1
    if (PLAYER.center.x < BOSS_AREA.left || PLAYER.center.x > BOSS_AREA.right){
        attack1();
    }
    else {
        // Randomizing attack
        if (randomNumber(1, 2) === 1){
            attack1();
        }
        else {
            if (!BOSS.isCharging){
                attack2();
            }
        }
    }

    // Queueing next attack
    if (BOSS){
        bossAttackTimer = new Timer(bossAttack, BOSS.attackCooldown);
        bossAttackTimer.start();
    }
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
        w: 100,
        h: 100
    };
    BOSS.shurikenVelocity = {       // Shuriken velocity
        x: 3,
        y: 3
    };
    BOSS.shurikenPosition = {       // Shuriken spawn position
        x: BOSS.direction.left ? BOSS.left + BOSS.shurikenSize.w / 2 : BOSS.right - BOSS.shurikenSize.w / 2,
        y: BOSS.top + BOSS.shurikenSize.h / 2,
    }
    BOSS.shurikenDamage = 45;           // Shuriken damage
    BOSS.shurikenLifeDuration = 4000;   // How long will shuriken exist before it dissapears

    // Creating the shuriken
    const shuriken = new Missile({
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

    // Adding shuriken to the shuriken array
    BOSS.shurikens.push(shuriken);

    // Removing shuriken after some time
    const timer = new Timer(() => {
        removeFromArray(BOSS.shurikens, shuriken);
        removeFromArray(MISSILES, shuriken);
    }, BOSS.shurikenLifespan);
    timer.start();
}
const attack1Check = () => {
    BOSS.shurikens.forEach(shuriken => {
        if (shuriken){
            /*
                Moving shuriken on the X axis
            */
            // If player center x is to the left of the shuriken, move shuriken left
            if (PLAYER.right < shuriken.left){
                shuriken.position.x = shuriken.position.x - BOSS.shurikenVelocity.x;
                console.log("Moving left");
            }
            // If player center x is to the right of the shuriken, move shuriken right
            else if (PLAYER.left > shuriken.right) {
                shuriken.position.x = shuriken.position.x + BOSS.shurikenVelocity.x;
                console.log("Moving right");
            }
            
            /*
            Moving shuriken on the Y axis
            */
           // If player center y is above the shuriken center y, move shuriken up
           if (PLAYER.bottom < shuriken.top){
               shuriken.position.y = shuriken.position.y - BOSS.shurikenVelocity.y;
               console.log("Moving up");
            }
            // If player center y is below the shuriken center y, move shuriken down
            else if (PLAYER.top > shuriken.bottom) {
                shuriken.position.y = shuriken.position.y + BOSS.shurikenVelocity.y;
                console.log("Moving down");
            }
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
    BOSS.contactDamage = 30;                                          // Damage you receive when colliding with the boss
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