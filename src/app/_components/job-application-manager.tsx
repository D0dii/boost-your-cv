"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { useRef, useState, type ChangeEvent } from "react";
import pdfToText from "react-pdftotext";

export function JobApplicationManager() {
  const [cv, setCv] = useState<File | null>(null);
  const [cvInvalidFormatError, setCvInvalidFormatError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const submitForm = async (formData: FormData) => {
    if (cv) {
      console.log(formData.get("job-description"));
      const cvText = await pdfToText(cv);
      console.log(cvText);
    }
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type === "application/pdf") {
      setCvInvalidFormatError("");
      setCv(file);
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setCv(null);
      setCvInvalidFormatError("Please upload pdf file");
    }
  };
  return (
    <form className="flex flex-col items-center gap-4" action={submitForm}>
      <div className="flex w-full flex-col gap-1">
        <Label htmlFor="job-description">Job Description</Label>
        <Textarea
          id="job-description"
          name="job-description"
          placeholder="Paste your job description"
          className="max-h-[300px] max-w-[350px]"
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="picture">Your CV</Label>
        <Input
          ref={fileInputRef}
          id="picture"
          name="picture"
          type="file"
          required
          onChange={handleFileChange}
          accept="application/pdf"
        />
        {cvInvalidFormatError ? (
          <p className="text-sm text-red-400">{cvInvalidFormatError}</p>
        ) : null}
      </div>
      <Button type="submit" className="w-[150px]">
        Submit
      </Button>
    </form>
  );
}
