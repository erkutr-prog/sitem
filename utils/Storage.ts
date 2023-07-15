import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import { IApartments, paymentInfo } from '../src/screens/BlockDetails';
import "react-native-get-random-values"
import { v4 as uuid } from 'uuid'

import {IBlocks} from '../src/screens/Main';

const user = auth().currentUser

const getBlocks = () => {
  return firestore()
    .collection('blocks')
    .where('userId' ,'==', user?.uid)
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
          userId: data.userId
        });
      });
      return blockList;
    });
};

const addBlocks = (blockId: string, block: IBlocks) => {
  const uniqueBlockId = blockId + uuid()
  block.id = uniqueBlockId
  block.userId = blockId
  firestore()
    .collection('blocks')
    .doc(uniqueBlockId)
    .set(block)
    .then(() => console.log('added'))
    .catch(e => {
      console.log('******error', e);
    });

    const numberOfApartments = parseInt(block.numofrooms);

    for (let i=0; i < numberOfApartments; i++) {
      const apartmentuuid = 'id' + uuid();
      firestore()
        .collection('apartments')
        .doc()
        .set({
          'id': apartmentuuid,
          'Name': '',
          'Phone': '',
          'E-mail': '',
          'LastPayment': [],
          'blockId': uniqueBlockId,
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
const addApartment = (blockId: string) => {
  const apartmentuuid = 'id' + uuid();
  firestore()
    .collection('apartments')
    .doc()
    .set({
      id: apartmentuuid,
      Name: '',
      Phone: '',
      'E-mail': '',
      LastPayment: '',
      blockId: blockId,
    })
    .then(() => console.log('added apartment'))
    .catch(e => {
      console.log('Error when adding apartment.');
    });
};

const changeStringField = (
  docId: string,
  collection: string,
  field: string,
  data: string,
) => {
  return firestore()
    .collection(collection)
    .doc(docId)
    .set({
      [field]: data,
    }, {merge: true});
};

const getPayment = (apartmentId: string, paymentData: object) => {

    return firestore()
      .collection('apartments')
      .doc(apartmentId)
      .set({LastPayment: firestore.FieldValue.arrayUnion(paymentData)}, {merge: true})
  
}

const deletePayment = (apartmentId: string, paymentData: paymentInfo) => {
  return firestore()
    .collection('apartments')
    .doc(apartmentId)
    .update({LastPayment: firestore.FieldValue.arrayRemove(paymentData)})
} 

const getApartmentDetailsByApartmentId = (apartmentId: string) => {
  return firestore()
  .collection('apartments')
  .where('id', '==', apartmentId)
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


export {
  getBlocks,
  addBlocks,
  getApartments,
  getPayment,
  deletePayment,
  getApartmentDetailsByApartmentId,
  addApartment,
  changeStringField
};
