import React from 'react';
import {View, Text, Button} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './Adoptions.style';
import { useAuth } from '@context/AuthContext';

const Adoptions = () => {
    const {logout} = useAuth();

    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <Text>Home!</Text>
            <Button
                title='Çıkış Yap'
                onPress={logout}
            />
        </SafeAreaView>
    )
}

export default Adoptions;