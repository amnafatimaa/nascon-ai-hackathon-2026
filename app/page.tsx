const stories = [
  {
    category: "TECHNOLOGY",
    time: "6 MIN READ",
    title: "The next chapter of artificial intelligence is being built in the open",
    description:
      "Researchers and independent developers are reshaping how AI tools are made, shared, and used.",
    source: "Technology Brief",
    symbol: "✳",
    featured: true,
  },
  {
    category: "SCIENCE",
    time: "4 MIN READ",
    title: "A new generation of instruments is changing how we study the universe",
    description:
      "Smaller sensors and smarter software are helping researchers ask bigger questions.",
    source: "Science Daily Brief",
    symbol: "◉",
  },
  {
    category: "WORLD",
    time: "5 MIN READ",
    title: "Why the global energy transition looks different in every region",
    description:
      "Local infrastructure, investment, and policy are shaping very different paths forward.",
    source: "World Report",
    symbol: "↗",
  },
  {
    category: "BUSINESS",
    time: "3 MIN READ",
    title: "The small teams rethinking how people build products",
    description:
      "Lean teams are experimenting with new ways to turn ideas into useful products.",
    source: "The Daily Ledger",
    symbol: "⌁",
  },
];

const topics = ["All stories", "Technology", "Science", "World", "Business"];

export default function Home() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="Daybreak home">
          <span className="brand-icon">d.</span>
          <span>daybreak</span>
        </a>

        <nav className="topnav" aria-label="Main navigation">
          <a className="nav-active" href="/">Your paper</a>
          <a href="#stories">Explore</a>
          <a href="#about">About</a>
        </nav>

        <button className="profile-button" aria-label="Your profile">
          A
        </button>
      </header>

      <section className="welcome">
        <div>
          <p className="eyebrow"><span className="sun-dot" /> YOUR PERSONAL MORNING PAPER</p>
          <h1>A little more informed.<br /><em>A little less overwhelmed.</em></h1>
          <p className="welcome-copy">
            The stories that matter to you, gathered in one thoughtful daily read.
          </p>
        </div>
        <div className="date-card">
          <span className="date-label">YOUR DAILY EDITION</span>
          <span className="date-day">01</span>
          <span className="date-month">YOUR FIRST EDITION</span>
          <span className="date-rule" />
          <span className="date-note">A fresh perspective starts here.</span>
        </div>
      </section>

      <section className="reading-strip" aria-label="Reading overview">
        <div>
          <span className="strip-label">YOUR MORNING</span>
          <strong>Worth your attention.</strong>
        </div>
        <div className="strip-stat">
          <span className="stat-number">04</span>
          <span className="stat-label">STORIES</span>
        </div>
        <div className="strip-stat">
          <span className="stat-number">18</span>
          <span className="stat-label">MINUTES</span>
        </div>
        <div className="strip-message">Less scrolling. More understanding.</div>
      </section>

      <section id="stories" className="news-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MONDAY MORNING · THE BIG PICTURE</p>
            <h2>Your world, <em>in focus.</em></h2>
          </div>
          <a className="text-link" href="#all-stories">The full edition <span>↗</span></a>
        </div>

        <div className="topic-row" aria-label="News categories">
          {topics.map((topic, index) => (
            <button
              key={topic}
              className={`topic-chip ${index === 0 ? "topic-selected" : ""}`}
            >
              {topic}
            </button>
          ))}
        </div>

        <article className="lead-story">
          <div className="lead-illustration" aria-label="Abstract sunrise illustration" role="img">
            <div className="illustration-sun" />
            <div className="illustration-hill hill-back" />
            <div className="illustration-hill hill-front" />
            <span className="illustration-caption">A NEW PERSPECTIVE</span>
          </div>
          <div className="lead-content">
            <div className="story-meta">
              <span className="category-label">{stories[0].category}</span>
              <span>{stories[0].time}</span>
            </div>
            <h3>{stories[0].title}</h3>
            <p>{stories[0].description}</p>
            <div className="story-footer">
              <span>{stories[0].source}</span>
              <button className="read-button" aria-label="Open lead story">↗</button>
            </div>
          </div>
        </article>

        <div id="all-stories" className="story-grid">
          {stories.slice(1).map((story, index) => (
            <article className="story-card" key={story.title}>
              <div className={`card-art card-art-${index + 1}`}>
                <span>{story.symbol}</span>
                <span className="art-index">0{index + 2}</span>
              </div>
              <div className="story-meta">
                <span className="category-label">{story.category}</span>
                <span>{story.time}</span>
              </div>
              <h3>{story.title}</h3>
              <p>{story.description}</p>
              <div className="story-footer">
                <span>{story.source}</span>
                <button className="read-button" aria-label={`Open story: ${story.title}`}>↗</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="closing-note">
        <span className="closing-sun">☼</span>
        <div>
          <p className="eyebrow">A BETTER WAY TO KEEP UP</p>
          <h2>Made for your curiosity.<br /><em>Not for your attention span.</em></h2>
        </div>
        <p className="closing-copy">
          Daybreak brings the news together, so you can spend less time looking for stories
          and more time understanding them.
        </p>
      </section>

      <footer className="footer">
        <a className="wordmark footer-brand" href="/"><span className="brand-icon">d.</span> daybreak</a>
        <span>A more thoughtful start to the day.</span>
        <span>BUILT WITH CURIOSITY © 2026</span>
      </footer>
    </main>
  );
}
