import { streamText, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";
import type { ActionFunctionArgs } from "react-router";
import { SYSTEM } from "../lib/system";
import { getStatPack } from "../server/getStatPack";
import { computeDerived } from "../lib/computedDerived";

export const maxDuration = 30;

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  let fixtureId: string | undefined = url.searchParams.get("fixtureId") || undefined;
  let riskMode: "adventurous" | "balanced" | "conservative" | undefined = (url.searchParams.get("riskMode") as any) || undefined;
  let messages: any[] = [];


  try {
    const body = await request.json();
    if (!fixtureId && body?.fixtureId) fixtureId = body.fixtureId;
    if (!riskMode && body?.riskMode) riskMode = body.riskMode;
    if (Array.isArray(body?.messages)) messages = body.messages;
  } catch {
  }



  if (!fixtureId) {
    throw new Response("fixtureId missing", { status: 400 })
  }
  if (!riskMode) riskMode = "adventurous"
  const { stat_pack } = await getStatPack(fixtureId);
  const derived = computeDerived(stat_pack, riskMode)




  const result = streamText({
    model: openai("gpt-4o"),
    system: SYSTEM,
    messages: [
      { role: "system", content: `context:${JSON.stringify({ stat_pack, derived, risk_mode: riskMode })}` },
      ...convertToModelMessages(messages),
    ],
  });

  return result.toUIMessageStreamResponse();
}
