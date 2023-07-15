import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, View, TouchableOpacity, StyleSheet, Text, ActivityIndicator, Dimensions} from 'react-native';
import {NavigationFunctionComponent, Navigation} from 'react-native-navigation';
import { colors } from '../assets/colors';
import { useDispatch, useSelector, Provider as ReduxProvider } from 'react-redux';
import { AppDispatch, RootState} from './store';
import { fetchApartments } from '../features/apartmentSlice';
import store from './store'
import ApartmentView from '../components/ApartmentView';
import { addApartment, changeStringField } from '../../utils/Storage';

type Props = {
  blockId: string;
  numofrooms: string;
};

export interface IApartments {
  'docId': string,
  'id': string,
  'E-mail': string,
  'Name': string,
  'Phone': string,
  'LastPayment': Array<paymentInfo>,
  'blockId': string
}

export type paymentInfo = {
  date: string,
  price: string,
  note: string
}

const {width, height} = Dimensions.get('window')

const ApartmentList: NavigationFunctionComponent<Props> = ({
  componentId,
  blockId,
  numofrooms
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const screenState = useSelector((state: RootState) => state.apartmentList);

  //Block List Screen event listener
  useEffect(() => {
    const listener = {
      componentDidAppear: () => {
        dispatch(fetchApartments({blockId}))
      },
    };
    const unsubscribe = Navigation.events().registerComponentListener(
      listener,
      componentId,
    );
    return () => {
      unsubscribe.remove();
    };
  }, []);

  const navigateToCalendar = (docId: string, _allData: IApartments) => {
    Navigation.push(componentId, {
      component: {
        name: 'CustomCalendar',
        passProps: {
          apartmentId: docId,
          allData: _allData
        }
      }
    })
  }

const FooterComponent = () => {
  return (
    <TouchableOpacity
      onPress={() => {
        addApartment(blockId)
        changeStringField(blockId, 'blocks', 'numofrooms', (parseInt(numofrooms) + 1).toString())
        dispatch(fetchApartments({blockId}))
      }}
      style={{
        width: width - 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 5,
        borderColor: colors.TEXT_INPUT,
        alignSelf: 'center',
        height: 55,
        marginTop: 10,
      }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '500',
        }}>
        Add New
      </Text>
    </TouchableOpacity>
  );
};

  return (
    <View style={styles.container}>
      {screenState.loading ? 
        <ActivityIndicator style={{alignSelf: 'center'}} size={'large'}/>  
        :
        <FlatList
        data={screenState.apartments}
        renderItem={({item, index}) => <ApartmentView onPress={(docId, _allData) => navigateToCalendar(docId,_allData)} data={item} index={index}/>}
        keyExtractor={(item: IApartments) => item.id}
        ListFooterComponent={FooterComponent}
       />
      }
    </View>
  )
};

const BlockDetails: NavigationFunctionComponent<Props> = ({
  componentId,
  blockId,
  numofrooms
}) => {
  return (
    <ReduxProvider store={store}>
        <ApartmentList componentId={componentId} blockId={blockId} numofrooms={numofrooms}/>
    </ReduxProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.LISTROW_BG,
    padding: 10,
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  textNumber: {
    color: colors.TEXT_DARK,
    marginLeft: 'auto',
    alignSelf: 'center',
  },
  textName: {
    fontSize: 20,
    marginLeft: 10,
    color: colors.TEXT_DARK,
  },
});

export default BlockDetails;
