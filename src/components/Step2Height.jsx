export default function Step2Height({ data, update, onNext, onBack }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Physical Metrics
      </h2>

      {/* Height Unit Toggle */}
      <div className="w-full flex justify-center">
        <div className="flex w-67 justify-center bg-gray-100 rounded-full p-1">
          {["m", "ft"].map((unit) => (
            <button
              key={unit}
              onClick={() => update({ heightUnit: unit })}
              className={`px-6 py-2 rounded-full transition ${data.heightUnit === unit ? "bg-green-400 text-white" : "text-gray-400"}`}
            >
              {unit === "m" ? "Meters/CM" : "Feet/Inches"}
            </button>
          ))}
        </div>
      </div>

      {/* Height Inputs */}
      {data.heightUnit === "m" ? (
        <div className="flex flex-col">
          <label className="text-gray-500 text-sm">Height (cm)</label>
          <input
            type="number"
            placeholder="e.g. 175"
            className="border-b-2 border-gray-200 py-2 text-xl outline-none focus:border-green-400"
            value={data.heightMeter}
            onChange={(e) => update({ heightMeter: e.target.value })}
          />
        </div>
      ) : (
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col">
            <label className="text-gray-500 text-sm">Feet</label>
            <input
              type="number"
              placeholder="5"
              className="border-b-2 border-gray-200 py-2 text-xl outline-none focus:border-green-400 text-center"
              value={data.heightFeet}
              onChange={(e) => update({ heightFeet: e.target.value })}
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="text-gray-500 text-sm">Inches</label>
            <input
              type="number"
              placeholder="10"
              className="border-b-2 border-gray-200 py-2 text-xl outline-none focus:border-green-400 text-center"
              value={data.heightInches}
              onChange={(e) => update({ heightInches: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Water Intake */}
      <div className="flex flex-col">
        <label className="text-gray-500 text-sm text-center">
          Daily water intake (Liters)
        </label>
        <input
          type="number"
          placeholder="e.g. 2"
          className="border-b-2 border-gray-200 py-2 text-2xl outline-none focus:border-green-400 text-center"
          value={data.waterIntake}
          onChange={(e) => update({ waterIntake: e.target.value })}
        />
      </div>

      {/* Dessert Toggle */}
      <div className="flex flex-col items-center gap-2">
        <label className="text-gray-500 text-sm">Do you like sweets?</label>
        <div className="flex items-center gap-4">
          <span
            className={
              !data.dessert ? "text-gray-800 font-bold" : "text-gray-400"
            }
          >
            No
          </span>
          <button
            onClick={() => update({ dessert: !data.dessert })}
            className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors ${data.dessert ? "bg-green-400" : "bg-gray-300"}`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${data.dessert ? "translate-x-7" : "translate-x-0"}`}
            />
          </button>
          <span
            className={
              data.dessert ? "text-gray-800 font-bold" : "text-gray-400"
            }
          >
            Yes
          </span>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-600 py-4 rounded-full font-bold"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-[2] bg-green-400 text-white py-4 rounded-full font-bold shadow-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}
