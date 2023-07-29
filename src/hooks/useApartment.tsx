
import {useEffect, useState} from 'react';
import {getApartmentDetailsByApartmentId} from '../../utils/Storage';
import {IApartments} from '../screens/BlockDetails';

export const useApartment = (id: string) => {
  const [apartmentData, setApartmentData] = useState<IApartments>({
    Name: '',
    Email: '',
    LastPayment: [],
    Phone: '',
    blockId: '',
    docId: '',
    id: '',
  });
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getApartmentDetails(id: string) {
      const response = await getApartmentDetailsByApartmentId(id);
      if (response !== undefined) {
        setApartmentData(response[0]);
      } else {
        setError('Error while fetchin apartment data.');
      }
      setLoading(false);
    }

    getApartmentDetails(id);
  }, []);

  return {apartmentData, error, loading};
};
