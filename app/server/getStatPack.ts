
import statPacks from "../data/stat_pack.json"
export async function getStatPack(fixtureId: string) {
  const arr = statPacks as any[];
  const id = decodeURIComponent(fixtureId);
  const pack = arr.find(f => f.fixtureId === id);
  if (!pack) {
    console.error("[getStatPack] not found:", id, "available:", arr.map(f=>f.fixtureId))
    throw new Response("fixture not found", { status: 404 });
  }
  return { stat_pack: pack, data_quality: "demo" } as const;
}