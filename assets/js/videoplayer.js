document.addEventListener("DOMContentLoaded", function () {
    function initVideoPlayer() {
        console.log("[VideoPlayer] Initializing Video Player...");

        const videoConfig = {
            mainVideo: 'bF8dJTWS-kE',
            docLinkText: 'Go to Document',
            gridVideos: [
                {
                    id: 'bF8dJTWS-kE',
                    title: 'FSM, Shader Programming',
                    description: '첫 번째 비디오에 대한 설명입니다.',
                    docPath: document.body.getAttribute("data-baseurl") + '/pages/projects/2025-02-17-katanazero'
                },
                {
                    id: 'goNJwY7MeV8',
                    title: 'RPC, Rep Notify',
                    description: '두 번째 비디오에 대한 설명입니다.',
                    docPath: document.body.getAttribute("data-baseurl") + '/pages/projects/2025-02-17-katanazero'
                },
                {
                    id: 'BnkNg8czsp8',
                    title: 'Item, QuestSystem',
                    description: '세 번째 비디오에 대한 설명입니다.',
                    docPath: document.body.getAttribute("data-baseurl") + '/pages/projects/2025-02-17-katanazero'
                },
                {
                    id: 'jfsCp91ocgU',
                    title: 'Object Pooling, Resource Parsing',
                    description: '네 번째 비디오에 대한 설명입니다.',
                    docPath: document.body.getAttribute("data-baseurl") + '/pages/projects/2025-02-17-katanazero'
                }
            ]
        };

        function updateMainVideo(video) {
            console.log(`[VideoPlayer] Updating Main Video: ${video.title}`);
            const mainVideoElement = document.getElementById('main-video');
            if (mainVideoElement) {
                mainVideoElement.src = `https://www.youtube-nocookie.com/embed/${video.id}`;
            }

            const titleElement = document.getElementById('video-title');
            if (titleElement) {
                titleElement.textContent = video.title;
            }

            const descriptionElement = document.getElementById('video-description');
            if (descriptionElement) {
                descriptionElement.innerHTML =
                    `${video.description}<br><br><a href="${video.docPath}" class="doc-link">${videoConfig.docLinkText}</a>`;
            }
        }

        function renderVideoGrid() {
            console.log("[VideoPlayer] Rendering Video Grid...");
            const gridContainer = document.getElementById('video-grid');
            if (gridContainer) {
                gridContainer.innerHTML = videoConfig.gridVideos.map(video => `
                    <div class="video-item" onclick="changeVideo('${video.id}', '${video.title}', '${video.description}', '${video.docPath}')">
                        <img src="https://img.youtube.com/vi/${video.id}/0.jpg" alt="${video.title}">
                        <p>${video.title}</p>
                    </div>
                `).join('');
            }
        }

        window.changeVideo = function (id, title, description, docPath) {
            updateMainVideo({ id, title, description, docPath });
        };

        const mainVideoData = videoConfig.gridVideos.find(v => v.id === videoConfig.mainVideo) || videoConfig.gridVideos[0];
        updateMainVideo(mainVideoData);
        renderVideoGrid();
    }

    function checkAndInitVideoPlayer() {
        if (document.getElementById("main-video")) {
            initVideoPlayer();
        }
    }

    if (window.gitbook) {
        gitbook.events.bind("page.change", function () {
            console.log("[VideoPlayer] GitBook Page Changed - Checking Video Player...");
            setTimeout(checkAndInitVideoPlayer, 500);
        });
    } else {
        console.log("[VideoPlayer] GitBook Not Found - Initializing on DOMContentLoaded");
        checkAndInitVideoPlayer();
    }
});
