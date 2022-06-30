export function stopSound(sound){
    if (sound){
        sound.pause();
        sound.currentTime = 0;
    }
}