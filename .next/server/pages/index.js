"use strict";
(() => {
var exports = {};
exports.id = 405;
exports.ids = [405];
exports.modules = {

/***/ 3678:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__) => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(968);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7518);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(939);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6197);
/* harmony import */ var react_modal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9931);
/* harmony import */ var react_modal__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_modal__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1664);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([framer_motion__WEBPACK_IMPORTED_MODULE_5__]);
framer_motion__WEBPACK_IMPORTED_MODULE_5__ = (__webpack_async_dependencies__.then ? await __webpack_async_dependencies__ : __webpack_async_dependencies__)[0];








const Home = ()=>{
    const { 0: isConnected , 1: setIsConnected  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { 0: paired_devices , 1: setDevices  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const { 0: initialized , 1: setInitialized  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { 0: settings , 1: setSettings  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const serviceUUID = 65504;
    const charUUID = 43680;
    let device1, chosenService = null, sendCharacteristic, receiveCharacteristic;
    const openSettings = ()=>{
        setSettings(true);
    };
    const closeSettings = ()=>{
        setSettings(false);
    };
    const pairCar = (car)=>{
        device1 = car;
        if (device1.gatt) {
            console.log("connected");
            return device1.gatt.connect().then((server)=>server.getPrimaryService(serviceUUID)
            ).then((service)=>{
                setIsConnected(true);
                chosenService = service;
            });
        }
    };
    const sendCommand = (command)=>{
        console.log(sendCharacteristic);
    };
    function onGetBluetoothDevicesButtonClick() {
        console.log('Getting existing permitted Bluetooth devices...');
        navigator.bluetooth.getDevices().then((devices)=>{
            console.log('> Got ' + devices.length + ' Bluetooth devices.');
            for (const device of devices){
                console.log('  > ' + device.name + ' (' + device.id + ')');
            }
            setDevices(devices);
        }).catch((error)=>{
            console.log('Argh! ' + error);
        });
    }
    function onRequestBluetoothDeviceButtonClick() {
        console.log('Requesting any Bluetooth device...');
        navigator.bluetooth.requestDevice({
            filters: [
                {
                    services: [
                        serviceUUID
                    ]
                }
            ]
        }).then((device)=>{
            console.log('> Requested ' + device.name + ' (' + device.id + ')');
            setInitialized(true);
        }).catch((error)=>{
            console.log('Argh! ' + error);
        });
    }
    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(HomeWrap, {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((next_head__WEBPACK_IMPORTED_MODULE_2___default()), {
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("title", {
                        children: "EVEE"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        name: "description",
                        content: "Generated by create next app"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("meta", {
                        name: "theme-color",
                        content: "#000"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("link", {
                        rel: "manifest",
                        href: "/manifest.json"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("link", {
                        rel: "icon",
                        href: "/icon-192x192.png"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("link", {
                        rel: "apple-touch-icon",
                        href: "/icon-192x192.png"
                    })
                ]
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(HomeHeader, {
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_5__.motion.div, {
                    whileTap: {
                        scale: 1.2
                    },
                    whileHover: {
                        scale: 1.1
                    },
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(GearIcon, {
                        onClick: openSettings
                    })
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((react_modal__WEBPACK_IMPORTED_MODULE_6___default()), {
                isOpen: settings,
                onRequestClose: closeSettings,
                ariaHideApp: false,
                contentLabel: "Selected Option",
                style: {
                    overlay: {
                        backgroundColor: 'rgba(0,0,0,0.3)'
                    },
                    content: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '1em',
                        height: '60vh',
                        width: '80vh',
                        left: '50%',
                        top: '50%',
                        right: '0',
                        bottom: '0',
                        transform: 'translate(-50%, -50%)'
                    }
                },
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_5__.motion.div, {
                    whileTap: {
                        scale: 1.2
                    },
                    whileHover: {
                        scale: 1.1
                    },
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(InitDevices, {
                        onClick: ()=>{
                            onRequestBluetoothDeviceButtonClick();
                        },
                        children: " Initialize Devices "
                    })
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_5__.motion.div, {
                whileTap: {
                    scale: 1.2
                },
                whileHover: {
                    scale: 1.1
                },
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Button, {
                    onClick: ()=>{
                        onGetBluetoothDevicesButtonClick();
                    }
                })
            }),
            !isConnected && paired_devices.map((car, i)=>{
                return(/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_5__.motion.div, {
                    whileTap: {
                        scale: 1.2
                    },
                    whileHover: {
                        scale: 1.1
                    },
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(CarSelect, {
                        carColor: colors[i],
                        onClick: ()=>{
                            pairCar(car);
                        }
                    })
                }, car.name));
            }),
            isConnected && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(framer_motion__WEBPACK_IMPORTED_MODULE_5__.motion.div, {
                whileTap: {
                    scale: 1.2
                },
                whileHover: {
                    scale: 1.1
                },
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(SendHome, {
                    onClick: ()=>{
                        sendCommand('home');
                    }
                })
            })
        ]
    }));
};
const HomeWrap = (styled_components__WEBPACK_IMPORTED_MODULE_3___default().div)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #000;
`;
const HomeHeader = (styled_components__WEBPACK_IMPORTED_MODULE_3___default().div)`
  position: absolute;
  left: 0;
  top: 2vh;
`;
const Button = styled_components__WEBPACK_IMPORTED_MODULE_3___default()(_icons__WEBPACK_IMPORTED_MODULE_4__/* .Logo */ .TR)`
  height: 50vh;
`;
const InitDevices = (styled_components__WEBPACK_IMPORTED_MODULE_3___default().button)`
  color: white;
  background-color: blue;
  border-radius: 1em;
  padding: 1em;
`;
const CarSelect = styled_components__WEBPACK_IMPORTED_MODULE_3___default()(_icons__WEBPACK_IMPORTED_MODULE_4__/* .Car */ .lG)`
  height: 20vh;
  path {fill: ${({ carColor  })=>carColor ? carColor : 'white'
};}
`;
const GearIcon = styled_components__WEBPACK_IMPORTED_MODULE_3___default()(_icons__WEBPACK_IMPORTED_MODULE_4__/* .Gear */ .XV)`
  width: 100px;
`;
const SendHome = styled_components__WEBPACK_IMPORTED_MODULE_3___default()(_icons__WEBPACK_IMPORTED_MODULE_4__/* .HomeCommand */ .dI)`
    height: 20vh;
`;
const colors = [
    'red',
    'blue',
    'green',
    'purple'
];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Home);

});

/***/ }),

/***/ 562:
/***/ ((module) => {

module.exports = require("next/dist/server/denormalize-page-path.js");

/***/ }),

/***/ 4014:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/i18n/normalize-locale-path.js");

/***/ }),

/***/ 8020:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/mitt.js");

/***/ }),

/***/ 4964:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router-context.js");

/***/ }),

/***/ 9565:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/get-asset-path-from-route.js");

/***/ }),

/***/ 4365:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/get-middleware-regex.js");

/***/ }),

/***/ 1428:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/is-dynamic.js");

/***/ }),

/***/ 1292:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/parse-relative-url.js");

/***/ }),

/***/ 979:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/querystring.js");

/***/ }),

/***/ 6052:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/resolve-rewrites.js");

/***/ }),

/***/ 4226:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/route-matcher.js");

/***/ }),

/***/ 5052:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/route-regex.js");

/***/ }),

/***/ 9232:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/utils.js");

/***/ }),

/***/ 968:
/***/ ((module) => {

module.exports = require("next/head");

/***/ }),

/***/ 6689:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 9931:
/***/ ((module) => {

module.exports = require("react-modal");

/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ 7518:
/***/ ((module) => {

module.exports = require("styled-components");

/***/ }),

/***/ 6197:
/***/ ((module) => {

module.exports = import("framer-motion");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [730,664,939], () => (__webpack_exec__(3678)));
module.exports = __webpack_exports__;

})();