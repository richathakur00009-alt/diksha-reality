
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { Pool } = require("pg");

const app = express();

const corsOptions = {
    origin: "https://diksha-realty.vercel.app",
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());
const PORT = Number(process.env.PORT) || 5000;
const ADMIN_TOKEN = (process.env.ADMIN_TOKEN || "").trim();
const DATABASE_URL = (process.env.DATABASE_URL || "").trim();

// Validate environment variables.
if (ADMIN_TOKEN.length < 32) {
    console.error("ADMIN_TOKEN must contain at least 32 characters.");
    process.exit(1);
}

if (!DATABASE_URL) {
    console.error("DATABASE_URL is missing from environment variables.");
    process.exit(1);
}

// Log requests and their final response status.
app.use((req, res, next) => {
    console.log("INCOMING REQUEST:", req.method, req.url);

    res.on("finish", () => {
        console.log(
            "RESPONSE:",
            req.method,
            req.url,
            res.statusCode
        );
    });

    next();
});

// CORS configuration.
const normalizeOrigin = (url) => url.trim().replace(/\/+$/, "");

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
    ...(process.env.FRONTEND_URL || "")
        .split(",")
        .map(normalizeOrigin)
        .filter(Boolean),
];

app.use(
    cors({
        origin(origin, callback) {
            if (
                !origin ||
                allowedOrigins.includes(normalizeOrigin(origin))
            ) {
                return callback(null, true);
            }

            return callback(new Error("Origin not allowed by CORS"));
        },
        methods: ["GET", "POST", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        optionsSuccessStatus: 204,
    })
);

app.use(express.json({ limit: "20kb" }));

// PostgreSQL connection.
const pool = new Pool({
    connectionString: DATABASE_URL,
    max: 5,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
});

pool.on("error", (error) => {
    console.error("Unexpected database pool error:", error.message);
});

function cleanText(value, maxLength = 2000) {
    return typeof value === "string"
        ? value.trim().slice(0, maxLength)
        : "";
}

// Admin authentication.
function requireAdmin(req, res, next) {
    const authorization = req.get("Authorization") || "";
    const token = authorization.startsWith("Bearer ")
        ? authorization.slice(7).trim()
        : "";

    if (
        token.length !== ADMIN_TOKEN.length ||
        token !== ADMIN_TOKEN
    ) {
        return res.status(401).json({
            error: "Admin authentication required.",
        });
    }

    next();
}

// Health check.
app.get("/api/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        return res.status(200).json({
            status: "ok",
            service: "Diksha Realty API",
            database: "connected",
        });
    } catch (error) {
        console.error("Health check failed:", error.message);

        return res.status(503).json({
            status: "error",
            error: "Database unavailable.",
        });
    }
});

// Save a customer enquiry.
app.post("/api/enquiries", async (req, res) => {
    try {
        const name = cleanText(req.body?.name, 100);
        const phone = cleanText(req.body?.phone, 30);
        const enquiryType = cleanText(req.body?.enquiryType, 100);
        const budget = cleanText(req.body?.budget, 100);
        const message = cleanText(
            req.body?.message || req.body?.requirements,
            2000
        );

        const digits = phone.replace(/\D/g, "");

        if (!name) {
            return res.status(400).json({
                error: "Name is required.",
            });
        }

        if (
            !/^\+?[0-9\s()-]+$/.test(phone) ||
            digits.length < 10 ||
            digits.length > 15
        ) {
            return res.status(400).json({
                error: "Please enter a valid phone number.",
            });
        }

        const allowedTypes = [
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

        if (!allowedTypes.includes(enquiryType)) {
            return res.status(400).json({
                error: "Please select a valid enquiry type.",
            });
        }

        const result = await pool.query(
            `INSERT INTO enquiries
       (name, phone, enquiry_type, budget, message, status)
       VALUES ($1, $2, $3, $4, $5, 'New')
       RETURNING id`,
            [name, phone, enquiryType, budget, message]
        );

        return res.status(201).json({
            success: true,
            message: "Enquiry saved successfully.",
            enquiryId: result.rows[0].id,
        });
    } catch (error) {
        console.error("Save enquiry error:", error.message);

        return res.status(500).json({
            error: "Unable to save enquiry.",
        });
    }
});

// List enquiries (admin only).
app.get("/api/enquiries", requireAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT
        id,
        name,
        phone,
        enquiry_type AS "enquiryType",
        budget,
        message,
        status,
        created_at AS "createdAt"
      FROM enquiries
      ORDER BY id DESC
    `);

        return res.json({
            enquiries: result.rows,
        });
    } catch (error) {
        console.error("Load enquiries error:", error.message);

        return res.status(500).json({
            error: "Unable to load enquiries.",
        });
    }
});

// Update enquiry status (admin only).
app.patch(
    "/api/enquiries/:id/status",
    requireAdmin,
    async (req, res) => {
        try {
            const id = Number(req.params.id);
            const status = cleanText(req.body?.status, 30);

            const validStatuses = [
                "New",
                "Contacted",
                "In Progress",
                "Closed",
            ];

            if (!Number.isSafeInteger(id) || id < 1) {
                return res.status(400).json({
                    error: "Invalid enquiry ID.",
                });
            }

            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    error: "Invalid status.",
                });
            }

            const result = await pool.query(
                `UPDATE enquiries
         SET status = $1
         WHERE id = $2
         RETURNING id`,
                [status, id]
            );

            if (result.rowCount === 0) {
                return res.status(404).json({
                    error: "Enquiry not found.",
                });
            }

            return res.json({
                success: true,
                message: "Enquiry status updated.",
            });
        } catch (error) {
            console.error("Update status error:", error.message);

            return res.status(500).json({
                error: "Unable to update enquiry status.",
            });
        }
    }
);

// Return JSON for unknown API routes.
app.use("/api", (req, res) => {
    return res.status(404).json({
        error: "API route not found.",
        path: req.originalUrl,
    });
});

// Error handling.
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);

    if (err.message === "Origin not allowed by CORS") {
        return res.status(403).json({
            error: "Origin not allowed by CORS.",
        });
    }

    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({
            error: "Invalid JSON request body.",
        });
    }

    console.error("API error:", err.message);

    return res.status(500).json({
        error: "Internal server error.",
    });
});

// Initialize database and start server.
async function startServer() {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        enquiry_type VARCHAR(100) NOT NULL,
        budget VARCHAR(100) NOT NULL DEFAULT '',
        message TEXT NOT NULL DEFAULT '',
        status VARCHAR(30) NOT NULL DEFAULT 'New',
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

        const server = app.listen(PORT, "0.0.0.0", () => {
            console.log(`Diksha Realty API running on port ${PORT}`);
            console.log("PostgreSQL database is ready.");
        });

        server.on("error", (error) => {
            console.error("HTTP server error:", error.message);
            process.exitCode = 1;
        });

        let shuttingDown = false;

        const shutdown = () => {
            if (shuttingDown) return;
            shuttingDown = true;

            console.log("Stopping API...");

            server.close(async () => {
                try {
                    await pool.end();
                    console.log("Database connections closed.");
                    process.exit(0);
                } catch (error) {
                    console.error("Shutdown error:", error.message);
                    process.exit(1);
                }
            });
        };

        process.once("SIGINT", shutdown);
        process.once("SIGTERM", shutdown);
    } catch (error) {
        console.error("Could not start API:", error.message);
        await pool.end().catch(() => { });
        process.exit(1);
    }
}

startServer();
