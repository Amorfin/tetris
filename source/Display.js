/**
 * Tetris Display
 */
export default class Display {

    /**
     * Tetris Display constructor
     */
    constructor() {
        this.current   = "mainScreen";
        this.container = document.querySelector("#container");
        this.header    = document.querySelector(".messages h2");
        this.paragraph = document.querySelector(".messages p");

        this.messages  = {
            mainScreen : [ "Тетрис",        "Выберите начальный уровень" ],
            paused     : [ "Пауза",        "Продолжить игру?"          ],
            continuing : [ "Продолжение",  "Продолжить игру?"          ],
            gameOver   : [ "Игра окончена",""                          ],
            highScores : [ "Рекорды",      "Лучшие результаты"         ],
            help       : [ "Помощь",       "Управление"                ]
        };
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
