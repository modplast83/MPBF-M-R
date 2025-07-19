import express, { type Request, Response, NextFunction } from "express";
import fileUpload from "express-fileupload";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Enable trust proxy for Replit's environment
app.set("trust proxy", 1);

// Serve static assets
app.use(
  "/assets",
  express.static(path.resolve(import.meta.dirname, "..", "attached_assets")),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
    useTempFiles: false,
    abortOnLimit: true,
    createParentPath: true,
    safeFileNames: true,
    preserveExtension: true,
  }),
);

// Add CORS headers for cross-domain requests
app.use((req, res, next) => {
  // Accept requests from any domain
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Add special middleware for auth API routes to ensure proper content-type
app.use("/api/auth", (req, res, next) => {
  console.log(`Intercepted auth API request: ${req.path}`);

  // Capture the original send method
  const originalSend = res.send;

  // Override the send method to ensure JSON content type
  res.send = function (body) {
    // Only modify JSON responses
    if (typeof body === "object") {
      res.setHeader("Content-Type", "application/json");
      return originalSend.call(this, JSON.stringify(body));
    }
    return originalSend.call(this, body);
  };

  // Override the JSON method
  const originalJson = res.json;
  res.json = function (body) {
    res.setHeader("Content-Type", "application/json");
    return originalJson.call(this, body);
  };

  next();
});

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

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Database health check endpoint
  app.get("/api/health/database", async (req: Request, res: Response) => {
    try {
      // Import the pool from db.ts
      const { pool } = await import('./db.js');
      
      // Simple query to check database connectivity
      const result = await pool.query('SELECT 1 as health_check');

      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected'
      });
    } catch (error) {
      console.error('Database health check failed:', error);
      res.status(500).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message
      });
    }
  });

  // General health check endpoint
  app.get("/api/health", async (req: Request, res: Response) => {
    try {
      const { pool } = await import('./db.js');
      const result = await pool.query('SELECT 1 as health_check');

      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        version: process.env.npm_package_version || '1.0.0'
      });
    } catch (error) {
      console.error('Health check failed:', error);
      res.status(500).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message
      });
    }
  });

  // Debug endpoint to check session status - using manual response to bypass Vite
  app.get("/api/auth/debug", (req: any, res: Response) => {
    // Set explicit content type to prevent Vite from returning HTML
    res.setHeader("Content-Type", "application/json");

    const isAuthenticated = req.isAuthenticated();
    const sessionData = {
      isAuthenticated,
      session: req.session
        ? {
            id: req.session.id,
            cookie: req.session.cookie,
            // Don't expose sensitive data
            hasUser: !!req.user,
          }
        : null,
      user: req.user
        ? {
            hasClaims: !!req.user.claims,
            hasRefreshToken: !!req.user.refresh_token,
            hasExpiresAt: !!req.user.expires_at,
            claimsSubExists: req.user.claims?.sub ? true : false,
            expiresAt: req.user.expires_at,
            nowTime: Math.floor(Date.now() / 1000),
            tokenExpired: req.user.expires_at
              ? Math.floor(Date.now() / 1000) > req.user.expires_at
              : null,
          }
        : null,
    };

    // Manual response to bypass vite middleware
    const jsonData = JSON.stringify(sessionData);
    res.writeHead(200);
    return res.end(jsonData);
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(`Error handler caught: ${err.stack || err}`);

    // Send the error response but don't rethrow the error
    // This prevents unhandled exceptions
    if (!res.headersSent) {
      // Set explicit content type to ensure JSON
      res.setHeader("Content-Type", "application/json");
      res.status(status).json({ message });
    }
  });

  // DO NOT add the catch-all handler here - it was causing all API requests to 404
  // Instead, we'll rely on the explicit Content-Type headers we've added to each route

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use environment port with fallback for deployment
  const port = parseInt(process.env.PORT || process.env.REPL_PORT || "5000");
  const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "0.0.0.0";

  server.listen(port, host, () => {
    log(`serving on port ${port}`);
    if (process.env.NODE_ENV === "production") {
      console.log(`Production server running on ${host}:${port}`);
    }
  });
})();