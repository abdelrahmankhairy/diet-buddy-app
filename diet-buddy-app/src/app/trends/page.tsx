import { Card } from "@/components/ui/Card";

export default function TrendsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8 md:ml-64">
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Trends</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Visualize your nutrition progress over time
          </p>
        </div>

        {/* Chart Containers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Calories Chart Placeholder */}
          <Card className="flex flex-col">
            <h2 className="text-xl font-semibold mb-6">Calorie Intake Trend</h2>
            <div className="flex-1 flex items-center justify-center min-h-64 bg-white/5 dark:bg-white/5 rounded-lg border border-white/10">
              <div className="text-center text-slate-600 dark:text-slate-400">
                <p className="text-lg">📊</p>
                <p className="mt-2">Chart placeholder</p>
                <p className="text-sm">Add data to see trends</p>
              </div>
            </div>
          </Card>

          {/* Macros Chart Placeholder */}
          <Card className="flex flex-col">
            <h2 className="text-xl font-semibold mb-6">Macro Distribution</h2>
            <div className="flex-1 flex items-center justify-center min-h-64 bg-white/5 dark:bg-white/5 rounded-lg border border-white/10">
              <div className="text-center text-slate-600 dark:text-slate-400">
                <p className="text-lg">🥧</p>
                <p className="mt-2">Chart placeholder</p>
                <p className="text-sm">Add data to see distribution</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Weight Trend */}
        <Card>
          <h2 className="text-xl font-semibold mb-6">Weight Progress</h2>
          <div className="flex items-center justify-center min-h-64 bg-white/5 dark:bg-white/5 rounded-lg border border-white/10">
            <div className="text-center text-slate-600 dark:text-slate-400">
              <p className="text-lg">📈</p>
              <p className="mt-2">Chart placeholder</p>
              <p className="text-sm">Log weights to track progress</p>
            </div>
          </div>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Average Daily Calories
            </p>
            <p className="text-2xl font-bold">2,380</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Last 7 days
            </p>
          </Card>
          <Card>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Current Streak
            </p>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              days logged
            </p>
          </Card>
          <Card>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Total Entries
            </p>
            <p className="text-2xl font-bold">156</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              all time
            </p>
          </Card>
        </div>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-24 md:h-0" />
    </main>
  );
}
