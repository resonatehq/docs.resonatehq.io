import React from "react";
import "./CloneRepoCard.css"; // Optional, or use inline styles

export default function CloneRepoCard({ sdk, description, link }) {
  return (
    <div className="clone-repo-card">
      <p className="clone-repo-card-sdk">{sdk}</p>
      <p className="clone-repo-card-description">{description}</p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="clone-button"
      >
        <i className="bx bxl-github"></i> Clone this repo
      </a>
    </div>
  );
}
