import React, { useState } from "react";
import {
  Flame,
  ChevronDown,
  Beef,
  Wheat,
  Droplet,
  ChevronUp,
  XCircle,
} from "lucide-react";

export default function DietDashboard({ diet }) {
  const [data, setData] = useState(diet || null);
  const [isFetching, setIsFetching] = useState(false);
  const [expandedMeal, setExpandedMeal] = useState(0);
  const [codeInput, setCodeInput] = useState("");

  const params = new URLSearchParams(window.location.search);
  const purchased = params.get("purchased") === "true";

  const MICRONUTRIENT_GOALS = {
    Magnesium: 400, // mg
    Calcium: 1000, // mg
    Iron: 18, // mg
    Potassium: 3400, // mg
    "Vitamin C": 90, // mg
    "Vitamin D": 20, // mcg
    "Vitamin A": 900, // mcg
    "Vitamin K": 120, // mcg
    Zinc: 11, // mg
  };

  const fetchDietByCode = async () => {
    if (!codeInput) return;
    setIsFetching(true);
    try {
      const response = await fetch(
        `https://api.get-my-diet.com/api/generate/fetch?code=${codeInput.trim()}`,
        { method: "GET" },
      );
      if (!response.ok) {
        alert("Invalid code or diet not found.");
        setIsFetching(false);
        return;
      }
      const result = await response.json();
      setData(result.diet);
      localStorage.setItem("Diet", JSON.stringify(result.diet));
    } catch (err) {
      console.error("Failed to fetch diet:", err);
      alert("Network error. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  // Enhanced helper to track Macros + Micros
  function calculateTotalNutrition(mealsArray) {
    const totals = {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      micros: {}, // To store dynamic micros like Iron, Magnesium, etc.
    };

    if (!mealsArray) return totals;

    mealsArray.forEach((meal) => {
      totals.calories += Number(meal.calories || 0);
      meal.ingredients?.forEach((ing) => {
        ing.nutrition?.nutrients?.forEach((n) => {
          if (n.name === "Protein") totals.protein += n.amount;
          else if (n.name === "Carbohydrates") totals.carbohydrates += n.amount;
          else if (n.name === "Fat") totals.fat += n.amount;
          else if (n.name !== "Calories") {
            // It's a micronutrient
            if (!totals.micros[n.name]) {
              totals.micros[n.name] = { amount: 0, unit: n.unit };
            }
            totals.micros[n.name].amount += n.amount;
          }
        });
      });
    });
    return totals;
  }

  const meals = data?.generated?.meals || [];
  const nutrition = calculateTotalNutrition(meals);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7BF1A8] to-[#F3F4F6] flex flex-col items-center">
      {!data ? (
        <div className="flex-1 flex items-center justify-center w-full px-8">
          <div className="w-full max-w-xl bg-white p-12 md:p-16 rounded-[40px] shadow-2xl space-y-10 text-center border border-white/50">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Load Your Plan
            </h2>
            {purchased && (
              <p className="text-gray-500 text-lg">
                Please check your email and enter the code you received. It may
                take a minute or two for your diet plan to be generated.
              </p>
            )}
            <div className="space-y-6">
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="CODE"
                className="w-full border-2 border-gray-100 rounded-[24px] px-8 py-6 text-center text-2xl font-mono focus:ring-4 focus:ring-[#7BF1A8]/30 outline-none transition-all"
              />
              <button
                onClick={fetchDietByCode}
                disabled={isFetching}
                className="w-full py-6 rounded-[24px] font-black text-xl bg-[#7BF1A8] text-white shadow-xl disabled:bg-gray-200"
              >
                {isFetching ? "Validating..." : "Search"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[1400px] py-16 px-8 space-y-12">
          {/* HEADER */}
          <header className="flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tight">
                Nutrition Overview
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  localStorage.removeItem("Diet");
                  window.location.href = "http://get-my-diet.com/";
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#7BF1A8] hover:bg-[#4ec981] text-white font-bold text-xs uppercase tracking-[0.15em] rounded-full shadow-sm transition-all active:scale-95"
              >
                Generate New Plan
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("Diet");
                  setData(null);
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-white/50 hover:bg-white text-gray-600 hover:text-red-500 font-bold text-xs uppercase tracking-[0.15em] rounded-full border border-white/60 shadow-sm transition-all active:scale-95 group"
              >
                <XCircle
                  size={16}
                  className="text-gray-400 group-hover:text-red-500 transition-colors"
                />
                Change Code
              </button>
            </div>
          </header>

          {/* BIGGER TOP CARDS */}
          <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-[40px] shadow-2xl p-12 flex flex-col items-center justify-center border-b-8 border-[#7BF1A8]">
              <Flame fill="#7BF1A8" size={56} className="text-[#7BF1A8] mb-4" />
              <div className="text-7xl font-black text-gray-900">
                {nutrition.calories.toFixed(0)}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-[0.3em] font-black mt-2">
                Calories
              </div>
            </div>
            <MacroCard
              label="Protein"
              value={nutrition.protein}
              color="text-red-400"
              icon={
                <Beef
                  size={42}
                  strokeWidth={2.5}
                  color="#ffa2a2"
                  fill="#fb2c36"
                />
              }
            />
            <MacroCard
              label="Carbs"
              value={nutrition.carbohydrates}
              color="text-yellow-500" // Darkened slightly for better visibility
              icon={
                <Wheat
                  size={42}
                  strokeWidth={2.5}
                  color="#d08700"
                  fill="#efb100"
                />
              }
            />
            <MacroCard
              label="Fats"
              value={nutrition.fat}
              color="text-[#ffdf20]" // Using your brand green
              icon={
                <Droplet
                  size={42}
                  strokeWidth={2.5}
                  color="#ffdf20"
                  fill="#ffdf20"
                />
              }
            />
          </section>

          {/* SPLIT VIEW: MEALS (LEFT) & MICROS (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* MEALS LIST - MOVED LEFT */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-8">
                Daily Meals
              </h2>
              {meals.map((meal, index) => (
                <div
                  key={index}
                  className="bg-white rounded-[32px] shadow-lg border border-white/40 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedMeal(expandedMeal === index ? null : index)
                    }
                    className="w-full px-10 py-8 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="text-left">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {meal.name}
                      </h3>
                      <span className="inline-block mt-2 text-xs font-black text-[#4ec981] bg-[#7BF1A8]/10 px-3 py-1 rounded-full uppercase">
                        {meal.calories} kcal
                      </span>
                    </div>
                    {expandedMeal === index ? (
                      <ChevronUp size={32} />
                    ) : (
                      <ChevronDown size={32} />
                    )}
                  </button>
                  {expandedMeal === index && (
                    <div className="px-10 pb-10 border-t border-gray-50 pt-8 animate-in fade-in duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-[0.2em]">
                            Ingredients
                          </h4>
                          <ul className="space-y-2">
                            {meal.ingredients?.map((ing, i) => (
                              <li
                                key={i}
                                className="flex justify-between p-3 bg-gray-50 rounded-xl"
                              >
                                <span className="font-bold text-gray-700">
                                  {ing.name}
                                </span>
                                <span className="font-mono text-gray-400">
                                  {ing.amount_g}g
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-[#7BF1A8]/5 p-6 rounded-[24px] border border-[#7BF1A8]/10">
                          <h4 className="text-[10px] font-black uppercase text-[#4ec981] mb-2 tracking-[0.2em]">
                            Prep
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {meal.howToMake}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* MICRONUTRIENTS SIDEBAR - NEW PART */}
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-8">
                Daily Micros
              </h2>
              <div className="bg-white rounded-[40px] shadow-2xl p-10 border border-white/60 sticky top-8">
                <div className="space-y-6">
                  {Object.entries(nutrition.micros).map(([name, data], i) => {
                    // Get the goal for this specific nutrient, default to 100 if unknown
                    const goal = MICRONUTRIENT_GOALS[name] || 100;
                    const percentage = Math.min(
                      (data.amount / goal) * 100,
                      100,
                    );

                    return (
                      <div key={i} className="group">
                        <div className="flex justify-between items-end mb-2">
                          <div>
                            <span className="text-sm font-bold text-gray-900 block">
                              {name}
                            </span>
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                              Goal: {goal}
                              {data.unit}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-black text-[#4ec981]">
                              {percentage.toFixed(0)}%
                            </span>
                            <span className="block text-[10px] text-gray-400 font-bold">
                              {data.amount.toFixed(1)} {data.unit}
                            </span>
                          </div>
                        </div>

                        {/* THE PROGRESS BAR */}
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                          <div
                            className={`h-full transition-all duration-1000 ease-out rounded-full ${
                              percentage >= 100
                                ? "bg-[#7BF1A8]"
                                : "bg-[#7BF1A8]/60"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 p-6 bg-[#F3F4F6] rounded-3xl border border-dashed border-gray-200">
                  <p className="text-[11px] text-gray-400 leading-relaxed font-bold uppercase tracking-tight">
                    * Percentages are based on standard adult daily recommended
                    values (RDI).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MacroCard({ label, value, color, icon }) {
  return (
    <div className="bg-white p-12 rounded-[40px] flex flex-col items-center text-center shadow-xl border border-white/50 hover:translate-y-[-8px] transition-all duration-300">
      <span className="text-5xl mb-4">{icon}</span>
      <span className={`text-5xl font-black ${color}`}>
        {(value || 0).toFixed(0)}g
      </span>
      <span className="text-xs text-gray-400 font-black uppercase tracking-[0.3em] mt-3">
        {label}
      </span>
    </div>
  );
}
