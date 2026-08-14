type Props = {
  speech: string;
  /** 말풍선 옆 액션 (발급받기 등) */
  actionLabel?: string;
  actionDisabled?: boolean;
  onAction?: () => void;
  /** 직원 클릭 (발급 / 입장 등) */
  onPersonClick?: () => void;
  personLabel?: string;
};

export function Staff({
  speech,
  actionLabel,
  actionDisabled,
  onAction,
  onPersonClick,
  personLabel,
}: Props) {
  const interactive = Boolean(onPersonClick);

  return (
    <div className="lobby-staff">
      <div className="lobby-staff-speech-row">
        <p
          className="lobby-speech lobby-speech--staff"
          role="status"
          key={speech}
        >
          {speech}
        </p>
        {actionLabel && onAction ? (
          <button
            type="button"
            className="lobby-speech-action"
            disabled={actionDisabled}
            onClick={onAction}
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
      {interactive ? (
        <button
          type="button"
          className="lobby-staff-person lobby-staff-person--btn"
          onClick={onPersonClick}
          aria-label={personLabel ?? '직원'}
        >
          <StaffFigure />
        </button>
      ) : (
        <span className="lobby-staff-person" aria-hidden>
          <StaffFigure />
        </span>
      )}
    </div>
  );
}

function StaffFigure() {
  return (
    <>
      <span className="lobby-staff-cap" aria-hidden />
      <span className="lobby-staff-head">
        <span className="lobby-face">
          <span className="lobby-face-eye" />
          <span className="lobby-face-eye" />
          <span className="lobby-face-blush" />
          <span className="lobby-face-blush" />
          <span className="lobby-face-mouth" />
        </span>
      </span>
      <span className="lobby-staff-body" />
    </>
  );
}
