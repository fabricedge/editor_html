"use client";

import { useEffect, useRef, useState } from "react";
import { Code2, Eye } from "lucide-react";
import { loadFromCache, saveToCache, isCacheNewer } from "../utils/cache/cacheManager";
import EditorM from "@monaco-editor/react";

import { MAX_CHARACTERS } from "../lib/constants";
interface EditorProps {
  page_value: string;
  page_id?: string;
  server_updated_at?: string;
  max_characters?: number;
}

export default function Editor({
  page_value,
  page_id = "default",
  server_updated_at,
  max_characters = MAX_CHARACTERS,
}: EditorProps) {
  const MAX_CHARACTERS = max_characters;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const codeRef = useRef<string>("");
  const editorRef = useRef<import("monaco-editor").editor.IStandaloneCodeEditor | null>(null);

  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [charCount, setCharCount] = useState(0);
  const [hasContent, setHasContent] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  // 🧠 Detecta se está em modo desktop ou mobile
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize(); // roda na primeira montagem
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🧩 Handle editor mounting
  function handleEditorDidMount(editor: import("monaco-editor").editor.IStandaloneCodeEditor) {
    
    const initialValue = codeRef.current.slice(0, MAX_CHARACTERS);
    editor.setValue(initialValue);
    setCharCount(initialValue.length);
    setHasContent(initialValue.trim().length > 0);
    editorRef.current = editor;

    editor.onDidChangeModelContent(async () => {
      const value = editor.getValue();
      setCharCount(value.length);
      setHasContent(value.trim().length > 0);

      if (value.length > MAX_CHARACTERS) {
        const truncated = value.substring(0, MAX_CHARACTERS);
        const model = editor.getModel();
        if (model) {
          editor.executeEdits(null, [
            { range: model.getFullModelRange(), text: truncated },
          ]);
          alert(`Maximum length of ${MAX_CHARACTERS} characters reached.`);
        }
      }

      codeRef.current = value.slice(0, MAX_CHARACTERS);

      // ✅ SUBMIT before saving to cache
      try {
        const res = await fetch("/api/page/edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page_id,
            content: codeRef.current,
          }),
        });

        if (!res.ok) {
          console.error("Failed to submit to API");
          return;
        }

        // ✅ Only after the API succeeds, save to cache
        saveToCache(page_id, codeRef.current, true);
      } catch (err) {
        console.error("Error while submitting:", err);
      }
    });
  }

  // 🧠 Mount lifecycle
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    const maxChars = MAX_CHARACTERS; // capture stable value

    const cached = loadFromCache(page_id);
    if (isCacheNewer(cached, server_updated_at)) {
      codeRef.current = cached!.content.slice(0, maxChars);
    } else {
      codeRef.current = page_value.slice(0, maxChars);
      saveToCache(page_id, codeRef.current, true);
    }

    setCharCount(codeRef.current.length);
    setHasContent(codeRef.current.trim().length > 0);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, page_value, page_id, server_updated_at]);


  // 🔄 Update iframe preview
  const updatePreview = () => {
    if (iframeRef.current && codeRef.current) {
      iframeRef.current.srcdoc = codeRef.current;
    }
  };

  if (!mounted) return null;

 return (
  <div className="flex flex-col h-screen bg-white px-6 lg:px-8 relative pb-[8vh]">
    <style>{`
      @layer base {
        html, body {
          overflow: hidden;
        }
      }
    `}</style>

    {/* Loading overlay */}
    {loading && (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-50 backdrop-blur-sm">
        <div className="w-12 h-12 border-[3px] border-orange-300 border-t-orange-500 rounded-full animate-spin mb-4 shadow-inner" />
        <p className="text-gray-600 text-sm font-medium">Loading editor...</p>
      </div>
    )}

    {/* Tabs (mobile only) */}
    {!isDesktop && (
      <div className="flex border-b border-orange-200/80 bg-gradient-to-b from-orange-50 to-white sticky top-0 z-20 shadow-sm">
        <button
          onClick={() => setActiveTab("editor")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200 ${
            activeTab === "editor"
              ? "text-orange-600 border-b-[3px] border-orange-600 bg-orange-50/60"
              : "text-gray-600 hover:text-orange-600 hover:bg-orange-50/40"
          }`}
        >
          <Code2 className="w-4 h-4" />
          Editor
        </button>
        <button
          onClick={() => {
            setActiveTab("preview");
            updatePreview();
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200 ${
            activeTab === "preview"
              ? "text-orange-600 border-b-[3px] border-orange-600 bg-orange-50/60"
              : "text-gray-600 hover:text-orange-600 hover:bg-orange-50/40"
          }`}
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
      </div>
    )}

    {/* Main layout */}
    <div className="flex-1 flex overflow-hidden mt-4 rounded-2xl border-2 border-orange-200 bg-gradient-to-b from-white to-orange-50/[0.04] shadow-[0_8px_30px_-6px_rgba(249,115,22,0.25)] relative">
      {/* Decorative glowing border layer */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none border border-orange-400/30 [mask-image:linear-gradient(white,transparent_70%)]"></div>

      {/* Editor */}
      {(isDesktop || activeTab === "editor") && (
        <div
          className={`flex flex-col flex-1 ${
            isDesktop ? "w-1/2 border-r-2" : ""
          } border-orange-100/90 bg-gradient-to-b from-white to-orange-50/[0.07]`}
        >
          <div className="flex items-center gap-2 px-4 py-2.5 bg-orange-50/50 border-b border-orange-100/80">
            <Code2 className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">index.html</span>
            <div className="ml-auto text-xs text-gray-500">
              <span
                className={
                  charCount >= MAX_CHARACTERS
                    ? "text-red-600 font-semibold"
                    : "text-gray-500"
                }
              >
                {charCount.toLocaleString()} /{" "}
                {MAX_CHARACTERS.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <EditorM
              defaultLanguage="html"
              value={codeRef.current}
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: "on",
                wordWrap: "on",
                scrollBeyondLastLine: false,
                padding: { top: 10, bottom: 10 },
                tabSize: 2,
              }}
              onMount={handleEditorDidMount}
            />
          </div>
        </div>
      )}

      {/* Preview */}
      {(isDesktop || activeTab === "preview") && (
        <div
          className={`flex flex-col flex-1 ${
            isDesktop ? "w-1/2" : ""
          } bg-gradient-to-b from-orange-50/[0.05] to-white`}
        >
          <div className="flex items-center gap-2 px-4 py-2.5 bg-orange-50/50 border-b border-orange-100/80">
            <Eye className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">Preview</span>
          </div>

          <div className="flex-1 overflow-hidden bg-white relative rounded-br-2xl">
            {hasContent ? (
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                sandbox="allow-scripts"
                title="Preview"
                srcDoc={codeRef.current}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <Eye className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-sm font-medium">No content to preview</p>
                <p className="text-xs mt-1 text-gray-500">
                  Start typing in the editor
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);


}
