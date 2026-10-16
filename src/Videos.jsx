
import "./App.css";

const propertyVideos = [
    {
        id: 1,
        title: "Property Video 01",
        description: "Explore our property showcase.",
        src: "/videos/property-tour-1.mp4",
    },
    {
        id: 2,
        title: "Property Video 02",
        description: "Discover more possibilities.",
        src: "/videos/property-tour-2.mp4",
    },
];

export default function Videos() {
    return (
        <div className="website video-page">
            <header className="navbar">
                <a className="brand" href="/">
                    <span className="brand-icon">D</span>
                    <span>
                        <strong>DIKSHA REALTY</strong>
                        <small>PRIVATE LIMITED</small>
                    </span>
                </a>

                <nav className="nav-links">
                    <a href="/">Home</a>
                    <a href="/about">About Us</a>
                    <a href="/#properties">Properties</a>
                    <a href="/videos">Videos</a>
                    <a href="/#services">Services</a>
                    <a href="/#contact">Contact</a>
                </nav>

                <a className="nav-button" href="/#contact">
                    Get in Touch ↗
                </a>
            </header>

            <main>
                <section className="video-page-hero">
                    <p className="eyebrow">SEE IT. EXPERIENCE IT.</p>
                    <h1>
                        Property <em>Showcase.</em>
                    </h1>
                    <p>
                        Explore our video collection and get a closer look
                        at the world of Diksha Realty.
                    </p>
                    <a className="gold-button" href="#video-gallery">
                        Watch Videos ↓
                    </a>
                </section>

                <section className="videos-section section" id="video-gallery">
                    <p className="eyebrow">OUR VIDEO COLLECTION</p>
                    <h2>
                        Discover <em>More.</em>
                    </h2>

                    <div className="videos-grid">
                        {propertyVideos.map((video) => (
                            <article className="video-card" key={video.id}>
                                <div className="video-frame">
                                    <video controls playsInline preload="metadata">
                                        <source src={video.src} type="video/mp4" />
                                        Your browser does not support video playback.
                                    </video>
                                </div>

                                <div className="video-card-info">
                                    <span className="video-number">
                                        VIDEO 0{video.id}
                                    </span>
                                    <h3>{video.title}</h3>
                                    <p>{video.description}</p>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="video-contact-action">
                        <a
                            className="gold-button"
                            href="https://wa.me/919816488777"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Enquire on WhatsApp ↗
                        </a>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <span>
                    DIKSHA REALTY <em>PRIVATE LIMITED</em>
                </span>
                <span>Building trust. Finding possibilities.</span>
                <span>© {new Date().getFullYear()} Diksha Realty</span>
            </footer>
        </div>
    );
}
