"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check for last used body part
    const lastUsed = localStorage.getItem("bodyCoach.lastBodyPart");
    
    if (lastUsed && ["knee", "achilles", "shoulder", "foot"].includes(lastUsed)) {
      // Check if that body part has a calibration profile
      const hasProfile = localStorage.getItem(`bodyCoach.${lastUsed}.calibration`);
      
      if (hasProfile) {
        router.replace(`/${lastUsed}`);
      } else {
        router.replace(`/${lastUsed}/calibrate`);
      }
    } else {
      // No last used body part, go to selection
      router.replace("/select");
    }
  }, [router]);

  return (
    <main style={{ 
      maxWidth: 560, 
      margin: "0 auto", 
      padding: 16, 
      fontFamily: "system-ui",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏃‍♂️</div>
        <div className="muted">Loading...</div>
      </div>
    </main>
  );
}
