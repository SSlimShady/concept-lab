"use client";

import { useState } from "react";
import CodeBlock from "../../../components/CodeBlock";

const pythonCode = `
# A simple decorator that wraps the output of a function.
def my_decorator(func):
    def wrapper(*args, **kwargs):
        original_result = func(*args, **kwargs)
        return f"Decorated: {original_result}"
    return wrapper

# Applying the decorator
@my_decorator
def hello_for_decorator():
    return "Hello from Python!"

# When called, hello_for_decorator() now returns the modified string.
# result = hello_for_decorator()
# print(result) -> "Decorated: Hello from Python!"
`;

const timingPythonCode = `
import time
from functools import wraps

# This decorator measures the execution time of a function.
def timing_decorator(func):
    @wraps(func) # Preserves the original function's metadata
    def wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        end_time = time.perf_counter()
        elapsed_time = end_time - start_time
        # The decorator returns a dictionary with the result and the time
        return {
            "original_result": result,
            "execution_time_seconds": round(elapsed_time, 4)
        }
    return wrapper

# Apply the decorator to a function that simulates a slow task
@timing_decorator
def simulate_database_call():
    """Simulates a slow database query."""
    time.sleep(1)
    return "Data fetched successfully!"

# result = simulate_database_call()
# print(result) -> {'original_result': 'Data fetched successfully!', 'execution_time_seconds': 1...}
`;

const DecoratorsPage = () => {
  // State for the simple example
  const [simpleData, setSimpleData] = useState(null);
  const [simpleError, setSimpleError] = useState("");
  const [simpleLoading, setSimpleLoading] = useState(false);

  // State for the timing example
  const [timingData, setTimingData] = useState(null);
  const [timingError, setTimingError] = useState("");
  const [timingLoading, setTimingLoading] = useState(false);

  // Fetch for simple decorator
  const handleFetchSimpleData = async () => {
    setSimpleLoading(true);
    setSimpleError("");
    setSimpleData(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/python/decorators`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch simple decorator data.");
      }
      const jsonData = await res.json();
      setSimpleData(jsonData);
    } catch (err) {
      setSimpleError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setSimpleLoading(false);
    }
  };

  // Fetch for timing decorator
  const handleFetchTimingData = async () => {
    setTimingLoading(true);
    setTimingError("");
    setTimingData(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/python/decorators/timing`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch timing decorator data.");
      }
      const jsonData = await res.json();
      setTimingData(jsonData);
    } catch (err) {
      setTimingError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setTimingLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-primary">
        Python Decorators
      </h1>
      <p className="mb-6 text-lg opacity-80">
        Decorators are a powerful feature in Python that allow you to modify or
        extend the behavior of functions or methods without permanently
        modifying their code.
      </p>

      {/* Simple Example Section */}
      <div className="card bg-base-200 shadow-lg mb-8">
        <div className="card-body">
          <h2 className="card-title">Simple Example: Wrapping Output</h2>
          <p className="text-sm opacity-80 mb-4">
            The following Python code defines a simple decorator that adds a
            prefix to a function's return value. This code is running on the
            FastAPI backend.
          </p>
          <CodeBlock code={pythonCode} language="python" />

          <h3 className="card-title mt-6 text-lg">Live API Response</h3>
          <p className="text-sm opacity-80">
            Result from <code>/api/python/decorators</code>:
          </p>
          <div className="card-actions my-4">
            <button
              className="btn btn-primary btn-sm"
              onClick={handleFetchSimpleData}
              disabled={simpleLoading}
            >
              {simpleLoading ? "Loading..." : "Call API"}
            </button>
          </div>
          <div className="mockup-code bg-neutral text-neutral-content min-h-[6rem]">
            <pre className="p-4">
              {simpleError && <code className="text-error">{simpleError}</code>}
              {simpleData && <code>{JSON.stringify(simpleData, null, 2)}</code>}
              {!simpleLoading && !simpleError && !simpleData && (
                <code className="opacity-50">
                  Click "Call API" to see the response.
                </code>
              )}
            </pre>
          </div>
        </div>
      </div>

      {/* Real-Life Use Case Section */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Real-Life Use Case: Timing a Function</h2>
          <p className="text-sm opacity-80 mb-4">
            Decorators are commonly used for cross-cutting concerns like
            logging, authentication, or performance monitoring. Here, we create
            a decorator to time how long a function takes to execute.
          </p>
          <CodeBlock code={timingPythonCode} language="python" />

          <h3 className="card-title mt-6 text-lg">Live API Response</h3>
          <p className="text-sm opacity-80">
            Result from <code>/api/python/decorators/timing</code>. Notice the
            execution time is included in the response.
          </p>
          <div className="card-actions my-4">
            <button
              className="btn btn-primary btn-sm"
              onClick={handleFetchTimingData}
              disabled={timingLoading}
            >
              {timingLoading ? "Loading..." : "Call API"}
            </button>
          </div>
          <div className="mockup-code bg-neutral text-neutral-content min-h-[6rem]">
            <pre className="p-4">
              {timingError && <code className="text-error">{timingError}</code>}
              {timingData && <code>{JSON.stringify(timingData, null, 2)}</code>}
              {!timingLoading && !timingError && !timingData && (
                <code className="opacity-50">
                  Click "Call API" to see the response.
                </code>
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecoratorsPage;
