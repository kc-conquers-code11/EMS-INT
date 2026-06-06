# Prompt & Workflow Optimization Guide

Based on the development of the Payment History and Fee Receipt features, here is a generalized list of improvements and discrepancies between the original naive prompt and the final robust implementation. 

These guidelines should be used as context to optimize future prompts for similar tasks, such as **Hall Ticket Generation (`/api/hall-ticket/:studentId`)**.

## 1. Do Not "Assume" Database Schemas
* **What Happened:** The initial prompt stated: `assume students table has name/email`. During implementation, it was discovered that `students` does not have these fields; they are stored in `student_personaldetails`. The SQL view `v_payment_history` failed initially and had to be rewritten.
* **Prompt Improvement:** Never instruct the AI to "assume" schema structures. Instead, either:
  1. Provide the exact table definitions (e.g., from `DESCRIBE table_name`).
  2. Explicitly instruct the AI to query the database structure (`DESCRIBE`) *before* writing multi-table `JOIN` queries or `VIEW`s.

## 2. Prefer HTML + Puppeteer over PDFKit for Complex Documents
* **What Happened:** The prompt requested `pdfkit` for generating receipts. However, PDFKit requires manual X/Y coordinate drawing, making complex layouts (tables, diagonal watermarks, responsive text) extremely tedious and fragile. We migrated to `puppeteer` and used an HTML/CSS template (`src/templates/receiptTemplate.js`), which resulted in a much cleaner, maintainable, and visually robust PDF.
* **Future Application (Hall Tickets):** When generating Hall Tickets (which typically require student photos, complex tables for exam schedules, and university headers), **explicitly request `puppeteer`** and an HTML template rather than `pdfkit`.

## 3. Strict Internal Type Safety (Beyond Controllers)
* **What Happened:** The prompt only requested Zod validation at the controller level (validating `req.params`). We went further and implemented a Zod validation schema inside the helper function (`src/helpers/receipt.helper.js`) for the internal `txnData` payload.
* **Future Application:** For critical file generators (like Hall Tickets), instruct the AI to define Zod schemas for the data being passed *into* the internal helpers/services to prevent undefined property errors at runtime (e.g., `TypeError: Cannot destructure property 'txn_id' of 'txnData' as it is undefined`).

## 4. Resilient File Streaming (`res.download`)
* **What Happened:** The prompt suggested a simple `res.download(filePath, fileName)`. We improved this by adding a callback to handle network interruptions or stream failures during download, preventing silent failures and "headers already sent" crashes.
* **Future Application:** When serving PDFs (like downloading Hall Tickets), always instruct the AI to wrap `res.download` with error handling callbacks.
  ```javascript
  res.download(filePath, fileName, (err) => {
    if (err && !res.headersSent) {
      res.status(500).json({ success: false, message: 'File transfer failed' });
    }
  });
  ```

## 5. Include Developer/QA Testing Tools
* **What Happened:** During testing, we encountered UI issues in the local Razorpay testing HTML file where long JSON signatures were breaking out of their containers. We improved `index.html` with proper CSS (`word-wrap: break-word`, `white-space: pre-wrap`) to make QA easier.
* **Future Application:** When building features that require complex state or 3rd-party integration, request the AI to provide or update a local HTML test harness or Postman collections to verify the end-to-end flow.

## 6. Model vs. View Synchronization
* **What Happened:** If Sequelize syncs automatically (`sync({ alter: true })`), it might mistakenly create a physical table instead of a SQL `VIEW` if the models are initialized before the raw SQL migration is run.
* **Prompt Improvement:** Instruct the AI to ensure proper setup order: manually drop any auto-created tables with the view's name *before* running the `CREATE OR REPLACE VIEW` raw SQL script.
