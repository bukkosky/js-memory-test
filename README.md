## Js Memory Test
Simple js-memory test inspiret by [Hereos of the Storm](http://eu.battle.net/heroes/en/), this is my response on [JavaScript video course](https://www.youtube.com/watch?v=edNqTubHUU0).

Play Demo: [GitHub Page](https://rettles.github.io/js-memory-test/)

#### Technologies
- [jQuery](https://jquery.com/)
- [easytimer.js](https://github.com/albert-gonzalez/easytimer.js)
- [lodash](https://lodash.com/)

## Informations [PL]
Projekt ten przedstawia moją wizję udoskonalenia gry zawartej w kursie. Cały projekt napisałem od nowa inspirując się [odcinkiem z kursu kanału Pasja Informatyki](https://www.youtube.com/watch?v=edNqTubHUU0). Niżej przedstawiam listę "większych", ważniejszych zmian, które wprowadziłem.
#### System punktowania
Każda karta ma swoją wartość a wynosi ona 30pkt. Pierwsze odsłonięcie karty jest "darmowe", natomiast każdy późniejszy błąd obniża jej wartość o 5pkt. Wartość karty nie może spaść poniżej 0pkt.
Wynik to suma punktów wszystkich kart obniżona o czas (sekundy) w jaki przeszliśmy grę.

**Dlaczego tak?**<br>
W ten sposób mamy różnorodne wyniki no i najważniejsze - fart, w systemie gdzie były brane pod uwagę tylko tury może być nie fair ponieważ gracz może przez przypadek odkryć dwie takie same karty. Ten system stara się docenić umiejętność zapamiętywania dlatego też każdy ma w pierw szanse odsłonić kartę bez żadnych konsekwencji, a przypadkowe odkrycie pary nie daje znaczącej przewagi. Czas w grze zapobiega odkryciu pojedynczej karty i np. wpatrywania się w nią, innymi słowy kto szybciej zapamięta ten lepszy.

#### Poziomy trudności
Dostępne są 3 poziomy trudności:
- Łatwy - 16 kart (rozmiar 4x4)
- Średni - 30 kart (rozmiar 6x5)
- Trudny - 42 karty (rozmiar 6x7)
 
#### Ustanawianie rekordów
Twój najlepszy wynik zostanie zapamiętany i będzie on przechowywany aż do przeładowania strony. Każdy poziom trudności przechowuje swój rekord.
#### Tematyka Hotsa
To jest wynik potrzeby na nowe karty, jako że nie mogłem znaleźć większej ilości podobnych grafik do tych z kursu to uznałem, że najprostszym wyjściem będzie zmiana tematyki na inną i padło na Hotsa :) Nie chciałem łączyć obu tematyk ponieważ trudniej by było stworzyć klimat na stronie.
