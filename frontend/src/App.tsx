import { useState } from "react";

type Step = "landing" | "booking" | "personalInfo" | "confirmation";

function App() {
  const [step, setStep] = useState<Step>("landing");

  if (step === "landing") {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="max-w-sm w-full p-6 text-center">
          <h1 className="text-4xl font-bold mb-8 text-left">Boka ett rum</h1>
          <button
            onClick={() => setStep("booking")}
            className="w-full px-6 py-3 rounded bg-black text-white"
          >
            Boka
          </button>
        </div>
      </div>
    );
  }
  if (step === "booking") {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="max-w-sm w-full p-6 text-center">
          <h1 className="text-4xl font-bold mb-8 text-left">Booking</h1>
          <button
            onClick={() => setStep("personalInfo")}
            className="w-full px-6 py-3 rounded bg-black text-white"
          >
            Nästa
          </button>
        </div>
      </div>
    );
  }
  if (step === "personalInfo") {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="max-w-sm w-full p-6 text-center">
          <h1 className="text-4xl font-bold mb-8 text-left">Personal Info</h1>
          <button
            onClick={() => setStep("confirmation")}
            className="w-full px-6 py-3 rounded bg-black text-white"
          >
            Nästa
          </button>
        </div>
      </div>
    );
  }
  if (step === "confirmation") {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="max-w-sm w-full p-6 text-center">
          <h1 className="text-3xl font-bold mb-8 text-left">
            Ditt rum är nu bokat!
          </h1>
          <button
            onClick={() => setStep("landing")}
            className="w-full px-6 py-3 rounded bg-black text-white"
          >
            Tillbaka
          </button>
        </div>
      </div>
    );
  }

  return <p>How dig you get here?</p>;
}

export default App;
