import { removeFromArray } from "../functions/removefromarray.js";
/*
  A timer class. Creating an instance of this class gives you a timer that can be paused and resumed.
*/
export class Timer {
    constructor(callback, delay) {
        this.callback = callback;     // Function that will execute when the timer expires
        this.remainingTime = delay;   // Time until the timer expires, in milliseconds
        this.startedTime = 0;         // Date when the timer was started, in milliseconds
        this.pausedTime = 0;          // Date when the timer was paused, in milliseconds
        this.timerId = 0;             // The ID of the timer

        // Adding timer to array of timers on creation
        TIMERS.push(this);
    }

    // Pausing the timer
    pause() {
        this.pausedTime = new Date();
        clearTimeout(this.timerId);
        this.remainingTime = this.remainingTime - (this.pausedTime - this.startedTime);
    }

    // Resuming the timer
    resume() {
        this.startedTime = new Date();
        clearTimeout(this.timerId);
        this.timerId = setTimeout(() => {
            this.callback();
            removeFromArray(TIMERS, this);
        }, this.remainingTime);
    }

    // Starting the timer
    start() {
        this.startedTime = new Date();
        this.timerId = setTimeout(() => {
            this.callback();
            removeFromArray(TIMERS, this);
        }, this.remainingTime);
    }

    // Destroying the timer
    destroy() {
        clearTimeout(this.timerId);
    }
}