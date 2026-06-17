const beliefSections = [
  {
    title: "We Believe in God",
    paragraphs: [
      "We believe there is one true and living God who is holy, loving, faithful, and sovereign. God is the Creator of all things and the One who gives life, purpose, and hope.",
      "We believe God has made Himself known as Father, Son, and Holy Spirit.",
    ],
  },
  {
    title: "We Believe in Jesus Christ",
    paragraphs: [
      "We believe Jesus Christ is the Son of God, our Savior and Lord. He came into the world to reveal God's love, teach the way of the Kingdom, die for our sins, and rise again with all power.",
      "Through Jesus, we are forgiven, restored, and brought into a new relationship with God. We believe salvation is found in Him.",
    ],
  },
  {
    title: "We Believe in the Holy Spirit",
    paragraphs: [
      "We believe the Holy Spirit is God at work in the lives of believers. The Holy Spirit convicts, comforts, guides, strengthens, and empowers us to live as faithful followers of Christ.",
      "We cannot live the Christian life in our own strength. We need the presence and power of the Holy Spirit.",
    ],
  },
  {
    title: "We Believe the Bible Is God's Word",
    paragraphs: [
      "We believe the Bible is the inspired, inerrant, and infallible Word of God. Because Scripture comes from God, it is true, trustworthy, and without error in all that it teaches.",
      "The Bible is the foundation for our faith and practice. Through Scripture, God teaches us who He is, who we are, how we can be saved, and how we are called to live.",
      "At David's Temple, we seek to preach, teach, and apply the Bible in a way that is faithful, clear, and practical for everyday life.",
    ],
  },
  {
    title: "We Believe in Salvation by Grace Through Faith",
    paragraphs: [
      "We believe every person needs the grace of God. Sin separates us from God, but Jesus Christ makes salvation possible through His death and resurrection.",
      "Salvation is not earned by our good works. It is a gift of God's grace received through faith in Jesus Christ. Because God has loved and saved us, we seek to live lives that honor Him.",
    ],
  },
  {
    title: "We Believe in the Church",
    paragraphs: [
      "We believe the church is the body of Christ, made up of believers who have been called to worship God, grow in faith, love one another, serve others, and share the good news of Jesus Christ.",
      "The church is not just a building. It is a family of faith where people are welcomed, encouraged, equipped, and sent to serve.",
    ],
  },
  {
    title: "We Believe in Christian Discipleship",
    paragraphs: [
      "We believe following Jesus is a lifelong journey. As disciples, we are called to grow in faith, prayer, obedience, love, humility, service, and witness.",
      "At David's Temple, we want to help people of all ages know Christ, grow in Christ, and serve like Christ.",
    ],
  },
  {
    title: "We Believe in Loving and Serving Others",
    paragraphs: [
      "We believe faith should be seen in how we treat people. Jesus calls us to love God and love our neighbors. Because of this, we seek to serve our church, our community, and those in need with compassion, humility, and grace.",
      "Our desire is to be a church that reflects the love of Christ in both word and action.",
    ],
  },
];

const ordinanceSections = [
  {
    title: "Baptism",
    paragraphs: [
      "Baptism is an outward sign of an inward faith. It is a public declaration that a person has trusted Jesus Christ as Savior and Lord.",
      "Through baptism, we identify with the death, burial, and resurrection of Jesus Christ. Going down into the water represents dying to the old life, and being raised from the water represents new life in Christ.",
      "Baptism is a joyful step of obedience for believers and a public witness that we belong to Jesus.",
    ],
  },
  {
    title: "Communion",
    paragraphs: [
      "Communion, also known as the Lord's Supper, is a sacred time when believers remember the sacrifice of Jesus Christ.",
      "The bread reminds us of His body given for us. The cup reminds us of His blood shed for the forgiveness of sins. When we take Communion, we remember the cross, give thanks for God's grace, examine our hearts, and proclaim our faith in Christ until He comes again.",
      "Communion is a time of worship, reflection, gratitude, and unity among believers.",
    ],
  },
];

export default function WhatWeBelievePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-3xl space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-[var(--brand-burgundy)]">
          What We Believe
        </p>
        <h1 className="text-4xl font-semibold text-[var(--brand-navy)]">Faith centered on Jesus Christ</h1>
        <div className="space-y-4 text-lg leading-8 text-[var(--brand-muted)]">
          <p>
            At David&apos;s Temple Missionary Baptist Church, our faith is centered on Jesus Christ and grounded in the Word of God. We stand in the historic Christian faith and seek to live out that faith through worship, discipleship, service, and love for our community.
          </p>
          <p>
            We believe that what we believe should shape how we live. Our faith is not only something we confess on Sunday; it is something we seek to practice every day as followers of Jesus.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {beliefSections.map((section) => (
          <section key={section.title} className="border-t border-[var(--brand-border)] pt-6">
            <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">{section.title}</h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-[var(--brand-muted)]">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-10 border-t border-[var(--brand-border)] pt-6">
        <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">Our Ordinances</h2>
        <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
          As a Baptist church, we observe two ordinances given to the church: Baptism and the Lord&apos;s Supper, also called Communion. These ordinances do not save us, but they help us remember, proclaim, and respond to what Jesus has done.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {ordinanceSections.map((section) => (
            <section key={section.title} className="rounded-lg border border-[var(--brand-border)] bg-white p-5">
              <h3 className="text-xl font-semibold text-[var(--brand-navy)]">{section.title}</h3>
              <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--brand-muted)]">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-lg bg-[var(--brand-burgundy-soft)] p-6">
        <h2 className="text-2xl font-semibold text-[var(--brand-navy)]">A Faith That Welcomes You</h2>
        <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
          Whether you are new to church, returning after time away, or looking for a church family, we want you to know that you are welcome at David&apos;s Temple. We would be honored to walk with you as you grow in faith and discover the life God has called you to live.
        </p>
      </section>
    </main>
  );
}
