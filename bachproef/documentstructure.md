# Voorwoord

Waarom heb ik dit onderwerp gekozen?
Wat heb ik geleerd?
Wie heeft mij geholpen?

# Inleiding

Waar gaat het onderzoek over?

- Angular update automatiseren.

Wat is de context?

- Meerdere Angular v16 applicaties moeten geupdate worden naar v20.

## Probleemstelling

Wat is het probleem?

- Dezelfde update herhalen over meerdere applicaties neemt veel tijd in beslag.

Voor wie is dit een probleem?

- Dit is een probleem voor het bedrijf omdat dit hun geld kost.
- Dis is een probleem voor de developers omdat dit hun tijd kost.

Waarom is dit een probleem?

- Het kost tijd en geld voor deze updates uit te voeren.

## Onderzoeksvraag

Wat is de onderzoeksvraag?

- In welke mate kan de automatisering van het updateproces van Angular v16 naar v20, bij meerdere applicaties, de onderhoudstijd voor de ontwikkelaars verlagen?

Wat zijn de deelvragen?

- Hoeveel veranderingen moeten uitgevoerd worden om Angular van v16 naar v20 te updaten?
- Welke manieren bestaan om code automatisch aan te passen zonder ongewenste veranderingen uit te voeren?
- Welke manier om code automatisch aan te passen is het meest geschikt om in deze casus toe te passen?
- Wat zijn statistisch gezien de meest voorkomende problemen bij het updaten van code?

## Onderzoeksdoelstelling

Wat probeert het onderzoek te bereiken?

- De developers een tool geven om het update process te versnellen.

Wat zijn de criteria voor succees?

- De tool mag geen nieuwe bugs introduceren.
- De tool moet makelijk bruikbaar zijn door de developers.
- De tool moet los zijn van Angular, anders hebben we een extra applicatie voor te onderhouden.

Wie zijn de stakeholders en wat is hun rol in dit onderzoek?

- De developers, zij moeten uiteindelijk met de tool werken.
- Het bedrijf, het moet de onderhoudskost voor de applicaties verminderen.

## Opzet van het onderzoek

Hoe is de rest van de tekst opgebouwd?

- Stand van zaken
- Methodologie
- Conclusie

Wat wordt in het hoofdstuk "Stand van zaken" besproken?

- Wat de gekende manieren zijn om code automatisch aan te passen.

Wat wordt in het hoofdstuk "Methodologie" besproken?

- Omschrijft hoe de tool (updater) ontwikkeld wordt.
- Omschrijft waarom de updater zo ontwikkeld wordt.

Wat wordt in het hoofdstuk "Conclusie" besproken?

- Omschrijft de resultaten van het onderzoek.
- Geeft nieuwe inzichtien over het onderzoek.

# Stand van zaken

Welke termen en technologiën moet iemand kennen voor het onderzoek te snappen?

## Angular

Wat is Angular?

- Open source UI framework ontwikkeld door Google.
- Opinionated.
- Komt met netwerk functionaliteiten.
- Komt met test framework.
- Komt met CLI tools.
- Maakt gebruik van TypeScript decorators.

Hoe is een Angular project gestructureerd?

- TypeScript bestanden omschrijven de business login.
- HTML bestanden omschrijven de structuur van de UI.
- CSS bestanden omschrijven de visuele representatie van de UI.
- (optional) JSON bestanden bevatten project configurations.

Wat is TypeScript?

- Basically JavaScript met een type system.
- Compileerd naar JavaScript.
- Inheritly object oriented, basically the prototype patern on steroids.

Hoe wordt HTML en CSS binnen Angular gebruikt?

- HTML kan in apparte bestanden of als een string in een TypeScript component (templates) in een decorator.
- CSS in apparte bestanden en wordt gelinkt in TypeScript via een decorator.

## Automatisch refactoren

Wat is refactoren?

- De source code van een applicatie aanpassen om de operatie aan te passen zonder de functionaliteit te veranderen.

Welke manieren bestaan er?

- De ander hoofdstukken omschrijven de verschillende manieren dat van toepassing zijn.

### Find & replace

Wat is find & replace?

- Gebaseerd op tekst of Regex.

Waarom is dit relevant?

- De simpelste vorm om in bulk code aan te passen.

Hoe werkt dit?

- Pattern matching.
- Verschillende algorithme.

Wat zijn de voordelen?

- Simpel te begrijpen.
- Simpel te implementeren.

Wat zijn de nadelen?

- Geen vat op syntax.
- Geen vat op semantiek.

### Compiler gebaseerd

Wat is compiler gebaseerd refactoren?

- De functionaliteit van de compiler gebruiken om code aan te passen.

Waarom is dit relevant?

- TypeScript is compiled.
- TypeScript heeft een compiler API.

Hoe werkt dit?

- Compiler leest de code in als een Abstract Syntax Tree (AST).

Wat zijn de voordelen?

- Bestaande API.
- Heeft vat op syntax.
- Goed gedocumenteerd.

Wat zijn de nadelen?

- Geen vat op semantiek.

### Language Server Protocol (LSP) gebaseerd

Wat is het LSP gebaseerd refactoren?

- LSP is de technologie achter de refactoring tools in meeste moderen IDE's en text editors.

Waarom is dit relevant?

- LSP is de defactor standaard.

Wat kan de TypeScript LSP?
Wat kan de Angular LSP?
Wat zijn de voordelen?

- Heeft vat op syntax.

Wat zijn de nadelen?

- Geen vat op semantiek.
- Weinig tot geen documentatie tot de interne werking.
- Wordt zelden tot nooit programatisch aangesproken.

### Artificiele Inteligentie (AI) gebaseerd

Wat is AI gebaseerd refactoren?

- AI de code laten inlezen en veranderingen laten toebrengen.

Waarom is dit relevant?

- AI is overal vandaag.

Hoe werkt dit?

- No one knows exectly, it's a black box.
- Geeft statistisch gezien het beste antwoord op een vraag op basis van gekende data.

Wat zijn de voordelen?

- Kan vat hebben op syntax.
- Kan vat hebben op semantiek.

Wat zijn de nadelen?

- Voor het maken van een AI is een grote dataset nodig.
- Geen absolute zekerheid of het een corecte output zal geven.
- Open AI tools zoals ChatGPT op interne code gebruiken geeft problemen met confidentialiteit.

### Gekende problemen

Wat zijn de gekende problemen bij refactoren?

- Kan soms nieuwe bugs introduceren.

# Methodologie

Wat is de plan van aanpak?

- We maken een collectie van helper functies bovenop de TypeScript Compiler API.
- Met behulp van deze functies kunnen de programmeurs een CLI applicatie schrijven dat een applicatie update.
- We maken een voorbeeld applicatie (de "updater") voor de update van Angular v16 naar v20.
- We maken een test applicatie op de updater te testen.

Welke aanpak uit de stand van zaken is gekozen om te implementeren?

- Text based Find & replace.
- Compiler tooling.

Waarom is deze aanpak gekozen; en voldoet deze aanpak aan de criteria voor succes uit de onderzoeksdoelstelling?

- Text based find & replace is makelijk te implementeren en te begrijpen.
- Compiler tooling kan aan de find & replace gekopeld worden om het vat te geven op de syntax.
- CLI applicatie kan gecombineerd worden met de Angular CLI tools.
- Gemaakt in dezelfde programeertaal als de interne applicaties.
- Niet afhankelijk van Angular.
- Bij dezelfde input krijgt men dezelfde output (maakt metingen betrouwbaar).
- Bestaande tools om de AST van TypeScript te lezen en interpreteren.
- Goede documentatie.

## Literatuurstudie

Wat moet iemand technisch weten om de proof of concept te begrijpen?

### TypeScript compiler API

Wat is de TypeScript compiler API?

- Laat toe om programmas te maken met de TypeScript compiler.

Hoe werkt het?

- Werk op basis van een AST.

### Categorizatie nodige veranderingen

Wat moet allemaal veranderd worden?

- 80 verschillende stappen in totaal.

Om welke manier kan dit onderverdeeld worden?

- CLI operations.
- Verandering aan syntax (change in syntax, text).
- Verandering aan semantiek (change in underlying logic).
- Veranderingen aan tests.
- Veranderingen die niet van toepassing zijn (features geïmplementeerd na v16 die al veranderen).
- Veranderingen aan HTML (templates).
- Veranderingen aan JSON (config).
- Veranderingen dat gedetecteerd kunnen worden.
- Veranderingen dat voledig geautomatiseerd kunnen worden.
- Veranderingen dat deels geautomatiseerd kunnen worden.

## Proof of concept

Hoe wordt het onderzoek uitgevoerd?

- De lijst van alle veranderingen wordt uitgedunt tot dat enkel het mogelijke overblijft.
- Per verandering wordt eerst een stuk code gemaakt in de test omgeving dat dient aangepast te worden.
- Hierna wordt een stuk code gemaakt in de updater dat deze aanpassing opspoort.
- Als opsporen lukt wordt het uitgebreid tot automatisatie.
- Herhaal dit process voor alle stappen.
- Als een extra abstractie bovenop de TypeScript Compiler API wordt ts-morph gebruikt.

### Toelichting

Wat wordt ontwikkeld? (de "updater")

- Een test applicatie dat enkel code bevat dat aangepast moet worden.
- De test applicatie is enkel syntactisch correct en hoeft niet te werken.
- Een collectie aan helper functies bovenop ts-morph.
- Een updater dat een Angular applicatie van v16 tot v17 updatet.
- Een updater dat een Angular applicatie van v17 tot v18 updatet.
- Een updater dat een Angular applicatie van v18 tot v19 updatet.
- Een updater dat een Angular applicatie van v19 tot v20 updatet.

### Opzet van de updater

Hoe wordt de updater ontwikkeld?

- Toon de helper functies.
- Vereenvoudig alle updater en test applicatie fragmenten en toon deze.

### Testen van de updater

Hoe wordt de updater geëvalueert?

- Tabel met oplijstingen per categorie.

# Verwachte resultaten

Wat is de verwachte effectiviteit van de updater?

- Er wordt verwacht dat 65% automatiseerbaar is.

# Conclusie

Wat is de effectiviteit van de updater?

## Test resultaten

Wat waren de test resultaten?

## Onderzoeksvragen

Wat is nu het antwoord op elke onderzoeksvraag?
Hoeveel veranderingen moeten uitgevoerd worden om Angular van v16 naar v20 te updaten?
Welke manieren bestaan om code automatisch aan te passen zonder ongewenste veranderingen uit te voeren?
Welke manier om code automatisch aan te passen is het meest geschikt om in deze casus toe te passen?
Wat zijn statistisch gezien de meest voorkomende problemen bij het updaten van code?
Is het onderzoek een success op basis van de betantwoorde deelvragen?

## Besluitvorming

Zijn uit het onderzoek nieuwe vragen gekomen?
Zijn uit het onderzoke nieuwe conclusies gekomen?
