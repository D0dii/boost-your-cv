import { JobApplicationManager } from "./_components/job-application-manager";

export default async function Home() {
  return (
    <main className="mt-14 flex flex-col items-center px-12 md:px-72">
      <h1 className="text-4xl font-semibold">Welcome to boost your cv</h1>
      <h2 className="mt-4 mb-24 text-xl">
        Please fill the job description and upload your cv and we will check
        what can be improved
      </h2>
      <JobApplicationManager />
    </main>
  );
}
