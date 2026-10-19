import ScaleLine from 'ol/control/ScaleLine.js';            //比例尺控件，在地图上显示当前缩放比例（如 10km / 100km）
import './style.css';                                       //项目本地样式（地图容器、气泡、控件外观等）
import Map from 'ol/Map.js';                                //OpenLayers 地图核心类
import OSM from 'ol/source/OSM.js';                         //瓦片源类。虽然名为 OSM，但本质是一个通用 XYZ 瓦片源，可通过 url 覆盖为其他服务
import TileLayer from 'ol/layer/Tile.js';                   //瓦片图层，用于承载瓦片源
import View from 'ol/View.js';                              //地图视图，控制中心点、缩放级别、投影等
import MousePosition from 'ol/control/MousePosition.js';    //鼠标位置控件，实时显示鼠标处的坐标
import { createStringXY } from 'ol/coordinate.js';          //坐标格式化工具，把坐标数组转成字符串并控制小数位
import Overlay from 'ol/Overlay.js';                        //叠加层，允许把任意 HTML 元素（气泡、弹窗）锚定到地图坐标上
import { fromLonLat,toLonLat } from 'ol/proj.js';           //fromLonLat: 经纬度→3857；toLonLat: 3857→经纬度
import LayerSwitcher from 'ol-ext/control/LayerSwitcher.js';//ol-ext 提供的图层切换控件（显示/隐藏、透明度等）
import 'ol-ext/dist/ol-ext.css';                            //ol-ext 控件的必需样式

const vectorLayer = new TileLayer({
  source: new OSM({
    url: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    attributions: '高德地图'
  }),
  properties: { title: '高德矢量' }
});

//URL 参数含义：webrd01.is.autonavi.com：高德矢量瓦片服务器（webrd01~webrd04 为负载均衡节点）。
// lang=zh_cn：语言为简体中文。
// size=1：瓦片尺寸为 256×256（1 表示 256px）。
// scale=1：缩放比例，1 为普通，2 为高清（@2x）。
// style=8：样式编号，8 代表标准矢量地图。
// x={x}&y={y}&z={z}：OpenLayers 会自动替换为对应瓦片的列号、行号、缩放级别。
// attributions: '高德地图'：版权信息，会显示在地图右下角。
// properties: { title: '高德矢量' }：自定义属性，LayerSwitcher 会用它作为图层名称显示。

const satelliteLayer = new TileLayer({
  source: new OSM({
    url: 'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
    attributions: '高德卫星'
  }),
  properties: { title: '高德卫星' },
  visible: true
});

// webst01.is.autonavi.com：高德卫星影像服务器（webst01~webst04 为节点）。
// style=6：表示卫星影像瓦片。
// visible: true：该图层初始可见。
// 注意：矢量图层和卫星图层都默认可见。由于 layers 数组中卫星图层在后，它位于矢量图层之上，会把矢量地图遮住。若要默认只显示矢量，需要将 satelliteLayer 的 visible 改为 false。

const map = new Map({
  target: 'map',                           //地图会渲染到 HTML 中 id="map" 的容器上。
  layers: [vectorLayer, satelliteLayer],   //图层数组，顺序决定叠放层次，后面的图层在上方。
  controls: [                              //控件数组，直接在地图创建时添加。
    new ScaleLine(),   
    new MousePosition({
     coordinateFormat: createStringXY(4),  // 保留4位小数
     projection: 'EPSG:4326',              // 输出经纬度
     target: 'mouse-position',             // 显示到哪个div
}),
    new LayerSwitcher(),
  ],
  view: new View({
    center: fromLonLat([113.5, 23.5]),  //中心点坐标
    zoom: 10,         //初始缩放级别
  }),
});
// 创建气泡 Overlay
const container = document.getElementById('popup');          //气泡的外层容器。
const content = document.getElementById('popup-content');    //气泡中显示文字内容的部分。
const closer = document.getElementById('popup-closer');      //气泡右上角的关闭按钮（通常是“×”）

const overlay = new Overlay({
  element: container,                                        //把该 HTML 元素作为叠加层内容
  autoPan: true,                                             //当气泡出现在地图边缘之外时，地图会自动平移，保证气泡可见。
});
map.addOverlay(overlay);                                     //把叠加层加入地图

// 关闭按钮
closer.onclick = () => {
  overlay.setPosition(undefined);              //把气泡位置设为 undefined，气泡隐藏
  closer.blur();                               //让按钮失去焦点，避免键盘操作时残留焦点。
  return true;                                 //阻止 <a> 标签的默认跳转行为。
};

// 点击地图显示坐标
map.on('click', (event) => {//监听地图单击
  const lonLat = toLonLat(event.coordinate);//点击，投影转换
  content.innerHTML = `你点击了这里：<br><b>${lonLat[0].toFixed(4)}, ${lonLat[1].toFixed(4)}</b>`;
  overlay.setPosition(event.coordinate);
});

window.map = map
