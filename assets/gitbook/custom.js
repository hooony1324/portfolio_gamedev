// Enable footnote link support for pages with width < 1240.
//
// function bind_footnote_links() {
//     if ($(document).width() > 1240) {
//         return;
//     }
//     let footnotes = $("div.footnotes").find("ol > li > p > a.reversefootnote");
//     for (let i = 0; i < footnotes.length; i++) {
//         let footnote = footnotes[i];
//         footnote.addEventListener('click', function(e) {
//             e.preventDefault();
//             var target = $($(this).attr('href'));
//             if (target.length) {
//                 $('div.body-inner').animate({
//                     scrollTop: target.get(0).offsetTop,
//                 });
//             }
//         });
//     }
// }

// if (document.readyState === "loading") {
//     // Loading hasn't finished yet
//     document.addEventListener("DOMContentLoaded", bind_footnote_links);
// } else {
//     // `DOMContentLoaded` has already fired
//     bind_footnote_links();
// }

(function() {
    function loadVideoPlayerScript() {
        let scriptId = "videoplayer-script";
        if (document.getElementById(scriptId) || !document.getElementById("main-video")) {
            console.log("[Custom] videoplayer.js already loaded or no video detected.");
            return;
        }

        console.log("[Custom] Injecting videoplayer.js...");

        let baseUrl = document.body.getAttribute("data-baseurl") || "{{ site.baseurl }}"; 
        console.log("[Custom] Base URL: ", baseUrl);

        if (!baseUrl.endsWith("/")) {
            baseUrl += "/";
        }

        let script = document.createElement("script");
        script.src = document.body.getAttribute("data-baseurl") + "/assets/js/videoplayer.js";        script.defer = true;
        console.log("[Custom] Loading script from: ", script.src);

        script.onload = function() {
            console.log("[Custom] videoplayer.js loaded!");
        };

        document.body.appendChild(script);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            console.log("[Custom] DOMContentLoaded - Checking VideoPlayer...");
            loadVideoPlayerScript();
        });
    } else {
        console.log("[Custom] DOM already loaded - Checking VideoPlayer...");
        loadVideoPlayerScript();
    }

    if (window.gitbook) {
        gitbook.events.bind("page.change", function () {
            console.log("[Custom] GitBook Page Changed - Checking VideoPlayer...");
            setTimeout(loadVideoPlayerScript, 500);
        });
    }
})();
