"use client";
import {
  generateMessageWithKnowledgeBase,
  generateMessageWithoutKnowledgeBase,
} from "@/lib/actions";

export default function Home() {
  const run = async () => {
    const input = "What is my favorite food?";
    const [result1, result2] = await Promise.all([
      generateMessageWithKnowledgeBase(input),
      generateMessageWithoutKnowledgeBase(input),
    ]);
    console.log(result1);
    console.log(result2);
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
