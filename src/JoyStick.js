import React, { Component } from 'react';
import PropTypes from 'prop-types';
import nipplejs from 'nipplejs';

class JoyStick extends Component {
    constructor(props) {
        super(props);
        this.joyRef = React.createRef();
    }

    componentDidMount() {
        this.manager = nipplejs.create({ ...this.props.options, zone: this.joyRef.current });
        console.log("componentDidMount ", this.manager);
        this.props.managerListener(this.manager);
    }

    render() {
        return (
            <div ref={this.joyRef} style={this.props.containerStyle} />
        );
    }
}
// var options = {
//     zone: Element,                  // active zone
//     color: String,
//     size: Integer,
//     threshold: Float,               // before triggering a directional event
//     fadeTime: Integer,              // transition time
//     multitouch: Boolean,
//     maxNumberOfNipples: Number,     // when multitouch, what is too many?
//     dataOnly: Boolean,              // no dom element whatsoever
//     position: Object,               // preset position for 'static' mode
//     mode: String,                   // 'dynamic', 'static' or 'semi'
//     restJoystick: Boolean,
//     restOpacity: Number,            // opacity when not 'dynamic' and rested
//     lockX: Boolean,                 // only move on the X axis
//     lockY: Boolean,                 // only move on the Y axis
//     catchDistance: Number,          // distance to recycle previous joystick in
//                                     // 'semi' mode
//     shape: String,                  // 'circle' or 'square'
//     dynamicPage: Boolean,           // Enable if the page has dynamically visible elements
//     follow: Boolean,                // Makes the joystick follow the thumbstick
// };

JoyStick.defaultProps = {
    options: {
        mode: 'semi',
        catchDistance: 110,
        color: 'white',
    },
    containerStyle: {
        width: '100%',
        height: '50vh',
        position: 'relative',
        background: 'linear-gradient(to right, #E684AE, #79CBCA, #77A1D3)',
    },
};

JoyStick.propTypes = {
    managerListener: PropTypes.func.isRequired,
    options: PropTypes.shape({
        mode: PropTypes.string,
        catchDistance: PropTypes.number,
        color: PropTypes.string,
    }),
    containerStyle: PropTypes.shape({
        width: PropTypes.string,
        height: PropTypes.string,
        position: PropTypes.string,
        background: PropTypes.string,
    }),
};

export default JoyStick;
