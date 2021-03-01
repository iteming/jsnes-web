import JoyStick from "./JoyStick";
import React, {Component} from "react";

const joyOptions = {
    mode: 'semi',
    catchDistance: 150,
    color: 'white'
};

const containerStyle = {
    position: 'relative',
    height: '350px',
    width: '100%',
    background: 'linear-gradient(to right, #E684AE, #79CBCA, #77A1D3)'
};


class JoyPage extends Component {
    constructor() {
        super();
        this.managerListener = this.managerListener.bind(this);
    }

    managerListener(manager) {
        manager.on('move', (e, stick) => {
            console.log('I moved!')
        });
        manager.on('end', () => {
            console.log('I ended!')
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <JoyStick options={joyOptions} containerStyle={containerStyle} managerListener={this.managerListener} />
            </div>
        )
    }
}

export default JoyPage;
