
const fetch = require("node-fetch");

const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMi..."; // your full token here

const log = async (stack, level, pkg, message) => {
  try {
    const res = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": AUTH_TOKEN,
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });

    const data = await res.json();
    // Optional: store or display log ID if needed
    // console.log("Log Created: ", data.logId);
  } catch (error) {
    // DO NOT console.log in production log middleware
  }
};

module.exports = log;
