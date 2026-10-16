
require("dotenv").config({ override: true });

const express = require("express");
const cors = require("cors");
const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const ADMIN_TOKEN = (process.env.ADMIN_TOKEN || "").trim();
const DB_PATH = path.join(__dirname, "diksha-realty.sqlite");

if (ADMIN_TOKEN.length < 32) {
    console.error("ADMIN_TOKEN must contain at least 32 characters in .env");
    process.exit(1);
}

// CORS for local development only.
// Do not use this unrestricted origin policy in production.
app.use(
    cors({
        origin: true,
        methods: ["GET", "POST", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        optionsSuccessStatus: 204,
    })
);

app.use(express.json({ limit: "20kb" }));

let db;
let saveDatabase;

function queryAll(sql, params = []) {
    const statement = db.prepare(sql);
    const rows = [];

    try {
        statement.bind(params);
        while (statement.step()) {
            rows.push(statement.getAsObject());
        }
    } finally {
        statement.free();
    }

    return rows;
}

function queryOne(sql, params = []) {
    return queryAll(sql, params)[0] || null;
}

function cleanText(value, maxLength = 2000) {
    return typeof value === "string"
        ? value.trim().slice(0, maxLength)
        : "";
}

function requireAdmin(req, res, next) {
    const authorization = req.get("Authorization") || "";
    const token = authorization.startsWith("Bearer ")
        ? authorization.slice(7).trim()
        : "";

    if (token !== ADMIN_TOKEN) {
        return res.status(401).json({
            error: "Admin authentication required.",
        });
    }

    next();
}

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        service: "Diksha Realty API",
    });
});

// Submit a customer enquiry
app.post("/api/enquiries", (req, res) => {
    try {
        const name = cleanText(req.body.name, 100);
        const phone = cleanText(req.body.phone, 30);
        const enquiryType = cleanText(req.body.enquiryType, 100);
        const budget = cleanText(req.body.budget, 100);
        const message = cleanText(
            req.body.message || req.body.requirements,
            2000
        );

        const digits = phone.replace(/\D/g, "");

        if (!name) {
            return res.status(400).json({ error: "Name is required." });
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

        db.run(
            `INSERT INTO enquiries
       (name, phone, enquiry_type, budget, message, status)
       VALUES (?, ?, ?, ?, ?, 'New')`,
            [name, phone, enquiryType, budget, message]
        );

        const inserted = queryOne("SELECT last_insert_rowid() AS id");
        saveDatabase();

        return res.status(201).json({
            success: true,
            message: "Enquiry saved successfully.",
            enquiryId: inserted.id,
        });
    } catch (error) {
        console.error("Save enquiry error:", error.message);
        return res.status(500).json({
            error: "Unable to save enquiry.",
        });
    }
});

// Get enquiries - admin only
app.get("/api/enquiries", requireAdmin, (req, res) => {
    try {
        const enquiries = queryAll(`
      SELECT
        id,
        name,
        phone,
        enquiry_type AS enquiryType,
        budget,
        message,
        status,
        created_at AS createdAt
      FROM enquiries
      ORDER BY id DESC
    `);

        return res.json({ enquiries });
    } catch (error) {
        console.error("Load enquiries error:", error.message);
        return res.status(500).json({
            error: "Unable to load enquiries.",
        });
    }
});

// Update enquiry status - admin only
app.patch("/api/enquiries/:id/status", requireAdmin, (req, res) => {
    try {
        const id = Number(req.params.id);
        const status = cleanText(req.body.status, 30);
        const validStatuses = ["New", "Contacted", "In Progress", "Closed"];

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({ error: "Invalid enquiry ID." });
        }

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status." });
        }

        const existing = queryOne(
            "SELECT id FROM enquiries WHERE id = ?",
            [id]
        );

        if (!existing) {
            return res.status(404).json({ error: "Enquiry not found." });
        }

        db.run(
            "UPDATE enquiries SET status = ? WHERE id = ?",
            [status, id]
        );

        saveDatabase();

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
});

// Error handler
app.use((err, req, res, next) => {
    console.error("API error:", err.message);

    if (err.message === "Origin not allowed by CORS") {
        return res.status(403).json({ error: err.message });
    }

    return res.status(500).json({ error: "Internal server error." });
});

async function startServer() {
    try {
        const SQL = await initSqlJs();

        if (fs.existsSync(DB_PATH)) {
            db = new SQL.Database(fs.readFileSync(DB_PATH));
        } else {
            db = new SQL.Database();
        }

        db.run(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        enquiry_type TEXT NOT NULL,
        budget TEXT DEFAULT '',
        message TEXT DEFAULT '',
        status TEXT NOT NULL DEFAULT 'New',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

        saveDatabase = () => {
            fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
        };

        saveDatabase();

        const server = app.listen(PORT, "127.0.0.1", () => {
            console.log(`Diksha Realty API running at http://127.0.0.1:${PORT}`);
            console.log("SQLite database is ready.");
        });

        const shutdown = () => {
            console.log("Saving database and stopping API...");
            try {
                saveDatabase();
                db.close();
            } finally {
                server.close(() => process.exit(0));
            }
        };

        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);
    } catch (error) {
        console.error("Could not start API:", error);
        process.exit(1);
    }
}

startServer();
