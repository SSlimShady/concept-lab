"use client";
import { createContext, useEffect, useRef, useState } from "react";
import ChildOne from "./child-one/page";
import ChildTwo from "./child-two/page";
import { ChildRefType } from "types";

export const CounterContext = createContext({
  count: 0,
  increment: () => {},
  decrement: () => {},
  reset: () => {},
});

export const useContextGuide = () => {
  const [count, setCount] = useState(0);
  const [showChildOne, setShowChildOne] = useState(false);
  const [showChildTwo, setShowChildTwo] = useState(false);
  const parentRenderCount = useRef(0);
  parentRenderCount.current += 1;

  const childOneRef = useRef<ChildRefType>(null);
  const childTwoRef = useRef<ChildRefType>(null);

  const resetAll = () => {
    setCount(0);
    parentRenderCount.current = 0;
    if (childOneRef.current) childOneRef.current.reset();
    if (childTwoRef.current) childTwoRef.current.reset();
  };

  return (
    <CounterContext.Provider
      value={{
        count,
        increment: () => setCount((c) => c + 1),
        decrement: () => setCount((c) => c - 1),
        reset: () => setCount(0),
      }}
    >
      <p>Parent Render Count: {parentRenderCount.current}</p>
      <p>Context Counter: {count}</p>
      <button className="btn btn-grey btn-sm" onClick={() => resetAll()}>
        Reset All
      </button>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => setShowChildOne(!showChildOne)}
      >
        Show Child One
      </button>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => setShowChildTwo(!showChildTwo)}
      >
        Show Child Two
      </button>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => setCount((c) => c + 1)}
      >
        Increment Counter
      </button>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => setCount((c) => c - 1)}
      >
        Decrement Counter
      </button>
      <button className="btn btn-neutral btn-sm" onClick={() => setCount(0)}>
        Reset Counter
      </button>
      {showChildOne && <ChildOne ref={childOneRef} />}
      {showChildTwo && <ChildTwo ref={childTwoRef} />}
    </CounterContext.Provider>
  );
};

export default useContextGuide;
