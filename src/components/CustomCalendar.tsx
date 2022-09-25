import {
  ActivityIndicator,
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
import {getPayment} from './../../utils/Storage';
import {IApartments} from '../screens/BlockDetails';
import {colors} from '../assets/colors';

type Props = {
  apartmentId: string;
  allData: IApartments;
};

const CustomCalendar: NavigationFunctionComponent<Props> = ({
  apartmentId,
  allData,
  componentId,
}) => {
  const [markedDates, setMarkedDates] = useState({});
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');
  const [paymentSpinner, setPaymentSpinner] = useState(false);
  const [isPriceModalVisible, setPriceModalVisible] = useState(false);
  const currentDate = useRef('');

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtons: [
          {
            id: 'Payment',
            component: {
              name: 'TopButton',
              passProps: {
                iconName: 'person',
                currentComponentId: componentId,
                cbFunction: toggleModal,
              },
            },
          },
        ],
      },
    });
    var initialSelectedDate = moment().format('YYYY-MM-DD');
    var initialMarkedDates: MarkedDates = {};
    initialMarkedDates[initialSelectedDate] = {
      selected: true,
      color: '#00B0BF',
      textColor: '#FFFFFF',
    };
    for (let i = 0; i < allData.LastPayment.length; i++) {
      let paymentDate = 'date' as string;
      let paymentPrice = 'price' as string;
      let paymentNote = 'note' as string;
      let paymentInfo = allData.LastPayment[i];
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
  }, []);

  const onSelectDay = (day: string) => {
    var previousDates: MarkedDates = {...markedDates};
    if (currentDate.current != '') {
      previousDates[currentDate.current]['selected'] = false;
      previousDates[currentDate.current]['color'] = 'white';
      previousDates[currentDate.current]['textColor'] = 'black';
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
              <Text style={styles.modalText}>Ücret:</Text>
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
              <Text style={styles.modalText}>Açıklama:</Text>
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
                placeholder="Not Ekle"
              />
            </View>
            <TouchableOpacity style={{alignSelf: 'center', backgroundColor: colors.TEXT_INPUT, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 10}} onPress={savePressed}>
              {paymentSpinner ? 
                <ActivityIndicator size={'small'} color={colors.TEXT_LIGHT}/>
                :
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Text style={{paddingHorizontal: 10}}>Kaydet</Text>
                  <Ionicons name='save-outline' size={35} color={'#000'}/>  
                </View>
            }
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Calendar
        onDayPress={day => {
          onSelectDay(day.dateString);
        }}
        // Handler which gets executed on day long press. Default = undefined
        onDayLongPress={day => {
          console.log('selected day', day);
        }}
        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
        monthFormat={'yyyy MM'}
        // Handler which gets executed when visible month changes in calendar. Default = undefined
        onMonthChange={month => {
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
