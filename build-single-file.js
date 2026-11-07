const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const html = read("index.html")
  .replace(/\s*<link rel="manifest"[^>]*>/, "")
  .replace(/\s*<link rel="icon"[^>]*>/, "")
  .replace(/\s*<link rel="apple-touch-icon"[^>]*>/, "")
  .replace(/\s*<link rel="preconnect"[^>]*>/g, "")
  .replace(/\s*<link href="https:\/\/fonts\.googleapis\.com[^>]*>/, "")
  .replace(/\s*<link rel="stylesheet" href="styles\.css" \/>/, `\n    <style>\n${read("styles.css")}\n    </style>`)
  .replace(/\s*<script src="game\.js"><\/script>/, `\n    <script id="embedded-card-database" type="application/json">${read("data/card-database.json")}</script>\n    <script>\n${read("game.js").replace('if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js"));', "")}\n    </script>`);

fs.writeFileSync(path.join(root, "duel-dive.html"), `<!doctype html>\n${html.replace(/^<!doctype html>\s*/i, "")}`);
console.log("Built duel-dive.html");
