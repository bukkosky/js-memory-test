let pictures, lock, oneVisible, pairs, turns, imgData, cards, score, level, timer, secs, time;

let imagesToLoad = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png", "9.png", "10.png", "11.png", "12.png",
    "13.png", "14.png", "15.png", "16.png", "17.png", "18.png","19.png", "20.png","21.png", "card.png"];

$.fn.preload = function() {

    this.each(function(){
        $('<img/>')[0].src = this;
    });
};

$(imagesToLoad).preload();


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
    this.getCurrentScore = function (cards, turns, secs) {
        let result = cards * 30 - ((turns - (cards/2)) * 10) - secs;
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
        turns = 0;
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

        // Prepare array of card images
        for(let i = 1; pairs >= i; i++) {
            pictures.push(i + ".png");
        }
        // Return random ordered and doubled array
        const shuffleArray = array => _(array).concat(array).shuffle().value();
        pictures = shuffleArray(pictures);

        // Create objects Card and draw them on board
        $(pictures).each((i) => cards.push(new Card(pictures[i], "c" + i))).each((i) => {
            $field.append("<div class=\"card\" id=\"" + cards[i].id + "\"></div>");
            $("#" + cards[i].id).on("click", () => cards[i].revealCard())
        });

        // Draw on board timer and turn counter
        $board.append("<div class=\"score\">" +
            "<div class=\"time\">Time: 00:00:00</div>" +
            "<div class=\"turns\">Turn: 0</div>" +
            "</div>");
        $(".score").addClass(level);
    }
}

function Card(img, id) {

    this.img = "url(img/" + img + ")";
    this.id = id;

    // States: revealed, hidden, normal
    this.state = "normal";

    this.hide = function () {

        this.state = "hidden";

        let $id = $("#" + this.id);
        let $board = $(".board");

        $id.toggleClass("hidden highlight");
        const hiddenCards = () => $.grep(cards, (e) => e.state === "hidden").length;

        if(cards.length === hiddenCards()) {

            timer.stop();

            let points = score.getCurrentScore(cards.length, turns, secs);

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
            $(".btn").on("click", function () {
                g.drawMenu();
            });
        }
    };
    this.restore = function () {
        let $id = $("#" + this.id);

        this.state = "normal";

        $id.toggleClass("highlight rotateCard");
        $id.css({"background-image":""});
    };
    this.revealCard = function () {
        let $id = $("#" + this.id);

        if(!timer.isRunning()) {
            // Start timer
            timer.start({precision: 'seconds'});
            timer.addEventListener('secondsUpdated', function () {

                // Count seconds
                secs = timer.getTimeValues().seconds + (timer.getTimeValues().minutes * 60) +
                    (timer.getTimeValues().hours * 3600) + (timer.getTimeValues().days * 3600 * 24);

                // Display clock on board
                time = timer.getTimeValues().toString();
                $(".time").html("Time: " + time);
            });
        }

        if(!lock && this.state === "normal") {

            this.state = "revealed";
            lock = true;

            $id.css({"background-image": this.img});
            $id.toggleClass("highlight rotateCard");

            if(!oneVisible) {
                oneVisible = true;
                imgData = this.img;
                lock = false;
            } else {
                $(".turns").html("Turn: " + ++turns);
                this.img === imgData ? setTimeout(() => changeCardState("hide"), 750) : setTimeout(() => changeCardState("restore"), 1000);
                oneVisible = false;
            }
        }
    };
    function changeCardState(parameter) {
        lock = false;
        $.grep(cards, function (e) {
            if (e.state === "revealed") {
                switch(parameter) {
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