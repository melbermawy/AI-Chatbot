import { streamText, convertToModelMessages } from "ai";
import type { UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import type { ActionFunctionArgs } from "react-router";
import "dotenv/config";

export const maxDuration = 30;

export async function action({ request }: ActionFunctionArgs) { 
  const { messages }: { messages: UIMessage[] } = await request.json()
  const result = streamText({
    model: openai("gpt-4o"),
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse()
}
