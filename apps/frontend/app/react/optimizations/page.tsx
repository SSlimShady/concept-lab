"use client";
import React from "react";
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
  return (
    <div>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => setDummyState((s) => s + 1)}
      >
        Trigger Parent re-render
      </button>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => setPropValue((s) => !s)}
      >
        Toggle Prop Value
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
