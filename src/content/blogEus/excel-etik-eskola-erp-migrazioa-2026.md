---
title: "Excel-etik eskola ERP batera migratzea: datuak galdu gabeko gida"
date: "2026-05-27"
description: "Nola migratu Excel-etik eskola ERP batera urratsez urrats, datu kritikoak galdu gabe edo zentroaren kudeaketa gelditu gabe, 2026an."
tags:
    [
        "Excel-etik ERP-ra migratu",
        "ikastetxe datuen migrazioa",
        "eskola ERPa",
        "hezkuntza zentroen digitalizazioa",
        "eskola kudeaketa Excel gabe",
        "Edena",
    ]
author: "ENA by Edena"
cover: "https://images.unsplash.com/photo-1529078155058-5d716f45d604?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
relatedPosts:
    - erp-eskola-digitalizazio-gida
    - ikastetxe-digitalizazio-software-akatsak
    - software-aukera-egiaztapen-2026
    - eskola-kudeaketa-softwarea-konparaketa-2026-espainia
faqs:
    - question: "Arriskutsua al da Excel-etik eskola ERP batera migratzea?"
      answer: "Arriskua ez dago migratzean, planik gabe egitean baizik. Faseka egindako migrazio bat, Excel itzali aurretik benetako datuak balidatuz, segurua da. Benetako arriskua urteak kalkulu orrietan ematea da, non fitxategi hondatu batek, formula hautsi batek edo nahi gabeko ezabatze batek kobroen edo espedienteen informazioa kopiarik gabe eraman dezakeen."
    - question: "Zenbat denbora behar da Excel-etik ERP batera migratzeko?"
      answer: "Datu bolumenaren, zerbitzu kopuruaren (kuotak, jantokia, eskolaz kanpokoak) eta abiapuntuko datuak zein ordenatuta dauden araberakoa da. Zentro batek pilotu bat funtzionatzen izan dezake aste gutxitan barne arduradun bat eskaintzen badu eta faseka migratzen badu: lehenik datu nagusiak, gero fakturazioa, gero dokumentazioa."
    - question: "Zein datu migratu behar dira lehenik?"
      answer: "Datu nagusiak: ikasleak, familiak, taldeak eta banku datuak. Gero fakturazio historikoa eta ordainagiriak, eta azkenik dokumentazioa. Dena batera migratzea akatsak egiten diren lekua da. Faseka, bloke bakoitza benetako datuekin balidatzen da hurrengora pasatu aurretik."
    - question: "Excel erabiltzen jarrai dezaket migratzen dudan bitartean?"
      answer: "Bai, eta hori da gomendagarria kontrolatutako elkarbizitza aldi batean. Giltza datu bloke bakoitzarentzat ebaki data bat finkatzea eta bi sistema paraleloan mugagabe ez mantentzea da, hor agertzen baitira egiaren bertsio bikoitzak. Elkarbizitza zubi bat da, ez helmuga bat."
    - question: "Edenak migrazioan laguntzen al du?"
      answer: "Edozein hornitzaile serioren planteamendu zuzena faseka egindako migrazio plan bat eskaintzea da, benetako datuen balidazioarekin eta laguntzarekin, ez itsu-itsuan botatzea. Komeni da demoan galdetzea hornitzaileak migrazioa nola lantzen duen, zein epetan eta zein euskarri ematen duen elkarbizitza aldian."
---

<strong>Excel-etik eskola ERP batera migratzea: datuak galdu gabeko gida</strong>

<br>

Hezkuntza zentro ia guztiak Excel-ekin kudeatzen hasten dira, eta askok behar baino denbora gehiago jarraitzen dute hor. Kalkulu orria doan, malgua eta ezaguna da, baina une bat iristen da non arrisku bihurtzen den: pertsona bakar batek ulertzen duen fitxategi bat, hausten diren formulak, bertsio bikoiztuak, hiruhilekoko kobroak kopiarik gabe eramaten dituen nahi gabeko ezabatze bat. Eskola ERP batera migratzea irteera logikoa da, baina beldurra ematen du: "eta datuak galtzen baditugu?", "eta kudeaketa fakturazio betean gelditzen badugu?". Berri ona migratzea ez dela zortearen kontua, metodoaren kontua baizik. Gida honek Excel-etik ERP batera faseka nola pasatu azaltzen du, datu kritikoak galdu gabe edo zentroa gelditu gabe.

<br>

<strong>Zergatik Excel-ek balio izateari uzten dion (funtzionatzen duela badirudi ere)</strong>

<br>

Excel-ek ez du edozein asteartetan huts egiten; egunik txarrenean huts egiten du. Funtzionatzen du bolumena baxua den eta pertsona bakar batek ukitzen duen bitartean. Baina zentroa hazten denean, sintomak agertzen dira: fitxategi beraren bi bertsio, norbaitek gaizki arrastatu zuen formula bat, itzulketak eragiten dituen banku datu eguneratu gabe bat, eta "dena nola muntatuta dagoen dakien" pertsonarekiko mendekotasuna. Funtsezko arazoa ez da tresna, zentroaren informazio kritikoa —kobroak, espedienteak, adingabeen datuak— sarbide kontrolik gabe, kopia fidagarririk gabe eta trazabilitaterik gabe bizi dela baizik. Hori arriskua da, ez erosotasuna.

<br>

<strong>Urrezko araua: faseka migratu, ez batera</strong>

<br>

Akats garestiena dena asteburu batean migratzen saiatzea da. Migrazio segurua fasekakoa da, eta fase bakoitza benetako datuekin balidatzen da hurrengora pasatu aurretik. Gomendatutako ordena: lehenik datu nagusiak (ikasleak, familiak, taldeak, banku datuak), gainerako guztiaren oinarria baitira; gero fakturazio historikoa eta ordainagiriak; azkenik, dokumentazioa. Blokeka migratzeak akatsak goiz detektatzea ahalbidetzen du, zuzentzeko merke direnean, dena barruan dagoenean aurkitu beharrean.

<br>

<strong>1. urratsa: garbitu datuak mugitu aurretik</strong>

<br>

Datu zikinak migratzeak desordena sistema berri batera eramaten du soilik. Ezer mugitu aurretik, komeni da arazketa egitea: IBAN eguneratu gabeak, ikasle bikoiztuak, datu osatugabeak dituzten familiak, jada existitzen ez diren taldeak. Urrats hau astuna da baina migrazioaren kalitatea erabakitzen duena da. ERP batek ez ditu datu txarrak konpontzen; jaraunsten ditu. Migrazioa garbitzeko aprobetxatzea beharrezko lan bat zentroaren datuen kalitatearen benetako hobekuntza bihurtzea da.

<br>

<strong>2. urratsa: balidatu bloke bakoitza benetako datuekin</strong>

<br>

Bloke bat migratu ondoren, benetako datuekin egiaztatu behar da, ez proba datuekin. Familia baten ordainagiriak koadratzea, banku datuak ondo egotea, espediente batek behar duena erakustea. Benetako kasuekin balidatzeak demo batek inoiz erakusten ez dituen arazoak detektatzen ditu. Bloke bat balidatuta dagoenean soilik ematen da ontzat eta hurrengora aurreratzen da. Diziplina hori da migrazio lasai bat itxiera betean ensurt batetik bereizten duena.

<br>

<strong>3. urratsa: kontrolatutako elkarbizitza ebaki datarekin</strong>

<br>

Trantsizioan zentzuzkoa da Excel babeskopia gisa mantentzea, baina baldintza batekin: bloke bakoitzarentzat ebaki data argi bat. Bi sistema paraleloan mugagabe mantentzea egiaren bi bertsioetarako bide segurua da. Elkarbizitza zubi bat da, ez helmuga bat: zeharkatu eta ixten da. Ebaki datatik aurrera, datua ERPan bizi da eta Excel irakurtzeko soilik historiko gisa geratzen da, ez sistema aktibo gisa.

<br>

<strong>Zer eskatu ERP hornitzaileari</strong>

<br>

- Faseka egindako migrazio plan bat, ez itsu-itsuan botatzea.
- Benetako datuekin balidazioa bloke bakoitza itxi aurretik.
- Laguntza elkarbizitza aldian.
- Argitasuna zer migratzen den, zein epetan eta nork egiten duen zati bakoitza.
- Benetako euskarria kasu arraroa agertzen denean, beti agertzen baita.

"Dena egun batean migratzen dugu zuk ezer egin gabe" agintzen duen hornitzaile batek susmoa piztu beharko luke: migrazio serioak zentroaren inplikazioa eta barne arduradun bat eskatzen ditu.

<br>

<strong>Nola lantzen duen Edenak</strong>

<br>

Edenaren planteamendua zentro baten digitalizaziorako espedientea, fakturazioa, komunikazioa eta zerbitzuak integratzen dituen plataforma batetik igarotzen da, migrazioaren ondoren datuak irizpide bakar batekin bizi daitezen orri sakabanatuetan beharrean. Migrazio planaren xehetasuna —faseak, epeak eta laguntza— zentroaren eta bere abiapuntuaren arabera zehazten da, beraz komeni da demoan lantzea. Garrantzitsua printzipioa da: faseka migratu, benetako datuekin balidatu eta Excel ez itzali dagokion blokea egiaztatu arte.

<br>

<strong>Testuingurua Espainian: zentro asko oraindik Excel-en</strong>

<br>

Digitalizazioaren aurrerapena gorabehera, Espainian ikastetxe, haur eskola eta akademia askok kobroak, espedienteak eta komunikazioa kalkulu orrietan kudeatzen jarraitzen dute, batzuetan hainbat tresna solterekin konbinatuta. Presio arauemaileak (datuen babesa, faktura elektronikoa, Verifactu) eta eraginkortasun beharrak migrazioa bultzatzen ari dira, baina datuak galtzeko beldurrak talde asko geldiarazten ditu. Migrazioa fasekako prozesu bat dela ulertzea, eta ez hutsera salto bat, da erabakia askatzen duena.

<br>

<strong>Kasu praktikoa (Espainia)</strong>

<br>

Ikastetxe batek ikasleak, kuotak eta jantokia hiru kalkulu orri ezberdinetan kudeatzen zituen, administrari bakar batek mantenduta. Migratu aurretik, bi aste eman zituen datuak arazten: bikoiztuak ezabatu eta IBANak eguneratu zituen. Gero faseka migratu zuen —lehenik ikasleak eta familiak, gero fakturazioa, gero dokumentazioa—, bloke bakoitza benetako ordainagiriekin balidatuz aurreratu aurretik. Excel irakurtzeko soilik babeskopia gisa mantendu zuen fase bakoitza itxi arte. Kudeaketa ez zen une batean ere gelditu eta pertsona bakar batekiko mendekotasunak arriskua izateari utzi zion.

<br>

<strong>Ondorioa</strong>

<br>

Excel-etik eskola ERP batera migratzea ez da salto arriskutsua faseka egiten bada: datuak garbitu, blokeka migratu, benetako datuekin balidatu eta ebaki data argi batekin itxi. Benetako arriskua urteak kontrolik, kopiarik edo trazabilitaterik gabeko kalkulu orrietan ematea da. Plan ordenatu batekin eta laguntzen duen hornitzaile batekin, migrazioa kontrolatutako prozesua da, ez ensurt bat. Edenarekin, datuak irizpide bakar batekin bizitzera pasatzen dira. Eskatu demo bat eta planteatu zure migrazio plana hurrengo ikasturtea baino lehen.

<br>
