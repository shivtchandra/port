"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Camera, Upload, RotateCcw, Download, ArrowUpRight, Check } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

// ── Fill in your store URLs when ready ───────────────────────────
const IOS_URL = "";
const ANDROID_URL = "https://play.google.com/store/apps/details?id=com.goldenhour.filmcamapp&pcampaignid=web_share";
// ─────────────────────────────────────────────────────────────────

const FILM_STOCKS = [
  {
    id: "golden-hour",
    name: "Golden Hour",
    desc: "Warm & golden",
    filter: "sepia(0.28) hue-rotate(-18deg) brightness(1.1) contrast(1.06) saturate(1.5)",
  },
  {
    id: "kodak",
    name: "Kodak 400",
    desc: "Classic film",
    filter: "sepia(0.08) brightness(1.04) contrast(1.15) saturate(1.12)",
  },
  {
    id: "noir",
    name: "Noir",
    desc: "Timeless B&W",
    filter: "grayscale(1) contrast(1.18) brightness(0.9)",
  },
  {
    id: "velvia",
    name: "Velvia",
    desc: "Vivid & punchy",
    filter: "saturate(1.65) contrast(1.2) brightness(0.97) hue-rotate(-5deg)",
  },
] as const;

type StockId = (typeof FILM_STOCKS)[number]["id"];
type CamStatus = "idle" | "requesting" | "active" | "error";
type Frame = "none" | "polaroid";

export function PhotoBooth() {
  const [mode, setMode] = useState<"camera" | "upload">("upload");
  const [camStatus, setCamStatus] = useState<CamStatus>("idle");
  const [rawSrc, setRawSrc] = useState<string | null>("/photos/travel-01.jpg");
  const [error, setError] = useState("");
  const [imageReady, setImageReady] = useState(false);
  const [printKey, setPrintKey] = useState(0);
  const mounted = useRef(true);
  const cameraRequest = useRef(0);
  const uploadRequest = useRef(0);
  const [activeStock, setActiveStock] = useState<StockId>("golden-hour");
  const [activeFrame, setActiveFrame] = useState<Frame>("polaroid");
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const activeFilter = FILM_STOCKS.find((s) => s.id === activeStock)!.filter;
  const hasPhoto = Boolean(rawSrc);
  const isCameraActive = camStatus === "active";
  const isPolaroid = activeFrame === "polaroid";

  const stopCamera = useCallback(() => {
    cameraRequest.current += 1;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => { mounted.current = true; return () => { mounted.current = false; uploadRequest.current += 1; stopCamera(); }; }, [stopCamera]);
  useEffect(() => () => { if (rawSrc?.startsWith("blob:")) URL.revokeObjectURL(rawSrc); }, [rawSrc]);
  useEffect(() => {
    if (!rawSrc) return;
    let current = true;
    const image = new Image();
    image.onload = () => { if (current) setImageReady(true); };
    image.onerror = () => { if (current) { setImageReady(false); setError("The preview could not load. Choose another image or use the sample."); } };
    image.src = rawSrc;
    return () => { current = false; };
  }, [rawSrc]);

  const startCamera = useCallback(async () => {
    const request = ++cameraRequest.current;
    setError("");
    setCamStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      if (!mounted.current || request !== cameraRequest.current) { stream.getTracks().forEach(track => track.stop()); return; }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      if (mounted.current && request === cameraRequest.current) setCamStatus("active");
    } catch {
      if (!mounted.current || request !== cameraRequest.current) return;
      stopCamera();
      setCamStatus("error");
      setMode("upload");
      setRawSrc("/photos/travel-01.jpg");
      setError("Camera unavailable. You can keep using the sample, upload a photo, or try Camera again.");
    }
  }, [stopCamera]);

  function switchToCamera() {
    stopCamera();
    setCamStatus("idle");
    setRawSrc(null);
    setDownloaded(false);
    setMode("camera");
    setError("");
    setImageReady(false);
  }

  function switchToUpload() {
    stopCamera();
    setCamStatus("idle");
    setRawSrc("/photos/travel-01.jpg");
    setDownloaded(false);
    setMode("upload");
    setError("");
    fileRef.current?.click();
  }

  function snapPhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;

    // Un-mirror: flip horizontally for natural orientation on save
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    ctx.restore();

    setRawSrc(canvas.toDataURL("image/jpeg", 0.92));
    setDownloaded(false);
    stopCamera();
    setCamStatus("idle");
  }

  function retake() {
    setRawSrc(null);
    setDownloaded(false);
    if (mode === "camera") startCamera();
  }

  function handleFile(file: File) {
    if (!file.type.startsWith("image/") || file.size > 20 * 1024 * 1024) {
      setError("Choose an image under 20 MB. The sample is still available."); return;
    }
    stopCamera();
    const request = ++uploadRequest.current;
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      if (!mounted.current || request !== uploadRequest.current) { URL.revokeObjectURL(url); return; }
      setRawSrc(url); setMode("upload"); setCamStatus("idle"); setImageReady(true); setDownloaded(false); setPrintKey(0); setError("");
    };
    image.onerror = () => { URL.revokeObjectURL(url); if (mounted.current && request === uploadRequest.current) { setError("This image could not be opened. Try another image or use the sample."); setRawSrc("/photos/travel-01.jpg"); } };
    image.src = url;
  }

  function useSample() {
    stopCamera(); uploadRequest.current += 1; setMode("upload"); setCamStatus("idle"); setRawSrc("/photos/travel-01.jpg"); setDownloaded(false); setPrintKey(0); setError("");
  }

  function buildCanvas(img: HTMLImageElement): HTMLCanvasElement {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d")!;

    if (isPolaroid) {
      // Classic Polaroid: equal thin border on 3 sides, thick white bottom
      const border = Math.round(img.naturalWidth * 0.055);
      const bottom = Math.round(img.naturalWidth * 0.24);
      c.width = img.naturalWidth + border * 2;
      c.height = img.naturalHeight + border + bottom;

      ctx.fillStyle = "#FEFDF8"; // slightly warm white
      ctx.fillRect(0, 0, c.width, c.height);

      ctx.filter = activeFilter;
      ctx.drawImage(img, border, border, img.naturalWidth, img.naturalHeight);
      ctx.filter = "none";

      // Subtle "Golden Hour" text in the polaroid bottom space
      const fs = Math.max(11, Math.round(border * 0.75));
      ctx.font = `${fs}px sans-serif`;
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText("Golden Hour", c.width - border, c.height - Math.round(border * 0.55));
    } else {
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      ctx.filter = activeFilter;
      ctx.drawImage(img, 0, 0);
      ctx.filter = "none";

      // Subtle white watermark over the image
      const fs = Math.max(12, Math.round(c.width * 0.022));
      ctx.font = `${fs}px sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText("Golden Hour", c.width - fs, c.height - fs);
    }

    return c;
  }

  async function downloadPhoto() {
    if (!rawSrc || downloading || !imageReady) return;
    setError("");
    setDownloading(true);

    const img = new Image();

    img.onload = () => {
      try {
        const c = buildCanvas(img);
        c.toBlob(
          (blob) => {
            if (!blob) { setDownloading(false); setError("The image could not be exported. Please try Download again."); return; }
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `golden-hour-${isPolaroid ? "polaroid-" : ""}${activeStock}.jpg`;
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 1500);
            setDownloading(false);
            setDownloaded(true);
          },
          "image/jpeg",
          0.93
        );
      } catch {
        setDownloading(false);
        setError("The image could not be exported. Try again or use the sample.");
      }
    };

    img.onerror = () => { setDownloading(false); setError("The image could not be loaded for export. Use the sample or upload another image."); };
    img.src = rawSrc;
  }

  return (
    <div className="mb-20 md:mb-28 pb-16 md:pb-24 border-b border-white/10">
      <FadeIn>
        <p className="text-[11px] tracking-[0.3em] uppercase text-text-muted mb-3">
          Golden Hour / A web preview
        </p>
        <h2
          className="font-display font-extrabold text-text leading-[0.9]"
          style={{ fontSize: "clamp(28px, 4.5vw, 56px)", letterSpacing: "-0.03em" }}
        >
          Make a little memory.
        </h2>
        <p className="text-text-muted text-sm md:text-base mt-3 max-w-sm leading-relaxed">
          Try a film look on the sample, or bring your own photo. Develop a print. Take it with you. This browser preview uses CSS filters, separate from the Android app’s color-grading pipeline.
        </p>
      </FadeIn>

      <FadeIn delay={0.12}>
        <div className="mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 lg:gap-14 items-start">

          {/* ── Left: Frame ──────────────────────────────── */}
          <div>
            {/* Mode toggle — only when no photo */}
            {(
              <div className="booth-mode-toggle" role="group" aria-label="Photo source">
                <button
                  type="button"
                  onClick={switchToCamera}
                  aria-pressed={mode === "camera"}
                >
                  <Camera size={12} />
                  Camera
                </button>
                <button
                  type="button"
                  onClick={switchToUpload}
                  aria-pressed={mode === "upload"}
                >
                  <Upload size={12} />
                  Upload
                </button>
              </div>
            )}

            {/* Portrait frame — adapts to polaroid vs standard */}
            <div
              className={`relative w-full max-w-[300px] overflow-hidden border border-white/10 transition-colors duration-300 ${
                hasPhoto && isPolaroid
                  ? "bg-[#FEFDF8]"
                  : "bg-surface aspect-[4/5]"
              }`}
              style={
                hasPhoto && isPolaroid
                  ? { padding: "14px 14px 62px" }
                  : undefined
              }
            >
              <canvas ref={canvasRef} className="hidden" />

              {/* Live webcam */}
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  display: isCameraActive && !hasPhoto ? "block" : "none",
                  filter: activeFilter,
                  transform: "scaleX(-1)",
                }}
                muted
                playsInline
              />

              {/* Camera idle / requesting / error */}
              {mode === "camera" && !hasPhoto && !isCameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  {camStatus === "requesting" ? (
                    <>
                      <div className="w-8 h-8 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
                      <p className="text-text-muted text-[11px] tracking-wide">Requesting camera…</p>
                    </>
                  ) : camStatus === "error" ? (
                    <p className="text-text-muted text-xs text-center px-6 leading-relaxed">
                      Camera unavailable — switch to Upload
                    </p>
                  ) : (
                    <button onClick={startCamera} className="flex flex-col items-center gap-3 group">
                      <span className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/50 transition-colors">
                        <Camera size={22} className="text-text-muted group-hover:text-text transition-colors" />
                      </span>
                      <span className="text-[10px] tracking-[0.2em] uppercase text-text-muted group-hover:text-text transition-colors">
                        Open camera
                      </span>
                    </button>
                  )}
                </div>
              )}

              {/* Upload drop zone */}
              {mode === "upload" && !hasPhoto && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer group"
                  onClick={() => fileRef.current?.click()}
                  role="button" tabIndex={0} aria-label="Choose a photo to upload"
                  onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); fileRef.current?.click(); } }}
                  onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <Upload size={22} className="text-text-muted group-hover:text-text transition-colors" />
                  <div className="text-center">
                    <p className="text-text-muted text-xs">Drop a photo here</p>
                    <p className="text-text-muted/50 text-[10px] mt-0.5">or click to browse</p>
                  </div>
                </div>
              )}

              {/* Photo preview — fills container (no-frame) or sits inside polaroid padding */}
              {hasPhoto && (
                <div key={printKey} className={printKey ? "photo-print" : ""} style={isPolaroid ? { position: "relative" } : { position: "absolute", inset: 0 }}>
                  <img src={rawSrc!} alt={rawSrc?.startsWith("/photos/") ? "Sample travel photograph with selected film look" : "Your photograph with selected film look"}
                    className={isPolaroid ? "w-full h-auto block" : "absolute inset-0 w-full h-full object-cover"}
                    style={{ filter: activeFilter }} onLoad={() => setImageReady(true)} onError={() => { setImageReady(false); setError("Preview unavailable. Try another image or return to the sample."); if (rawSrc !== "/photos/hero.jpg") setRawSrc("/photos/hero.jpg"); }} />
                  {printKey > 0 && <span className="print-overlay" aria-hidden />}
                </div>
              )}

              {/* Shutter button */}
              {isCameraActive && !hasPhoto && (
                <button
                  onClick={snapPhoto}
                  aria-label="Take photo"
                  className="absolute bottom-5 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-[3px] border-white/80 bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
                />
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
            />
          </div>

          {/* ── Right: Controls ──────────────────────────────── */}
          <div className="flex flex-col gap-6 lg:pt-9">

            {/* Film stock */}
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-text-muted mb-3">
                Film Stock
              </p>
              <div className="grid grid-cols-2 gap-2">
                {FILM_STOCKS.map((stock) => (
                  <button
                    key={stock.id}
                    aria-pressed={activeStock === stock.id}
                    onClick={() => { setActiveStock(stock.id); setDownloaded(false); setPrintKey(0); }}
                    className={`text-left px-4 py-3 border transition-colors ${
                      activeStock === stock.id
                        ? "border-white/50 bg-white/[0.04]"
                        : "border-white/[0.10] hover:border-white/25"
                    }`}
                  >
                    <span className="block text-sm text-text leading-snug">{stock.name}</span>
                    <span className="block text-[11px] text-text-muted mt-0.5">{stock.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Frame */}
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-text-muted mb-3">
                Frame
              </p>
              <div className="flex items-center gap-2">
                {(["none", "polaroid"] as Frame[]).map((f) => (
                  <button
                    key={f}
                    aria-pressed={activeFrame === f}
                    onClick={() => { setActiveFrame(f); setDownloaded(false); setPrintKey(0); }}
                    className={`px-4 py-2.5 border text-sm transition-colors capitalize ${
                      activeFrame === f
                        ? "border-white/50 bg-white/[0.04] text-text"
                        : "border-white/[0.10] text-text-muted hover:border-white/25 hover:text-text"
                    }`}
                  >
                    {f === "polaroid" ? "Polaroid" : "None"}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="booth-error" role="alert">{error}</p>}
            <div className="sample-actions"><button onClick={useSample}>Use sample</button><button onClick={() => { if (imageReady) setPrintKey(key => key + 1); }} disabled={!hasPhoto || !imageReady}>Develop print ↗</button></div>
            <p className="sr-only" role="status">{downloaded ? "Download started." : printKey > 0 ? "Your print is ready." : ""}</p>
            {/* Actions */}
            <div className="flex flex-wrap gap-3 min-h-[44px] items-center">
              {hasPhoto ? (
                <>
                  <button
                    onClick={downloadPhoto}
                    disabled={downloading || !imageReady}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-bg font-semibold text-sm tracking-wide hover:bg-accent/90 transition-colors disabled:opacity-60"
                  >
                    {downloaded ? <Check size={14} /> : <Download size={14} />}
                    {downloading ? "Preparing…" : downloaded ? "Download again" : "Download"}
                  </button>
                  <button
                    onClick={retake}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-text-muted text-sm hover:border-white/40 hover:text-text transition-colors"
                  >
                    <RotateCcw size={14} />
                    {mode === "camera" ? "Retake" : "New photo"}
                  </button>
                </>
              ) : isCameraActive ? (
                <p className="text-text-muted text-[11px] tracking-wide">
                  Hit the shutter to capture.
                </p>
              ) : null}
            </div>

            {/* App promo */}
            <div className="border-t border-white/10 pt-6 mt-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-surface">
                  <img src="/apps/golden-hour/01.png" alt="Golden Hour app" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-text text-sm font-medium leading-tight">Golden Hour</p>
                  <p className="text-text-muted text-[11px] mt-0.5">30 film stocks · Real-time · Android</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                {IOS_URL && (
                  <a href={IOS_URL} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] tracking-[0.2em] uppercase text-text hover:text-text-muted transition-colors">
                    App Store <ArrowUpRight size={11} />
                  </a>
                )}
                {ANDROID_URL && (
                  <a href={ANDROID_URL} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] tracking-[0.2em] uppercase text-text hover:text-text-muted transition-colors">
                    Play Store <ArrowUpRight size={11} />
                  </a>
                )}
                {!IOS_URL && !ANDROID_URL && (
                  <p className="text-text-muted text-[11px]">Coming to stores soon.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
