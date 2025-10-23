// src/WebStudent/Pages/Course/LMS/CourseMetaForm.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../../LoginSystem/axios";

export default function CourseMetaForm({ course, onUpdated }) {
  const navigate = useNavigate();
  const c = course || {};

  // ---------- helpers ----------
  const resolveImageUrl = (raw) => {
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    const m = raw.match(/^s3:\/\/([^/]+)\/(.+)$/i);
    if (m) {
      const bucket = m[1];
      const key = m[2];
      return `https://${bucket}.s3.amazonaws.com/${encodeURIComponent(key).replace(/%2F/g, "/")}`;
    }
    return raw;
  };

  // ---------- initial form (title + price only) ----------
  const initial = useMemo(
    () => ({
      title: c.title || "",
      price: typeof c.price === "number" ? c.price : c.price ? Number(c.price) : 0,
    }),
    [c]
  );

  const [form, setForm] = useState(initial);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // cover state
  const fileInputRef = useRef(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(
    resolveImageUrl(
      c.coverImage || c.coverUrl || c.imageUrl || c.image || c.thumbnailUrl || c.thumbnail || ""
    )
  );

  // publish toggle
  const [publishing, setPublishing] = useState(false);
  const isPublished =
    c?.status === "published" || c?.status === "PUBLISHED" || c?.status === "live";

  useEffect(() => {
    setForm({
      title: c.title || "",
      price: typeof c.price === "number" ? c.price : 0,
    });
    setCoverPreview(
      resolveImageUrl(
        c.coverImage || c.coverUrl || c.imageUrl || c.image || c.thumbnailUrl || c.thumbnail || ""
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [c.title, c.price, c.coverImage, c.coverUrl, c.imageUrl, c.image, c.thumbnailUrl, c.thumbnail]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: name === "price" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const onPickCover = (e) => {
    const f = e.target.files?.[0] || null;
    setCoverFile(f);
    if (f) setCoverPreview(URL.createObjectURL(f));
  };

  const togglePublish = async () => {
    if (!course?._id) return;
    try {
      setPublishing(true);
      const res = await API.patch(`/api/courses/${course._id}/publish`, {});
      onUpdated?.(res.data.course);
    } catch (e) {
      console.error("Toggle publish error:", e?.response?.data || e.message);
      alert("❌ Failed to update status");
    } finally {
      setPublishing(false);
    }
  };

  // ---------- SINGLE SAVE ----------
  const saveAll = async () => {
    if (!course?._id) return;
    setMsg("");
    setSaving(true);
    try {
      let latestCourse = course;

      // 1) अगर नया image चुना गया है तो पहले उसे upload करो
      if (coverFile) {
        const fd = new FormData();
        fd.append("image", coverFile); // field name MUST be 'image'
        const token = localStorage.getItem("token");
        const uploadRes = await API.patch(`/api/courses/${course._id}/cover`, fd, {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          withCredentials: true,
        });
        latestCourse = uploadRes.data.course;
        // fresh preview (cache-bust)
        const newUrl =
          uploadRes?.data?.course?.coverImage ||
          uploadRes?.data?.coverUrl ||
          uploadRes?.data?.course?.imageUrl ||
          uploadRes?.data?.course?.image ||
          "";
        if (newUrl) setCoverPreview(`${newUrl.split("?")[0]}?v=${Date.now()}`);
        setCoverFile(null);
      }

      // 2) ab title + price save karo
      const payload = { title: form.title, price: Number(form.price || 0) };
      const metaRes = await API.put(`/api/courses/${course._id}/meta`, payload);

      // UI refresh
      onUpdated?.(metaRes.data.course);
      setMsg("✅ Saved");
    } catch (e) {
      console.error("Save error:", e?.response?.data || e.message);
      alert("❌ Failed to update cover image");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card p-3">
      {/* Back + Publish toggle */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <button className="btn btn-link p-0" onClick={() => navigate(-1)}>
          ← Back to Edit
        </button>

        <div className="form-check form-switch m-0">
          <input
            className="form-check-input"
            type="checkbox"
            id="courseStatusSwitch"
            checked={!!isPublished}
            onChange={togglePublish}
            disabled={publishing}
          />
          <label className="form-check-label" htmlFor="courseStatusSwitch">
            {publishing ? "Updating…" : isPublished ? "Published (ON)" : "Unpublished (OFF)"}
          </label>
        </div>
      </div>

      <h5 className="mb-3">Course Settings</h5>
      {msg ? <div className="alert alert-info py-2">{msg}</div> : null}

      {/* Cover Image (no separate save) */}
      <div className="mb-4">
        <label className="form-label fw-semibold">Cover Image</label>
        {coverPreview ? (
          <div className="mb-2">
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
           <div className="mb-2 d-flex justify-content-center">
  <img
    src={coverPreview}
    style={{
      width: 320,        // 👈 pura width fix chhota (px). Try 280/360 as you like
      height: 180,       // 👈 optional: consistent 16:9; remove if you want auto height
      objectFit: "cover",
      borderRadius: 8,
      display: "block",
    }}
    onError={() => setCoverPreview("")}
  />
</div>

          </div>
        ) : (
          <div className="text-muted small mb-2">No image</div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={onPickCover}
        />
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => fileInputRef.current?.click()}
        >
          Change
        </button>
      </div>

      {/* Title & Price */}
      <div className="row g-3">
        <div className="col-md-8">
          <label className="form-label">Title</label>
          <input
            name="title"
            className="form-control"
            placeholder="Course title"
            value={form.title}
            onChange={onChange}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Price</label>
          <input
            name="price"
            type="number"
            min="0"
            className="form-control"
            placeholder="0"
            value={form.price}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="mt-3">
        <button className="btn btn-primary" onClick={saveAll} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
