"use client";

import { useEffect, useRef, useState } from "react";
import { Code2, Eye, Play } from "lucide-react";
import { loadFromCache, saveToCache, isCacheNewer } from "../utils/cache/cacheManager";
import EditorM from '@monaco-editor/react';
import React from 'react';
import DOMPurify from 'dompurify';
import ReactDOM from 'react-dom';

interface EditorProps {
  page_value: string;
  page_id?: string;
  server_updated_at?: string;
  page: string;
}

const MAX_CHARACTERS = 10000;


export default function Editor({
  page_value,
  page_id = "default",
  server_updated_at,
  page,
}: EditorProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const codeRef = useRef<string>("");
  const hasEdited = useRef(false);

  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [showPreview, setShowPreview] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => setMounted(true), []);

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
    setLoading(false);
  }, [mounted, page_value, page_id, server_updated_at]);

  function handleEditorChange(value: string | undefined, event: any) {
    console.log('here is the current model value:', value);

     console.log('here is the current model event:', event);
    // save to db
  }

  // const saveToServer = async () => {
  //   if (!hasEdited.current) return;
    
  //   setStatus("saving");
  //   try {
  //     const res = await fetch("/api/page/edit", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         page_id,
  //         content: codeRef.current,
  //         updated_at: Date.now(),
  //         page,
  //       }),
  //     });

  //     if (!res.ok) throw new Error("Save failed");

  //     setStatus("saved");
  //     saveToCache(page_id, codeRef.current, true);
  //     hasEdited.current = false;

  //     if (showPreview && iframeRef.current) {
  //       iframeRef.current.srcdoc = codeRef.current;
  //     }
  //   } catch (err) {
  //     console.error("Save error:", err);
  //     setStatus("idle");
  //   }
  // };

  const togglePreview = () => {
    setShowPreview((prev) => {
      const newState = !prev;
      if (newState && iframeRef.current) {
        iframeRef.current.srcdoc = codeRef.current;
      }
      return newState;
    });
  };

  if (!mounted) return null;

  //const rootElement = document.getElementById('root');
  return (
    <div className="relative flex flex-col md:flex-row h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-50">
          <div className="w-12 h-12 border-4 border-orange-300 border-t-orange-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-600 text-sm text-center max-w-xs">
            Loading editor... Delay depends on text size or connection speed.
          </p>
        </div>
      )}

      {/* Editor Panel */}
      <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-orange-200">
        <div className="flex items-center gap-2 px-4 md:px-6 py-3 bg-[#FAF9F6] border-b border-orange-200">
          <Code2 className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg font-semibold text-gray-800">Code Editor</h2>

            {/* Character count */}
          <div className="text-right text-sm">
            <span className={charCount >= MAX_CHARACTERS ? "text-red-600 font-semibold" : "text-gray-500"}>
              {charCount} / {MAX_CHARACTERS} characters
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2 md:gap-3">
            <button
              onClick={togglePreview}
              className="px-3 py-1 bg-orange-400 text-white rounded hover:bg-orange-500 text-sm"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>

            {status === "saving" && (
              <span className="text-sm text-gray-500 animate-pulse">Saving...</span>
            )}
            {status === "saved" && <span className="text-sm text-green-600">✓ Saved</span>}
          </div>
        </div>

        <div className="flex-1 p-4 md:p-6 bg-[#FAF9F6] flex flex-col">
          <EditorM
            defaultLanguage="html"
            defaultValue={page_value}
            onChange={handleEditorChange}
            // onMount={handleEditorDidMount}
            // beforeMount={handleEditorWillMount}
            // onValidate={handleEditorValidation}
          />     
        </div>
      </div>

      {/* Live Preview */}
      {showPreview && (
        <div className="flex-1 flex flex-col bg-orange-50">
          <div className="flex items-center gap-2 px-4 md:px-6 py-3 bg-[#FAF9F6] border-b border-orange-200">
            <Eye className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-800">Live Preview</h2>
            <Play className="w-4 h-4 text-orange-400 ml-auto" />
          </div>
          <div className="flex-1 p-4 md:p-6 bg-gradient-to-br from-white to-orange-50">
            {/* <iframe
              ref={iframeRef}
              className="w-full h-full bg-[#FAF9F6] rounded-lg shadow-lg border border-orange-200"
              sandbox="allow-scripts"
              title="Code Preview"
              srcDoc={page_value}
            /> */}
                { <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page_value) }} /> }
           
          </div>
        </div>
      )}
    </div>
  );
}