"use client";
import { useEffect, useRef, useState } from "react";

function ChildExample({
  handleEffect,
}: {
  handleEffect: (text: string) => void;
}) {
  useEffect(() => {
    handleEffect(
      "--(Child) UseEffect with Empty Dependency Array. Child component mounted!"
    );
    return () => {
      handleEffect(
        "--(Child) UseEffect with Empty Dependency Array. Child component unmounted!"
      );
    };
  }, []);
  return (
    <div className="alert alert-info mt-4">
      <span>I am the Child component</span>
    </div>
  );
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

  const reset = () => {
    clearLogs();
    setShowChild(false);
    setUseStateCount(0);
    renderCount.current = 0;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="stats shadow w-full bg-base-100">
        <div className="stat">
          <div className="stat-title">Render Count</div>
          <div className="stat-value text-primary">{renderCount.current}</div>
        </div>
        <div className="stat">
          <div className="stat-title">State Count</div>
          <div className="stat-value text-secondary">{useStateCount}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="tooltip" data-tip="useRef">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => renderCount.current++}
          >
            Increment Render Count (no re-render)
          </button>
        </div>
        <div className="tooltip" data-tip="useState">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setUseStateCount((prevCount) => prevCount + 1)}
          >
            Increment State Count
          </button>
        </div>
        <div className="tooltip" data-tip="useState">
          <button
            className={`btn btn-accent btn-sm ${
              showChild ? "btn-outline" : ""
            }`}
            onClick={() => setShowChild((prevShow) => !prevShow)}
          >
            {showChild ? "Hide Child" : "Show Child"}
          </button>
        </div>
        <div className="tooltip" data-tip="useState">
          <button className="btn btn-error btn-sm" onClick={clearLogs}>
            Clear Logs
          </button>
        </div>
        <div className="tooltip" data-tip="useState">
          <button className="btn btn-neutral btn-sm" onClick={reset}>
            Reset
          </button>
        </div>
      </div>
      {showChild && <ChildExample handleEffect={handleChildEffects} />}
      <div className="card bg-base-100 shadow-lg mt-4">
        <div className="card-body">
          <h2 className="card-title text-lg mb-2">useEffect Logs</h2>
          <div
            className="bg-neutral text-neutral-content rounded-lg p-4 max-h-64 overflow-y-auto font-mono text-sm"
            ref={(el) => {
              if (el) {
                el.scrollTop = el.scrollHeight;
              }
            }}
          >
            {logs.length === 0 ? (
              <div className="opacity-50">No logs yet.</div>
            ) : (
              <ul className="space-y-2">
                {logs.map((log, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="badge badge-xs badge-info mt-1">
                      {index + 1}
                    </span>
                    <span>{log}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default useEffectGuide;
