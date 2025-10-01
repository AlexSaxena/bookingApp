import { useState } from "react";

type Step = "landing" | "booking" | "personalInfo" | "confirmation";

function App() {
  const [step, setStep] = useState<Step>("landing");
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<{
    roomId: number;
    date: string;
    hour: number;
  } | null>(null);

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
          <h1 className="text-4xl font-bold mb-8 text-left">Välj en tid</h1>
          <div>
            <button
              onClick={() =>
                setRoom({ roomId: 1, date: "2024-07-01", hour: 9 })
              }
              className="rounded py-2 border-amber-600 border-2 px-4 mr-4 mb-4 hover:bg-amber-600 hover:text-white cursor-pointer"
            >
              Tid 1 Steve
            </button>
            <button
              onClick={() =>
                setRoom({ roomId: 2, date: "2024-07-01", hour: 10 })
              }
              className="rounded py-2 border-amber-600 border-2 px-4 mr-4 mb-4 hover:bg-amber-600 hover:text-white cursor-pointer"
            >
              Tid 2 Ada
            </button>
          </div>
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
          <h1 className="text-4xl font-bold mb-8 text-left">Vem bokar?</h1>
          <p className="font-bold text-left mb-2">Förnamn och efternamn</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Skriv ditt fullständiga namn här"
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setStep("confirmation")}
            className="w-full px-6 py-3 rounded bg-black text-white"
          >
            Boka
          </button>
        </div>
      </div>
    );
  }
  if (step === "confirmation") {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="max-w-sm w-full p-6 text-center">
          <h1 className="text-2xl font-bold mb-8 text-left">
            Ditt rum är nu bokat!
          </h1>
          <p>
            Du är {name} och valde rum {room?.roomId} {room?.date}
            {room?.hour}
          </p>
          <button
            onClick={() => {
              setStep("landing");
              setName("");
            }}
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
