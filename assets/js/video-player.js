// 전역 변수를 window 객체에 할당하여 재선언 문제 해결
window.videoPlayerState = window.videoPlayerState || {
    player: null,
    currentVideoId: null,
    isVideoLoaded: false,
    isGitbookReady: false,
    isInitialized: false,
    playerReady: false,  // 플레이어 준비 상태 추가
    retryCount: 0       // 재시도 카운트 추가
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
    const mainVideo = document.querySelector('.main-video');
    
    const baseUrl = '/' + getBaseUrl();
    
    fetch(`${baseUrl}/assets/data/videos.json`)
        .then(response => response.json())
        .then(videoDatas => {
            if (!videoDatas || videoDatas.length === 0) {
                throw new Error('No video data available');
            }

            state.currentVideoId = videoDatas[0].id;
            
            function createPlayer() {
                // 플레이어 div 초기화
                if (!document.getElementById('player')) {
                    const playerDiv = document.createElement('div');
                    playerDiv.id = 'player';
                    mainVideo.appendChild(playerDiv);
                }

                const checkYouTubeAPI = () => {
                    return new Promise((resolve, reject) => {
                        if (typeof YT !== 'undefined' && YT.loaded) {
                            resolve();
                        } else {
                            const timeoutId = setTimeout(() => {
                                reject(new Error('YouTube API load timeout'));
                            }, 10000);

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

                checkYouTubeAPI()
                    .then(() => {
                        // 기존 플레이어 정리
                        if (state.player) {
                            state.player.destroy();
                            state.player = null;
                        }

                        const origin = window.location.origin;

                        // 새 플레이어 생성
                        state.player = new YT.Player('player', {
                            height: '100%',
                            width: '100%',
                            videoId: state.currentVideoId,
                            host: 'https://www.youtube-nocookie.com',
                            playerVars: {
                                'playsinline': 1,
                                'rel': 0,
                                'origin': origin,
                                'enablejsapi': 1,
                                'widget_referrer': origin,
                                'modestbranding': 1,
                                'privacy_mode': 1
                            },
                            events: {
                                'onReady': onPlayerReady,
                                'onError': (event) => {
                                    console.error('Player Error:', event.data);
                                },
                                'onStateChange': (event) => {
                                    if (event.data === YT.PlayerState.PLAYING) {
                                        state.isPlaying = true;
                                    } else {
                                        state.isPlaying = false;
                                    }
                                }
                            }
                        });

                        window.addEventListener('beforeunload', cleanupPlayer);

                        createVideoGrid(videoDatas);
                        updateVideoInfo(videoDatas[0]);
                        
                        // UI 표시
                        if (loadingWrapper) loadingWrapper.style.display = 'none';
                        if (videoContent) videoContent.style.display = 'block';
                    })
                    .catch(error => {
                        console.error('Player initialization error:', error);
                        if (loadingWrapper) {
                            loadingWrapper.innerHTML = 'Error initializing video player';
                        }
                    });
            }

            createPlayer();
        })
        .catch(error => {
            console.error('Content load error:', error);
            if (loadingWrapper) {
                loadingWrapper.innerHTML = 'Error loading content';
            }
        });
}

// 디바운스 함수 추가
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 비디오 전환 함수 최적화
function switchVideo(videoId, videoInfo) {
    const state = window.videoPlayerState;
    if (!state.playerReady || !state.player) {
        if (state.retryCount < 3) {
            state.retryCount++;
            setTimeout(() => switchVideo(videoId, videoInfo), 500);
            return;
        }
        console.error('Player not ready after retries');
        return;
    }
    
    state.retryCount = 0;
    try {
        state.player.loadVideoById(videoId);
        updateVideoInfo(videoInfo);
        // 디바운스된 스크롤
        debounce(() => window.scrollTo(0, 0), 100)();
    } catch (error) {
        console.error('Error switching video:', error);
    }
}

function onPlayerReady(event) {
    const state = window.videoPlayerState;
    state.playerReady = true;
    state.retryCount = 0;
    console.log('4. Player Ready, starting playback');
    event.target.playVideo();
}

function createVideoGrid(videos) {
    debugLog('Creating video grid', { count: videos.length });
    const grid = document.getElementById('video-grid');
    const state = window.videoPlayerState;
    
    grid.innerHTML = '';
    
    // DocumentFragment 사용하여 DOM 조작 최적화
    const fragment = document.createDocumentFragment();
    
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
                switchVideo(video.id, video);
            }
        });
        
        fragment.appendChild(videoItem);
    });
    
    grid.appendChild(fragment);
}

function updateVideoInfo(video) {
    console.log('6. Updating video info for:', video.title);
    const videoTitle = document.getElementById('video-title');
    const videoDescription = document.getElementById('video-description');
    const docLink = document.getElementById('doc-link');
    
    videoTitle.textContent = video.title;
    videoDescription.textContent = video.description;
    
    if (video.docPath && docLink) {
        docLink.style.display = 'inline-block';
        console.log('6-1. Document path:', video.docPath);
        
        docLink.onclick = function(e) {
            e.preventDefault();
            
            const sidebarLinks = document.querySelectorAll('.book-summary ul.summary li a');
            const targetPath = video.docPath.toLowerCase()
                                          .replace('{{ site.baseurl }}', '')
                                          .replace('/pages/projects/', '')
                                          .replace(/\.html$/, '')
                                          .replace(/\/$/, '');
            
            console.log('6-2. Looking for link with path:', targetPath);
            
            let found = false;
            for (const link of sidebarLinks) {
                const linkHref = link.getAttribute('href').toLowerCase()
                                   .replace('/portfolio_gamedev', '')
                                   .replace('/pages/projects/', '')
                                   .replace(/\.html$/, '')
                                   .replace(/\/$/, '')
                                   .replace(/%20/g, ' ');  // URL 인코딩된 공백 처리
                
                console.log('6-3. Comparing paths:', {
                    target: targetPath,
                    link: linkHref,
                    text: link.textContent.trim()
                });
                
                if (linkHref.includes(targetPath) || targetPath.includes(linkHref)) {
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
    } else if (docLink) {
        docLink.style.display = 'none';
    }
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

// 페이지 변경 시 플레이어 정리
function cleanupPlayer() {
    const state = window.videoPlayerState;
    if (state.player) {
        try {
            state.player.destroy();
        } catch (error) {
            console.error('Error cleaning up player:', error);
        }
        state.player = null;
        state.playerReady = false;
        state.retryCount = 0;
    }
}

// GitBook 이벤트 처리
if (typeof gitbook !== 'undefined') {
    gitbook.events.bind('page.change', function() {
        cleanupPlayer();
        
        if (window.location.pathname.includes('devlog')) {
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

