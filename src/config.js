// import React from "react";

const config = {
    ROMS: {
        // owlia: {
        //     name: "The Legends of Owlia",
        //     description: "Owlia by Gradual Games",
        //     url: "https://cdn.jsdelivr.net/gh/bfirsh/jsnes-roms@master/owlia.nes"
        // },
        // nomolos: {
        //     name: "Nomolos: Storming the Catsle",
        //     description: "Owlia by Gradual Games",
        //     url: "https://cdn.jsdelivr.net/gh/bfirsh/jsnes-roms@master/nomolos.nes"
        // },
        // croom: {
        //     name: "Concentration Room",
        //     description: "Owlia by Gradual Games",
        //     url:
        //         "https://cdn.jsdelivr.net/gh/bfirsh/jsnes-roms@master/croom/croom.nes"
        // },
        // lj65: {
        //     name: "LJ65",
        //     description: "Owlia by Gradual Games",
        //     url: "https://cdn.jsdelivr.net/gh/bfirsh/jsnes-roms@master/lj65/lj65.nes"
        // },
        CONTRA: {
            name: "魂斗罗Ⅰ",
            description: "魂斗罗Ⅰ",
            url: "/roms/CONTRA/CONTRA.nes"
        },
        MightyFinalFightChinese: {
            name: "快打旋风(汉化)",
            description: "快打旋风",
            url: "/roms/快打旋风（汉化）/快打旋风中文版.nes"
        },
        BATTLETO: {
            name: "忍者蛙",
            description: "忍者蛙",
            url: "/roms/忍者蛙/BATTLETO.nes"
        },
        SuperMarioBrosChinese: {
            name: "超级玛丽(简体中文)",
            description: "超级玛丽中文",
            url: "/roms/SuperMarioBrosChinese/SuperMarioBrosChinese.nes"
        },
        SuperMarioBros: {
            name: "超级玛丽(日版)",
            description: "超级玛丽",
            url: "/roms/SuperMarioBros/SuperMarioBros.nes"
        }
    },
    GOOGLE_ANALYTICS_CODE: process.env.REACT_APP_GOOGLE_ANALYTICS_CODE,
    SENTRY_URI: process.env.REACT_APP_SENTRY_URI
};

export default config;
