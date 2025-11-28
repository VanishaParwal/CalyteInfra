import "dotenv/config"; // Loads .env file immediately
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { createServer } from "http";
import cors from "cors";
import 'express-async-errors';
import { connectDatabase } from "./config/database";

// NOTE: If you don't have server/static.ts, we can skip importing it for dev
// import { serveStatic } from "./static";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(cors());
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // 1. Connect to Database
    await connectDatabase().catch(err => console.warn('DB connection issue:', err));
    
    // 2. Register Routes
    await registerRoutes(httpServer, app);

    // 3. Error Handling
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error(err);
    });

    // 4. Setup Vite (Development) or Static (Production)
    if (process.env.NODE_ENV === "production") {
      // serveStatic(app);
      console.log("Static serving skipped for now");
    } else {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    }

    // 5. Start Server (FIXED: Removed reusePort for Windows compatibility)
    const port = parseInt(process.env.PORT || "5000", 10);
    
    httpServer.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();