let pictures, lock, oneVisible, pairs, turns, imgData, cards, score, level;
let g = new Game();
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
}

function Game() {

    score = new Score;

    this.drawMenu = function () {

        let $board = $(".board");
        let levels = ["Easy", "Medium", "Hard"];

        $board.html("<div class=\"board-header\">Choose your difficulty level</div>");

        for(let i = 0; i < 3; i++) {
            $board.append("<div class=\"btn-level\">" + levels[i] + "</div>");
        }

        $(".btn-level").each(function (i) {
            $(this).on("click", function () {
                play(i);
            });
        });
    };

    function play(level) {

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

        switch(level) {
            // easy - 4x4 - 16 cards
            case 0:
                $field.addClass("small");
                level = "easy";
                aLength = 8;
                break;
            // normal - 6x5 - 30 cards
            case 1:
                level = "medium";
                $field.addClass("medium");
                aLength = 15;
                break;
            // difficult - 6x7 - 42 cards
            case 2:
                level = "hard";
                $field.addClass("big");
                aLength = 21;
                break;
        }

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
        $board.append("<div class=\"score\">Turn: 0</div>");
    }
}

function Card(img, id) {

    this.img = "url(img/" + img + ")";
    this.id = id;
    this.revealed = false;
    this.hidden = false;

    this.hide = function () {
        let $id = $("#" + this.id);
        let $board = $(".board");
        this.hidden = true;

        $id.toggleClass("hidden highlight");
        pairs--;

        if(pairs === 0) {

            // New best score
            if(score.getScore(level) === 0 || score.getScore(level) > turns) {
                score.setScore(level, turns);
                $board.html("<div class=\"score-header\">Congratulations You Won!</div>" +
                    "<div class=\"score-new\">New record:<br> " + score.getScore(level) + " turns!</div>");
            } else {
                $board.html("<div class=\"score-header\">Congratulations You Won!</div>" +
                    "<div class=\"score-new\">Your score: " + turns + "</div>" +
                    "<div class=\"score-best\">The best score: " + score.getScore(level) + "</div>");
            }
            $board.append("<a class=\"btn\">Play again</a>");
            $(".btn").on("click", function () {
                g.drawMenu();
            });
        }
    };
    this.restore = function () {
        let $id = $("#" + this.id);

        $id.toggleClass("highlight rotateCard");
        $id.css({"background-image":""});
        this.revealed = false;
    };
    this.revealCard = function () {
        let $id = $("#" + this.id);

        if(!this.revealed && !lock && !this.hidden) {

            this.revealed = true;
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
                $(".score").html("Turn: " + turns);
                oneVisible = false;
            }
        }
    };
    function changeCardState(parameter) {
        lock = false;
        $.grep(cards, function (e) {
            if (e.revealed && !e.hidden) {
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