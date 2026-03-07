export default function Step1Metrics({ data, update, onNext }) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Basic Metrics
      </h2>
      <div className="w-full flex justify-center">
        <div className="flex justify-center w-47 bg-gray-100 rounded-full p-1">
          {["kg", "lbs"].map((unit) => (
            <button
              key={unit}
              onClick={() => update({ weightUnit: unit })}
              className={`px-8 py-2 rounded-full transition ${data.weightUnit === unit ? "bg-green-400 text-white" : "text-gray-400"}`}
            >
              {unit.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-gray-500 text-sm">Current Weight</label>
        <input
          type="number"
          className="border-b-2 border-gray-200 py-2 text-xl outline-none focus:border-green-400"
          value={data.currentWeight}
          onChange={(e) => update({ currentWeight: e.target.value })}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-500 text-sm">Goal Weight</label>
        <input
          type="number"
          className="border-b-2 border-gray-200 py-2 text-xl outline-none focus:border-green-400"
          value={data.goalWeight}
          onChange={(e) => update({ goalWeight: e.target.value })}
        />
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold">{data.foodTimes} meals/day</p>
        <input
          type="range"
          min="1"
          max="6"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-400"
          value={data.foodTimes}
          onChange={(e) => update({ foodTimes: e.target.value })}
        />
      </div>

      <button
        onClick={onNext}
        className="w-full bg-green-400 text-white py-4 rounded-full font-bold"
      >
        Next
      </button>
    </div>
  );
}
