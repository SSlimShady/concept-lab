"use client";
import { memo, useCallback, useEffect, useRef, useState } from "react";

type LogType = "mount" | "unmount" | "update" | "every-render" | "child";

interface LogEntry {
  id: number;
  text: string;
  type: LogType;
}

const ChildExample = memo(function ChildExample({
  handleEffect,
}: {
  handleEffect: (text: string, type: LogType) => void;
}) {
  useEffect(() => {
    handleEffect("Child component mounted!", "child");
    return () => {
      handleEffect("Child component unmounted!", "child");
    };
  }, [handleEffect]);
  return (
    <div className="alert alert-info mt-4">
      <span>I am the Child component</span>
    </div>
  );
});

export const UseEffectGuide = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showChild, setShowChild] = useState(false);
  const [useStateCount, setUseStateCount] = useState(0);
  const [noDepToggle, setNoDepToggle] = useState(false);
  const renderCount = useRef(0);
  const logIdCounter = useRef(0);
  const logContainerRef = useRef<HTMLDivElement>(null);
  renderCount.current += 1;

  const addLog = useCallback((text: string, type: LogType) => {
    setLogs((prevLogs) => {
      // This check prevents an infinite loop from the "every-render" effect.
      // If the last log was also an "every-render" log, we assume this is a subsequent
      // render caused by the logging itself, so we bail out to break the cycle.
      if (
        type === "every-render" &&
        prevLogs[prevLogs.length - 1]?.type === "every-render"
      ) {
        return prevLogs;
      }
      return [...prevLogs, { id: logIdCounter.current++, text, type }];
    });
  }, []);

  // 1. Effect with NO dependency array
  useEffect(() => {
    addLog("Runs on EVERY render", "every-render");
  });

  // 2. Effect with an EMPTY dependency array
  useEffect(() => {
    addLog("Parent component MOUNTED", "mount");
    return () => {
      // This will only run when the UseEffectGuide component is removed from the DOM
      addLog("Parent component UNMOUNTED", "unmount");
    };
  }, [addLog]);

  // 3. Effect with dependencies
  useEffect(() => {
    // Don't log on initial mount (count is 0) to avoid confusion with the mount effect
    if (useStateCount > 0) {
      addLog(`Count is now ${useStateCount}`, "update");
    }
    return () => {
      // This cleanup runs BEFORE the next effect in this slot runs.
      // It has access to the "old" value of useStateCount via its closure.
      addLog(`CLEANUP for previous count: ${useStateCount}`, "unmount");
    };
  }, [useStateCount, addLog]);

  const handleChildEffects = useCallback(
    (text: string, type: LogType) => {
      addLog(text, type);
    },
    [addLog]
  );

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const clearLogs = () => {
    setLogs([]);
  };

  const reset = () => {
    setShowChild(false);
    setUseStateCount(0);
    setNoDepToggle(false);
    renderCount.current = 0;
    // A timeout gives React time to re-render before we clear the logs
    setTimeout(clearLogs, 50);
  };

  const logTypeToColor: Record<LogType, string> = {
    mount: "badge-success",
    unmount: "badge-error",
    update: "badge-info",
    "every-render": "badge-warning",
    child: "badge-accent",
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">Interactive useEffect Guide</h1>
      <p className="mb-6 text-lg opacity-80">
        Click the buttons and observe the logs to understand how `useEffect`
        behaves in different scenarios.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN - CONTROLS */}
        <div className="flex flex-col gap-6">
          {/* Component State */}
          <div className="card bg-base-200 shadow">
            <div className="card-body">
              <h2 className="card-title">Component State & Vitals</h2>
              <p>
                Track component renders and state changes. Note how updating a
                `useRef` value does not trigger a re-render.
              </p>
              <div className="stats stats-vertical sm:stats-horizontal shadow w-full bg-base-100 mt-2">
                <div className="stat">
                  <div className="stat-title">Render Count</div>
                  <div className="stat-value text-primary">
                    {renderCount.current}
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-title">State Count</div>
                  <div className="stat-value text-secondary">
                    {useStateCount}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Effect Demonstrations */}
          <div className="card bg-base-200 shadow">
            <div className="card-body">
              <h2 className="card-title">useEffect Demonstrations</h2>

              {/* Demo 1: Mount/Unmount */}
              <div className="p-4 border border-base-300 rounded-lg mt-4">
                <h3 className="font-bold">1. Mount & Unmount</h3>
                <code className="text-sm text-accent my-2 block">
                  useEffect(..., [])
                </code>
                <p className="text-sm opacity-80 mb-3">
                  An empty dependency array `[]` means the effect runs only once
                  when the component mounts, and its cleanup runs when it
                  unmounts.
                </p>
                <button
                  className={`btn btn-accent btn-sm ${
                    showChild ? "btn-outline" : ""
                  }`}
                  onClick={() => setShowChild((prevShow) => !prevShow)}
                >
                  {showChild ? "Unmount Child" : "Mount Child"}
                </button>
              </div>

              {/* Demo 2: Dependencies */}
              <div className="p-4 border border-base-300 rounded-lg mt-4">
                <h3 className="font-bold">2. State Dependencies</h3>
                <code className="text-sm text-info my-2 block">
                  useEffect(..., [count])
                </code>
                <p className="text-sm opacity-80 mb-3">
                  The effect runs on mount and whenever a value in the
                  dependency array changes. The cleanup for the *previous*
                  effect runs *before* the next effect.
                </p>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setUseStateCount((prevCount) => prevCount + 1)}
                >
                  Increment State Count
                </button>
              </div>

              {/* Demo 3: No Dependencies */}
              <div className="p-4 border border-base-300 rounded-lg mt-4">
                <h3 className="font-bold">3. No Dependency Array</h3>
                <code className="text-sm text-warning my-2 block">
                  useEffect(...)
                </code>
                <p className="text-sm opacity-80 mb-3">
                  Omitting the array causes the effect to run after{" "}
                  <strong>every single render</strong>. Use this with caution.
                  Click any button that causes a re-render to see it fire.
                </p>
                <p className="text-sm opacity-80 mb-3">
                  This won't cause multiple every render logs to prevent
                  infinite loop
                </p>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => setNoDepToggle((prev) => !prev)}
                >
                  Trigger Generic Re-render
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - LOGS */}
        <div className="flex flex-col gap-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title">Live Output & Logs</h2>
                <div className="flex gap-2">
                  <button className="btn btn-ghost btn-xs" onClick={clearLogs}>
                    Clear
                  </button>
                  <button className="btn btn-neutral btn-xs" onClick={reset}>
                    Reset All
                  </button>
                </div>
              </div>

              {showChild && <ChildExample handleEffect={handleChildEffects} />}

              <div
                className="bg-neutral text-neutral-content rounded-lg p-4 mt-4 h-96 overflow-y-auto font-mono text-sm"
                ref={logContainerRef}
              >
                {logs.length === 0 ? (
                  <div className="opacity-50">Logs will appear here...</div>
                ) : (
                  <ul className="space-y-2">
                    {logs.map((log) => (
                      <li key={log.id} className="flex items-start gap-3">
                        <span
                          className={`badge badge-sm mt-1 ${
                            logTypeToColor[log.type]
                          }`}
                        >
                          {log.type.replace("-", " ")}
                        </span>
                        <span>{log.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseEffectGuide;
