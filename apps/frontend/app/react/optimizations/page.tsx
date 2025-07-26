"use client";
import React, { useMemo } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

function ChildExample({
  handleClick,
  boolValue = true,
}: {
  handleClick: (text: string) => void;
  boolValue: boolean;
}) {
  const childRenderCount = useRef(0);
  childRenderCount.current += 1;

  return (
    <div className="alert alert-info mt-4">
      <span>I am the Bad Child component</span>
      <p>Child Render Count: {childRenderCount.current}</p>
      <button
        className="btn btn-primary btn-sm"
        onClick={handleClick.bind(null, "Bad")}
      >
        Parent handles this button (without useCallback)
      </button>
      <p className="mt-2 ">Prop Value: {boolValue.toString()}</p>
    </div>
  );
}

const ChildMemoExample = React.memo(
  ({
    handleClickMemo,
    boolValue = true,
  }: {
    handleClickMemo: () => void;
    boolValue: boolean;
  }) => {
    const childRenderCount = useRef(0);
    childRenderCount.current += 1;

    return (
      <div className="alert alert-info mt-4">
        <span>I am the Good Child component</span>
        <p>Child Render Count: {childRenderCount.current}</p>
        <button className="btn btn-primary btn-sm" onClick={handleClickMemo}>
          Parent handles this button (with useCallback)
        </button>
        <p className="mt-2 ">Prop Value: {boolValue.toString()}</p>
      </div>
    );
  }
);

export const OptimizationGuide = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [dummyState, setDummyState] = useState(0);
  const [propValue, setPropValue] = useState(true);
  const handleClick = (text: string) => {
    setLogs((prev) => [...prev, `${text} Child button clicked`]);
  };

  const handleClickMemo = useCallback(() => {
    setLogs((prev) => [...prev, `Child button clicked (memoized) `]);
  }, []);

  const factorial = (n = 500) => {
    let result = 1;
    for (let i = 1; i <= n; i++) {
      // simulate heavy work
      for (let j = 0; j < 10000000; j++) {}
      result *= i;
    }
    return result;
  };

  const memoFactorial = useMemo(() => factorial(), []);

  const logSlowFactorial = () => {
    setLogs((prev) => [...prev, `Factorial result: ${factorial()}`]);
  };

  const logFastFactorial = () => {
    setLogs((prev) => [...prev, `Memoized Factorial result: ${memoFactorial}`]);
  };
  return (
    <div>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => setDummyState((s) => s + 1)}
      >
        Trigger Parent re-render
      </button>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => setPropValue((s) => !s)}
      >
        Toggle Prop Value
      </button>
      <button
        className="btn btn-accent btn-sm"
        onClick={() => logSlowFactorial()}
      >
        Log Factorial (without memo)
      </button>

      <button
        className="btn btn-info btn-sm"
        onClick={() => logFastFactorial()}
      >
        Log Factorial (with memo)
      </button>
      <ChildExample boolValue={propValue} handleClick={handleClick} />
      <ChildMemoExample
        boolValue={propValue}
        handleClickMemo={handleClickMemo}
      />
      <div className="mt-4">
        <h3 className="font-bold">Logs:</h3>
        <ul className="list-disc list-inside">
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OptimizationGuide;
