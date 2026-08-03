type UpcomingInterviewsProps = {
  language: "en" | "fr";
};

const interviews = [
  {
    titleEn: "Panel interview",
    titleFr: "Entretien de panel",
    name: "Nadia & team",
    time: "09:30",
  },
  {
    titleEn: "Hiring manager sync",
    titleFr: "Synchronisation RH",
    name: "Owen Brooks",
    time: "14:00",
  },
  {
    titleEn: "Offer review",
    titleFr: "Révision d’offre",
    name: "Finance team",
    time: "16:30",
  },
];

export function UpcomingInterviews({ language }: UpcomingInterviewsProps) {
  return (
    <div className="stack-list">
      {interviews.map((interview) => (
        <div key={interview.time} className="stack-list__item">
          <div>
            <p className="stack-list__title">{language === "en" ? interview.titleEn : interview.titleFr}</p>
            <p className="stack-list__meta">{interview.name}</p>
          </div>
          <span className="stack-list__time">{interview.time}</span>
        </div>
      ))}
    </div>
  );
}
