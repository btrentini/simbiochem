"use client";

import type { ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";

export function ModelDetailsDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger data-model-details-trigger="true" className="mt-4 cursor-pointer text-xs font-medium text-ink underline decoration-mist underline-offset-4 hover:text-brand focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
        Data and model details
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop data-model-details-backdrop="true" className="fixed inset-0 z-[80] bg-brand-950/45 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-[81] flex max-h-[85dvh] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-mist bg-white shadow-2xl outline-none" data-model-details-dialog="true">
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-mist px-5 py-4 sm:px-7 sm:py-5">
            <div>
              <Dialog.Title className="display text-lg font-semibold text-ink">Data and model details</Dialog.Title>
              <Dialog.Description className="mt-1 text-xs leading-5 text-slate-2">Source counts, assumptions and the Bayesian model.</Dialog.Description>
            </div>
            <Dialog.Close aria-label="Close data and model details" className="-mr-2 shrink-0 cursor-pointer rounded-full p-2 text-slate-2 hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
              <X className="size-5" aria-hidden="true" />
            </Dialog.Close>
          </div>
          <div data-model-details-content="true" className="min-h-0 overflow-y-auto overscroll-contain px-5 py-5 text-sm leading-6 text-slate-2 sm:px-7 sm:py-6">
            {children}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
