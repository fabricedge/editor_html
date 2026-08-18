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
import { useSession } from "next-auth/react";

export default function CreateForm() {
  const [formData, setFormData] = useState({
    theme: "raw_html",
    isPrivate: false,
  });
  const router = useRouter();

  const { data: session } = useSession();
  const user = session?.user ?? null;

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

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

      const response = await fetch("/api/pages/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_id,
          content: "<h1>Your First Page. You can modify this!</h1>",
          theme: formData.theme,
          private: formData.isPrivate,
        }),
      });

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 py-12 relative overflow-hidden">
      <div className="absolute top-1/3 -left-20 w-72 h-72 bg-gray-200/40 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-xl p-8 z-10">
        <div className="flex flex-col items-center mb-6">
          <FileText className="w-8 h-8 text-gray-600 mb-2" />
          <h1 className="text-xl font-semibold text-gray-900">Create Page</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill out the form to create your page.
          </p>
          <div
            className={
              user
                ? "text-gray-500 mt-1 text-sm"
                : "text-amber-700 bg-amber-50 px-3 py-1 rounded text-sm mt-2"
            }
          >
            {user
              ? "You are logged in!"
              : "Not logged in! Page expires in 7 days."}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 text-gray-900"
        >
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Palette className="w-4 h-4 text-gray-500" />
              Theme
            </label>
            <select
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400/40 focus:border-gray-400 transition-all"
            >
              <option value="raw_html">Raw HTML</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="private"
              type="checkbox"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleChange}
              className="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-400 rounded"
            />
            <label
              htmlFor="private"
              className="text-sm font-medium text-gray-700 flex items-center gap-1"
            >
              {formData.isPrivate ? (
                <Lock className="w-4 h-4 text-gray-600" />
              ) : (
                <Unlock className="w-4 h-4 text-gray-400" />
              )}
              Private page
            </label>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-white transition-all duration-200 ${
              status === "loading"
                ? "bg-gray-400 cursor-wait"
                : "bg-gray-900 hover:bg-gray-800 active:bg-gray-700 shadow-md"
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

        {status === "success" && (
          <div className="flex items-center gap-2 mt-4 text-green-600 text-sm font-medium animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Page created successfully! Redirecting...
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
