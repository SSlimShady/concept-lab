import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="hero bg-base-100 rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <div className="hero-content flex-col">
          <h2 className="text-3xl font-bold text-primary mb-2">
            <Link href="/">Welcome to Concept Lab</Link>
          </h2>
          <p className="text-base-content mb-4">
            Explore <span className="font-semibold text-secondary">React</span>,{" "}
            <span className="font-semibold text-secondary">Python</span>,{" "}
            <span className="font-semibold text-secondary">SQL</span>,{" "}
            <span className="font-semibold text-secondary">NoSQL</span>, and{" "}
            <span className="font-semibold text-secondary">FastAPI</span>{" "}
            concepts from beginner to advanced.
          </p>
          <ul className="menu menu-vertical rounded-box bg-base-200 shadow w-full max-w-xs space-y-3">
            <li>
              <Link
                className="btn btn-outline btn-primary w-full"
                href="/react"
              >
                React
              </Link>
            </li>
            <li>
              <Link
                className="btn btn-outline btn-secondary w-full"
                href="/python"
              >
                Python
              </Link>
            </li>
            <li>
              <Link className="btn btn-outline btn-accent w-full" href="/sql">
                SQL
              </Link>
            </li>
            <li>
              <Link className="btn btn-outline btn-info w-full" href="/nosql">
                NoSQL
              </Link>
            </li>
            <li>
              <Link
                className="btn btn-outline btn-warning w-full"
                href="/fastapi"
              >
                FastAPI
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
