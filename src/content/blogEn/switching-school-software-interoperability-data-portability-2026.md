---
title: "Switching school software without losing your data: interoperability, APIs and portability"
date: "2026-08-12"
translationKey: "cambiar-software-escolar-interoperabilidad-portabilidad-datos-2026"
description: "The questions to put in writing before signing with a school management vendor: what you can export, in what format, what it integrates with and what happens to your data the day you leave."
tags: ["interoperability", "data portability", "API", "migration", "software selection"]
author: "ENA by Edena"
cover: "https://plus.unsplash.com/premium_photo-1682145189653-bb0b79db3415?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
relatedPosts:
    - migrate-excel-school-erp-2026
    - school-software-purchase-checklist-2026
    - school-management-software-comparison-spain-2026
    - erp-accountant-integration-schools-2026
faqs:
    - question: "Do I have a legal right to get my data back?"
      answer: "Yes. The school is the controller and the vendor the processor, so on termination they must return or delete the data on your instruction. What the law does not set is the format or the timeframe, and that is where it gets complicated: put both in the contract."
    - question: "What export format should I insist on?"
      answer: "At minimum, CSV or structured spreadsheets by entity — students, families, enrolments, grades, invoices, documents — not a PDF or a flat dump. A documented API on top is better, because it lets you migrate without depending on the outgoing vendor's cooperation."
    - question: "How long does migrating between systems really take?"
      answer: "Four to eight weeks of real work for a mid-sized school, most of it spent cleaning data rather than moving it. What stretches projects is almost always duplicates, unnormalised free-text fields and documentation that only exists on paper."
    - question: "When in the year is the best time to switch?"
      answer: "The natural break is between the end of one year and the start of the next, with enrolment already renewed and before classes begin. Switching mid-year is possible but means running two systems side by side for weeks, which is the most expensive part of the project."
---

<strong>Switching school software without losing your data: interoperability, APIs and portability</strong>

<br>

There is a question that almost never comes up in sales demos and that decides more contracts than you would think: what happens to my data the day I want to leave. Most leadership teams don't ask it because it sounds like distrust, and most vendors don't raise it because the answer rarely helps the sale. The result is that many schools find out the answer when they no longer have room to negotiate it.

<br>

<strong>Why the question matters now</strong>

<br>

The issue has become more pressing over the last year. Market analysis for 2026-2027 points the same way in several countries: software without native AI, without solid data protection compliance and without documented interoperability will be replaced or patched with third-party tools. And when the moment to replace arrives, **the friction is not price: it is the fear of losing fifteen years of student records.**

<br>

<strong>The four questions to put in writing</strong>

<br>

Before signing with any vendor — including the one you already have, at the next renewal — get written answers to four things. In writing means in the contract or an annex, not in an email from a sales rep:

- **What can I export, in what format, and how often?** A good answer is specific and by entity: students, legal guardians, enrolments by year, grades, attendance, invoices and their status, attached documents. A bad answer is "we'll give you a dump", because a dump can be a thousand-page PDF.
- **Is there a documented API accessible to the customer?** The school does not need to use it directly; it needs to exist, because it is objective proof that the data is extractable without relying on anybody's goodwill.
- **What does it integrate with natively?** Be specific and ask about what you actually use, not about a generic list of logos.
- **What happens on termination?** A concrete deadline to deliver the export, a committed format, any cost involved, and how long data is retained before deletion.

<br>

<strong>Why vendor lock-in is usually not malicious</strong>

<br>

It helps to understand the mechanism, because it helps you judge the answers. Very few vendors withhold data deliberately. Lock-in happens by accumulation: over years you build up custom fields, uploaded documents, templates, communication histories and configurations that have no exact equivalent in any other system.

<br>

<strong>The structured data, and the part nobody exports</strong>

<br>

That means real portability is not binary. You can export 100% of structured data — students, grades, invoices — and still lose 100% of the unstructured material, which is often what took the most work to build. Asking specifically about **attached documents and communication history** is what separates a serious evaluation from a superficial one.

<br>

<strong>Interoperability is not the same as integration</strong>

<br>

The distinction matters because vendors use the two words interchangeably and they are not. An integration is a specific connection to a specific system, built and maintained by somebody: it works well as long as both sides maintain it. Interoperability is the ability to exchange data with any system through open formats and standards, without needing a specific connection to exist.

For a small school, native integrations handle daily work and interoperability is insurance. For a group with several sites and legacy systems, interoperability stops being insurance and becomes a requirement, because no vendor is going to build bespoke integrations for every case.

<br>

<strong>What a school ERP should integrate with</strong>

<br>

When you ask about integrations, ask about these five rather than a generic list:

- **Your regional education platform:** Séneca, Rayuela, ITACA, GESTIB or whichever applies.
- **Your learning environment:** Google Classroom, Moodle or Microsoft Teams, depending on what teachers use.
- **Your accountant or accounting software:** so the month's invoices don't have to be re-keyed by hand.
- **The payment gateway and the bank:** direct debits, returns and reconciliation.
- **Institutional email and the user directory:** so you are not maintaining two lists of joiners and leavers.

<br>

<strong>What actually makes a migration drag</strong>

<br>

The usual expectation is that migrating is a technical problem. In practice, for a mid-sized school it is four to eight weeks of real work, and most of it goes not into moving data but into cleaning it. The three culprits are almost always the same:

- **Duplicates:** the same student registered twice, families with two records, siblings with repeated guardians.
- **Unnormalised free-text fields:** addresses written five different ways, phone numbers with and without country codes, year groups named differently depending on who created them.
- **Documentation that only exists on paper:** or in somebody's local folder. It is in no system and therefore cannot be migrated at all.

<br>

<strong>The cleaning can start today</strong>

<br>

That yields a very useful practical consequence: data cleaning does not depend on which vendor you choose. It can start before deciding anything, and doing so shortens the project whatever the final decision. And if you end up staying where you are, you will have improved what you have anyway.

<br>

<strong>When to switch</strong>

<br>

The natural break is between the end of one year and the start of the next: enrolment renewed, grades closed and classes not yet started. That is the only moment when the old system can be frozen as an archive while the new one starts clean.

<br>

<strong>If there is no choice but to switch mid-year</strong>

<br>

It is possible, but it means running two systems for weeks, with the risk that a record gets updated in one and not the other. The rule is clear and admits no nuance: **one system is the official one from day one and the other is read-only**, with no exceptions or special cases. The moment one exception is allowed, two versions of the truth appear.

<br>

<strong>Case study (Spain)</strong>

<br>

A group with four sites had wanted to unify platforms for three years and kept not doing it for one specific reason: nobody knew whether they could recover the historic records from the oldest system, in use since 2009.

Before negotiating with any new vendor, they asked their current one in writing for a test export. It took five weeks to arrive and came in a format containing students, enrolments and grades, but not attached documents or communications. That answer, uncomfortable but clear, is what made real planning possible.

The decision was to migrate the structured data to the new system and keep the old one in read-only mode for two years for the attached documentation, with a schedule for manually downloading the records they were legally required to retain. It was not elegant, but it was predictable, and it avoided discovering the problem after the contract had already been terminated.

<br>

<strong>Conclusion</strong>

<br>

The exit question is not an act of distrust, it is part of a serious evaluation. A vendor who answers with concrete formats, a documented API and written deadlines is giving you the best possible signal about how they will treat your data while you are a customer. One who answers in generalities is telling you something too.

At Edena we publish a documented API, full export by entity in open formats, and exit terms written into the contract, because we would rather you stayed for the product than because you couldn't leave. Book a demo and we will show you exactly what comes out and in what format.

<br>
