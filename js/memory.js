$.fn.preload = function() { this.each(function() { $('<img/>')[0].src = this; })};
let i = ["./img/1.png", "./img/2.png", "./img/3.png", "./img/4.png", "./img/5.png", "./img/6.png", "./img/7.png", "./img/8.png", "./img/9.png", "./img/10.png", "./img/11.png", "./img/12.png", "./img/13.png", "./img/14.png", "./img/15.png", "./img/16.png", "./img/17.png", "./img/18.png",    "./img/19.png", "./img/20.png","./img/21.png", "./img/card.png"];
$(i).preload();

let pictures, lock, oneVisible, pairs, /*turns,*/ imgData, cards, score, level, timer, secs, time;

let g = new Game();

g.drawMenu();

function Score() {

    this.easy = 0;
    this.medium = 0;
    this.hard = 0;

    this.getScore = function (level) {
        switch(level) {
            case "easy":
                return this.easy;
            case "medium":
                return this.medium;
            case "hard":
                return this.hard;
        }
    };
    this.setScore = function (level, score) {
        switch(level) {
            case "easy":
                this.easy = score;
                break;
            case "medium":
                this.medium = score;
                break;
            case "hard":
                this.hard = score;
                break;
        }
    };
    this.getCurrentScore = function (score, secs) {
        let result = score - secs;
        return result <= 0 ? 0 : result;
    };
}

function Game() {

    score = new Score;
    timer = new Timer();

    this.drawMenu = function () {

        let $board = $(".board");
        let levels = ["Easy", "Medium", "Hard"];

        $board.html("<div class=\"board-header\">Choose your difficulty level</div>");

        // Make 3 buttons
        for(let i = 0; i < levels.length; i++) {
            $board.append("<div class=\"btn-level\">" + levels[i] + "</div>");
        }
        $(".btn-level").each(function (i) {
            $(this).on("click", () => play(i));
        });
    };

    function play(setLevel) {

        let $board = $(".board");
        $board.html("<div class=\"field\"></div>");

        let $field = $(".field");

        pictures = [];
        lock = false;
        oneVisible = false;
        /*turns = 0;*/
        imgData = "";
        cards = [];

        switch(setLevel) {
            // easy - 4x4 - 16 cards
            case 0:
                level = "easy";
                pairs = 8;
                break;
            // normal - 6x5 - 30 cards
            case 1:
                level = "medium";
                pairs = 15;
                break;
            // hard - 6x7 - 42 cards
            case 2:
                level = "hard";
                pairs = 21;
                break;
        }

        $field.addClass(level);

        for(let i = 1; pairs >= i; i++) pictures.push(i + ".png");

        // Return random ordered and doubled array
        const shuffleArray = array => _(array).concat(array).shuffle().value();
        pictures = shuffleArray(pictures);

        $(pictures).each(() => $field.append("<div class=\"card\"></div>"));
        $(".card").each(function (i) {
           cards.push(new Card(pictures[i], this));
           $(this).on("click", function () { cards[i].revealCard() });
        });
        // Draw on board timer and turn counter
        $board.append("<div class=\"score\">" +
            "<div class=\"time\">Time: 00:00:00</div>" +
            /*"<div class=\"turns\">Turn: 0</div>" +*/
            "</div>");
        $(".score").addClass(level);
    }
}

function Card(img, query) {

    this.img = "url(img/" + img + ")";
    this.query = $(query);
    this.state = "normal";
    this.points = 30;
    this.firstReveal = false;

    this.revealCard = function () {

        if(!timer.isRunning()) {
            // Start timer
            timer.start({precision: "seconds"});
            timer.addEventListener("secondsUpdated", function () {

                // Count seconds
                secs = timer.getTimeValues().seconds + (timer.getTimeValues().minutes * 60) +
                    (timer.getTimeValues().hours * 3600) + (timer.getTimeValues().days * 3600 * 24);

                // Display clock on board
                time = timer.getTimeValues().toString();
                $(".time").html("Time: " + time);
            });
        }
        if(!lock && this.state === "normal") {

            lock = true;
            this.state = "revealed";

            this.query.css({"background-image": this.img});
            this.query.toggleClass("highlight rotateCard");

            if(!oneVisible) {
                oneVisible = true;
                imgData = this.img;
                lock = false;
            } else {
                /*$(".turns").html("Turn: " + ++turns);*/
                this.img === imgData ? setTimeout(() => changeCardState("hide"), 750) : setTimeout(() => changeCardState("restore"), 1000);
                oneVisible = false;
            }
        }
    };
    this.restore = function () {

        if(!this.firstReveal) {
            this.firstReveal = true;
        } else {
            if(this.points >= 0) this.points -= 5;
        }

        this.state = "normal";
        this.query.toggleClass("highlight rotateCard");
        this.query.css({"background-image":""});
    };
    this.hide = function () {
        const hiddenCards = () => $.grep(cards, (e) => e.state === "hidden").length;
        let $board = $(".board");

        this.state = "hidden";
        this.query.toggleClass("hidden highlight");

        if(cards.length === hiddenCards()) {

            timer.stop();
            const countCardsPoints = function () {
                let result = 0;
                $(cards).each(function () { result += this.points });
                return result;
            };
            const points = score.getCurrentScore(countCardsPoints(), secs);

            if(score.getScore(level) < points) {
                score.setScore(level, points);
                $board.html("<div class=\"score-header\">Congratulations You won!</div>" +
                    "<div class=\"score-new\">New best score:<br> " + score.getScore(level) + " points!</div>");
            } else {
                $board.html("<div class=\"score-header\">Congratulations You won!</div>" +
                    "<div class=\"score-new\">Your score: " + points + " points</div>" +
                    "<div class=\"score-best\">Best: " + score.getScore(level) + " points</div>");
            }
            $board.append("<a class=\"btn\">Play again</a>");
            $(".btn").on("click", () => g.drawMenu());
        }
    };
    function changeCardState(state) {
        lock = false;
        $.grep(cards, function (e) {
            if (e.state === "revealed") {
                switch(state) {
                    case "hide":
                        e.hide();
                        break;
                    case "restore":
                        e.restore();
                        break;
                }
            }
        });
    }
}