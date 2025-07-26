import { forwardRef, useContext, useImperativeHandle, useRef } from "react";
import { CounterContext } from "../page";

const ChildOne = forwardRef((props, ref) => {
  const childOneRenderCount = useRef(0);
  childOneRenderCount.current += 1;
  const counterContext = useContext(CounterContext);
  const { state, dispatch } = counterContext;

  useImperativeHandle(ref, () => ({
    reset: () => (childOneRenderCount.current = 0),
  }));

  return (
    <div>
      <p>Child One Render Count: {childOneRenderCount.current}</p>
      <p>Context Counter: {state.count}</p>
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
    </div>
  );
});

export default ChildOne;
