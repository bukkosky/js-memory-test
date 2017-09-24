let pictures, lock, oneVisible, pairs, turns, imgData, cards;
let g = new Game();
g.drawMenu();

function Game() {

    this.drawMenu = function () {

        let $board = $(".board");
        let levels = ["Easy", "Medium", "Hard"];

        $board.html("<h2>Choose your difficulty level</h2>");

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
        $field = $(".field");

        switch(level) {
            // easy - 4x4 - 16 cards
            case 0:
                $field.addClass("small");
                aLength = 8;
                break;
            // normal - 6x5 - 30 cards
            case 1:
                $field.addClass("medium");
                aLength = 15;
                break;
            // difficult - 6x7 - 42 cards
            case 2:
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
        this.hidden = true;

        $id.toggleClass("hidden");
        pairs--;

        if(pairs === 0) {
            $(".board").html("<h1>You win!<br>Done in " + turns + " turns</h1><a class=\"btn\">Play again</a>");
            $(".btn").on("click", function () {
                g.drawMenu();
            });
        }
    };
    this.restore = function () {
        let $id = $("#" + this.id);

        $id.toggleClass("highlight");
        $id.css({"background-image":""});
        this.revealed = false;
    };
    this.revealCard = function () {
        let $id = $("#" + this.id);

        if(!this.revealed && !lock && !this.hidden) {

            this.revealed = true;
            lock = true;

            $id.css({"background-image": this.img});
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