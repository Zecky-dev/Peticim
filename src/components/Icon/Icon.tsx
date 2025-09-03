import React from 'react';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import OctIcon from 'react-native-vector-icons/Octicons';

export type IconType =
  | 'material'
  | 'material-community'
  | 'fontawesome'
  | 'evil'
  | 'antdesign'
  | 'ion'
  | 'feather'
  | 'oct';

export type IconProps = {
  type?: IconType;
  name: string;
  color?: string;
  size?: number;
};

const Icon = ({
  type = 'material-community',
  name,
  color = 'black',
  size = 16,
}: IconProps) => {
  let IconComponent: React.ComponentType<any>;

  switch (type) {
    case 'fontawesome':
      IconComponent = FontAwesomeIcon;
      break;
    case 'material':
      IconComponent = MaterialIcon;
      break;
    case 'material-community':
      IconComponent = MaterialCommunityIcon;
      break;
    case 'evil':
      IconComponent = EvilIcon;
      break;
    case 'antdesign':
      IconComponent = AntDesign;
      break;
    case 'ion':
      IconComponent = IonIcon;
      break;
    case 'feather':
      IconComponent = FeatherIcon;
    case 'oct':
      IconComponent = OctIcon;
      break;
    default:
      IconComponent = MaterialCommunityIcon;
  }

  return <IconComponent name={name} color={color} size={size} />;
};

export default Icon;
