"use client";

import { useState } from "react";

export function JobApplicationManager() {
  const [jobDescription, setJobDescription] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  return <div>dawaj cv</div>;
}
