import React from "react";
import styles from "./DeploymentDiagram.module.css";

export default function DeploymentDiagram() {
  return (
    <div className={styles.container}>
      {/* Develop - all in one boundary */}
      <div className={styles.column}>
        <div className={styles.title}>Develop</div>
        <div className={styles.subtitle}>All in-memory</div>
        <div className={styles.stack}>
          <div className={styles.boundaryFull} />
          <div className={styles.layer}>App</div>
          <div className={styles.layer}>Server</div>
          <div className={styles.layer}>Storage</div>
        </div>
        <div className={styles.command}>
          <code>npx ts-node index.ts</code>
        </div>
      </div>

      {/* Debug - app separate, server+storage together */}
      <div className={styles.column}>
        <div className={styles.title}>Debug</div>
        <div className={styles.subtitle}>Separate server</div>
        <div className={styles.stack}>
          <div className={styles.boundaryTop} />
          <div className={styles.boundaryBottom2} />
          <div className={styles.layer}>App</div>
          <div className={styles.layer}>Server</div>
          <div className={styles.layer}>Storage</div>
        </div>
        <div className={styles.command}>
          <code>resonate dev</code>
        </div>
      </div>

      {/* Deploy - all separate */}
      <div className={styles.column}>
        <div className={styles.title}>Deploy</div>
        <div className={styles.subtitle}>Full persistence</div>
        <div className={styles.stack}>
          <div className={styles.boundaryTop} />
          <div className={styles.boundaryMiddle} />
          <div className={styles.boundaryBottom1} />
          <div className={styles.layer}>App</div>
          <div className={styles.layer}>Server</div>
          <div className={styles.layer}>Storage</div>
        </div>
        <div className={styles.command}>
          <code>resonate serve</code>
        </div>
      </div>
    </div>
  );
}
