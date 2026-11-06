export type JamesVerse = {
  number: number;
  text: string;
};

export type JamesOutlinePoint = {
  heading: string;
  reference: string;
  body: string;
  reflection: string[];
  application: string[];
};

export type JamesLesson = {
  number: number;
  title: string;
  /** ISO date (YYYY-MM-DD) from the lesson's Study Date — the Sunday the class discusses it. */
  studyDate: string;
  passage: {
    reference: string;
    translation: string;
    verses: JamesVerse[];
  };
  overview: string;
  outline: JamesOutlinePoint[];
  conclusion: string;
  nextSteps: string[];
  nextLessonPassage?: string;
};

export const jamesSeries = {
  title: "Journey Through James",
  slug: "james",
  eyebrow: "Builders Sunday School Class",
  season: "Winter 2026",
  description:
    "Our class is walking through the book of James this winter. Each lesson is posted here before we meet so you can read the passage, think through the questions, and come ready to discuss.",
  howToUse: [
    "Read the passage for the week during your personal devotion.",
    "Work through the outline and sit with the Reflection questions.",
    "Choose one Application step to practice before class.",
    "Bring your thoughts to class on the study date.",
  ],
  scriptureNotice:
    "Scripture quotations are taken from the Holy Bible, New Living Translation, copyright ©1996, 2004, 2015 by Tyndale House Foundation. Used by permission of Tyndale House Publishers, Carol Stream, Illinois 60188. All rights reserved.",
};

export const jamesLessons: JamesLesson[] = [
  {
    number: 3,
    title: "Winning The Battle Within",
    studyDate: "2026-11-08",
    passage: {
      reference: "James 1:12–15",
      translation: "NLT",
      verses: [
        {
          number: 12,
          text: "God blesses those who patiently endure testing and temptation. Afterward they will receive the crown of life that God has promised to those who love him.",
        },
        {
          number: 13,
          text: "And remember, when you are being tempted, do not say, “God is tempting me.” God is never tempted to do wrong, and he never tempts anyone else.",
        },
        {
          number: 14,
          text: "Temptation comes from our own desires, which entice us and drag us away.",
        },
        {
          number: 15,
          text: "These desires give birth to sinful actions. And when sin is allowed to grow, it gives birth to death.",
        },
      ],
    },
    overview:
      "Although our lives are riddled with temptation and tests, thank God that we can choose life. James challenges us to deliberately choose faithfulness to God over our own desires. We can find motivation by remembering the promise of favor and eternal life if we endure our tests with integrity.",
    outline: [
      {
        heading: "The Favor of Endurance",
        reference: "James 1:12",
        body: "Temptation and tests can sometimes become so strong that all we see is the problem in front of us. James encourages us to keep the reward of resisting and enduring in view. If we remain faithful to God as we endure tests and trials, we will receive His favor. Our faith is defined and measured by our loyalty to Christ through all circumstances. We should not feel bad about looking toward reward. Valuing the reward He has promised us says something about how much we love Him.",
        reflection: [
          "Do you find yourself losing sight of the benefits of overcoming tests and trials faithfully?",
          "What are some of the benefits that you have experienced when not succumbing to trials and temptations?",
          "Does the promise in verse 12 appeal to you at all when thinking about tests or trials you are experiencing right now?",
        ],
        application: [
          "When you feel like giving in pause and pray; thanking Jesus for his promise",
          "Establish a relationship with an accountability partner who can help remind you of the blessing of faithfulness to Jesus through trials",
        ],
      },
      {
        heading: "The Source of Temptation",
        reference: "James 1:13-14",
        body: "Who is responsible for our temptation? We are. That is James's answer to how temptation comes about in our lives. God allows tests, but because God detests sin, he does not tempt us to sin. Tests sometimes create an opportunity for temptation to arise, but it arises because of our sinful nature or “desire,” as James defines it. Therefore, our battle is with our own desire. Temptation is unfortunately part of the human experience. Experiencing temptation does not mean you are not a growing Christian. How we respond defines our growth. We must flee temptation before it wrecks us. (2 Timothy 2:22)",
        reflection: [
          "Can you draw a clear line between tests in your life and temptation that you experience?",
          "Can you draw a clear line between stress in your life and the temptation that you experience?",
          "What are some ways you believe Christians should manage their personal lives while dealing with tests based on James 1:12-15?",
        ],
        application: [
          "Create a note that you can keep handy in your Bible or on your phone that reminds you of what you should do when temptation arises.",
          "Take some time to memorize passages of scripture that remind us of the power we have over temptation through Jesus.",
        ],
      },
      {
        heading: "The Fruit of Desire",
        reference: "James 1:15",
        body: "James makes it very clear that it is not temptation itself that drives us toward ruin. It is our desire and how that desire causes us to respond to temptation. What is most dangerous about the way this series of failures works is that the destruction it causes doesn’t normally happen overnight. It is a slow methodical process that pulls us in deeper and takes us further until it finally ruins things in our lives. Relationships, opportunities, finances, careers- all are ruined by a series of decisions based on desires that lead us away from God.",
        reflection: [
          "Have you ever watched a promising career or life destroy itself?",
          "Can you identify any of these slow moving marches towards destruction in your own life?",
          "Since you have not been destroyed who do you credit with the survival of your relationship, career, life?",
        ],
        application: [
          "Commit stamping out desire that wants to lead you away from God",
          "Repent and ask God to deliver you from any desire that might be leading you astray",
        ],
      },
    ],
    conclusion:
      "God promises us favor and blessing if we remain faithful during our tests. He warns us of destruction if we fold under pressure. Jesus gives us power over temptation and victory in the face our tests. Let our faith in Him grow so that when temptation comes, it does not win.",
    nextSteps: ["Do some heart work this week to examine how you’re performing under trials"],
    nextLessonPassage: "James 1:19-21",
  },
];

export function getJamesLesson(value: string | number) {
  const number = typeof value === "number" ? value : Number.parseInt(value, 10);
  return jamesLessons.find((lesson) => lesson.number === number);
}

export function getAdjacentJamesLessons(number: number) {
  const ordered = [...jamesLessons].sort((a, b) => a.number - b.number);
  const index = ordered.findIndex((lesson) => lesson.number === number);
  return {
    previous: index > 0 ? ordered[index - 1] : undefined,
    next: index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : undefined,
  };
}

/** "Sunday, November 8, 2026" — parsed as a calendar date so it never shifts by time zone. */
export function formatStudyDate(iso: string, style: "long" | "short" = "long") {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: style === "long" ? "long" : "short",
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
