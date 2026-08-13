export function GuestFigure() {
  return (
    <div className="lobby-guest-figure" aria-hidden>
      <span className="lobby-guest-head">
        <span className="lobby-face">
          <span className="lobby-face-eye" />
          <span className="lobby-face-eye" />
          <span className="lobby-face-mouth" />
        </span>
      </span>
      <span className="lobby-guest-body" />
    </div>
  );
}
