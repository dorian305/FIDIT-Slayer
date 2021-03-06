import { Graphics } from "./classes/Graphics.js";
import { createSound } from "./functions/createsound.js";
import { stopSound } from "./functions/stopsound.js";
import { level1 } from "./levels/level1/level1.js";
import { Button } from "./classes/Button.js";
import { Timer } from "./classes/Timer.js";
import { randomNumber } from "./functions/randomnumber.js";

/*
    Starting intro cutscene.
*/
export const introCutscene = () => {

    const loadingScreenDelay = 0;
    const gameControlsDelay = 0;

    /*
        Creating a division where intro cutscene text will be animated.
    */
    const wrapper = document.createElement("div");
    const text = document.createElement("div");
    wrapper.id = "introWrapper";
    wrapper.setAttribute("data-scene", "Scene1");
    wrapper.appendChild(text);
    text.innerText = `Once upon a time, the OIRI clan ruled the land of UNIRI. It was an auspicious period with an idyllic symbiosis between man and nature.

        For ten thousand years, civilisation advanced and prospered under the guardianship of OIRI. However, a competing clan of discontents was growing in the land. The clan was called FIDIT.

        One day, after hundreds of years of scheming, the terrifying millennium old ruler of FIDIT, TVRTKO, had commanded his minions to take over and annihilate the clan of OIRI. This dreadful affair became known as The Great War of UNIRI.

        He was an utterly cruel, blackhearted, and vicious monster who ordered the complete annihiliation of the humans of OIRI. The OIRI clan was thus reduced to a few hundred surviving members of whom all retreated to the underground where they hid from the FIDIT scourge.

        Now, a century later, humans have begun growing in power once again as the control of TVRTKO rots and fractures into chaos and disorder, an otherwise natural resolution to his rule. 

        In this period, one of the formidable heroes and leaders of humans is POBAR. At present, he is imprisoned inside what used to be the Palace of OIRI, a place corrupted in an appalling and despicable act of revenge and reduced to a mere ghastly dungeon.
        
        He is here because one of his previous missions had failed and resulted in his capture; but, as fate is about to reveal, his role will become legendary.`;
    document.body.insertAdjacentElement('beforeend', wrapper);
    text.style.marginTop = `600px`;

    /*
        Playing intro cutscene audio.
    */
    const cutsceneAudio = createSound(`${PATH_AUDIO}/Intro/Intro.mp3`);
    cutsceneAudio.volume = 0.5;
    cutsceneAudio.play();

    /*
        Starting intro cutscene illustrations.
    */
    //  Scene 1
    let scene = Graphics.createImage(`${PATH_SPRITES}/Intro/Scene1.jpg`);
    scene.onload = () => {
        Graphics.drawImage({
            x: CANVAS_UI.width / 2 - scene.width / 2,
            y: CANVAS_UI.height / 2 - scene.height / 2,
            ctx: UI_CTX,
            sprite: scene
        });
        const timer = new Timer(drawSkipCutsceneButton, 0);
        timer.start();
    }
    const interval = setInterval(() => {
        let margin = parseFloat(text.style.marginTop);
        if (margin > -2000){
            margin -= 1;
            text.style.marginTop = `${margin}px`;

            // Scene 2
            if (margin <= 290 && margin > -70 && wrapper.getAttribute("data-scene") !== "Scene2"){
                Graphics.clearScreen();
                wrapper.setAttribute("data-scene", "Scene2");
                drawScene(`${PATH_SPRITES}/Intro/Scene2.jpg`);
            }

            // Scene 3
            else if (margin <= -70 && margin > -490 && wrapper.getAttribute("data-scene") !== "Scene3"){
                Graphics.clearScreen();
                wrapper.setAttribute("data-scene", "Scene3");
                drawScene(`${PATH_SPRITES}/Intro/Scene3.jpg`);
            }

            // Scene 4
            else if (margin <= -490 && margin > -930 && wrapper.getAttribute("data-scene") !== "Scene4"){
                Graphics.clearScreen();
                wrapper.setAttribute("data-scene", "Scene4");
                drawScene(`${PATH_SPRITES}/Intro/Scene4.jpg`);
            }

            // Scene 5
            else if (margin <= -930 && margin > -1230 && wrapper.getAttribute("data-scene") !== "Scene5"){
                Graphics.clearScreen();
                wrapper.setAttribute("data-scene", "Scene5");
                drawScene(`${PATH_SPRITES}/Intro/Scene5.jpg`);
            }

            // Scene 6
            else if (margin <= -1230 && margin > -1620 && wrapper.getAttribute("data-scene") !== "Scene6"){
                Graphics.clearScreen();
                wrapper.setAttribute("data-scene", "Scene6");
                drawScene(`${PATH_SPRITES}/Intro/Scene6.jpg`);
            }

            // Scene 7
            else if (margin <= -1620 && margin > -1950 && wrapper.getAttribute("data-scene") !== "Scene7"){
                Graphics.clearScreen();
                wrapper.setAttribute("data-scene", "Scene7");
                drawScene(`${PATH_SPRITES}/Intro/Scene7.jpg`);
            }
        }
        else {
            endCutscene();
            BUTTONS.length = 0;
        }
    }, 50);

    // Creating skip cutscene button
    const drawSkipCutsceneButton = () => {
        BUTTONS.length = 0;
        new Button({
            w: 200,
            h: 50,
            x: CANVAS_UI.width / 2 - 100,
            y: CANVAS_UI.height / 2 + 350,
            ctx: UI_CTX,
            sprite: `${PATH_IMAGES}/Button.png`,
            text: "Skip cutscene",
            action: () => {
                endCutscene();
                BUTTONS.length = 0;
            }
        });
    }

    // End cutscene
    const endCutscene = () => {
        clearInterval(interval);
        wrapper.remove();
        Graphics.clearScreen();
        stopSound(cutsceneAudio);
        startLevel1();
    }

    // Draw scene
    const drawScene = imgSrc => {
        const img = Graphics.createImage(imgSrc);
        img.onload = () => {
            Graphics.drawImage({
            x: CANVAS_UI.width / 2 - img.width / 2,
            y: CANVAS_UI.height / 2 - img.height / 2,
            ctx: UI_CTX,
            sprite: img
          });
          drawSkipCutsceneButton();
        }
    }

    // Start level 1
    const startLevel1 = () => {
        Graphics.clearScreen();
        const loading = Graphics.createImage(`${PATH_SPRITES}/Level 1/Loading.jpg`);
        loading.onload = () => {
            Graphics.drawImage({
                x: CANVAS_UI.width / 2,
                y: CANVAS_UI.height / 2,
                ctx: UI_CTX,
                sprite: loading,
                align: "center",
            });

            // Drawing a tip
            const tips = [
                "your character won't take damage when debug mode is enabled (Z).",
                "collecting red orbs will increase your maximum health.",
                "collecting green orbs replenishes health.",
            ];
            Graphics.drawText({
                x: CANVAS_UI.width / 2,
                y: CANVAS_UI.height / 2 + 325,
                size: 20,
                color: "white",
                content: `TIP: ${tips[randomNumber(0, tips.length - 1)]}`,
                align: "center",
                font: "Roboto Slab",
                ctx: UI_CTX,
            })
            const timer = new Timer(displayGameControls, loadingScreenDelay);
            timer.start();
        }
    }

    // Display game controls
    const displayGameControls = () => {
        Graphics.clearScreen();
        const gameControls = Graphics.createImage(`${PATH_IMAGES}/GameControls.png`);
        gameControls.onload = () => {
            Graphics.drawImage({
                x: CANVAS_UI.width / 2 - gameControls.width / 2,
                y: CANVAS_UI.height / 2 - gameControls.height / 2,
                ctx: UI_CTX,
                sprite: gameControls,
            });
            const timer = new Timer(() => {
                new Button({
                    w: 200,
                    h: 50,
                    x: CANVAS_UI.width / 2 - 100,
                    y: CANVAS_UI.height / 2 + 350,
                    ctx: UI_CTX,
                    sprite: `${PATH_IMAGES}/Button.png`,
                    text: "Skip",
                    action: () => {
                        CURRENT_LEVEL = level1;
                        CURRENT_LEVEL();
                    }
                });
            }, gameControlsDelay);
            timer.start();
        }
    }
}