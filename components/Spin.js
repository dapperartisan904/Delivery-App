import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';
import { Icon, Divider } from "react-native-elements";
class FontAwesomeSpin extends Component {

    spinValue = new Animated.Value(0);

    componentDidMount(){
        this.spin();
    };

    spin = () => {

        this.spinValue.setValue(0);

        Animated.timing(
            this.spinValue,
            {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }
        ).start(() => this.spin());

    };

    render() {

        const { style, children } = this.props;
        const rotate = this.spinValue.interpolate({inputRange: [0, 1], outputRange: ['0deg', '360deg']});

        return(
            <Animated.View style={{transform: [{rotate}]}}>
                {children}
            </Animated.View>
        )

    }
}

export default FontAwesomeSpin;