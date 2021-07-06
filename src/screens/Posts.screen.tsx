/**
 * Screen for all posts and
 * naib app screen.
 *
 * @format
 */

import React from 'react';
import { useState, useEffect, FC } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, FlatList, Alert, Platform, UIManager, LayoutAnimation, Button } from 'react-native';
import PostItem from '../components/PostItem.component';
import useData from '../hooks/useData.hook';
import ButtonToggle from '../components/ButtonToggle.component';
import ButtonIcon from '../components/ButtonIcon.component';

const Posts: FC<any> = (props) => {
    // Applying useData hook to use centralizaed 'posts' state
    const posts = useData('posts', (data: Array<any>) => data.map((entry, index) => ({ ...entry, unread: index < 20, favorite: false })));
    // Set a favorites flag for filtering
    const [favorites, setFavorites] = useState<boolean>(false);
    // useEffect for first render
    useEffect(() => {
        // List all posts in the cache using useData
        posts.api.list().then((ok: any) => {
            // LayoutAnimation setting
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        });
    }, []);
    // Actions
    // Item renderer for FlatList, filtering occurs here
    const renderItem: typeof PostItem | undefined = ({ item }) => {
        // returning component according to favorites flags
        return (!favorites || (favorites && item.favorite == true)) ? <PostItem
            onPress={(id: number) => {
                // navigation to the post on touch
                props.navigation.navigate('Post', { id: item.id, favorite: item.favorite });
            }}
            onSwipe={(id: number, setDeleting: any) => {
                // setting post for delete on swipe
                setDeleting(true);
                // prompting the user for confirmation
                Alert.alert(
                    'Delete Post',
                    'This will delete the post. Do you want to continue?',
                    [
                        { text: "Cancel", style: "cancel", onPress: () => setDeleting(false) },
                        {
                            text: "OK", onPress: () => {
                                // removing the posts on ok
                                posts.api.remove(id).then((_) => {
                                    // LayoutAnimation setting
                                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                });
                            }
                        }
                    ]
                )
            }
            } {...item} /> : null
    };
    // deleteing all posts
    const deleteAll = () => {
        // prompting the user for confirmation
        Alert.alert(
            'Delete All Posts',
            'This will delete all the posts data. Do you want to continue?',
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "OK", onPress: () => {
                        // clearing data in cache
                        posts.api.clear().then((_) => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        });
                    }
                }
            ]);
    }
    // toggling favorites filter
    const toggleFavorites = (value: boolean) => () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setFavorites(value);
    }
    return (
        <SafeAreaView style={{ flex: 1 }} >
            <StatusBar backgroundColor="#08AE0E" barStyle="light-content" />
            <View style={styles.buttonGroup}>
                <ButtonToggle title="All" active={!favorites} style={{ width: '50%' }} onPress={toggleFavorites(false)} />
                <ButtonToggle title="Favorites" active={favorites} style={{ width: '50%' }} onPress={toggleFavorites(true)} />
            </View>
            <FlatList
                refreshing={posts.status == 'loading' || posts.status == 'initial'}
                onRefresh={() => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)}
                data={posts.data}
                renderItem={renderItem}
                keyExtractor={item => (item as any).id.toString()}
                ListEmptyComponent={() => <Text style={styles.emptyList}>No posts in cache. Try reloading from server, with the button at the top right corner.</Text>}
            />
            <View style={styles.footer}>
                {Platform.OS === 'android' ?
                    <ButtonIcon name="delete-all" style={styles.buttonFooter} onPress={deleteAll} />
                :
                    <ButtonToggle active={true} title="Delete All" color="#D0011B" borderColor="#D0011B" onPress={deleteAll} />
                }
                
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    buttonGroup: {
        flexDirection: 'row',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        backgroundColor: '#08AE0E',
        ...Platform.select({
            ios: {
                padding: 8,
                backgroundColor: '#EEE',
            },
            android: {
                backgroundColor: '#08AE0E'
            },
        })
    },
    emptyList: {
        color: '#BBB',
        textAlign: 'center',
        fontSize: 14,
        paddingVertical: 50,
        paddingHorizontal: 50
    },
    activity: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        ...Platform.select({
            ios: {
                position: 'relative',
                width: '100%'
            },
            android: {
                position: 'absolute',
                bottom: 20,
                right: 10
            },
        })
    },
    buttonFooter: {
        backgroundColor: '#D0011B',
        padding: 15,
        borderRadius: 30,
        elevation: 10,
        margin: 0
    }
});

export default Posts;
