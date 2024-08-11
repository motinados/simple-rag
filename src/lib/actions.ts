"use server";

import { openai } from "@ai-sdk/openai";
import { cosineSimilarity, embedMany, generateText } from "ai";

type Embedding = {
  content: string;
  embedding: number[];
};

const embeddingModel = openai.embedding("text-embedding-ada-002");

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split("\n")
    .filter((i) => i !== "");
};

export const generateEmbeddings = async (value: string) => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });

  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

const resource = `My favorite food is sushi.
My hobby is reading.
I often go hiking on weekends.
My favorite movie is "Spirited Away."
I like jazz music.
I enjoy traveling with my family.
I have fun chatting with friends at cafes.
I love finding new restaurants.
I go jogging every morning.
`;

export const findRelevantContent = async (input: string, resource: string) => {
  const embeddingsFromInput = await generateEmbeddings(input);
  const embeddingsFromSample = await generateEmbeddings(resource);

  const topSimilarEmbeddings = await findTopSimilarEmbeddings(
    embeddingsFromInput[0],
    embeddingsFromSample
  );

  return topSimilarEmbeddings;
};

export const findTopSimilarEmbeddings = async (
  targetEmbeddings: Embedding,
  embeddingsList: Embedding[],
  top = 3
) => {
  const similarities = embeddingsList.map((e) => ({
    content: e.content,
    similarity: cosineSimilarity(targetEmbeddings.embedding, e.embedding),
  }));

  similarities.sort((a, b) => b.similarity - a.similarity);

  return similarities.slice(0, top);
};

export const generateTextWithRAG = async (input: string) => {
  const topSimilarEmbeddings = await findRelevantContent(input, resource);

  const { text } = await generateText({
    model: openai("gpt-4o"),
    messages: [
      {
        role: "system",
        content:
          "Respond to the user's prompt using only the provided context.",
      },
      { role: "user", content: input },
      {
        role: "system",
        content: `Here are some relevant information about the user:
         ${topSimilarEmbeddings.map((e) => e.content).join("\n")}`,
      },
    ],
  });

  return text;
};

export const generateTextWithoutRAG = async (input: string) => {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    messages: [
      { role: "user", content: input },
      {
        role: "system",
        content: `Here are some relevant information about the user:
      ${resource}
      `,
      },
    ],
  });

  return text;
};
