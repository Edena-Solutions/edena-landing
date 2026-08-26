---
title: "Eskola softwarea aldatzea datuak galdu gabe: elkarreragingarritasuna, APIak eta eramangarritasuna"
date: "2026-08-12"
translationKey: "cambiar-software-escolar-interoperabilidad-portabilidad-datos-2026"
description: "Eskola kudeaketa hornitzaile batekin sinatu aurretik idatziz egin beharreko galderak: zer esportatzen duzun, zein formaturekin, zer integratzen duen eta zer gertatzen den zure datuekin joaten zaren egunean."
tags:
    [
        "elkarreragingarritasuna",
        "datuen eramangarritasuna",
        "API",
        "migrazioa",
        "software aukeraketa",
    ]
author: "ENA by Edena"
cover: "https://plus.unsplash.com/premium_photo-1682145189653-bb0b79db3415?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
relatedPosts:
    - excel-etik-eskola-erp-migrazioa-2026
    - software-aukera-egiaztapen-2026
    - eskola-kudeaketa-softwarea-konparaketa-2026-espainia
    - erp-gestoria-integrazioa-kontabilitatea-2026
faqs:
    - question: "Nire datuak itzultzeko eskubide legala dut?"
      answer: "Bai. Zentroa da tratamenduaren arduraduna eta hornitzailea tratamendu eragilea, beraz kontratua amaitzean datuak itzuli edo ezabatu behar ditu zuen jarraibidearen arabera. Legeak finkatzen ez duena formatua eta epea dira, eta hor konplikatzen da: eskatu biak idatziz kontratuan."
    - question: "Zein esportazio formatu eskatu behar dut?"
      answer: "Gutxienez, CSV edo entitateka egituratutako kalkulu orria —ikasleak, familiak, matrikulak, kalifikazioak, fakturak, dokumentuak— eta ez PDF bat ez isurketa lau bat. Gainera API dokumentatua badago, hobeto, irteten den hornitzailearen laguntzaren menpe egon gabe migratzeko aukera ematen baitu."
    - question: "Zenbat denbora behar da benetan software batetik bestera migratzeko?"
      answer: "Lau eta zortzi aste bitarteko lan erreala tamaina ertaineko zentro batentzat, gehiena datuak garbitzen eta ez mugitzen. Proiektuak luzatzen dituena ia beti bikoiztuak, normalizatu gabeko eremu libreak eta paperean bakarrik dagoen dokumentazioa dira."
    - question: "Zein da ikasturteko unerik onena aldatzeko?"
      answer: "Ebaki naturala ikasturtearen itxieraren eta hurrengoaren hasieraren artean dago, matrikula jada berrituta eta eskolak hasi aurretik. Ikasturtearen erdian aldatzea posible da baina bi sistemarekin asteetan bizitzera behartzen du, proiektuaren zatirik garestiena."
---

<strong>Eskola softwarea aldatzea datuak galdu gabe: elkarreragingarritasuna, APIak eta eramangarritasuna</strong>

<br>

Bada galdera bat ia inoiz agertzen ez dena demostrazio komertzialetan eta dirudiena baino kontratu gehiago erabakitzen dituena: zer gertatzen da nire datuekin joan nahi dudan egunean. Zuzendaritza talde gehienek ez dute formulatzen mesfidantza itxura duelako, eta hornitzaile gehienek ez dute lantzen erantzunak gutxitan laguntzen duelako salmentan. Emaitza da zentro askok erantzuna deskubritzen dutela negoziatzeko marjinarik ez dutenean jada.

<br>

<strong>Zergatik duen garrantzia galderak orain</strong>

<br>

Gaia larriagoa bihurtu da azken urtean. 2026-2027rako eskola merkatuaren analisiak norabide berean seinalatzen du herrialde askotan: adimen artifizial natiborik gabeko, datuen babes betetze sendorik gabeko eta elkarreragingarritasun dokumentaturik gabeko softwarea ordezkatu edo hirugarrenen tresnekin adabakiztatuko da. Eta ordezkatzeko unea iristen denean, **marruskadura ez da prezioa: hamabost urteko espedienteak galtzeko beldurra baizik.**

<br>

<strong>Idatziz egin beharreko lau galderak</strong>

<br>

Edozein hornitzailerekin sinatu aurretik —jada duzuena barne, hurrengo berritzean— lau gauzaren erantzuna idatziz eskatzea komeni da. Idatziz esan nahi du kontratuan edo eranskin batean, ez komertzial baten posta batean:

- **Zer esporta dezaket, zein formaturekin eta zein maiztasunekin?** Erantzun ona zehatza eta entitateka da: ikasleak, legezko tutoreak, ikasturteka matrikulak, kalifikazioak, asistentzia, ordainagiriak eta beren egoera, erantsitako dokumentuak. Erantzun txarra «isurketa bat ematen dizugu» da, isurketa bat mila orriko PDF bat izan baitaiteke.
- **Bezeroarentzat eskuragarri den API dokumentatu bat dago?** Ez da beharrezkoa zentroak zuzenean erabiltzea; existitzea da beharrezkoa, datuak inoren borondate onaren menpe egon gabe ateragarriak direla dioen froga objektiboa baita.
- **Zerekin integratzen da modu natiboan?** Izan zehatzak eta galdetu benetan erabiltzen duzuenari buruz, ez logotipoen zerrenda orokor bati buruz.
- **Zer gertatzen da kontratua amaitzean?** Esportazioa emateko epe zehatza, konprometitutako formatua, kosturik badago, eta datuak zenbat denboraz gordetzen diren ezabatu aurretik.

<br>

<strong>Zergatik hornitzaile blokeoa ez den normalean gaiztoa</strong>

<br>

Mekanismoa ulertzea komeni da, erantzunak ebaluatzen laguntzen baitu. Oso hornitzaile gutxik gordetzen dituzte datuak nahita. Blokeoa metaketaz gertatzen da: urteetan zehar eremu pertsonalizatuak, igotako dokumentuak, txantiloiak, komunikazioen historikoak eta beste inongo sistematan baliokide zehatzik ez duten konfigurazioak sortu dira.

<br>

<strong>Egituratutakoa eta inork esportatzen ez duena</strong>

<br>

Horrek esan nahi du benetako eramangarritasuna ez dela binarioa. Datu egituratuen % 100 esporta daiteke —ikasleak, notak, ordainagiriak— eta hala ere egituratu gabekoaren % 100 galdu, eta hori izaten da sarritan eraikitzeak lan gehien eman zuena. **Erantsitako dokumentuei eta komunikazioen historikoari** buruz zehazki galdetzea da ebaluazio serio bat azaleko batetik bereizten duena.

<br>

<strong>Elkarreragingarritasuna ez da integrazioa bezalakoa</strong>

<br>

Bereizketak garrantzia du hornitzaileek bi hitzak sinonimo gisa erabiltzen dituztelako eta ez direlako. Integrazio bat sistema zehatz batekin konexio zehatz bat da, norbaitek eraiki eta mantendua: ondo funtzionatzen du bi aldeek mantentzen duten bitartean. Elkarreragingarritasuna edozein sistemarekin datuak trukatzeko gaitasuna da formatu eta estandar irekien bidez, konexio espezifiko bat egon beharrik gabe.

Zentro txiki batentzat, integrazio natiboek eguneroko lana ebazten dute eta elkarreragingarritasuna aseguru bat da. Hainbat zentro eta ondare sistema dituen talde batentzat, elkarreragingarritasunak aseguru izateari uzten dio eta baldintza bihurtzen da, hornitzaile batek ere ez baitu neurrira egindako integraziorik eraikiko kasu bakoitzerako.

<br>

<strong>Zerekin integratu behar den eskola ERP bat</strong>

<br>

Integrazioei buruz galdetzen duzuenean, galdetu bost hauei buruz eta ez zerrenda orokor bati buruz:

- **Zure autonomia erkidegoko plataforma:** Séneca, Rayuela, ITACA, GESTIB edo dagokiona.
- **Ikaskuntza ingurunea:** Google Classroom, Moodle edo Microsoft Teams, klaustroak erabiltzen duenaren arabera.
- **Gestoria edo kontabilitate softwarea:** hilabeteko fakturak eskuz berriro ez sartzeko.
- **Ordainketa pasabidea eta bankua:** helbideratzeak, itzulketak eta adostzapena.
- **Posta instituzionala eta erabiltzaileen direktorioa:** alta eta bajen bi zerrenda ez kudeatzeko.

<br>

<strong>Migrazio bat benetan luzatzen duena</strong>

<br>

Ohiko itxaropena migratzea arazo tekniko bat izatea da. Praktikan, tamaina ertaineko zentro batentzat lau eta zortzi aste bitarteko lan erreala da, eta gehiena ez da datuak mugitzen erabiltzen, garbitzen baizik. Hiru errudunak ia beti berdinak dira:

- **Bikoiztuak:** ikasle bera bi aldiz alta emanda, bi fitxa dituzten familiak, tutore errepikatuak dituzten anai-arrebak.
- **Normalizatu gabeko eremu libreak:** bost modutan idatzitako helbideak, aurrezenbakiarekin eta gabeko telefonoak, sortu zituenaren arabera modu desberdinean izendatutako ikasturteak.
- **Paperean bakarrik dagoen dokumentazioa:** edo norbaiten karpeta lokalean. Ez dago sistema batean ere eta beraz inola ere ezin da migratu.

<br>

<strong>Garbiketa gaur has daiteke</strong>

<br>

Hortik ondorio praktiko oso erabilgarri bat ateratzen da: datuen garbiketa ez dago aukeratzen duzuen hornitzailearen menpe. Ezer erabaki aurretik has daiteke, eta horrek proiektua laburtzen du azken erabakia edozein izanda ere. Eta gainera zaudeten lekuan geratzen bazarete, dituzuena hobetu izango duzue berdin.

<br>

<strong>Noiz aldatu</strong>

<br>

Ebaki naturala ikasturtearen itxieraren eta hurrengoaren hasieraren artean dago: matrikula jada berrituta, kalifikazioak itxita eta eskolak hasi gabe. Hori da sistema zaharra artxibo gisa izoztuta gera daitekeen une bakarra berria garbi abiatzen den bitartean.

<br>

<strong>Beste erremediorik ez badago ikasturte erdian aldatzeko</strong>

<br>

Posible da, baina bi sistemarekin asteetan bizitzea dakar, datu bat batean eguneratu eta bestean ez egiteko arriskuarekin. Araua argia da eta ez du ñabardurarik onartzen: **sistema bat ofiziala da lehen egunetik eta bestea kontsulta hutsa da**, salbuespenik ez kasu berezirik gabe. Salbuespen bat onartzen den unean, egiaren bi bertsio agertzen dira.

<br>

<strong>Kasu praktikoa (Espainia)</strong>

<br>

Lau zentroko talde batek hiru urte zeramatzan plataformak bateratu nahian eta ez zuen egiten arrazoi zehatz batengatik: inork ez zekien 2009tik erabiltzen ari zen sistema zaharrenaren espediente historikoak berreskuratu ahal izango zituen.

Hornitzaile berri batekin negoziatu aurretik, oraingoari proba esportazio bat eskatu zioten idatziz. Bost aste behar izan zituen iristeko eta ikasleak, matrikulak eta kalifikazioak zituen formatu batean etorri zen, baina ez erantsitako dokumentuak ez komunikazioak. Erantzun hori, deserosoa baina argia, izan zen benetan planifikatzea ahalbidetu zuena.

Erabakia egituratutakoa sistema berrira migratzea eta zaharra kontsulta moduan bi ikasturtez gordetzea izan zen erantsitako dokumentaziorako, legez gorde behar ziren espedienteen eskuzko deskarga egutegi batekin. Ez zen dotorea izan, baina aurreikusgarria izan zen, eta arazoa kontratua jada baliogabetuta deskubritzea saihestu zuen.

<br>

<strong>Ondorioa</strong>

<br>

Irteerari buruzko galdera ez da mesfidantza keinu bat, ebaluazio serio baten parte baizik. Formatu zehatzekin, API dokumentatuarekin eta idatzitako epeekin erantzuten duen hornitzaile batek seinalerik onena ematen dizue zuen datuak nola tratatuko dituen bezero zareten bitartean. Orokortasunekin erantzuten duenak ere zerbait esaten dizue.

Edenan API dokumentatua, entitateka esportazio osoa formatu irekietan eta kontratuan idatzitako irteera baldintzak argitaratzen ditugu, produktuagatik gera zaitezten nahiago dugulako eta ez joan ezin zaretelako. Eskatu demo bat eta zehazki zer ateratzen den eta zein formatutan erakutsiko dizugu.

<br>
