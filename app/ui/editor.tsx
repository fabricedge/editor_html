"use client";

import { useEffect, useRef, useState } from "react";
import { Code2, Eye, Play } from "lucide-react";

interface EditorProps {
  page_value: string;           // initial server code
  page_id?: string;             // unique ID (for cache key)
  server_updated_at?: string;   // from Supabase: ISO timestamp of last update
}

export default function Editor({
  page_value,
  page_id = "default",
  server_updated_at,
}: EditorProps) {
  const CACHE_KEY = `editor_code_cache_${page_id}`;

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const codeRef = useRef<string>("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "conflict">("idle");
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const hasEdited = useRef(false);
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  const now = () => Date.now();

  // ✅ Load + freshness check
  useEffect(() => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const parsed = cachedData ? JSON.parse(cachedData) : null;

    const serverTime = server_updated_at ? new Date(server_updated_at).getTime() : 0;
    const cacheTime = parsed?.updated_at ?? 0;

    if (parsed && cacheTime > serverTime) {
      // 🧠 Cache is fresher — keep it
      codeRef.current = parsed.content;
      console.log("Using cached code (newer than server)");
    } else {
      // 🔁 Server is fresher — replace cache
      codeRef.current = page_value;
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ content: page_value, updated_at: now() })
      );
      console.log("Using server code (cache updated)");
    }

    setLoading(false);
  }, [CACHE_KEY, page_value, server_updated_at]);

  // ✅ Handle code edits
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    codeRef.current = e.target.value;
    hasEdited.current = true;

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ content: e.target.value, updated_at: now() })
    );

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveToServer(), 200);
  };

  // ✅ Save to server with conflict awareness
  const saveToServer = async () => {
    if (!hasEdited.current) return;
    setStatus("saving");

    try {
      const res = await fetch("/api/page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: codeRef.current,
          updated_at: now(),
          page_id,
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      const data = await res.json();

      if (data.conflict) {
        setStatus("conflict");
        console.warn("⚠️ Conflict detected: newer version on server");
        return;
      }

      setStatus("saved");
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ content: codeRef.current, updated_at: now() })
      );
      hasEdited.current = false;
    } catch (err) {
      console.error("❌ Save error:", err);
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

  return (
    <div className="relative flex h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-90">
          <div className="w-16 h-16 border-4 border-orange-300 border-t-orange-500 rounded-full animate-spin mb-4"></div>
          <p className="text-center text-gray-700 max-w-xs">
            Loading your code editor...
          </p>
        </div>
      )}

      {/* Left side: Code editor */}
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

            {status === "saving" && <span className="text-sm text-gray-500 animate-pulse">Saving...</span>}
            {status === "saved" && <span className="text-sm text-green-600">✓ Saved</span>}
            {status === "conflict" && <span className="text-sm text-red-600">⚠️ Conflict</span>}
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

      {/* Right side: Preview */}
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
