/** Text as a search compares it: no accents, no case ("Facturación" finds "facturacion"). */
export function foldText(text: string): string {
    return text.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase();
}

/** Whether every word of the query is somewhere in the (folded) text. */
export function matchesQuery(foldedText: string, query: string): boolean {
    const terms = foldText(query).split(/\s+/).filter(Boolean);
    return terms.every((term) => foldedText.includes(term));
}
