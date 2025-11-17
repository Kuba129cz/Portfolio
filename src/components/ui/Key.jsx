export default function Key({ label, desc, active, wide, className = "", style }) {
  return (
    <div
      className={`key ${wide ? "wide" : ""} ${active ? "active" : ""} ${className}`}
      style={style}
    >
      <span className="key-label">{label}</span>
      <span className="key-desc">{desc}</span>
    </div>
  );
}