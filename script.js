function toggleProject(element) {
    const currentActive = document.querySelector('.project.active');
    if (currentActive && currentActive !== element) {
        currentActive.classList.remove('active');
    }
    element.classList.toggle('active');
}

function showProjects(category) {
    const projectsContainer = document.getElementById('projects-container');
    projectsContainer.innerHTML = '';

    projects[category].forEach(project => {
        const mediaItemsHTML = project.mediaItems.map(item => `
            <div class="media-item">
                <img src="assets/${item.src}" alt="${item.caption}">
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
                        <h3>${project.mainFeatures}</h3>
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
}

window.onload = function () {
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            showProjects(tab.dataset.category);
        });
    });

    // 초기 로드시 Unity 프로젝트 표시
    showProjects('unity');
};
