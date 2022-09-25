import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth'
import { colors } from '../assets/colors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation'

type Props = {
    loginCallback: Function
}

const data = require('./../../store/data')

const Login: NavigationFunctionComponent<Props> = ({loginCallback, componentId}) => {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');

    async function onLogin() {
        await auth().signInWithEmailAndPassword(mail.toLowerCase(), password)
            .then((user) => {
                console.log("**********user", user)
                loginCallback(user);
            })
            .catch((error) => {
                Alert.alert('Hata', JSON.stringify(error));
            })
    }


  return (
    <View style= {styles.container}>
    <View style={{flex: 1, backgroundColor: colors.LISTROW_BG, justifyContent: 'center', paddingBottom: 70 }}>
        <Icon style={{alignSelf: 'center'}} name='apartment' size={150} />
        <TextInput style={styles.input} placeholder="E-mail"  onChangeText={text => setMail(text)}></TextInput>
        <TextInput style={styles.input} secureTextEntry placeholder="Password"  onChangeText={text => setPassword(text)}></TextInput>
        <TouchableOpacity style={styles.btn} onPress={() => onLogin()}>
            <Text>Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => Navigation.push(componentId, {
            component: {
                name: 'Register',
                passProps: {}
            }
        })}>
            <Text>Kayıt Ol</Text>
        </TouchableOpacity>
    </View>
</View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.LISTROW_BG,
    },
    input: {
        backgroundColor: '#fff',
        height: 40,
        width: '90%',
        margin: 12,
        borderWidth: 0.2,
        padding: 10,
        alignSelf: 'flex-start',
        borderRadius: 5
    },
    iconStyle: {
        width:150, 
        height: 150, 
        alignSelf: 'center', 
        marginTop: 50, 
        marginBottom: 20
    },
    btn: {
        backgroundColor: colors.LISTROW_BG,
        height: 40,
        width: '90%',
        margin: 12,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    img: {
        alignSelf: 'center',
    },
    imgContainer: {
        flex: 0.3,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Login