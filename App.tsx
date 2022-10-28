import React, {useEffect, type PropsWithChildren, useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Navigation, NavigationFunctionComponent } from 'react-native-navigation';
import Main from './src/screens/Main';
import * as firebase from '@react-native-firebase/firestore'
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'
import Login from './src/screens/Login';
import ActionButton from 'react-native-action-button'
import { colors } from './src/assets/colors';
interface Props {
  title: string
}

const data = require('./store/data');

const App: NavigationFunctionComponent<Props> = ({componentId}) => {
  const [isLoading, setLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);

  const firebaseConfig = {
    apiKey: "", //YOUR API KEY
    authDomain: "quizzy-1d621.firebaseapp.com",
    projectId: "sitem-51ab4",
    databaseURL: "https://sitem-51ab4.firebaseio.com/",
    storageBucket: "sitem-51ab4.appspot.com",
    messagingSenderId: "",
    appId: "1:418648071483:android:622b476b46f093e5636b1e",
  };
  
  if (Platform.OS == 'android' && !firebase.firebase.app.length) {
    var app;
    if(!firebase.firebase.apps.length) {
      app = firebase.firebase.initializeApp(firebaseConfig);
    } 
  } 

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(userState => {
      if (userState) {
        checkUserExistence(userState)
      } else {
        setLoggedIn(false);
        setLoading(false)
      }
    })
    return subscriber;
  }, [])

  useEffect(() => {
    setLoading(true)
  }, [])


  function checkUserExistence(user: FirebaseAuthTypes.User){
    data.userId = user.uid;
    data.userMail = user.email;
    data.userName = user.displayName != null ? user.displayName : '';
    data.userPhoto = user.photoURL;
    data.userPhone = user.phoneNumber;
    setLoggedIn(true);
    setLoading(false)
  }

  const loginCb = (async function (user: FirebaseAuthTypes.User){
    await checkUserExistence(user);
    setLoggedIn(true);
  })

  return (
          <View style={styles.container}>
      {isLoading ? 
        <ActivityIndicator size={'large'}/>
      :
        <View style={styles.container}>
          {isLoggedIn ?
          <Main componentId={componentId} loggedIn={isLoggedIn}/>
          :
          <Login componentId={componentId} loginCallback={(user: FirebaseAuthTypes.User) => loginCb(user)}/> 
         }
        </View>
    }
    {
      isLoggedIn ? 
      <ActionButton 
      buttonColor={colors.TEXT_DARK}
      onPress={() => {
        Navigation.push(componentId, {
          component: {
            name: 'AddBlock'
          },
        });
      }} />
      : null
    }
    </View>
  );
};

App.options = {
  topBar: {
    title: {
      text: 'Sitem'
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default App;
