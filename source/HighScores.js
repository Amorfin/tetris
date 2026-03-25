import Storage      from "../utils/Storage.js";
import Utils        from "../utils/Utils.js";



/**
 * Neon Blocks High Scores
 */
export default class HighScores {

    /**
     * Neon Blocks High Scores constructor
     */
    constructor() {
        this.data      = new Storage("neonblocks.hs");
        this.total     = this.data.get("total") || 0;
        this.maxScores = 9;
        this.isFocused = false;
        this.labels    = { name: "name", level: "lv.", score: "score" };

        /** @type {HTMLInputElement} */
        this.input     = document.querySelector(".input input");

        /** @type {HTMLElement} */
        this.scores    = document.querySelector(".scores");

        /** @type {HTMLElement} */
        this.none      = document.querySelector(".none");

        this.input.onfocus = () => this.isFocused = true;
        this.input.onblur  = () => this.isFocused = false;
    }

    /**
     * Set localized labels for the table header
     * @param {{name: string, level: string, score: string}} labels
     */
    setLabels(labels) {
        if (labels) {
            this.labels = labels;
        }
    }



    /**
     * Show the Scores for the given mode
     */
    show() {
        this.scores.innerHTML = "";
        const records = this.getRecords();
        if (records.length !== this.total) {
            this.total = records.length;
            this.data.set("total", records.length);
        }
        this.showHideNone(records.length === 0);

        if (records.length > 0) {
            const table = document.createElement("table");
            table.className = "score-table";

            const thead = document.createElement("thead");
            thead.innerHTML = `
                <tr>
                    <th>${this.labels.name}</th>
                    <th>${this.labels.level}</th>
                    <th>${this.labels.score}</th>
                </tr>
            `;

            const tbody = document.createElement("tbody");
            records.forEach((data) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td class="hs-name">${data.name}</td>
                    <td class="hs-level">${data.level}</td>
                    <td class="hs-score">${Utils.formatNumber(data.score, ",")}</td>
                `;
                tbody.appendChild(tr);
            });

            table.appendChild(thead);
            table.appendChild(tbody);
            this.scores.appendChild(table);
        }
    }
    // Table rows are rendered in show()

    /**
     * Tries to save a score, when possible
     * @param {Number} level
     * @param {Number} score
     * @returns {Boolean}
     */
    save(level, score) {
        const name = this.input.value.trim();
        if (name) {
            this.saveData(level, score, name);
            return true;
        }
        return false;
    }

    /**
     * Gets the scores and adds the new one in the right position, updating the total, when possible
     * @param {Number} level
     * @param {Number} score
     */
    saveData(level, score, name) {
        const data   = [];
        const actual = {
            name  : name,
            level : level,
            score : score
        };
        let saved = false;

        const records = this.getRecords();
        for (let i = 0; i < records.length; i += 1) {
            const hs = records[i];
            if (!saved && hs.score < actual.score) {
                data.push(actual);
                saved = true;
            }
            if (data.length < this.maxScores) {
                data.push(hs);
            }
        }
        if (!saved && data.length < this.maxScores) {
            data.push(actual);
        }

        this.data.set("total", data.length);
        data.forEach((element, index) => {
            this.data.set(index + 1, element);
        });
        this.total = data.length;
    }

    /**
     * Returns a sanitized list of records
     * @returns {Array<{name: string, level: number, score: number}>}
     */
    getRecords() {
        const records = [];
        for (let i = 1; i <= this.total; i += 1) {
            const hs = this.data.get(i);
            if (hs && typeof hs.score === "number") {
                records.push(hs);
            }
        }
        return records;
    }

    /**
     * Deletes all the Scores
     */
    restore() {
        for (let i = 1; i <= this.total; i += 1) {
            this.data.remove(i);
        }
        this.data.set("total", 0);
        this.show();
    }

    /**
     * Shows or hides the no results element
     * @param {Boolean} show
     */
    showHideNone(show) {
        this.none.style.display = show ? "block" : "none";
    }

    /**
     * Sets the input value and focus it
     */
    setInput() {
        this.input.value = "";
        this.input.focus();
    }
}


