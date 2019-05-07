/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import WebView from 'react-native-webview';
import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      ready: false
    }
  }

  resourcesPath =`${RNFS.DocumentDirectoryPath}/resources/`;

  downloadResources = async () => {
    console.log('downloading');
    const fromUrl = 'https://www.jotform.com/uploads/burak/91174000715951/4330339118506455470/archive.zip';
    const toFile = `${RNFS.DocumentDirectoryPath}/resource.zip`;

    await RNFS.downloadFile({ fromUrl, toFile }).promise;

    const unzipTarget = this.resourcesPath;
    if(RNFS.exists(unzipTarget)){
      RNFS.unlink(unzipTarget);
    }
    await RNFS.mkdir(unzipTarget);

    await unzip(toFile, unzipTarget);

    this.setState({ ready: true });
  };

  renderWebView = () => {
    const { ready } = this.state;
    if(!ready) return null;

    const source = {
      uri: `file://${this.resourcesPath}index.html`
    };

    const props = {
      source,
      originWhitelist: ['*'],
      allowFileAccess: true
    };

    return (<WebView {...props} />);
  };

  render() {

    return (
      <Fragment>
        <View style={styles.container}>
          <Text style={styles.welcome}>Welcome to React Native!</Text>
          <TouchableOpacity style={{ backgroundColor: '#2d651a', width: '80%', alignItems: 'center', padding: 10 }} onPress={this.downloadResources}>
            <Text style={{ color: 'white' }}>Download and open local HTML</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.7 }}>
          {this.renderWebView()}
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 10,
    flex: 0.3,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

const readDirContent = (dirPath) => { //"MainBundlePath"
  // get a list of files and directories in the main bundle
  RNFS.readDir(dirPath) //  On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
  .then((result) => {
    console.log('GOT RESULT', result);
    // stat the first file
    return Promise.all([RNFS.stat(result[0].path), result[0].path]);
  })
  .then((statResult) => {
    if (statResult[0].isFile()) {
      // if we have a file, read it
      unzip(statResult[1]);
      return RNFS.readFile(statResult[1], 'utf8');
    }

    return 'no file';
  })
  .then((contents) => {
    // log the file contents
    console.log(contents);
  })
  .catch((err) => {
    console.log(err.message, err.code);
  });
};
