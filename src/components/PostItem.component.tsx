/**
 * PostItem component to render
 * every post in the Posts screen,
 * uses panResponder to enable swipe
 * and touch gestures.
 *
 * @format
 */

import React, { FC, useEffect, useRef, useState } from 'react';
import { Text, StyleSheet,  Animated, useWindowDimensions, PanResponder } from 'react-native';

const PostItem: FC<any> = (props) => {
    // local states for swiping and pre-delete 
    const [swiping, setSwiping] = useState<boolean>(false);
    const [toDelete, setToDelete] = useState<boolean>(false);
    // screen width
    const windowWidth = useWindowDimensions().width;
    // Animated values for dynamic data
    const swipeAmount = useRef(new Animated.ValueXY()).current;
    const opacityAmount = useRef(new Animated.Value(1)).current;
    // animation loop
    const opacityAnimation = Animated.loop(
        Animated.sequence([
            Animated.timing(opacityAmount, {
                toValue: 0.3,
                duration: 300,
                useNativeDriver: false,
            }),
            Animated.timing(opacityAmount, {
                toValue: 0.5,
                duration: 300,
                useNativeDriver: false,
            })
        ])
    );
    // useEffect on pre-delete, show animation loop
    useEffect(() => {
        if (toDelete) {
            opacityAmount.setValue(0.5);
            opacityAnimation.start();
        } else {
            opacityAnimation.stop();
            opacityAmount.setValue(1);
        }
    }, [toDelete]);
    // PanResponder for gestures
    const swipeResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
            return Math.abs(gestureState.dx) > 30;
        },
        onPanResponderGrant: () => setSwiping(true),
        onPanResponderMove: Animated.event([
            null,
            {
                dx: swipeAmount.x
            },
        ], { useNativeDriver: false }),
        onPanResponderRelease: (_, gestureState) => {
            if (Math.abs(gestureState.dx) <= 0.2 && Math.abs(gestureState.dy) <= 0.2 && props.onPress) {
                props.onPress(props.id)
            }
            if (Math.abs(gestureState.dx) > (windowWidth * 0.3) && props.onSwipe) {
                props.onSwipe(props.id, (val: boolean) => setToDelete(val))
            }
            Animated.spring(
                swipeAmount,
                { toValue: { x: 0, y: 0 }, useNativeDriver: false }
            ).start(() => setSwiping(false));
        }
    })).current;
    // updated styles from props and states
    const currentDotStyle = {
        color: props.favorite ? '#FCE127' : '#076FEC',
        opacity: props.unread || props.favorite ? 1 : 0
    };
    const currentBackStyle = {
        backgroundColor: swiping ? '#D0011B' : 'trasnparent',
        opacity: opacityAmount
    };
    const currentColorStyle = {
        backgroundColor: swiping ? '#DDD' : '#EEE'
    };
    return (
        <Animated.View style={[currentBackStyle, styles.wrap]}>
            <Animated.View style={[swipeAmount.getLayout(), styles.container, currentColorStyle]} {...swipeResponder.panHandlers}>
                <Text style={[styles.dot, currentDotStyle]}>{props.favorite ? '★' : '●'}</Text>
                <Text style={styles.text} numberOfLines={3} ellipsizeMode="tail">{props.title}</Text>
                <Text style={styles.arrow}>›</Text>
            </Animated.View>
        </Animated.View>
    )
};

const styles = StyleSheet.create({
    wrap: {
        borderBottomColor: '#DDD',
        borderBottomWidth: 1,
        borderTopColor: '#DDD',
        borderTopWidth: 1,
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        paddingHorizontal: 8,
        paddingVertical: 6,
        height: 57,
        backgroundColor: '#EEE',
        opacity: 1
    },
    text: {
        color: '#666',
        fontSize: 12,
        lineHeight: 15,
        textTransform: 'capitalize',
        maxWidth: '90%'
    },
    dot: {
        color: '#076FEC',
        lineHeight: 45,
        marginRight: 8,
        fontSize: 24
    },
    arrow: {
        color: '#666',
        lineHeight: 45,
        marginLeft: 'auto',
        fontSize: 24
    }
});

export default PostItem;