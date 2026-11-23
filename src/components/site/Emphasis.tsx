/**
 * A headline with its last word as the accent ("Find Your *Place*"), for
 * headings that come as one string. Headings with a hand-picked accent pass
 * it as a separate span instead.
 */
export function Emphasis({ text }: { text: string }) {
  const at = text.lastIndexOf(" ");
  if (at < 0) return <span className="text-together">{text}</span>;
  return (
    <>
      {text.slice(0, at)} <span className="text-together">{text.slice(at + 1)}</span>
    </>
  );
}
