"use client";

import { useEffect, useRef, useState } from "react";
import { Code2, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { loadFromCache, saveToCache, isCacheNewer } from "@/lib/cache";
import EditorM from "@monaco-editor/react";
import { MAX_CHARACTERS as DEFAULT_MAX } from "@/lib/constants";
import { useMediaQuery } from "@/hooks/use-media-query";

interface EditorProps {
  page_value: string;
  page_id?: string;
  server_updated_at?: string;
  max_characters?: number;
  expiration?: string;
}

const DEBOUNCE_MS = 500;

export default function Editor({
  page_value,
  page_id = "default",
  server_updated_at,
  max_characters = DEFAULT_MAX,
  expiration,
}: EditorProps) {
  const maxCharacters = max_characters;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const codeRef = useRef<string>("");
  const editorRef = useRef<import("monaco-editor").editor.IStandaloneCodeEditor | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const isDesktop = useMediaQuery(768);

  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [loading, setLoading] = useState(true);
  const [charCount, setCharCount] = useState(0);
  const [hasContent, setHasContent] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const cached = loadFromCache(page_id);
    if (isCacheNewer(cached, server_updated_at)) {
      codeRef.current = cached!.content.slice(0, maxCharacters);
    } else {
      codeRef.current = page_value.slice(0, maxCharacters);
      saveToCache(page_id, codeRef.current, true);
    }

    if (editorRef.current) {
      editorRef.current.setValue(codeRef.current);
    }

    setCharCount(codeRef.current.length);
    setHasContent(codeRef.current.trim().length > 0);
    setPreviewContent(codeRef.current);
    setLoading(false);
  }, [page_value, page_id, server_updated_at, maxCharacters]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    };
  }, []);

  const saveContent = async (content: string) => {
    try {
      const res = await fetch("/api/pages/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page_id, content }),
      });

      if (!res.ok) {
        console.error("Failed to save page:", res.status, res.statusText);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error while saving:", err);
      return false;
    }
  };

  const scheduleSave = (content: string) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      const saved = await saveContent(content);
      saveToCache(page_id, content, saved);
    }, DEBOUNCE_MS);
  };

  const schedulePreview = (content: string) => {
    if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    previewTimerRef.current = setTimeout(() => {
      setPreviewContent(content);
    }, DEBOUNCE_MS);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this page? This cannot be undone.")) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/pages/${page_id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/");
      } else {
        console.error("Failed to delete page");
        setDeleting(false);
      }
    } catch {
      console.error("Error deleting page");
      setDeleting(false);
    }
  };

  function handleEditorDidMount(editor: import("monaco-editor").editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
    editor.setValue(codeRef.current);
    setCharCount(codeRef.current.length);
    setHasContent(codeRef.current.trim().length > 0);

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      let next = value;

      if (value.length > maxCharacters) {
        next = value.substring(0, maxCharacters);
        const model = editor.getModel();
        if (model) {
          editor.executeEdits(null, [
            { range: model.getFullModelRange(), text: next },
          ]);
        }
      }

      codeRef.current = next;
      setCharCount(next.length);
      setHasContent(next.trim().length > 0);
      schedulePreview(next);
      scheduleSave(next);
    });
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 px-6 lg:px-8 relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-50 backdrop-blur-sm">
          <div className="w-12 h-12 border-[3px] border-gray-300 border-t-gray-600 rounded-full animate-spin mb-4" />
          <p className="text-gray-600 text-sm font-medium">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 px-6 lg:px-8 relative pb-[8vh]">
      {/* Tabs (mobile only) */}
      {!isDesktop && (
        <div className="flex border-b border-gray-200 bg-white sticky top-0 z-20 shadow-sm">
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200 ${
              activeTab === "editor"
                ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Code2 className="w-4 h-4" />
            Editor
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200 ${
              activeTab === "preview"
                ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>
      )}

      {expiration && (
        <div className="flex items-center justify-between text-gray-700 bg-amber-50 border border-amber-200 my-2 px-3 py-1.5 rounded-lg text-sm">
          <span>Page expires on: {expiration}</span>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 text-xs font-medium disabled:opacity-50"
          >
            <Trash2 className="w-3 h-3" />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden mt-2 rounded-xl border border-gray-200 bg-white shadow-sm relative">
        {/* Editor */}
        {(isDesktop || activeTab === "editor") && (
          <div
            className={`flex flex-col flex-1 ${
              isDesktop ? "w-1/2 border-r border-gray-200" : ""
            }`}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
              <Code2 className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">index.html</span>
              <div className="ml-auto text-xs text-gray-500">
                <span
                  className={
                    charCount >= maxCharacters
                      ? "text-red-600 font-semibold"
                      : "text-gray-500"
                  }
                >
                  {charCount.toLocaleString()} / {maxCharacters.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <EditorM
                defaultLanguage="html"
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
            }`}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
              <Eye className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Preview</span>
            </div>

            <div className="flex-1 overflow-hidden bg-white relative">
              {hasContent ? (
                <iframe
                  ref={iframeRef}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts"
                  title="Preview"
                  srcDoc={previewContent}
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
