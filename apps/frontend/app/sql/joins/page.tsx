"use client";
import { useState } from "react";

export default function SQLJoinsDemo() {
  const [result, setResult] = useState<string>("");

  const handleClick = async () => {
    const res = await fetch("/api/sql/joins");
    const data = await res.json();
    setResult(data.result);
  };

  return (
    <div>
      <h2>SQL: Joins Example</h2>
      <button onClick={handleClick}>Run SQL Join Example</button>
      <div>Result: {result}</div>
    </div>
  );
}
