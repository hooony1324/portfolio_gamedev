function toggleProject(element) {
    const currentActive = document.querySelector('.project.active');
    if (currentActive && currentActive !== element) {
        currentActive.classList.remove('active');
    }
    element.classList.toggle('active');
}

window.onload = function() {
    const projectsContainer = document.getElementById('projects-container');
    
    projects.forEach(project => {
        const mediaItemsHTML = project.mediaItems.map(item => `
            <div class="media-item">
                <img src="${item.src}" alt="${item.caption}">
                <p class="media-caption">${item.caption}</p>
            </div>
        `).join('');

        const projectHTML = `
            <section class="project" onclick="toggleProject(this)">
                <h2>${project.title}</h2>
                <p class="brief">${project.brief}</p>
                <span class="click-guide">click</span>
                <div class="content">
                    <div class="media-gallery">
                        ${mediaItemsHTML}
                    </div>
                    <div class="description">
                        <h3>주요 기능</h3>
                        <ul>
                            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                        <p>${project.description}</p>
                    </div>
                </div>
            </section>
        `;
        projectsContainer.innerHTML += projectHTML;
    });
};