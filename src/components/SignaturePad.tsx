import { useRef, useState, useEffect, useCallback } from "react";
import { Eraser, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SignaturePadProps {
    placeholder?: string;
    clearLabel?: string;
    saveLabel?: string;
    className?: string;
}

export default function SignaturePad({
    placeholder = "Pruébalo aquí",
    clearLabel = "Borrar",
    saveLabel = "Guardar",
    className,
}: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawingRef = useRef(false);
    const [hasSignature, setHasSignature] = useState(false);

    const getContext = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        return { canvas, ctx };
    }, []);

    const resizeCanvas = useCallback(() => {
        const { canvas, ctx } = getContext() || {};
        if (!canvas || !ctx) return;

        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
    }, [getContext]);

    useEffect(() => {
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
    }, [resizeCanvas]);

    const getCoords = useCallback((e: TouchEvent | MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        if ("touches" in e) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top,
            };
        }
        return { x: (e as MouseEvent).clientX - rect.left, y: (e as MouseEvent).clientY - rect.top };
    }, []);

    const startDrawing = useCallback(
        (e: TouchEvent | MouseEvent) => {
            e.preventDefault();
            const coords = getCoords(e);
            if (!coords) return;
            const { ctx } = getContext() || {};
            if (!ctx) return;
            ctx.beginPath();
            ctx.moveTo(coords.x, coords.y);
            isDrawingRef.current = true;
            setHasSignature(true);
        },
        [getCoords, getContext]
    );

    const draw = useCallback(
        (e: TouchEvent | MouseEvent) => {
            if (!isDrawingRef.current) return;
            e.preventDefault();
            const coords = getCoords(e);
            if (!coords) return;
            const { ctx } = getContext() || {};
            if (!ctx) return;
            ctx.lineTo(coords.x, coords.y);
            ctx.stroke();
        },
        [getCoords, getContext]
    );

    const stopDrawing = useCallback(() => {
        isDrawingRef.current = false;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const opts = { passive: false } as AddEventListenerOptions;
        canvas.addEventListener("touchstart", startDrawing, opts);
        canvas.addEventListener("touchmove", draw, opts);
        canvas.addEventListener("touchend", stopDrawing, opts);
        canvas.addEventListener("touchcancel", stopDrawing, opts);
        return () => {
            canvas.removeEventListener("touchstart", startDrawing);
            canvas.removeEventListener("touchmove", draw);
            canvas.removeEventListener("touchend", stopDrawing);
            canvas.removeEventListener("touchcancel", stopDrawing);
        };
    }, [startDrawing, draw, stopDrawing]);

    const clear = () => {
        const { canvas, ctx } = getContext() || {};
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        setHasSignature(false);
    };

    const save = () => {
        const canvas = canvasRef.current;
        if (!canvas || !hasSignature) return;
        const link = document.createElement("a");
        link.download = "firma.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    return (
        <div className={cn("flex flex-col gap-3 w-full", className)}>
            <div className="relative bg-background rounded-sm overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="w-full h-56 min-h-[200px] touch-none cursor-crosshair"
                    style={{ touchAction: "none" }}
                    onMouseDown={(e) => startDrawing(e.nativeEvent)}
                    onMouseMove={(e) => draw(e.nativeEvent)}
                    onMouseUp={(e) => stopDrawing()}
                    onMouseLeave={(e) => stopDrawing()}
                />
                {!hasSignature && (
                    <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none text-muted-foreground/60 text-sm"
                        aria-hidden
                    >
                        {placeholder}
                    </div>
                )}
            </div>
            <div className="flex gap-2 justify-center">
                <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={clear}
                    aria-label={clearLabel}
                >
                    <Eraser size={18} />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    onClick={save}
                    disabled={!hasSignature}
                    aria-label={saveLabel}
                >
                    <Save size={18} />
                </Button>
            </div>
        </div>
    );
}
