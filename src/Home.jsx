
import { useState } from "react";
import "./App.css";
import EnquiryForm from "./EnquiryForm";

const properties = [
    {
        id: 1,
        name: "Sample Modern Residence",
        location: "Baddi, Himachal Pradesh",
        category: "Residential",
        price: 7500000,
        type: "3 BHK Home",
        image:
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85",
    },
    {
        id: 2,
        name: "Sample Commercial Space",
        location: "Baddi, Himachal Pradesh",
        category: "Commercial",
        price: 4500000,
        type: "Commercial Unit",
        image:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85",
    },
    {
        id: 3,
        name: "Sample Residential Plot",
        location: "Solan, Himachal Pradesh",
        category: "Plots",
        price: 2500000,
        type: "Residential Land",
        image:
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=85",
    },
];

const companyVideos = [
    {
        id: 1,
        title: "Real Estate Solutions",
        description:
            "Discover how Diksha Realty can help you explore real estate opportunities and find a home that suits your needs.",
        src: "/videos/property-tour-1.mp4",
    },
    {
        id: 2,
        title: "Transforming Spaces, Building Dreams",
        description:
            "Learn how renovation and thoughtful property improvements can help transform your space.",
        src: "/videos/property-tour-2.mp4",
    },
];

export default function Home() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [budget, setBudget] = useState("Any");

    const filteredProperties = properties.filter((property) => {
        const query = search.trim().toLowerCase();

        const matchesSearch = [
            property.name,
            property.location,
            property.category,
            property.type,
        ].some((value) => value.toLowerCase().includes(query));

        return (
            matchesSearch &&
            (category === "All" || property.category === category) &&
            (budget === "Any" || property.price <= Number(budget))
        );
    });

    const formatPrice = (price) =>
        `₹${(price / 100000).toLocaleString("en-IN")} lakh`;

    const makeWhatsAppLink = (property) => {
        const message = `Hello Diksha Realty, I would like to enquire about ${property.name}. I understand this is a demo listing.`;

        return `https://wa.me/919816488777?text=${encodeURIComponent(message)}`;
    };

    return (
        <div className="website">
            {/* NAVIGATION */}
            <header className="navbar">
                <a className="brand" href="#home" aria-label="Diksha Realty home">
                    <span className="brand-icon">D</span>
                    <span>
                        <strong>DIKSHA REALTY</strong>
                        <small>PRIVATE LIMITED</small>
                    </span>
                </a>

                <nav className="nav-links" aria-label="Main navigation">
                    <a href="#home">Home</a>
                    <a href="#about">About Us</a>
                    <a href="#properties">Properties</a>
                    <a href="#videos">Our Expertise</a>
                    <a href="#services">Services</a>
                    <a href="#enquiry">Enquire Now</a>
                    <a href="#contact">Contact</a>
                </nav>

                <a className="nav-button" href="#enquiry">
                    Get in Touch ↗
                </a>
            </header>

            <main>
                {/* HERO SECTION */}
                <section className="hero" id="home">
                    <div className="hero-content">
                        <p className="eyebrow">
                            <span className="eyebrow-line" />
                            YOUR TRUSTED REAL ESTATE PARTNER
                        </p>

                        <h1>
                            Find a Place
                            <br />
                            to Call <em>Home.</em>
                        </h1>

                        <p className="hero-description">
                            Discover exceptional homes, commercial spaces, premium plots,
                            and investment opportunities with Diksha Realty.
                        </p>

                        <div className="hero-actions">
                            <a href="#properties" className="gold-button">
                                Explore Properties ↗
                            </a>

                            <a href="#about" className="text-button">
                                Discover Our Story →
                            </a>
                        </div>

                        <div className="hero-stats">
                            <div>
                                <strong>Residential</strong>
                                <span>Homes & Apartments</span>
                            </div>

                            <div>
                                <strong>Commercial</strong>
                                <span>Business Spaces</span>
                            </div>

                            <div>
                                <strong>Investment</strong>
                                <span>Plots & Land</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-bottom">
                        <span>PROPERTY. PEOPLE. POSSIBILITIES.</span>
                        <a href="#properties">Discover our listings ↓</a>
                    </div>
                </section>

                {/* ABOUT SECTION */}
                <section className="intro section" id="about">
                    <p className="eyebrow">WELCOME TO DIKSHA REALTY</p>

                    <h2>
                        More than property.
                        <br />
                        <em>A place for your future.</em>
                    </h2>

                    <p className="section-description">
                        Diksha Realty Private Limited specialises in residential and
                        commercial properties, property buying and selling, land, and real
                        estate investment opportunities. Our goal is to help clients make
                        informed property decisions through professional guidance and
                        reliable service.
                    </p>
                </section>

                {/* PROPERTIES SECTION */}
                <section className="properties section" id="properties">
                    <div className="section-heading">
                        <div>
                            <p className="eyebrow">FIND YOUR SPACE</p>

                            <h2>
                                Discover <em>Properties</em>
                            </h2>
                        </div>

                        <p>
                            Explore property options to match your needs and goals.
                        </p>
                    </div>

                    <div className="property-search">
                        <label className="search-field">
                            <span>Search</span>

                            <input
                                type="search"
                                placeholder="Name, location or property type"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                        </label>

                        <label className="search-field">
                            <span>Property type</span>

                            <select
                                value={category}
                                onChange={(event) => setCategory(event.target.value)}
                            >
                                <option value="All">All categories</option>
                                <option value="Residential">Residential</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Plots">Plots & Land</option>
                            </select>
                        </label>

                        <label className="search-field">
                            <span>Maximum budget</span>

                            <select
                                value={budget}
                                onChange={(event) => setBudget(event.target.value)}
                            >
                                <option value="Any">Any budget</option>
                                <option value="3000000">Up to ₹30 lakh</option>
                                <option value="5000000">Up to ₹50 lakh</option>
                                <option value="8000000">Up to ₹80 lakh</option>
                            </select>
                        </label>
                    </div>

                    <p className="demo-notice">
                        DEMO CONTENT — These properties, images and prices are
                        illustrative. They are not verified company listings.
                    </p>

                    <div className="results-bar">
                        <span>
                            {filteredProperties.length} sample{" "}
                            {filteredProperties.length === 1
                                ? "property"
                                : "properties"}{" "}
                            found
                        </span>

                        <button
                            type="button"
                            className="reset-button"
                            onClick={() => {
                                setSearch("");
                                setCategory("All");
                                setBudget("Any");
                            }}
                        >
                            Reset filters ↺
                        </button>
                    </div>

                    {filteredProperties.length > 0 ? (
                        <div className="property-grid">
                            {filteredProperties.map((property) => (
                                <article className="property-card" key={property.id}>
                                    <div className="property-image-wrap">
                                        <img
                                            src={property.image}
                                            alt={property.name}
                                            className="property-image"
                                            loading="lazy"
                                        />

                                        <span className="property-tag">
                                            {property.category}
                                        </span>
                                    </div>

                                    <div className="listing-content">
                                        <p className="listing-location">
                                            {property.location}
                                        </p>

                                        <h3>{property.name}</h3>

                                        <p className="listing-type">
                                            {property.type}
                                        </p>

                                        <div className="listing-footer">
                                            <div>
                                                <span className="price-label">
                                                    Sample price
                                                </span>

                                                <strong className="property-price">
                                                    {formatPrice(property.price)}
                                                </strong>
                                            </div>

                                            <a
                                                className="listing-link"
                                                href={makeWhatsAppLink(property)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Enquire ↗
                                            </a>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <h3>No matching properties found</h3>

                            <p>
                                Try a different search term or adjust your filters.
                            </p>

                            <button
                                type="button"
                                className="gold-button"
                                onClick={() => {
                                    setSearch("");
                                    setCategory("All");
                                    setBudget("Any");
                                }}
                            >
                                Show all properties
                            </button>
                        </div>
                    )}
                </section>

                {/* DISCOVER WHAT WE DO - COMPANY VIDEOS */}
                <section className="property-videos section" id="videos">
                    <div className="section-heading">
                        <div>
                            <p className="eyebrow">
                                OUR EXPERTISE • YOUR POSSIBILITIES
                            </p>

                            <h2>
                                Discover <em>What We Do</em>
                            </h2>
                        </div>

                        <p>
                            From finding your ideal home to transforming your space,
                            discover how Diksha Realty helps turn your real estate
                            goals into reality.
                        </p>
                    </div>

                    <div className="video-grid">
                        {companyVideos.map((video) => (
                            <article className="video-card" key={video.id}>
                                <div className="video-player">
                                    <video
                                        controls
                                        preload="metadata"
                                        playsInline
                                        aria-label={video.title}
                                    >
                                        <source
                                            src={video.src}
                                            type="video/mp4"
                                        />

                                        Your browser does not support HTML video.
                                    </video>
                                </div>

                                <div className="video-content">
                                    <span className="video-number">
                                        DIKSHA REALTY • 0{video.id}
                                    </span>

                                    <h3>{video.title}</h3>

                                    <p>{video.description}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* SERVICES SECTION */}
                <section className="services section" id="services">
                    <p className="eyebrow">WHAT WE OFFER</p>

                    <h2>
                        Real estate, <em>made simpler.</em>
                    </h2>

                    <div className="service-list">
                        <div>
                            <span>01</span> Residential buying & selling
                        </div>

                        <div>
                            <span>02</span> Commercial buying & selling
                        </div>

                        <div>
                            <span>03</span> Residential plots & land
                        </div>

                        <div>
                            <span>04</span> Real estate investment opportunities
                        </div>

                        <div>
                            <span>05</span> Property consultation
                        </div>

                        <div>
                            <span>06</span> Real estate development projects
                        </div>
                    </div>
                </section>

                {/* CUSTOMER ENQUIRY FORM */}
                <EnquiryForm />

                {/* CONTACT SECTION */}
                <section className="contact section" id="contact">
                    <p className="eyebrow">LET'S BEGIN YOUR JOURNEY</p>

                    <h2>
                        Your next chapter <em>starts here.</em>
                    </h2>

                    <p className="contact-address">
                        Showroom No. 43, City Square Mall, Sai Road, Near KFC, Baddi,
                        Solan, Himachal Pradesh, India.
                    </p>

                    <a
                        className="gold-button"
                        href="https://wa.me/919816488777"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Chat on WhatsApp ↗
                    </a>

                    <p className="contact-details">
                        <a href="tel:+919816488777">+91 98164 88777</a>
                        {" · "}
                        <a href="tel:+918625862543">+91 86258 62543</a>
                    </p>

                    <a href="mailto:diksharealtyprivatelimited@gmail.com">
                        diksharealtyprivatelimited@gmail.com
                    </a>
                </section>
            </main>

            {/* FOOTER */}
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
