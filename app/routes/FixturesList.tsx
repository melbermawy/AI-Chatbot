import { Link } from "react-router";
import fixtures from "~/data/stat_pack.json";

export default function FixturesList() {
  const games = fixtures as any[];
  return (
    <div className="min-h-screen bg-gray-200 text-gray-50 selection:bg-teal-600/30">

      <header className="mx-auto max-w-4xl px-6 pt-10 pb-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          <span className="bg--400 text-gray-700 bg-clip-text">
            Winners or Quitters
          </span>
        </h1>
        <p className="mt-3 text-zinc-400 text-base">
          THIS IS NOT A FINANCIAL ADVICE
        </p>
        <div className="mt-6 flex items-center justify-center">
          <div className="h-px w-24 bg-gray-800" />
          <span className="mx-3 text-md uppercase tracking-wider text-zinc-500">fixtures</span>
          <div className="h-px w-24 bg-gray-800" />
        </div>
      </header>


      <main className="mx-auto max-w-4xl px-6 pb-12">
        <div className="space-y-4">
          {games.map((fx) => (
            <Link
              key={fx.fixtureId}
              to={`/chat/${fx.fixtureId}`}
              className="block rounded-2xl border border-zinc-800 bg-gray-300 backdrop-blur-sm shadow-sm hover:shadow-violet-300 hover:border-violet-400 transition-all hover:-translate-y-0.5"
            >
              <div className="p-3.5">

                <div className="grid grid-cols-3 items-center text-center gap-3">

                  <div className="flex flex-col items-center gap-1.5">
                    <img src={fx.homeCrest} alt={fx.home} className="w-12 h-12" />
                    <div className="text-base font-semibold">{fx.home}</div>
                    <div className="text-sm text-gray-600">{fx.odds_decimal.home.toFixed(2)}</div>
                  </div>


                  <div className="flex flex-col items-center gap-1.5">
                    <div className="text-[10px] uppercase tracking-wider text-gray-500">vs</div>
                    <div className="text-sm text-gray-600">{fx.odds_decimal.draw.toFixed(2)}</div>
                  </div>


                  <div className="flex flex-col items-center gap-1.5">
                    <img src={fx.awayCrest} alt={fx.away} className="w-12 h-12" />
                    <div className="text-base font-semibold">{fx.away}</div>
                    <div className="text-sm text-gray-600">{fx.odds_decimal.away.toFixed(2)}</div>
                  </div>
                </div>


                {(fx.league || fx.kickoff_est || fx.kickoff_utc) && (
                  <div className="text-sm text-zinc-100 flex items-center justify-center gap-2">
                    {fx.league && (
                      <span className="rounded-md bg-gray-700 px-2 py-0.5 border border-zinc-700/60">{fx.league}</span>
                    )}
                    {(fx.kickoff_est || fx.kickoff_utc) && (
                      <span>{new Date(fx.kickoff_est || fx.kickoff_utc).toLocaleString()}</span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}