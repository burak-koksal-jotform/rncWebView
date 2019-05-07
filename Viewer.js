import React, { Component} from 'react';
import { Text, View } from 'react-native';

import { WebView } from "react-native-webview";
import RNFS from 'react-native-fs';

const directoryPath = RNFS.DocumentDirectoryPath;

class Viewer extends Component {
  constructor(props){
    super(props);

    this.state = {
      show: false
    }
  }
  static getDerivedStateFromProps = (props, prevState) => {
    console.log('gdsfp', props, prevState);
    const {formID} = props;
    if(formID){
      return { show: true }
    }
    return null;
  };

  prepareProps = () => {
    const { formID, isOffline } = this.props;
    const source = {};

    if(isOffline){
      const extractedResourcePath = `${directoryPath}/${formID}`;
      source.uri = `file://${extractedResourcePath}/index.html?jotformNext=1&offline_forms=true`;
    }else{
      source.uri = `https://www.jotform.com/${formID}`;
    }
    return {
      source,
      originWhitelist: ['*'],
      allowFileAccess: true
    };
  };

  render() {
    const {show} = this.state;
    if(!show){
      return null;
    }
    const { formID, isOffline } = this.props;

    const props = this.prepareProps();
    console.log('serving with ', props);
    return (
      <View style={{flex: 1}}>
        <Text>{formID} {isOffline}</Text>
        <WebView {...props}/>
      </View>
    );
  }
}

export default Viewer;
