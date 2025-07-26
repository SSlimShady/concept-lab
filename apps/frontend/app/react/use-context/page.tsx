"use client";
import { createContext, useEffect, useReducer, useRef, useState } from "react";
import ChildOne from "./child-one/page";
import ChildTwo from "./child-two/page";
import { ChildRefType } from "types";

const initialState = { count: 0, showChildOne: false, showChildTwo: false };

export const CounterContext = createContext({
  state: initialState,
  dispatch: (action: ActionType) => {},
});

type StateType = {
  count: number;
  showChildOne: boolean;
  showChildTwo: boolean;
};
type ActionType =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset" }
  | { type: "toggleChildOne" }
  | { type: "toggleChildTwo" };

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + 1 };
    case "decrement":
      return { ...state, count: state.count - 1 };
    case "reset":
      return { ...state, count: 0 };
    case "toggleChildOne":
      return { ...state, showChildOne: !state.showChildOne };
    case "toggleChildTwo":
      return { ...state, showChildTwo: !state.showChildTwo };
    default:
      return state;
  }
};

export const UseContextGuide = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const parentRenderCount = useRef(0);
  parentRenderCount.current += 1;

  const childOneRef = useRef<ChildRefType>(null);
  const childTwoRef = useRef<ChildRefType>(null);

  const resetAll = () => {
    dispatch({ type: "reset" });
    parentRenderCount.current = 0;
    if (childOneRef.current) childOneRef.current.reset();
    if (childTwoRef.current) childTwoRef.current.reset();
  };

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      <p>Parent Render Count: {parentRenderCount.current}</p>
      <p>Context Counter: {state.count}</p>
      <button className="btn btn-grey btn-sm" onClick={() => resetAll()}>
        Reset All
      </button>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => dispatch({ type: "toggleChildOne" })}
      >
        Show Child One
      </button>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => dispatch({ type: "toggleChildTwo" })}
      >
        Show Child Two
      </button>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => dispatch({ type: "increment" })}
      >
        Increment Context Counter
      </button>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => dispatch({ type: "decrement" })}
      >
        Decrement Context Counter
      </button>
      <button
        className="btn btn-neutral btn-sm"
        onClick={() => dispatch({ type: "reset" })}
      >
        Reset Context Counter
      </button>
      {state.showChildOne && <ChildOne ref={childOneRef} />}
      {state.showChildTwo && <ChildTwo ref={childTwoRef} />}
    </CounterContext.Provider>
  );
};

export default UseContextGuide;
