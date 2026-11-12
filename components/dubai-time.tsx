"use client";

import { useEffect, useState } from "react";

/** Live Dubai time, e.g. "21:04". Renders a placeholder until mounted. */
export function DubaiTime() {
  const [t, setT] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", hour: "2-digit", minute: "2-digit" });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{t ?? "--:--"}</span>;
}
