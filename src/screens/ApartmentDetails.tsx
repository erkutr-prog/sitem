import {
  View,
  Text,
  TouchableHighlight,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CustomTextInput from '../components/CustomTextInput';
import InputTypes from '../enums/InputTypes';
import InputPlaceHolder from '../enums/InputPlaceholders';
import {IApartments, paymentInfo} from './BlockDetails';
import {colors} from '../assets/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import { updateApartmentInfo } from '../../utils/Storage';
import InputBtnIcons from '../enums/InputBtnIcons';
import useTranslation from '../resources/Translation/useTranslation';
import i18n from '../resources/Translation/I18n';

type Props = {
  apartmentId: string;
  allData: IApartments;
};

export type PersonalInfo = {
  name: string,
  phone: string,
  mail: string
}

const {width, height} = Dimensions.get('window');

const ApartmentDetails: NavigationFunctionComponent<Props> = ({
  componentId,
  apartmentId,
  allData,
}) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [mail, setMail] = useState<string>('');
  const [lastPayment, setLastPayment] = useState<paymentInfo[]>();
  const [saveBtnDisabled, setSaveBtnDisabled] = useState<boolean>(true);

  const {Name, Phone, Email, LastPayment} = allData;
  const [currentData, setCurrentData] = useState(allData);
  
  const { t } = useTranslation();
  const T = t;

  useEffect(() => {
    setName(Name);
    setPhone(Phone);
    setMail(Email);
    setLastPayment(LastPayment);
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: Name,
        },
      },
    });
  }, [Name, Phone, Email, LastPayment]);

  // Catching the changes in personal information states.
  // Also catches the save process done.
  useEffect(() => {
    checkForChanges()
  }, [name, phone, mail, currentData])

  // Checks if user has changed the personal information realtime
  const checkForChanges = () => {
    const {
      Name,
      Phone,
      Email
    } = currentData
    if (name !== Name || phone !== Phone || mail !== Email) {
      setSaveBtnDisabled(false)
    } else {
      setSaveBtnDisabled(true)
    }
  }

  const getName = () => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.labelText}>{T("Name")}</Text>
        <CustomTextInput
          onChangeText={text => setName(text)}
          initialText={name}
          InputType={InputTypes.Default}
          placeholder={InputPlaceHolder.Name}
        />
      </View>
    );
  };

  const getPhone = () => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.labelText}>{T("Phone Number")}</Text>
        <CustomTextInput
          onChangeText={text => setPhone(text)}
          initialText={phone}
          InputType={InputTypes.PhoneNumber}
          placeholder={InputPlaceHolder.Phone}
          inputBtn={InputBtnIcons.tel}
          inputBtnOnPress={() => {
            const phoneNumber = Platform.OS == 'android' ? `tel:${phone}` : `tel://${phone}` 
            Linking.canOpenURL(phoneNumber)
            .then(supported => {
              if (!supported) {
                Alert.alert('Phone number is not available');
              } else {
                return Linking.openURL((phoneNumber));
              }})
          }}
        />
      </View>
    );
  };

  const getMail = () => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.labelText}>{T("E-mail")}</Text>
        <CustomTextInput
          onChangeText={text => setMail(text)}
          initialText={mail}
          InputType={InputTypes.Email}
          placeholder={InputPlaceHolder.Email}
        />
      </View>
    );
  };

  const navigateToCalendar = () => {
    Navigation.push(componentId, {
      component: {
        name: 'CustomCalendar',
        passProps: {
          apartmentId: apartmentId,
          allData: allData,
        },
      },
    });
  };

  const getLastPayment = () => {
    const lang = i18n.language;
    return (
      <TouchableHighlight
        onPress={() => navigateToCalendar()}
        style={styles.paymentContainer}
        underlayColor={colors.TEXT_LIGHT}>
        <>
          <Text style={styles.paymentText}>
            {
              lang === "en" 
              ?
              
              Name + ' has ' + lastPayment?.length.toString() + ' payments.'

              :

              Name + ' ' + lastPayment?.length.toString() + ' ödemesi var.'
            }
          </Text>
          <Icon
            name="chevron-forward-outline"
            size={25}
            style={{marginLeft: 'auto', marginRight: 10}}
          />
        </>
      </TouchableHighlight>
    );
  };

  const saveChanges = async() => {
    setLoading(true)
    const personalInfo: PersonalInfo = {
      name: name,
      phone: phone,
      mail: mail
    }
    await updateApartmentInfo(apartmentId, personalInfo)
          .then(() => {
            setCurrentData((prevState) => {
              const newState = {...prevState}
              newState.Name = name;
              newState.Phone = phone;
              newState.Email = mail
              return newState
            })
          })
    setLoading(false)
  }

  const getSaveBtn = () => {
    return (
      <TouchableHighlight
        style={[styles.saveBtn, {display: saveBtnDisabled ? 'none' : 'flex'}]}
        onPress={() => saveChanges()}
        disabled={saveBtnDisabled}
        underlayColor={!saveBtnDisabled ? colors.TEXT_LIGHT : '#FFFF'}>
        <>
          <Text>{T("Save the changes")}</Text>
        </>
      </TouchableHighlight>
    );
  };


  return (
    <View style={styles.container}>
      {isLoading ? (
        <>
          <View
            style={[
              styles.container,
              {justifyContent: 'center', alignItems: 'center'},
            ]}>
            <ActivityIndicator style={{alignSelf: 'center'}} />
          </View>
        </>
      ) : (
        <>
          {getName()}
          {getPhone()}
          {getMail()}
          {getLastPayment()}
          {getSaveBtn()}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionContainer: {
    flexDirection: 'column',
  },
  labelText: {
    fontWeight: '500',
    fontSize: 13,
    marginLeft: 12,
  },
  paymentContainer: {
    flexDirection: 'row',
    backgroundColor: colors.TEXT_GREEN,
    borderRadius: 12,
    height: 50,
    width: width - 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  paymentText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 'auto',
    marginLeft: 10,
  },
  saveBtn: {
    height: 60,
    width: width - 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.TEXT_GREEN,
    borderRadius: 14,
    bottom: 70,
    position: 'absolute'
  }
});

export default ApartmentDetails;
