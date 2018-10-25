"use strict";

var place = document.getElementById('zone');
var title = document.querySelector('.place-name');
var detail = document.querySelector('.detail');
var str = "";
var map;
var position = {};
var mapSpot = document.querySelector('.spot'); //selector資料

var zoneData = [" 全區", "中正區", "大同區", "中山區", "松山區", "大安區", "萬華區", "信義區", "士林區", "北投區", "內湖區", "南港區", "文山區"];
var zoneStr = "";
var zoneLen = zoneData.length;
zoneData.sort();

for (var i = 0; i < zoneLen; i++) {
  if (i == 0) {
    zoneStr = '<option value="' + zoneData[i] + '" disabled selected>- - 請選擇行政區- -</option>';
  }

  zoneStr += '<option value="' + zoneData[i] + '">' + zoneData[i] + '</option>';
}

place.innerHTML = zoneStr; //監聽selector

place.addEventListener('change', filter, false); //selector事件

function filter(e) {
  e.preventDefault();
  str = place.value;
  title.textContent = str;
  detail.innerHTML = "";
  getData();
} //向伺服器要資料、readyState=4後顯示在網頁上


function getData() {
  var xhr = new XMLHttpRequest();
  xhr.open('get', 'https://next.json-generator.com/api/json/get/Ek86hdRMr', true);
  xhr.send(null);

  xhr.onload = function () {
    //readyState=4後觸發
    var a = JSON.parse(xhr.responseText);
    var len = a.length;

    for (var _i = 0; _i < len; _i++) {
      if (a[_i].CaseLocationDistrict == str) {
        detail.innerHTML += "<tr>\n                <th class=\"time\" >".concat(a[_i].CaseTime.slice(0, 10), "</th>\n                <th class=\"zone\" >").concat(a[_i].CaseLocationDistrict, "</th>\n                <th class=\"descrip\">").concat(a[_i].CaseDescription, "</th>\n                <th class=\"place\"><a href=\"#\" class=\"btn btn-sm btn-primary m-2 google-map\" data-site='{\"lng\":").concat(a[_i].Wgs84X, ",\"lat\":").concat(a[_i].Wgs84Y, "}'>Map</a></th>   \n            </tr>");
      } else if (str == " 全區") {
        detail.innerHTML += "<tr>\n                    <th class=\"time\" >".concat(a[_i].CaseTime.slice(0, 10), "</th>\n                    <th class=\"zone\" >").concat(a[_i].CaseLocationDistrict, "</th>\n                    <th class=\"descrip\">").concat(a[_i].CaseDescription, "</th>\n                    <th class=\"place\"><a href=\"#\" class=\"btn btn-sm btn-primary m-2 google-map\" data-site='{\"lng\":").concat(a[_i].Wgs84X, ",\"lat\":").concat(a[_i].Wgs84Y, "}'>Map</a></th>   \n                </tr>"); // ${a[i].CaseLocationDescription}
      }
    }

    $(document).ready(function () {
      $('.google-map').click(function (e) {
        e.preventDefault();
        position = JSON.parse(this.dataset.site);
        initMap();
        $('.one-page').addClass('d-none');
        $('.two-page').removeClass('d-none');
      });
      $('.home-link').click(function (e) {
        e.preventDefault();
        $('.two-page').addClass('d-none');
        $('.one-page').removeClass('d-none');
      });
    });
  };
}

function initMap() {
  var latNum = parseFloat(position.lat);
  var lngNum = parseFloat(position.lng);
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: {
      "lat": latNum,
      "lng": lngNum
    }
  });
  var marker = new google.maps.Marker({
    position: {
      "lat": latNum,
      "lng": lngNum
    },
    map: map,
    title: '案發現場'
  });
}
//# sourceMappingURL=all.js.map
