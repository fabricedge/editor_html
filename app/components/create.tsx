"use client";

import { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";

export default function FormPage() {
  const [formData, setFormData] = useState({
    theme: "raw_html",
    isPrivate: false,
  });
  const router = useRouter();

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Clean up any pending timeouts when the component unmounts
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (status === "success" || status === "error") {
      timeout = setTimeout(() => setStatus("idle"), 3500);
    }
    return () => clearTimeout(timeout);
  }, [status]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, checked, value } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const page_id = nanoid();

      const response = await fetch("/api/page/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_id,
          //todo: check content size. limit to 10k characters
          content: "<h1>Your First Page. You can modify this!</h1>",
          theme: formData.theme,
          private: formData.isPrivate,
        }),
      });

      // Handle non-OK responses
      if (!response.ok) {
        let message = "Something went wrong.";
        try {
          const data = await response.json();
          message = data.error || message;
        } catch {
          /* ignore invalid JSON */
        }
        throw new Error(message);
      }

      router.push(`/p/edit/${page_id}`);
    } catch (error) {
      console.error("Page creation failed:", error);

      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-50 to-gray-100 px-6 py-12 relative overflow-hidden">
      <div className="absolute top-1/3 -left-20 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl animate-pulse" />

      <div className="relative w-full max-w-md bg-gray-100 backdrop-blur-lg border border-pink-100 shadow-[0_8px_40px_-8px_rgba(236,72,153,0.25)] rounded-2xl p-8 z-10">
        <div className="flex flex-col items-center mb-6">
          <FileText className="w-8 h-8 text-pink-500 mb-2" />
          <h1 className="text-xl font-semibold text-gray-800">Create Page</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill out the form to create your page.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 text-black"
        >
          {/* Theme Select */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Palette className="w-4 h-4 text-pink-500" />
              Theme
            </label>
            <select
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-pink-100 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400/60 focus:border-pink-400 transition-all"
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
              className="w-4 h-4 text-pink-500 border-pink-300 focus:ring-pink-400"
            />
            <label
              htmlFor="private"
              className="text-sm font-medium text-gray-700 flex items-center gap-1"
            >
              {formData.isPrivate ? (
                <Lock className="w-4 h-4 text-pink-500" />
              ) : (
                <Unlock className="w-4 h-4 text-gray-400" />
              )}
              Private page
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-gray-100 transition-all duration-200 ${
              status === "loading"
                ? "bg-pink-400 cursor-wait"
                : "bg-pink-500 hover:bg-pink-600 active:bg-pink-700 shadow-md"
            }`}
          >
            {status === "loading" ? (
              <span className="animate-pulse">Creating...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Create
              </>
            )}
          </button>
        </form>

        {/* Feedback Messages */}
        {status === "success" && (
          <div className="flex items-center gap-2 mt-4 text-green-600 text-sm font-medium animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Page created successfully! Redirecting you to edit Page!
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 mt-4 text-red-600 text-sm font-medium animate-fade-in">
            <AlertCircle className="w-4 h-4" />
            {errorMessage || "Something went wrong."}
          </div>
        )}
      </div>
    </div>
  );
}
