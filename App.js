import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { StackNavigator,TabNavigator } from 'react-navigation';
import IndexScreen from './src/Index.js'
import ChapterScreen from './src/Chapter.js'
import ArticlesScreen from './src/Articles.js'

const App = StackNavigator({
  Home: { screen:IndexScreen},
  Chapter: { 
    screen: ChapterScreen,
    navigationOptions: ({navigation}) => ({
      title: `${navigation.state.params.name}`,
      headerBackTitle : "返回",
    })
  },
  Articles: { 
    screen: ArticlesScreen,
    navigationOptions: ({navigation}) => ({
      title: `${navigation.state.params.name}`
    })
  }
},{
  initialRouteName: 'Home', 
  cardStack: {
    gesturesEnabled: true,
  },
  navigationOptions: {
    headerTitleStyle: {
      color: '#fff',
      fontSize: 16,
      alignSelf : 'center',
    },
    headerTintColor : '#fff',
    headerStyle: {
      paddingTop:15,
      backgroundColor:'red',
    }
  }
});

export default App;

