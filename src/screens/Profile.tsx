import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TouchableHighlight
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import useTranslation from '../resources/Translation/useTranslation';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import { colors } from '../assets/colors';
import { setLanguage } from '../features/userPreferenceSlice';
import i18n from '../resources/Translation/I18n';

const data = require('./../../store/data');

type Props = {};

const { width, height } = Dimensions.get('window')

const languageSupport = [
  'Turkish',
  'English'
]

const languageMap: object = {
  'Turkish': 'tr',
  'English': 'en'
}

const Profile: NavigationFunctionComponent<Props> = ({componentId}) => {
  const [storeData, setStoreData] = useState<FirebaseAuthTypes.User>();
  const { t } = useTranslation();
  const T = t;
  const languagePickerRef = useRef<ActionSheetRef>(null);
  const screenState = useSelector((state: RootState) => state.userPreferenceSlice);
  const dispatch = useDispatch<AppDispatch>();

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

  const onChangeLanguage = (value: string) => {
    dispatch(setLanguage(languageMap[value as keyof object]))
    i18n.changeLanguage(languageMap[value as keyof object]);
    languagePickerRef.current?.hide();
  }


  const logout = async () => {
    data.userId = '';
    data.userName = '';
    data.userMail = '';
    data.userPhoto = '';
    data.userPhone = '';
    await auth()
      .signOut()
      .then(() => Navigation.pop(componentId))
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
          {storeData !== undefined && storeData.displayName !== '' ? data.userName : T("User")}
        </Text>

        <Text style={{fontSize: 20, color: 'black', paddingBottom: 20}}>
          {'05396674299'}
        </Text>

        <Text style={{fontSize: 20, color: '#B7C4CF', paddingBottom: 20}}>
          {storeData !== undefined && storeData.email !== '' ? storeData.email : '' } 
        </Text>
      </View>

      <View style={styles.settingsContainer}>
          <TouchableHighlight underlayColor={colors.TEXT_LIGHT} onPress={() => languagePickerRef.current?.show()} style={styles.settingsButtonContainer}>
            <>
              <View style={{flexDirection: 'row'}}>
                <Icon name='flag' color={colors.TEXT_GREEN} size={20} style={{marginRight: 'auto', marginLeft: 8, alignSelf: 'center'}}/>
                <Text style={{fontSize: 18, color: colors.TEXT_DARK, alignSelf: 'center', marginLeft: 8}}>
                  {T('Change Language')}
                </Text>
              </View>
            </>
          </TouchableHighlight>
      </View>

      <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
        <Text style={{color: 'white', alignSelf: 'center'}}>{T("Logout")}</Text>
      </TouchableOpacity>
      <ActionSheet ref={languagePickerRef}>
        <ScrollView style={{height: 200, marginHorizontal: 10}} contentContainerStyle={{alignItems: 'center'}}>
          {
            languageSupport.map((value, index) => (
              <TouchableOpacity onPress={() => onChangeLanguage(value)} key={index.toString()} style={{flexDirection: 'row', width: width, marginHorizontal: 10, marginVertical: 8}}>
                <Text style={{fontSize: 20, fontWeight: '800', marginRight: 'auto', left: 10}}>
                  {value}
                </Text>
                {
                  languageMap[value as keyof object] === screenState.lang
                  ?
                  <Icon name='checkmark-outline' color={colors.TEXT_GREEN} style={{marginLeft: 'auto', marginRight: 10}} size={20} />
                  :
                  null
                }
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </ActionSheet>
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
    marginVertical: 20,
  },
  logoutBtn: {
    backgroundColor: 'red',
    width: Dimensions.get('screen').width - 15,
    height: 40,
    borderRadius: 15,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  settingsContainer: {
    flexDirection: 'column',
    width: Dimensions.get('window').width - 20,
    alignSelf: 'center',
    backgroundColor: colors.TEXT_LIGHT,
    marginVertical: 20,
    borderRadius: 14
  },
  settingsButtonContainer: {
    height: 45,
    width: Dimensions.get('window').width - 20,
    flexDirection: 'row',
    borderRadius: 14
  }
});

export default Profile;
