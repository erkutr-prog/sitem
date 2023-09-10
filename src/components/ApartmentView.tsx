import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import React from 'react';
import {IApartments} from '../screens/BlockDetails';
import {colors} from '../assets/colors';
import { useTranslation } from 'react-i18next';

type Props = {
  data: IApartments;
  index: number;
  onPress: (docId: string, _allData: IApartments) => void;
};

const {width, height} = Dimensions.get('window');

const ApartmentView = ({data, index, onPress}: Props) => {
  const { t } = useTranslation()
  const T = t;
  return (
    <TouchableHighlight
      underlayColor={colors.TEXT_INPUT}
      onPress={() => onPress(data.docId, data)}
      style={styles.container}>
      <>
        <Text style={{marginRight: 'auto', marginLeft: 20}}>
          {data.Name ? data.Name : T("Apartment") + ' ' + (index + 1).toString()}
        </Text>
      </>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: width - 20,
    height: 75,
    backgroundColor: colors.TEXT_GREEN,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 'auto',
    marginRight: 15,
  },
});

export default ApartmentView;
