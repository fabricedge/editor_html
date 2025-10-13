"use client";

import { useEffect, useRef, useState } from "react";
import { Code2, Eye } from "lucide-react";
import { loadFromCache, saveToCache, isCacheNewer } from "../utils/cache/cacheManager";
import EditorM from "@monaco-editor/react";

interface EditorProps {
  page_value: string;
  page_id?: string;
  server_updated_at?: string;
}

const MAX_CHARACTERS = 10_000_000;

export default function Editor({
  page_value,
  page_id = "default",
  server_updated_at,
}: EditorProps) {
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

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setCharCount(value.length);
      setHasContent(value.trim().length > 0);

      if (value.length > MAX_CHARACTERS) {
        const truncated = value.substring(0, MAX_CHARACTERS);
        const model = editor.getModel();
        if (model) {
          editor.executeEdits(null, [
            {
              range: model.getFullModelRange(),
              text: truncated,
            },
          ]);
          alert(`Maximum length of ${MAX_CHARACTERS} characters reached.`);
        }
      }

      codeRef.current = value.slice(0, MAX_CHARACTERS);
      saveToCache(page_id, codeRef.current, true);
    });
  }

  // 🧠 Mount lifecycle
  useEffect(() => setMounted(true), []);

  // 🗃 Load from cache or server value, truncated
  useEffect(() => {
    if (!mounted) return;

    const cached = loadFromCache(page_id);
    if (isCacheNewer(cached, server_updated_at)) {
      codeRef.current = cached!.content.slice(0, MAX_CHARACTERS);
    } else {
      codeRef.current = page_value.slice(0, MAX_CHARACTERS);
      saveToCache(page_id, codeRef.current, true);
    }

    setCharCount(codeRef.current.length);
    setHasContent(codeRef.current.trim().length > 0);
    setLoading(false);
  }, [mounted, page_value, page_id, server_updated_at]);

  // 🔄 Update iframe preview
  const updatePreview = () => {
    if (iframeRef.current && codeRef.current) {
      iframeRef.current.srcdoc = codeRef.current;
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-white px-8 py-2 relative">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-50">
          <div className="w-12 h-12 border-4 border-orange-300 border-t-orange-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-600 text-sm">Loading editor...</p>
        </div>
      )}

      {/* Tabs (only visible on mobile) */}
      {!isDesktop && (
        <div className="flex border-b border-gray-200 bg-white z-10">
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === "editor"
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600 hover:text-gray-800"
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
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === "preview"
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>
      )}

      {/* Layout principal */}
      <div className="flex-1 flex overflow-hidden mt-0 shadow-2xl shadow-orange-300 rounded-lg pb-5">
        {/* Editor */}
        {(isDesktop || activeTab === "editor") && (
          <div className={`flex flex-col flex-1 ${isDesktop ? "w-1/2 border-r" : ""} border-gray-200`}>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
              <Code2 className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">index.html</span>
              <div className="ml-auto text-xs text-gray-500">
                <span
                  className={
                    charCount >= MAX_CHARACTERS
                      ? "text-red-600 font-semibold"
                      : "text-gray-500"
                  }
                >
                  {charCount.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <EditorM
                defaultLanguage="html"
                value={codeRef.current}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  wordWrap: "on",
                  scrollBeyondLastLine: false,
                  padding: { top: 10, bottom: 10 },
                  tabSize: 4,
                }}
                onMount={handleEditorDidMount}
              />
            </div>
          </div>
        )}

        {/* Preview */}
        {(isDesktop || activeTab === "preview") && (
          <div className={`flex flex-col flex-1 ${isDesktop ? "w-1/2" : ""} bg-gray-50`}>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
              <Eye className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Result</span>
            </div>

            <div className="flex-1 overflow-hidden bg-white relative">
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
                  <p className="text-xs mt-1">Start typing in the editor</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
