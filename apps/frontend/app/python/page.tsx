import Link from "next/link";

const concepts = [
  { href: "/python/decorators", label: "Decorators", color: "btn-primary" },
  {
    href: "/python/generators-vs-iterators",
    label: "Generators vs Iterators",
    color: "btn-accent",
  },
];

const PythonGuide = () => {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-secondary text-2xl mb-4">
            Python Concepts
          </h2>
          <p className="mb-4">
            Explore various Python concepts, with examples provided by a FastAPI
            backend.
          </p>
          <ul className="menu menu-vertical rounded-box bg-base-200 shadow w-full space-y-3">
            {concepts.map((concept) => (
              <li key={concept.href}>
                <Link
                  className={`btn btn-outline w-full ${concept.color}`}
                  href={concept.href}
                >
                  {concept.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PythonGuide;
