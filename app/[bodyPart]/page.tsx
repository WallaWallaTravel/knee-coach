"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { CheckInPage } from "@/app/components/checkin/CheckInPage";
import { type BodyPart } from "@/lib/body-parts/types";

const VALID_BODY_PARTS: BodyPart[] = ["knee", "achilles", "shoulder", "foot"];

export default function BodyPartPage({ params }: { params: Promise<{ bodyPart: string }> }) {
  const { bodyPart } = use(params);

  if (!VALID_BODY_PARTS.includes(bodyPart as BodyPart)) {
    notFound();
  }

  return <CheckInPage bodyPart={bodyPart as BodyPart} />;
}
