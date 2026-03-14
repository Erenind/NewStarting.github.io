document.addEventListener("DOMContentLoaded", (event) => {
    // smooth scroll
    // import("./utils/smoothScroll.js")

    // color mode 
    import("./utils/color-mode.js")
    import("./utils/topBar.js")

    // gsap plugin
    gsap.registerPlugin(ScrollTrigger)

    // the first animations
    import("./animation/animation-header.js")

    // planets animations
    import("./animation/animation-planets.js")
    import("./animation/animation-history.js")

    // load history content
    import("./history.js").then(module => module.loadHistory());

})


