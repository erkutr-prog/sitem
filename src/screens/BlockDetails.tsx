import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import {NavigationFunctionComponent, Navigation} from 'react-native-navigation';
import {colors} from '../assets/colors';
import {useDispatch, useSelector, Provider as ReduxProvider} from 'react-redux';
import {AppDispatch, RootState} from './store';
import {fetchApartments} from '../features/apartmentSlice';
import store from './store';
import ApartmentView from '../components/ApartmentView';
import {addApartment, changeStringField, deleteApartment} from '../../utils/Storage';
import {SwipeListView} from 'react-native-swipe-list-view';
import Ionicons from 'react-native-vector-icons/Ionicons'
import useTranslation from '../resources/Translation/useTranslation';

type Props = {
  blockId: string;
  numofrooms: string;
};

export interface IApartments {
  docId: string;
  id: string;
  Email: string;
  Name: string;
  Phone: string;
  LastPayment: Array<paymentInfo>;
  blockId: string;
}

export type paymentInfo = {
  date: string;
  price: string;
  note: string;
};

const {width, height} = Dimensions.get('window');

const ApartmentList: NavigationFunctionComponent<Props> = ({
  componentId,
  blockId,
  numofrooms,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const screenState = useSelector((state: RootState) => state.apartmentList);
  const { t } = useTranslation();
  const T = t;

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
        name: 'ApartmentDetails',
        passProps: {
          apartmentId: docId,
          allData: _allData,
        },
      },
    });
  };

  const FooterComponent = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          addApartment(blockId);
          changeStringField(
            blockId,
            'blocks',
            'numofrooms',
            (parseInt(numofrooms) + 1).toString(),
          );
          dispatch(fetchApartments({blockId}));
        }}
        style={styles.addnewContainer}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
          }}>
          {T("Add New")}
        </Text>
      </TouchableOpacity>
    );
  };

  const delApartment = async(id: string) => {
    if (id) {
      await deleteApartment(id).then(() => {
        changeStringField(
          blockId,
          'blocks',
          'numofrooms',
          (parseInt(numofrooms) - 1).toString(),
        );
        dispatch(fetchApartments({blockId}))
      })
    }
  }

  const onDeleteApartment = async(id: string) => {
    Alert.alert(
      'Warning',
      'Daireyi silmek istediğinize emin misiniz?',
      [
        {
          text: 'Yes',
          onPress: () => delApartment(id)
        },
        {
          text: 'No',
          onPress: () => console.log("Cancelled.")
        }
      ]
    )
  }

  const renderHiddenItem = (data: any) => {
    const {
      docId
    } = data.item
    return (
      <View
        style={styles.rowBackContainer}>
        <TouchableOpacity
          onPress={() => onDeleteApartment(docId)}
          style={styles.rowBack}>
          <Ionicons name='trash-outline' size={35} color={colors.LISTROW_BG} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {screenState.loading ? (
        <ActivityIndicator style={{alignSelf: 'center'}} size={'large'} />
      ) : (
        <SwipeListView
          data={screenState.apartments}
          renderItem={({item, index}) => (
            <ApartmentView
              onPress={(docId, _allData) => navigateToCalendar(docId, _allData)}
              data={item}
              index={index}
            />
          )}
          keyExtractor={(item: IApartments) => item.id}
          ListFooterComponent={FooterComponent}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-75}
          previewRowKey='0'
          leftOpenValue={75}
          
        />
      )}
    </View>
  );
};

const BlockDetails: NavigationFunctionComponent<Props> = ({
  componentId,
  blockId,
  numofrooms,
}) => {
  return (
    <ReduxProvider store={store}>
      <ApartmentList
        componentId={componentId}
        blockId={blockId}
        numofrooms={numofrooms}
      />
    </ReduxProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
  rowBackContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowBack: {
    alignItems: 'center',
    bottom: 0,
    position: 'absolute',
    top: 0,
    width: 75,
    justifyContent: 'center',
    right: 15,
  },
  addnewContainer: {
    width: width - 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: colors.TEXT_INPUT,
    alignSelf: 'center',
    height: 55,
    marginTop: 10,
  }
});

export default BlockDetails;
