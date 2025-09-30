import { useState } from "react";

type Step = "landing" | "booking" | "personalInfo" | "confirmation";

function App() {
  const [step, setStep] = useState<Step>("landing");

  if (step === "landing") {
    return (
      <>
        <p>Landing</p>
        <button onClick={() => setStep("booking")}>Continue</button>
      </>
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
