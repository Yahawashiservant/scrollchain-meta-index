// src/loaders/introspectionLoader.ts

import { connect } from "nats";
import { validateArtifactDoc } from "../schemaValidators/artifactDoc";

export async function runIntrospectionLoader() {
  const nc = await connect({ servers: "nats://localhost:4222" });
  const sub = nc.subscribe("artifact.doc.ingested");

  for await (const msg of sub) {
    const env = JSON.parse(msg.data.toString("utf-8"));
    const payload = env.payload;

    if (!validateArtifactDoc(payload)) {
      console.warn("Invalid artifact.doc.ingested payload", env.envelope_id);
      continue;
    }

    // Here you’d persist into your index DB
    // e.g., insert into introspection_artifacts (artifact_id, title, tags, provenance, created_at, payload_json)
    console.log("Introspection artifact ingested:", payload.provenance);
  }
}
