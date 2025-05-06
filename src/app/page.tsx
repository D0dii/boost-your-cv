import { JobApplicationManager } from "./_components/job-application-manager";

export default async function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 lg:p-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
            CV Match Analyzer
          </h1>
          <p className="mx-auto max-w-2xl text-gray-600">
            Upload your CV and enter a job description to see how well they
            match. Get personalized suggestions to improve your CV.
          </p>
        </div>
        <JobApplicationManager />
      </div>
    </main>
  );
}
