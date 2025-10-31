import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Button, Checkbox } from '@components';
import { useAuth } from '@context/AuthContext';
import { acceptPrivacyPolicy } from '@firebase/authService';
import colors from '@utils/colors';
import styles from './PrivacyPolicy.style';
import remoteConfig from '@react-native-firebase/remote-config';

const PrivacyPolicy = () => {
  const { userDetails, refreshUserDetails } = useAuth();
  const [pdfUrl, setPdfUrl] = useState('');
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        await remoteConfig().setDefaults({
          PRIVACY_POLICY_URL: '',
        });
        console.log('Default values set.');
        await remoteConfig().fetchAndActivate();
        const url = remoteConfig().getValue('PRIVACY_POLICY_URL').asString();
        setPdfUrl(url);
      } catch (error) {
        console.error('Error fetching remote config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleAccept = async () => {
    if (!userDetails?.id) return;
    await acceptPrivacyPolicy(userDetails.id);
    refreshUserDetails();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.webviewContainer}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
        <WebView
          source={{
            uri: pdfUrl,
          }}
          onLoadEnd={() => setLoading(false)}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
        />
      </View>
      <View style={styles.bottomContainer}>
        <Checkbox
          label="Gizlilik sözleşmesini okudum ve onaylıyorum."
          checked={checked}
          onCheckChange={newValue => setChecked(newValue)}
          labelColor={colors.white}
        />
        <Button label="Devam et" disabled={!checked} onPress={handleAccept} />
      </View>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;
