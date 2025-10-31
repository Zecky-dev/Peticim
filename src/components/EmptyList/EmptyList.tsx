import React from 'react';
import {View, Text} from 'react-native'
import styles from './EmptyList.style';

type EmptyListProps = {
    label: string;
    image: React.ReactNode;
    button?: React.ReactNode;
}

const EmptyList = ({label, image, button}: EmptyListProps) => {
    return (
        <View style={styles.container}>
            {image}
            <Text style={styles.emptyText}>{label}</Text>
            {button && <View style={{ marginTop: 20 }}>{button}</View>}
        </View>
    )
}

export default EmptyList;