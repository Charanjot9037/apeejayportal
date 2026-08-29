"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { Input } from "@/components/ui/input";

export default function TechStackModal({ isOpen, onClose, onAdd }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) {
      setValue("");
      setError("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const added = onAdd(value);
    if (added === false) {
      setError("Please enter a valid, non-duplicate technology.");
      return;
    }
    onClose();
  };

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-lg bg-white p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-blue-900">
            Add Technology
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError("");
            }}
            placeholder="e.g. React, Node.js, MongoDB"
            className="h-10 bg-slate-50 text-sm"
          />

          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-orange-500 px-3 py-1.5 text-xs text-white hover:bg-orange-600"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}