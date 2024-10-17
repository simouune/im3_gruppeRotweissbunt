### im3_gruppeRotweissbunt

## Das Projekt 
# Kurzbeschreibung des Projekts:
Mithilfe der Aufzeichnung von Daten einer API der Stadt St. Gallen, welche uns Informationen über den Belegtheitstatus von Ladestationen für Elektrofahrzeuge liefert berechnen wir die Auslastungsraten für alle Ladestandorte in St. Gallen. Einerseits werden die am meisten belastetsten Ladestationen angezeigt, andererseits wird gezeigt an welchen Wochentagen bestimmte Standorte speziell belastet sind. Dadurch kann evaluiert werden wo mehr bedarf für öffentliche Ladepunkte besteht und welche Standorte verlagert werden könnten. 

# Zielgruppe:
Diese Datastory richtet sich vor allem an Stadtentwickler und Verantwortliche der Stadtverwaltung in St. Gallen. Diese Personen können aus der anschaulichen Darstellung schliessen welche Massnahmen für eine Optimierung der Ladeinfrastruktur getroffen werden müssen. Sie können ausserdem sehen wann und wie sehr ihr Angebot genutzt wird. 
Elektrofahrzeuge sind nicht nur ein Beitrag zum Klimaschutz sondern auch ein wichtiger Bestandteil in der Zukunft der Mobilität. Nur wenn eine flächendeckende und praktische Infrastruktur besteht, wie sie es schon lange für herkömmliche Diesel- und Benzinfahrzeuge tut, dann kann auch der Strassenverkehr nachhaltig gestaltet werden. Die Visualisierung der Belegungsdaten der Ladesäulen ermöglicht es eben den Städteplanern, Engpässe zu erkennen und Learnings für zukünftige Projekte zu ziehen

# Vorgehen:
Eine API zeigt alle fünfzehn Minuten den Belegtheitsstatus von 164 Ladesäulen für Elektrofahrzeuge in der Stadt an. Eine Ladestation kann entweder frei oder belegt sein. Ein Status kann auch "Out Of Service" oder "Unknown" lauten, diese Datenpunkte werden in der Berechnung später jedoch ignoriert. 
Die Daten der API werden von uns aufgezeichnet und ebenfalls alle fünfzehn Minuten in einer Datenbank gespeichert. In der Folge ist es möglich mit den gesammelten Daten eine Berechnung zur Auslastung der jeweiligen Station anzustellen. Die Berechnung wird auf den jeweils ausgewählten Zeitraum angepasst, wobei Daten ab dem 11. Oktober 2024 vorhanden sind. 
Anschliessend werden die Top 5 der, im ausgewählten Zeitraum, am belastetsten Ladestationen in einem Säulendiagramm dargestellt. Da es potentiell an einer Ladestation mehr als einen Platz zum Laden gibt wird die Auslastung jeweils per Adresse also Standort berechnet. In einem zweiten Diagramm kann dann für denselben Zeitraum die Auslastung pro Wochentag betrachtet werden. Dadurch lassen sich Aussagen über die Auslastung an Wochenenden und Werktagen treffen. Tageszeiten werden hier nicht berücksichtigt, denn es soll eine Aussage über die allgemeine frequentierung eines Standortes getroffen werden und nicht über Stosszeiten.
Auf der Karte kann dann räumlich eingeordnet werden ob sich eine Ladestation eher im Zentrum oder am Stadtrand befindet. 


## Das Team

# Learnings
1. Man kann an den allerkleinsten Schreibfehlern sich stundenlang den Kopf zerbrechen
2. Planung ist key! Eine klare Vorstellung von Zielgruppe und geplanter Aussage des Projekts hätte uns enorm Zeit gespart. Von Anfang an am Ziel bauen und nicht "mal etwas machen" und dann irgendwie anpassen.
3. Sich Logik und Algorithmus im vorhinein überlegen und nicht wenns zu spät ist
4. Mehr Struktur für Übersichtlichkeit im Code 
5. Aufgabenteilung ist notwendig und es ist von Vorteil auch mal einen Code temporär in einem extra File zum speichern, wenn man noch dran herumbastelt. So geht man sich nicht gegenseitig bei der Arbeit im Weg um.

# Schwierigkeiten
1. Es fiel uns sehr schwer uns die Art der Datenverarbeitung vorzustellen. Also wie im Endeffekt die Berechnungen angestellt werden und was wir genau mit den gespeicherten Daten machen. Es hilft das Schritt für Schritt durchzugehen.
2. Chartjs ist nicht unbedingt selbsterklärend. In den Erklärungen auf chartjs.org ist vor allem nicht klar mit welcher Bezeichnung welcher Teil des Charts gemeint ist. Es wird viel Wissen vorausgesetzt. Eine tiefgreifendere Einführung in dieses Tool wäre sicher von Vorteil gewesen.
3. Das File-übergreifende Coden. Manchmal hat sich nicht ganz erschlossen wie die verschiedenen Schritte in den verschiedenen Files zusammenarbeiten.
4. Die Grafikelemente waren nicht so einfach einzufügen.

# Ressourcen

- GitHub Copilot
- ChatGPT
- chartjs.org
- YouTube Tutorials für Figma
- Samuel Rhyner
- Wolfgang Bock






