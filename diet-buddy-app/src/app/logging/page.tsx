import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function LoggingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8 md:ml-64">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Food Log</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track your daily food intake
          </p>
        </div>

        {/* Add Entry Button */}
        <div className="mb-8">
          <Button className="w-full md:w-auto">+ Add Entry</Button>
        </div>

        {/* Entries List */}
        <Card>
          <h2 className="text-xl font-semibold mb-6">Today's Entries</h2>

          {/* Placeholder entries */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex flex-col md:flex-row md:justify-between md:items-center p-4 bg-white/5 dark:bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-all duration-200"
              >
                <div className="flex-1 mb-4 md:mb-0">
                  <h3 className="font-semibold text-lg mb-2">Meal Name</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Placeholder description of food item
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">
                        Calories:
                      </span>
                      <span className="font-semibold ml-2">450 kcal</span>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">
                        Protein:
                      </span>
                      <span className="font-semibold ml-2">25g</span>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">
                        Carbs:
                      </span>
                      <span className="font-semibold ml-2">50g</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 md:ml-4">
                  <button className="text-sm px-3 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/20 transition-colors duration-200">
                    Edit
                  </button>
                  <button className="text-sm px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors duration-200">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state fallback */}
          <div className="text-center py-8 text-slate-600 dark:text-slate-400">
            <p>No entries yet. Add your first entry to get started!</p>
          </div>
        </Card>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-24 md:h-0" />
    </main>
  );
}
