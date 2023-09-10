import {View, Text, StyleSheet, TextInput, Button, Alert} from 'react-native';
import React, {useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import auth from '@react-native-firebase/auth';
import {useTranslation} from 'react-i18next';

type Props = {};

const Register: NavigationFunctionComponent<Props> = ({componentId}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {t} = useTranslation();
  const T = t;

  async function onRegister() {
    await auth()
      .createUserWithEmailAndPassword(email.toLowerCase(), password)
      .then(() => {
        Alert.alert(T('Başarılı'), T('Kaydınız tamamlandı'));
        Navigation.pop(componentId);
      })
      .catch(error => {
        const msg = error.message;
        Alert.alert('Error', msg);
      });
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.register}
        placeholder={T('Enter your name')}
        placeholderTextColor={'gray'}
        //label='Name'
        value={name}
        onChangeText={text => {
          setName(text);
        }}
      />
      <TextInput
        style={styles.register}
        placeholder={T('Enter your email')}
        placeholderTextColor={'gray'}
        //label='Email'
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.register}
        placeholder={T('Enter your password')}
        placeholderTextColor={'gray'}
        //label='Password'
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />
      <Button title="register" onPress={() => onRegister()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
  },
  button: {
    width: 370,
    marginTop: 10,
  },
  register: {
    height: 40,
    width: '90%',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 0.2,
    borderColor: 'blue',
    margin: 12,
    padding: 10,
  },
  inputContainer: {
    justifyContent: 'space-evenly',
    flexDirection: 'column',
  },
});

export default Register;
