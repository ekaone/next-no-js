import { join } from "path";
import { readFileSync } from "fs";

let manifest;
let bootstrap;

if (process.env.NODE_ENV === "production") {
    try {
        const str = readFileSync(join(__dirname, "..", "..", "modfed-manifest.json"), "utf8");
        manifest = JSON.parse(str);
        const entry = manifest.children.find((child) => child.name === "modfed-entry");
        bootstrap = entry.assetsByChunkName.bootstrap[0];
        if (!bootstrap) {
            console.error("could not load bootstrap")
        }
    } catch (e) {
        console.error("could not read modfed manifest");
    }
}

export function RuntimeScriptInclude(props: { html: string }) {
    if (process.env.NODE_ENV === "production" && bootstrap && props.html.includes("data-modfed-id")) {
        return <script src={`/_next/static/chunks/modfed/${bootstrap}`} />;
    }

    return null;
}