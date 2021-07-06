/**
 * Screen for a single post,
 * user info and comments.
 *
 * @format
 */

import React, { useState, useEffect, FC } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Text, ScrollView, ActivityIndicator, LayoutAnimation } from 'react-native';
import useData from '../hooks/useData.hook';

const Post: FC<any> = (props) => {
    // reading route param
    const { id: postId } = props.route.params;
    // centralizaed state, useData with posts
    const posts = useData('posts', (data: Array<any>) => data.map((entry, index) => ({ ...entry, unread: index < 20, favorite: false })));
    // centralizaed state, useData with users
    const users = useData('users');
    // centralizaed state, useData with comments
    const comments = useData('comments');
    // local states
    const [post, setPost] = useState<any>();
    const [user, setUser] = useState<any>();
    const [postComments, setPostComments] = useState<Array<any>>([]);
    // useEffect for first render
    useEffect(() => {
        // loadig post data from cache or api
        posts.api.pick(postId).then((storedPost: any) => {
            // LayoutAnimation settings
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            // update post data
            setPost(storedPost);
            // set post as unread
            posts.api.edit(postId, { unread: false });
            // find user from post
            users.api.pick(storedPost.userId).then((user: any) => {
                // LayoutAnimation settings
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                // set user data
                setUser(user);
            });
            // get comments from post
            comments.api.list({ postId: postId }, true).then((listedComments: any) => {
                // LayoutAnimation settings
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                // set comments data
                setPostComments(listedComments);
            });
        });
    }, []);
    // updated styles from props and states
    const currentUserTextStyle = {
        color: !user ? '#DDD' : '#666'
    };
    return (
        <SafeAreaView style={{ flex: 1 }} >
            <StatusBar barStyle="light-content" />
            <ScrollView>
                <View>
                    <Text style={styles.title}>Description</Text>
                    <Text style={styles.text}>{post?.body}</Text>
                </View>
                <View>
                    <Text style={styles.title}>User</Text>
                    <Text style={[styles.text, currentUserTextStyle]}>{user?.name || '██████ █████'}</Text>
                    <Text style={[styles.text, currentUserTextStyle]}>{user?.email || '████████████'}</Text>
                    <Text style={[styles.text, currentUserTextStyle]}>{user?.phone || '███ █████ ██████'}</Text>
                    <Text style={[styles.text, currentUserTextStyle]}>{user?.website || '██████████████'}</Text>
                </View>
                <Text style={styles.bar}>COMMENTS</Text>
                <View style={styles.comments}>
                    {
                        comments.status == 'initial' || comments.status == 'loading' ?
                            <View style={styles.activity}>
                                <ActivityIndicator size="large" color="#08AE0E" />
                            </View>
                            :
                            postComments.map((comment: any, index: number) => <Text key={index.toString()} style={styles.comment}>{comment.body}</Text>)
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    title: {
        color: '#000',
        fontSize: 16,
        marginVertical: 10,
        fontWeight: 'bold',
        paddingHorizontal: 10
    },
    text: {
        color: '#666',
        fontSize: 14,
        paddingHorizontal: 15
    },
    bar: {
        width: '100%',
        backgroundColor: '#DADADA',
        color: '#000',
        fontSize: 14,
        marginTop: 15,
        paddingHorizontal: 10,
        paddingVertical: 2
    },
    comments: {
        paddingHorizontal: 15
    },
    comment: {
        color: '#666',
        fontSize: 12,
        paddingHorizontal: 6,
        paddingVertical: 10,
        borderBottomColor: "#999",
        borderBottomWidth: 0.5
    },
    activity: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    }
});

export default Post;
