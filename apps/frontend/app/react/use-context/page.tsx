"use client";
import { createContext, useReducer, useRef } from "react";
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
    // A timeout gives React time to re-render before we reset the child counts
    setTimeout(() => {
      if (childOneRef.current) childOneRef.current.reset();
      if (childTwoRef.current) childTwoRef.current.reset();
    }, 50);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          Interactive useContext Guide
        </h1>
        <p className="mb-6 text-lg opacity-80 max-w-3xl mx-auto">
          This demonstrates how a `Provider` passes state to `Consumer`
          components, avoiding "prop drilling". Notice how changing the context
          value re-renders all consumers.
        </p>
      </div>

      <CounterContext.Provider value={{ state, dispatch }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-center">
          {/* Child One - Consumer */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body items-center">
              <h2 className="card-title">Consumer: Child One</h2>
              <p className="text-sm opacity-70">
                This component consumes the shared context.
              </p>
              <button
                className={`btn btn-primary btn-sm mt-4 ${
                  state.showChildOne ? "btn-outline" : ""
                }`}
                onClick={() => dispatch({ type: "toggleChildOne" })}
              >
                {state.showChildOne ? "Hide Child One" : "Show Child One"}
              </button>
              <div className="w-full mt-4 min-h-[10rem]">
                {state.showChildOne && <ChildOne ref={childOneRef} />}
              </div>
            </div>
          </div>

          {/* Parent - Provider */}
          <div className="card bg-base-300 shadow-xl border-2 border-primary">
            <div className="card-body items-center">
              <h2 className="card-title text-primary">Context Provider</h2>
              <p className="text-sm opacity-70">
                This component provides the context to all its children.
              </p>
              <div className="stats bg-transparent text-primary-content my-4">
                <div className="stat">
                  <div className="stat-title">Parent Renders</div>
                  <div className="stat-value">{parentRenderCount.current}</div>
                </div>
              </div>

              <div className="card bg-base-100 w-full p-4">
                <h3 className="font-bold">Shared Context State</h3>
                <p className="text-4xl font-mono font-bold my-2">
                  {state.count}
                </p>
                <div className="card-actions justify-center mt-2">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => dispatch({ type: "increment" })}
                  >
                    Increment
                  </button>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => dispatch({ type: "decrement" })}
                  >
                    Decrement
                  </button>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <button
                  className="btn btn-neutral btn-sm"
                  onClick={() => dispatch({ type: "reset" })}
                >
                  Reset Counter
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => resetAll()}
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>

          {/* Child Two - Consumer */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body items-center">
              <h2 className="card-title">Consumer: Child Two</h2>
              <p className="text-sm opacity-70">
                This is another component consuming the same context.
              </p>
              <button
                className={`btn btn-secondary btn-sm mt-4 ${
                  state.showChildTwo ? "btn-outline" : ""
                }`}
                onClick={() => dispatch({ type: "toggleChildTwo" })}
              >
                {state.showChildTwo ? "Hide Child Two" : "Show Child Two"}
              </button>
              <div className="w-full mt-4 min-h-[10rem]">
                {state.showChildTwo && <ChildTwo ref={childTwoRef} />}
              </div>
            </div>
          </div>
        </div>
      </CounterContext.Provider>
    </div>
  );
};

export default UseContextGuide;
