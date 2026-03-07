let tl = gsap.timeline();

tl.from(".title-block", {
    width: 0,
    delay: 0.3
}).from(".title-color-block", {
    x: -140,
}).from(".navigation-block", {
    width: 0,
}).to(".navigation-color-block", {
    x: "-50%",
})

let titleTl = gsap.timeline()
titleTl.from(".line-one", {
    y: 100,
    opacity: 0
}).from(".line-two", {
    y: 100,
    opacity: 0
}, "-=0.2").from(".subtitle", {
    y: 100,
    opacity: 0
})

