/**
 * Simple toggle button, keeps
 * native feeling in ios and android.
 *
 * @format
 */

import React, { FC, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Platform } from 'react-native';

// props type
type Props = {
    title?: string,
    active?: boolean,
    onPress?: Function,
    style?: Object,
    color?: string,
    borderColor?: string
}

const ButtonToggle: FC<Props> = (props) => {
    // local state
    const [active, setActive] = useState<boolean>(props.active || false);
    // useEffect on local state
    useEffect(() => {
        if (props.active != undefined) setActive(props.active);
    }, [props.active]);
    // updated styles from props and states
    const currentContainerStyle = {
        borderColor: Platform.OS == 'ios' && active ? props.borderColor || '#EEE' : props.borderColor || props.color || '#08AE0E',
        backgroundColor: Platform.OS == 'ios' && !active ? '#EEE' : props.color || '#08AE0E',
        borderBottomColor: Platform.OS == 'android' && active ? '#EEE' : props.color || '#08AE0E'
    };
    const currentTextStyle = {
        color: Platform.OS == 'ios' && !active ? props.color || '#08AE0E' : '#FFF'
    };
    // execute props.onPress
    const onPress = () => {
        if (props.onPress != undefined) props.onPress();
    };
    return(
        <TouchableHighlight onPress={onPress} style={props.style}>
            <View style={[styles.container, currentContainerStyle]}>
                <Text style={[styles.text, currentTextStyle]}>{props.title || 'Button'}</Text>
            </View>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    container: {
        borderColor: '#08AE0E',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                backgroundColor: '#EEE'
            },
            android: {
                backgroundColor: '#08AE0E'
            },
        })
    },
    text: {
        color: '#FFF',
        paddingHorizontal: 8,
        paddingVertical: 6,
        ...Platform.select({
            ios: {
                textTransform: 'none'
            },
            android: {
                textTransform: 'uppercase'
            },
        })
    }
});

export default ButtonToggle;