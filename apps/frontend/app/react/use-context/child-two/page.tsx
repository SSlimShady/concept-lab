import { forwardRef, useContext, useImperativeHandle, useRef } from "react";
import { CounterContext } from "../page";

const ChildTwo = forwardRef((props, ref) => {
  const childTwoRenderCount = useRef(0);
  childTwoRenderCount.current += 1;
  const counterContext = useContext(CounterContext);

  useImperativeHandle(ref, () => ({
    reset: () => (childTwoRenderCount.current = 0),
  }));

  return (
    <div>
      <p>Child Two Render Count: {childTwoRenderCount.current}</p>
      <p>Context Counter: {counterContext.count}</p>
      <button
        className="btn btn-primary btn-sm"
        onClick={counterContext.increment}
      >
        Increment Context Counter
      </button>
      <button
        className="btn btn-secondary btn-sm"
        onClick={counterContext.decrement}
      >
        Decrement Context Counter
      </button>
      <button className="btn btn-neutral btn-sm" onClick={counterContext.reset}>
        Reset Context Counter
      </button>
    </div>
  );
});

export default ChildTwo;
