import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

const [source, background, screen, logo] = await Promise.all([
  readFile(join(here, "cover-maker.source.html"), "utf8"),
  readFile(join(here, "tradereplay-cover-background.png")),
  readFile(join(here, "tradereplay-training-screen.png")),
  readFile(join(here, "tradereplay-logo-dark.svg")),
]);

const built = source
  .replace("__BACKGROUND_DATA__", `data:image/png;base64,${background.toString("base64")}`)
  .replace("__SCREEN_DATA__", `data:image/png;base64,${screen.toString("base64")}`)
  .replace("__LOGO_DATA__", `data:image/svg+xml;base64,${logo.toString("base64")}`);

await writeFile(join(here, "TradeReplay-Bilibili-cover-maker.html"), built);
