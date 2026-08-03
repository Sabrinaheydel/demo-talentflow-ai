type BadgeTone = "primary" | "success" | "warning" | "danger" | "neutral";

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

const toneClassMap: Record<BadgeTone, string> = {
  primary: "badge--primary",
  success: "badge--success",
  warning: "badge--warning",
  danger: "badge--danger",
  neutral: "badge--neutral",
};

export function Badge({ label, tone = "neutral" }: BadgeProps) {
  return <span className={`badge ${toneClassMap[tone]}`}>{label}</span>;
}
