export type RiskMode = "adventurous" | "balanced" | "conservative"

function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x))
}

// decimal odds to probability and a guard against non positive odds
export function impliedFromDecimal(odds: number): number {
  return 1 / odds;
}


// exponential moving average to model momentum (more recent weighs more and more)
export function ewma(nums: number[], alpha: number): number {
  if (!nums || nums.length === 0) return 0
  let single = nums[0]
  for (let i = 1; i < nums.length; i++) {
    single = alpha * nums[i] + (1 - alpha) * single
  }
  return single
}

// quantifying form to fraction
export function formScore(win: number, draw: number, loss: number): number {
  const games = win + draw + loss
  if (games === 0) return 0.5
  return (win + 0.5 * draw) / games
}

// delta for over/under
export function finishingDelta(gf: number, xg: number, matches: number): number {
  if (matches === 0) return 0
  return (gf - xg) / matches
}



// chance quality: team vs opponent
export function chanceQualityDelta(xg: number, oppXga: number, matches: number): number {
  if (matches === 0) return 0
  return (xg - oppXga) / matches
}


// shots on target (danger in the final third)
export function shotSupremacy(shotFor: number, shotAgainst: number, matches: number): number {
  if (matches === 0) return 0
  return (shotFor - shotAgainst) / matches
}


// EWMA of recent goal differences
export function momentum(goalDiffs: number[]): number {
  if (!goalDiffs || goalDiffs.length === 0) return 0
  return ewma(goalDiffs, 0.6)
}

// a model probability
export function naiveModelProb(args: {
  venue_home: boolean
  form_delta: number
  chance_delta: number
  shot_sup_delta: number
  injury_impact: number
}): number {
  const base = 0.5
  const homeAdv = args.venue_home ? 0.02 : 0
  const probability = base
    + homeAdv
    + 0.03 * args.form_delta
    + 0.015 * args.chance_delta
    + 0.0075 * args.shot_sup_delta
    + args.injury_impact;
  return clamp(probability, 0.01, 0.99)
}

export function anchoredProb(pRaw: number, implied: number, beta: number, edgeCap: number = 0.07): number {
  const anchored = implied + beta * (pRaw - implied)
  const edge = clamp(anchored - implied, -edgeCap, edgeCap)
  return implied + edge
}


// kelly fraction for decimal odds
export function kelly(modelProb: number, priceDecimal: number): number {
  const base = priceDecimal - 1
  if (base === 0) return 0
  return (base * modelProb - (1 - modelProb)) / base
}

// translating kelly fraction to a stake (PEAK)
export function stakePct(
  kellyFrac: number,
  risk: RiskMode
): number {
  const caps = { adventurous: 0.02, balanced: 0.01, conservative: 0.005 } as const
  const mult = { adventurous: 1.0, balanced: 0.7, conservative: 0.5 } as const
  const k = Math.max(0, kellyFrac) * mult[risk];
  return Math.min(k, caps[risk]);
}