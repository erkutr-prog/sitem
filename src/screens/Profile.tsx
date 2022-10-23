import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

const data = require('./../../store/data');

type Props = {};

const Profile: NavigationFunctionComponent<Props> = ({componentId}) => {
  const [storeData, setStoreData] = useState<FirebaseAuthTypes.User>();

  useEffect(() => {
    const userData = auth().currentUser
    if (userData !== null){
      setStoreData(userData)
    }
  }, [])


  const onLogout = async () => {
    Alert.alert('Uyarı', 'Çıkış yapmak istediğinize emin misiniz?', [
      {
        text: 'Yes',
        onPress: () => logout(),
      },
      {
        text: 'No',
        onPress: () => console.log('Cancelled.'),
      },
    ]);
  };


  const logout = async () => {
    data.userId = '';
    data.userName = '';
    data.userMail = '';
    data.userPhoto = '';
    data.userPhone = '';
    await auth()
      .signOut()
      .then(() => Navigation.pop(componentId));
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{justifyContent: 'space-evenly'}}>
      <View style={styles.imageContainer}>
        {storeData !== undefined && storeData.photoURL !== null ? (
          <Image
            source={{uri: data.userPhoto}}
            style={{resizeMode: 'contain'}}
          />
        ) : (
          <Icon name="person" size={120} style={{color: 'black'}} />
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={{fontSize: 30, fontWeight: 'bold', paddingBottom: 20}}>
          {storeData !== undefined && storeData.displayName !== '' ? data.userName : 'User'}
        </Text>

        <Text style={{fontSize: 20, color: 'black', paddingBottom: 20}}>
          {'05396674299'}
        </Text>

        <Text style={{fontSize: 20, color: '#B7C4CF', paddingBottom: 20}}>
          {storeData !== undefined && storeData.email !== '' ? storeData.email : '' } 
        </Text>
      </View>

      <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
        <Text style={{color: 'white', alignSelf: 'center'}}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 100,
    width: Dimensions.get('screen').width - 20,
    marginTop: 40,
  },
  infoContainer: {
    flexDirection: 'column',
    height: 100,
    width: Dimensions.get('screen').width - 20,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 40,
  },
  logoutBtn: {
    backgroundColor: 'red',
    width: Dimensions.get('screen').width - 15,
    height: 40,
    marginTop: 'auto',
    marginBottom: 0,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default Profile;
