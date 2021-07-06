/**
 * Epanding the default button component
 * for React Navigation's header, to
 * use customized images.
 *
 * @format
 */

import React, { FC } from 'react';
import { Image } from 'react-native';
import { HeaderBackButton } from '@react-navigation/stack';

// props type
type Props = {
    name: string,
    onPress?: Function,
    tintColor?: string,
    style?: any
}

const ButtonIcon: FC<Props> = (props) => {
    // function returning default sources according to props.name
    const getSource = () => {
        switch (props.name) {
            case 'star-filled':
                return require('../../assets/icons/star-filled.png');
            case 'star-outline':
                return require('../../assets/icons/star-outline.png');
            case 'delete-all':
                return require('../../assets/icons/delete-all.png');
            case 'delete-one':
                return require('../../assets/icons/delete-one.png');
            default:
                return require('../../assets/icons/refresh.png');
        }
    }
    // executing props.onPress
    const onPress = () => {
        if (props.onPress) props.onPress();
    }
    // rendering the HeaderBackButton with custom image
    return <HeaderBackButton labelVisible={false} style={props.style} backImage={() => <Image style={{width: 24, height: 24, tintColor: props.tintColor || '#FFF'}} source={getSource()} />} onPress={onPress} />
};

export default ButtonIcon;