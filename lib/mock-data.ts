import type { Announcement, ChurchInfo, Event, MinistryContact, Resource } from "@/lib/types";

export const ASK_DT_SYSTEM_INSTRUCTION =
  "You are ask.dt, the official information assistant for David's Temple Missionary Baptist Church. Answer clearly, warmly, and briefly. Use only approved church information. Do not invent details about events, times, ministries, giving, or church policies. If you do not know the answer, say that you do not have that information yet and direct the user to contact the church office or check the official church resources.";

export const resources: Resource[] = [
  {
    id: "pastor-bio",
    title: "Pastor Bio",
    description: "Meet Pastor Keith and learn more about his heart for David's Temple and the Tanner community.",
    category: "Grow",
    url: "/pastor",
    icon: "UserRound",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "upcoming-events",
    title: "Upcoming Events",
    description: "See what is coming up this month across worship, study, and ministry life.",
    category: "Ministry Updates",
    url: "/events",
    icon: "CalendarDays",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "serve",
    title: "Join A Ministry",
    description: "Explore opportunities to use your gifts and support the work of ministry.",
    category: "Serve",
    url: "/serve",
    icon: "HeartHandshake",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "give-online",
    title: "Give Online",
    description: "A simple path to support the mission and ministries of David's Temple.",
    category: "Give",
    url: "/resources#give",
    icon: "HandCoins",
    isActive: true,
    sortOrder: 5,
  },
  {
    id: "prayer-request",
    title: "Submit a Prayer Request",
    description: "Let the church know how we can pray for you and care for your family.",
    category: "Care",
    url: "/resources#care",
    icon: "Heart",
    isActive: true,
    sortOrder: 6,
  },
  {
    id: "contact",
    title: "Contact the Church",
    description: "Reach the church office for questions, care needs, or next steps.",
    category: "Visit",
    url: "/resources#visit",
    icon: "Phone",
    isActive: true,
    sortOrder: 7,
  },
  {
    id: "cdc",
    title: "Child Development Center",
    description: "Helpful information for families connected to the Child Development Center.",
    category: "Care",
    url: "/resources#care",
    icon: "School",
    isActive: true,
    sortOrder: 8,
  },
  {
    id: "sermons",
    title: "Sermons and Bible Studies",
    description: "Grow through preaching, teaching, and Bible study resources.",
    category: "Grow",
    url: "/resources#grow",
    icon: "Mic",
    isActive: true,
    sortOrder: 9,
  },
  {
    id: "vision",
    title: "Church Vision and Initiatives",
    description: "Learn more about shared priorities and ministry initiatives.",
    category: "Ministry Updates",
    url: "/resources#ministry-updates",
    icon: "Sparkles",
    isActive: true,
    sortOrder: 10,
  },
];

export const events: Event[] = [
  {
    id: "church-anniversary-2026-05-24",
    title: "Church Anniversary",
    description: "From the 2026 Ministry Events Calendar.",
    date: "May 24, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "relay-for-life-2026-05-30",
    title: "Relay For Life",
    description: "From the 2026 Ministry Events Calendar.",
    date: "May 30, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "church-carnival-2026-05-30",
    title: "Church Carnival",
    description: "From the 2026 Ministry Events Calendar.",
    date: "May 30, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "summer-camp-camp-helen-2026-06-19",
    title: "Summer Camp - Camp Helen",
    description: "From the 2026 Ministry Events Calendar.",
    date: "June 19, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "summer-camp-camp-helen-2026-06-20",
    title: "Summer Camp - Camp Helen",
    description: "From the 2026 Ministry Events Calendar.",
    date: "June 20, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "summer-camp-camp-helen-2026-06-21",
    title: "Summer Camp - Camp Helen",
    description: "From the 2026 Ministry Events Calendar.",
    date: "June 21, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "father-s-day-2026-06-21",
    title: "Father's Day",
    description: "From the 2026 Ministry Events Calendar.",
    date: "June 21, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "ricmba-junior-convention-2026-06-26",
    title: "RICMBA - Junior Convention",
    description: "From the 2026 Ministry Events Calendar.",
    date: "June 26, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "ricmba-junior-convention-2026-06-27",
    title: "RICMBA - Junior Convention",
    description: "From the 2026 Ministry Events Calendar.",
    date: "June 27, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "youth-recognition-sunday-2026-06-28",
    title: "Youth Recognition Sunday",
    description: "From the 2026 Ministry Events Calendar.",
    date: "June 28, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "david-s-temple-revival-2026-07-07",
    title: "David's Temple Revival",
    description: "From the 2026 Ministry Events Calendar.",
    date: "July 7, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "david-s-temple-revival-2026-07-08",
    title: "David's Temple Revival",
    description: "From the 2026 Ministry Events Calendar.",
    date: "July 8, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "david-s-temple-revival-2026-07-09",
    title: "David's Temple Revival",
    description: "From the 2026 Ministry Events Calendar.",
    date: "July 9, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "connect-day-2026-07-11",
    title: "Connect Day",
    description: "From the 2026 Ministry Events Calendar.",
    date: "July 11, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "ricmba-sunday-school-convention-2026-07-24",
    title: "RICMBA - Sunday School Convention",
    description: "From the 2026 Ministry Events Calendar.",
    date: "July 24, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "ricmba-sunday-school-convention-2026-07-25",
    title: "RICMBA - Sunday School Convention",
    description: "From the 2026 Ministry Events Calendar.",
    date: "July 25, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "ricmba-senior-missionary-convention-2026-08-21",
    title: "RICMBA - Senior Missionary Convention",
    description: "From the 2026 Ministry Events Calendar.",
    date: "August 21, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "ricmba-senior-missionary-convention-2026-08-22",
    title: "RICMBA - Senior Missionary Convention",
    description: "From the 2026 Ministry Events Calendar.",
    date: "August 22, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "5th-sunday-2026-08-30",
    title: "5th Sunday",
    description: "From the 2026 Ministry Events Calendar.",
    date: "August 30, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "auxiliary-day-2026-09-13",
    title: "Auxiliary Day",
    description: "From the 2026 Ministry Events Calendar.",
    date: "September 13, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "senior-missionary-bags-for-homeless-2026-09-19",
    title: "Senior Missionary Bags For Homeless",
    description: "From the 2026 Ministry Events Calendar.",
    date: "September 19, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "ricmba-general-assembly-2026-09-25",
    title: "RICMBA - General Assembly",
    description: "From the 2026 Ministry Events Calendar.",
    date: "September 25, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "ricmba-general-assembly-2026-09-26",
    title: "RICMBA - General Assembly",
    description: "From the 2026 Ministry Events Calendar.",
    date: "September 26, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "connect-day-2026-10-03",
    title: "Connect Day",
    description: "From the 2026 Ministry Events Calendar.",
    date: "October 3, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "pink-out-sunday-2026-10-17",
    title: "Pink-out Sunday",
    description: "From the 2026 Ministry Events Calendar.",
    date: "October 17, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "veteran-s-appreciation-2026-11-08",
    title: "Veteran's Appreciation",
    description: "From the 2026 Ministry Events Calendar.",
    date: "November 8, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "ricmba-executive-board-meeting-2026-11-21",
    title: "RICMBA - Executive Board Meeting",
    description: "From the 2026 Ministry Events Calendar.",
    date: "November 21, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "5th-sunday-2026-11-29",
    title: "5th Sunday",
    description: "From the 2026 Ministry Events Calendar.",
    date: "November 29, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "sister-2-sister-christmas-celebration-2026-12-05",
    title: "Sister 2 Sister Christmas Celebration",
    description: "From the 2026 Ministry Events Calendar.",
    date: "December 5, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
  {
    id: "christmas-celebration-2026-12-20",
    title: "Christmas Celebration",
    description: "From the 2026 Ministry Events Calendar.",
    date: "December 20, 2026",
    time: "Time to be announced",
    location: "Location to be announced",
  },
];

export const churchInfo: ChurchInfo[] = [
  {
    id: "info-service-times",
    topic: "Service Times",
    question: "What are the church service times?",
    answer:
      "Sunday School is at 8:30 AM, Morning Worship is at 9:30 AM, and Bible Study is at 11:00 AM and 6:00 PM.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-sunday-school",
    topic: "Service Times",
    question: "What time is Sunday School?",
    answer:
      "Sunday School is at 8:30 AM, Morning Worship is at 9:30 AM, and Bible Study is at 11:00 AM and 6:00 PM.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-location",
    topic: "Plan a Visit",
    question: "Where is David's Temple located?",
    answer:
      "David's Temple Missionary Baptist Church is located at 11273 Stewart Road, Tanner, AL 35671.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-guest-arrival",
    topic: "Plan a Visit",
    question: "What should I do when I arrive?",
    answer:
      "When you arrive, greeters, ushers, and parking attendants will be ready to help you find your way. If this is your first time visiting, let a parking attendant, greeter, or usher know and they will gladly help you from the parking lot to the sanctuary.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-parking",
    topic: "Plan a Visit",
    question: "Where do I park?",
    answer:
      "Parking attendants will help direct you to an available space. David's Temple is currently working to expand parking, so guests are encouraged to arrive a few minutes early.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-worship-expectations",
    topic: "Plan a Visit",
    question: "What is worship like?",
    answer:
      "Worship includes prayer, singing, Scripture, giving, and preaching from God's Word. You can expect a warm church family, heartfelt worship, and a message that helps you understand and apply the Bible to your life.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-guest-seating",
    topic: "Plan a Visit",
    question: "Where do I sit?",
    answer:
      "You are welcome to sit anywhere in the sanctuary. There are no assigned seats. If the sanctuary is full or you need help finding a comfortable place to sit, one of the ushers will gladly assist you.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-kids",
    topic: "Children",
    question: "What about my kids?",
    answer:
      "David's Temple offers nursery and youth church ministry for children from 0-14 years old. These ministries provide a safe, caring, and age-appropriate space where children can learn about Jesus and be encouraged in their faith.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-dress-code",
    topic: "Plan a Visit",
    question: "Is there a church dress code?",
    answer:
      "Come as you are. At David's Temple, you will see a little bit of everything. Some people dress up, and others dress more casually. We care far more about your presence than your outfit. We simply want you to feel welcome as you worship with us.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-first-time-singled-out",
    topic: "Plan a Visit",
    question: "Will I be singled out if I come as a first-time visitor?",
    answer:
      "No. We want to welcome you, but we will not embarrass you. You may be greeted warmly by our members, but we do not want you to feel pressured or put on the spot. We are simply grateful that you chose to worship with us.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-serving",
    topic: "Serving",
    question: "How can I serve?",
    answer:
      "A good next step is to visit the Join A Ministry page and connect with the ministry leader for the area where you would like to serve.",
    sourceUrl: "/serve",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-serving-before-membership",
    topic: "Serving",
    question: "Can I serve before officially joining the church?",
    answer:
      "There are volunteer opportunities where non-members can partner with David's Temple in serving the community. When those opportunities are available, they will be made public. Membership is required before officially joining a ministry within the church, with the exception of the children's choir. All children are welcome to sing praises to the Lord.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-new-member-orientation",
    topic: "New Members",
    question: "Is there an orientation or training process?",
    answer:
      "When a believer becomes a member at David's Temple, they are partnered with a current member and invited to follow a new-member orientation process centered on connecting new members to ministries and establishing deep relationships.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-children-serving",
    topic: "Serving",
    question: "Can children serve?",
    answer:
      "Children are invited to serve as Junior Ushers, in the Youth Choir, and for special programs throughout the year. The level of service depends on the maturity of the individual child, but David's Temple encourages children to get engaged in serving as early as possible.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-background-checks",
    topic: "Serving",
    question: "Are background checks required for any ministries?",
    answer:
      "Yes. One of the values of the children's ministry is safety, so background checks are required for anyone working with the youth.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-serving-uniforms",
    topic: "Serving",
    question: "What should I wear when serving?",
    answer:
      "Uniforms and dress are at the discretion of each ministry. Ministry leaders are encouraged to exercise sensitivity when creating uniform expectations so members are not discouraged from serving.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-one-time-serving",
    topic: "Serving",
    question: "Are there virtual or one-time serving opportunities?",
    answer:
      "Yes. Members can serve as part of a lead team, which is an opportunity to serve without a long-term commitment. Because we live in a digital ecosystem, David's Temple also needs people who want to use their gifts behind the scenes on digital lead teams.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-professional-skills",
    topic: "Serving",
    question: "Can professional career skills be used to serve?",
    answer:
      "Yes. David's Temple is undergoing a digital transformation and has significant need for expertise in areas like IT, marketing, and legal. People with those backgrounds who want to use their gifts to the glory of God are encouraged to connect with a ministry leader or send a message to the church expressing their desire to serve.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-childcare-serving",
    topic: "Serving",
    question: "Is childcare provided while serving?",
    answer:
      "Childcare is provided during worship. During service opportunities, childcare options are determined by the availability of volunteers to support the event.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-leadership-development",
    topic: "Leadership",
    question: "Are there leadership development opportunities?",
    answer:
      "David's Temple's mission is to evangelize, equip, and empower believers to serve to the glory of God. Because of that core belief, the church holds a monthly leadership meeting that is not restricted to ministry leaders, but is open to all members who desire to grow and be empowered to lead and serve.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-spiritual-leader-training",
    topic: "Leadership",
    question: "Are team leaders trained spiritually as well as operationally?",
    answer:
      "David's Temple desires to continuously develop leaders at every level. From Sunday School, to Bible Study, and even the Sunday sermon, there is an intentional approach to growing all members spiritually. The church strives to emphasize Christian Education as the cornerstone for spiritual development.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-care",
    topic: "Care",
    question: "How do I submit a prayer or care request?",
    answer:
      "Prayer requests can be submitted through the Submit a Prayer Request card on the Resources page. The form allows you to include your name and contact information for follow-up or submit the request anonymously.",
    sourceUrl: "/resources",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-pastor-background",
    topic: "Pastor",
    question: "What is the pastor's background?",
    answer:
      "Information about Pastor Keith can be found on the Pastor Bio page, including his background, education, ministry heart, and connection to the Tanner community.",
    sourceUrl: "/pastor",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-age-groups",
    topic: "Ministries",
    question: "Are there specific groups for young adults, seniors, parents, or other stages of life?",
    answer:
      "David's Temple strives to offer ministry in an age-group-specific format to meet the needs of believers based on their unique stage in life. Educational ministries are offered for elementary children, teens, young adults, middle school, and senior adults.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-financial-transparency",
    topic: "Church Life",
    question: "Is the church financially transparent?",
    answer:
      "Yes. David's Temple believes in transparency and accountability at every level. The church holds an annual business meeting at the beginning of each calendar year where members receive a booklet with the previous year's complete expense report, the new year's budget, and the church's initiatives for the year.",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-pastor-office-hours",
    topic: "Pastor",
    question: "Does the pastor have office hours?",
    answer:
      "Pastor Keith's schedule is relatively flexible because he is bi-vocational. Meetings can be scheduled virtually or in person by submitting a message on the Pastor Bio page.",
    sourceUrl: "/pastor",
    lastUpdated: "2026-06-17",
  },
  {
    id: "info-counseling",
    topic: "Care",
    question: "Is counseling available?",
    answer:
      "Counseling sessions, including needs such as grief, divorce, or marital support, can be scheduled with Pastor Keith by submitting a message through the Pastor Bio page.",
    sourceUrl: "/pastor",
    lastUpdated: "2026-06-17",
  },
];

export const ministryContacts: MinistryContact[] = [
  {
    id: "mens-ministry",
    ministryName: "Men's Ministry",
    leaderName: "Maurice Pryor",
    phone: "256-658-6494",
    description: "Connect with men growing in faith, fellowship, and service.",
    category: "Men",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "womens-ministry",
    ministryName: "Women's Ministry",
    leaderName: "Shellia Battles",
    phone: "256-651-5458",
    description: "Connect with women serving, encouraging, and growing together.",
    category: "Women",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "christian-education",
    ministryName: "Christian Education",
    leaderName: "Rev. Donald Wicks",
    phone: "901-598-3828",
    description: "Support teaching, learning, and discipleship opportunities.",
    category: "Discipleship",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "youth-ministry",
    ministryName: "Youth Ministry",
    leaderName: "Jimmy & Nicole Andrews",
    phone: "256-804-9331",
    description: "Serve young people as they grow in faith and community.",
    category: "Youth",
    isActive: true,
    sortOrder: 4,
  },
  {
    id: "media-ministry",
    ministryName: "Media Ministry",
    leaderName: "Maurice Pryor",
    phone: "256-658-6494",
    description: "Help support worship, communication, and digital ministry.",
    category: "Media",
    isActive: true,
    sortOrder: 5,
  },
  {
    id: "ushers-ministry",
    ministryName: "Ushers Ministry",
    leaderName: "Tara Lucas",
    phone: "256-431-1648",
    description: "Welcome worshipers and help create a hospitable worship experience.",
    category: "Hospitality",
    isActive: true,
    sortOrder: 6,
  },
  {
    id: "choir",
    ministryName: "Choir",
    leaderName: "Antonio Woodruff",
    phone: "256-951-3038",
    description: "Serve through music and help lead the church in worship.",
    category: "Worship",
    isActive: true,
    sortOrder: 7,
  },
];

export const announcements: Announcement[] = [
  {
    id: "welcome",
    title: "Welcome to David's Temple App",
    body: "This first version helps members and visitors ask questions, find resources, and stay connected.",
    audience: "all",
    startDate: "2026-05-21",
  },
];

export function getMockAssistantResponse(prompt: string) {
  const normalized = prompt.toLowerCase();

  if (normalized.includes("sunday school")) {
    return "Sunday School is at 8:30 AM, Morning Worship is at 9:30 AM, and Bible Study is at 11:00 AM and 6:00 PM.";
  }

  if (normalized.includes("event")) {
    const upcomingTitles = events
      .slice(0, 5)
      .map((event) => event.title)
      .join(", ");
    return `You can view upcoming events on the Events page. The next events listed are ${upcomingTitles}. Please check official church updates for times and locations.`;
  }

  if (normalized.includes("serve")) {
    return "A good next step is to visit the Join A Ministry page. A ministry leader or the church office can help you find the right opportunity.";
  }

  if (normalized.includes("prayer") || normalized.includes("care")) {
    return "Prayer requests can be submitted through the Submit a Prayer Request card on the Resources page. You can include your name and contact information for follow-up or submit the request anonymously.";
  }

  if (normalized.includes("connected")) {
    return "Start with the Resources page for visit details, ministry updates, care, serving, and giving links. You can also contact the church office for personal next steps.";
  }

  return "I do not have that information yet. Please contact the church office or check official David's Temple resources for the most current details.";
}
