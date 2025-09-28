"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { FormProps } from "@/types";

// Helper: build validation rules based on field definition
function buildRules(field: FormProps["fields"][number]) {
  const rules: Record<string, any> = {};
  if (field.isRequired) {
    rules.required = `${field.label || field.placeholder || field.id} is required`;
  }
  if (field.type === "email") {
    rules.pattern = {
      value: /[^@\s]+@[^@\s]+\.[^@\s]+/,
      message: "Please enter a valid email address",
    };
  }
  return rules;
}

type DynamicFormValues = Record<string, string>;

export function Form({ fields, submitButton, recipientEmail }: Readonly<FormProps>) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<DynamicFormValues>({
    defaultValues: fields.reduce((acc, f) => ({ ...acc, [f.id]: "" }), {} as DynamicFormValues),
    mode: "onBlur",
  });

  const [status, setStatus] = React.useState<"idle" | "error" | "success">("idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const onSubmit = async (data: DynamicFormValues) => {
    setStatus("idle");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientEmail, ...data }),
      });
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }
      setStatus("success");
      reset();
    } catch (e: any) {
      setStatus("error");
      setErrorMsg(e.message || "Failed to send message");
    }
  };

  // Auto clear success after a few seconds
  React.useEffect(() => {
    if (status === "success") {
      const t = setTimeout(() => setStatus("idle"), 4000);
      return () => clearTimeout(t);
    }
  }, [status]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="group relative flex flex-col gap-5 rounded-xl bg-neutral-900/40 p-6 backdrop-blur border border-border/60 shadow-sm max-w-2xl mx-auto w-full"
      noValidate
    >
      <div className="grid w-full gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const id = `form-${field.id}`;
          const baseInputClasses =
            "w-full rounded-md border border-border/60 bg-neutral-900/70 px-4 py-3 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary transition disabled:opacity-50";
          const hasError = !!errors[field.id];
          const errorClasses = hasError
            ? " border-red-500 focus:ring-red-500 focus:border-red-500"
            : "";
          return (
            <div
              key={field.id}
              className={
                field.type === "textField" ? "sm:col-span-2 flex flex-col" : "flex flex-col"
              }
            >
              <label
                htmlFor={id}
                className="mb-1 text-xs font-medium tracking-wide uppercase text-neutral-400"
              >
                {field.label || field.placeholder}
                {field.isRequired && <span className="ml-1 text-red-400">*</span>}
              </label>
              {field.type === "textField" ? (
                <textarea
                  id={id}
                  placeholder={field.placeholder}
                  aria-invalid={hasError}
                  className={baseInputClasses + errorClasses + " resize-y min-h-[140px]"}
                  {...register(field.id, buildRules(field))}
                />
              ) : (
                <input
                  id={id}
                  type={field.type}
                  placeholder={field.placeholder}
                  aria-invalid={hasError}
                  className={baseInputClasses + errorClasses}
                  {...register(field.id, buildRules(field))}
                  autoComplete={field.type === "email" ? "email" : "off"}
                />
              )}
              {hasError && (
                <span className="mt-1 text-xs text-red-400">
                  {(errors as any)[field.id]?.message as string}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white shadow hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 transition"
        >
          {isSubmitting ? "Sending..." : submitButton?.text || "Submit"}
        </button>
        {status === "success" && isSubmitSuccessful && (
          <span className="text-xs text-green-400">Message sent successfully.</span>
        )}
        {status === "error" && (
          <span className="text-xs text-red-400">{errorMsg || "Error sending message."}</span>
        )}
      </div>

      <input
        type="hidden"
        value={recipientEmail}
        {...register("recipientEmail", { value: recipientEmail })}
      />
    </form>
  );
}
