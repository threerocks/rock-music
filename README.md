## 介绍
项目是学完慕课网课程[Vue.js高级实战—开发移动端音乐App](https://coding.imooc.com/class/107.html)后，独立开发，也是第一个vue程序。

项目与慕课网课程相比有很大区别，

- 样式代码改为使用了纯css编写
- 后端api改为使用网易云音乐Api + 自己编写的一些接口
- 由于数据以及类型等等不同，几乎修改了所有相关方法
- 搜索页面自己重新设计
- 图标icon全部来自阿里巴巴矢量图标库
- 播放器/搜索部分做了移动端适配，主要是blur属性引起卡顿，ios端radio无法自动播放等等。
- 因为移动端限制自动播放，设置第一次进入播放为暂停状态

## 预览地址
http://music.threerocks.cn/
## 安装与运行

```
git clone https://github.com/threerocks/rock-music

cd rock-music

npm install

npm run dev 

npm run build 项目打包 

感兴趣的童鞋可以来个star
```


