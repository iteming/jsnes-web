import React, {Component} from "react";
import {Button, Progress} from "reactstrap";
import {Link} from "react-router-dom";

import config from "./config";
import ControlsModal from "./ControlsModal";
import Emulator from "./Emulator";
import RomLibrary from "./RomLibrary";
import {loadBinary} from "./utils";

import "./RunPage.css";
import JoyStick from "./JoyStick";
// import Shake from 'shake.js';
import { Vibration } from 'react-native';

const joyOptions = {
    mode: 'semi',
    catchDistance: 60,
    color: 'white'
};

const containerStyle = {
    position: 'absolute',
    height: '100%',
    width: '50%',
};

const buttonABDivStyle = {
    position: 'absolute',
    height: '100%',
    width: '50%',
    right: 0
};

/*
 * The UI for the emulator. Also responsible for loading ROM from URL or file.
 */
class RunPage extends Component {
    constructor(props) {
        console.log("IN RunPage", props);
        super(props);
        this.state = {
            romName: null,
            romData: null,
            running: false,
            paused: false,
            controlsModalOpen: false,
            loading: true,
            loadedPercent: 3,
            error: null,
            timeOutId: [],
            joyStickController: null,
            myShakeEvent: null
        };
    }

    managerListener = (manager) => {
        var that = this;
        manager.on('move', (e, stick) => {
            var joyStick = that.state.joyStickController;
            // console.log('I moved! ', e, stick);
            // distance 当摇杆发生便宜产生上下左右参数，且摇杆距离中心点的距离超过15（满值50）
            // degree 摇杆角度来判断是否两键齐发
            if (stick.direction !== undefined && stick.distance > 15) {
                joyStick.handleJoyStickUp(1, "ALL");
                if (55 > stick.angle.degree && stick.angle.degree > 35) {
                    // console.log('I moved! up - right');
                    joyStick.handleJoyStickDown(1, "U");
                    joyStick.handleJoyStickDown(1, "R");
                } else if (145 > stick.angle.degree && stick.angle.degree > 125) {
                    // console.log('I moved! up - left');
                    joyStick.handleJoyStickDown(1, "U");
                    joyStick.handleJoyStickDown(1, "L");
                } else if (235 > stick.angle.degree && stick.angle.degree > 215) {
                    // console.log('I moved! down - left');
                    joyStick.handleJoyStickDown(1, "D");
                    joyStick.handleJoyStickDown(1, "L");
                } else if (325 > stick.angle.degree && stick.angle.degree > 305) {
                    // console.log('I moved! down - right');
                    joyStick.handleJoyStickDown(1, "D");
                    joyStick.handleJoyStickDown(1, "R");
                } else if (stick.direction.angle === 'up') {
                    // console.log('I moved! ', stick.direction.angle);
                    joyStick.handleJoyStickDown(1, "U");
                } else if (stick.direction.angle === 'down') {
                    // console.log('I moved! ', stick.direction.angle);
                    joyStick.handleJoyStickDown(1, "D");
                } else if (stick.direction.angle === 'left') {
                    // console.log('I moved! ', stick.direction.angle);
                    joyStick.handleJoyStickDown(1, "L");
                } else if (stick.direction.angle === 'right') {
                    // console.log('I moved! ', stick.direction.angle);
                    joyStick.handleJoyStickDown(1, "R");
                }
            }
        });
        manager.on('end', () => {
            var joyStick = that.state.joyStickController;
            // console.log("managerListener", joyStick);
            // console.log('I ended!')
            joyStick.handleJoyStickUp(1, "ALL");
        })
    };

    handleBtnClick = (eventKey, e) => {
        var joyStick = this.state.joyStickController;
        console.log("handleBtnClick");
        if (eventKey === "X" || eventKey === "Y") {
            this.whileDo(joyStick, eventKey, this);
        } else {
            joyStick.handleJoyStickDown(1, eventKey);
        }
        // navigator.vibrate([500, 300, 400, 300]);
        // Vibration.vibrate();
    };

    //Vibration接口用于在浏览器中发出命令，使得设备振动。
    vibration() {
        navigator.vibrate = navigator.vibrate
            || navigator.webkitVibrate
            || navigator.mozVibrate
            || navigator.msVibrate;

        if (navigator.vibrate) {
            // 支持
            console.log("支持设备震动！");
        } else {
            alert("不支持设备震动！");
        }
    }

    whileDo(joyStick, eventKey, that) {
        console.log("touchStart 1");
        joyStick.handleJoyStickUp(1, eventKey); // 先取消，再执行
        setTimeout(() => {
            joyStick.handleJoyStickDown(1, eventKey);
        }, 50);

        let timeOutId = this.state.timeOutId ? this.state.timeOutId : [];
        timeOutId.push(setTimeout(() => {
            that.whileDo(joyStick, eventKey, that);
        }, 100));
        this.setState({timeOutId: timeOutId});
    }

    handleBtnBlur = (eventKey) => {
        if (eventKey === "X" || eventKey === "Y") {
            console.log("timeOutId", this.state.timeOutId);
            let timeOutId = this.state.timeOutId ? this.state.timeOutId : [];
            while (timeOutId.length > 0) {
                let timeId = timeOutId.pop();
                clearTimeout(timeId);
            }
            this.setState({timeOutId: []})
        }

        var joyStick = this.state.joyStickController;
        console.log("handleBtnBlur =====");
        joyStick.handleJoyStickUp(1, eventKey);
    };

    render() {
        return (
            <div className="RunPage">
                <nav className="navbar navbar-expand"
                     ref={el => {
                         this.navbar = el;
                     }}
                >
                    <ul className="navbar-nav" style={{width: "200px"}}>
                        <li className="navitem">
                            <Link to="/" className="nav-link">
                                &lsaquo; 返回
                            </Link>
                        </li>
                    </ul>

                    <ul className="navbar-nav">
                        <li className="navitem">
                            <span className="navbar-text mr-3">游戏名：{this.state.romName}</span>
                        </li>
                    </ul>

                    <ul className="navbar-nav" style={{width: "200px"}}>
                        <li className="navitem">
                            <Button
                                outline
                                color="primary"
                                onClick={this.toggleControlsModal}
                                className="mr-3"
                            >
                                控制
                            </Button>
                            <Button
                                outline
                                color="primary"
                                onClick={this.handlePauseResume}
                                disabled={!this.state.running}
                            >
                                {this.state.paused ? "继续" : "暂停"}
                            </Button>
                        </li>
                    </ul>
                </nav>

                <div>
                    <JoyStick options={joyOptions} containerStyle={containerStyle}
                              managerListener={this.managerListener}/>
                </div>

                <div style={buttonABDivStyle}>
                    <div className="secondary">
                        <Button className="primary" variant="contained" style={{
                            left: "0", backgroundColor: 'gray-dark', fontSize: '10px', padding: '0px'
                        }}
                                onTouchStart={this.handleBtnClick.bind(this, "SELECT")}
                                onTouchEnd={this.handleBtnBlur.bind(this, "SELECT")}>
                            SELECT
                        </Button>
                        <Button className="primary" variant="contained" style={{
                            left: "60px", backgroundColor: 'gray-dark', fontSize: '10px', padding: '0px'
                        }}
                                onTouchStart={this.handleBtnClick.bind(this, "START")}
                                onTouchEnd={this.handleBtnBlur.bind(this, "START")}>
                            START
                        </Button>

                        <Button className="primary" variant="contained" style={{
                            left: "0", top: "100px",
                            backgroundColor: 'dodgerblue'
                        }}
                                onTouchStart={this.handleBtnClick.bind(this, "X")}
                                onTouchEnd={this.handleBtnBlur.bind(this, "X")}>
                            X
                        </Button>
                        <Button className="primary" variant="contained" style={{
                            left: "60px", top: "100px",
                            backgroundColor: 'yellow'
                        }}
                                onTouchStart={this.handleBtnClick.bind(this, "Y")}
                                onTouchEnd={this.handleBtnBlur.bind(this, "Y")}>
                            Y
                        </Button>
                        <Button className="primary" variant="contained" style={{
                            left: "0", top: "160px",
                            backgroundColor: 'lawngreen'
                        }}
                                onTouchStart={this.handleBtnClick.bind(this, "A")}
                                onTouchEnd={this.handleBtnBlur.bind(this, "A")}>
                            A
                        </Button>
                        <Button className="primary" variant="contained" style={{
                            left: "60px", top: "160px",
                            backgroundColor: 'red'
                        }}
                                onTouchStart={this.handleBtnClick.bind(this, "B")}
                                onTouchEnd={this.handleBtnBlur.bind(this, "B")}
                        >
                            B
                        </Button>
                    </div>
                </div>

                {this.state.error ? (this.state.error) : (
                    <div
                        className="screen-container"
                        ref={el => {
                            this.screenContainer = el;
                        }}
                    >
                        {this.state.loading ? (
                            <Progress
                                value={this.state.loadedPercent}
                                style={{
                                    position: "absolute",
                                    width: "70%",
                                    left: "15%",
                                    top: "48%"
                                }}
                            />
                        ) : this.state.romData ? (
                            <Emulator
                                romData={this.state.romData}
                                paused={this.state.paused}
                                joyStickController={this.state.joyStickController}
                                handleJoyStick={this.handleJoyStick.bind(this)}
                                ref={emulator => {
                                    this.emulator = emulator;
                                }}
                            />
                        ) : null}

                        {/* TODO: lift keyboard and gamepad state up */}
                        {this.state.controlsModalOpen && (
                            <ControlsModal
                                isOpen={this.state.controlsModalOpen}
                                toggle={this.toggleControlsModal}
                                keys={this.emulator.keyboardController.keys}
                                setKeys={this.emulator.keyboardController.setKeys}
                                promptButton={this.emulator.gamepadController.promptButton}
                                gamepadConfig={this.emulator.gamepadController.gamepadConfig}
                                setGamepadConfig={
                                    this.emulator.gamepadController.setGamepadConfig
                                }
                            />
                        )}
                    </div>
                )}
            </div>
        );
    }

    componentDidMount() {
        window.addEventListener("resize", this.layout);
        this.layout();
        this.load();

        // // 检测手机是否支持振动
        // this.vibration();

        // var myShakeEvent = new Shake({
        //     threshold: 15, // optional shake strength threshold
        //     timeout: 1000 // optional, determines the frequency of event generation
        // });
        // myShakeEvent.start();
        // this.setState({myShakeEvent: myShakeEvent})
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.layout);
        if (this.currentRequest) {
            this.currentRequest.abort();
        }
        // var myShakeEvent = this.state.myShakeEvent;
        // myShakeEvent.stop();
    }

    load = () => {
        if (this.props.match.params.slug) {
            const slug = this.props.match.params.slug;
            const isLocalROM = /^local-/.test(slug);
            const romHash = slug.split("-")[1];
            const romInfo = isLocalROM
                ? RomLibrary.getRomInfoByHash(romHash)
                : config.ROMS[slug];

            if (!romInfo) {
                this.setState({error: `No such ROM: ${slug}`});
                return;
            }

            if (isLocalROM) {
                this.setState({romName: romInfo.name});
                const localROMData = localStorage.getItem("blob-" + romHash);
                this.handleLoaded(localROMData);
            } else {
                this.setState({romName: romInfo.description});
                this.currentRequest = loadBinary(
                    romInfo.url,
                    (err, data) => {
                        if (err) {
                            this.setState({error: `Error loading ROM: ${err.message}`});
                        } else {
                            this.handleLoaded(data);
                        }
                    },
                    this.handleProgress
                );
            }
        } else if (this.props.location.state && this.props.location.state.file) {
            let reader = new FileReader();
            reader.readAsBinaryString(this.props.location.state.file);
            reader.onload = e => {
                this.currentRequest = null;
                this.handleLoaded(reader.result);
            };
        } else {
            this.setState({error: "No ROM provided"});
        }
    };

    handleProgress = e => {
        if (e.lengthComputable) {
            this.setState({loadedPercent: (e.loaded / e.total) * 100});
        }
    };

    handleLoaded = data => {
        this.setState({running: true, loading: false, romData: data});
    };

    handlePauseResume = () => {
        this.setState({paused: !this.state.paused});
    };

    layout = () => {
        let navbarHeight = parseFloat(window.getComputedStyle(this.navbar).height);
        this.screenContainer.style.height = `${window.innerHeight - navbarHeight}px`;
        if (this.emulator) {
            this.emulator.fitInParent();
        }
    };

    toggleControlsModal = () => {
        this.setState({controlsModalOpen: !this.state.controlsModalOpen});
    };

    handleJoyStick(JoyStickController) {
        console.log("handleJoyStick", JoyStickController);
        this.setState({joyStickController: JoyStickController});
    };
}

export default RunPage;
