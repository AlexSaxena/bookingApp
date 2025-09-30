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
      <>
        <p>Booking</p>
        <button onClick={() => setStep("personalInfo")}>Continue</button>
      </>
    );
  }
  if (step === "personalInfo") {
    return (
      <>
        <p>Personal Info</p>{" "}
        <button onClick={() => setStep("confirmation")}>Continue</button>
      </>
    );
  }
  if (step === "confirmation") {
    return <p>Confirmation</p>;
  }

  return <p>How dig you get here?</p>;
}

export default App;
