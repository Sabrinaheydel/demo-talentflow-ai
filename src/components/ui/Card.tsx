type CardProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function Card({ title, description, children, className = "" }: CardProps) {
  return (
    <section className={`section-card ${className}`.trim()}>
      {title ? (
        <div className="section-card__header">
          <div>
            <h3>{title}</h3>
            {description ? <p>{description}</p> : null}
          </div>
        </div>
      ) : null}
      {children}
    </section>
  );
}
