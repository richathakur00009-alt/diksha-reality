import { Link } from "react-router-dom";
import "./About.css";

const values = [
    {
        number: "01",
        title: "Trust & Transparency",
        description:
            "We believe property decisions should be guided by clear information, honest communication and a professional approach.",
    },
    {
        number: "02",
        title: "Client-Focused Guidance",
        description:
            "Every property journey is different. Our aim is to understand your requirements and help you explore suitable options.",
    },
    {
        number: "03",
        title: "Long-Term Thinking",
        description:
            "Whether you are searching for a home, commercial space or land, we encourage informed decisions that align with your goals.",
    },
];

const services = [
    "Residential property buying and selling",
    "Commercial property buying and selling",
    "Residential plots and land",
    "Real estate investment guidance",
    "Property consultation",
    "Real estate development projects",
];

function About() {
    return (
        <div className="about-page">
            <header className="about-navbar">
                <Link to="/" className="about-brand" aria-label="Diksha Realty home">
                    <span className="about-brand-mark">D</span>
                    <span className="about-brand-text">
                        <strong>DIKSHA REALTY</strong>
                        <small>PRIVATE LIMITED</small>
                    </span>
                </Link>

                <nav className="about-nav-links" aria-label="Main navigation">
                    <Link to="/">Home</Link>
                    <Link to="/about" className="active">
                        About Us
                    </Link>
                    <Link to="/#properties">Properties</Link>
                    <Link to="/#services">Services</Link>
                    <Link to="/#contact">Contact</Link>
                </nav>

                <a className="about-nav-cta" href="tel:+919816488777">
                    Talk to Us <span>↗</span>
                </a>
            </header>

            <main>
                <section className="about-hero">
                    <div className="about-hero-overlay" />

                    <div className="about-hero-content">
                        <p className="about-eyebrow">
                            <span />
                            GET TO KNOW US
                        </p>

                        <h1>
                            Real estate with
                            <br />
                            <em>a more personal touch.</em>
                        </h1>

                        <p>
                            Helping people explore property opportunities with thoughtful
                            guidance, professional service and a focus on what matters to them.
                        </p>

                        <Link to="/#contact" className="about-gold-button">
                            Start a Conversation <span>↗</span>
                        </Link>
                    </div>

                    <div className="about-hero-caption">
                        <span>PEOPLE. PROPERTY. POSSIBILITIES.</span>
                        <span>DIKSHA REALTY PRIVATE LIMITED</span>
                    </div>
                </section>

                <section className="about-introduction">
                    <div className="about-intro-label">
                        <p className="about-eyebrow">OUR STORY</p>
                        <span className="about-decorative-line" />
                    </div>

                    <div className="about-intro-copy">
                        <h2>
                            Every property journey
                            <br />
                            begins with <em>a vision.</em>
                        </h2>

                        <p>
                            Diksha Realty Private Limited is focused on helping clients
                            explore residential and commercial properties, plots, land and
                            real estate opportunities.
                        </p>

                        <p>
                            We understand that choosing a property can be an important
                            personal or business decision. Our aim is to make that journey
                            more approachable by listening to client requirements, sharing
                            relevant options and supporting informed decisions.
                        </p>

                        <p>
                            From the search for a place to call home to exploring space for
                            business or investment, we want every conversation to begin with
                            understanding your goals.
                        </p>
                    </div>
                </section>

                <section className="about-purpose">
                    <div className="about-purpose-heading">
                        <p className="about-eyebrow">WHAT GUIDES US</p>
                        <h2>
                            A clear purpose.
                            <br />
                            <em>A thoughtful approach.</em>
                        </h2>
                    </div>

                    <div className="about-purpose-grid">
                        <article className="about-purpose-card">
                            <span className="about-card-number">01 / OUR VISION</span>
                            <div className="about-card-icon">✳</div>
                            <h3>Help people move forward</h3>
                            <p>
                                To become a trusted name in real estate by helping people
                                explore property opportunities with confidence and clarity.
                            </p>
                        </article>

                        <article className="about-purpose-card">
                            <span className="about-card-number">02 / OUR MISSION</span>
                            <div className="about-card-icon">⌂</div>
                            <h3>Make the journey simpler</h3>
                            <p>
                                To understand client needs, offer professional guidance and
                                make property exploration more transparent and approachable.
                            </p>
                        </article>
                    </div>
                </section>

                <section className="about-values">
                    <div className="about-values-heading">
                        <p className="about-eyebrow">THE WAY WE WORK</p>
                        <h2>
                            Principles that
                            <br />
                            <em>matter to us.</em>
                        </h2>
                        <p>
                            A good property experience starts with listening, clarity and
                            respect for the decision you are making.
                        </p>
                    </div>

                    <div className="about-values-list">
                        {values.map((value) => (
                            <article className="about-value-item" key={value.number}>
                                <span>{value.number}</span>
                                <div>
                                    <h3>{value.title}</h3>
                                    <p>{value.description}</p>
                                </div>
                                <span className="about-value-arrow">↗</span>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="about-services">
                    <div className="about-services-heading">
                        <p className="about-eyebrow">HOW WE CAN HELP</p>
                        <h2>
                            Property possibilities,
                            <br />
                            <em>all in one place.</em>
                        </h2>
                        <p>
                            Explore the types of real estate services offered by Diksha
                            Realty Private Limited.
                        </p>
                    </div>

                    <div className="about-services-list">
                        {services.map((service, index) => (
                            <div className="about-service-item" key={service}>
                                <span>{String(index + 1).padStart(2, "0")}</span>
                                <p>{service}</p>
                                <span className="about-service-arrow">↗</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="about-cta">
                    <p className="about-eyebrow">YOUR NEXT STEP STARTS HERE</p>
                    <h2>
                        Let's talk about
                        <br />
                        <em>what you're looking for.</em>
                    </h2>
                    <p>
                        Tell us about your property requirements and start a conversation
                        with our team.
                    </p>

                    <div className="about-cta-actions">
                        <a
                            href="https://wa.me/919816488777?text=Hello%20Diksha%20Realty%2C%20I%20would%20like%20to%20discuss%20my%20property%20requirements."
                            className="about-gold-button"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Enquire on WhatsApp <span>↗</span>
                        </a>

                        <Link to="/" className="about-text-link">
                            Explore Properties →
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="about-footer">
                <Link to="/" className="about-footer-brand">
                    DIKSHA REALTY <em>PRIVATE LIMITED</em>
                </Link>

                <span>Building trust. Finding possibilities.</span>

                <div className="about-footer-contact">
                    <a href="tel:+919816488777">+91 98164 88777</a>
                    <a href="mailto:diksharealtyprivatelimited@gmail.com">
                        Email us
                    </a>
                </div>

                <span>© {new Date().getFullYear()} Diksha Realty</span>
            </footer>
        </div>
    );
}

export default About;