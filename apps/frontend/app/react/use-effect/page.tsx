"use client";
import { useEffect, useState } from "react";

export default function UseEffectDemo() {
  const [count, setCount] = useState(0);
  const [serverTime, setServerTime] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/react/use-effect")
      .then((res) => res.json())
      .then((data) => setServerTime(data.time));
  }, [count]);

  return (
    <div>
      <h2>React: useEffect Example</h2>
      <p>
        Button click increments a counter and fetches server time from FastAPI
        backend.
      </p>
      <button onClick={() => setCount((c) => c + 1)}>Increment: {count}</button>
      <div>Server time: {serverTime ?? "Loading..."}</div>
    </div>
  );
}
