import React from 'react';
import { Dimensions, StyleSheet, Text, Button, Image, View, ScrollView, FlatList, TouchableOpacity } from 'react-native';

let ScreenWidth = Dimensions.get('window').width;

class IndexScreen extends React.Component{
  static navigationOptions = {
    title: '首页'//对页面的配置
  };

  constructor(props){
    super(props);
    this.state = {
      books : [],
      pageIndex : 1
    }
  }
  
  componentDidMount() {
    this.search();
  }
  search(){
    let _this = this;
    let url = "http://book.km.com/shuku_0_0_0_1_0_0_" + this.state.pageIndex + ".html";
     
    fetch(url)
      .then(function(response){
        return response.text();
      })
      .then(function(responseData){
        let reg = /imgbox\"[\s\S]*?(href=\"(.*?)\")+[\s\S]*?(title=\"(.*?)\")+[\s\S]*?(_src=\"(.*?)\")/;
        let matchs = responseData.match(/imgbox\"[\s\S]*?(_src=\"(.*?)\")/g);
        let books = new Array();
        for(let i=0; i<matchs.length && i<99; i++){
          reg.test(matchs[i]);
          books.push({ name : RegExp.$4, url : RegExp.$2, img : RegExp.$6});
        }
        
        _this.setState({books:books});
      })
      .catch(function(error){
        console.log(error);
        _this.setState({books:[]});
      });
    }
  
  changePage(index){
    this.state.pageIndex = this.state.pageIndex + index;
    this.search();
  }
    
  _renderItem ({item}) {
    const { navigate } = this.props.navigation;
    return <TouchableOpacity onPress={() => navigate('Chapter', item )}>
      <View style={styles.item}>
        <Image source={{uri:item.img}} style={styles.image} />
        <Text numberOfLines={2} style={styles.title}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  }

  render(){
    return <View>
            <ScrollView>
              <FlatList style={styles.list}
                data={this.state.books}
                extraData={this.state}
                numColumns={3}
                keyExtractor={(item,index) => index}
                renderItem={this._renderItem.bind(this)}
              />
              <View style={styles.page}>
                {this.state.pageIndex == 1
                  ? null
                  : <Button
                      style={styles.pageButton}
                      onPress={()=>{this.changePage(-1)}}
                      title=" 上一页 "
                    />
                }
                <View style={styles.pageSepa}></View>
                {this.state.pageIndex == 100 || this.state.books.length < 99
                  ? null
                  : <Button
                      style={styles.pageButton}
                      onPress={()=>{this.changePage(1)}}
                      title=" 下一页 "
                    />
                }
              </View>
            </ScrollView>
      </View>
    }
}

export default IndexScreen;

const styles = StyleSheet.create({
    list:{
      marginBottom:10,
      marginTop:10,
      paddingLeft:6
    },
    item:{
      flex:1,
      flexWrap:'wrap',
      marginBottom: 8,
      marginLeft:6,
      marginRight:6
    },
    image:{
      width: ScreenWidth/3-16,
      height: (ScreenWidth/3-15)*1.3
    },
    title:{
      width: ScreenWidth/3-16
    },
    page: {
      marginBottom:20,
      flex: 1,
      alignItems: 'center',
      flexDirection:'row',
      flexWrap:'wrap',
      justifyContent: 'center'
    },
    pageSepa: {
      width: 10
    }
  });