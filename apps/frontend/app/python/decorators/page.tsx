"use client";
import { useState } from "react";

export default function DecoratorsDemo() {
  const [result, setResult] = useState<string>("");

  const handleClick = async () => {
    const res = await fetch("/api/python/decorators");
    const data = await res.json();
    setResult(data.result);
  };

  return (
    <div>
      <h2>Python: Decorators Example</h2>
      <button onClick={handleClick}>Run Decorator Example</button>
      <div>Result: {result}</div>
    </div>
  );
}
