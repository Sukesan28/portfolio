let currentFilter = 'all';
let currentSearch = '';
let editingProjectId = null;

let allProjects = [
    {
        id: 1,
        title: "Smart ATM",
        category: "java",
        tags: ["Java", "JDBC", "MySQL"],
        description: "The Smart ATM Project is a Java-based application that simulates real-world ATM operations. It allows users to create accounts, deposit and withdraw money, check balance, and view mini statements. The system is connected to a MySQL database using JDBC for secure data storage and retrieval.",
        technologies: "Java, JDBC, MySQL",
        github: "",
        caseStudy: "",
        media: ""
    },
    {
        id: 2,
        title: "Portfolio",
        category: "html/css/js",
        tags: ["HTML", "CSS", "JavaScript"],
        description: "A clean portfolio featuring a styled HTML button with Font Awesome icons for seamless navigation to the home page. Utilizes inline JavaScript for functionality, with potential for enhanced maintainability and accessibility.",
        technologies: "HTML,CSS,JavaScript",
        github: "",
        caseStudy: "",
        media: ""
    },
    {
        id: 3,
        title: "Simple Calculator",
        category: "html/css/js",
        tags: ["HTML", "CSS", "JavaScript"],
        description: "This is a modern web-based Calculator built with HTML, CSS, and JavaScript. It supports basic arithmetic operations, percentage calculation, and includes features like clear, delete, and keyboard input support for a smooth user experience.",
        technologies: "HTML, CSS, JavaScript",
        github: "",
        caseStudy: "",
        media: ""
    },
    {
        id: 4,
        title: "Rock Paper Scissors Game",
        category: "html/css/js",
        tags: ["HTML", "CSS", "JavaScript"],
        description: "A fun and interactive game built with HTML, CSS, and JavaScript, where you play Rock, Paper, or Scissors against the computer. It features a modern UI with smooth animations for an engaging experience.",
        technologies: "HTML,CSS,JavaScript",
        github: "",
        caseStudy: "",
        media: ""
    },
    {
        id: 5,
        title: "Object Detection using YOLO",
        category: "python",
        tags: ["Python"],
        description: "A real-time object detection system using YOLOv8 and OpenCV that can detect and annotate multiple objects in images or videos, with optional audio feedback for detected objects.",
        technologies: "Python",
        github: "",
        caseStudy: "",
        media: ""
    }
];

async function fetchProjects() {
    try {
        console.log('Fetching projects with filter:', currentFilter, 'and search:', currentSearch);
        let projects = allProjects.filter(p => currentFilter === 'all' || p.category === currentFilter);
        if (currentSearch) {
            const searchLower = currentSearch.toLowerCase();
            projects = projects.filter(p => 
                p.title.toLowerCase().includes(searchLower) ||
                p.description.toLowerCase().includes(searchLower) ||
                p.tags.some(t => t.toLowerCase().includes(searchLower)) ||
                p.technologies.toLowerCase().includes(searchLower)
            );
        }
        renderProjects(projects);
        updateCounts(allProjects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        document.getElementById('projectsGrid').innerHTML = '<p>Error loading projects...</p>';
        showFeedback('Failed to load projects. Please try again.');
    }
}

function renderProjects(projects) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return; // Exit if not on project.html
    grid.innerHTML = projects.map(project => `
        <div class="project-card" data-category="${project.category}">
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <p class="project-tags"><strong>Tags:</strong> ${project.tags.join(', ')}</p>
                <p class="project-technologies"><strong>Technologies:</strong> ${project.technologies}</p>
                ${project.github ? `<a href="${project.github}" class="project-link" target="_blank" aria-label="View ${project.title} on GitHub">GitHub</a>` : ''}
                ${project.caseStudy ? `<a href="${project.caseStudy}" class="project-link" target="_blank" aria-label="View case study for ${project.title}">Case Study</a>` : ''}
                ${project.media ? `
                    ${project.media.endsWith('.mp4') || project.media.endsWith('.webm') ?
                        `<video controls class="project-media"><source src="${project.media}" type="video/${project.media.split('.').pop()}"></video>` :
                        `<img src="${project.media}" alt="${project.title}" class="project-media">`
                    }
                ` : `<div class="project-media-placeholder">No Media Available</div>`}
                <div class="project-actions">
                    <button onclick="editProject(${project.id})" aria-label="Edit project ${project.title}">Edit</button>
                    <button onclick="deleteProject(${project.id})" aria-label="Delete project ${project.title}">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCounts(projects) {
    const counts = {
        all: projects.length,
        java: projects.filter(p => p.category === 'java').length,
        sql: projects.filter(p => p.category === 'sql').length,
        'html/css/js': projects.filter(p => p.category === 'html/css/js').length
    };
    Object.keys(counts).forEach(category => {
        const countElement = document.getElementById(`count-${category}`);
        if (countElement) countElement.textContent = counts[category];
    });
}

function toggleProjectForm() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.style.display = 'block';
        document.getElementById('projectForm').reset();
        editingProjectId = null;
    }
}

function closeProjectForm() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('projectForm').reset();
        editingProjectId = null;
    }
}

function editProject(id) {
    const project = allProjects.find(p => p.id === id);
    if (project) {
        editingProjectId = id;
        document.getElementById('projectTitle').value = project.title;
        document.getElementById('projectCategory').value = project.category;
        document.getElementById('projectTags').value = project.tags.join(', ');
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectTechnologies').value = project.technologies;
        document.getElementById('projectGithub').value = project.github || '';
        document.getElementById('projectCaseStudy').value = project.caseStudy || '';
        toggleProjectForm();
    } else {
        showFeedback('Failed to load project for editing.');
    }
}

function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        allProjects = allProjects.filter(p => p.id !== id);
        fetchProjects();
        showFeedback('Project deleted successfully.');
    }
}

function filterProjects(category) {
    console.log('Filtering projects by category:', category);
    currentFilter = category.toLowerCase();
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category.toLowerCase() === currentFilter);
    });
    fetchProjects();
}

function searchProjects(query) {
    console.log('Searching projects with query:', query);
    currentSearch = query;
    fetchProjects();
}

// Improved: Email client functionality
function openEmailClient(event) {
    console.log('Email button clicked');
    const email = 'sukesanramasamy204@gmail.com';
    try {
        // Check secure context for clipboard access
        if (!window.isSecureContext) {
            console.warn('Non-secure context detected; clipboard may not work');
            showFeedback(`Please email me at: ${email} (copy manually)`);
            return;
        }

        // Attempt to open email client
        const mailtoLink = document.createElement('a');
        mailtoLink.href = `mailto:${email}?subject=Contact%20from%20Portfolio`;
        mailtoLink.style.display = 'none';
        document.body.appendChild(mailtoLink);
        mailtoLink.click();
        document.body.removeChild(mailtoLink);
        console.log('Attempted to open email client');

        // Fallback to clipboard after a short delay
        setTimeout(() => {
            navigator.clipboard.writeText(email).then(() => {
                console.log('Email copied to clipboard:', email);
                showFeedback('Email copied to clipboard: ' + email);
            }).catch(err => {
                console.error('Failed to copy email:', err);
                showFeedback(`Please email me at: ${email}`);
            });
        }, 500); // Reduced delay for faster feedback
    } catch (error) {
        console.error('Error in openEmailClient:', error);
        navigator.clipboard.writeText(email).then(() => {
            console.log('Email copied to clipboard:', email);
            showFeedback('Email copied to clipboard: ' + email);
        }).catch(err => {
            console.error('Clipboard copy failed:', err);
            showFeedback(`Please email me at: ${email}`);
        });
    }
}

// Show feedback message
function showFeedback(message) {
    console.log('Showing feedback:', message);
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.className = 'feedback-message';
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 4000);
}

// Initialize skill progress bars
function initSkillProgress() {
    console.log('Initializing skill progress bars');
    const progressBars = document.querySelectorAll('.skill-progress');
    if (progressBars.length > 0) {
        progressBars.forEach(bar => {
            const width = bar.dataset.width || 0;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.transition = 'width 2s ease';
                bar.style.width = `${width}%`;
            }, 100);
        });
    } else {
        console.log('No skill progress bars found');
    }
}

// Initialize particle animation (optional)
function initParticles() {
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles')) {
        console.log('Initializing particles.js');
        particlesJS('particles', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#00ffff' },
                shape: { type: 'circle' },
                opacity: { value: 0.6 },
                size: { value: 3, random: true },
                move: { enable: true, speed: 2 }
            },
            interactivity: {
                events: { onhover: { enable: true, mode: 'repulse' } }
            }
        });
    } else {
        console.log('particles.js not loaded or #particles not found');
    }
}

// Initialize based on page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing script for page:', window.location.pathname);
    const isProjectPage = window.location.pathname.includes('project.html');
    const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname === '/';

    if (isProjectPage) {
        console.log('Initializing project page');
        document.getElementById('projectSearch')?.addEventListener('input', (e) => searchProjects(e.target.value));
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => filterProjects(btn.dataset.category));
        });
        document.getElementById('projectModal')?.addEventListener('click', (e) => {
            if (e.target === document.getElementById('projectModal')) closeProjectForm();
        });
        document.getElementById('projectForm')?.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('projectTitle').value.trim();
            const category = document.getElementById('projectCategory').value;
            if (!title || !category) {
                showFeedback('Title and Category are required!');
                return;
            }
            const mediaFile = document.getElementById('projectMedia').files[0];
            const newProject = {
                title,
                category,
                tags: document.getElementById('projectTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
                description: document.getElementById('projectDescription').value,
                technologies: document.getElementById('projectTechnologies').value,
                github: document.getElementById('projectGithub').value,
                caseStudy: document.getElementById('projectCaseStudy').value,
                media: mediaFile ? URL.createObjectURL(mediaFile) : ''
            };
            if (editingProjectId) {
                const index = allProjects.findIndex(p => p.id === editingProjectId);
                if (index !== -1) {
                    newProject.id = editingProjectId;
                    allProjects[index] = newProject;
                }
            } else {
                newProject.id = allProjects.length > 0 ? Math.max(...allProjects.map(p => p.id)) + 1 : 1;
                allProjects.push(newProject);
            }
            closeProjectForm();
            fetchProjects();
            showFeedback(`Project ${editingProjectId ? 'updated' : 'added'} successfully!`);
        });
        fetchProjects();
    }

    if (isIndexPage) {
        console.log('Initializing index page');
        initSkillProgress();
        initParticles();
        // Add email button event listener
        const emailButton = document.querySelector('.contact-card.email');
        if (emailButton) {
            console.log('Email button found, adding event listener');
            emailButton.addEventListener('click', openEmailClient);
        } else {
            console.error('Email button (.contact-card.email) not found');
            showFeedback('Email button not found. Please contact sukesanramasamy204@gmail.com.');
        }
    }
});