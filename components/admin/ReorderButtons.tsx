"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { moveService } from "@/lib/admin/actions/services";
import { moveNavItem } from "@/lib/admin/actions/site";
import { useToast } from "./ui/Toast";

const fns = { service: moveService, nav: moveNavItem };

export function ReorderButtons({ kind, id, first, last, label }: { kind: keyof typeof fns; id: string; first: boolean; last: boolean; label: string }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, start] = useTransition();
  const go = (dir: "up" | "down") =>
    start(async () => {
      const res = await fns[kind](id, dir);
      if (!res.ok) toast.error(res.error);
      else router.refresh();
    });
  return (
    <div className="flex gap-0.5">
      <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm px-1.5" disabled={first || pending} onClick={() => go("up")} aria-label={`Move ${label} up`}>
        <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm px-1.5" disabled={last || pending} onClick={() => go("down")} aria-label={`Move ${label} down`}>
        <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
