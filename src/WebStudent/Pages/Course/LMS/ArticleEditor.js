import React, { useMemo, useRef, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import ImageResize from "quill-image-resize-module-react";
import Cropper from "react-easy-crop";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import "./article-editor.css";

// ---------- Quill modules/attributors ----------
Quill.register("modules/imageResize", ImageResize);
const AlignClass = Quill.import("attributors/class/align");
Quill.register(AlignClass, true);
const SizeStyle = Quill.import("attributors/style/size");
SizeStyle.whitelist = ["10px","12px","14px","16px","18px","20px","22px","24px","28px","32px","40px","48px"];
Quill.register(SizeStyle, true);
const FontClass = Quill.import("attributors/class/font");
FontClass.whitelist = ["sans","serif","monospace"];
Quill.register(FontClass, true);
const ColorStyle = Quill.import("attributors/style/color");
const BackgroundStyle = Quill.import("attributors/style/background");
Quill.register(ColorStyle, true);
Quill.register(BackgroundStyle, true);

// ------------ helpers for react-easy-crop ------------
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });

// const navigate = useNavigate();
const getRadianAngle = (deg) => (deg * Math.PI) / 180;

const getRotatedSize = (width, height, rotation) => {
  const rotRad = getRadianAngle(rotation);
  const sin = Math.abs(Math.sin(rotRad));
  const cos = Math.abs(Math.cos(rotRad));
  return {
    width: Math.floor(width * cos + height * sin),
    height: Math.floor(width * sin + height * cos),
  };
};

async function getCroppedDataUrl(imageSrc, cropPixels, rotation = 0, flip = { horizontal: false, vertical: false }) {
  const image = await createImage(imageSrc);
  const rotSize = getRotatedSize(image.width, image.height, rotation);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = rotSize.width;
  canvas.height = rotSize.height;

  ctx.translate(rotSize.width / 2, rotSize.height / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  const out = document.createElement("canvas");
  out.width = cropPixels.width;
  out.height = cropPixels.height;
  const octx = out.getContext("2d");
  octx.drawImage(canvas, cropPixels.x, cropPixels.y, cropPixels.width, cropPixels.height, 0, 0, cropPixels.width, cropPixels.height);
  return out.toDataURL("image/png");
}
// -----------------------------------------------------

const ArticleEditor = ({
  value,
  onChangeHtml,
  onChangeFileUrl,
  className,
  style,
}) => {
  const quillRef = useRef(null);
  const imagePickerRef = useRef(null);
  const replacePickerRef = useRef(null);  // <-- NEW: hidden input for replace

  // NEW: programmatic navigation (added)
  const navigate = useNavigate();
  useEffect(() => {
    const handler = (e) => {
      try {
        const d = e?.detail || {};
        // Accept multiple payload shapes
        const courseId = d.courseId || d.course_id || d.course?.id || d.course?._id;
        const sectionId = d.sectionId || d.section_id || d.section?.id || d.section?._id;

        // Allow a direct path too
        const path = d.path || (courseId && sectionId ? `/course/${courseId}/section/${sectionId}` : null);

        if (!path) {
          console.warn("[ArticleEditor] article:created received but missing IDs/path. Detail:", d);
          return;
        }

        // Defer a tick to avoid StrictMode timing issues
        setTimeout(() => navigate(path, { replace: true }), 0);
      } catch (err) {
        console.error("[ArticleEditor] Redirect error:", err);
      }
    };

    // Listen on both window and document so either dispatch works
    window.addEventListener("article:created", handler);
    document.addEventListener("article:created", handler);

    // Optional helper (doesn't change existing logic)
    window.__articleNavigate = (courseId, sectionId) =>
      navigate(`/course/${courseId}/section/${sectionId}`, { replace: true });

    return () => {
      window.removeEventListener("article:created", handler);
      document.removeEventListener("article:created", handler);
      delete window.__articleNavigate;
    };
  }, [navigate]);

  // selection tracking
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // react-easy-crop modal state
  const [imgEditorOpen, setImgEditorOpen] = useState(false);
  const imgEditorBackdropRef = useRef(null);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // simple writing helpers
  const [wordCount, setWordCount] = useState(0);

  const htmlToDataUrl = (html) =>
    `data:text/html;base64,${btoa(unescape(encodeURIComponent(html)))}`;

  const syncFromEditor = () => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;
    const html = editor.root.innerHTML;
    onChangeHtml(html);
    onChangeFileUrl(htmlToDataUrl(html));
    const text = editor.getText() || "";
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
  };

  // helper to (re)bind your listeners safely
  const rebindEditorListeners = React.useCallback(() => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;

    // ensure enabled
    try { editor.enable(true); } catch {}

    // reattach our listeners idempotently
    const isImageLeaf = (leaf) => leaf && leaf.statics && leaf.statics.blotName === "image";

    const onSelChange = (range) => {
      if (!range) return;
      let idx = range.index;
      let leaf = editor.getLeaf(idx)?.[0];
      if (!isImageLeaf(leaf) && idx > 0) {
        const prev = editor.getLeaf(idx - 1)?.[0];
        if (isImageLeaf(prev)) {
          leaf = prev;
          idx = idx - 1;
        }
      }
      if (isImageLeaf(leaf)) setSelectedImageIndex(idx);
    };

    const onClick = (e) => {
      const img = e.target?.closest?.("img");
      if (!img) return;
      try {
        const blot = Quill.find(img);
        const idx = editor.getIndex(blot);
        editor.setSelection(idx, 1, "user");
        setSelectedImageIndex(idx);
      } catch {}
    };

    // remove any previous duplicates, then add
    try { editor.off("selection-change", onSelChange); } catch {}
    editor.on("selection-change", onSelChange);

    editor.root.removeEventListener("click", onClick);
    editor.root.addEventListener("click", onClick);
  }, []);

  useEffect(() => {
    rebindEditorListeners();
  }, [rebindEditorListeners]);

  useEffect(() => {
    const onPageShow = () => rebindEditorListeners();
    const onVisibility = () => {
      if (document.visibilityState === "visible") rebindEditorListeners();
    };
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [rebindEditorListeners]);

  const insertImageDataUrl = (dataUrl) => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;
    const range = editor.getSelection(true) || { index: editor.getLength(), length: 0 };
    editor.insertEmbed(range.index, "image", dataUrl, "user");
    editor.setSelection(range.index + 1, 0, "user");
    syncFromEditor();
  };

  const handleEditorImagePick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const toDataURL = (f) =>
      new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = reject;
        r.readAsDataURL(f);
      });
    try {
      const dataUrl = await toDataURL(file);
      insertImageDataUrl(dataUrl);
    } catch (err) {
      console.error("Image read error:", err);
      alert("Failed to read image file.");
    } finally {
      e.target.value = "";
    }
  };

  // ---------- image replace (NEW) ----------
  const handleReplaceImagePick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;

    // find the exact index of the image embed (not just the caret index)
    const getExactImageIndex = () => {
      // prefer stored index; else current selection
      let baseIdx = selectedImageIndex ?? editor.getSelection(true)?.index ?? null;
      if (baseIdx == null) return null;

      const isImg = (leaf) => leaf && leaf.statics && leaf.statics.blotName === "image";

      // leaf at baseIdx
      let leaf = editor.getLeaf(baseIdx)?.[0];
      if (isImg(leaf)) return baseIdx;

      // leaf just before baseIdx
      if (baseIdx > 0) {
        leaf = editor.getLeaf(baseIdx - 1)?.[0];
        if (isImg(leaf)) return baseIdx - 1;
      }
      return null;
    };

    const imgIdx = getExactImageIndex();
    if (imgIdx == null) return alert("Click an image first.");

    // read file -> data URL
    const toDataURL = (f) =>
      new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = reject;
        r.readAsDataURL(f);
      });

    try {
      const dataUrl = await toDataURL(file);

      // preserve existing formats (align, etc.)
      const prevFormats = editor.getFormat(imgIdx, 1);
      const [line, offsetInLine] = editor.getLine(imgIdx);

      // IMPORTANT: delete exactly the image embed, then insert at the SAME index
      editor.deleteText(imgIdx, 1, "user");
      editor.insertEmbed(imgIdx, "image", dataUrl, "user");

      if (prevFormats?.align) {
        editor.formatText(imgIdx, 1, "align", prevFormats.align, "user");
      }
      if (line) {
        const lineStart = imgIdx - offsetInLine;
        const lineLength = line.length();
        editor.formatLine(lineStart, lineLength, { align: prevFormats?.align || false }, "user");
      }

      editor.setSelection(imgIdx + 1, 0, "user");
      syncFromEditor();
    } catch (err) {
      console.error("Image replace error:", err);
      alert("Failed to replace image.");
    }
  };

  // ---------- image delete (NEW) ----------
  const deleteSelectedImage = () => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;

    let idx = selectedImageIndex ?? getImageAtSelection()?.index ?? null;
    if (idx == null) return alert("Click an image first.");

    editor.deleteText(idx, 1, "user");
    setSelectedImageIndex(null);
    syncFromEditor();
  };

  // image detection at selection
  const getImageAtSelection = () => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return null;
    const sel = editor.getSelection(true);
    if (!sel) return null;

    const isImageLeaf = (leaf) => leaf && leaf.statics && leaf.statics.blotName === "image";

    let idx = sel.index;
    let leaf = editor.getLeaf(idx)?.[0];
    if (!isImageLeaf(leaf) && idx > 0) {
      const prev = editor.getLeaf(idx - 1)?.[0];
      if (isImageLeaf(prev)) {
        leaf = prev;
        idx = idx - 1;
      }
    }
    return leaf ? { index: idx, leaf } : null;
  };

  // selection tracking
  useEffect(() => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;

    const isImageLeaf = (leaf) => leaf && leaf.statics && leaf.statics.blotName === "image";

    const onSelChange = (range) => {
      if (!range) return;
      let idx = range.index;
      let leaf = editor.getLeaf(idx)?.[0];
      if (!isImageLeaf(leaf) && idx > 0) {
        const prev = editor.getLeaf(idx - 1)?.[0];
        if (isImageLeaf(prev)) {
          leaf = prev;
          idx = idx - 1;
        }
      }
      if (isImageLeaf(leaf)) setSelectedImageIndex(idx);
    };

    const onClick = (e) => {
      const img = e.target?.closest?.("img");
      if (!img) return;
      try {
        const blot = Quill.find(img);
        const idx = editor.getIndex(blot);
        editor.setSelection(idx, 1, "user");
        setSelectedImageIndex(idx);
      } catch {}
    };

    editor.on("selection-change", onSelChange);
    editor.root.addEventListener("click", onClick);
    return () => {
      editor.off("selection-change", onSelChange);
      editor.root.removeEventListener("click", onClick);
    };
  }, []);

  // --------- robust alignment that works for images ----------
  const alignSelectedImage = (align) => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;

    let idx = selectedImageIndex ?? getImageAtSelection()?.index ?? null;
    if (idx == null) return alert("Click an image first.");

    editor.formatText(idx, 1, "align", align === "left" ? false : align, "user");

    const [line, offsetInLine] = editor.getLine(idx);
    if (line) {
      const lineStart = idx - offsetInLine;
      const lineLength = line.length();
      editor.formatLine(lineStart, lineLength, { align: align === "left" ? false : align }, "user");
    }

    setTimeout(syncFromEditor, 0);
  };

  // caption (unchanged)
  const addCaptionBelowImage = () => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;

    let idx = selectedImageIndex ?? getImageAtSelection()?.index ?? null;
    if (idx == null) return alert("Click an image first.");

    const insertIndex = idx + 1;
    editor.insertText(insertIndex, "\n", "user");
    editor.clipboard.dangerouslyPasteHTML(
      insertIndex + 1,
      `<p class="ql-image-caption" style="text-align:center;color:#64748b;font-size:12px;font-style:italic;margin-top:4px;">Enter caption here…</p>`,
      "user"
    );
    editor.setSelection(insertIndex + 2, 0, "user");
    syncFromEditor();
  };

  // --- modal open/close (react-easy-crop)
  const openImageEditor = () => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;

    let idx = selectedImageIndex ?? getImageAtSelection()?.index ?? null;
    if (idx == null) return alert("Click an image first.");

    const [leaf] = editor.getLeaf(idx);
    const node = leaf?.domNode; // <img>
    const src = node?.getAttribute("src");
    if (!src) return;

    setCropImageSrc(src);
    setZoom(1);
    setRotation(0);
    setFlip({ horizontal: false, vertical: false });
    setCrop({ x: 0, y: 0 });
    setCroppedAreaPixels(null);
    setImgEditorOpen(true);
  };

  const closeImageEditor = () => setImgEditorOpen(false);

  const applyImageEdits = async () => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor || !cropImageSrc) return;

    try {
      let area = croppedAreaPixels;
      if (!area) {
        const img = await createImage(cropImageSrc);
        area = { x: 0, y: 0, width: img.width, height: img.height };
      }
      const dataUrl = await getCroppedDataUrl(
        cropImageSrc,
        area,
        rotation,
        { horizontal: flip.horizontal, vertical: flip.vertical }
      );

      let idx = selectedImageIndex ?? getImageAtSelection()?.index ?? null;
      if (idx == null) return;

      editor.deleteText(idx, 1, "user");
      editor.insertEmbed(idx, "image", dataUrl, "user");
      editor.setSelection(idx + 1, 0, "user");
      syncFromEditor();
      closeImageEditor();
    } catch (e) {
      console.error(e);
      alert("Failed to apply edits.");
    }
  };

  // buttons
  const rotateBtn = (deg) => setRotation((r) => (r + deg + 360) % 360);
  const flipH = () => setFlip((f) => ({ ...f, horizontal: !f.horizontal }));
  const flipV = () => setFlip((f) => ({ ...f, vertical: !f.vertical }));
  const resetCrop = () => {
    setZoom(1);
    setRotation(0);
    setFlip({ horizontal: false, vertical: false });
    setCrop({ x: 0, y: 0 });
  };

  // key handlers inside modal
  useEffect(() => {
    if (!imgEditorOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeImageEditor();
      if (e.key === "Enter") applyImageEdits();
      if (e.key === "ArrowLeft") rotateBtn(-1);
      if (e.key === "ArrowRight") rotateBtn(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [imgEditorOpen]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ font: FontClass.whitelist }],
          [{ size: SizeStyle.whitelist }],
          ["bold", "italic", "underline", "strike"],
          [{ script: "super" }, { script: "sub" }],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image"],
          [{ direction: "rtl" }],
          ["clean"],
        ],
        handlers: { image: () => imagePickerRef.current?.click() },
      },
      history: { delay: 1000, maxStack: 500, userOnly: true },
      imageResize: { modules: ["Resize", "DisplaySize"] },
      clipboard: { matchVisual: false },
    }),
    []
  );

  // live preview flip (wrapper transform)
  const cropperWrapperStyle = useMemo(() => {
    const sx = flip.horizontal ? -1 : 1;
    const sy = flip.vertical ? -1 : 1;
    if (sx === 1 && sy === 1) return undefined;
    return { transform: `scale(${sx}, ${sy})`, transformOrigin: "center center" };
  }, [flip]);

  return (
    <div className={className} style={style}>
      {/* Hidden inputs */}
      <input
        ref={imagePickerRef}
        type="file"
        accept="image/*"
        className="visually-hidden"
        onChange={handleEditorImagePick}
      />
      <input
        ref={replacePickerRef}
        type="file"
        accept="image/*"
        className="visually-hidden"
        onChange={handleReplaceImagePick}
      />

      {/* Toolbar actions */}
      <div className="mb-2 d-flex flex-wrap gap-2 align-items-center">
        <div className="small text-muted">
          Words: {wordCount} • ~{Math.max(1, Math.round(wordCount / 200))} min read
        </div>

        <span className="ms-auto" />

        <button type="button" className="btn btn-outline-dark btn-sm" onMouseDown={(e)=>e.preventDefault()} onClick={() => alignSelectedImage("left")}>
          Image Left
        </button>
        <button type="button" className="btn btn-outline-dark btn-sm" onMouseDown={(e)=>e.preventDefault()} onClick={() => alignSelectedImage("center")}>
          Image Center
        </button>
        <button type="button" className="btn btn-outline-dark btn-sm" onMouseDown={(e)=>e.preventDefault()} onClick={() => alignSelectedImage("right")}>
          Image Right
        </button>

        <button type="button" className="btn btn-outline-secondary btn-sm" onMouseDown={(e)=>e.preventDefault()} onClick={addCaptionBelowImage}>
          Add Image Caption
        </button>

        <button type="button" className="btn btn-primary btn-sm" onMouseDown={(e)=>e.preventDefault()} onClick={openImageEditor}>
          Edit Image (Crop/Rotate)
        </button>

        {/* NEW: Replace & Delete */}
        <button
          type="button"
          className="btn btn-outline-warning btn-sm"
          onMouseDown={(e)=>e.preventDefault()}
          onClick={() => {
            const idx = selectedImageIndex ?? getImageAtSelection()?.index ?? null;
            if (idx == null) return alert("Click an image first.");
            replacePickerRef.current?.click();
          }}
        >
          Replace Image
        </button>

        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onMouseDown={(e)=>e.preventDefault()}
          onClick={deleteSelectedImage}
        >
          Delete Image
        </button>
      </div>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value ?? ""}   // <<< ensure string
        onChange={(val) => {
          onChangeHtml(val);
          onChangeFileUrl(htmlToDataUrl(val || "<p></p>"));
          const tmpDiv = document.createElement("div");
          tmpDiv.innerHTML = val || "";
          const text = tmpDiv.textContent || tmpDiv.innerText || "";
          setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
        }}
        style={{ background: "#fff", borderRadius: 8 }}
        modules={modules}
        placeholder="Start writing…"
      />

      <small className="text-muted d-block mt-1">
        Tip: Click an image to align/caption/edit. Rich formatting (font, size, color, lists, etc.) is available in the toolbar.
      </small>

      {/* Image Editor Modal */}
      {imgEditorOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,.55)", zIndex: 1055 }}
          ref={imgEditorBackdropRef}
          onMouseDown={(e) => {
            if (e.target === imgEditorBackdropRef.current) closeImageEditor();
          }}
        >
          <div className="bg-white rounded shadow-lg d-flex flex-column overflow-hidden"
               style={{ width: "min(960px, 92vw)", maxHeight: "86vh" }}
               onMouseDown={(e)=>e.stopPropagation()}>
            <div className="d-flex align-items-center gap-2 border-bottom px-3 py-2">
              <strong>Edit Image</strong>
              <div className="ms-auto d-flex gap-2">
                <button className="btn btn-light btn-sm" onMouseDown={(e)=>e.preventDefault()} onClick={() => rotateBtn(90)}>Rotate 90°</button>
                <button className="btn btn-light btn-sm" onMouseDown={(e)=>e.preventDefault()} onClick={() => rotateBtn(-90)}>Rotate -90°</button>

                <button
                  className={`btn btn-sm ${flip.horizontal ? "btn-primary active" : "btn-light"}`}
                  onMouseDown={(e)=>e.preventDefault()}
                  onClick={flipH}
                >
                  Flip H
                </button>
                <button
                  className={`btn btn-sm ${flip.vertical ? "btn-primary active" : "btn-light"}`}
                  onMouseDown={(e)=>e.preventDefault()}
                  onClick={flipV}
                >
                  Flip V
                </button>

                <button className="btn btn-light btn-sm" onMouseDown={(e)=>e.preventDefault()} onClick={resetCrop}>Reset</button>
              </div>
            </div>

            <div className="px-3 py-2 d-flex flex-column gap-2">
              <div className="position-relative w-100 rounded overflow-hidden bg-dark" style={{ height: "60vh" }}>
                {/* live flip preview via wrapper transform */}
                <div className="w-100 h-100" style={cropperWrapperStyle}>
                  <Cropper
                    image={cropImageSrc}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                    onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
                    onMediaLoaded={({ naturalWidth, naturalHeight }) => {
                      setCroppedAreaPixels({ x: 0, y: 0, width: naturalWidth, height: naturalHeight });
                    }}
                    showGrid={true}
                  />
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <label className="form-label m-0">Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="form-range flex-grow-1"
                />
                <label className="form-label m-0 ms-3">Rotation</label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  step={1}
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="form-range flex-grow-1"
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 border-top px-3 py-2">
              <button className="btn btn-light btn-sm" onMouseDown={(e)=>e.preventDefault()} onClick={closeImageEditor}>Cancel (Esc)</button>
              <button className="btn btn-primary btn-sm" onMouseDown={(e)=>e.preventDefault()} onClick={applyImageEdits}>Apply (Enter)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleEditor;
