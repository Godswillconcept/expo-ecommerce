import express from "express";
import path from "path";
const app = express();
import { ENV } from "./config/env";

const __dirname = path.resolve();

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy", timestamp: new Date() });
});

/// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../admin/dist/index.html"));
  });
}

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});
