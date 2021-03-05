import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Vibration
} from 'react-native';

//默认应用的容器组件
class App extends Component {
    //渲染
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.item} onPress={this.vibration.bind(this)}>点击震动</Text>
            </View>
        );
    }

    //点击震动
    vibration() {
        console.log("点击振动", Vibration);
        Vibration.vibrate();
    }
}

//样式定义
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 25,
        color: 'white'
    },
    item: {
        margin: 15,
        height: 30,
        borderWidth: 1,
        padding: 6,
        borderColor: '#ddd',
        textAlign: 'center',
        color: 'white'
    },
});

export default App;
