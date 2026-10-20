// qrcode ships no types, and @types/qrcode would bring @types/node into the lockfile for the one
// call the site makes (`components/QrCode.astro`, at build time).
declare module "qrcode" {
    interface QRCode {
        modules: {
            size: number;
            /** 1 for a dark module. */
            get(row: number, col: number): number;
        };
        version: number;
    }

    const QRCode: {
        create(text: string, options?: { errorCorrectionLevel?: "L" | "M" | "Q" | "H" }): QRCode;
    };
    export default QRCode;
}
