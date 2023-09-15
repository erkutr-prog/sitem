import {Navigation} from 'react-native-navigation';
import React from 'react';
import AppWrapper from './App';
import TopButton from './src/components/TopButton';
import AddBlock from './src/screens/AddBlock';
import BlockDetails from './src/screens/BlockDetails';
import CustomCalendar from './src/components/CustomCalendar';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Profile from './src/screens/Profile';
import ApartmentDetails from './src/screens/ApartmentDetails';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import { persistor, store } from './src/screens/store';

Navigation.registerComponent(
  'com.myApp.WelcomeScreen',
  () => (props) =>
    (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AppWrapper {...props} />
        </PersistGate>
      </Provider>
    ),
  () => AppWrapper,
);
Navigation.registerComponent(
  'TopButton',
  () => (props) =>
    (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <TopButton {...props} />
        </PersistGate>
      </Provider>
    ),
  () => TopButton,
);
Navigation.registerComponent(
  'AddBlock',
  () => (props) =>
    (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AddBlock {...props} />
        </PersistGate>
      </Provider>
    ),
  () => AddBlock,
);
Navigation.registerComponent(
  'BlockDetails',
  () => (props) =>
    (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <BlockDetails {...props} />
        </PersistGate>
      </Provider>
    ),
  () => BlockDetails,
);
Navigation.registerComponent(
  'CustomCalendar',
  () => (props) =>
    (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <CustomCalendar {...props} />
        </PersistGate>
      </Provider>
    ),
  () => CustomCalendar,
);
Navigation.registerComponent(
  'Login',
  () => (props) =>
    (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Login {...props} />
        </PersistGate>
      </Provider>
    ),
  () => Login,
);
Navigation.registerComponent(
  'Register',
  () => (props) =>
    (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Register {...props} />
        </PersistGate>
      </Provider>
    ),
  () => Register,
);
Navigation.registerComponent(
  'Profile',
  () => (props) =>
    (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Profile {...props} />
        </PersistGate>
      </Provider>
    ),
  () => Profile,
);
Navigation.registerComponent(
  'ApartmentDetails',
  () => (props) =>
    (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ApartmentDetails {...props} />
        </PersistGate>
      </Provider>
    ),
  () => ApartmentDetails,
);
/* Navigation.registerComponent('TopButton', () => TopButton);
Navigation.registerComponent('AddBlock', () => AddBlock);
Navigation.registerComponent('BlockDetails', () => BlockDetails);
Navigation.registerComponent('CustomCalendar', () => CustomCalendar);
Navigation.registerComponent('Login', () => Login);
Navigation.registerComponent('Register', () => Register);
Navigation.registerComponent('Profile', () => Profile);
Navigation.registerComponent('ApartmentDetails', () => ApartmentDetails); */

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'com.myApp.WelcomeScreen',
            },
          },
        ],
      },
    },
  });
});
