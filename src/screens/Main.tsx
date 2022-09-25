import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {colors} from './../assets/colors';
import {getBlocks} from './../../utils/Storage';

type Props = {
  loggedIn: boolean
};

export interface IBlocks {
  id: string;
  name: string;
  numofrooms: string;
  price: string;
}

export interface BlockProps {
  id: string;
}

const Main: NavigationFunctionComponent<Props> = ({componentId, loggedIn}) => {
  const [dataList, setDataList] = useState<IBlocks[]>([]);

  //Uygulama ilk açıldığında login bilgisini parenttan alıp o şekilde veritabanı isteği atıyoruz.
  useEffect(() => {
    if (loggedIn) {
      fetchBlocks();
    }
  }, [loggedIn])

  //Block List Screen event listener
  useEffect(() => {
    const listener = {
      componentDidAppear: () => {
        fetchBlocks();
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

  //Top buttons of main screen
  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtons: [
          {
            id: 'AddButton',
            component: {
              name: 'TopButton',
              passProps: {
                iconName: 'add',
                currentComponentId: componentId,
              },
            },
          },
        ],
      },
    });
  }, []);


  //Fetching block data from firestore
  const fetchBlocks = useCallback(async () => {
    const blocks = await getBlocks();
    setDataList(blocks);
  }, []);

  function navigateToDetails(id: string) {
    Navigation.push<BlockProps>(componentId, {
      component: {
        name: 'BlockDetails',
        passProps: {
          id: id,
        },
      },
    });
  }

  const Item = ({data}: {data: IBlocks}) => (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.5}
      onPress={() => navigateToDetails(data.id)}>
      <Text style={styles.textName}>{data.name}</Text>
      <Text style={styles.textNumber}>
        {data.numofrooms + ' Daire'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dataList}
        renderItem={({item}) => <Item data={item} />}
        keyExtractor={(item: IBlocks) => item.id}
      />
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
