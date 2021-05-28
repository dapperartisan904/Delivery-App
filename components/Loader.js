import { EatBeanLoader } from 'react-native-indicator';
import React, { Component } from 'react';
import { Animated, Easing, View, Text } from 'react-native';
import { Icon, Divider } from "react-native-elements";
class CustomLoader extends Component {
    render() {
        const { isLoading, loadingText } = this.props;
        return(
            <View style={{display:isLoading?"flex":"none", width:"100%", height:"100%", justifyContent:"center", alignItems:"center", zIndex:98,}}>
                <EatBeanLoader style={{zIndex:99, display:"none",}}/>
                <Text style={{color: "#6599D9", zIndex:99, margin:20, fontSize:18}}>{loadingText}</Text>
            </View>
        )
    }
}

export default CustomLoader;