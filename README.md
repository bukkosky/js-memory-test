## Js Memory Test
Simple js-memory test inspiret by [Hereos of the Storm](http://eu.battle.net/heroes/en/), this is my response on [JavaScript video course](https://www.youtube.com/watch?v=edNqTubHUU0).

Play Demo: [GitHub Page](https://rettles.github.io/js-memory-test/)

#### Technologies
- [jQuery](https://jquery.com/)
- [easytimer.js](https://github.com/albert-gonzalez/easytimer.js)

## Informations [PL]
Projekt ten przedstawia moją wizję udoskonalenia gry zawartej w kursie. Cały projekt napisałem od nowa, od zera inspirując się odcinkiem z kursu kanału Pasja Informatyki (link powyżej). Niżej przedstawiam listę "większych" zmian, które wprowadziłem, wszystkiego nie opiszę np. detale kodu js ponieważ można to sprawdzić.


#### Nowy system punktowy
Nowy system punktacji ma na celu lepsze oddanie umiejętności gracza ponieważ najlepszy gracz to najszybszy oraz najdokładniejszy, bierze on pod uwagę tak jak wspominałem czas, w którym zosała ukończona gra,z ilość tur oraz ilość kart i przelicza to wszystko na punkty. Dzięki temu wyniki będą bardziej różnorodne.

Zasada jest prosta: 
- Za każdą odkrytą pare otrzymuje się 60pkt
- Za każdą dodatkową turę** traci się 10pkt
- Co sekundę traci się 1pkt

Przykład - poziom trudności łatwy: 
Mamy 16 kart czyli 8 par co daje nam 480 (60*8)pkt do zdobycia
Ukończyliśmy grę w czasie 70 sekund i w 18 turach co daje nam: (480 - 100 - 70) 310pkt

**Dodatkowe tury są naliczane gdy ilość tur przekroczy sumę wszystkich par

#### Poziomy trudności
Dostępne są 3 poziomy trudności:
- Łatwy - 16 kart (rozmiar 4x4)
- Średni - 30 kart (rozmiar 6x5)
- Trudny - 42 karty (rozmiar 6x7)
 
#### Wyniki
Gra przechowuje najlepsze wyniki, które uzyskamy w trakcie rozrywki co za tym idzie można ustanawiać rekordy. Dla każdego poziomu trudności ustanawia się najlepszy wynik. Reset następuje w wyniku odświeżenia strony.
#### Tematyka Hotsa
To jest wynik potrzeby na nowe karty, jako że nie mogłem znaleźć większej ilości podobnych grafik do tych z kursu to uznałem, że najprostszym wyjściem będzie. zmiana tematyki na inną i padło na Hotsa :) Nie chciałem łączyć obu tematyk ponieważ trudniej by było stworzyć klimat na stronie.
