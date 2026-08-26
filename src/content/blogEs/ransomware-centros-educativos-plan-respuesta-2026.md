---
title: "Han cifrado los datos del centro: el plan de respuesta que deberías tener escrito"
date: "2026-08-10"
translationKey: "ransomware-centros-educativos-plan-respuesta-2026"
description: "Educación está entre los sectores más atacados de España. Qué hacer en las primeras 72 horas de un incidente: relojes de notificación NIS2 y RGPD, orden de llamadas, qué se comunica a las familias y qué exigir a tu proveedor."
tags: ["ciberseguridad", "ransomware", "NIS2", "protección de datos", "gestión de crisis"]
author: "ENA by Edena"
cover: "https://images.unsplash.com/photo-1634224143538-ce0221abf732?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
relatedPosts:
    - seguridad-datos-centros-educativos
    - proteccion-datos-escuela-digital
    - gestion-crisis-centros-educativos
    - gestion-documental-colegios-expediente-digital-2026
faqs:
    - question: "¿Hay que pagar el rescate?"
      answer: "La recomendación unánime de INCIBE y de las fuerzas de seguridad es no pagar. Pagar no garantiza recuperar los datos, no impide que se publiquen igualmente y financia la siguiente campaña. Además, el pago no elimina ninguna de las obligaciones de notificación: seguís teniendo que informar a la AEPD y a las familias."
    - question: "¿Cuánto tiempo tengo para notificar una brecha?"
      answer: "El RGPD da 72 horas desde que tenéis constancia de la brecha para notificar a la AEPD, si hay riesgo para los derechos de las personas. Si el riesgo es alto, además hay que informar a los afectados sin dilación indebida. Para entidades sujetas a NIS2 se suma una alerta temprana en 24 horas."
    - question: "Si el ataque fue a mi proveedor de software, ¿la responsabilidad es suya?"
      answer: "El proveedor responde como encargado del tratamiento y debe notificaros sin dilación indebida, pero el centro sigue siendo el responsable del tratamiento frente a la AEPD y frente a las familias. Por eso el contrato debe fijar plazos y canales de aviso concretos, no fórmulas genéricas."
    - question: "¿Cómo sé si mis copias de seguridad sirven?"
      answer: "Solo hay una forma: restaurando. Una copia que nunca se ha restaurado es una hipótesis, no un respaldo. Conviene probar una restauración completa al menos una vez al año y comprobar que las copias no son accesibles desde la misma red que se cifraría en un ataque."
---

<strong>Han cifrado los datos del centro: el plan de respuesta que deberías tener escrito</strong>

<br>

El 26 de julio se conoció que la Junta de Andalucía investigaba un acceso no autorizado al sistema Séneca tras un ataque con malware, con datos de docentes y alumnos comprometidos. No fue un caso aislado ni un objetivo casual. INCIBE gestionó 122.223 incidentes durante 2025, un 26 % más que el año anterior, y educación aparece sistemáticamente entre los sectores más atacados de España, junto a sanidad y administración local.

<br>

<strong>Por qué un centro educativo es un objetivo fácil</strong>

<br>

La razón es incómoda pero sencilla. Un centro concentra datos de menores, datos de salud, datos económicos de familias y datos laborales de personal, todo junto, con presupuestos de seguridad modestos y con una plantilla que no fue contratada para detectar correos fraudulentos. Es **un objetivo de alto valor y baja resistencia**.

Este artículo no va de cómo evitar el ataque, que es un tema largo y bien cubierto. Va de lo que casi ningún centro tiene escrito: qué se hace exactamente en las primeras horas, cuando el ataque ya ha ocurrido.

<br>

<strong>Las primeras dos horas: contener, no investigar</strong>

<br>

El error más frecuente es querer entender qué ha pasado antes de detener lo que está pasando. En un cifrado activo, cada minuto de red conectada es equipo adicional afectado. Entender viene después; parar viene ahora.

<br>

<strong>Qué hacer, en este orden</strong>

<br>

- **Aislar sin apagar:** desconectad de la red los equipos afectados, pero no los apaguéis. Apagar destruye evidencia en memoria que después hará falta.
- **Desconectar las copias:** si el almacenamiento de copias es accesible desde la misma red, desconectadlo. Cifrarlas también es el objetivo habitual del atacante.
- **Cortar accesos remotos:** revocad sesiones activas y desactivad los accesos desde fuera.
- **No tocar nada más:** no borréis, no reinstaléis, no intentéis descifrar por vuestra cuenta. Todo eso destruye evidencia que el perito, la aseguradora y, si toca, la AEPD van a necesitar.

<br>

<strong>Los tres relojes que empiezan a correr</strong>

<br>

Aquí está lo que casi nadie tiene claro y lo que más caro sale. Un incidente pone en marcha plazos simultáneos con destinatarios distintos:

- **72 horas, RGPD:** desde que el centro tiene constancia de la brecha para notificarla a la Agencia Española de Protección de Datos, si existe riesgo para los derechos de las personas afectadas. Si el riesgo es alto —y con datos de menores lo es casi siempre— hay además que comunicarlo a los propios afectados sin dilación indebida.
- **24 horas, NIS2:** alerta temprana a la autoridad competente, aplicable a las entidades incluidas en su ámbito. Muchos centros privados quedan fuera, pero los grupos grandes y las entidades vinculadas a administración pública conviene que verifiquen su encaje antes de necesitarlo.
- **Las primeras horas, las familias:** un reloj informal pero decisivo. Si el centro no comunica pronto, la información circulará igual por grupos de mensajería, sin control y con versiones peores que la real.

<br>

<strong>El orden de llamadas</strong>

<br>

Merece la pena tenerlo escrito en una sola página, con nombres y teléfonos reales, y actualizarlo cada curso:

- **Sistemas o proveedor informático:** ejecuta la contención. Es la primera llamada, siempre.
- **Dirección y titularidad:** asumen la coordinación y las decisiones de comunicación.
- **Delegado de protección de datos:** evalúa el riesgo y prepara la notificación.
- **Proveedor de software de gestión:** si los datos afectados están en su plataforma, como encargado del tratamiento tiene obligación de informar y colaborar.
- **Asesoría jurídica y aseguradora:** si existe póliza de ciberriesgo, activarla pronto condiciona la cobertura.
- **INCIBE y fuerzas de seguridad:** cuando proceda, y no antes de haber contenido.

Este orden importa porque la tentación natural es empezar por el final, denunciando, y dejar la contención para después.

<br>

<strong>Qué se comunica a las familias y qué no</strong>

<br>

La comunicación inicial debe salir aunque no se sepa todavía el alcance, y precisamente por eso debe decir lo que se sabe y lo que no. Cuatro elementos: qué ha ocurrido en términos comprensibles, qué datos podrían estar afectados, qué está haciendo el centro y qué debe hacer la familia —normalmente, desconfiar de comunicaciones que pidan datos o pagos.

Lo que no debe hacerse es minimizar antes de saber, prometer que no ha pasado nada o dar detalles técnicos del vector de ataque, que solo sirven a quien quiera repetirlo. Y conviene abrir un canal único para preguntas, porque si no la secretaría queda colapsada durante días.

<br>

<strong>La pregunta que decide el alcance</strong>

<br>

Cuando llega el momento de evaluar la brecha, todo se reduce a una pregunta: **dónde vive cada dato**. Un centro que tiene el expediente académico y los datos económicos en una plataforma externa, y solo la documentación administrativa en su red local, sufre un incidente incómodo. Un centro que lo tiene todo en el mismo servidor sufre una crisis con menores afectados. La arquitectura decide el titular.

<br>

<strong>Lo que hay que preparar antes, no durante</strong>

<br>

Un plan de respuesta que se escribe el día del incidente no es un plan. Hay cinco cosas que solo sirven si están hechas antes:

- **Copias probadas, no solo programadas:** una copia que nunca se ha restaurado es una hipótesis. Haced una restauración completa de prueba al menos una vez al año, y mantened las copias aisladas de la red que se cifraría.
- **Inventario de dónde vive cada dato:** qué hay en servidores propios, qué en la plataforma de gestión, qué en correo y almacenamiento, qué en el ordenador de alguien. Sin él no se puede evaluar el alcance en 72 horas.
- **Doble factor en todo lo que lo admita:** empezando por el correo y por los accesos de administración. Es la medida con mejor relación entre coste y ataques evitados.
- **Revisión de permisos:** cuánta gente puede ver el expediente completo de un alumno, y por qué. La mayoría de brechas amplifica su daño porque todo el mundo tenía acceso a todo.
- **Un ensayo anual:** media hora leyendo el plan en equipo directivo vale más que veinte páginas que nadie ha abierto.

<br>

<strong>Qué exigir al proveedor por contrato</strong>

<br>

Si los datos están en una plataforma de terceros, el contrato es parte del plan de respuesta. Conviene que fije un plazo concreto de notificación —no «sin dilación indebida» a secas—, un canal de aviso identificado, el compromiso de colaborar en la evaluación del alcance y el detalle de dónde se alojan los datos y con qué medidas.

<br>

<strong>Caso práctico (España)</strong>

<br>

Un grupo educativo con dos centros detectó un viernes por la tarde que varios equipos de administración mostraban ficheros cifrados. El responsable de sistemas aisló la red en veinte minutos y desconectó el almacenamiento de copias, que estaba en un equipo distinto y no llegó a verse afectado.

La evaluación del sábado determinó que lo cifrado era la unidad compartida de administración: nóminas, contratos y documentación escaneada. El expediente académico y los datos económicos de familias estaban en la plataforma de gestión, alojada fuera y sin relación con la red atacada, lo que redujo drásticamente el alcance.

Se notificó a la AEPD el lunes, dentro de plazo. Se comunicó al personal afectado, no a las familias, porque sus datos no estaban comprometidos. Y la restauración se completó el martes desde una copia de la noche del jueves. La pérdida real fue de un día de trabajo administrativo.

<br>

<strong>Conclusión</strong>

<br>

Ningún centro puede garantizar que no le va a pasar. Lo que sí puede decidir es en qué estado le pilla: con las copias probadas o sin probar, con el inventario hecho o por hacer, con una página de teléfonos actualizada o improvisando un viernes por la tarde. Los relojes de 24 y 72 horas corren igual, y no admiten la excusa de que era agosto.

En Edena alojamos los datos académicos y económicos con copias gestionadas, control de accesos por perfil y trazabilidad de quién consulta cada expediente, con compromisos de notificación escritos en el contrato. Pide una demo y repasamos contigo qué parte de tu información quedaría fuera del alcance de un incidente en tu red local.

<br>
