# WebGIS_1 · OpenLayers 地图应用

一个用于学习 **WebGIS 前端开发**的最小可运行示例：用 Vite 构建，用 [OpenLayers](https://openlayers.org/) 加载高德矢量/卫星瓦片，并集成比例尺、鼠标经纬度、图层切换和点击气泡。

![技术栈](https://img.shields.io/badge/OpenLayers-10.x-1f6fb2) ![Vite](https://img.shields.io/badge/Vite-8.x-646cff) ![License](https://img.shields.io/badge/license-unlicensed-lightgrey)

## 功能

- **双底图**：高德矢量地图 + 高德卫星影像，可叠加显示
- **图层切换**：基于 `ol-ext` 的 `LayerSwitcher`，支持显隐、透明度调节
- **比例尺**：右上角显示当前比例（`ScaleLine`）
- **鼠标坐标**：实时显示经纬度，保留 4 位小数（`MousePosition`，EPSG:4326）
- **点击气泡**：点击地图任意位置，弹出该点经纬度，可关闭（`Overlay`）

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 构建工具 | Vite 8 |
| 地图引擎 | OpenLayers 10（`ol`） |
| 控件扩展 | `ol-ext` 4 |
| 语言 | 原生 ES Module + CSS，无前端框架 |

## 快速开始

要求 Node.js ≥ 20。

```bash
npm install     # 安装依赖
npm run dev     # 开发服务器，默认 http://localhost:5173
npm run build   # 打包到 dist/
npm run preview # 本地预览打包结果
```

## 目录结构

```text
.
├── index.html          # 页面骨架：地图容器、坐标显示、气泡 DOM
├── package.json
├── public/
│   └── favicon.svg     # 站点图标
└── src/
    ├── main.js         # 地图初始化与全部交互逻辑
    └── style.css       # 地图容器、坐标框、气泡样式
```

## 实现要点

1. **瓦片源**：复用 `ol/source/OSM`，把 `url` 换成高德瓦片地址（矢量 `webrd0x`、卫星 `webst0x`），本质上是一个通用 XYZ 瓦片源，并不加载 OSM 数据。
2. **投影转换**：视图使用 Web Mercator（EPSG:3857），对外显示和输入统一用 `fromLonLat` / `toLonLat` 转成 EPSG:4326 经纬度。
3. **气泡定位**：`Overlay` 绑定 `#popup` 元素，点击时 `overlay.setPosition(event.coordinate)`，关闭时置为 `undefined`。
4. **图层顺序**：`layers` 数组中靠后的图层在上层。卫星图层默认可见，会盖住矢量图层——若想默认只看矢量，把 `satelliteLayer` 的 `visible` 改为 `false`。

## 数据源说明

底图瓦片来自高德地图公开瓦片服务，**仅用于学习演示**。正式项目请遵守[高德开放平台服务条款](https://lbs.amap.com/)并申请 Key，不要直接引用未授权的瓦片地址；生产环境建议改用自建或已授权的瓦片服务。

## 可继续扩展

- 叠加 GeoJSON 矢量图层 / 点位标注
- 测距、测面、绘制工具
- 图层分组与图例
- 地图事件与业务数据联动（点击查询、弹窗详情）

## 许可

本仓库暂未附加开源协议。若计划作为公开项目长期维护，建议补充 [MIT](https://choosealicense.com/licenses/mit/) 等协议。
