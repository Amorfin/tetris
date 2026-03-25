import Storage from "./Storage.js";



/**
 * Sound Controller
 */
export default class Sounds {
    /**
     * Sound Controller Constructor
     * @constructor
     * @param {String} storageName
     */
    constructor(storageName) {
        this.data    = new Storage(storageName, true);
        this.mute    = !!this.data.get();
        this.old     = this.mute;
        this.labels  = { mute: "Mute", unmute: "Unmute" };

        /** @type {HTMLElement} */
        this.audio   = document.querySelector(".audio");

        /** @type {HTMLElement} */
        this.waves   = document.querySelector(".waves");

        /** @type {HTMLElement} */
        this.element = document.querySelector(".mute");

        this.setDisplay();
    }

    /**
     * Plays a Sound
     * @param {String} sound
     * @returns {Void}
     */
    play(sound) {
        if (!this.mute) {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = "square";
                const toneMap = {
                    drop: 220,
                    line: 440,
                    rotate: 330,
                    crash: 140,
                    pause: 260,
                    end: 180,
                };
                osc.frequency.value = toneMap[sound] || 300;
                gain.gain.value = 0.08;
                osc.start();
                osc.stop(ctx.currentTime + 0.12);
            } catch (e) {
                // Ignore audio errors
            }
        }
    }

    /**
     * Mute/Unmute the sound
     * @param {Boolean=} mute
     * @returns {Void}
     */
    toggle(mute) {
        this.mute = mute !== undefined ? mute : !this.mute;
        this.setDisplay();
        this.data.set(this.mute ? 1 : 0);
    }

    /**
     * Set localized labels
     * @param {{mute: string, unmute: string}} labels
     */
    setLabels(labels) {
        if (labels) {
            this.labels = labels;
        }
        this.setDisplay();
    }

    /**
     * Used to mute the sound for a short period
     * @returns {Void}
     */
    startMute() {
        this.old = this.mute;
        this.toggle(true);
    }

    /**
     * Resets the Mute to the original value
     * @returns {Void}
     */
    endMute() {
        this.toggle(this.old);
    }

    /**
     * Returns true if the sound is off and false if is on
     * @returns {Boolean}
     */
    isMute() {
        return this.mute;
    }

    /**
     * Sets the display of the sound waves
     * @returns {Void}
     */
    setDisplay() {
        if (this.audio && this.waves) {
            this.waves.style.display = this.mute ? "none" : "block";
        }
        if (this.element) {
            this.element.innerHTML = this.mute ? this.labels.unmute : this.labels.mute;
        }
    }
}
