# Samen Thuis — geïntegreerde v17

Dit is de schone testbuild voor `Samen-thuis-v2`.

## Upload naar de root
Vervang/upload alleen:
- index.html
- app.js
- styles.css
- sw.js
- manifest.webmanifest
- icon.svg
- README.md

## Wat is geïntegreerd
De code uit app.js, upgrade-v11, update-v4, v13, v14, v15 en v16 staat nu in één app.js.
De CSS uit styles.css, upgrade-v11.css en update-v13.css staat nu in één styles.css.
v17 voegt het vernieuwde Vandaag-dashboard toe met weer, kledingadvies, dagstatistieken en komende agenda.

## Na succesvolle test
In de echte `Samen-thuis` repository kunnen daarna deze losse bestanden weg:
- upgrade-v11.js
- upgrade-v11.css
- samen-thuis-update-v4.js
- samen-thuis-update-v13.js
- samen-thuis-update-v13.css
- samen-thuis-update-v14.js
- samen-thuis-update-v15.js
- samen-thuis-update-v16.js

Vanaf v17 worden wijzigingen rechtstreeks in de hoofdbestanden verwerkt.
