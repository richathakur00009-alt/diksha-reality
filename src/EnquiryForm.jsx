
import { useState } from "react";

const WHATSAPP_NUMBER = "919816488777";

export default function EnquiryForm() {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        enquiryType: "Residential Property",
        budget: "",
        message: "",
    });

    const [error, setError] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
    }

    function handleSubmit(event) {
        event.preventDefault();

        const name = form.name.trim();
        const phone = form.phone.trim();

        if (!name || !phone || !form.enquiryType) {
            setError("Please fill in all required fields.");
            return;
        }

        const digits = phone.replace(/\D/g, "");

        if (digits.length < 10 || digits.length > 15) {
            setError("Please enter a valid contact number.");
            return;
        }

        const message = [
            "Hello Diksha Realty!",
            "",
            "I would like to make a property enquiry.",
            "",
            `Full Name: ${name}`,
            `Contact Number: ${phone}`,
            `Enquiry Type: ${form.enquiryType}`,
            `Budget: ${form.budget.trim() || "Not specified"}`,
            `Requirements: ${form.message.trim() || "Not specified"}`,
        ].join("\n");

        const whatsappURL =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        window.location.href = whatsappURL;
    }

    const inputStyle = {
        width: "100%",
        boxSizing: "border-box",
        padding: "15px 16px",
        border: "1px solid #51452f",
        borderRadius: "7px",
        background: "#191919",
        color: "#ffffff",
        fontSize: "16px",
        outlineColor: "#c9a86a",
    };

    const labelStyle = {
        display: "block",
        marginBottom: "10px",
        color: "#ffffff",
        fontSize: "16px",
    };

    return (
        <section
            id="enquiry"
            style={{
                background: "#111111",
                color: "#ffffff",
                padding: "55px 24px",
            }}
        >
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                <h2 style={{ color: "#c9a86a", marginBottom: "12px" }}>
                    Make an Enquiry
                </h2>

                <p style={{ color: "#c5c5c5", marginBottom: "32px" }}>
                    Tell us what you're looking for. Our team will assist you.
                </p>

                <form onSubmit={handleSubmit}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                            gap: "24px 28px",
                        }}
                    >
                        <div>
                            <label style={labelStyle} htmlFor="enquiry-name">
                                Full Name *
                            </label>
                            <input
                                id="enquiry-name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                autoComplete="name"
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle} htmlFor="enquiry-phone">
                                Contact Number *
                            </label>
                            <input
                                id="enquiry-phone"
                                name="phone"
                                type="tel"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Enter your contact number"
                                autoComplete="tel"
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle} htmlFor="enquiry-type">
                                Enquiry Type *
                            </label>
                            <select
                                id="enquiry-type"
                                name="enquiryType"
                                value={form.enquiryType}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            >
                                <option>Residential Property</option>
                                <option>Commercial Property</option>
                                <option>Buying a Property</option>
                                <option>Selling a Property</option>
                                <option>Plots and Land</option>
                                <option>Home Renovation</option>
                                <option>Real Estate Investment</option>
                                <option>Property Consultation</option>
                                <option>Other Enquiry</option>
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle} htmlFor="enquiry-budget">
                                Budget
                            </label>
                            <select
                                id="enquiry-budget"
                                name="budget"
                                value={form.budget}
                                onChange={handleChange}
                                style={inputStyle}
                            >
                                <option value="">Select your budget</option>
                                <option>Below ₹25 lakh</option>
                                <option>₹25–50 lakh</option>
                                <option>₹50 lakh–₹1 crore</option>
                                <option>Above ₹1 crore</option>
                                <option>Flexible / To be discussed</option>
                            </select>
                        </div>

                        <div style={{ gridColumn: "1 / -1" }}>
                            <label style={labelStyle} htmlFor="enquiry-message">
                                Requirements
                            </label>
                            <textarea
                                id="enquiry-message"
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                placeholder="Describe your property requirements..."
                                rows={5}
                                style={{ ...inputStyle, resize: "vertical" }}
                            />
                        </div>
                    </div>

                    {error && (
                        <p role="alert" style={{ color: "#ff7777", marginTop: "20px" }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            marginTop: "28px",
                            padding: "17px",
                            border: "none",
                            borderRadius: "7px",
                            background: "#c9a86a",
                            color: "#111111",
                            fontSize: "16px",
                            fontWeight: 700,
                            cursor: "pointer",
                        }}
                    >
                        Send Enquiry on WhatsApp ↗
                    </button>

                    <p
                        style={{
                            textAlign: "center",
                            color: "#c5c5c5",
                            fontSize: "14px",
                            marginTop: "18px",
                        }}
                    >
                        Your details will be prepared in a WhatsApp message for our team.
                    </p>
                </form>
            </div>
        </section>
    );
}
