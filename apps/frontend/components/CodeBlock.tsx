interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock = ({ code, language }: CodeBlockProps) => {
  return (
    <div className="mockup-code text-left">
      <pre data-prefix="$" className="text-success">
        <code># Language: {language}</code>
      </pre>
      {code
        .trim()
        .split("\n")
        .map((line, i) => (
          <pre key={i} data-prefix={i + 1}>
            <code>{line}</code>
          </pre>
        ))}
    </div>
  );
};

export default CodeBlock;
