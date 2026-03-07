function changeMode(){
    let currentMode = document.documentElement.getAttribute("data-theme");
    if (currentMode === "light") {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
    }
};

let btnsParents = document.querySelector(".navigations");
btnsParents.addEventListener("click", function(e) {
    console.log(e.target);
    // if (e.target.classList.contains("lucide-sun-moon")) {
        // changeMode();
    // }
});

let changeModeBtn = document.querySelector(".lucide-sun-moon");
changeModeBtn.addEventListener("click", function() {
    changeMode();
})
