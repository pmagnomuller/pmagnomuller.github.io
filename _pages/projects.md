---
title: "Projects"
permalink: /projects/
layout: home
author_profile: true
classes: wide
---

<div class="projects-hero">
  <h1>Projects</h1>
  <p>Side projects I'm building and experimenting with.</p>
</div>

<div class="projects-grid">
  

  <a class="project-card" href="https://catchupdigest.com" target="_blank" rel="noopener noreferrer">
    <div class="project-label project-label--wip">In progress</div>
    <h2>Catchup Digest</h2>
    <p class="project-tagline">
      Service that summarizes the newsletters you receive so you can catch up in minutes.
    </p>
    <p class="project-meta">catchupdigest.com</p>
  </a>

  <a class="project-card" href="https://do-not-stop.com" target="_blank" rel="noopener noreferrer">
    <div class="project-label project-label--wip">In progress</div>
    <h2>DNS – Do Not Stop</h2>
    <p class="project-tagline">Streetwear shop with bold, timeless pieces.</p>
    <p class="project-meta">do-not-stop.com</p>
  </a>
  
</div>

<style>
.projects-hero {
  text-align: left;
  margin: 3rem auto 2rem auto;
  max-width: 760px;
}

.projects-hero h1 {
  font-size: 2.1rem;
  margin-bottom: 0.5rem;
}

.projects-hero p {
  color: #5f6368;
  margin: 0;
  font-size: 1rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.75rem;
  max-width: 900px;
  margin: 0 auto 4rem auto;
}

.project-card {
  position: relative;
  display: block;
  padding: 1.75rem 1.5rem;
  border-radius: 14px;
  border: 1px solid #e0e0e0;
  text-decoration: none;
  background: radial-gradient(circle at top left, #f8fafc, #ffffff);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.03);
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    border-color 0.16s ease,
    background 0.16s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: #d0d7de;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
  background: radial-gradient(circle at top left, #f1f5f9, #ffffff);
}

.project-label {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: rgba(22, 163, 74, 0.08);
  color: #15803d;
  margin-bottom: 0.9rem;
}

.project-label--wip {
  background: rgba(234, 179, 8, 0.08);
  color: #b45309;
}

.project-card h2 {
  margin: 0 0 0.4rem 0;
  font-size: 1.25rem;
  color: #111827;
}

.project-tagline {
  margin: 0 0 0.7rem 0;
  color: #4b5563;
  font-size: 0.98rem;
  line-height: 1.5;
}

.project-meta {
  margin: 0;
  font-size: 0.85rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .projects-hero {
    margin-top: 2.25rem;
  }

  .projects-hero h1 {
    font-size: 1.7rem;
  }
}
</style>

