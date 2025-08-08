"use client";

import { useState } from "react";
import CodeBlock from "../../../components/CodeBlock";

const iteratorCode = `
class NumberIterator:
    """A custom iterator that yields numbers up to a max value."""
    def __init__(self, max_val):
        self.max_val = max_val
        self.current = 0

    def __iter__(self):
        # An iterator object must return itself from __iter__
        return self

    def __next__(self):
        # The __next__ method returns the next value
        if self.current < self.max_val:
            self.current += 1
            return self.current
        else:
            # and raises StopIteration when it's exhausted
            raise StopIteration

# Usage:
# my_iterator = NumberIterator(5)
# for number in my_iterator:
#     print(number) # 1, 2, 3, 4, 5
`;

const generatorCode = `
import time

def slow_generator():
    """A generator that yields data with a delay."""
    for i in range(5):
        # The 'yield' keyword pauses the function and returns a value.
        # State is saved until the next call.
        yield f"Item {i+1}"
        time.sleep(0.5)

# Usage:
# for item in slow_generator():
#     print(item) # 'Item 1', 'Item 2', ...
`;

const memoryCode = `
# Approach 1: List Comprehension (High Memory)
# Creates a massive list in memory all at once.
large_list = [i*i for i in range(1_000_000)]

# Approach 2: Generator Expression (Low Memory)
# Creates a generator object. Values are produced on-demand.
large_generator = (i*i for i in range(1_000_000))
`;

const GeneratorsVsIteratorsPage = () => {
  const [iteratorData, setIteratorData] = useState<any>(null);
  const [iteratorLoading, setIteratorLoading] = useState(false);

  const [generatorItems, setGeneratorItems] = useState<string[]>([]);
  const [generatorLoading, setGeneratorLoading] = useState(false);

  const [memoryData, setMemoryData] = useState<any>(null);
  const [memoryLoading, setMemoryLoading] = useState(false);

  const handleFetchIterator = async () => {
    setIteratorLoading(true);
    setIteratorData(null);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/python/iterator-class`
    );
    const data = await res.json();
    setIteratorData(data);
    setIteratorLoading(false);
  };

  const handleStreamGenerator = async () => {
    setGeneratorLoading(true);
    setGeneratorItems([]);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/python/generators`
      );
      if (!response.body) throw new Error("Response body is null.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const cleanedChunk = chunk.replace("data: ", "").trim();
        if (cleanedChunk) {
          setGeneratorItems((prev) => [...prev, cleanedChunk]);
        }
      }
    } finally {
      setGeneratorLoading(false);
    }
  };

  const handleFetchMemory = async () => {
    setMemoryLoading(true);
    setMemoryData(null);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/python/memory-demo`
    );
    const data = await res.json();
    setMemoryData(data);
    setMemoryLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-primary">
        Generators vs. Iterators
      </h1>
      <p className="mb-6 text-lg opacity-80">
        Both are used for iteration, but they are created and behave
        differently. The key difference is that generators are a simpler way to
        create iterators and are far more memory-efficient.
      </p>

      {/* Iterator Section */}
      <div className="card bg-base-200 shadow-lg mb-8">
        <div className="card-body">
          <h2 className="card-title">The Iterator: A Stateful Object</h2>
          <p className="text-sm opacity-80 mb-4">
            An iterator is an object that implements the iterator protocol,
            which consists of the <code>__iter__()</code> and{" "}
            <code>__next__()</code> methods. They are generally implemented as
            classes and hold their state in instance variables (e.g.,{" "}
            <code>self.current</code>).
          </p>
          <CodeBlock code={iteratorCode} language="python" />
          <div className="card-actions my-4">
            <button
              className="btn btn-primary btn-sm"
              onClick={handleFetchIterator}
              disabled={iteratorLoading}
            >
              {iteratorLoading ? "Fetching..." : "Run Iterator Example"}
            </button>
          </div>
          <div className="mockup-code bg-neutral text-neutral-content min-h-[6rem]">
            <pre className="p-4">
              {iteratorData && (
                <code>{JSON.stringify(iteratorData, null, 2)}</code>
              )}
            </pre>
          </div>
        </div>
      </div>

      {/* Generator Section */}
      <div className="card bg-base-200 shadow-lg mb-8">
        <div className="card-body">
          <h2 className="card-title">The Generator: A Simpler Syntax</h2>
          <p className="text-sm opacity-80 mb-4">
            A generator is a special kind of function that returns a lazy
            iterator. It uses the <code>yield</code> keyword to produce a
            sequence of values over time, pausing execution and saving its state
            between each call. This avoids writing a full class.
          </p>
          <CodeBlock code={generatorCode} language="python" />
          <div className="card-actions my-4">
            <button
              className="btn btn-accent btn-sm"
              onClick={handleStreamGenerator}
              disabled={generatorLoading}
            >
              {generatorLoading && !generatorItems.length
                ? "Streaming..."
                : "Start Streaming"}
            </button>
          </div>
          <div className="mockup-code bg-neutral text-neutral-content min-h-[6rem]">
            {generatorItems.map((item, i) => (
              <pre key={i} className="p-1 px-4">
                <code>Received: {item}</code>
              </pre>
            ))}
            {generatorLoading && generatorItems.length > 0 && (
              <pre className="p-1 px-4 opacity-50">
                <code>Waiting for next item...</code>
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Memory Section */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">
            Key Difference: Memory Efficiency (Lazy Evaluation)
          </h2>
          <p className="text-sm opacity-80 mb-4">
            Generators produce items one at a time and only when needed ("lazy
            evaluation"). In contrast, creating a large list stores every single
            element in memory at once. This makes generators ideal for working
            with large data streams or files.
          </p>
          <CodeBlock code={memoryCode} language="python" />
          <div className="card-actions my-4">
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleFetchMemory}
              disabled={memoryLoading}
            >
              {memoryLoading ? "Fetching..." : "Run Memory Comparison"}
            </button>
          </div>
          {memoryData && (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Approach</th>
                    <th>Explanation</th>
                    <th className="text-center">Memory Impact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>List Comprehension</td>
                    <td>{memoryData.list_comprehension.explanation}</td>
                    <td className="text-center">
                      <span className="badge badge-error badge-lg">
                        {memoryData.list_comprehension.memory_impact}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Generator Expression</td>
                    <td>{memoryData.generator_expression.explanation}</td>
                    <td className="text-center">
                      <span className="badge badge-success badge-lg">
                        {memoryData.generator_expression.memory_impact}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratorsVsIteratorsPage;
