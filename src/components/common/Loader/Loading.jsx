export default function Loading({
  text = "Loading",
  size = "md",
  centered = false,
  className = "",
  spinnerClassName = "",
  textClassName = "",
}) {
  const sizeMap = {
    sm: "size-4 border-2",
    md: "size-5 border-2",
    lg: "size-6 border-[3px]",
  };

  return (
    <div
      className={[
        "flex items-center gap-3",
        centered ? "justify-center text-center" : "",
        className,
      ].join(" ")}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span
        aria-hidden
        className={[
          "inline-block shrink-0 animate-spin rounded-full border-solid border-(--active) border-r-transparent",
          sizeMap[size] || sizeMap.md,
          spinnerClassName,
        ].join(" ")}
      />
      <span
        className={["text-sm text-(--secondary-text)", textClassName].join(" ")}
      >
        {text}
      </span>
    </div>
  );
}
