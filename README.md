# WebGis

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production

```sh
pnpm build
```
### 代办规划
- [x] 多源数据汇聚
  - [x] 天地图
    - [x] 卫星图层
    - [x] 标注图层
  - [x] 高德
  - [x] arcgis
  - [x] geojson
  - [x] gpx
  - [ ] kml
  - [ ] 等
- [ ] 地图制作
  - [ ] 地图导出
  - [ ] 热力图制作
    - [ ] 加载不同格式文件作为底图
    - [x] 添加数据，并选择字段
    - [x] 设置颜色
    - [x] 设置底图颜色和边界颜色等
- [ ] 控件
  - [ ] 比例尺控件
  - [ ] 鹰眼控件
  - [ ] 等

- [ ] 标注
  - [ ] 设置标注样式
  - [ ] 设置标注模板


### 待优化项目（待完成基本功能需求后进行）
- [ ] 制作热力图，可以动态更新样式，不许要再次添加时重新设置样式
- [ ] 抽离重复代码，形成组件，提高代码复用性

