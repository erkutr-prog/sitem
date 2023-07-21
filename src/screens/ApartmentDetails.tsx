import {
  View,
  Text,
  TouchableHighlight,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomTextInput from '../components/CustomTextInput';
import InputTypes from '../enums/InputTypes';
import InputPlaceHolder from '../enums/InputPlaceholders';
import {useApartment} from '../hooks/useApartment';
import {IApartments, paymentInfo} from './BlockDetails';
import {colors} from '../assets/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';

type Props = {
  apartmentId: string;
  allData: IApartments;
};

const {width, height} = Dimensions.get('window');

const ApartmentDetails: NavigationFunctionComponent<Props> = ({
  componentId,
  apartmentId,
  allData,
}) => {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [mail, setMail] = useState<string>('');
  const [lastPayment, setLastPayment] = useState<paymentInfo[]>();

  const {apartmentData, error, loading} = useApartment(allData?.id);
  const {Name, Phone, Email, LastPayment} = apartmentData;

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

  const getName = () => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.labelText}>Name</Text>
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
        <Text style={styles.labelText}>Phone Number</Text>
        <CustomTextInput
          onChangeText={text => setPhone(text)}
          initialText={phone}
          InputType={InputTypes.PhoneNumber}
          placeholder={InputPlaceHolder.Phone}
        />
      </View>
    );
  };

  const getMail = () => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.labelText}>E-mail</Text>
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
    return (
      <TouchableHighlight
        onPress={() => navigateToCalendar()}
        style={styles.paymentContainer}
        underlayColor={colors.TEXT_LIGHT}>
        <>
          <Text style={styles.paymentText}>
            {Name + ' has ' + lastPayment?.length.toString() + ' payments.'}
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

  return (
    <View style={styles.container}>
      {error ? (
        <>
          <View
            style={[
              styles.container,
              {justifyContent: 'center', alignItems: 'center'},
            ]}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>{error}</Text>
          </View>
        </>
      ) : loading ? (
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
});

export default ApartmentDetails;
