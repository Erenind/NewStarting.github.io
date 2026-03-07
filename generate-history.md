格式为json,你需要为下面的内容套上json的格式。
大致的格式为
```json
[
 {},
 {},
 ...
]
```

具体要求：
- 以下内容由---分割，表示一个{}。
- 首次出现的value我会标注key的属性
- 生成的json替换项目中的history.json


---
time(string) 2023-07
type(string) text
tittle(string) 第一个Hello World
content(string) 由python编写,由《看漫画学python》启迪。

---
time 2023-11
type text
title 前端入门
content 启蒙者: 康文昌

---
time 2023-11
type text
title 前端深入
content 跟随pink老师学习html,css

---
time 2024-07
type text
title Js深入
content 跟随pink老师学习Javascript

---
time 2024-06-29
type img-1
title Ubuntu(linux)
content windows把我硬盘搞坏了，换个硬盘后来Linux。
img-url(list) \["res/ubuntu.png"]


---
time 2024-11-22
type img-1
title Arch Linux & Hyprland
content ubuntu 被我玩坏了，来arch linux体验hyprland，
img-url \["res/arch.png"]
button-show(布尔) true
button-url(string) "github...."
button-text(string) "dotfiles"

---
time 2025-01-31
type img-3
title 一个beautiful高考倒计时页面
content 使用了catppuccin主题，用于查看当时距离高考的时间。
img-url \["countdown1.jpg","countdown2.jpg","countdown3.jpg"]

---
time 2025-09-20
type text
title 物理竞赛
content 初赛把我“骗”进了复赛。

---
time 2026-02-18
type img-3
title Bye Arch，Hi Nixos
content 被“依赖地狱”困住了，跟换为nixos
img-url \["res/byeArch1.jpg" , "res/byeArch2.jpg" ,"hiNixos.jpg"]
button-show true
button-url "github..."
button-text "dotfiles"