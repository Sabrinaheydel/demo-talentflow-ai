type IconName =
  | "spark"
  | "trend"
  | "calendar"
  | "users"
  | "briefcase"
  | "bell"
  | "settings"
  | "chevron"
  | "grid"
  | "arrow";

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
};

export function Icon({ name, size = 18, className = "" }: IconProps) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (name) {
    case "spark":
      return (
        <svg {...commonProps}>
          <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z" />
        </svg>
      );
    case "trend":
      return (
        <svg {...commonProps}>
          <path d="M3 17l5-5 4 4 9-10" />
          <path d="M14 6h7v7" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...commonProps}>
          <rect x="3" y="5" width="18" height="15" rx="2" />
          <path d="M3 10h18" />
          <path d="M8 3v4" />
          <path d="M16 3v4" />
        </svg>
      );
    case "users":
      return (
        <svg {...commonProps}>
          <path d="M16 19v-1a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v1" />
          <circle cx="10" cy="8" r="3" />
          <path d="M18 8a2 2 0 1 0 0 4" />
          <path d="M20 15a2 2 0 0 0-2-2" />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...commonProps}>
          <rect x="3" y="7" width="18" height="12" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M12 12v2" />
        </svg>
      );
    case "bell":
      return (
        <svg {...commonProps}>
          <path d="M15 17H5a2 2 0 0 1-2-2 2 2 0 0 1 1-1.7L5 12V9a5 5 0 0 1 10 0v3l1 2.3a2 2 0 0 1 1 1.7 2 2 0 0 1-2 2h-4" />
          <path d="M10 17a2 2 0 0 0 4 0" />
        </svg>
      );
    case "settings":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19 12a7 7 0 0 0-.1-1.1l2-1.5-2-3.4-2.4 1a7 7 0 0 0-1.9-1.1L14 2h-4l-.6 2.9a7 7 0 0 0-1.9 1.1l-2.4-1-2 3.4 2 1.5A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.1l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 1.9 1.1L10 22h4l.6-2.9a7 7 0 0 0 1.9-1.1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1.1z" />
        </svg>
      );
    case "chevron":
      return (
        <svg {...commonProps}>
          <path d="m7 10 5 5 5-5" />
        </svg>
      );
    case "grid":
      return (
        <svg {...commonProps}>
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...commonProps}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );
    default:
      return null;
  }
}
