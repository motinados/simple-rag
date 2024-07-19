"use client";
import { generateTextWithRAG, generateTextWithoutRAG } from "@/lib/actions";
import { useState } from "react";

export default function Home() {
  const [resultWithRAG, setResultWithRAG] = useState("");
  const [resultWithoutRAG, setResultWithoutRAG] = useState("");

  const run = async () => {
    setResultWithRAG("Loading...");
    setResultWithoutRAG("Loading...");

    const input = "What is my favorite food?";
    const [result1, result2] = await Promise.all([
      generateTextWithRAG(input),
      generateTextWithoutRAG(input),
    ]);

    setResultWithRAG(result1);
    setResultWithoutRAG(result2);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button
        onClick={run}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Run
      </button>
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold">With RAG</h2>
        <p className="text-gray-500">{resultWithRAG}</p>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold">Without RAG</h2>
        <p className="text-gray-500">{resultWithoutRAG}</p>
      </div>
    </main>
  );
}
