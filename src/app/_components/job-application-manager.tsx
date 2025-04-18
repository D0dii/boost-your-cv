"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { Label } from "@radix-ui/react-label";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import pdfToText from "react-pdftotext";
import { z } from "zod";
import { CircleSmall } from "lucide-react";

const aiResponseSchema = z.object({
  match: z.string(),
  suggestions: z.array(z.string()),
});

export function JobApplicationManager() {
  const [cv, setCv] = useState<File | null>(null);
  const [cvInvalidFormatError, setCvInvalidFormatError] = useState("");
  const [match, setMatch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
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
        setMatch(parsedResponse.data.match);
        setSuggestions(parsedResponse.data.suggestions);
      } else {
        setChatError(
          "Something went wrong during generating response please try again",
        );
      }
      setIsLoading(false);
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
    <div className="flex flex-col items-center">
      {match ? (
        <h2 className="mb-2 text-3xl font-bold">Your match is {match}</h2>
      ) : null}
      {suggestions.length > 0 ? (
        <div className="flex flex-col">
          <h3 className="mb-2 text-2xl font-semibold">Suggestions:</h3>
          <div className="flex flex-col gap-2">
            {suggestions.map((suggestion) => (
              <div key={suggestion} className="flex items-center gap-2">
                <CircleSmall />
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <form
        className="mt-4 flex max-w-[400px] flex-col items-center gap-4"
        onSubmit={submitForm}
      >
        {isLoading ? <div>loading</div> : null}
        <div className="grid w-full gap-1.5">
          <Label htmlFor="job-description">Job Description</Label>
          <Textarea
            disabled={isLoading}
            id="job-description"
            name="job-description"
            placeholder="Paste your job description"
            className="max-h-[300px]"
            required
          />
        </div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="picture">Your CV</Label>
          <Input
            disabled={isLoading}
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
        <Button type="submit" disabled={isLoading} className="w-[150px]">
          Submit
        </Button>
        {chatError ? <span className="text-red-400">{chatError}</span> : null}
      </form>
    </div>
  );
}
