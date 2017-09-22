let pictures, lock, oneVisible, pairs, turns, imgData, cards;
let g = new Game();
g.play();

function Game() {

    this.play = function () {

        pictures = ["ciri.png", "geralt.png", "jaskier.png", "iorweth.png", "triss.png", "yen.png"];
        lock = false;
        oneVisible = false;

        turns = 0;
        imgData = "";

        let upgrArr = function () {
            return $.map(pictures, function (n) {
                return [n, n];
            }).sort(function () {
                return 0.5 - Math.random();
            });
        };
        let cImg = upgrArr();
        pairs = cImg.length;
        cards = [];

        let $board = $(".board");

        $board.html("");
        $(cImg).each(function (i) {
            cards.push(new Card(cImg[i], "c" + i));
        }).each(function (i) {
            $board.append("<div class=\"card\" id=\"" + cards[i].id + "\"></div>");
            $("#" + cards[i].id).on("click", function () {
                cards[i].revealCard();
            });
        });
        $board.append("<div class=\"score\">Turn counter: 0</div>");
    }
}

function Card(img, id) {

    this.img = "url(img/" + img + ")";
    this.id = id;
    this.revealed = false;
    this.hidden = false;

    this.hide = function () {
        let $id = $("#"+this.id);
        this.hidden = true;

        $id.toggleClass("hidden");
        pairs--;

        if(pairs === 0) {
            $(".board").html("<h1>You win!<br>Done in " + turns + " turns</h1><a class=\"btn\">Play again</a>");
            $(".btn").on("click", function () {
                g.play();
            });
        }
    };
    this.restore = function () {
        let $id = $("#"+this.id);

        $id.toggleClass("highlight");
        $id.css({"background-image":""});
        this.revealed = false;
    };
    this.revealCard = function () {
        let $id = $("#"+this.id);

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
                $(".score").html("Turn counter: " + turns);
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