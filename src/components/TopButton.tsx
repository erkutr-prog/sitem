import React from 'react';
import {TouchableOpacity, View, Alert} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';



type Props = {
  iconName: string;
  currentComponentId: string;
  cbFunction: Function
};

const TopButton: NavigationFunctionComponent<Props> = ({
  componentId,
  iconName,
  currentComponentId,
  cbFunction
}) => {
  function navigateToAdd() {
    if(iconName == 'person') {
      Navigation.push(currentComponentId, {
        component: {
          name: 'Profile'
        },
      });
    }
  }

  async function callBackFunction(ucret: string | undefined) {
    if (ucret != undefined) {
      const response = await cbFunction(ucret)
      if (response == 'success') {
        Alert.alert(
          'Başarılı',
          'Ödeme Kaydedildi'
        )
      } else {
        Alert.alert(
          'Hata',
          'Ücreti kontrol ediniz'
        )
      }
    }
  }

  return (
    <TouchableOpacity
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      onPress={() => navigateToAdd()}>
      <Ionicons name={iconName} size={30} style={{color: '#000000'}} />
    </TouchableOpacity>
  );
};

export default TopButton;
