async function loadProjectFiles() {
    const projectFiles = ['project_unity.md'];
    const tabsContainer = document.querySelector('.project-tabs');
    
    projectFiles.forEach((file, index) => {
        const button = document.createElement('button');
        button.className = 'tab-button' + (index === 0 ? ' active' : '');
        button.textContent = file.replace('project_', '').replace('.md', '');
        button.addEventListener('click', () => loadProjectContent(file));
        tabsContainer.appendChild(button);
    });

    // 초기 프로젝트 로드
    await loadProjectContent(projectFiles[0]);
}

async function loadProjectContent(filename) {
    try {
        const response = await fetch(`projects/${filename}`);
        const markdown = await response.text();
        const html = marked.parse(markdown);
        document.getElementById('project-content').innerHTML = html;

        // 활성 버튼 스타일 업데이트
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
            if (button.textContent.toLowerCase() === filename.replace('project_', '').replace('.md', '')) {
                button.classList.add('active');
            }
        });
    } catch (error) {
        console.error('Error loading project:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadProjectFiles);


