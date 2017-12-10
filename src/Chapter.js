import React from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity } from 'react-native';

class ChapterScreen extends React.Component{
        
    constructor(props){
      super(props);
      this.state = {
        chapter : []
      }
    }
    componentDidMount() {
      this.load();
    }
    load(){
        const { params } = this.props.navigation.state;

        let _this = this;
        let url = "http://book.km.com/chapterlist" + params.url.replace("/shuku","");
     
        fetch(url)
        .then(function(response){
          return response.text();
        }).then(function(responseData){
          let reg = /<li>[\s\S]*?chapter\/(.*?)\"[\s\S]*?>(.*?)</;
          let matchs = responseData.match(/<li>[\s\S]*?chapter\/(.*?)\"[\s\S]*?>(.*?)</g);
         
          let chapter = new Array();
          for(let i=0; i<matchs.length; i++){
            reg.test(matchs[i]);
            chapter.push({ name : RegExp.$2, url : RegExp.$1});
          }
          _this.setState({chapter : chapter});
        })
        .catch(function(error){
          console.log(error);
          _this.setState({chapter:[]});
        });
    }

    _renderItem ({item}) {
        
        const { navigate } = this.props.navigation;
        return <TouchableOpacity onPress={() => navigate('Articles', item )}>
            <Text numberOfLines={2} style={styles.title}>{item.name}</Text>
          </TouchableOpacity>
      }

      
    render(){
        return <View>
        <ScrollView>        
            <FlatList 
                style={styles.list}
                data={this.state.chapter}
                extraData={this.state}
                keyExtractor={(item,index) => index}
                renderItem={this._renderItem.bind(this)}
            />
        </ScrollView>
        </View>
    }
}

export default ChapterScreen;


const styles = StyleSheet.create({
    list:{
        paddingBottom:10
    },
    title:{
        paddingLeft:30,
        paddingTop:8,
        fontSize:16
    }
});