"use client";

import { useEffect, useRef, useState } from "react";

// Minimal inline icons (no extra deps)
const Send = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const TypingDots = () => (
  <div className="flex items-center gap-1 px-3 py-2">
    <span className="h-2 w-2 animate-bounce rounded-full bg-base-content [animation-delay:-0.3s]"></span>
    <span className="h-2 w-2 animate-bounce rounded-full bg-base-content [animation-delay:-0.15s]"></span>
    <span className="h-2 w-2 animate-bounce rounded-full bg-base-content"></span>
  </div>
);

const Spinner = () => (
  <span className="loading loading-spinner loading-xs" aria-label="loading" />
);

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);
  const [ragMode, setRagMode] = useState(false);
  const [context, setContext] = useState("");
  const [indexName, setIndexName] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSettingContext, setIsSettingContext] = useState(false);
  const [isClearingContext, setIsClearingContext] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isSending]);

  const canSend =
    !isSending &&
    message.trim().length > 0 &&
    (!ragMode || indexName.length > 0);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    if (ragMode && !indexName) return;

    setChatHistory((prev) => [...prev, { role: "user", content: message }]);
    setMessage("");
    setIsSending(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:8000/api/rag_elasticsearch/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            rag_mode: ragMode,
            index_name: indexName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";
      setChatHistory((prev) => [...prev, { role: "ai", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        aiResponse += chunk;
        setChatHistory((prev) => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].content = aiResponse;
          return newHistory;
        });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleSetContext = async () => {
    if (!context.trim()) return;
    setIsSettingContext(true);
    setError(null);

    try {
      let body;
      try {
        new URL(context);
        body = JSON.stringify({ url: context });
      } catch (_) {
        body = JSON.stringify({ text: context });
      }

      const response = await fetch("http://localhost:8000/api/context/set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setIndexName(data.index_name);
      setContext("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsSettingContext(false);
    }
  };

  const handleClearAllContexts = async () => {
    setIsClearingContext(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/api/context/all`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setIndexName("");
      setContext("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to clear all contexts."
      );
    } finally {
      setIsClearingContext(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-2xl bg-base-100 shadow-xl">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-base-200/60 bg-base-100/80 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold">Concept Lab AI</h2>
            <p className="text-xs opacity-60">
              Conversational assistant with optional RAG
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {chatHistory.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {isSending && (
          <div className="flex items-start">
            <div className="max-w-[80%] rounded-2xl border border-base-200 bg-base-200/60 p-2">
              <TypingDots />
            </div>
          </div>
        )}
        {error && (
          <div className="alert alert-error mt-2 w-fit">
            <span className="text-sm">{error}</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Bottom Controls: RAG + Input */}
      <div className="border-t border-base-200/60 bg-base-100 px-4 py-3">
        <div className="mx-auto flex max-w-4xl flex-col gap-3">
          {/* RAG Controls inline near input */}
          <div className="rounded-xl border border-base-300 bg-base-200/40 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <input
                  id="rag-toggle"
                  type="checkbox"
                  checked={ragMode}
                  onChange={() => setRagMode(!ragMode)}
                  className="toggle toggle-sm"
                />
                <label htmlFor="rag-toggle" className="text-sm font-medium">
                  RAG Mode
                </label>
              </div>
              <div className="flex items-center gap-2 text-xs opacity-80">
                {indexName ? (
                  <span className="badge badge-outline badge-sm">
                    Context set
                  </span>
                ) : ragMode ? (
                  <span className="badge badge-warning badge-sm">
                    No context
                  </span>
                ) : null}
                {indexName && (
                  <button
                    onClick={handleClearAllContexts}
                    className="btn btn-ghost btn-xs"
                    disabled={isClearingContext}
                  >
                    {isClearingContext ? <Spinner /> : "Clear"}
                  </button>
                )}
              </div>
            </div>

            {ragMode && (
              <div className="mt-2">
                <label className="mb-1 block text-xs opacity-70">
                  Context (text or URL)
                </label>
                <div className="flex gap-2">
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Paste background knowledge or a URL..."
                    className="textarea textarea-bordered textarea-sm w-full"
                    rows={2}
                    disabled={isSettingContext}
                  />
                  <button
                    onClick={handleSetContext}
                    className="btn btn-primary"
                    disabled={isSettingContext || !context.trim()}
                  >
                    {isSettingContext ? (
                      <div className="flex items-center gap-2">
                        <Spinner />
                        <span>Set</span>
                      </div>
                    ) : (
                      "Set Context"
                    )}
                  </button>
                </div>
                {ragMode && !indexName && (
                  <p className="mt-1 text-xs text-warning">
                    You must set context to enable chat in RAG mode.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Message input */}
          <div className="flex items-end gap-2 rounded-2xl border border-base-200 bg-base-200/40 p-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input input-ghost flex-1 bg-transparent focus:outline-none"
              placeholder={
                ragMode && !indexName
                  ? "Set context to enable chat..."
                  : "Send a message..."
              }
              onKeyDown={(e) =>
                e.key === "Enter" && canSend && handleSendMessage()
              }
              disabled={isSending || (ragMode && !indexName)}
            />
            <button
              onClick={handleSendMessage}
              className="btn btn-primary btn-circle"
              disabled={!canSend}
              aria-label="Send"
            >
              {isSending ? <Spinner /> : <Send />}
            </button>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs opacity-60">
            <span>Enter to send</span>
            <span>Theme aware UI via DaisyUI tokens</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  role,
  content,
}: {
  role: "user" | "ai";
  content: string;
}) {
  if (role === "user") {
    return (
      <div className="flex items-start justify-end">
        <div className="max-w-[80%] rounded-2xl bg-primary px-4 py-2 text-primary-content shadow-md">
          <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start">
      <div className="max-w-[80%] rounded-2xl border border-base-300 bg-base-100 px-4 py-2 shadow-sm">
        <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
