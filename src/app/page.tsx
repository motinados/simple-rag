"use client";
import { generateMessage } from "@/lib/actions";

export default function Home() {
  const run = async () => {
    const result = await generateMessage("What is my favorite food?");
    console.log(result);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button
        onClick={run}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Run
      </button>
    </main>
  );
}
