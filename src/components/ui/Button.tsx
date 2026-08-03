type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  label: string;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  onClick?: () => void;
};

const variantClassMap: Record<ButtonVariant, string> = {
  primary: "btn btn--primary",
  secondary: "btn btn--secondary",
  ghost: "btn btn--ghost",
};

export function Button({
  label,
  variant = "primary",
  icon,
  onClick,
}: ButtonProps) {
  return (
    <button type="button" className={variantClassMap[variant]} onClick={onClick}>
      {icon ? <span className="btn__icon">{icon}</span> : null}
      <span>{label}</span>
    </button>
  );
}
