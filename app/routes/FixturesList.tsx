import { Link } from "react-router";
import fixtures from "~/data/stat_pack.json";

export default function FixturesList() {
  return (
    <div className="grid gap-3 p-4">
      {(fixtures as any[]).map(fx => (
        <Link
          key={fx.fixtureId}
          to={`/chat/${fx.fixtureId}`}
          className="border p-3 rounded flex items-center gap-3"
        >
        <img src={fx.homeCrest} alt={fx.home} className="w-8 h-8" />
          <span className="font-medium">{fx.home}</span>
          <span className="mx-1">vs</span>
        <img src={fx.awayCrest} alt={fx.away} className="w-8 h-8" />
          <span className="font-medium">{fx.away}</span>

          <div className="ml-auto text-sm">
            {fx.odds_decimal.home.toFixed(2)} /{" "}
            {fx.odds_decimal.draw.toFixed(2)} /{" "}
            {fx.odds_decimal.away.toFixed(2)}
          </div>
        </Link>
      ))}
    </div>
  );
}