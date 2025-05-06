import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { CvAnalyzeResult } from "@/types";
import { CheckCircle, AlertCircle } from "lucide-react";

export function MatchResults({ results }: { results: CvAnalyzeResult }) {
  const { matchPercentage, suggestions, strengths } = results;

  const getMatchColor = () => {
    if (matchPercentage >= 80) return "text-green-600";
    if (matchPercentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Analysis Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Match Score</h3>
            <span className={`text-lg font-bold ${getMatchColor()}`}>
              {matchPercentage}%
            </span>
          </div>
          <Progress value={matchPercentage} className="h-2" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle className="h-4 w-4 text-green-600" />
              CV Strengths
            </h3>
            <ul className="space-y-2">
              {strengths.map((strength, index) => (
                <li
                  key={index}
                  className="rounded-md border border-green-100 bg-green-50 p-3 text-sm"
                >
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-medium">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              Improvement Suggestions
            </h3>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="rounded-md border border-amber-100 bg-amber-50 p-3 text-sm"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
