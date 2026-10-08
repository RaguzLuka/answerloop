/** A Messages-style mock of the text-back as the caller receives it. */
export default function SmsPreview({ sender, text }: { sender: string; text: string }) {
  const parts = text.split(/(https?:\/\/\S+)/g);
  return (
    <div className="mx-auto w-full max-w-[300px] overflow-hidden rounded-[2rem] border-[7px] border-[#0d1426] bg-white shadow-[0_30px_60px_-30px_rgba(12,27,56,0.45)]">
      <div className="flex flex-col items-center gap-1 border-b border-line bg-[#f9fafc] pb-2.5 pt-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b from-[#a9c1fb] to-[#5f8cf3] text-sm font-semibold text-white">
          {sender.slice(0, 2).toUpperCase()}
        </span>
        <span className="text-xs font-medium text-ink">{sender}</span>
      </div>
      <div className="min-h-56 space-y-2 px-3 py-4">
        <p className="text-center text-[10px] text-muted">Text Message · now</p>
        <div className="max-w-[88%] whitespace-pre-wrap break-words rounded-2xl rounded-bl-md bg-[#eef1f6] px-3.5 py-2.5 text-[13px] leading-snug text-ink">
          {parts.map((p, i) =>
            /^https?:\/\//.test(p) ? (
              <span key={i} className="text-blue underline">{p}</span>
            ) : (
              <span key={i}>{p}</span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
