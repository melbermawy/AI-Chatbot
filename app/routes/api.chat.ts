import { streamText, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";
import type { ActionFunctionArgs } from "react-router";
import { SYSTEM } from "~/lib/system";
import { getStatPack } from "~/server/getStatPack";
import { computeDerived } from "~/lib/computedDerived";

export const maxDuration = 30;

export async function action({ request }: ActionFunctionArgs) {
  const { messages, fixtureId, riskMode = "adventurous" } = await request.json();

  const { stat_pack } = await getStatPack(fixtureId);
  const derived = computeDerived(stat_pack, riskMode);

  const result = streamText({
    model: openai("gpt-4o"),
    system: SYSTEM,
    messages: [
      { role: "system", content: `context:${JSON.stringify({ stat_pack, derived, risk_mode: riskMode })}` },
      ...convertToModelMessages(messages)
    ],
  });

  return result.toUIMessageStreamResponse();
}
