import { forwardRef, useContext, useImperativeHandle, useRef } from "react";
import { CounterContext } from "../page";

const ChildTwo = forwardRef((props, ref) => {
  const childTwoRenderCount = useRef(0);
  childTwoRenderCount.current += 1;
  const counterContext = useContext(CounterContext);
  const { state, dispatch } = counterContext;

  useImperativeHandle(ref, () => ({
    reset: () => (childTwoRenderCount.current = 0),
  }));

  return (
    <div className="card bg-base-100 shadow-inner w-full">
      <div className="card-body items-center text-center p-4">
        <div className="stats bg-transparent stats-vertical sm:stats-horizontal">
          <div className="stat">
            <div className="stat-title">Child Renders</div>
            <div className="stat-value text-secondary">
              {childTwoRenderCount.current}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Context Value</div>
            <div className="stat-value text-secondary">{state.count}</div>
          </div>
        </div>
        <div className="card-actions justify-center mt-2">
          <button
            className="btn btn-success btn-xs"
            onClick={() => dispatch({ type: "increment" })}
            aria-label="Increment from child"
          >
            Increment
          </button>
          <button
            className="btn btn-error btn-xs"
            onClick={() => dispatch({ type: "decrement" })}
            aria-label="Decrement from child"
          >
            Decrement
          </button>
        </div>
      </div>
    </div>
  );
});

export default ChildTwo;
