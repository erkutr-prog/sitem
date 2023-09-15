import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
    onPress: Function
    iconName?: string,
}

const TopBarBackButton = ({onPress, iconName}: Props) => {
  return (
    <TouchableOpacity onPress={() => onPress()}>
        <Icon name={iconName !== undefined ? iconName : 'chevron-back-outline'} size={25} color={'black'}/>
    </TouchableOpacity>
  )
}

export default TopBarBackButton