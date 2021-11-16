# analiza-cv

Noutati

- Rezolvat problema cu validarea in Chrome a campurilor de tip data calendaristica (an+luna)
   Atentie - am modificat formatul pentru introducerea datei in Firefox de la mm/yyyy la yyyy-mm
- Nu mai este posibila introducerea unei perioade invalide cu data de start mai mare decat data de final

Testat cu

- sistem de operare Linux Mint Cinnamon 3.8.9
- browser Firefox for Linux Mint 89.0.2
- browser Google Chrome 95.0.4638.69  
In principiu ar trebui sa mearga cu orice browser, si in Windows

Instalare si pornire ---------
Copiati fisierele undeva pe drive-ul local.
Deschideti un browser.
Din File Explorer, faceti drag&drop la fisierul index.html catre fereastra de browser.

Utilizare ------------
In campul "Activitate" recomand sa puneti un text nu foarte lung, ca oricum n-o sa incapa
prea mult atunci cand se pune pe graficul de timeline.
Datele introduse in tool se vor salva intr-un fisier textcu extensia .json, in directorul "Downloads".
Numele fisierul va contine numele candidatului, urmat de un numar care creste la fiecare salvare.
Asadar, fisierele existente nu se suprascriu, ceea ce e util ca sa reveniti la o versiune anterioara
daca faceti greseli. Prin urmare, nu uitati sa salvati din cand in cand.
Cu timpul se va umple acolo de fisiere, va trebui facut curatenie manual daca vreti.
Datele odata introduse nu mai pot fi modificate in aplicatie. Pentru a modifica,
mai intai salvati datele, apoi mergeti in File Explorer la acel fisier, deschideti cu
un editor de text si faceti corecturile acolo. [Pentru editare evitati aplicatii stufoase
care pot adauga caractere ciudate in fisierul salvat].
 Apoi incarcati fisierul in tool-ul din browser.

 Ca alternativa la procedura de mai sus, se poate reincarca ultima versiune salvata a
  fisierului de pe disc, dar in cazul acesta se pierd datele nesalvate intre timp.

Known issues -----------

- la inceput, cand nu exista inca date, in zona de jos apare o paranteza inchisa. ignorati.
- daca adaugati doua intrari care au acelasi text la "Activitate",  codurile de culoare
 nu se mai aplica corect. Oricum, nu este ok sa fie doua Activitati cu acelasi nume, deci
  va trebui editat fisierul manual pentru a corecta.