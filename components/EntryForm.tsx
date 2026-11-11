"use client";

import { useState } from "react";
import { supabase, TABLE, isConfigured } from "@/lib/supabase";

type FieldDef = {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
};

const FIELDS: FieldDef[] = [{"name": "title", "label": "Title", "type": "text", "required": true, "placeholder": ""}, {"name": "author", "label": "Author", "type": "text", "required": true, "placeholder": ""}, {"name": "pages_read", "label": "Pages read", "type": "int", "required": true, "placeholder": ""}, {"name": "rating", "label": "Rating 1-5", "type": "int", "required": true, "placeholder": ""}, {"name": "finished_on", "label": "Finished on", "type": "date", "required": true, "placeholder": ""}];

export default function EntryForm() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload: Record<string, unknown> = {};

    for (const f of FIELDS) {
      const raw = data.get(f.name);
      if (f.type === "bool") {
        payload[f.name] = data.get(f.name) === "on";
      } else if (raw === null || raw === "") {
        if (f.required) {
          setMsg(`${f.label} is required.`);
          return;
        }
      } else if (f.type === "int") {
        payload[f.name] = parseInt(String(raw), 10);
      } else if (f.type === "number") {
        payload[f.name] = parseFloat(String(raw));
      } else {
        payload[f.name] = String(raw);
      }
    }

    if (!isConfigured) {
      setMsg("Add your Supabase keys to .env.local first.");
      return;
    }

    setBusy(true);
    setMsg(null);
    const { error } = await supabase().from(TABLE).insert(payload);
    setBusy(false);

    if (error) {
      setMsg(error.message);
      return;
    }
    form.reset();
    setMsg("Saved.");
    window.dispatchEvent(new Event("entry:created"));
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Add a book</h2>
      <p className="mt-1 text-sm text-slate-500">
        Writes directly to the book_reading_log_books table.
      </p>

      <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
            <input type="text" name="title" placeholder="" required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Author</label>
            <input type="text" name="author" placeholder="" required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Pages read</label>
            <input type="number" name="pages_read" step="any" required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Rating 1-5</label>
            <input type="number" name="rating" step="any" required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Finished on</label>
            <input type="date" name="finished_on" required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900" />
          </div>
      </div>

      <button
        type="submit"
        disabled={busy}
        className="mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition disabled:opacity-60"
        style={{ background: "var(--accent)" }}
      >
        {busy ? "Saving…" : "Save book"}
      </button>

      {msg && <p className="mt-3 text-sm text-slate-600">{msg}</p>}
    </form>
  );
}
