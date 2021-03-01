import JoyStick from "./JoyStick";
import React, {Component} from "react";

class JoyPage extends Component {
    constructor() {
        super();
        this.managerListener = this.managerListener.bind(this);
    }

    managerListener(manager) {
        // {
        //     on: Function,                       // handle internal event
        //     off: Function,                      // un-handle internal event
        //     get: Function,                      // get a specific joystick
        //     destroy: Function,                  // destroy everything
        //     ids: Array                          // array of assigned ids
        //     id: Number                          // id of the manager
        //     options: {
        //         zone: Element,                  // reactive zone
        //             multitouch: Boolean,
        //             maxNumberOfNipples: Number,
        //             mode: String,
        //             position: Object,
        //             catchDistance: Number,
        //             size: Number,
        //             threshold: Number,
        //             color: String,
        //             fadeTime: Number,
        //             dataOnly: Boolean,
        //             restJoystick: Boolean,
        //             restOpacity: Number
        //     }
        // }
        manager.on('move', (e, stick) => {
            // 当摇杆发生便宜产生上下左右参数，且摇杆距离中心点的距离超过15（满值50）
            if (stick.direction !== undefined && stick.distance > 15) {
                if (55 > stick.angle.degree && stick.angle.degree > 35) {
                    console.log('I moved! up - right');
                } else if (145 > stick.angle.degree && stick.angle.degree > 125) {
                    console.log('I moved! up - left');
                } else if (235 > stick.angle.degree && stick.angle.degree > 215) {
                    console.log('I moved! down - left');
                } else if (325 > stick.angle.degree && stick.angle.degree > 305) {
                    console.log('I moved! down - right');
                } else if (stick.direction.angle === 'up') {
                    console.log('I moved! ', stick.direction.angle);
                } else if (stick.direction.angle === 'down') {
                    console.log('I moved! ', stick.direction.angle);
                } else if (stick.direction.angle === 'left') {
                    console.log('I moved! ', stick.direction.angle);
                } else if (stick.direction.angle === 'right') {
                    console.log('I moved! ', stick.direction.angle);
                }
            }
        });
        manager.on('end', () => {
            // console.log('I ended!')
        })
    }

    render() {
        // const { classes } = this.props;
        return (
            <div>
                <JoyStick managerListener={this.managerListener}/>
            </div>
        )
    }
}

export default JoyPage;
