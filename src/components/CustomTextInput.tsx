import {View, Text, TextInput, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import InputTypes from '../enums/InputTypes';
import InputPlaceHolder from '../enums/InputPlaceholders';

type Props = {
  onChangeText: (text: string) => void;
  initialText: string;
  InputType: InputTypes;
  placeholder?: InputPlaceHolder;
};

const CustomTextInput = ({
  onChangeText,
  initialText,
  InputType,
  placeholder,
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
    <TextInput
      style={styles.input}
      value={initialText !== undefined ? initialText : ''}
      onChangeText={text => handleChangeText(text)}
      keyboardType={InputType}
      autoCapitalize={InputType == InputTypes.Email ? 'none' : undefined}
      placeholder={placeholder ? placeholder : ''}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    height: 40,
    width: '90%',
    margin: 12,
    borderWidth: 0.2,
    padding: 10,
    alignSelf: 'flex-start',
    borderRadius: 5,
  },
});

export default CustomTextInput;
