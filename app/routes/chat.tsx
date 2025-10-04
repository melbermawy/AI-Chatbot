import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import statPacks from "~/data/stat_pack.json";
import { computeDerived } from "~/lib/computedDerived";
import { Link } from "react-router"

export default function Chat() {
  const { fixtureId: fixtureIdParam } = useParams();
  const fixtureId = fixtureIdParam || ((Array.isArray(statPacks) && (statPacks as any[])[0]?.fixtureId) || "")


  type RiskMode = "adventurous" | "balanced" | "conservative";
  const [riskMode, setRiskMode] = useState<RiskMode>("adventurous");

  const transport = useMemo(() => new DefaultChatTransport({
    api: `/api/chat?fixtureId=${encodeURIComponent(fixtureId)}&riskMode=${riskMode}`,
  }), [fixtureId, riskMode]);


  const stat_pack = useMemo(() => {
    return (statPacks as any[]).find((f) => f.fixtureId === fixtureId);
  }, [fixtureId]);


  const derived = useMemo(() => {
    if (!stat_pack) return null;
    try {
      return computeDerived(stat_pack, riskMode);
    } catch {
      return null;
    }
  }, [stat_pack, riskMode]);


  const { messages, sendMessage, error } = useChat({ transport });

  const send = (text: string) => sendMessage({ text });


  const openedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!stat_pack) return;
    if (openedRef.current === fixtureId) return;
    openedRef.current = fixtureId;

    void send("first reply: concise pre-match opener (no JSON). include odds, implied %, our model %, edge %, EV/$100, stake %, and 2–3 stats.");
  }, [fixtureId, riskMode, stat_pack, send]);

  useEffect(() => {
  if (!stat_pack || !openedRef.current) return;
  void send(`risk mode set to ${riskMode}. give an updated moneyline recommendation in one short sentence (no JSON).`)
}, [riskMode])


  const kickoff = stat_pack?.kickoff_est || stat_pack?.kickoff_utc;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = (form.elements.namedItem("msg") as HTMLInputElement);
    const text = input.value.trim();
    if (!text) return;
    await send(text);
    input.value = "";
  };

  if (!stat_pack) {
    return (
      <div className="p-6 text-sm text-red-600">no fixture selected. navigate from the fixtures list (/).</div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto min-h-screen">

      {derived && (
        <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b p-3 text-sm flex items-center gap-4">
          <Link to="/fixtures">
          <button className="px-3 py-1 border rounded">← Back to Fixtures</button>
           </Link>
          <div className="font-semibold">{stat_pack.home} vs {stat_pack.away}</div>
          {kickoff && <div className="text-xs text-zinc-500">{new Date(kickoff).toLocaleString()}</div>}
          <div className="h-4 w-px bg-zinc-300" />
          <div>price: {derived.price_decimal.toFixed(2)}</div>
          <div>implied: {(derived.implied_prob * 100).toFixed(1)}%</div>
          <div>model: {(derived.model_prob * 100).toFixed(1)}%</div>
          <div>edge: {(derived.edge * 100).toFixed(1)}%</div>
          <div>EV/$100: {derived.EV_per_$100.toFixed(1)}</div>
          <div>stake: {(derived.suggested_stake_pct * 100).toFixed(2)}%</div>
          <div className="ml-auto flex gap-2">
            {(["conservative", "balanced", "adventurous"] as RiskMode[]).map((r) => (
              <button
                key={r}
                onClick={() => setRiskMode(r)}
                className={`px-2 py-1 border rounded ${riskMode === r ? "bg-black text-white dark:bg-white dark:text-black" : ""}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}


      <div className="flex-1 p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`whitespace-pre-wrap ${message.role === "user" ? "text-right" : ""}`}>
            <div className="text-xs uppercase tracking-wide text-zinc-500">{message.role}</div>
            {message.parts.map((part, i) => {
              if (part.type === "text") {
                    const text = part.text as string
                        if (message.role === "user" && text.startsWith("first reply:")) {
                        return null
                        }
                return <div key={`${message.id}-${i}`} className="text-sm">{part.text}</div>;
                
              }
              return null;
            })}
          </div>
        ))}
        {error && <div className="text-red-600 text-sm">{String(error)}</div>}
      </div>


      <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
        <button type="button" onClick={() => send("moneyline only. one-line pick with numbers (odds, implied %, our model %, edge %, EV/$100, stake %).")} className="border px-2 rounded">
          moneyline
        </button>
        <button type="button" onClick={() => send("totals only; pass if edge < 0. include implied %, our model %, edge %, EV/$100, stake %.")} className="border px-2 rounded">
          total
        </button>
        <button type="button" onClick={() => send("build a hedge for the current moneyline stance; give primary pick in one line plus a one-line hedge plan with rough stake split.")} className="border px-2 rounded">
          build hedge
        </button>
        <input
          name="msg"
          placeholder="ask…"
          className="flex-1 border rounded px-2 py-1 dark:bg-zinc-900"
          autoComplete="off"
        />
      </form>
    </div>
  );
}