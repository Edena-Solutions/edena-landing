---
title: "Les données de l'établissement sont chiffrées : le plan de réponse que vous devriez déjà avoir"
date: "2026-08-10"
translationKey: "ransomware-centros-educativos-plan-respuesta-2026"
description: "L'éducation figure parmi les secteurs les plus attaqués d'Espagne. Que faire dans les 72 premières heures : horloges de notification NIS2 et RGPD, ordre des appels, ce qu'on dit aux familles et ce qu'il faut exiger de son prestataire."
tags: ["cybersécurité", "rançongiciel", "NIS2", "protection des données", "gestion de crise"]
author: "ENA by Edena"
cover: "https://plus.unsplash.com/premium_photo-1682145189653-bb0b79db3415?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
relatedPosts:
    - securite-donnees-etablissements-scolaires
    - protection-donnees-ecole-numerique
    - gestion-crise-etablissements-scolaires
    - gestion-documentaire-ecoles-2026
faqs:
    - question: "Faut-il payer la rançon ?"
      answer: "La recommandation est unanime : non. Payer ne garantit pas de récupérer les données, n'empêche pas leur publication et finance la campagne suivante. Le paiement ne supprime par ailleurs aucune obligation de notification : vous devez toujours informer l'autorité de protection des données et les familles."
    - question: "De combien de temps dispose-t-on pour notifier une violation ?"
      answer: "Le RGPD accorde 72 heures à compter de la prise de connaissance pour notifier l'autorité de contrôle, s'il existe un risque pour les droits des personnes. Si le risque est élevé, il faut en outre informer les personnes concernées sans délai injustifié. Pour les entités soumises à NIS2 s'ajoute une alerte précoce sous 24 heures."
    - question: "Si l'attaque visait mon prestataire logiciel, la responsabilité lui incombe-t-elle ?"
      answer: "Le prestataire répond en tant que sous-traitant et doit vous notifier sans délai injustifié, mais l'établissement reste responsable de traitement face à l'autorité et aux familles. D'où l'importance de délais et de canaux d'alerte concrets dans le contrat, et non de formules génériques."
    - question: "Comment savoir si mes sauvegardes fonctionnent ?"
      answer: "Une seule façon : en restaurant. Une sauvegarde jamais restaurée est une hypothèse, pas un filet. Testez une restauration complète au moins une fois par an et vérifiez que les sauvegardes ne sont pas accessibles depuis le réseau qui serait chiffré lors d'une attaque."
---

<strong>Les données de l'établissement sont chiffrées : le plan de réponse que vous devriez déjà avoir</strong>

<br>

Le 26 juillet, on apprenait que le gouvernement régional d'Andalousie enquêtait sur un accès non autorisé à son système Séneca après une attaque par logiciel malveillant, avec des données d'enseignants et d'élèves compromises. Ce n'était ni un cas isolé ni une cible fortuite. L'INCIBE a traité 122 223 incidents en 2025, soit 26 % de plus que l'année précédente, et l'éducation figure systématiquement parmi les secteurs les plus attaqués d'Espagne, aux côtés de la santé et des collectivités locales.

<br>

<strong>Pourquoi un établissement scolaire est une cible facile</strong>

<br>

La raison est dérangeante mais simple. Un établissement concentre des données de mineurs, des données de santé, des données financières de familles et des données salariales de personnel, le tout au même endroit, avec des budgets de sécurité modestes et des équipes qui n'ont pas été recrutées pour repérer des courriels frauduleux. C'est **une cible à forte valeur et à faible résistance**.

Cet article ne traite pas de la prévention de l'attaque, sujet long et bien couvert. Il traite de ce que presque aucun établissement n'a couché par écrit : ce que l'on fait exactement dans les premières heures, une fois l'attaque survenue.

<br>

<strong>Les deux premières heures : contenir, pas enquêter</strong>

<br>

L'erreur la plus fréquente consiste à vouloir comprendre ce qui s'est passé avant d'arrêter ce qui est en train de se passer. Pendant un chiffrement actif, chaque minute de réseau connecté représente un poste supplémentaire touché. Comprendre vient après ; arrêter vient maintenant.

<br>

<strong>Que faire, dans cet ordre</strong>

<br>

- **Isoler sans éteindre :** déconnectez du réseau les postes atteints, mais ne les éteignez pas. L'extinction détruit des preuves en mémoire qui seront nécessaires ensuite.
- **Déconnecter les sauvegardes :** si le stockage des sauvegardes est accessible depuis le même réseau, déconnectez-le. Les chiffrer aussi est l'objectif habituel de l'attaquant.
- **Couper les accès distants :** révoquez les sessions actives et désactivez les accès depuis l'extérieur.
- **Ne toucher à rien d'autre :** n'effacez pas, ne réinstallez pas, n'essayez pas de déchiffrer vous-même. Tout cela détruit des preuves dont l'expert, l'assureur et, le cas échéant, l'autorité de contrôle auront besoin.

<br>

<strong>Les trois horloges qui se déclenchent</strong>

<br>

Voici ce que presque personne n'a en tête et ce qui coûte le plus cher. Un incident déclenche des délais simultanés avec des destinataires différents :

- **72 heures, RGPD :** à compter du moment où l'établissement a connaissance de la violation, pour la notifier à l'autorité de contrôle, dès lors qu'il existe un risque pour les droits des personnes concernées. Si ce risque est élevé — et avec des données de mineurs il l'est presque toujours — il faut en outre informer les personnes concernées sans délai injustifié.
- **24 heures, NIS2 :** alerte précoce auprès de l'autorité compétente, applicable aux entités entrant dans son champ. Beaucoup d'établissements privés en sortent, mais les grands groupes et les entités liées à l'administration publique ont intérêt à vérifier leur situation avant d'en avoir besoin.
- **Les premières heures, les familles :** une horloge informelle mais décisive. Si l'établissement ne communique pas vite, l'information circulera de toute façon par les groupes de messagerie, sans contrôle et dans des versions pires que la réalité.

<br>

<strong>L'ordre des appels</strong>

<br>

Il mérite de tenir sur une seule page, avec de vrais noms et numéros, mise à jour chaque année :

- **Systèmes ou prestataire informatique :** exécute le confinement. C'est le premier appel, toujours.
- **Direction et organisme gestionnaire :** prennent la coordination et les décisions de communication.
- **Délégué à la protection des données :** évalue le risque et prépare la notification.
- **Prestataire du logiciel de gestion :** si les données concernées sont sur sa plateforme, en tant que sous-traitant il a l'obligation d'informer et de coopérer.
- **Conseil juridique et assureur :** s'il existe une police cyber, l'activer tôt conditionne la couverture.
- **Organisme national de cybersécurité et forces de l'ordre :** le cas échéant, et pas avant d'avoir contenu.

Cet ordre compte, car la tentation naturelle est de commencer par la fin, en portant plainte, et de remettre le confinement à plus tard.

<br>

<strong>Ce que l'on dit aux familles, et ce que l'on ne dit pas</strong>

<br>

La communication initiale doit partir même si l'ampleur n'est pas connue, et c'est précisément pourquoi elle doit dire ce que l'on sait et ce que l'on ignore. Quatre éléments : ce qui s'est passé en termes compréhensibles, quelles données pourraient être touchées, ce que fait l'établissement et ce que doit faire la famille — en général, se méfier de tout message demandant des données ou des paiements.

Ce qu'il ne faut pas faire : minimiser avant de savoir, promettre qu'il ne s'est rien passé, ou donner des détails techniques sur le vecteur d'attaque, qui ne servent qu'à qui voudrait le reproduire. Et ouvrez un canal unique pour les questions, sinon le secrétariat sera submergé pendant des jours.

<br>

<strong>La question qui décide de l'ampleur</strong>

<br>

Au moment d'évaluer la violation, tout se ramène à une question : **où vit chaque donnée**. Un établissement qui héberge dossiers scolaires et données financières sur une plateforme externe, et seulement la documentation administrative sur son réseau local, subit un incident gênant. Un établissement qui a tout sur le même serveur subit une crise touchant des mineurs. L'architecture écrit le titre.

<br>

<strong>Ce qu'il faut préparer avant, pas pendant</strong>

<br>

Un plan de réponse rédigé le jour de l'incident n'est pas un plan. Cinq choses ne servent que si elles sont faites en amont :

- **Des sauvegardes testées, pas seulement programmées :** une sauvegarde jamais restaurée est une hypothèse. Testez une restauration complète au moins une fois par an et gardez les sauvegardes isolées du réseau qui serait chiffré.
- **Un inventaire de l'endroit où vit chaque donnée :** ce qui est sur vos serveurs, sur la plateforme de gestion, dans la messagerie et le stockage, sur l'ordinateur de quelqu'un. Sans lui, impossible d'évaluer l'ampleur en 72 heures.
- **L'authentification à deux facteurs partout où elle existe :** à commencer par la messagerie et les accès d'administration. C'est la mesure au meilleur rapport entre coût et attaques évitées.
- **Une revue des habilitations :** combien de personnes peuvent consulter le dossier complet d'un élève, et pourquoi. La plupart des violations amplifient leurs dégâts parce que tout le monde avait accès à tout.
- **Une répétition annuelle :** une demi-heure à lire le plan en équipe de direction vaut mieux que vingt pages que personne n'a ouvertes.

<br>

<strong>Ce qu'il faut exiger du prestataire par contrat</strong>

<br>

Si les données sont sur une plateforme tierce, le contrat fait partie du plan de réponse. Il doit fixer un délai de notification concret — pas seulement « sans délai injustifié » —, un canal d'alerte identifié, l'engagement de coopérer à l'évaluation de l'ampleur, et le détail de l'hébergement des données et des mesures appliquées.

<br>

<strong>Cas pratique (Espagne)</strong>

<br>

Un groupe scolaire de deux établissements a constaté un vendredi après-midi que plusieurs postes administratifs affichaient des fichiers chiffrés. Le responsable des systèmes a isolé le réseau en vingt minutes et déconnecté le stockage des sauvegardes, situé sur une machine distincte et resté indemne.

L'évaluation du samedi a établi que le chiffrement portait sur le disque partagé de l'administration : paies, contrats et documents scannés. Les dossiers scolaires et les données financières des familles se trouvaient sur la plateforme de gestion, hébergée à l'extérieur et sans lien avec le réseau attaqué, ce qui a fortement réduit l'ampleur.

L'autorité a été notifiée le lundi, dans les délais. Le personnel concerné a été informé ; les familles ne l'ont pas été, leurs données n'étant pas compromises. La restauration s'est achevée le mardi à partir d'une sauvegarde du jeudi soir. La perte réelle : une journée de travail administratif.

<br>

<strong>Conclusion</strong>

<br>

Aucun établissement ne peut garantir que cela n'arrivera pas. Ce qu'il peut décider, c'est dans quel état il sera pris : sauvegardes testées ou non, inventaire fait ou à faire, page de contacts à jour ou improvisation un vendredi après-midi. Les horloges de 24 et 72 heures tournent quoi qu'il arrive, et n'admettent pas l'excuse du mois d'août.

Chez Edena, nous hébergeons les données scolaires et financières avec des sauvegardes gérées, un contrôle des accès par profil et la traçabilité de qui consulte chaque dossier, avec des engagements de notification inscrits au contrat. Demandez une démo et nous verrons ensemble quelle part de vos informations resterait hors d'atteinte d'un incident sur votre réseau local.

<br>
