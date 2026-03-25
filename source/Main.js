import Board        from "./Board.js";
import Display      from "./Display.js";
import HighScores   from "./HighScores.js?v=35";
import Keyboard     from "./Keyboard.js";
import Level        from "./Level.js";
import Score        from "./Score.js";
import Tetriminos   from "./Tetriminos.js";

// Utils
import Sounds       from "../utils/Sounds.js";
import Utils        from "../utils/Utils.js";

// Variables
let display    = null;
let level      = null;
let sounds     = null;
let scores     = null;
let keyboard   = null;
let board      = null;
let score      = null;
let tetriminos = null;
let animation  = null;
let startTime  = null;
let ysdk       = null;
let rewardBtn  = null;
let rewardUsed = false;

// Constants
const tetriminoSize   = 2;
const maxInitialLevel = 10;
const rewardBonus     = 500;
const gameId          = "neonblocks";

const I18N = {
    ru: {
        gameName: "Neon Blocks",
        main: {
            title: "Neon Blocks",
            subtitle: "Выберите начальный уровень",
            speed: "Уровень скорости:"
        },
        menu: {
            start: "Старт (<u>O</u>)",
            highScores: "Рекорды (<u>I</u>)",
            help: "Помощь (<u>H</u>)",
            continue: "Продолжить (<u>P</u>)",
            newGame: "Новая игра (<u>N</u>)",
            pause: "Пауза (<u>P</u>)"
        },
        input: {
            name: "Имя игрока:",
            ok: "ОК (<u>Enter</u>)",
            reward: "Реклама за бонус +500"
        },
        high: {
            none: "Пока нет рекордов",
            reset: "Сбросить (<u>R</u>)",
            back: "Назад (<u>B</u>)"
        },
        controls: {
            keyLeft: "<b>Стрелка влево</b>",
            keyRight: "<b>Стрелка вправо</b>",
            keyDown: "<b>Стрелка вниз</b>",
            keyRotateRight: "<b>X</b> или <b>Стрелка вверх</b>",
            keyRotateLeft: "<b>Z</b>",
            keyHardDrop: "<b>C</b>",
            keyPause: "<b>P</b>",
            keySound: "<b>M</b>",
            keyStart: "<b>O</b>",
            moveLeft: "Сдвиг влево",
            moveRight: "Сдвиг вправо",
            softDrop: "Мягкое падение",
            rotateRight: "Поворот вправо",
            rotateLeft: "Поворот влево",
            hardDrop: "Жёсткое падение",
            pause: "Пауза",
            sound: "Звук вкл/выкл",
            start: "Старт",
            note: "Используйте ссылки или клавиши из подсказок в скобках."
        },
        side: {
            next: "Следующий",
            level: "Уровень",
            score: "Счёт",
            lines: "Линии"
        },
        messages: {
            mainScreen: [ "Neon Blocks", "Выберите начальный уровень" ],
            paused: [ "Пауза", "Продолжить игру?" ],
            continuing: [ "Продолжение", "Продолжить игру?" ],
            gameOver: [ "Игра окончена", "" ],
            highScores: [ "Рекорды", "Лучшие результаты" ],
            help: [ "Помощь", "Управление" ]
        },
        table: { name: "имя", level: "ур.", score: "счёт" },
        sound: { mute: "Звук выкл (<u>M</u>)", unmute: "Звук вкл (<u>M</u>)" }
    },    en: {
        gameName: "Neon Blocks",
        main: {
            title: "Neon Blocks",
            subtitle: "Select starting level",
            speed: "Speed level:"
        },
        menu: {
            start: "Start (<u>O</u>)",
            highScores: "High scores (<u>I</u>)",
            help: "Help (<u>H</u>)",
            continue: "Continue (<u>P</u>)",
            newGame: "New game (<u>N</u>)",
            pause: "Pause (<u>P</u>)"
        },
        input: {
            name: "Player name:",
            ok: "OK (<u>Enter</u>)",
            reward: "Ad for bonus +500"
        },
        high: {
            none: "No records yet",
            reset: "Reset (<u>R</u>)",
            back: "Back (<u>B</u>)"
        },
        controls: {
            keyLeft: "<b>Left Arrow</b>",
            keyRight: "<b>Right Arrow</b>",
            keyDown: "<b>Down Arrow</b>",
            keyRotateRight: "<b>X</b> or <b>Up Arrow</b>",
            keyRotateLeft: "<b>Z</b>",
            keyHardDrop: "<b>C</b>",
            keyPause: "<b>P</b>",
            keySound: "<b>M</b>",
            keyStart: "<b>O</b>",
            moveLeft: "Move left",
            moveRight: "Move right",
            softDrop: "Soft drop",
            rotateRight: "Rotate right",
            rotateLeft: "Rotate left",
            hardDrop: "Hard drop",
            pause: "Pause",
            sound: "Sound on/off",
            start: "Start",
            note: "Use the links or the keys shown in brackets."
        },
        side: {
            next: "Next",
            level: "Level",
            score: "Score",
            lines: "Lines"
        },
        messages: {
            mainScreen: [ "Neon Blocks", "Select starting level" ],
            paused: [ "Paused", "Continue the game?" ],
            continuing: [ "Continue", "Continue the game?" ],
            gameOver: [ "Game Over", "" ],
            highScores: [ "High Scores", "Best results" ],
            help: [ "Help", "Controls" ]
        },
        table: { name: "name", level: "lv.", score: "score" },
        sound: { mute: "<u>M</u>ute", unmute: "Un<u>m</u>ute" }
    }
};

let currentLang = "en";

function getLangFromSdk() {
    const sdkLang = ysdk && ysdk.environment && ysdk.environment.i18n && ysdk.environment.i18n.lang;
    const lang = (sdkLang || navigator.language || "en").toLowerCase();
    return lang.startsWith("ru") ? "ru" : "en";
}

function getI18nValue(path) {
    return path.split(".").reduce((acc, key) => acc && acc[key], I18N[currentLang]);
}

function applyLanguage(lang) {
    currentLang = I18N[lang] ? lang : "en";
    const t = I18N[currentLang];
    document.title = t.gameName;
    document.documentElement.lang = currentLang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const value = getI18nValue(el.dataset.i18n);
        if (value !== undefined) el.textContent = value;
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
        const value = getI18nValue(el.dataset.i18nHtml);
        if (value !== undefined) el.innerHTML = value;
    });

    if (display) {
        display.setMessages(t.messages);
        display.show();
    }
    if (scores) {
        scores.setLabels(t.table);
    }
    if (sounds) {
        sounds.setLabels(t.sound);
    }
}

/**
 * Initialize Yandex Games SDK
 * @returns {Promise<Void>}
 */
function initSDK() {
    if (window.YaGames && typeof window.YaGames.init === "function") {
        return window.YaGames.init()
            .then((sdk) => {
                ysdk = sdk;
                if (ysdk.features && ysdk.features.LoadingAPI && typeof ysdk.features.LoadingAPI.ready === "function") {
                    ysdk.features.LoadingAPI.ready();
                }
                applyLanguage(getLangFromSdk());
            })
            .catch((err) => {
                console.error("Yandex SDK init error", err);
            });
    }
    return Promise.resolve();
}

/**
 * Show fullscreen ad
 * @returns {Void}
 */
function showFullscreenAd() {
    if (!ysdk || !ysdk.adv || typeof ysdk.adv.showFullscreenAdv !== "function") {
        return;
    }
    ysdk.adv.showFullscreenAdv({
        callbacks: {
            onError: (err) => console.error(err)
        }
    });
}

/**
 * Show rewarded ad and grant bonus
 * @returns {Void}
 */
function showRewardedAd() {
    if (rewardUsed) {
        return;
    }
    const grantReward = () => {
        rewardUsed = true;
        if (score) {
            score.score += rewardBonus;
            score.showScore();
        }
        if (rewardBtn) {
            rewardBtn.classList.add("disabled");
        }
    };

    const host = window.location.hostname;
    const isYandex = host.includes("yandex") || host.includes("games.s3.yandex.net") || host.includes("yandex.net");

    if (!ysdk || !ysdk.adv || typeof ysdk.adv.showRewardedVideo !== "function") {
        // Allow testing outside Yandex Games
        if (!isYandex) {
            grantReward();
        }
        return;
    }

    ysdk.adv.showRewardedVideo({
        callbacks: {
            onRewarded: () => grantReward(),
            onError: (err) => console.error(err)
        }
    });
}



/**
 * Show the Main Screen
 * @returns {Void}
 */
function showMainScreen() {
    display.set("mainScreen").show();
}

/**
 * Pause the Game
 * @returns {Void}
 */
function startPause() {
    display.set("paused").show();
    sounds.play("pause");
    cancelAnimation();
}

/**
 * Unpause the Game
 * @returns {Void}
 */
function endPause() {
    display.set("playing").hide();
    sounds.play("pause");
    requestAnimation();
}

/**
 * Toggles the pause
 * @returns {Void}
 */
function showPause() {
    if (display.isPaused) {
        endPause();
    } else {
        startPause();
    }
}

/**
 * Finish the Game
 * @returns {Void}
 */
function finishGame() {
    destroyGame();
    showMainScreen();
}

/**
 * Game Over
 * @returns {Void}
 */
function showGameOver() {
    display.set("gameOver").show();
    sounds.play("end");
    scores.setInput();
    destroyGame();
    rewardUsed = false;
    if (rewardBtn) {
        rewardBtn.classList.remove("disabled");
    }
    showFullscreenAd();
}

/**
 * Destroys the game elements
 * @returns {Void}
 */
function destroyGame() {
    board.clearElements();
    tetriminos.clearElements();
}

/**
 * Show the High Scores
 * @returns {Void}
 */
function showHighScores() {
    display.set("highScores").show();
    scores.show();
}

/**
 * Saves the High Score
 * @returns {Void}
 */
function saveHighScore() {
    if (scores.save(score.level, score.score)) {
        showHighScores();
    }
}

/**
 * Show the Help
 * @returns {Void}
 */
function showHelp() {
    display.set("help").show();
}



/**
 * Called when a wink ends
 */
function onWindEnd() {
    tetriminos.setHardDrop();
    requestAnimation();
}

/**
 * Starts a new game
 */
function newGame() {
    display.set("playing").hide();
    keyboard.reset();

    board      = new Board(tetriminoSize, onWindEnd);
    score      = new Score(level.get(), maxInitialLevel);
    tetriminos = new Tetriminos(board, sounds, score, tetriminoSize, showGameOver);

    requestAnimation();
}



/**
 * Request an animation frame
 * @returns {Void}
 */
function requestAnimation() {
    startTime = new Date().getTime();
    animation = window.requestAnimationFrame(() => {
        const time = new Date().getTime() - startTime;

        score.decTime(time);
        if (score.time < 0) {
            tetriminos.softDrop();
            score.resetTime();
        }
        keyboard.holdingKey();

        if (display.isPlaying && !board.isWinking()) {
            requestAnimation();
        }
    });
}

/**
 * Cancel an animation frame
 * @returns {Void}
 */
function cancelAnimation() {
    window.cancelAnimationFrame(animation);
}

/**
 * Creates the shortcuts functions
 * @returns {Object}
 */
function getShortcuts() {
    return {
        mainScreen : {
            O : () => newGame(),
            A : () => level.dec(),
            I : () => showHighScores(),
            D : () => level.inc(),
            H : () => showHelp(),
            M : () => sounds.toggle()
        },
        paused : {
            P : () => endPause(),
            B : () => finishGame()
        },
        gameOver : {
            O : () => saveHighScore(),
            B : () => showMainScreen()
        },
        highScores : {
            B : () => showMainScreen(),
            R : () => scores.restore()
        },
        help : {
            B : () => showMainScreen()
        },
        playing : {
            C : () => tetriminos.hardDrop(),
            W : () => tetriminos.rotateRight(),
            A : () => tetriminos.moveLeft(),
            S : () => tetriminos.softDrop(),
            D : () => tetriminos.moveRight(),
            X : () => tetriminos.rotateRight(),
            Z : () => tetriminos.rotateLeft(),
            P : () => startPause(),
            M : () => sounds.toggle()
        },
        number : (number) => {
            if (display.isMainScreen) {
                level.choose(number);
            }
        }
    };
}

/**
 * Stores the used DOM elements and initializes the Event Handlers
 * @returns {Void}
 */
function initDomListeners() {
    const blockInteraction = (e) => {
        const target = e.target;
        if (target && target.closest && target.closest(".board, .field, .winker, #piece, #ghost")) {
            e.preventDefault();
        }
    };
    document.addEventListener("contextmenu", blockInteraction);
    document.addEventListener("selectstart", blockInteraction);
    document.addEventListener("dragstart", blockInteraction);

    document.body.addEventListener("click", (e) => {
        const element = Utils.getTarget(e);
        const actions = {
            decrease   : () => level.dec(),
            increase   : () => level.inc(),
            start      : () => newGame(),
            mainScreen : () => showMainScreen(),
            endPause   : () => endPause(),
            pause      : () => showPause(),
            finishGame : () => finishGame(),
            highScores : () => showHighScores(),
            help       : () => showHelp(),
            save       : () => saveHighScore(),
            restore    : () => scores.restore(),
            sound      : () => sounds.toggle(),
            reward     : () => showRewardedAd()
        };

        if (actions[element.dataset.action]) {
            e.preventDefault();
            actions[element.dataset.action]();
        }
    });
}



/**
 * The main Function
 * @returns {Void}
 */
function main() {
    initDomListeners();

    display  = new Display();
    level    = new Level(maxInitialLevel);
    sounds   = new Sounds(`${gameId}.sound`);
    scores   = new HighScores();
    keyboard = new Keyboard(display, scores, getShortcuts());
    rewardBtn = document.querySelector(".reward");
    if (rewardBtn) {
        rewardBtn.addEventListener("click", (e) => {
            e.preventDefault();
            showRewardedAd();
        });
    }
    applyLanguage(getLangFromSdk());
    initSDK();
}

// Load the game
window.addEventListener("load", main, false);


