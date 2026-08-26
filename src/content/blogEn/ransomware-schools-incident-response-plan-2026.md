---
title: "They've encrypted the school's data: the response plan you should already have written"
date: "2026-08-10"
translationKey: "ransomware-centros-educativos-plan-respuesta-2026"
description: "Education ranks among Spain's most attacked sectors. What to do in the first 72 hours: NIS2 and GDPR notification clocks, who to call in what order, what to tell families and what to demand from your vendor."
tags: ["cybersecurity", "ransomware", "NIS2", "data protection", "crisis management"]
author: "ENA by Edena"
cover: "https://images.unsplash.com/photo-1634224143538-ce0221abf732?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
relatedPosts:
    - data-security-educational-centers
    - data-protection-digital-schools
    - crisis-management-educational-centers
    - school-document-management-digital-records-2026
faqs:
    - question: "Should we pay the ransom?"
      answer: "INCIBE and law enforcement are unanimous: don't. Paying does not guarantee you get the data back, does not stop it being published anyway, and funds the next campaign. It also removes none of your notification duties: you still have to inform the data protection authority and the families."
    - question: "How long do we have to report a breach?"
      answer: "The GDPR gives 72 hours from becoming aware of the breach to notify the supervisory authority, where there is a risk to people's rights. If the risk is high, you must also inform those affected without undue delay. Entities in scope of NIS2 add a 24-hour early warning on top."
    - question: "If our software vendor was attacked, is it their responsibility?"
      answer: "The vendor answers as processor and must notify you without undue delay, but the school remains the controller before the authority and before families. That is why the contract must set concrete deadlines and notification channels, not generic wording."
    - question: "How do I know my backups actually work?"
      answer: "Only one way: by restoring. A backup that has never been restored is a hypothesis, not a safety net. Run a full test restore at least once a year and check the backups are not reachable from the same network that would be encrypted in an attack."
---

<strong>They've encrypted the school's data: the response plan you should already have written</strong>

<br>

On 26 July it emerged that the Andalusian regional government was investigating unauthorised access to its Séneca system following a malware attack, with teacher and student data compromised. It was neither an isolated case nor a random target. INCIBE handled 122,223 incidents during 2025, 26% more than the previous year, and education appears consistently among Spain's most attacked sectors, alongside healthcare and local government.

<br>

<strong>Why a school is an easy target</strong>

<br>

The reason is uncomfortable but simple. A school concentrates data on minors, health data, families' financial data and staff employment data, all in one place, on modest security budgets and with a workforce that was not hired to spot fraudulent emails. It is **a high-value, low-resistance target**.

This article is not about preventing the attack, which is a long and well-covered topic. It is about what almost no school has written down: exactly what happens in the first few hours, once the attack has already happened.

<br>

<strong>The first two hours: contain, don't investigate</strong>

<br>

The most common mistake is wanting to understand what happened before stopping what is happening. During active encryption, every minute the network stays connected is another machine affected. Understanding comes later; stopping comes now.

<br>

<strong>What to do, in this order</strong>

<br>

- **Isolate without powering down:** disconnect affected machines from the network, but do not switch them off. Powering down destroys evidence held in memory that will be needed later.
- **Disconnect the backups:** if backup storage is reachable from the same network, disconnect it. Encrypting it too is the attacker's usual goal.
- **Cut remote access:** revoke active sessions and disable external access.
- **Touch nothing else:** don't delete, don't reinstall, don't try to decrypt on your own. All of that destroys evidence the forensic examiner, the insurer and, if it comes to it, the supervisory authority will need.

<br>

<strong>The three clocks that start running</strong>

<br>

Here is what almost nobody has straight, and what costs the most. An incident starts simultaneous deadlines with different recipients:

- **72 hours, GDPR:** from the moment the school becomes aware of the breach to notify the data protection authority, where there is a risk to the rights of those affected. If that risk is high — and with children's data it almost always is — you must also inform the affected people without undue delay.
- **24 hours, NIS2:** an early warning to the competent authority, applicable to entities within its scope. Many private schools fall outside it, but large groups and entities linked to public administration should verify where they stand before they need to.
- **The first few hours, families:** an informal but decisive clock. If the school does not communicate early, the information will circulate anyway through messaging groups, uncontrolled and in worse versions than the truth.

<br>

<strong>The call order</strong>

<br>

It is worth having on a single page, with real names and phone numbers, updated every year:

- **Systems lead or IT provider:** executes containment. This is the first call, always.
- **Leadership and governing body:** take coordination and the communication decisions.
- **Data protection officer:** assesses the risk and prepares the notification.
- **Management software vendor:** if the affected data sits on their platform, as processor they are obliged to inform and cooperate.
- **Legal counsel and insurer:** if there is a cyber policy, activating it early affects the cover.
- **National cybersecurity institute and law enforcement:** where appropriate, and not before containment.

The order matters because the natural temptation is to start at the end, filing a report, and leave containment for later.

<br>

<strong>What you tell families, and what you don't</strong>

<br>

The initial communication has to go out even before the scope is known, and precisely for that reason it must state what is known and what is not. Four elements: what happened in plain terms, which data might be affected, what the school is doing, and what the family should do — usually, be suspicious of any message asking for data or payments.

What you must not do is minimise before you know, promise that nothing happened, or give technical detail about the attack vector, which only helps whoever wants to repeat it. And open a single channel for questions, or the office will be swamped for days.

<br>

<strong>The question that decides the scope</strong>

<br>

When the moment comes to assess the breach, it all reduces to one question: **where each piece of data lives**. A school with academic records and financial data on an external platform, and only administrative documentation on its local network, suffers an awkward incident. A school with everything on the same server suffers a crisis involving children. The architecture writes the headline.

<br>

<strong>What has to be ready beforehand, not during</strong>

<br>

A response plan written on the day of the incident is not a plan. Five things only work if they are done in advance:

- **Tested backups, not just scheduled ones:** a backup that has never been restored is a hypothesis. Run a full test restore at least once a year, and keep backups isolated from the network that would be encrypted.
- **An inventory of where each piece of data lives:** what is on your own servers, what is on the management platform, what is in mail and storage, what is on somebody's laptop. Without it you cannot assess the scope in 72 hours.
- **Two-factor authentication on everything that supports it:** starting with email and administrator access. It is the measure with the best ratio of cost to attacks prevented.
- **A permissions review:** how many people can see a student's full record, and why. Most breaches amplify their damage because everybody had access to everything.
- **An annual walkthrough:** half an hour reading the plan with the leadership team beats twenty pages nobody has opened.

<br>

<strong>What to require from your vendor by contract</strong>

<br>

If the data sits on a third-party platform, the contract is part of the response plan. It should set a concrete notification deadline — not just "without undue delay" — an identified alert channel, a commitment to help assess the scope, and detail on where the data is hosted and under what measures.

<br>

<strong>Case study (Spain)</strong>

<br>

An education group with two sites noticed on a Friday afternoon that several administrative machines were showing encrypted files. The systems lead isolated the network within twenty minutes and disconnected the backup storage, which sat on a separate machine and was never affected.

Saturday's assessment established that what had been encrypted was the shared administrative drive: payroll, contracts and scanned documentation. Academic records and families' financial data were on the management platform, hosted externally and unconnected to the attacked network, which sharply reduced the scope.

The authority was notified on Monday, within the deadline. Affected staff were informed; families were not, because their data was not compromised. Restoration was completed on Tuesday from Thursday night's backup. The real loss was one day of administrative work.

<br>

<strong>Conclusion</strong>

<br>

No school can guarantee it won't happen. What it can decide is the state it will be caught in: with backups tested or untested, with the inventory done or pending, with an updated page of phone numbers or improvising on a Friday afternoon. The 24 and 72-hour clocks run regardless, and they don't accept the excuse that it was August.

Edena hosts academic and financial data with managed backups, role-based access control and a full trail of who consulted which record, with notification commitments written into the contract. Book a demo and we will go through which part of your information would sit outside the reach of an incident on your local network.

<br>
