"use client";
import { useEffect, useRef, useState } from "react";
import { Code2, Eye, Play } from 'lucide-react';

interface EditorProps {
  page_value: string; // or better: define a proper Page type

}



export default function Editor({ page_value }: EditorProps) {
  const [code, setCode] = useState(page_value);
  const [iframeContent, setIframeContent] = useState(page_value);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const isFirstRender = useRef(true); // <-- Track first render

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // Skip first render
      return;
    }

    setStatus("saving");

    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: code }),
        });

        if (!res.ok) throw new Error("Failed to save");

        setStatus("saved");
        setIframeContent(code);
      } catch (error) {
        console.error("❌ Error saving:", error);
        setStatus("idle");
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [code]);
  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Editor Panel */}
      <div className="flex-1 flex flex-col border-r border-orange-200">
        <div className="flex items-center gap-2 px-6 py-4 bg-[#FAF9F6] border-b border-orange-200">
          <Code2 className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg font-semibold text-gray-800">Code Editor</h2>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-300"></div>
              <div className="w-3 h-3 rounded-full bg-orange-400"></div>
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            </div>

            {/* Save status indicator */}
            {status === "saving" && (
              <span className="text-sm text-gray-500 animate-pulse">Saving...</span>
            )}
            {status === "saved" && (
              <span className="text-sm text-green-600">✓ Saved</span>
            )}
          </div>
        </div>

        <div className="flex-1 p-6 bg-[#FAF9F6]">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full bg-orange-50 text-gray-800 font-mono text-sm rounded-lg border border-orange-200 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none shadow-sm placeholder-gray-400"
            placeholder="Enter your HTML code here..."
            spellCheck="false"
          />
        </div>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 flex flex-col bg-orange-50">
        <div className="flex items-center gap-2 px-6 py-4 bg-[#FAF9F6] border-b border-orange-200">
          <Eye className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-800">Live Preview</h2>
          <Play className="w-4 h-4 text-orange-400 ml-auto" />
        </div>
        <div className="flex-1 p-6 bg-gradient-to-br from-white to-orange-50">
          <iframe
            srcDoc={iframeContent}
            className="w-full h-full bg-[#FAF9F6] rounded-lg shadow-lg border border-orange-200"
            sandbox="allow-scripts"
            title="Code Preview"
          />
        </div>
      </div>
    </div>
  );
}