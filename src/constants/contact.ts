/** Direct lines to the founders. Also quoted in the Terms (section 4.6), so keep both in sync. */
export const WHATSAPP_NUMBERS = [
    { display: "+34 674 670 365", url: "https://wa.me/34674670365" },
    { display: "+34 711 525 446", url: "https://wa.me/34711525446" },
] as const;

/** The line behind the floating "Let's talk" button. */
export const WHATSAPP_CHAT = WHATSAPP_NUMBERS[1];
