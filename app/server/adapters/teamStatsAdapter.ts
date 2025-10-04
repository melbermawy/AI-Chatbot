import { mapIds } from "./idMap.ts"

export type Recent = { w: number; d: number; l: number; gf: number; ga: number }

async function fetchTeamRecentFD(teamId: number, compCode: string, fromISO: string, toISO: string): Promise<Recent | null> {
  const url = `https://api.football-data.org/v4/teams/${teamId}/matches?dateFrom=${fromISO}&dateTo=${toISO}&status=FINISHED&competitions=${compCode}`
  const r = await fetch(url, { headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_TOKEN! } })
  if (!r.ok) return null;
  const data = await r.json();
  const matches: any[] = Array.isArray(data.matches) ? data.matches : [];
  if (matches.length === 0) return { w: 0, d: 0, l: 0, gf: 0, ga: 0 };
  // take last 5 finished matches (already filtered), safest to slice from end
  const last5 = matches.slice(-5);
  let w = 0, d = 0, l = 0, gf = 0, ga = 0;
  for (const m of last5) {
    const isHome = m.homeTeam?.id === teamId;
    const f = isHome ? m.score?.fullTime?.home ?? 0 : m.score?.fullTime?.away ?? 0;
    const a = isHome ? m.score?.fullTime?.away ?? 0 : m.score?.fullTime?.home ?? 0;
    gf += f; ga += a;
    if (f > a) w++; else if (f === a) d++; else l++;
  }
  return { w, d, l, gf, ga };
}

export async function fetchTeamStats(fixId: string) {
  const ids = mapIds(fixId); // { compCode, homeId, awayId }
  const to = new Date();
  const from = new Date(to.getTime() - 60 * 24 * 3600 * 1000); // ~last 60 days
  const toISO = to.toISOString().slice(0, 10);
  const fromISO = from.toISOString().slice(0, 10);

  const [homeRecent, awayRecent] = await Promise.all([
    fetchTeamRecentFD(ids.homeId, ids.compCode, fromISO, toISO),
    fetchTeamRecentFD(ids.awayId, ids.compCode, fromISO, toISO)
  ]);

  return {
    recent: {
      home: homeRecent ?? { w: 0, d: 0, l: 0, gf: 0, ga: 0 },
      away: awayRecent ?? { w: 0, d: 0, l: 0, gf: 0, ga: 0 }
    }
  };
}
