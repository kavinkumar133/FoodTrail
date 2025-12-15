export default function RatingStars({ value = 0, onChange }) {
  return (
    <div style={{ display: 'inline-flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          onClick={() => onChange && onChange(i)}
          style={{
            cursor: onChange ? 'pointer' : 'default',
            fontSize: 20,
            color: i <= value ? '#f5b301' : '#d1d5db'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
