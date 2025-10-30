import express, { type Request, Response, NextFunction } from "express";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

(async () => {
  const httpServer = require("http").createServer(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  if (app.get("env") === "development") {
    await setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || '5000', 10);
  httpServer.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    log(`Simple server ready - full features will be enabled after installing all packages`);
  });
})();
