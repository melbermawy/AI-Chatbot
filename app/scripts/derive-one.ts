// GPT sanity check for the math:

import fs from "fs";
import path from "path";
import {
  impliedFromDecimal, formScore, shotSupremacy, chanceQualityDelta,
  naiveModelProb,  anchoredProb, kelly, stakePct
} from "../lib/derived";

const fixturesPath = path.resolve("app/data/fixtures.demo.json")
const data = JSON.parse(fs.readFileSync(fixturesPath, "utf8"))
const fx = data[0]
const matches = fx.recent.home.w + fx.recent.home.d + fx.recent.home.l



const implied_prob = impliedFromDecimal(fx.odds_decimal.home)

const home_form = formScore(fx.recent.home.w, fx.recent.home.d, fx.recent.home.l)

const away_form = formScore(fx.recent.away.w, fx.recent.away.d, fx.recent.away.l)

const form_delta = home_form - away_form


const chance_home = (fx.recent.home.xg != null && fx.recent.away.xga != null)
  ? chanceQualityDelta(fx.recent.home.xg, fx.recent.away.xga, matches) : 0;


const chance_away = (fx.recent.away.xg != null && fx.recent.home.xga != null)
  ? chanceQualityDelta(fx.recent.away.xg, fx.recent.home.xga, matches) : 0;


const chance_delta = chance_home - chance_away;

const shot_home = (fx.recent.home.sot_for != null && fx.recent.home.sot_against != null)
  ? shotSupremacy(fx.recent.home.sot_for, fx.recent.home.sot_against, matches) : 0

const shot_away = (fx.recent.away.sot_for != null && fx.recent.away.sot_against != null)
  ? shotSupremacy(fx.recent.away.sot_for, fx.recent.away.sot_against, matches) : 0

const shot_sup_delta = shot_home - shot_away

const injury_impact = 0

const pRaw = naiveModelProb({
  venue_home: fx.venue_home,
  form_delta,
  chance_delta,
  shot_sup_delta,
  injury_impact
})

const model_prob = anchoredProb(pRaw, implied_prob, 0.35, 0.07)

const price = fx.odds_decimal.home

const edge = model_prob - implied_prob

const EV_per_$100 = ((price - 1) * model_prob - (1 - model_prob)) * 100

const k = kelly(model_prob, price)

const suggested_stake_pct = stakePct(k, "adventurous")

const risk_flag = suggested_stake_pct >= 0.02 ? "high"
  : suggested_stake_pct >= 0.015 ? "medium" : "low";

const blob = {
  market: "moneyline",
  pick: "home",
  book: fx.odds_decimal.book,
  price_decimal: price,
  implied_prob,
  model_prob,
  edge,
  EV_per_$100,
  suggested_stake_pct,
  risk_flag,
  shot_supremacy_home: shot_home
};

console.log(JSON.stringify(blob, null, 2))