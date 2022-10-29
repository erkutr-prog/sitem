import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, View, TouchableOpacity, StyleSheet, Text, ActivityIndicator} from 'react-native';
import {NavigationFunctionComponent, Navigation} from 'react-native-navigation';
import { colors } from '../assets/colors';
import { useDispatch, useSelector, Provider as ReduxProvider } from 'react-redux';
import { AppDispatch, RootState} from './store';
import { fetchApartments } from '../features/apartmentSlice';
import store from './store'

type Props = {
  blockId: string;
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

const ApartmentList: NavigationFunctionComponent<Props> = ({
  componentId,
  blockId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const screenState = useSelector((state: RootState) => state.apartmentList);
  const [dataList, setDataList] = useState<IApartments[]>([]);
  const [isLoading, setLoading] = useState(true);

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


  const Item = ({data, index}: {data: IApartments, index: number}) => (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.5}
      onPress={() => navigateToCalendar(data.docId, data)}>
      <Text style={styles.textName}>{'Daire ' + (index + 1).toString()}</Text>
      <Text style={styles.textNumber}>
        {data.Name}
      </Text>
    </TouchableOpacity>
  )


  return (
    <View style={styles.container}>
      {screenState.loading ? 
        <ActivityIndicator style={{alignSelf: 'center'}} size={'large'}/>  
        :
        <FlatList
        data={screenState.apartments}
        renderItem={({item, index}) => <Item data={item} index={index}/>}
        keyExtractor={(item: IApartments) => item.id}
       />
      }
    </View>
  )
};

const BlockDetails: NavigationFunctionComponent<Props> = ({
  componentId,
  blockId
}) => {
  return (
    <ReduxProvider store={store}>
        <ApartmentList componentId={componentId} blockId={blockId}/>
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
