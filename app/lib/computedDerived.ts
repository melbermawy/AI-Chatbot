import {
  impliedFromDecimal, formScore, shotSupremacy, chanceQualityDelta,
  naiveModelProb, anchoredProb, kelly, stakePct, type RiskMode
} from "./derived";

export type DerivedBlob = {
  market: "moneyline";
  pick: "home"|"away";
  book: string;
  price_decimal: number;
  implied_prob: number;
  model_prob: number;
  edge: number;
  EV_per_$100: number;
  suggested_stake_pct: number;
  risk_flag: "low"|"medium"|"high";
};

export function computeDerived(stat: any, riskMode: RiskMode): DerivedBlob {
  const m = stat.recent.home.w + stat.recent.home.d + stat.recent.home.l || 5;
  const implied_prob = impliedFromDecimal(stat.odds_decimal.home);
  const home_form = formScore(stat.recent.home.w, stat.recent.home.d, stat.recent.home.l);
  const away_form = formScore(stat.recent.away.w, stat.recent.away.d, stat.recent.away.l);
  const form_delta = home_form - away_form;

  const chance_home = (stat.recent.home.xg!=null && stat.recent.away.xga!=null)
    ? chanceQualityDelta(stat.recent.home.xg, stat.recent.away.xga, m) : 0;
  const chance_away = (stat.recent.away.xg!=null && stat.recent.home.xga!=null)
    ? chanceQualityDelta(stat.recent.away.xg, stat.recent.home.xga, m) : 0;
  const chance_delta = chance_home - chance_away;

  const shot_home = (stat.recent.home.sot_for!=null && stat.recent.home.sot_against!=null)
    ? shotSupremacy(stat.recent.home.sot_for, stat.recent.home.sot_against, m) : 0;
  const shot_away = (stat.recent.away.sot_for!=null && stat.recent.away.sot_against!=null)
    ? shotSupremacy(stat.recent.away.sot_for, stat.recent.away.sot_against, m) : 0;
  const shot_sup_delta = shot_home - shot_away;

  const pRaw = naiveModelProb({
    venue_home: !!stat.venue_home,
    form_delta, chance_delta, shot_sup_delta, injury_impact: 0
  });

  const model_prob = anchoredProb(pRaw, implied_prob, 0.35, 0.07);
  const price = stat.odds_decimal.home;
  const edge = model_prob - implied_prob;
  const EV_per_$100 = ((price - 1) * model_prob - (1 - model_prob)) * 100;
  const k = kelly(model_prob, price);
  const suggested_stake_pct = stakePct(k, riskMode);
  const risk_flag = suggested_stake_pct >= 0.02 ? "high" :
                    suggested_stake_pct >= 0.015 ? "medium" : "low";

  return {
    market: "moneyline",
    pick: "home",
    book: stat.odds_decimal.book,
    price_decimal: price,
    implied_prob,
    model_prob,
    edge,
    EV_per_$100,
    suggested_stake_pct,
    risk_flag
  };
}