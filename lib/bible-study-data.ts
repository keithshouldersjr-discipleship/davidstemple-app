export type StudyLesson = {
  number: number;
  topic: string;
  date: string;
  dateIso: string;
  scripture: string;
  overview: string[];
  keyIdeas?: string[];
  studyQuestions: string[];
  discussion: string[];
  reflection: string[];
  prayer: string;
};

export const bibleStudy = {
  title: "From Welcome to Worship",
  subtitle: "Creating a Church Where Guests Encounter God",
  description:
    "A six-lesson Bible study that helps our whole church practice biblical hospitality, prepare for worship, and make room for guests to encounter God.",
  pdfUrl:
    "/bible-studies/from-welcome-to-worship/from-welcome-to-worship.pdf",
  coverUrl: "/bible-studies/from-welcome-to-worship/cover.png",
  learningGoals: [
    "Understand the biblical expectation for Christian hospitality.",
    "Assess our hospitality toward strangers collectively and individually.",
    "Identify the impact of hospitality on our worship.",
    "List ways that you can practice personal hospitality.",
    "Create a plan to increase hospitality at David's Temple.",
  ],
  howToPrepare: [
    "Read the listed Scripture passages during your personal devotion.",
    "Use the Studying the Text questions to understand what is being said.",
    "Review the Discussion section before class.",
    "Meditate on the Reflection questions and consider how you will live out the lesson.",
  ],
  openingPrayer:
    "Lord, teach me to be as kind to strangers as you have been to me. Increase my concern for guests and those who are outside of my circle. Amen.",
};

export const studyLessons: StudyLesson[] = [
  {
    number: 1,
    topic: "Loving Strangers",
    date: "September 9, 2026",
    dateIso: "2026-09-09",
    scripture: "1 Peter 4:9; Romans 12:9-13; Hebrews 13:1-2; Luke 14:12-14",
    keyIdeas: [
      "The term hospitality comes from the Greek word philoxenos, which means loving strangers.",
      "Hospitality in the Bible was focused on strangers.",
      "Hospitality in our world often focuses on our circles.",
      "Hospitality is the practice of reflecting God's loving-kindness.",
    ],
    overview: [
      "Establishing a biblical definition is an important first step toward growing in hospitality. The practice is rooted in developing a high view of all humanity, especially people outside our circles, so that we might practice kindness toward them.",
      "We cannot have a high view of God and a low view of people. Without the proper view of humanity, we will be tempted to practice hostility instead of hospitality.",
      "Hospitality is a sacrificial practice that requires us to put the needs of others before ourselves, even when it costs.",
    ],
    studyQuestions: [
      "Who does the writer of Hebrews say we could be entertaining when we entertain strangers?",
      "What attitude should we avoid while showing hospitality, according to 1 Peter?",
      "In Luke 14, whom does Jesus say we should invite to our feasts and celebrations?",
      "What are the marks of a true Christian in Romans 12:9-13?",
    ],
    discussion: [
      "How does a high view of every person change the way we notice and welcome guests?",
      "Where are we most tempted to choose the comfort of our circle over the needs of a stranger?",
      "What might hospitality cost us in time, attention, comfort, or convenience?",
    ],
    reflection: [
      "Do you feel that your score for the church is accurate? Why or why not?",
      "Do you feel that your personal score is accurate? Why or why not?",
      "Within the next seven days, what will you do to make room for someone outside your circle?",
    ],
    prayer:
      "Lord, help me to view humanity through the lens of the Bible. Help me to understand others as beings created in your image. Give me the humility to relate to those I don't understand. Help me to empathize with those I don't agree with. Teach me how to be kind to all. Amen.",
  },
  {
    number: 2,
    topic: "Entering Worship",
    date: "September 16, 2026",
    dateIso: "2026-09-16",
    scripture: "Psalm 100:1-5; 1 Kings 3:7",
    overview: [
      "The Lord our God is holy, and how we prepare to serve Him matters. We were made for the purpose of giving honor and glory to Him.",
      "Before entering worship, prepare your heart and mind for God's presence. Lay aside sin and impurity, seek reconciliation with others, repent of wrongdoing, and approach Him with clean hands, a pure heart, and humility.",
    ],
    studyQuestions: [
      "How does the psalmist say we are to come before God?",
      "What animal does the psalmist use to describe God's people?",
      "How are we directed to enter God's gates?",
      "What problem did David request help with?",
      "Whom did David ask for help, and why?",
    ],
    discussion: [
      "The psalmist explains how we are to come before God. He reminds us of our position, God's high position, the blessings God has already given, and the joy that comes with serving Him.",
    ],
    reflection: [
      "What is your normal Sunday morning routine?",
      "How do you prepare to enter worship?",
      "What do you take into worship?",
      "What can you do to improve the way you enter worship?",
      "As a result of this lesson, what changes do you plan to make to your Sunday morning routine?",
    ],
    prayer:
      "Lord, I thank you for allowing us to come before your presence. Father, we need you every day. Teach us how to go out and come in. Thank you, Lord. Amen.",
  },
  {
    number: 3,
    topic: "During Worship",
    date: "September 23, 2026",
    dateIso: "2026-09-23",
    scripture: "James 1:21-22; 1 Peter 2:1-3",
    overview: [
      "The goal during worship is to open your heart to receive the Word of God. We are to become eager and ready to receive His Word with meekness by engaging with other believers in worship and music and listening attentively to the sermon.",
      "Singing, praying, and reflecting together create a space where God's truth is applied to our lives. In doing so, we create an atmosphere that is welcoming, not pressuring, so worshipers can focus on God rather than impressing others.",
    ],
    studyQuestions: [
      "What does James say we need to get rid of?",
      "What does James say we need to receive?",
      "What does James say we need to become?",
      "What does Peter say we should desire?",
      "What is to be gained from just a taste?",
    ],
    discussion: [
      "Have you ever attended a worship service expecting to receive something and left feeling nothing?",
      "Have you ever wondered why your praise and worship seemed to stop short of the finish line?",
    ],
    reflection: [
      "What is the best part of the worship service to you?",
      "What distracts or hinders you during worship?",
      "Are you ever a distraction or hindrance to others during worship?",
      "What actions can you take to improve the worship service?",
      "Do you believe your life can be changed during worship? Explain.",
    ],
    prayer:
      "Lord, help me to see you. Please remove any barriers that hinder me from true service to you. Thank you, Lord, for loving me. Amen.",
  },
  {
    number: 4,
    topic: "After Worship",
    date: "October 7, 2026",
    dateIso: "2026-10-07",
    scripture: "Romans 12:1-2; Ephesians 4:1-6",
    overview: [
      "As believers in the Word, we are to apply the Word to our lives. After experiencing the service, we must live what we have heard and move from reception to execution.",
      "This could mean serving in the church, making personal lifestyle changes, or deepening your relationship with God through prayer, fasting, and Bible study. Use the fresh spiritual energy from worship to make God's truth real in your daily life.",
    ],
    studyQuestions: [
      "How does Paul say we should present ourselves to God?",
      "How are we supposed to be transformed?",
      "How does Paul say we are to walk in our calling?",
      "What does Ephesians 4:3 mean to you?",
      "Does Ephesians 4:4 say we all have a calling? Explain.",
    ],
    discussion: [
      "Can you feel the presence of God in your life?",
      "Do you hunger to be closer to God?",
      "Do you thirst to move from where you are to where God wants you to be?",
      'Do you find yourself asking God, "Lord, what do you want me to do?"',
    ],
    reflection: [
      "Do you create time to speak with guests and welcome conversation?",
      "Do you find comfort in your holy huddle?",
      "After the worship service is over, how do you reflect on it?",
      "Name one way you can apply the message to your life.",
      "As a result of the worship experience, how are you better able to serve?",
    ],
    prayer:
      "Lord God, here I am. I am ready to be used by you. I am offering myself to you. Please use me as you see fit. Thank you, Lord. Amen.",
  },
  {
    number: 5,
    topic: "Follow Up",
    date: "October 14, 2026",
    dateIso: "2026-10-14",
    scripture: "Ephesians 1:15-17; 2 Corinthians 9:12-13",
    overview: [
      "One way to witness growth in our faith is in our ability to pray. Mature Christians should recognize prayer as a powerful gift from God.",
      "Prayer should be fervent and deliberate, offered individually and corporately on behalf of the church, the congregation, the community, the sick, and the lost. Prayer is needed before, during, and after worship.",
    ],
    studyQuestions: [
      "What did Paul say he heard about the Ephesians?",
      "What did Paul do after hearing this?",
      "How does our abundance of giving help others?",
      "Whom does Paul say this type of service helps?",
      "How does the test of love in 2 Corinthians 9:13 glorify God?",
    ],
    discussion: [
      "Paul joins his prayers with the prayers of the saints in Ephesus. What would be the outcome if we joined our prayers together?",
      "What could we achieve if we came together on one accord in the name of Jesus?",
      "What goal are you ready to pray fervently to achieve?",
    ],
    reflection: [
      "How much time each day do you spend in prayer?",
      "When and where do you normally pray?",
      "Do others call on you to pray with or for them? Why?",
      "Who or what do you normally pray for?",
      "What can you do to improve your prayer life?",
    ],
    prayer:
      "Lord, I am here, ready to stand my watch in the watchtower of your divine grace. I pray for the circumstances around me that I cannot control. Help me, Lord, as I pray fervently for situations that only you can fix. Keep me prayerful and watchful as you see fit. Thank you, Lord. Amen.",
  },
  {
    number: 6,
    topic: "Making Our Church Hospitality Plan",
    date: "October 21 & 28, 2026",
    dateIso: "2026-10-21",
    scripture:
      "Romans 12:9-13; Hebrews 13:1-2; Psalm 100:1-5; James 1:22; Ephesians 4:1-3; Ephesians 1:15-17",
    overview: [
      "Hospitality is the work of the whole church. In this lesson, we will use what we learned in Lessons 1-5 and think about a guest's visit from start to finish.",
      "Ministry leaders will meet with their ministries on October 21 to teach the lesson and create a plan to present on October 28. Together, we will make a simple hospitality plan for David's Temple that tells us what to do, who will help, and when each step should happen.",
    ],
    keyIdeas: [
      "Review the main idea from each lesson.",
      "Look at our church through the eyes of a guest.",
      "Create one clear hospitality plan that we can use on Sundays.",
    ],
    studyQuestions: [
      "What should every guest know or feel after visiting David's Temple?",
      "Which part of the visit needs the most attention? Why?",
      "Does our proposed plan agree with what we learned from the Bible?",
      "Will the plan help guests feel seen and welcome?",
      "Is each action clear, practical, and assigned to someone?",
    ],
    discussion: [
      "A protocol is a clear plan that tells people what to do in the same situation. Our first hospitality plan will be a draft that we can test and improve.",
      "Work in a small group. Choose a leader, a writer, a timekeeper, and a speaker. Review each lesson, see the visit through a guest's eyes, make the plan, and agree on the next step.",
    ],
    reflection: [
      "Before the visit: What should happen, what can we do better, and who will help?",
      "Parking and entrance: What should happen, what can we do better, and who will help?",
      "Before worship: What should happen, what can we do better, and who will help?",
      "During and after worship: What should happen, what can we do better, and who will help?",
      "Follow up: What should happen, what can we do better, and who will help?",
    ],
    prayer:
      "Lord, help us welcome strangers and care for every guest. Help us follow the plan we made together. May our actions show your love. Amen.",
  },
];

export const hospitalityAssessment = [
  {
    id: "church",
    title: "Our Church",
    timeframe: "Think about what a guest would normally experience at David's Temple during the last 90 days.",
    questions: [
      "Our church notices, greets, helps, and includes guests - not only through assigned greeters.",
      "Our church makes room for people outside our usual circles, including those who cannot repay or benefit us.",
      "Our church gives time, attention, and practical help without complaining, even when hospitality is inconvenient.",
    ],
    ranges: ["Needs attention", "Inconsistent", "Getting there", "Hospitable church"],
  },
  {
    id: "personal",
    title: "My Practice",
    timeframe: "Think about your normal treatment of guests and strangers during the last 30 days.",
    questions: [
      "I notice and approach guests and strangers with dignity, warmth, and genuine interest.",
      "I make room in conversations, meals, and relationships for people outside my circle, including those who cannot repay me.",
      "I give time, attention, or practical help without grumbling, even when hospitality costs me comfort or convenience.",
    ],
    ranges: ["Needs attention", "Inconsistent", "Growing habit", "Consistent practice"],
  },
] as const;

export const lessonReview = [
  ["1", "Loving Strangers", "Make room for people outside our normal circle."],
  ["2", "Entering Worship", "Prepare our hearts and help others get ready to worship."],
  ["3", "During Worship", "Remove things that keep people from hearing God's Word."],
  ["4", "After Worship", "Put God's Word into action through service."],
  ["5", "Follow Up", "Keep caring through prayer, giving, and contact."],
] as const;

export const sessionPlan = [
  ["10 minutes", "Review Lessons 1-5"],
  ["15 minutes", "Talk about a guest's visit"],
  ["25 minutes", "Make our hospitality plan"],
  ["10 minutes", "Agree on the plan and choose the next step"],
] as const;

export function getLesson(lessonNumber: string | number) {
  return studyLessons.find((lesson) => String(lesson.number) === String(lessonNumber));
}
