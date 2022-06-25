import { Graphics } from "./classes/Graphics.js";
import { createSound } from "./functions/createSound.js";
import { stopSound } from "./functions/stopSound.js";
import { level1 } from "./levels/level1/level1.js";
import { Button } from "./classes/Button.js";

export const introCutscene = () => {
    Graphics.clearScreen();

    // Creating intro textbox
    const wrapper = document.createElement("div");
    const text = document.createElement("div");
    wrapper.id = "introWrapper";
    wrapper.appendChild(text);
    text.innerText = `Once upon a time, the OIRI clan ruled the land of UNIRI. It was an auspicious period with an idyllic symbiosis between man and nature.

        For ten thousand years, civilization advanced and prospered under the guardianship of OIRI. However, a competing clan of discontents was growing in the land. The clan was called FIDIT.

        One day, after hundreds of years of scheming, the terrifying millennium old ruler of FIDIT, TVRTKO, had commanded his minions to take over and annihilate the clan of OIRI. This dreadful affair became known as The Great War of UNIRI.

        He was an utterly cruel, blackhearted, and vicious monster who ordered the complete annihiliation of the humans of OIRI. The OIRI clan was thus reduced to a few hundred surviving members of whom all retreated to the underground where they hid from the FIDIT scourge.

        Now, a century later, humans have begun growing in power once again as the control of TVRTKO rots and fractures into chaos and disorder, an otherwise natural resolution to his rule. 

        In this period, one of the formidable heroes and leaders of humans is POBAR. At present, he is imprisoned inside what used to be the Palace of OIRI, a place corrupted in an appalling and despicable act of revenge and reduced to a mere ghastly dungeon. He is here because one of his previous missions had failed and resulted in his capture; but, as fate is about to reveal, his role will become legendary.`;
    document.body.insertAdjacentElement('beforeend', wrapper);
    text.style.marginTop = `600px`;

    // Intro sequence audio
    const cutsceneAudio = createSound(`${PATH_AUDIO}/Intro/Intro.mp3`);
    cutsceneAudio.play();

    // Scrolling text upwards
    const interval = setInterval(() => {
        let margin = parseFloat(text.style.marginTop);
        if (margin > -1900){
            margin -= 1;
            text.style.marginTop = `${margin}px`;
        }
        else {
            endCutscene();
            setTimeout(() => {
                startLevel1();
            }, 3000);
        }
    }, 50);

    // Creating skip cutscene button
    setTimeout(() => {
        new Button({
            w: 200,
            h: 50,
            x: CANVAS.width / 2 - 100,
            y: CANVAS.height / 2 + 375,
            sprite: `${PATH_IMAGES}/Button.png`,
            text: "Skip intro",
            action: () => {
                endCutscene();
            }
        });
    }, 5000);

    // Skip cutscene
    const endCutscene = () => {
        clearInterval(interval);
        wrapper.remove();
        stopSound(cutsceneAudio);
        startLevel1();
    }

    // Start level 1
    const startLevel1 = () => {
        CURRENT_LEVEL = level1;
        CURRENT_LEVEL();
    }
}