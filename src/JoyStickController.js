import {Controller} from "jsnes";

// Mapping keyboard code to [controller, button]
const KEYS = {
    1: {
        "A": [Controller.BUTTON_A, "A"],
        "B": [Controller.BUTTON_B, "B"],
        "X": [Controller.BUTTON_B, "B"],
        "Y": [Controller.BUTTON_B, "B"],
        "SELECT": [Controller.BUTTON_SELECT, "SELECT"], // Right Ctrl
        "START": [Controller.BUTTON_START, "START"], // Enter
        "U": [Controller.BUTTON_UP, "Up"], // Up
        "D": [Controller.BUTTON_DOWN, "Down"], // Down
        "L": [Controller.BUTTON_LEFT, "Left"], // Left
        "R": [Controller.BUTTON_RIGHT, "Right"], // Right
    },
    2: {
        "A": [Controller.BUTTON_A, "A"],
        "B": [Controller.BUTTON_B, "B"],
        "X": [Controller.BUTTON_B, "B"],
        "Y": [Controller.BUTTON_B, "B"],
        "SELECT": [Controller.BUTTON_SELECT, "SELECT"], // Right Ctrl
        "START": [Controller.BUTTON_START, "START"], // Enter
        "U": [Controller.BUTTON_UP, "Up"], // Up
        "D": [Controller.BUTTON_DOWN, "Down"], // Down
        "L": [Controller.BUTTON_LEFT, "Left"], // Left
        "R": [Controller.BUTTON_RIGHT, "Right"], // Right
    }
};

export default class JoyStickController {
    constructor(options) {
        this.onButtonDown = options.onButtonDown;
        this.onButtonUp = options.onButtonUp;
    }

    loadKeys = () => {
        this.keys = KEYS;
    };

    setKeys = newKeys => {
        console.log("JoyStick could't set Keys");
    };

    handleJoyStickDown = (playerId, eventKey) => {
        var keys = this.keys[playerId];
        if (keys) {
            // console.log("JoyStick 点击落");
            this.onButtonDown(playerId, keys[eventKey][0]);
        }
    };

    handleJoyStickUp = (playerId, eventKey) => {
        var keys = this.keys[playerId];
        if (keys) {
            // console.log("JoyStick 点击起");
            if (eventKey === "ALL") {
                for (let thisKey in keys) {
                    this.onButtonUp(playerId, keys[thisKey][0]);
                }
            } else {
                this.onButtonUp(playerId, keys[eventKey][0]);
            }
        }
    };
}
