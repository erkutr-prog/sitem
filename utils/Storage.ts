import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import { IApartments } from '../src/screens/BlockDetails';
import {
  DateData,
  Direction,
  MarkedDates,
} from 'react-native-calendars/src/types';

import {IBlocks} from '../src/screens/Main';

const user = auth().currentUser

const getBlocks = () => {
  return firestore()
    .collection('blocks')
    .where('id' ,'==', user?.uid)
    .get()
    .then(collectionSnapshot => {
      const blockList: Array<IBlocks> = [];
      collectionSnapshot.forEach(documentSnapshot => {
        const data = documentSnapshot.data();
        blockList.push({
          id: data.id,
          name: data.name,
          numofrooms: data.numofrooms,
          price: data.price,
        });
      });
      return blockList;
    });
};

const addBlocks = (blockId: string, block: IBlocks) => {
  firestore()
    .collection('blocks')
    .doc(blockId)
    .set(block)
    .then(() => console.log('added'))
    .catch(e => {
      console.log('******error', e);
    });

    const numberOfApartments = parseInt(block.numofrooms);

    for (let i=0; i < numberOfApartments; i++) {
      const apartmentuuid = 'id' + new Date().getTime();
      firestore()
        .collection('apartments')
        .doc()
        .set({
          'id': apartmentuuid,
          'Name': '',
          'Phone': '',
          'E-mail': '',
          'LastPayment': [],
          'blockId': blockId
        })
        .then(() => console.log("added apartment"))
        .catch(e => {
          Alert.alert('An error occured on server...');
        })
    }
};

const getApartments = (blockId: string) => {
  return firestore()
    .collection('apartments')
    .where('blockId', '==', blockId)
    .get()
    .then(collectionSnapshot => {
      const apartmentList: Array<IApartments> = [];
      collectionSnapshot.forEach(documentSnapshot => {
        const data = documentSnapshot.data();
        apartmentList.push({
          'docId': documentSnapshot.ref.id,
          'id': data.id,
          'E-mail': data['E-mail'],
          'Name': data['Name'],
          'Phone': data['Phone'],
          'LastPayment': data['LastPayment'],
          'blockId': data['blockId']
        })
      })
      return apartmentList;
    })
}

const getPayment = (apartmentId: string, paymentData: object) => {

    return firestore()
      .collection('apartments')
      .doc(apartmentId)
      .set({LastPayment: firestore.FieldValue.arrayUnion(paymentData)}, {merge: true})
  
}


export {getBlocks, addBlocks, getApartments, getPayment};
