export function Staff({ speech }: { speech: string }) {
  return (
    <div className="lobby-staff">
      <p
        className="lobby-speech lobby-speech--staff"
        role="status"
        key={speech}
      >
        {speech}
      </p>
      <span className="lobby-staff-person" aria-hidden>
        <span className="lobby-staff-head">
          <span className="lobby-face">
            <span className="lobby-face-eye" />
            <span className="lobby-face-eye" />
            <span className="lobby-face-mouth" />
          </span>
        </span>
        <span className="lobby-staff-body" />
      </span>
    </div>
  );
}
