import React from 'react';
import { Dimensions, StyleSheet, Button, View, ScrollView, WebView, StatusBar } from 'react-native';

let ScreenHeight = Dimensions.get('window').height;

class ArticlesScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          articles : "",
          prev : {},
          next : {}
        }
    }
    componentDidMount() {
        this.load();
    }
      
    load(){
        const { params } = this.props.navigation.state;

        let _this = this;
        let key = params.url.match(/\d+/g)
        let url = "http://book.km.com/chapter/"+params.url;

        fetch(url).then(function(response){
            return response.text();
          }).then(function(responseData){
                let reg = /RP\.sign[\s\S]*?\"(.*?)\"/;
                reg.test(responseData);
                let sign = RegExp.$1;

                reg=/RP\.prev[\s\S]{0,10}{(.*?)}/;
                if(reg.test(responseData)){
                    let prev = JSON.parse("{"+RegExp.$1+"}");
                    _this.state.prev = {url:key[0]+"_"+prev.id+".html",name:prev.title};
                }else{
                    _this.state.prev = {};
                }

                reg=/RP\.next[\s\S]{0,10}{(.*?)}/;
                if(reg.test(responseData)){
                    let next = JSON.parse("{"+RegExp.$1+"}");
                    _this.state.next = {url:key[0]+"_"+next.id+".html",name:next.title};
                }else{
                    _this.state.next = {};
                }

                url = "http://book.km.com/index.php?c=catch&a=getContent&book_id="+key[0]+"&chapter_id="+key[1]+"&sign="+sign;
                fetch(url,{method: 'GET', headers:{'X-Requested-With':'XMLHttpRequest'}})
                   .then(function(response){
                     return response.text();
                   }).then(function(responseData){
                     _this.setState({articles : responseData});
                   })
                   .catch(function(error){
                     console.log(error);
                     _this.setState({articles:""});
                   });
          })
          .catch(function(error){
            console.log(error);
            _this.setState({articles:""});
          });
    }

    render(){
        const { navigate } = this.props.navigation;
        return <View>
            <ScrollView>
                <WebView
                    style={styles.webView}
                    source={{html: this.state.articles}}
                    javaScriptEnabled={false}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                />
                <View style={styles.page}>
                    {this.state.prev.name == undefined
                    ? null
                    : <Button
                        style={styles.pageButton}
                        onPress={() => navigate('Articles', this.state.prev )}
                        title=" 上一章 "
                        />
                    }
                    <View style={styles.pageSepa}></View>
                    {this.state.next.name == undefined
                    ? null
                    : <Button
                        style={styles.pageButton}
                        onPress={() => navigate('Articles', this.state.next )}
                        title=" 下一章 "
                        />
                    }
                </View>
            </ScrollView>
        </View>
    }
}

export default ArticlesScreen;

const styles = StyleSheet.create({
    webView:{
        flex:1,
        padding:10,
        height: ScreenHeight - StatusBar.currentHeight - 75 
    },
    page: {
        backgroundColor:'#fff',
        paddingTop:5,
        paddingBottom:2,
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