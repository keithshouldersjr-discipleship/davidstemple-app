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

export type JamesScriptureQuote = {
  text: string;
  reference: string;
  translation: string;
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
  /** Optional pull quote Keith places right after the overview. */
  keyIdea?: string;
  /** Heading Keith uses for each point's question list. Defaults to "Reflection". */
  reflectionLabel?: string;
  outline: JamesOutlinePoint[];
  conclusion: string;
  /** Optional Scripture Keith quotes at the end of the conclusion. */
  conclusionScripture?: JamesScriptureQuote;
  nextSteps: string[];
  nextLessonPassage?: string;
  /** Overrides the series notice when a lesson quotes more than one translation. */
  scriptureNotices?: string[];
};

/**
 * Point bodies may hold several paragraphs (separated by a blank line)
 * and **bold** run-ins, exactly as Keith writes them in Markdown.
 */

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

/** Publisher-required notices for lessons that quote more than one translation. */
export const scriptureNotices = {
  // Tyndale: when several translations are used and most come from the NLT.
  nltPrimary:
    "Unless otherwise indicated, all Scripture quotations are taken from the Holy Bible, New Living Translation, copyright ©1996, 2004, 2015 by Tyndale House Foundation. Used by permission of Tyndale House Publishers, Carol Stream, Illinois 60188. All rights reserved.",
  // Crossway: "Scripture quotations marked (ESV) are from…" form for mixed-translation works.
  esvMarked:
    "Scripture quotations marked (ESV) are from the ESV® Bible (The Holy Bible, English Standard Version®), copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.",
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
  {
    number: 4,
    title: "Building A Listening Life",
    studyDate: "2026-11-15",
    passage: {
      reference: "James 1:19–21",
      translation: "NLT",
      verses: [
        {
          number: 19,
          text: "Understand this, my dear brothers and sisters: You must all be quick to listen, slow to speak, and slow to get angry.",
        },
        {
          number: 20,
          text: "Human anger does not produce the righteousness God desires.",
        },
        {
          number: 21,
          text: "So get rid of all the filth and evil in your lives, and humbly accept the word God has planted in your hearts, for it has the power to save your souls.",
        },
      ],
    },
    overview:
      "James is encouraging us to give attention to the practice of listening as if our lives depend on it. Listening has become a lost art in our society. We can’t pay attention very long anymore because we are constantly bombarded with new information. Our newsfeeds are busy. Our lives are busy. Our minds are busy. The busyness of our lives and emotions has trained us to react, not to listen. James makes it very clear that in order for our spiritual lives to flourish, we must recover the art of listening well. Specifically, we must allow God’s word to speak to us in the midst of a busy world. We don’t listen to earn God’s love. We listen because God has already given us new life through his word (James 1:18), and that same word keeps growing us.",
    keyIdea:
      "We must learn to listen as if our lives depend on it, because listening to God’s word leads to a thriving spiritual life.",
    reflectionLabel: "Questions",
    outline: [
      {
        heading: "Hurry Up & Listen",
        reference: "James 1:19",
        body: "James gives us a three-part command for listening well. Be quick to listen, slow to speak, and slow to anger. It’s a foundational command because you can’t grow without the word, and we can’t grow from the word if we don’t listen to the word. James wants us to be eager to hear God’s word. This means we must disarm ourselves when we approach the word. Let go of cultural influences. Put away any malice or bitterness. Do away with any defensiveness. Instead, we must approach God’s word with open and humble hearts. We should give the word time to speak. Allow it to have the first and last word as to how we view the world, not telling it what the world thinks. Most of all, don’t allow anger or defensiveness to block the word of life. And it doesn’t stop with the Bible. Later James will talk about our words (3:1–12) and our fights (4:1–2). People who learn to listen to God learn to listen to people.",
        reflection: [
          "Think about the best listener you know. What do they do that makes you feel heard? What would it look like to listen to God that way?",
          "What is the biggest hurdle you face when it comes to listening to God’s word?",
          "Why does God’s word sometimes make us defensive?",
        ],
        application: [
          "As you listen to Sunday’s sermon, keep a tally of how many times your mind wanders. Don’t count the times someone else distracts you. Count the ones that start with you.",
          "Practice the art of listening this week with a spouse, coworker, or family member",
        ],
      },
      {
        heading: "Fight Against Anger",
        reference: "James 1:20",
        body: "“Emotions make you cry sometimes, Emotions make you sad sometimes, Emotions make you Glad sometimes…. “ H-Town said it best. Emotions can cause us to descend to some deplorable depths if we are not careful. James specifically points to anger as a catalyst for ungodly behavior. Notice James doesn’t say, “ get angry. He says be slow to get angry. That’s how God describes himself: “slow to anger and filled with unfailing love” (Exodus 34:6). The danger is human anger: quick, self-protecting, and out of control. That kind of anger can’t produce the righteous life God wants to see in us. Anger is not to be trifled with. Its danger is evident very early on when God warns Cain about his feelings of anger toward his brother. (Genesis 4:5-7) Anger not only makes our hearts unreceptive to hearing God’s word. It can also make us incapable of living to God’s standard.",
        reflection: [
          "How would you describe your relationship with anger?",
          "James says be *slow* to get angry, not *never* angry. What’s the difference between anger that’s under God’s control and anger that controls you?",
          "If confronted with anger tomorrow how would you use James 1:19-20 to counsel yourself or someone else?",
        ],
        application: [
          "Highlight this verse, write a note that you can keep close to yourself so that you can fight against anger the next time it tries to take control",
          "Think about the last thing that made you angry, and then reassess the situation to discover where you might have missed God in the moment because of your anger",
        ],
      },
      {
        heading: "Recipe for Receptiveness",
        reference: "James 1:21",
        body: "God’s word is powerful, active, relevant, life-changing, and according to James, life-saving. It is sufficient to do all of those things. It lacks no power, because it is God’s word. James is writing to believers, so he is not saying you have to listen hard enough to get saved. He is saying the same word that saved you keeps rescuing you from sin’s pull today and will carry you all the way home. The issue is not the seed. It is the soil. In Jesus’ parable of the sower, some seed falls among thorns, and the thorns grow up and choke it out (Mark 4:7, 18–19). That is what filth and evil do in our lives. They don’t keep the seed from being planted. They choke out what God has already planted. If you belong to Jesus, his word is already in you (James 1:18, 21). Humility keeps the soil clear so that word can grow.\n\nSo here’s the recipe from verse 21. **Take it off:** James uses a picture of taking off dirty clothes. Name the sin that’s choking the word, confess it, and put it away. **Get low:** come to the word ready to be corrected, not just encouraged. **Take it in:** welcome what God says and let it take root.",
        reflection: [
          "When is the last time a Bible passage or sermon made a noticeable change in your life?",
          "When are you most receptive to God’s word?",
          "What’s the difference between *hearing* God’s word and *humbly accepting* it? What would accepting it look like for you this week?",
        ],
        application: [
          "Before your next encounter with God’s word (Sunday’s sermon or your own Bible reading), take two minutes to practice the recipe: confess what needs to go, and pray, “Lord, I’m ready to hear what you say and do it.”",
          "Keep a journal of the word that you receive so that you can observe its effect on your living",
        ],
      },
    ],
    conclusion:
      "Listening is a sacred art that we should recover for our spiritual growth. Listening well is about more than hearing. It is about receiving what God has already planted in us through his word.",
    conclusionScripture: {
      text: "So faith comes from hearing, and hearing through the word of Christ.",
      reference: "Romans 10:17",
      translation: "ESV",
    },
    nextSteps: ["Make an attempt to observe, listen, and record everything that God gives you this week through his word"],
    nextLessonPassage: "James 1:22-25",
    scriptureNotices: [scriptureNotices.nltPrimary, scriptureNotices.esvMarked],
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

/** The lesson the class is preparing for: the most recent one posted (by study date). */
export function getFeaturedJamesLesson() {
  return [...jamesLessons].sort((a, b) => b.studyDate.localeCompare(a.studyDate))[0];
}
