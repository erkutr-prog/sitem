import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import InputTypes from '../enums/InputTypes';
import InputPlaceHolder from '../enums/InputPlaceholders';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InputBtnIcons from '../enums/InputBtnIcons';
import {colors} from '../assets/colors';

type Props = {
  onChangeText: (text: string) => void;
  initialText: string;
  InputType: InputTypes;
  placeholder?: InputPlaceHolder;
  inputBtn?: InputBtnIcons;
  inputBtnOnPress?: () => void;
};

const {width, height} = Dimensions.get('window');

const CustomTextInput = ({
  onChangeText,
  initialText,
  InputType,
  placeholder,
  inputBtn,
  inputBtnOnPress,
}: Props) => {
  const handleChangeText = (text: string) => {
    switch (InputType) {
      case InputTypes.Default:
        onChangeText(text);
        break;
      case InputTypes.Email:
        onChangeText(text);
        break;
      case InputTypes.PhoneNumber:
        onChangeText(formatPhoneNumber(text));
        break;
      default:
        break;
    }
  };

  const formatPhoneNumber = (input: string) => {
    const cleanedInput = input.replace(/\D/g, '');

    let formattedNumber = '';
    if (cleanedInput.length >= 1) {
      formattedNumber = `(${cleanedInput.slice(0, 3)}`;
    }
    if (cleanedInput.length >= 4) {
      formattedNumber += `) ${cleanedInput.slice(3, 6)}`;
    }
    if (cleanedInput.length >= 7) {
      formattedNumber += ` ${cleanedInput.slice(6, 8)}`;
    }
    if (cleanedInput.length >= 9) {
      formattedNumber += ` ${cleanedInput.slice(8, 10)}`;
    }

    return formattedNumber;
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, {width: inputBtn ? '80%' : '90%'}]}
        value={initialText !== undefined ? initialText : ''}
        onChangeText={text => handleChangeText(text)}
        keyboardType={InputType}
        autoCapitalize={InputType == InputTypes.Email ? 'none' : undefined}
        placeholder={placeholder ? placeholder : ''}
      />
      {inputBtn && inputBtnOnPress ? (
        <TouchableHighlight
          style={styles.iconContainer}
          underlayColor={colors.TEXT_LIGHT}
          onPress={() => inputBtnOnPress()}>
          <Ionicons name={inputBtn} size={25} color={colors.TEXT_GREEN} />
        </TouchableHighlight>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: width,
    margin: 12,
  },
  input: {
    backgroundColor: '#fff',
    height: 40,
    borderWidth: 0.2,
    padding: 10,
    alignSelf: 'flex-start',
    borderRadius: 5,
  },
  iconContainer: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default CustomTextInput;
