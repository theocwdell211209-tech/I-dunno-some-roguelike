const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const dist = path.join(root, "dist");
fs.rmSync(dist, {recursive: true, force: true});
fs.mkdirSync(path.join(dist, "data"), {recursive: true});
fs.mkdirSync(path.join(dist, "icons"), {recursive: true});

for (const file of ["index.html", "styles.css", "game.js", "manifest.webmanifest"]) {
  fs.copyFileSync(path.join(root, file), path.join(dist, file));
}
fs.copyFileSync(path.join(root, "data", "card-database.json"), path.join(dist, "data", "card-database.json"));
fs.copyFileSync(path.join(root, "icons", "icon.svg"), path.join(dist, "icons", "icon.svg"));

console.log("Built native web bundle in dist/");
