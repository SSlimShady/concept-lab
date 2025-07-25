"use client";
import { useContext, useEffect, useRef, useState } from "react";

function ChildExample({
  handleEffect,
}: {
  handleEffect: (text: string) => void;
}) {
  useEffect(() => {
    handleEffect(
      "--UseEffect with Empty Dependency Array. Child component mounted!"
    );
    return () => {
      handleEffect(
        "--UseEffect with Empty Dependency Array. Child component unmounted!"
      );
    };
  }, []);
  return <h2>I am the Child component</h2>;
}

export const useEffectGuide = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [showChild, setShowChild] = useState(false);
  const [useStateCount, setUseStateCount] = useState(0);
  const renderCount = useRef(0);
  renderCount.current += 1;

  useEffect(() => {
    setLogs((prevLogs) => [
      ...prevLogs,
      `--UseEffect with Count Dependency. Count: ${useStateCount}`,
    ]);
  }, [useStateCount]);

  useEffect(() => {
    setLogs((prevLogs) => [
      ...prevLogs,
      "--UseEffect with Empty Dependency Array. Component mounted!",
    ]);
    return () => {
      setLogs((prevLogs) => [
        ...prevLogs,
        "--UseEffect with Empty Dependency Array. Component unmounted!",
      ]);
    };
  }, []);

  const handleChildEffects = (text: string) => {
    setLogs((prevLogs) => [...prevLogs, text]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div>
      <h2>{`Render Count: ${renderCount.current}`}</h2>
      <button
        className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl"
        onClick={() => renderCount.current++}
      >
        Increment Render Count without actual render
      </button>
      <button
        className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl"
        onClick={() => setUseStateCount((prevCount) => prevCount + 1)}
      >
        Increment State Count
      </button>
      <button
        className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl"
        onClick={() => setShowChild((prevShow) => !prevShow)}
      >
        {showChild ? "Hide Child" : "Show Child"}
      </button>
      <button
        className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl"
        onClick={clearLogs}
      >
        Clear Logs
      </button>
      <h1>useEffect Types Logs</h1>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
      {showChild && <ChildExample handleEffect={handleChildEffects} />}
    </div>
  );
};

export default useEffectGuide;
