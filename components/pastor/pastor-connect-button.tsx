"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type PastorMessageForm = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const emptyForm: PastorMessageForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export function PastorConnectButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function closeModal() {
    setIsOpen(false);
    window.setTimeout(() => {
      setForm(emptyForm);
      setMessage("");
      setSubmitted(false);
      setIsSubmitting(false);
    }, 200);
  }

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "pastor",
        ...form,
      }),
    });

    const result = (await response.json().catch(() => ({}))) as { message?: string };

    if (!response.ok) {
      setMessage(result.message ?? "Something went wrong. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setSubmitted(true);
    setMessage(result.message ?? "Your message has been sent.");
    setForm(emptyForm);
    setIsSubmitting(false);
  }

  return (
    <>
      <Button type="button" size="lg" onClick={() => setIsOpen(true)}>
        <Mail className="h-5 w-5" />
        Connect with Pastor Keith
      </Button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-3 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pastor-connect-title"
          onClick={closeModal}
        >
          <Card className="max-h-[88vh] w-full max-w-xl overflow-hidden" onClick={(event) => event.stopPropagation()}>
            <CardHeader className="border-b border-[var(--brand-border)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle id="pastor-connect-title">Connect with Pastor Keith</CardTitle>
                  <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
                    Send a message directly to Pastor Keith. Please include your contact information so he can follow up.
                  </p>
                </div>
                <button
                  type="button"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--brand-border)] text-[var(--brand-muted)] hover:bg-[var(--brand-soft)]"
                  aria-label="Close pastor message form"
                  onClick={closeModal}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="max-h-[68vh] overflow-y-auto p-5">
              {submitted ? (
                <div className="space-y-4 rounded-2xl bg-[var(--brand-soft)] p-5 text-center">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-[var(--brand-burgundy)]" />
                  <p className="font-semibold text-[var(--brand-navy)]">Message sent</p>
                  <p className="text-sm leading-6 text-[var(--brand-muted)]">{message}</p>
                  <Button type="button" size="sm" onClick={closeModal}>
                    Close
                  </Button>
                </div>
              ) : (
                <form onSubmit={submitMessage} className="grid gap-4">
                  <Input
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="Your name"
                    required
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      placeholder="Email"
                      required
                    />
                    <Input
                      type="tel"
                      value={form.phone}
                      onChange={(event) => setForm({ ...form, phone: event.target.value })}
                      placeholder="Phone"
                      required
                    />
                  </div>
                  <textarea
                    value={form.message}
                    onChange={(event) => setForm({ ...form, message: event.target.value })}
                    placeholder="Type your message"
                    required
                    rows={6}
                    className="min-h-36 rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 text-sm text-[var(--brand-navy)] outline-none placeholder:text-[var(--brand-muted)] focus:border-[var(--brand-burgundy)]"
                  />

                  {message ? <p className="text-sm text-[var(--brand-burgundy)]">{message}</p> : null}

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                    Send message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}
