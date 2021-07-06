/**
 * Simple React Native App,
 * Tryout for Zemoga
 *
 * by Jerónimo Ulloa Guerra
 *
 * @format
 */

import 'react-native-gesture-handler';
import React, { FC } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Posts from './src/screens/Posts.screen';
import Post from './src/screens/Post.screen';
import ButtonIcon from './src/components/ButtonIcon.component';
import useData from './src/hooks/useData.hook';
import { Alert, LayoutAnimation, Platform, UIManager } from 'react-native';

// Initializing React Navigation's stack navigator
const Stack = createStackNavigator();

// Seetings necessary to use LayoutAnimation on android
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

// Main app component function
const App: FC<any> = () => {
    // Applying useData hook to use centralizaed 'posts' state
    const posts = useData('posts', (data: Array<any>) => data.map((entry, index) => ({ ...entry, unread: index < 20, favorite: false })));
    // Actions for header buttons
    // Reaload all posts
    const reloadPosts = () => {
        // Displaying a confirmation dialog before the action
        Alert.alert(
            'Reload state from server',
            'This will delete all the changes in the posts data and reset it to initial state from server. Do you want to continue?',
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "OK", onPress: () => {
                        // On ok reload posts data from server
                        posts.api.refetch().then((ok: any) => {
                            // Set LayoutAnimation to do the transitions
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        });
                    }
                }
            ]);
    }
    // Toggle favorite posts
    const toggleFavorite = (id: number, favorite: boolean, navigation: any) => () => {
        // Editing the data in the cache and the api with useData hook
        posts.api.edit(id, { favorite: !favorite }).then((entry: any) => {
            // Updating screen params
            navigation.setParams({
                favorite: entry.favorite
            });
        }, (error: Error) => {
            console.log(error);
        });
    }
    return (
        <NavigationContainer>
            <Stack.Navigator
                headerMode="float"
                screenOptions={{
                    headerTintColor: '#FFF',
                    headerStyle: {
                        backgroundColor: '#08AE0E'
                    },
                    headerTitleStyle: {
                        color: '#FFF'
                    },
                    headerBackTitleStyle: {
                        display: 'none'
                    },
                    headerBackTitleVisible: false,
                    headerBackTitle: ''
                }}>
                    <Stack.Screen
                        name="Posts"
                        component={Posts}
                        options={{
                            headerRight: () => <ButtonIcon
                                name="refresh"
                                tintColor="#FFF"
                                onPress={reloadPosts}
                            />,
                            headerBackTitleVisible: false,
                            headerBackTitle: '' }
                        }
                    />
                    <Stack.Screen
                        name="Post"
                        component={Post}
                        options={({ navigation, route }) => ({
                            title: '',
                            headerBackTitleVisible: false,
                            headerBackTitle: '',
                            headerRight: () => <ButtonIcon
                                name={`star-${(route.params as any).favorite ? 'filled' : 'outline'}`}
                                tintColor="#FFF"
                                onPress={toggleFavorite((route.params as any).id, (route.params as any).favorite, navigation)}
                            />
                        })}
                    />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;