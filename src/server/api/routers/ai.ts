import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { env } from "@/env";

export const aiRouter = createTRPCRouter({
  check: publicProcedure
    .input(z.object({ jobDescription: z.string(), cvText: z.string() }))
    .mutation(async ({ input }) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const response = await fetch(env.API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: `You are an AI assistant that evaluates how well a CV matches a job description.
          
          Your task is to:
          1. Analyze the JOB DESCRIPTION and the CV.
          2. Provide a MATCH SCORE as a percentage (%) that reflects how closely the CV aligns with the job.
          3. Offer 2–5 SHORT SUGGESTIONS to improve the CV or highlight missing qualifications.
          4. Say a few CV strengths to make user feel better.
          
          Return your response STRICTLY in the following JSON format:
          {
            "matchPercentage": "XX",
            "suggestions": ["Suggestion 1", "Suggestion 2", "..."]
            "strengths": ["Strength 1", "Strength 2", "..."]
          }
          
          Ensure suggestions are specific, actionable, and written in a helpful tone. Do not explain the result, only return the JSON.
          
          JOB DESCRIPTION:
          ${input.jobDescription}
          
          CV:
          ${input.cvText}`,
              },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as unknown;
        return { isSuccess: true, data };
      } catch (error) {
        console.error("AI API error:", error);
        return {
          isSuccess: false,
          data: null,
        };
      }
    }),
});
