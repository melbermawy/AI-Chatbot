export function mapIds(fixId: string) {
  switch (fixId) {
    case "EPL-2025-10-03-ARS-MCI":
      return { sportKey: "soccer_epl", teamA: "Arsenal", teamB: "Manchester City" };
    case "EPL-2025-10-04-LIV-NEW":
      return { sportKey: "soccer_epl", teamA: "Liverpool", teamB: "Newcastle" };
    default:
      throw new Error(`No mapping for ${fixId}`);
  }
}

export function pickH2H(rows: any[], teamA: string, teamB: string) {
  // pick the first bookmaker that has h2h odds for both
  for (const book of rows) {
    const market = book.bookmakers?.[0]?.markets?.find((m: any) => m.key === "h2h");
    if (!market) continue;
    const outcomes = market.outcomes;
    const home = outcomes.find((o: any) => o.name === teamA);
    const away = outcomes.find((o: any) => o.name === teamB);
    const draw = outcomes.find((o: any) => o.name === "Draw");
    if (home && away && draw) {
      return {
        home: home.price,
        draw: draw.price,
        away: away.price,
        book: book.title
      };
    }
  }
  return null;
}