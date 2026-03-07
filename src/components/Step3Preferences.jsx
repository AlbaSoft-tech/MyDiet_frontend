export default function Step3Preferences({ data, update, onFinish, onBack }) {
  const dietOptions = [
    "Normal",
    "Keto",
    "Vegan",
    "Vegetarian",
    "Pescatarian",
    "Mediterranean",
    "Paleo",
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Preferences
      </h2>

      {[
        { label: "Allergies", key: "allergens", placeholder: "e.g. Peanuts" },
        {
          label: "Preferred Foods",
          key: "preferredFoods",
          placeholder: "e.g. Fish, Chicken",
        },
        {
          label: "Foods to Avoid",
          key: "notPreferredFoods",
          placeholder: "e.g. Rice, Dairy",
        },
      ].map((field) => (
        <div key={field.key} className="flex flex-col">
          <label className="text-gray-500 text-xs text-center mb-1">
            {field.label}
          </label>
          <input
            type="text"
            placeholder={field.placeholder}
            className="border-b border-gray-200 py-2 text-lg outline-none focus:border-[#7BF1A8] text-center"
            value={data[field.key]}
            onChange={(e) => update({ [field.key]: e.target.value })}
          />
        </div>
      ))}

      <div className="pt-4">
        <label className="block text-gray-500 text-xs text-center mb-3">
          Diet Style (Optional)
        </label>
        <div className="flex flex-wrap justify-center gap-2">
          {dietOptions.map((diet) => (
            <button
              key={diet}
              onClick={() => update({ selectedDiet: diet })}
              className={`px-4 py-2 rounded-full border text-sm transition ${
                data.selectedDiet === diet
                  ? "bg-green-600 border-green-600 text-white"
                  : "bg-white border-gray-300 text-gray-600"
              }`}
            >
              {diet}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-600 py-4 rounded-full font-bold"
        >
          Back
        </button>
        <button
          onClick={onFinish}
          className="flex-[2] bg-green-500 text-white py-4 rounded-full font-bold shadow-lg"
        >
          Generate Diet
        </button>
      </div>
    </div>
  );
}
