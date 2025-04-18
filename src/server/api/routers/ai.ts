import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { OpenAI } from "openai";
import { env } from "@/env";

const client = new OpenAI({ apiKey: env.API_KEY });

export const aiRouter = createTRPCRouter({
  check: publicProcedure
    .input(z.object({ jobDescription: z.string(), cvText: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const response = await client.chat.completions.create({
          model: "o3-mini",
          messages: [
            {
              role: "user",
              content: `You are an AI assistant that evaluates how well a CV matches a job description.
          
          Your task is to:
          1. Analyze the JOB DESCRIPTION and the CV.
          2. Provide a MATCH SCORE as a percentage (%) that reflects how closely the CV aligns with the job.
          3. Offer 2–5 SHORT SUGGESTIONS to improve the CV or highlight missing qualifications.
          
          Return your response STRICTLY in the following JSON format:
          {
            "match": "XX%",
            "suggestions": ["Suggestion 1", "Suggestion 2", "..."]
          }
          
          Ensure suggestions are specific, actionable, and written in a helpful tone. Do not explain the result, only return the JSON.
          
          JOB DESCRIPTION:
          ${input.jobDescription}
          
          CV:
          ${input.cvText}`,
            },
          ],
        });
        return { isSuccess: true, data: response };
      } catch (error) {
        return {
          isSuccess: false,
          data: null,
        };
      }
    }),
});
