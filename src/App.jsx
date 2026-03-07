import React, { useState } from "react";
import Step1Metrics from "./components/Step1Metrics";
import Step2Height from "./components/Step2Height";
import Step3Preferences from "./components/Step3Preferences";
import DietDashboard from "./components/DietResult";

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const [step, setStep] = useState(Number(params.get("step")) || 1);
  const [formData, setFormData] = useState({
    weightUnit: "kg",
    currentWeight: "",
    goalWeight: "",
    foodTimes: 3,
    heightUnit: "m",
    heightMeter: "",
    heightFeet: "",
    heightInches: "",
    waterIntake: "",
    dessert: false,
    allergens: "",
    preferredFoods: "",
    notPreferredFoods: "",
    dietType: "Normal",
  });

  const updateData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleFinish = async () => {
    const {
      currentWeight,
      goalWeight,
      weightUnit,
      heightUnit,
      heightMeter,
      heightFeet,
      heightInches,
      foodTimes,
      waterIntake,
    } = formData;

    const isLoss = Number(goalWeight) < Number(currentWeight);

    // Convert weight to kg for internal calculation
    const weightInKg =
      weightUnit === "kg"
        ? Number(currentWeight)
        : Number(currentWeight) * 0.453592;

    const calories = isLoss ? weightInKg * 25 : weightInKg * 35;

    let heightInCm =
      heightUnit === "m"
        ? Number(heightMeter) * 100
        : Number(heightFeet) * 30.48 + Number(heightInches) * 2.54;

    const protein = isLoss
      ? Math.round(heightInCm * 1.0)
      : Math.round(heightInCm * 1.21);

    const finalPayload = {
      ...formData,
      currentWeight: Number(currentWeight),
      goalWeight: Number(goalWeight),
      calories: Math.round(calories),
      protein: Number(protein),
      foodTimes: Number(foodTimes),
      waterIntake: Number(waterIntake),
      heightMeter: heightMeter ? Number(heightMeter) : null,
      heightFeet: heightFeet ? Number(heightFeet) : null,
      heightInches: heightInches ? Number(heightInches) : null,
      goal: isLoss ? "lose" : "gain",
    };

    const queryParams = new URLSearchParams({
      prompt: JSON.stringify(finalPayload),
      type: "diet",
    }).toString();

    window.location.href = `https://albasoft-tech.com/Diet?${queryParams}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7BF1A8] to-[#F3F4F6]">
      {step !== 4 ? (
        <div className="flex flex-col items-center justify-center p-6 min-h-screen">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl p-8 min-h-[600px] flex flex-col justify-between transition-all">
            <>
              {step === 1 && (
                <Step1Metrics
                  data={formData}
                  update={updateData}
                  onNext={() => setStep(2)}
                />
              )}
              {step === 2 && (
                <Step2Height
                  data={formData}
                  update={updateData}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              )}
              {step === 3 && (
                <Step3Preferences
                  data={formData}
                  update={updateData}
                  onFinish={handleFinish}
                  onBack={() => setStep(2)}
                />
              )}
            </>
          </div>

          {step === 1 && (
            <button
              onClick={() => setStep(4)}
              className="mt-8 text-gray-600 font-bold hover:text-black transition-colors flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm border border-white/30"
            >
              Already have a plan?{" "}
              <span className="text-[#4ec981]">Enter Code</span>
            </button>
          )}
        </div>
      ) : (
        /* THE DASHBOARD (Code Entry Screen) */
        <div className="w-full animate-in fade-in duration-500">
          <DietDashboard />
        </div>
      )}
    </div>
  );
}
