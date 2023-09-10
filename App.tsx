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
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Main from './src/screens/Main';
import * as firebase from '@react-native-firebase/firestore';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import Login from './src/screens/Login';
import ActionButton from 'react-native-action-button';
import {colors} from './src/assets/colors';
import CodePush from 'react-native-code-push';
import {API_KEY} from '@env';
import i18n from './src/resources/Translation/I18n';
import { useSelector } from 'react-redux';
import { RootState } from './src/screens/store';
interface Props {
  title: string;
}

const data = require('./store/data');

const App: NavigationFunctionComponent<Props> = ({componentId}) => {
  const [isLoading, setLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const langState = useSelector((state: RootState) => state.userPreferenceSlice)

  const firebaseConfig = {
    apiKey: API_KEY, //YOUR API KEY
    authDomain: 'quizzy-1d621.firebaseapp.com',
    projectId: 'sitem-51ab4',
    databaseURL: 'https://sitem-51ab4.firebaseio.com/',
    storageBucket: 'sitem-51ab4.appspot.com',
    messagingSenderId: '',
    appId: '1:418648071483:android:622b476b46f093e5636b1e',
  };

  if (Platform.OS == 'android' && !firebase.firebase.app.length) {
    var app;
    if (!firebase.firebase.apps.length) {
      app = firebase.firebase.initializeApp(firebaseConfig);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(userState => {
      if (userState) {
        checkUserExistence(userState);
        void i18n.changeLanguage(langState.lang)
      } else {
        setLoggedIn(false);
        setLoading(false);
      }
    });
    return subscriber;
  }, []);

  useEffect(() => {
    setLoading(true);
  }, []);

  function checkUserExistence(user: FirebaseAuthTypes.User) {
    data.userId = user.uid;
    data.userMail = user.email;
    data.userName = user.displayName != null ? user.displayName : '';
    data.userPhoto = user.photoURL;
    data.userPhone = user.phoneNumber;
    setLoggedIn(true);
    setLoading(false);
  }

  //Loginden sonra kullanıcı bilgisini set edip giriş yapıldı bilgisini set eden metod
  const loginCb = async function (user: FirebaseAuthTypes.User) {
    await checkUserExistence(user);
    setLoggedIn(true);
    void i18n.changeLanguage(langState.lang)
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size={'large'} />
      ) : (
        <View style={styles.container}>
          {isLoggedIn ? (
            <Main componentId={componentId} loggedIn={isLoggedIn} />
          ) : (
            <Login
              componentId={componentId}
              loginCallback={(user: FirebaseAuthTypes.User) => loginCb(user)}
            />
          )}
        </View>
      )}
      {isLoggedIn ? (
        <ActionButton
          buttonColor={colors.TEXT_DARK}
          onPress={() => {
            Navigation.push(componentId, {
              component: {
                name: 'AddBlock',
              },
            });
          }}
        />
      ) : null}
    </View>
  );
};

App.options = {
  topBar: {
    title: {
      text: 'Sitem',
    },
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default __DEV__ ? App : CodePush(App);
