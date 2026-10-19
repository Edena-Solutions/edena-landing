/*
 * A `<details>` that opens and closes on the iOS sheet's curve, the same in every browser (CSS can
 * only animate to `auto` in Chromium): the body unfolds to its height while its content rises into
 * focus a beat behind; closing folds it away, and a second tap mid-animation reverses it from where
 * it is. `data-state` says which way it is going, for the icon, before `open` catches up.
 *
 * Shared by the FAQ panel and the footer's sections on a phone.
 */

const OPEN_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const CLOSE_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The part that changes height, and the content inside it that fades. */
export interface DisclosureParts {
    body: HTMLElement;
    content: HTMLElement;
}

type Running = { body: Animation; content: Animation };
const running = new WeakMap<HTMLDetailsElement, Running>();

export const isAnimating = (details: HTMLDetailsElement) => running.has(details);

/** Stops whatever is moving on it and returns the height it had reached. */
function halt(details: HTMLDetailsElement, { body }: DisclosureParts): number {
    const height = body.getBoundingClientRect().height;
    const current = running.get(details);
    if (current) {
        current.body.cancel();
        current.content.cancel();
        running.delete(details);
    }
    return height;
}

export function openDisclosure(details: HTMLDetailsElement, parts: DisclosureParts) {
    const from = details.open ? halt(details, parts) : 0;
    details.dataset.state = "open";
    details.open = true;
    if (reduceMotion()) return;

    const to = parts.body.scrollHeight;
    const body = parts.body.animate([{ height: `${from}px` }, { height: `${to}px` }], {
        duration: 560,
        easing: OPEN_EASE,
    });
    const content = parts.content.animate(
        [
            { opacity: 0, transform: "translateY(-0.6rem)", filter: "blur(2px)" },
            { opacity: 1, transform: "none", filter: "blur(0)" },
        ],
        { duration: 520, delay: 70, easing: OPEN_EASE, fill: "backwards" },
    );
    running.set(details, { body, content });
    body.onfinish = () => running.delete(details);
}

export function closeDisclosure(details: HTMLDetailsElement, parts: DisclosureParts) {
    const from = halt(details, parts);
    details.dataset.state = "closed";
    if (reduceMotion()) {
        details.open = false;
        return;
    }

    const body = parts.body.animate([{ height: `${from}px` }, { height: "0px" }], {
        duration: 380,
        easing: CLOSE_EASE,
        fill: "forwards",
    });
    const content = parts.content.animate(
        [
            { opacity: 1, transform: "none" },
            { opacity: 0, transform: "translateY(-0.35rem)" },
        ],
        { duration: 200, easing: CLOSE_EASE, fill: "forwards" },
    );
    running.set(details, { body, content });
    body.onfinish = () => {
        details.open = false;
        body.cancel();
        content.cancel();
        running.delete(details);
    };
}

/** Sets a disclosure open or closed at once, with no animation (a layout change, a reset). */
export function setDisclosure(details: HTMLDetailsElement, parts: DisclosureParts, open: boolean) {
    halt(details, parts);
    details.open = open;
    details.dataset.state = open ? "open" : "closed";
}
