import "dotenv/config"

export async function fetchOdds(fixId: string) {
  const { sportKey, teamA, teamB } = mapIds(fixId)
  const url = `https://api.the-odds-api.com/v4/sports/${sportKey}/odds?apiKey=${process.env.ODDS_API_KEY}&regions=us&markets=h2h`
  const res = await fetch(
    url
  )
  const rows = await res.json()
  const market = pickH2H(rows, teamA, teamB)
  return { 
    home: market.home, 
    draw: market.draw, 
    away: market.away, 
    book: market.book 
  }
}