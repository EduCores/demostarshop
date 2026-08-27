/* Adorno de fondo: estrellas estáticas distribuidas aleatoriamente (posiciones deterministas para evitar mismatch de hidratación). */
const STARS = [
  { top: "8%", left: "12%", size: 16, opacity: 0.25, rotate: 8 },
  { top: "22%", left: "82%", size: 12, opacity: 0.18, rotate: -14 },
  { top: "35%", left: "45%", size: 22, opacity: 0.3, rotate: 20 },
  { top: "14%", left: "64%", size: 10, opacity: 0.15, rotate: 0 },
  { top: "48%", left: "8%", size: 18, opacity: 0.22, rotate: -8 },
  { top: "60%", left: "75%", size: 14, opacity: 0.2, rotate: 12 },
  { top: "72%", left: "30%", size: 24, opacity: 0.28, rotate: -20 },
  { top: "85%", left: "55%", size: 12, opacity: 0.16, rotate: 6 },
  { top: "30%", left: "20%", size: 11, opacity: 0.18, rotate: 0 },
  { top: "55%", left: "92%", size: 16, opacity: 0.24, rotate: 14 },
  { top: "90%", left: "15%", size: 13, opacity: 0.17, rotate: -10 },
  { top: "5%", left: "40%", size: 14, opacity: 0.2, rotate: 18 },
  { top: "40%", left: "60%", size: 10, opacity: 0.14, rotate: 0 },
  { top: "66%", left: "48%", size: 20, opacity: 0.26, rotate: -16 },
  { top: "18%", left: "28%", size: 12, opacity: 0.18, rotate: 10 },
  { top: "78%", left: "85%", size: 15, opacity: 0.22, rotate: -6 },
  { top: "50%", left: "35%", size: 11, opacity: 0.16, rotate: 4 },
  { top: "25%", left: "90%", size: 18, opacity: 0.24, rotate: 22 },
  { top: "62%", left: "18%", size: 13, opacity: 0.18, rotate: -12 },
  { top: "95%", left: "70%", size: 16, opacity: 0.2, rotate: 8 },
  { top: "44%", left: "76%", size: 10, opacity: 0.14, rotate: 0 },
  { top: "12%", left: "52%", size: 20, opacity: 0.26, rotate: -18 },
  { top: "82%", left: "40%", size: 12, opacity: 0.18, rotate: 6 },
  { top: "33%", left: "12%", size: 14, opacity: 0.2, rotate: 16 },
  { top: "70%", left: "63%", size: 11, opacity: 0.16, rotate: -4 },
  { top: "58%", left: "55%", size: 17, opacity: 0.23, rotate: 10 },
  { top: "6%", left: "74%", size: 13, opacity: 0.18, rotate: -10 },
  { top: "88%", left: "28%", size: 15, opacity: 0.21, rotate: 14 },
  { top: "27%", left: "38%", size: 10, opacity: 0.14, rotate: 0 },
  { top: "52%", left: "88%", size: 19, opacity: 0.25, rotate: -22 },
];

export function Starfield() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {STARS.map((s, i) => (
        <img
          key={i}
          src="/star2.svg"
          alt=""
          className="star-logo absolute"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            transform: `rotate(${s.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
