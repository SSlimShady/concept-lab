"use client";
import React, { useMemo } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

function UnoptimizedChild({
  handleClick,
  boolValue = true,
}: {
  handleClick: (text: string) => void;
  boolValue: boolean;
}) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div className="alert alert-warning mt-4">
      <span>I am the Un-optimized Child component</span>
      <p>Child Render Count: {renderCount.current}</p>
      <button
        className="btn btn-primary btn-sm"
        onClick={handleClick.bind(null, "Bad")}
      >
        Click Me
      </button>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs">Prop Value:</span>
        {boolValue ? (
          <div className="badge badge-success badge-xs">True</div>
        ) : (
          <div className="badge badge-ghost badge-xs">False</div>
        )}
      </div>
    </div>
  );
}

const OptimizedChild = React.memo(
  ({
    handleClickMemo,
    boolValue = true,
  }: {
    handleClickMemo: () => void;
    boolValue: boolean;
  }) => {
    const renderCount = useRef(0);
    renderCount.current += 1;

    return (
      <div className="alert alert-info mt-4">
        <span>I am the Optimized Child component</span>
        <p>Child Render Count: {renderCount.current}</p>
        <button className="btn btn-primary btn-sm" onClick={handleClickMemo}>
          Click Me
        </button>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs">Prop Value:</span>
          {boolValue ? (
            <div className="badge badge-success badge-xs">True</div>
          ) : (
            <div className="badge badge-ghost badge-xs">False</div>
          )}
        </div>
      </div>
    );
  }
);

export const OptimizationGuide = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [dummyState, setDummyState] = useState(0);
  const [propValue, setPropValue] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const handleClick = (text: string) => {
    setLogs((prev) => [...prev, `${text} Child button clicked`]);
  };

  const handleClickMemo = useCallback(() => {
    setLogs((prev) => [...prev, `Child button clicked (memoized) `]);
  }, []);

  const heavyCalculation = (n = 3000) => {
    let result = 1;
    // This loop is intentionally slow to simulate a heavy, blocking calculation.
    for (let i = 1; i <= n; i++) {
      for (let j = 0; j < 1000000; j++) {}
      result *= i;
    }
    setLogs((prev) => [
      ...prev,
      `[Heavy Calculation Ran] Result is a large number.`,
    ]);
    return result;
  };

  // useMemo caches the result of the heavy calculation.
  // It will only re-run if its dependencies (none in this case) change.
  const memoizedCalculation = useMemo(() => heavyCalculation(), []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">
        Interactive Optimizations Guide
      </h1>
      <p className="mb-6 text-lg opacity-80">
        Explore how `React.memo`, `useCallback`, and `useMemo` can prevent
        unnecessary work and improve performance.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN - CONTROLS & EXPLANATIONS */}
        <div className="flex flex-col gap-6">
          <div className="card bg-base-200 shadow">
            <div className="card-body">
              <h2 className="card-title">Parent Controls</h2>
              <p className="text-sm opacity-80">
                Use these buttons to trigger re-renders in the parent component.
                Observe how the child components behave.
              </p>
              <div className="card-actions mt-2">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setDummyState((s) => s + 1)}
                >
                  Trigger Parent Re-render
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setPropValue((s) => !s)}
                >
                  Toggle Child Prop Value
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow">
            <div className="card-body">
              <h2 className="card-title">
                useMemo: Memoizing Expensive Calculations
              </h2>
              <p className="text-sm opacity-80">
                `useMemo` caches the result of a function. The "slow" button
                re-calculates every time, causing a noticeable lag. The "fast"
                button retrieves the cached result instantly.
              </p>
              <code className="text-sm text-info my-2 block">
                useMemo(() =&gt; heavyCalculation(), [])
              </code>
              <div className="card-actions mt-2">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => heavyCalculation()}
                >
                  Run Slow Calculation
                </button>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => {
                    // Access the memoized value
                    const result = memoizedCalculation;
                    setLogs((prev) => [
                      ...prev,
                      `[Memoized Result Accessed] Result is a large number.`,
                    ]);
                  }}
                >
                  Run Fast Calculation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - OUTPUT */}
        <div className="flex flex-col gap-6">
          <div className="card bg-base-200 shadow">
            <div className="card-body">
              <h2 className="card-title">
                React.memo & useCallback: Memoizing Components
              </h2>
              <p className="text-sm opacity-80">
                When you "Trigger Parent Re-render", notice only the
                un-optimized child's render count increases. The optimized child
                only re-renders when its actual prop value changes.
              </p>

              <div className="mt-4">
                <h3 className="font-bold">Un-optimized Child</h3>
                <p className="text-xs opacity-70">
                  Re-renders when parent re-renders because `handleClick` is a
                  new function every time.
                </p>
                <UnoptimizedChild
                  boolValue={propValue}
                  handleClick={handleClick}
                />
              </div>

              <div className="mt-4">
                <h3 className="font-bold">
                  Optimized Child (`React.memo` + `useCallback`)
                </h3>
                <p className="text-xs opacity-70">
                  `React.memo` prevents re-renders if props are the same.
                  `useCallback` ensures `handleClickMemo` prop doesn't change
                  unnecessarily.
                </p>
                <OptimizedChild
                  boolValue={propValue}
                  handleClickMemo={handleClickMemo}
                />
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title">Logs</h2>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => setLogs([])}
                >
                  Clear
                </button>
              </div>
              <div
                className="bg-neutral text-neutral-content rounded-lg p-3 mt-2 h-48 overflow-y-auto font-mono text-sm"
                ref={logContainerRef}
              >
                <ul className="space-y-1">
                  {logs.map((log, index) => (
                    <li key={index}>{log}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizationGuide;
