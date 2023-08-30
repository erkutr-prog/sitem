import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {Calendar} from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {
  DateData,
  Direction,
  MarkedDates,
} from 'react-native-calendars/src/types';
import moment from 'moment';
import XDate from 'xdate';
import {getPayment, deletePayment, getApartmentDetailsByApartmentId} from './../../utils/Storage';
import {IApartments, paymentInfo} from '../screens/BlockDetails';
import {colors} from '../assets/colors';
import useTranslation from '../resources/Translation/useTranslation';

type Props = {
  apartmentId: string;
  allData: IApartments;
};

const month = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

const CustomCalendar: NavigationFunctionComponent<Props> = ({
  apartmentId,
  allData,
  componentId,
}) => {
  const [markedDates, setMarkedDates] = useState({});
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');
  const [paymentSpinner, setPaymentSpinner] = useState(false);
  const [LastPaymentInfo, setLastPaymentInfo] = useState<paymentInfo>({
    date: '',
    note: '',
    price: ''
  });
  const [infoSectionVisible, setInfoSectionVisible] = useState(false);
  const [isPriceModalVisible, setPriceModalVisible] = useState(false);
  const currentDate = useRef('');
  
  const { t } = useTranslation();
  const T = t;

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtons: [
          {
            id: 'Payment',
            component: {
              name: 'TopButton',
              passProps: {
                iconName: 'cash-outline',
                currentComponentId: componentId,
                cbFunction: toggleModal,
              },
            },
          },
        ],
      },
    });
    refreshMarkedDates(false)
  }, []);


  const refreshMarkedDates = async (isRefresh: boolean) => {
    var data: IApartments
    if (isRefresh) {
      data = await refreshApartmentData();
    } else {
      data = allData
    }

    var initialSelectedDate = moment().format('YYYY-MM-DD');
    var initialMarkedDates: MarkedDates = {};
    initialMarkedDates[initialSelectedDate] = {
      selected: true,
      color: '#00B0BF',
      textColor: '#FFFFFF',
    };
    for (let i = 0; i < data.LastPayment.length; i++) {
      let paymentDate = 'date' as string;
      let paymentPrice = 'price' as string;
      let paymentNote = 'note' as string;
      let paymentInfo = data.LastPayment[i];
      initialMarkedDates[paymentInfo[paymentDate as keyof typeof paymentInfo]] =
        {
          selected: false,
          dotColor: 'green',
          marked: true,
        };
        let tempPaymentInfo = {
          'price': paymentInfo[paymentPrice as keyof typeof paymentInfo],
          'note': paymentInfo[paymentNote as keyof typeof paymentInfo]
        }
    }
    setMarkedDates(initialMarkedDates);
    currentDate.current = initialSelectedDate;
  }

  const refreshApartmentData = async () => {
    const response = await getApartmentDetailsByApartmentId(allData.id)
    if (response !== undefined) {
      return response[0]
    } 
    return allData
  }

  const onSelectDay = (day: string) => {
    var previousDates: MarkedDates = {...markedDates};
    if(Object.keys(previousDates).includes(currentDate.current) ) {
      if (previousDates[currentDate.current]?.dotColor !== 'green') {
        delete previousDates[currentDate.current]
      } else {
        previousDates[currentDate.current]['selected'] = false;
        previousDates[currentDate.current]['color'] = 'white';
        previousDates[currentDate.current]['textColor'] = 'black';
      }
    }
    previousDates[day] = {
      selected: true,
      marked:
        previousDates[day]?.marked !== undefined && previousDates[day].marked
          ? true
          : undefined,
      dotColor:
        previousDates[day]?.dotColor !== undefined &&
        previousDates[day].dotColor == 'green'
          ? 'green'
          : undefined,
      color: '#00B0BF',
      textColor: '#FFFFFF',
    };
    setMarkedDates(previousDates);
    currentDate.current = day;
  };

  function toggleModal() {
    setPriceModalVisible(!isPriceModalVisible);
  }

  async function savePressed() {
    setPaymentSpinner(true)
    const response = await savePayment()
    if (response == 'success') {
      refreshMarkedDates(true)
      onPressDay(currentDate.current, true)
      console.log("success")
    } else {
      console.log("failure");
    }
    toggleModal();
    setPaymentSpinner(false)
  }

  function savePayment(): Promise<string | void> {
    if (parseInt(price) > 0) {
      getPayment(apartmentId, {
        date:
          currentDate.current != ''
            ? currentDate.current
            : moment().format('YYYY-MM-DD'),
        price: price,
        note: note
      });
      return Promise.resolve('success');
    } else {
      return Promise.reject('fail');
    }
  }

  const renderHeader = (day: XDate | undefined) => {
    return (
      <View>
        <Text
          style={{
            alignSelf: 'center',
            fontWeight: 'bold',
            fontSize: 25,
            color: 'blue',
          }}>
          {day != undefined
            ? month[day.getUTCMonth()] + ' ' + day.getFullYear()
            : null}
        </Text>
      </View>
    );
  };

  const Arrow = (direction: Direction) => {
    return (
      <TouchableOpacity>
        <Ionicons
          name={
            direction[0] == 'l'
              ? 'chevron-back-outline'
              : 'chevron-forward-outline'
          }
          size={30}
          color={'blue'}
        />
      </TouchableOpacity>
    );
  };

  const onPressDay = async (day: string, isRefresh: boolean) => {
    onSelectDay(day);
    var data: IApartments;
    if (isRefresh) {
      data = await refreshApartmentData();
    } else {
      data = allData
    }
    if (Object.keys(markedDates).includes(day)) {
      for (let i=0; i < data.LastPayment.length; i++) {
        if (day == data.LastPayment[i].date) {
          setLastPaymentInfo(data.LastPayment[i]);
          setInfoSectionVisible(true)
          break;
        }
      }
    } else {
      setInfoSectionVisible(false);
      setLastPaymentInfo({date: '', note: '', price: ''})
    }
  }

  const delPayment = async () => {
    const response = await deletePayment(apartmentId, LastPaymentInfo)
          .then(() => refreshMarkedDates(true))
          .then(() => setInfoSectionVisible(false))
  }

  const customAlert = () => {
    Alert.alert(
      'Uyarı',
      'Kaydı silmek istediğinize emin misiniz?',
      [
        {
          text: 'Evet',
          onPress: delPayment
        },
        {
          text: 'Hayır',
          onPress: () => {}
        }
      ]
    )
  }

  return (
    <View style={{flex: 1}}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isPriceModalVisible}
        style={{}}
        onRequestClose={() => {}}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={{marginLeft: 'auto'}} onPress={toggleModal}>
              <Ionicons name='close-outline' size={35} color={colors.TEXT_INPUT}/>
            </TouchableOpacity>
            <View
              style={{flex: 1, alignItems: 'stretch', paddingHorizontal: 0}}>
              <Text style={styles.modalText}>{T("Price")}</Text>
              <TextInput
                style={{
                  height: 40,
                  margin: 12,
                  borderWidth: 1,
                  borderRadius: 12,
                  borderColor: colors.LISTROW_BG,
                }}
                value={price}
                onChangeText={(text) => setPrice(text)}
                keyboardType="numeric"
                placeholder="₺"
              />
              <Text style={styles.modalText}>{T("Description")}</Text>
              <TextInput
                style={{
                  height: 50,
                  margin: 12,
                  borderWidth: 1,
                  borderRadius: 12,
                  borderColor: colors.LISTROW_BG,
                }}
                value={note}
                onChangeText={(text) => setNote(text)}
                keyboardType="default"
                editable
                numberOfLines={4}
                maxLength={40}
                placeholder={T("Add Note")}
              />
            </View>
            <TouchableOpacity style={{alignSelf: 'center', backgroundColor: colors.TEXT_INPUT, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 10}} onPress={savePressed}>
              {paymentSpinner ? 
                <ActivityIndicator size={'small'} color={colors.TEXT_LIGHT}/>
                :
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Text style={{paddingHorizontal: 10}}>{T("Save")}</Text>
                  <Ionicons name='save-outline' size={35} color={'#000'}/>  
                </View>
            }
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Calendar
        onDayPress={day => {
          onPressDay(day.dateString, false)
        }}
        // Handler which gets executed on day long press. Default = undefined
        onDayLongPress={day => {
          console.log('selected day', day);
        }}
        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
        monthFormat={'yyyy MM'}
        // Handler which gets executed when visible month changes in calendar. Default = undefined
        onMonthChange={month => {
          refreshMarkedDates(true)
          setInfoSectionVisible(false);
          console.log('month changed', month);
        }}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          textSectionTitleDisabledColor: '#d9e1e8',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#00adf5',
          selectedDotColor: '#ffffff',
          arrowColor: 'blue',
          disabledArrowColor: '#d9e1e8',
          monthTextColor: 'blue',
          indicatorColor: 'blue',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
        //renderArrow={direction => <Arrow {...direction}/>}
        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
        firstDay={1}
        // Hide day names. Default = false
        hideDayNames={false}
        hideExtraDays={true}
        // Show week numbers to the left. Default = false
        showWeekNumbers={false}
        // Handler which gets executed when press arrow icon left. It receive a callback can go back month
        onPressArrowLeft={subtractMonth => subtractMonth()}
        // Handler which gets executed when press arrow icon right. It receive a callback can go next month
        onPressArrowRight={addMonth => addMonth()}
        // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
        // Replace default month and year title with custom one. the function receive a date as parameter
        renderHeader={date => {
          return renderHeader(date);
        }}
        // Enable the option to swipe between months. Default = false
        enableSwipeMonths={true}
        markedDates={markedDates}
      />
      <View style={{flexDirection: 'row',display: infoSectionVisible ? 'flex' : 'none', margin: 10}}>
        <View style={{height: 50, borderTopRightRadius: 15, borderBottomRightRadius: 15, width: Dimensions.get('screen').width * 0.9, backgroundColor: colors.LISTROW_BG, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingRight: 10 }}>
            <View 
              style={{height: 50, width: 10, backgroundColor: colors.TEXT_GREEN, borderTopRightRadius: 15, borderBottomRightRadius: 15}}
            />
                <Text style={{paddingLeft: 20, fontSize: 15}}>
                  {LastPaymentInfo !== undefined ? LastPaymentInfo.note : null}
                </Text>
                <View style={{marginLeft: 'auto'}}>
                  <Text style={{color: colors.TEXT_GREEN, fontWeight: 'bold'}}>
                    {LastPaymentInfo !== undefined ? LastPaymentInfo.price : null}  {'₺'}
                  </Text>
                </View>
        </View>
        <TouchableOpacity style={{width: Dimensions.get('screen').width * 0.1, alignSelf: 'center'}} onPress={customAlert}>
          <Ionicons name='trash-outline' size={25}/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomCalendar;

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: Dimensions.get('screen').width * 0.75,
    height: Dimensions.get('screen').height * 0.5,
    opacity: 1
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalText: {
    alignSelf: 'center',
    margin: 12,
  },
});
