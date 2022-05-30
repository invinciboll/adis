# Vorbereitung
## Software
1. Pyhton [3.10.4](https://www.python.org/downloads/)
2. Als IDE [PyCharm Community Edition](https://www.jetbrains.com/de-de/pycharm/download/#section=windows)
## Notwendige Einstellungen

1. Pfad zum Ausführung von Pyhton anpassen
```
Unter Settings -> Tools -> Terminal -> Shell Path folgendes mit Anführungszeichen einstellen:

"cmd.exe" /k ""PFAD\venv\Scripts\activate.bat""

PFAD durch den Projekt-Pfad ersetzen (steht darüber in einem Feld)
``` 


2. Django hinzufügen
```
Settings -> Project: Adis -> Pyhton Interpreter -> + -> Django -> Install Package
``` 
----
# Start der Webseite
Navigiere in den Pfad \adis\webseite und führe folgenden Befehl aus:\
```python manage.py runserver``` 

# Hilfreiche Videos
[Projekt starten und Seiten aufrufen - Webentwicklung | Python und Django | Teil 1](https://www.youtube.com/watch?v=reKC23pqimQ&list=PLuBK_vNnGp8Ba7GZV6_XUWLtWqWPFoUcu&ab_channel=NEW-Vadim)