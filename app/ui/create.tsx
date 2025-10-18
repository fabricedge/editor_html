"use client";

import { useState } from "react";
import {
  Send,
  FileText,
  Palette,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { nanoid } from "nanoid";

export default function FormPage() {
  const [formData, setFormData] = useState({
    theme: "raw_html",
    isPrivate: false,
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setFormData({ ...formData, [target.name]: target.checked });
    } else {
      setFormData({ ...formData, [target.name]: target.value });
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const page_id = nanoid();

      const theme = formData.theme; // you can expand this to include more logic

      const response = await fetch("/api/page/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_id,
          content: "<h1> Your First Page </h1>",
          theme: theme,
          private: formData.isPrivate
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setFormData({
        theme: "raw_html",
        isPrivate: false,
      });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    } finally {
      setTimeout(() => setStatus("idle"), 3500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-white px-6 py-12 relative overflow-hidden">
      <div className="absolute top-1/3 -left-20 w-72 h-72 bg-orange-200/40 rounded-full blur-3xl animate-pulse" />

      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-lg border border-orange-100 shadow-[0_8px_40px_-8px_rgba(249,115,22,0.25)] rounded-2xl p-8 z-10">
        <div className="flex flex-col items-center mb-6">
          <FileText className="w-8 h-8 text-orange-500 mb-2" />
          <h1 className="text-xl font-semibold text-gray-800">Create Page</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill out the form to create your page.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-black">
        
          {/* Theme Select */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Palette className="w-4 h-4 text-orange-500" />
              Theme
            </label>
            <select
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-orange-100 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400/60 focus:border-orange-400 transition-all"
            >
              <option value="raw_html">Raw HTML</option>
            </select>
          </div>

          {/* Private Option */}
          <div className="flex items-center gap-2">
            <input
              id="private"
              type="checkbox"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleChange}
              className="w-4 h-4 text-orange-500 border-orange-300 focus:ring-orange-400"
            />
            <label
              htmlFor="private"
              className="text-sm font-medium text-gray-700 flex items-center gap-1"
            >
              {formData.isPrivate ? (
                <Lock className="w-4 h-4 text-orange-500" />
              ) : (
                <Unlock className="w-4 h-4 text-gray-400" />
              )}
              Private page
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-white transition-all duration-200 ${
              status === "loading"
                ? "bg-orange-400 cursor-wait"
                : "bg-orange-500 hover:bg-orange-600 active:bg-orange-700 shadow-md"
            }`}
          >
            {status === "loading" ? (
              <span className="animate-pulse">Sending...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Create
              </>
            )}
          </button>
        </form>

        {/* Feedback */}
        {status === "success" && (
          <div className="flex items-center gap-2 mt-4 text-green-600 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Page created successfully!
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 mt-4 text-red-600 text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            {errorMessage || "Something went wrong."}
          </div>
        )}
      </div>
    </div>
  );
}
