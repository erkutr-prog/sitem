import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {colors} from '../assets/colors';

import {addBlocks} from './../../utils/Storage';

const data = require('./../../store/data')

const AddBlock: NavigationFunctionComponent = ({
  componentId,
}) => {
  const [newBlock, setNewBlock] = useState({
    id: data.userId,
    name: '',
    numofrooms: '',
    price: '',
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
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.TEXT_LIGHT,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 10,
        }}>
        <Text
          style={{
            color: colors.TEXT_DARK,
            marginRight: 'auto',
            width: Dimensions.get('screen').width / 3,
          }}>
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
          style={{
            width: (Dimensions.get('screen').width * 2) / 3,
            height: 40,
            borderWidth: 1,
            margin: 12,
            padding: 10,
            borderRadius: 10,
            borderColor: colors.TEXT_INPUT,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 10,
        }}>
        <Text
          style={{
            color: colors.TEXT_DARK,
            marginRight: 'auto',
            width: Dimensions.get('screen').width / 3,
          }}>
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
          style={{
            width: (Dimensions.get('screen').width * 2) / 3,
            height: 40,
            borderWidth: 1,
            margin: 12,
            padding: 10,
            borderRadius: 10,
            borderColor: colors.TEXT_INPUT,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 10,
        }}>
        <Text
          style={{
            color: colors.TEXT_DARK,
            marginRight: 'auto',
            width: Dimensions.get('screen').width / 3,
          }}>
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
          style={{
            width: (Dimensions.get('screen').width * 2) / 3,
            height: 40,
            borderWidth: 1,
            margin: 12,
            padding: 10,
            borderRadius: 10,
            borderColor: colors.TEXT_INPUT,
          }}
        />
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onAdd()}
        style={{
          height: 40,
          marginHorizontal: 10,
          backgroundColor: colors.TEXT_GREEN,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{alignSelf: 'center', color: colors.TEXT_INPUT}}>
          Kaydet
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddBlock;
