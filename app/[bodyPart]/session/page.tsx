"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { SessionPageComponent } from "@/app/components/SessionPage";
import { type BodyPart } from "@/lib/body-parts/types";

const VALID_BODY_PARTS: BodyPart[] = ["knee", "achilles", "shoulder", "foot"];

export default function BodyPartSessionPage({ params }: { params: Promise<{ bodyPart: string }> }) {
  const { bodyPart } = use(params);

  if (!VALID_BODY_PARTS.includes(bodyPart as BodyPart)) {
    notFound();
  }

  return <SessionPageComponent bodyPart={bodyPart as BodyPart} />;
}
