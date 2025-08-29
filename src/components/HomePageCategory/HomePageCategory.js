import React from "react";
import "./HomePageCategory.css"; // Optional, or use inline styles

export default function HomePageCategory({ title, description, link }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="home-page-category-button"
    >
      <div className="home-page-category">
        <p className="home-page-category-title">{title}</p>
        <p className="home-page-category-description">{description}</p>
      </div>
    </a>
  );
}
