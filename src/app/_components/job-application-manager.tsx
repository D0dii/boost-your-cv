"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { Label } from "@radix-ui/react-label";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import pdfToText from "react-pdftotext";
import { z } from "zod";
import type { CvAnalyzeResult } from "@/types";
import { MatchResults } from "./match-results";
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const aiResponseSchema = z.object({
  matchPercentage: z.preprocess((val) => Number(val), z.number()),
  suggestions: z.array(z.string()),
  strengths: z.array(z.string()),
});

export function JobApplicationManager() {
  const [cv, setCv] = useState<File | null>(null);
  const [result, setResult] = useState<CvAnalyzeResult | null>(null);
  const [chatError, setChatError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const checkCv = api.ai.check.useMutation();
  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (cv) {
      setIsLoading(true);
      setChatError("");
      const jobDescription = formData.get("job-description") as string;
      const cvText = await pdfToText(cv);
      const response = await checkCv.mutateAsync({
        jobDescription: jobDescription,
        cvText: cvText,
      });
      if (!response.isSuccess || response.data === null) {
        setChatError(
          "Something went wrong during generating response please try again",
        );
        setIsLoading(false);
        return;
      }
      const parsedResponse = aiResponseSchema.safeParse(
        JSON.parse(response.data.choices[0]?.message.content ?? ""),
      );
      if (parsedResponse.success) {
        setResult({ ...parsedResponse.data });
      } else {
        setChatError(
          "Something went wrong during generating response please try again",
        );
      }
      setIsLoading(false);
    }
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCv(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={submitForm} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="cv-upload"
                  className="mb-2 block text-sm font-medium"
                >
                  Upload your CV
                </label>
                <Input
                  disabled={isLoading}
                  ref={fileInputRef}
                  id="cv-upload"
                  name="cv-upload"
                  type="file"
                  required
                  onChange={handleFileChange}
                  accept="application/pdf"
                />
                {cv && (
                  <div
                    className="mt-2 flex items-center gap-1 text-sm text-green-600"
                    role="status"
                  >
                    <CheckCircle className="h-4 w-4" aria-hidden="true" />
                    <span>{`File ${cv.name} selected successfully`}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="job-description">Job Description</Label>
                <Textarea
                  disabled={isLoading}
                  id="job-description"
                  name="job-description"
                  placeholder="Paste your job description"
                  className="max-h-[400px] min-h-[200px]"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <>Analyzing your CV</> : <>Analyze Match</>}
        </Button>
      </form>
      {chatError ? <span className="text-red-400">{chatError}</span> : null}

      {result !== null ? <MatchResults results={result} /> : null}
    </div>
  );
}
