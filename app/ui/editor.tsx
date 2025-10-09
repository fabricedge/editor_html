"use client";
import { useState, useEffect } from 'react';
import { Code2, Eye, Play } from 'lucide-react';

interface EditorProps {
  page: any; // or better: define a proper Page type
}


export default function Editor({ page }: EditorProps) {
  const [code, setCode] = useState('<h1>Hello, world!</h1>');
  const [iframeContent, setIframeContent] = useState('');

  useEffect(() => {
    setIframeContent(code);
  }, [code]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Editor Panel */}
      <div className="flex-1 flex flex-col border-r border-orange-200">
        <div className="flex items-center gap-2 px-6 py-4 bg-[#FAF9F6] border-b border-orange-200">
          <Code2 className="w-5 h-5 text-orange-400" />
          <h2 className="text-lg font-semibold text-gray-800">Code Editor</h2>
          <div className="ml-auto flex gap-2">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-300"></div>
              <div className="w-3 h-3 rounded-full bg-orange-400"></div>
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 p-6 bg-[#FAF9F6]">
          <textarea
            value={page}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full bg-orange-50 text-gray-800 font-mono text-sm p-4 rounded-lg border border-orange-200 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none shadow-sm placeholder-gray-400"
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