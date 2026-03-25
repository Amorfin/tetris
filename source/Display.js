/**
 * Game Display
 */
export default class Display {

    /**
     * Display constructor
     * @param {Object=} messages
     */
    constructor(messages = null) {
        this.current   = "mainScreen";
        this.container = document.querySelector("#container");
        this.header    = document.querySelector(".messages h2");
        this.paragraph = document.querySelector(".messages p");

        this.messages  = messages || {
            mainScreen : [ "Neon Blocks", "Select starting level" ],
            paused     : [ "Paused", "Continue the game?" ],
            continuing : [ "Continue", "Continue the game?" ],
            gameOver   : [ "Game Over", "" ],
            highScores : [ "High Scores", "Best results" ],
            help       : [ "Help", "Controls" ]
        };
    }

    /**
     * Updates localized messages
     * @param {Object} messages
     */
    setMessages(messages) {
        if (messages) {
            this.messages = messages;
        }
    }

    /**
     * Gets the Game Display
     * @returns {String}
     */
    get() {
        return this.current;
    }

    /**
     * Sets the Game Display
     * @param {String} current
     * @returns {Display}
     */
    set(current) {
        this.current = current;
        return this;
    }

    /**
     * Show the message
     */
    show() {
        this.container.className = this.current;
        this.header.innerHTML    = this.messages[this.current][0];
        this.paragraph.innerHTML = this.messages[this.current][1];
    }

    /**
     * Hide the message
     */
    hide() {
        this.container.className = "playing";
    }

    /**
     * Returns true if the current is in the main screen
     * @returns {Boolean}
     */
    get isMainScreen() {
        return this.current === "mainScreen";
    }

    /**
     * Returns true if the current is in playing mode
     * @returns {Boolean}
     */
    get isPlaying() {
        return this.current === "playing";
    }

    /**
     * Returns true if the current is in paused mode
     * @returns {Boolean}
     */
    get isPaused() {
        return this.current === "paused";
    }
}

