import { Fireball }             from "../../classes/Fireball.js";
import { Timer }                from "../../classes/Timer.js";
import { randomNumber }         from "../../functions/randomnumber.js";

export const spawnFireballs = () => {
    /*
        Spawning fireballs at given coordinates.
    */
    const spawnFireball = ({x, y}) => {
        let fireball = null;
        fireball = new Fireball({
            x: x,
            y: y,
            w: 32,
            h: 50,
            sprite: {
                up: `${PATH_SPRITES}/Level 1/FireballUp.png`,
                down: `${PATH_SPRITES}/Level 1/FireballDown.png`,
                default: `${PATH_SPRITES}/Level 1/FireballUp.png`,
            },
        });
        fireball.velocity.y = -10 * randomNumber(2, 3);
        
        // When current fireball gets destroyed, spawn another one
        const fireballTimer = new Timer(() => spawnFireball({x: x, y: y}), 1500 * randomNumber(1, 2));
        fireballTimer.start();
    }

    // Start fireball spawning in the level
    const fireballCoordinates = [
        {x: 6805, y: 950},
        {x: 7160, y: 950},
        {x: 9800, y: 950},
    ];
    for (let i = 0; i < 3; i++){
        const fireballTimer = new Timer(() => spawnFireball(fireballCoordinates[i]), 1000 + (i * 500));
        fireballTimer.start();
    }
}