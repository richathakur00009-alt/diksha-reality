
import { useEffect, useState } from "react";
import "./Admin.css";

const API_URL = "http://127.0.0.1:5000/api";

const STATUSES = ["New", "Contacted", "In Progress", "Closed"];

export default function Admin() {
    const [token, setToken] = useState("");
    const [savedToken, setSavedToken] = useState("");
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const loadEnquiries = async (adminToken) => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/enquiries`, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Could not load enquiries.");
            }

            setEnquiries(Array.isArray(data.enquiries) ? data.enquiries : []);
            setSavedToken(adminToken);
        } catch (err) {
            setError(
                err.message ||
                "Unable to connect. Make sure your backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!savedToken) return;

        const timer = setInterval(() => {
            loadEnquiries(savedToken);
        }, 30000);

        return () => clearInterval(timer);
    }, [savedToken]);

    const updateStatus = async (id, status) => {
        setError("");

        try {
            const response = await fetch(`${API_URL}/enquiries/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${savedToken}`,
                },
                body: JSON.stringify({ status }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Could not update status.");
            }

            await loadEnquiries(savedToken);
        } catch (err) {
            setError(err.message || "Could not update enquiry status.");
        }
    };

    const filteredEnquiries = enquiries.filter((item) => {
        const term = search.toLowerCase();

        const matchesSearch = [
            item.name,
            item.phone,
            item.enquiryType,
            item.budget,
            item.message,
        ].some((value) => String(value || "").toLowerCase().includes(term));

        const matchesStatus =
            statusFilter === "All" || item.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const countStatus = (status) =>
        enquiries.filter((item) => item.status === status).length;

    if (!savedToken) {
        return (
            <main className="admin-login-page">
                <form
                    className="admin-login-card"
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (token.trim()) loadEnquiries(token.trim());
                    }}
                >
                    <p className="admin-eyebrow">DIKSHA REALTY</p>
                    <h1>Admin Dashboard</h1>
                    <p>Sign in with your administrator token to manage enquiries.</p>

                    <label htmlFor="admin-token">Admin token</label>
                    <input
                        id="admin-token"
                        type="password"
                        value={token}
                        onChange={(event) => setToken(event.target.value)}
                        placeholder="Enter your admin token"
                        autoComplete="off"
                        required
                    />

                    {error && <p className="admin-error">{error}</p>}

                    <button className="admin-primary-button" disabled={loading}>
                        {loading ? "Loading..." : "Open Dashboard"}
                    </button>

                    <a href="/" className="admin-back-link">
                        ← Back to website
                    </a>
                </form>
            </main>
        );
    }

    return (
        <main className="admin-page">
            <header className="admin-header">
                <div>
                    <p className="admin-eyebrow">DIKSHA REALTY</p>
                    <h1>Enquiry Dashboard</h1>
                    <p>Manage and follow up on customer enquiries.</p>
                </div>

                <div className="admin-header-actions">
                    <button
                        className="admin-secondary-button"
                        onClick={() => loadEnquiries(savedToken)}
                        disabled={loading}
                    >
                        {loading ? "Refreshing..." : "Refresh"}
                    </button>
                    <button
                        className="admin-secondary-button"
                        onClick={() => {
                            setSavedToken("");
                            setToken("");
                            setEnquiries([]);
                        }}
                    >
                        Log out
                    </button>
                </div>
            </header>

            {error && <p className="admin-error admin-notice">{error}</p>}

            <section className="admin-stats">
                <article className="admin-stat-card">
                    <span>Total enquiries</span>
                    <strong>{enquiries.length}</strong>
                </article>

                {STATUSES.map((status) => (
                    <article className="admin-stat-card" key={status}>
                        <span>{status}</span>
                        <strong>{countStatus(status)}</strong>
                    </article>
                ))}
            </section>

            <section className="admin-table-card">
                <div className="admin-table-heading">
                    <div>
                        <h2>Customer enquiries</h2>
                        <p>{filteredEnquiries.length} record(s) displayed</p>
                    </div>

                    <div className="admin-filters">
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search enquiries..."
                            aria-label="Search enquiries"
                        />

                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            aria-label="Filter by status"
                        >
                            <option value="All">All statuses</option>
                            {STATUSES.map((status) => (
                                <option value={status} key={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading && enquiries.length === 0 ? (
                    <p className="admin-empty">Loading enquiries...</p>
                ) : filteredEnquiries.length === 0 ? (
                    <p className="admin-empty">No matching enquiries found.</p>
                ) : (
                    <div className="admin-table-scroll">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Enquiry</th>
                                    <th>Budget</th>
                                    <th>Requirements</th>
                                    <th>Status</th>
                                    <th>Contact</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredEnquiries.map((item) => (
                                    <tr key={item.id}>
                                        <td>#{item.id}</td>
                                        <td>
                                            <strong>{item.name}</strong>
                                            <small>{item.phone}</small>
                                        </td>
                                        <td>{item.enquiryType}</td>
                                        <td>{item.budget || "Not specified"}</td>
                                        <td className="admin-message">
                                            {item.message || "No additional details"}
                                        </td>
                                        <td>
                                            <select
                                                className="admin-status-select"
                                                value={STATUSES.includes(item.status) ? item.status : "New"}
                                                onChange={(event) =>
                                                    updateStatus(item.id, event.target.value)
                                                }
                                                aria-label={`Status for enquiry ${item.id}`}
                                            >
                                                {STATUSES.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <a
                                                href={`https://wa.me/${String(item.phone || "").replace(/\D/g, "")}`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                WhatsApp
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <a href="/" className="admin-back-link">
                ← Back to website
            </a>
        </main>
    );
}
