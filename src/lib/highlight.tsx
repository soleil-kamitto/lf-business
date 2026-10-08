// Text wrapped in *asterisks* renders in the warm brand gradient, so the
// accent word stays editable from /admin instead of being fixed in the markup.
export function Highlight({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*([^*]+)\*/g).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="text-gradient-warm">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
