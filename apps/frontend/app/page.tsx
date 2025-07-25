import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h2>
        {" "}
        <Link href="/">Welcome to Concept Lab</Link>
      </h2>
      <p>
        Explore React, Python, SQL, NoSQL, and FastAPI concepts from beginner to
        advanced.
      </p>
      <ul>
        <li>
          <a href="/react">React</a>
        </li>
        <li>
          <a href="/python">Python</a>
        </li>
        <li>
          <a href="/sql">SQL</a>
        </li>
        <li>
          <a href="/nosql">NoSQL</a>
        </li>
        <li>
          <a href="/fastapi">FastAPI</a>
        </li>
      </ul>
    </div>
  );
}
