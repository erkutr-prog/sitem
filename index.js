import { Navigation } from "react-native-navigation";

import App from "./App";
import TopButton from "./src/components/TopButton";
import AddBlock from "./src/screens/AddBlock";
import BlockDetails from "./src/screens/BlockDetails";
import CustomCalendar from "./src/components/CustomCalendar";
import Login from "./src/screens/Login";
import Register from "./src/screens/Register";


Navigation.registerComponent('com.myApp.WelcomeScreen', () => App);
Navigation.registerComponent('TopButton', () => TopButton);
Navigation.registerComponent('AddBlock', () => AddBlock);
Navigation.registerComponent('BlockDetails', () => BlockDetails);
Navigation.registerComponent('CustomCalendar', () => CustomCalendar);
Navigation.registerComponent('Login', () => Login)
Navigation.registerComponent('Register', () => Register);
Navigation.events().registerAppLaunchedListener(() => {
   Navigation.setRoot({
     root: {
       stack: {
         children: [
           {
             component: {
               name: 'com.myApp.WelcomeScreen'
             }
           }
         ]
       }
     }
  });
});