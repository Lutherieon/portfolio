// Visible project list and categories; page content lives in site-content.js.
window.PROJECTS = (window.PROJECT_LIBRARY || []).filter(project => project.published === true);
window.PORTFOLIO_CATEGORIES = ['All', ...new Set(window.PROJECTS.map(project => project.category))];
