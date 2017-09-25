let pictures, lock, oneVisible, pairs, turns, imgData, cards, score, level, timer, secs, time;
let g = new Game();

// Draw main menu
g.drawMenu();



function Score() {

    this.easy = 0;
    this.medium = 0;
    this.hard = 0;

    this.getScore = function (level) {
        if(level === "easy") {
            return this.easy;
        } else if( level === "medium") {
            return this.medium;
        } else {
            return this.hard;
        }
    };

    this.setScore = function (level, score) {
        if (level === "easy") {
            this.easy = score;
        } else if (level === "medium") {
            this.medium = score;
        } else {
            this.hard = score;
        }
    };
    this.getCurrentScore = function (cards, turns, secs) {
        let result = cards * 30 - ((turns - (cards/2)) * 10) - secs;
        if(result <= 0) {
            return 0;
        }
        else {
            return result;
        }
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
            $(this).on("click", function () {
                play(i);
            });
        });
    };

    function play(setLevel) {

        let $board = $(".board");
        let aLength = 0;
        pictures = [];
        lock = false;
        oneVisible = false;
        turns = 0;
        imgData = "";
        cards = [];

        $board.html("<div class=\"field\"></div>");
        let $field = $(".field");

        switch(setLevel) {
            // easy - 4x4 - 16 cards
            case 0:
                level = "easy";
                aLength = 8;
                break;
            // normal - 6x5 - 30 cards
            case 1:
                level = "medium";
                aLength = 15;
                break;
            // difficult - 6x7 - 42 cards
            case 2:
                level = "hard";
                aLength = 21;
                break;
        }

        $field.addClass(level);

        for(let i = 1; aLength >= i; i++) {
            pictures.push(i + ".png");
        }

        let upgrArr = function () {
            return $.map(pictures, function (n) {
                return [n, n];
            }).sort(function () {
                return 0.5 - Math.random();
            });
        };

        let cImg = upgrArr();

        pairs = cImg.length;

        $(cImg).each(function (i) {
            cards.push(new Card(cImg[i], "c" + i));
        }).each(function (i) {
            $field.append("<div class=\"card\" id=\"" + cards[i].id + "\"></div>");
            $("#" + cards[i].id).on("click", function () {
                cards[i].revealCard();
            });
        });
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
        let $id = $("#" + this.id);
        let $board = $(".board");

        this.state = "hidden";

        $id.toggleClass("hidden highlight");
        pairs--;

        // increase score
        if(pairs === 0) {
            timer.stop();

            let points = score.getCurrentScore(cards.length, turns, secs);
            // New best score
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
            timer.start({precision: 'seconds'});
            timer.addEventListener('secondsUpdated', function () {
                secs = timer.getTimeValues().seconds + (timer.getTimeValues().minutes * 60) +
                    (timer.getTimeValues().hours * 3600) + (timer.getTimeValues().days * 3600 * 24);
                time = timer.getTimeValues().toString();
                $(".time").html("Time: " + time);
            });
        }

        if(!lock && this.state === "normal") {

            this.state = "revealed";
            lock = true;

            $id.css({"background-image": this.img});
            $id.addClass("rotateCard");
            $id.toggleClass("highlight");

            if(!oneVisible) {

                imgData = this.img;
                oneVisible = true;
                lock = false;

            } else {

                if (this.img === imgData) {
                    setTimeout(function() {
                        changeCardState("hide")
                    }, 750);
                }
                else {
                    setTimeout(function () {
                        changeCardState("restore")
                    }, 1000);
                }
                turns++;
                $(".turns").html("Turn: " + turns);
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