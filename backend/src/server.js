import express from "express";

const app = express();

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy", timestamp: new Date() });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
