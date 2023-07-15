import {StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, { useEffect } from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {colors} from './../assets/colors';
import {useDispatch, useSelector} from 'react-redux'
import {AppDispatch, RootState} from './store';
import {fetchBlocks} from './../features/blockSlice';
import BlockView from '../components/BlockView';

type Props = {
  loggedIn: boolean
};

export interface IBlocks {
  id: string;
  name: string;
  numofrooms: string;
  price: string;
  userId: string
}

export interface BlockProps {
  blockId: string;
  numofrooms: string
}

const Main: NavigationFunctionComponent<Props> = ({componentId, loggedIn}) => {
  const dispatch = useDispatch<AppDispatch>()
  const screenState = useSelector((state: RootState) => state.blockList);

  //Uygulama ilk açıldığında login bilgisini parenttan alıp o şekilde veritabanı isteği atıyoruz.
  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtons: [
          {
            id: 'AddButton',
            component: {
              name: 'TopButton',
              passProps: {
                iconName: 'person',
                currentComponentId: componentId,
              },
            },
          },
        ],
      },
    });
    if (loggedIn) {
      dispatch(fetchBlocks())
    }
  }, [loggedIn])

  //Block List Screen event listener
  useEffect(() => {
    const listener = {
      componentDidAppear: () => {
        dispatch(fetchBlocks())
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



  const errorMessage = () => {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <Text style={{alignSelf: 'center'}}>
          Bilgilerinizi çekerken bir hata oluştu.
        </Text>
      </View>
    )
  }

  const navigateToDetails = (id: string, numofrooms: string) => {
    Navigation.push<BlockProps>(componentId, {
      component: {
        name: 'BlockDetails',
        passProps: {
          blockId: id,
          numofrooms: numofrooms
        },
      },
    });
  }

  return (
    <View style={styles.container}>
        {
          screenState.loading && !screenState.error
          ?
          <ActivityIndicator style={{alignSelf: 'center'}} size={'large'} />
          :
          (screenState.error ? 
            errorMessage()
            :
              <FlatList
              data={screenState.blocks}
              renderItem={({item}) => <BlockView data={item} onPress={(id: string, numofrooms: string) => navigateToDetails(id, numofrooms)}/>}
              keyExtractor={(item: IBlocks) => item.id}
            />
            )
        }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default Main;
