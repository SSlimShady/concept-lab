import Link from "next/link";

const guides = [
  { href: "/react/use-effect", label: "useEffect Guide", color: "btn-primary" },
  {
    href: "/react/use-context",
    label: "useContext Guide",
    color: "btn-secondary",
  },
  { href: "/react/use-memo", label: "useMemo Guide", color: "btn-accent" },
  {
    href: "/react/use-callback",
    label: "useCallback Guide",
    color: "btn-info",
  },
  {
    href: "/react/use-reducer",
    label: "useReducer Guide",
    color: "btn-warning",
  },
];

const ReactGuide = () => {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-primary text-2xl mb-4">
            React Hooks Guide
          </h2>
          <ul className="menu menu-vertical rounded-box bg-base-200 shadow w-full space-y-3">
            {guides.map((guide) => (
              <li key={guide.href}>
                <Link
                  className={`btn btn-outline w-full ${guide.color}`}
                  href={guide.href}
                >
                  {guide.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReactGuide;
