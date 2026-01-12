import { Card } from "@/components/ui/Card";

export default function DashboardPage() {
  const statCards = [
    { label: "Today's Calories", value: "2,450", unit: "kcal" },
    { label: "Protein", value: "120", unit: "g" },
    { label: "Carbs", value: "250", unit: "g" },
    { label: "Fat", value: "80", unit: "g" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8 md:ml-64">
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Your daily nutrition summary
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="flex flex-col justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{stat.value}</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.unit}
                </span>
              </div>
              <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                  style={{ width: "65%" }}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Entries Placeholder */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex justify-between items-center p-3 bg-white/5 dark:bg-white/5 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">Breakfast</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    8:30 AM
                  </p>
                </div>
                <span className="font-semibold text-blue-500">350 kcal</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-24 md:h-0" />
    </main>
  );
}
