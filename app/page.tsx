"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { safeGet } from "@/lib/storage/safe-storage";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const lastUsed = safeGet<string | null>("bodyCoach.lastBodyPart", null);

    if (lastUsed && ["knee", "achilles", "shoulder", "foot"].includes(lastUsed)) {
      const hasProfile = safeGet(`bodyCoach.${lastUsed}.calibration`, null);

      if (hasProfile) {
        router.replace(`/${lastUsed}`);
      } else {
        router.replace(`/${lastUsed}/calibrate`);
      }
    } else {
      router.replace("/select");
    }
  }, [router]);

  return (
    <main className="max-w-[560px] mx-auto p-4 font-[system-ui] flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-5xl mb-4">🏃‍♂️</div>
        <div className="muted">Loading...</div>
      </div>
    </main>
  );
}
