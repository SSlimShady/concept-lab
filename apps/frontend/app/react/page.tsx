import Link from "next/link";

const ReactGuide = () => {
  return (
    <div>
      <ul>
        <li>
          <Link href="/react/use-effect">Go to useEffect Guide</Link>
        </li>
        <li>
          <Link href="/react/use-context">Go to useContext Guide</Link>
        </li>
        <li>
          <Link href="/react/use-memo">Go to useMemo Guide</Link>
        </li>
        <li>
          <Link href="/react/use-callback">Go to useCallback Guide</Link>
        </li>
        <li>
          <Link href="/react/use-reducer">Go to useReducer Guide</Link>
        </li>
      </ul>
    </div>
  );
};

export default ReactGuide;
