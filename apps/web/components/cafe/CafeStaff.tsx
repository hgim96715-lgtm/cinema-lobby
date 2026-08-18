type Props = {
  speech: string;
  onPersonClick?: () => void;
};

export function CafeStaff({ speech, onPersonClick }: Props) {
  return (
    <div className="cafe-staff">
      <p className="cafe-staff-speech" role="status" key={speech}>
        {speech}
      </p>
      <button
        type="button"
        className="cafe-staff-person"
        onClick={onPersonClick}
        aria-label="주의사항 보기"
      >
        <span className="cafe-staff-visor" />
        <span className="cafe-staff-head">
          <span className="cafe-staff-face">
            <span className="cafe-staff-eye" />
            <span className="cafe-staff-eye" />
            <span className="cafe-staff-blush" />
            <span className="cafe-staff-blush" />
            <span className="cafe-staff-mouth" />
          </span>
        </span>
        <span className="cafe-staff-bow" />
        <span className="cafe-staff-body">
          <span className="cafe-staff-apron" />
        </span>
      </button>
    </div>
  );
}
