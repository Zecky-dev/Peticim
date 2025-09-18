import React from 'react';
import {View, Text} from 'react-native'
import styles from './EmptyList.style';

type EmptyListProps = {
    label: string;
    image: React.ReactNode;
}

const EmptyList = ({label, image}: EmptyListProps) => {
    return (
        <View style={styles.container}>
            {image}
            <Text style={styles.emptyText}>{label}</Text>
        </View>
    )
}

export default EmptyList;