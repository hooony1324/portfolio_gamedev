// 전역 변수를 window 객체에 할당하여 재선언 문제 해결
window.videoPlayerState = window.videoPlayerState || {
    player: null,
    currentVideoId: null,
    isVideoLoaded: false,
    isGitbookReady: false,
    isInitialized: false
};

function getBaseUrl() {
    return window.location.pathname.split('/')[1];
}

// YouTube API가 준비되면 호출되는 함수
function onYouTubeIframeAPIReady() {
    console.log('1. YouTube API Ready');
    window.videoPlayerState.isVideoLoaded = true;
    initializeVideoIfReady();
}

function initializeVideoIfReady() {
    const state = window.videoPlayerState;
    console.log('2. Initializing Video Check:', {
        isVideoLoaded: state.isVideoLoaded,
        isGitbookReady: state.isGitbookReady,
        isInitialized: state.isInitialized,
        hasVideoContent: !!document.getElementById('video-content'),
        hasLoadingWrapper: !!document.getElementById('loading-wrapper')
    });
    
    if (state.isInitialized) {
        console.log('2-1. Already initialized, skipping');
        return;
    }
    
    const videoContent = document.getElementById('video-content');
    const loadingWrapper = document.getElementById('loading-wrapper');
    
    if (!videoContent || !loadingWrapper) {
        console.log('2-2. Required elements not found, returning');
        return;
    }

    if (window.forceInitialize || (state.isVideoLoaded && state.isGitbookReady)) {
        console.log('2-3. All checks passed, loading video player');
        state.isInitialized = true;
        loadVideoPlayer();
    } else {
        console.log('2-4. Not ready yet:', { isVideoLoaded: state.isVideoLoaded, isGitbookReady: state.isGitbookReady });
    }
}

function loadVideoPlayer() {
    const state = window.videoPlayerState;
    const videoContent = document.getElementById('video-content');
    const loadingWrapper = document.getElementById('loading-wrapper');
    
    const baseUrl = '/' + getBaseUrl();
    
    fetch(`${baseUrl}/assets/data/videos.json`)
        .then(response => response.json())
        .then(videoDatas => {
            if (!videoDatas || videoDatas.length === 0) {
                throw new Error('No video data available');
            }

            state.currentVideoId = videoDatas[0].id;
            
            function createPlayer() {
                // YouTube API 로드 상태 체크를 위한 Promise 생성
                const checkYouTubeAPI = () => {
                    return new Promise((resolve, reject) => {
                        if (typeof YT !== 'undefined' && YT.loaded) {
                            resolve();
                        } else {
                            const timeoutId = setTimeout(() => {
                                reject(new Error('YouTube API load timeout'));
                            }, 10000); // 10초 타임아웃

                            const checkInterval = setInterval(() => {
                                if (typeof YT !== 'undefined' && YT.loaded) {
                                    clearTimeout(timeoutId);
                                    clearInterval(checkInterval);
                                    resolve();
                                }
                            }, 500);
                        }
                    });
                };

                // YouTube API 로드 및 플레이어 생성
                checkYouTubeAPI()
                    .then(() => {
                        if (state.player) {
                            state.player.destroy();
                            state.player = null;
                        }

                        state.player = new YT.Player('player', {
                            height: '100%',
                            width: '100%',
                            videoId: state.currentVideoId,
                            playerVars: {
                                'playsinline': 1,
                                'rel': 0,
                                'cookie': 'CONSENT=YES+' // 쿠키 동의 명시
                            },
                            events: {
                                'onReady': onPlayerReady,
                                'onError': (event) => {
                                    console.error('Player Error:', event.data);
                                }
                            }
                        });

                        createVideoGrid(videoDatas);
                        updateVideoInfo(videoDatas[0]);
                        
                        loadingWrapper.style.display = 'none';
                        videoContent.style.display = 'block';
                    })
                    .catch(error => {
                        console.error('Player initialization error:', error);
                        loadingWrapper.innerHTML = 'Error initializing video player';
                    });
            }

            createPlayer();
        })
        .catch(error => {
            console.error('Content load error:', error);
            loadingWrapper.innerHTML = 'Error loading content';
        });
}

function onPlayerReady(event) {
    console.log('4. Player Ready, starting playback');
    event.target.playVideo();
}

function createVideoGrid(videos) {
    debugLog('Creating video grid', { count: videos.length });
    const grid = document.getElementById('video-grid');
    const state = window.videoPlayerState;
    
    grid.innerHTML = '';
    
    videos.forEach((video, index) => {
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        videoItem.innerHTML = `
            <img src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg" alt="${video.title}">
            <h3>${video.title}</h3>
        `;
        
        videoItem.addEventListener('click', () => {
            if (state.currentVideoId !== video.id) {
                debugLog('Switching video', { title: video.title });
                state.currentVideoId = video.id;
                
                if (state.player && typeof state.player.loadVideoById === 'function') {
                    state.player.loadVideoById(video.id);
                    updateVideoInfo(video);
                    window.scrollTo(0, 0);
                }
            }
        });
        
        grid.appendChild(videoItem);
    });
}

function updateVideoInfo(video) {
    console.log('6. Updating video info for:', video.title);
    const videoTitle = document.getElementById('video-title');
    const videoDescription = document.getElementById('video-description');
    const docLink = document.getElementById('doc-link');
    
    videoTitle.textContent = video.title;
    videoDescription.textContent = video.description;
    
    // GitHub Pages 환경 체크
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    // docPath에서 /pages/projects/ 제거하고 상대 경로로 변환
    const relativePath = video.docPath.replace('/pages/projects/', '');
    console.log('6-1. Document path check:', {
        docPath: video.docPath,
        relativePath: relativePath,
        isGitHubPages: isGitHubPages
    });
    
    docLink.href = relativePath;
    
    docLink.onclick = function(e) {
        e.preventDefault();
        
        const sidebarLinks = document.querySelectorAll('.book-summary ul.summary li a');
        console.log('6-2. Looking for link with path:', relativePath);
        
        let found = false;
        for (const link of sidebarLinks) {
            const linkHref = link.getAttribute('href');
            console.log('6-3. Checking link:', {
                href: linkHref,
                text: link.textContent.trim()
            });
            
            // 경로 정규화 및 비교
            const normalizedLinkPath = linkHref?.replace('/portfolio_gamedev/pages/projects/', '')
                                             ?.replace('/portfolio_gamedev/', '')
                                             ?.replace('.html', '')
                                             ?.replace(/\/$/, '');
            const normalizedRelativePath = relativePath.replace(/\/$/, '');
            
            if (normalizedLinkPath === normalizedRelativePath) {
                console.log('6-4. Found matching link, clicking');
                link.click();
                found = true;
                break;
            }
        }
        
        if (!found) {
            console.log('6-5. No matching link found');
        }
    };
}

// 즉시 실행 함수로 초기 상태 설정
(function() {
    console.log('0. Initial Setup');
    if (window.location.pathname.includes('devlog')) {
        // video 페이지인 경우 즉시 초기화 시도
        window.forceInitialize = true;
        window.videoPlayerState.isGitbookReady = true;
        
        if (typeof YT !== 'undefined' && YT.loaded) {
            window.videoPlayerState.isVideoLoaded = true;
        }
        
        // DOM이 로드되었는지 확인
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeVideoIfReady);
        } else {
            initializeVideoIfReady();
        }
    }
})();

// GitBook 이벤트 처리
if (typeof gitbook !== 'undefined') {
    console.log('7. Setting up GitBook event handler');
    gitbook.events.bind('page.change', function() {
        console.log('7-1. GitBook page change event triggered');
        
        // 비디오 페이지로 진입할 때마다 상태 초기화
        if (window.location.pathname.includes('devlog')) {
            console.log('7-2. Resetting video player state for new page');
            // 상태 초기화
            window.videoPlayerState = {
                player: null,
                currentVideoId: null,
                isVideoLoaded: typeof YT !== 'undefined' && YT.loaded,
                isGitbookReady: true,
                isInitialized: false
            };
            window.forceInitialize = true;
            initializeVideoIfReady();
        }
    });
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('8. DOM Content Loaded', {
        hasYT: typeof YT !== 'undefined',
        YTLoaded: typeof YT !== 'undefined' ? YT.loaded : false,
        hasGitbook: typeof gitbook !== 'undefined'
    });
    
    if (window.location.pathname.includes('devlog')) {
        if (!window.videoPlayerState.isInitialized) {
            window.forceInitialize = true;
            window.videoPlayerState.isGitbookReady = true;
            if (typeof YT !== 'undefined' && YT.loaded) {
                window.videoPlayerState.isVideoLoaded = true;
            }
            initializeVideoIfReady();
        }
    }
});

// 디버그 로그 최소화
function debugLog(message, data) {
    if (window.videoPlayerDebug) {
        console.log(message, data);
    }
}

