import {
  View,
  Text,
  Dimensions,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {IBlocks} from '../screens/Main';
import {colors} from '../assets/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

type Props = {
  data: IBlocks;
  onPress: (id: string, numofrooms: string) => void;
};

const {width, height} = Dimensions.get('window');

const BlockView = ({data, onPress}: Props) => {
  const { t } = useTranslation()
  const T = t;
  return (
    <TouchableHighlight
      underlayColor={colors.TEXT_LIGHT}
      onPress={() => onPress(data.id, data.numofrooms)}
      style={styles.container}>
      <>
        <Text style={styles.nameText}>{data.name}</Text>
        <View style={styles.numberText}>
          <Text style={styles.text}>{data.numofrooms + ' ' + T("Apartment")}</Text>
          <Ionicons
            style={styles.text}
            name="chevron-forward-outline"
            size={30}
          />
        </View>
      </>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: width - 20,
    height: 75,
    backgroundColor: colors.LISTROW_BG,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    marginRight: 'auto',
    marginLeft: 15,
    fontSize: 17,
    fontWeight: '500',
    flex: 0.5,
  },
  numberText: {
    flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginLeft: 'auto',
    marginRight: 15,
  },
});

export default BlockView;
