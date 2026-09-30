# Samen Thuis v25
Zelfstandige build: geen oudere update-scripts nodig.

## Basis
Deze build consolideert de fysiek beschikbare geïntegreerde Samen Thuis-code en stylesheet en voegt de documentatiegestuurde modules Taken/Inbox, Challenges en deep-link/cross-module infrastructuur rechtstreeks aan `app.js` toe.

## Belangrijk vóór productie
Maak een JSON-back-up van de huidige app. Test import, sync, alle 12 bestaande pagina's, dark/light, mobiele dock, budget en reizen tegen je huidige productieversie. De allerlaatste geïndexeerde v23/v24-bron was niet volledig als raw bestand beschikbaar tijdens deze build; daarom worden functies die alleen daarin voorkwamen niet ten onrechte als regressievrij verklaard.

Upload deze 7 bestanden samen naar een testbranch/repository.
