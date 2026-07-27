type DigitalSectionTitleProps = {
  label: string;
  className?: string;
};

export default function DigitalSectionTitle({
  label,
  className = "",
}: DigitalSectionTitleProps) {
  return (
    <span
      className={`digital-section-title ${className}`.trim()}
      aria-label={label}
    >
      {label.split("").map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          className="digital-section-title__letter"
          style={{ animationDelay: `${index * 80}ms` }}
          aria-hidden="true"
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
