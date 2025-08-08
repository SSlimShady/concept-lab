"use client";

import { useState } from "react";

// Placeholder for lucide-react icons
const Bot = () => "🤖";
const User = () => "👤";
const Send = () => "➤";
const Loader = () => "...";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);
  const [ragMode, setRagMode] = useState(false);
  const [context, setContext] = useState("");
  const [indexName, setIndexName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setChatHistory((prev) => [...prev, { role: "user", content: message }]);
    setMessage("");
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const handleSetContext = async () => {
    if (!context.trim()) return;
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const handleClearAllContexts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/api/context/all`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setIndexName("");
      setContext(""); // Clear context input as well
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to clear all contexts."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start mb-4 ${
                msg.role === "user" ? "justify-end" : ""
              }`}
            >
              {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                  <Bot />
                </div>
              )}
              <div
                className={`p-3 rounded-lg ${
                  msg.role === "user" ? "bg-blue-500 text-white" : "bg-white"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center ml-3">
                  <User />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center">
              <Loader />
            </div>
          )}
          {error && <div className="text-red-500 text-center">{error}</div>}
        </div>
      </div>
      <div className="p-4 bg-white border-t">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={ragMode}
              onChange={() => setRagMode(!ragMode)}
              className="mr-2"
            />
            <label>RAG Mode</label>
          </div>
          {ragMode && (
            <div className="flex flex-col mb-2">
              <div className="flex">
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Enter context text or URL"
                  className="flex-grow p-2 border rounded-l-md"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSetContext}
                  className="px-4 py-2 bg-blue-500 text-white rounded-r-md"
                  disabled={isLoading}
                >
                  Set Context
                </button>
              </div>
              {
                <button
                  onClick={handleClearAllContexts}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md"
                  disabled={isLoading}
                >
                  Clear Context
                </button>
              }
            </div>
          )}
          <div className="flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow p-2 border rounded-l-md"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md"
              disabled={isLoading}
            >
              <Send />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
