// 设置初始data-theme
const systemPreferesDark = window.matchMedia('(prefers-color-scheme: dark)')

if (systemPreferesDark.matches) {
  document.documentElement.setAttribute('data-theme', 'dark')
} else {
  document.documentElement.setAttribute('data-theme', 'light')
}

// 动态更改
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

systemTheme.addEventListener('change',(e) => {
    const isDarkMode = e.matches;
    document.documentElement.setAttribute("data-theme", 
        isDarkMode ? "dark" : "light"
    )
})
