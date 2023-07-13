import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {colors} from '../assets/colors';
import auth from '@react-native-firebase/auth';

import {addBlocks} from './../../utils/Storage';


const AddBlock: NavigationFunctionComponent = ({
  componentId,
}) => {
  const userId = auth().currentUser?.uid
  const [newBlock, setNewBlock] = useState({
    id: userId != undefined ? userId : '',
    name: '',
    numofrooms: '',
    price: '',
    userId: userId !== undefined ? userId : ''
  });

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: 'Blok Ekle',
        },
      },
    });
  });

  async function onAdd() {
    await addBlocks(newBlock.id, newBlock);
    Navigation.pop(componentId);
  }

  return (
    <SafeAreaView
      style={styles.container}>
      <View
        style={styles.blockNameContainer}>
        <Text
          style={styles.blockNameHeader}>
          Blok İsmi:
        </Text>
        <TextInput
          onChangeText={text => {
            setNewBlock(prevState => {
              return {
                ...prevState,
                name: text,
              };
            });
          }}
          style={styles.blockNameInput}
        />
      </View>
      <View
        style={styles.roomNumberContainer}>
        <Text
          style={styles.roomNumberHeader}>
          Daire Sayısı:
        </Text>
        <TextInput
          onChangeText={number => {
            setNewBlock(prevState => {
              return {
                ...prevState,
                numofrooms: number,
              };
            });
          }}
          keyboardType="numeric"
          style={styles.roomNumberInput}
        />
      </View>
      <View
        style={styles.priceContainer}>
        <Text
          style={styles.priceHeader}>
          Aidat Ücreti:
        </Text>
        <TextInput
          onChangeText={number => {
            setNewBlock(prevState => {
              return {
                ...prevState,
                price: number,
              };
            });
          }}
          keyboardType="numeric"
          style={styles.priceInput}
        />
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onAdd()}
        style={styles.saveBtn}>
        <Text style={{alignSelf: 'center', color: colors.TEXT_INPUT}}>
          Kaydet
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.TEXT_LIGHT,
  },
  blockNameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  blockNameInput: {
    width: (Dimensions.get('screen').width * 2) / 3,
    height: 40,
    borderWidth: 1,
    margin: 12,
    padding: 10,
    borderRadius: 10,
    borderColor: colors.TEXT_INPUT,
  },
  blockNameHeader: {
    color: colors.TEXT_DARK,
    marginRight: 'auto',
    width: Dimensions.get('screen').width / 3,
  },
  roomNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  roomNumberHeader: {
    color: colors.TEXT_DARK,
    marginRight: 'auto',
    width: Dimensions.get('screen').width / 3,
  },
  roomNumberInput: {
    width: (Dimensions.get('screen').width * 2) / 3,
    height: 40,
    borderWidth: 1,
    margin: 12,
    padding: 10,
    borderRadius: 10,
    borderColor: colors.TEXT_INPUT,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  priceHeader: {
    color: colors.TEXT_DARK,
    marginRight: 'auto',
    width: Dimensions.get('screen').width / 3,
  },
  priceInput: {
    width: (Dimensions.get('screen').width * 2) / 3,
    height: 40,
    borderWidth: 1,
    margin: 12,
    padding: 10,
    borderRadius: 10,
    borderColor: colors.TEXT_INPUT,
  },
  saveBtn: {
    height: 40,
    marginHorizontal: 10,
    backgroundColor: colors.TEXT_GREEN,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default AddBlock;
