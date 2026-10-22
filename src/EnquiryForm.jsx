
import { useState } from "react";
import "./App.css";

const API_URL = "https://diksha-realty-api-v2.onrender.com/api";

const enquiryTypes = [
    "Buying a Property",
    "Selling a Property",
    "Residential Property",
    "Commercial Property",
    "Plots and Land",
    "Home Renovation",
    "Real Estate Investment",
    "Property Consultation",
    "Other Enquiry",
];

export default function EnquiryForm() {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        enquiryType: "Residential Property",
        budget: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [success, setSuccess] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setFeedback("");
        setSuccess(false);

        const digits = form.phone.replace(/\D/g, "");

        if (digits.length < 10 || digits.length > 15) {
            setFeedback("Please enter a valid phone number.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/enquiries`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Could not submit your enquiry.");
            }

            setSuccess(true);
            setFeedback("Thank you! Your enquiry has been saved successfully.");

            const whatsappMessage = [
                "Hello Diksha Realty, I have submitted a property enquiry.",
                `Name: ${form.name}`,
                `Contact Number: ${form.phone}`,
                `Enquiry Type: ${form.enquiryType}`,
                `Budget: ${form.budget || "Not specified"}`,
                `Requirements: ${form.message || "Not specified"}`,
            ].join("\n");

            const whatsappUrl =
                "https://wa.me/919816488777?text=" +
                encodeURIComponent(whatsappMessage);

            setForm({
                name: "",
                phone: "",
                enquiryType: "Residential Property",
                budget: "",
                message: "",
            });

            window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        } catch (error) {
            setFeedback(
                error.message === "Failed to fetch"
                    ? "Cannot connect to the server. Please make sure the backend is running."
                    : error.message
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="enquiry-section section" id="enquiry">
            <div className="enquiry-container">
                <div className="enquiry-intro">
                    <p className="eyebrow">LET'S TALK PROPERTY</p>
                    <h2>
                        Tell us what you're <em>looking for.</em>
                    </h2>
                    <p>
                        Share your requirements and the Diksha Realty team can follow up
                        with you.
                    </p>
                </div>

                <form className="enquiry-form" onSubmit={handleSubmit}>
                    <label>
                        Full Name *
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            maxLength={100}
                            autoComplete="name"
                            required
                        />
                    </label>

                    <label>
                        Contact Number *
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            autoComplete="tel"
                            required
                        />
                    </label>

                    <label>
                        Enquiry Type *
                        <select
                            name="enquiryType"
                            value={form.enquiryType}
                            onChange={handleChange}
                            required
                        >
                            {enquiryTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Budget
                        <select
                            name="budget"
                            value={form.budget}
                            onChange={handleChange}
                        >
                            <option value="">Select your budget</option>
                            <option value="Below ₹30 lakh">Below ₹30 lakh</option>
                            <option value="₹30–50 lakh">₹30–50 lakh</option>
                            <option value="₹50 lakh–₹1 crore">₹50 lakh–₹1 crore</option>
                            <option value="Above ₹1 crore">Above ₹1 crore</option>
                            <option value="Not decided">Not decided</option>
                        </select>
                    </label>

                    <label className="enquiry-message">
                        Requirements
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Tell us about your property requirements..."
                            rows={5}
                            maxLength={2000}
                        />
                    </label>

                    {feedback && (
                        <p
                            className={success ? "enquiry-success" : "enquiry-error"}
                            role="status"
                        >
                            {feedback}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="gold-button enquiry-submit"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit Enquiry ↗"}
                    </button>

                    <p className="enquiry-privacy">
                        Your details will be used to respond to your enquiry.
                    </p>
                </form>
            </div>
        </section>
    );
}
