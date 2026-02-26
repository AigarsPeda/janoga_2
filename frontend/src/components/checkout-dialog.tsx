"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  notes: string;
  address: string;
}

export interface CheckoutLabels {
  title?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  nameRequiredError?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  emailRequiredError?: string;
  emailInvalidError?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  phoneRequiredError?: string;
  addressLabel?: string;
  addressPlaceholder?: string;
  addressRequiredError?: string;
  notesLabel?: string;
  notesPlaceholder?: string;
  cancelButtonText?: string;
  payButtonText?: string;
}

interface CheckoutDialogProps {
  open: boolean;
  itemLabel?: string;
  totalPrice: number;
  totalItems: number;
  itemsLabel?: string;
  isSubmitting: boolean;
  labels?: CheckoutLabels;
  onOpenChange: (open: boolean) => void;
  onConfirm: (info: CustomerInfo) => void;
}

const emptyForm: CustomerInfo = { name: "", email: "", phone: "", address: "", notes: "" };
const emptyErrors: Record<string, string> = {};

export function CheckoutDialog({
  open,
  labels,
  itemLabel,
  itemsLabel,
  totalPrice,
  totalItems,
  isSubmitting,
  onConfirm,
  onOpenChange,
}: CheckoutDialogProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState(emptyErrors);

  const updateField = (field: keyof CustomerInfo, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const t = {
    title: labels?.title || "Pasūtījuma noformēšana",
    nameLabel: labels?.nameLabel || "Vārds, Uzvārds",
    namePlaceholder: labels?.namePlaceholder || "Jānis Bērziņš",
    nameRequiredError: labels?.nameRequiredError || "Vārds ir obligāts",
    emailLabel: labels?.emailLabel || "E-pasts",
    emailPlaceholder: labels?.emailPlaceholder || "jusu@epasts.lv",
    emailRequiredError: labels?.emailRequiredError || "E-pasts ir obligāts",
    emailInvalidError: labels?.emailInvalidError || "Lūdzu ievadiet derīgu e-pastu",
    phoneLabel: labels?.phoneLabel || "Tālrunis",
    phonePlaceholder: labels?.phonePlaceholder || "+371 20000000",
    phoneRequiredError: labels?.phoneRequiredError || "Tālrunis ir obligāts",
    addressLabel: labels?.addressLabel || "Piegādes adrese",
    addressPlaceholder: labels?.addressPlaceholder || "Iela, pilsēta, pasta indekss",
    addressRequiredError: labels?.addressRequiredError || "Adrese ir obligāta",
    notesLabel: labels?.notesLabel || "Piezīmes",
    notesPlaceholder: labels?.notesPlaceholder || "Īpašas vēlmes...",
    cancelButtonText: labels?.cancelButtonText || "Atcelt",
    payButtonText: labels?.payButtonText || "Maksāt",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = t.nameRequiredError;
    if (!form.email.trim()) {
      newErrors.email = t.emailRequiredError;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = t.emailInvalidError;
    }
    if (!form.phone.trim()) newErrors.phone = t.phoneRequiredError;
    if (!form.address.trim()) newErrors.address = t.addressRequiredError;

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onConfirm({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      notes: form.notes.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>
            {totalItems} {totalItems === 1 ? itemLabel || "item" : itemsLabel || "items"} —{" "}
            {totalPrice.toFixed(2)} €
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div>
            <Label htmlFor="checkout-name" className="mb-3 block">
              {t.nameLabel} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="checkout-name"
              type="text"
              placeholder={t.namePlaceholder}
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              autoFocus
            />
            {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="checkout-email" className="mb-3 block">
              {t.emailLabel} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="checkout-email"
              type="email"
              placeholder={t.emailPlaceholder}
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
            {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="checkout-phone" className="mb-3 block">
              {t.phoneLabel} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="checkout-phone"
              type="tel"
              placeholder={t.phonePlaceholder}
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
            {errors.phone && <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>}
          </div>

          <div>
            <Label htmlFor="checkout-address" className="mb-3 block">
              {t.addressLabel} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="checkout-address"
              type="text"
              placeholder={t.addressPlaceholder}
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
            />
            {errors.address && <p className="mt-1.5 text-xs text-red-500">{errors.address}</p>}
          </div>

          <div>
            <Label htmlFor="checkout-notes" className="mb-3 block">
              {t.notesLabel}
            </Label>
            <textarea
              id="checkout-notes"
              placeholder={t.notesPlaceholder}
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t.cancelButtonText}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "..." : `${t.payButtonText} ${totalPrice.toFixed(2)} €`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
