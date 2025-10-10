"use client";

import { useEffect, useRef, useState } from "react";
import { Code2, Eye, Play } from "lucide-react";
import {
  loadFromCache,
  saveToCache,
  isCacheNewer,
} from "../utils/cache/cacheManager";

interface EditorProps {
  page_value: string;
  page_id?: string;
  server_updated_at?: string;
}

export default function Editor({
  page_value,
  page_id = "default",
  server_updated_at,
}: EditorProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const codeRef = useRef<string>("");
  const hasEdited = useRef(false);
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [showPreview, setShowPreview] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Hydration-safe mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Load cached or server version (client only)
  useEffect(() => {
    if (!mounted) return;

    const cached = loadFromCache(page_id);

    if (isCacheNewer(cached, server_updated_at)) {
      codeRef.current = cached!.content;
      console.log("🧠 Using cached version (saved in DB)");
    } else {
      codeRef.current = page_value;
      saveToCache(page_id, page_value, true);
      console.log("☁️ Using server version");
    }

    setLoading(false);
  }, [mounted, page_value, page_id, server_updated_at]);

  // ✅ Handle typing
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    codeRef.current = e.target.value;
    hasEdited.current = true;

    saveToCache(page_id, e.target.value, false);
    setStatus("saving");

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveToServer(), 2000);
  };

  // ✅ Save to server
  const saveToServer = async () => {
    if (!hasEdited.current) return;

    setStatus("saving");
    try {
      const res = await fetch("/api/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_id,
          content: codeRef.current,
          updated_at: Date.now(),
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      setStatus("saved");
      saveToCache(page_id, codeRef.current, true);
      hasEdited.current = false;

      if (showPreview && iframeRef.current) {
        iframeRef.current.srcdoc = codeRef.current;
      }
    } catch (err) {
      console.error("Save error:", err);
      setStatus("idle");
    }
  };

  // ✅ Toggle preview
  const togglePreview = () => {
    setShowPreview((prev) => {
      const newState = !prev;
      if (newState && iframeRef.current) {
        iframeRef.current.srcdoc = codeRef.current;
      }
      return newState;
    });
  };

  if (!mounted) return null; // Prevent SSR mismatch

  return (
    <div className="relative flex h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-50">
          <div className="w-12 h-12 border-4 border-orange-300 border-t-orange-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-600 text-sm text-center max-w-xs">
            Loading editor... This may depend on text size or connection speed.
          </p>
        </div>
      )}

      {/* Editor Panel */}
      <div className="flex-1 flex flex-col border-r border-orange-200">
        <div className="flex items-center gap-2 px-6 py-4 bg-[#FAF9F6] border-b border-orange-200">
          <Code2 className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg font-semibold text-gray-800">Code Editor</h2>

          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={togglePreview}
              className="px-4 py-1 bg-orange-400 text-white rounded hover:bg-orange-500"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>

            {status === "saving" && (
              <span className="text-sm text-gray-500 animate-pulse">Saving...</span>
            )}
            {status === "saved" && <span className="text-sm text-green-600">✓ Saved</span>}
          </div>
        </div>

        <div className="flex-1 p-6 bg-[#FAF9F6]">
          <textarea
            defaultValue={codeRef.current}
            onChange={handleChange}
            className="w-full h-full bg-orange-50 text-gray-800 font-mono text-sm rounded-lg border border-orange-200 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none shadow-sm placeholder-gray-400"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Live Preview */}
      {showPreview && (
        <div className="flex-1 flex flex-col bg-orange-50">
          <div className="flex items-center gap-2 px-6 py-4 bg-[#FAF9F6] border-b border-orange-200">
            <Eye className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-800">Live Preview</h2>
            <Play className="w-4 h-4 text-orange-400 ml-auto" />
          </div>
          <div className="flex-1 p-6 bg-gradient-to-br from-white to-orange-50">
            <iframe
              ref={iframeRef}
              className="w-full h-full bg-[#FAF9F6] rounded-lg shadow-lg border border-orange-200"
              sandbox="allow-scripts"
              title="Code Preview"
              srcDoc={codeRef.current}
            />
          </div>
        </div>
      )}
    </div>
  );
}
