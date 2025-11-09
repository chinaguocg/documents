<h1 align="center">Documents</h1>

<div align="center">

文档博客：用作学习资料、技术文档的共享。

Notes on facts,learnings,and ideas.

![Static Badge](https://img.shields.io/badge/Love-China-red) ![Static Badge](https://img.shields.io/badge/Coder-blue) ![Static Badge](https://img.shields.io/badge/DevOps-blueviolet) ![Static Badge](https://img.shields.io/badge/Documents-orange)

[![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/chinaguocg/documents)](https://github.com/chinaguocg/documents/issues) ![GitHub top language](https://img.shields.io/github/languages/top/chinaguocg/documents) [![GitHub forks](https://img.shields.io/github/forks/chinaguocg/documents)](https://github.com/chinaguocg/documents/forks) [![GitHub Repo stars](https://img.shields.io/github/stars/chinaguocg/documents)](https://github.com/chinaguocg/documents/stargazers) ![GitHub language count](https://img.shields.io/github/languages/count/chinaguocg/documents) ![GitHub commit activity](https://img.shields.io/github/commit-activity/t/chinaguocg/documents) [![GitHub License](https://img.shields.io/github/license/chinaguocg/documents)](https://github.com/chinaguocg/documents/blob/master/LICENSE)

</div>

## Description

This is a note based on VuePress.

VuePress 提供了一个良好的写文档博客的环境，侧边栏的展示及快速跳转有利于将知识

进行连接，并且目录结构层级分明，这样更有利于管理知识工具。

Welcome to the [Chinaguocg-Documents](https://chinaguocg.github.io/documents/).

## Usage

The code still has 3 seconds to get to the battlefield.

```bash
# 1. clone
git clone https://github.com/chinaguocg/documents.git

# 2. install dependencies
yarn add 
# OR npm install

# 3. run
yarn docs:dev 
# OR npm run docs:dev

```

## 目录结构

```
─dist             用于部署时的静态资源目录，需要执行部署脚本时生成
  │
─docs
  ├─.vuepress     用于存放全局的配置、组件、静态资源等
  │  ├─public     静态资源目录
  │  │    ├─css   css样式
  │  │    ├─data  数据
  │  │    ├─img   图片
  │  │    ├─js    公共js
  │  │    ├─pdf   pdf文档
  │  │    ├─video 视频
  │  │    └─web   html页面
  │  ├─config.js  配置文件的入口文件
  │  ├─nav.js     导航目录
  │  └─sidebar.js 路由
  ├─guide         文档——指南
  ├─study_notes   文档——学习笔记
  ├─README.md     README.md
  │
─deploy.sh        部署执行脚本  
```

## 关于部署 GitHub Pages

注意修改部署脚本 `deploy.sh` 将发布地址改为自己的 GitHub 仓库，然后双击执行。

## Thanks

 **感谢 [vuepress](https://github.com/vuejs/vuepress)    [VuePress](https://vuepress.vuejs.org/)    [echarts](https://github.com/apache/echarts)    [Echarts](https://echarts.apache.org/zh/index.html) ** 

