import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Pressable,
} from 'react-native';

import {
  Button,
  EmptyList,
  Icon,
  InformationBox,
  ListingItem,
  Picker,
} from '@components';

import { AD_BANNER_UNIT_ID } from '@env';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

import { useListings } from '@hooks/useListings';
import { useUserDetails } from '@hooks/useUserDetails';
import { useAuth } from '@context/AuthContext';

import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';

import { resetPagination } from '@firebase/listingService';
import { getCities, getDistricts } from '@api/location';

import colors from '@utils/colors';
import styles from './Adoptions.style';
import animalFilters from '../../constants/animalFilters.json';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { isEqual } from '@utils/basicValidations';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : AD_BANNER_UNIT_ID;

const Adoptions = () => {
  const route = useRoute<RouteProp<AdoptionStackParamList, 'Adoptions'>>();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<AdoptionStackParamList, 'Adoptions'>
    >();
  const { user } = useAuth();
  const { userDetails } = useUserDetails(user?.uid || null);

  const [filters, setFilters] = useState<Filter[]>([]);
  const [tempFilters, setTempFilters] = useState<Filter[]>([]);

  const [showFavorites, setShowFavorites] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const scrollOffset = useRef(0);

  const [location, setLocation] = useState<LocationState>({
    cities: [],
    districts: [],
    neighborhoods: [],
    selectedCity: null,
    selectedDistrict: null,
    selectedNeighborhood: null,
  });

  const handleCitySelect = async (city: PickerItem) => {
    const districtsRes = await getDistricts(Number(city.value));
    setTempFilters(prev => {
      const withoutCityAndDistrict = prev.filter(
        f => f.field !== 'address.city' && f.field !== 'address.district',
      );
      return [
        ...withoutCityAndDistrict,
        { field: 'address.city', operator: '==', value: city.label },
      ];
    });

    setLocation(prev => ({
      ...prev,
      selectedCity: city,
      selectedDistrict: null,
      districts: districtsRes.map((d: any) => ({
        label: d.name,
        value: d.id,
      })),
    }));
  };
  const handleDistrictSelect = async (district: PickerItem) => {
    setTempFilters(prev => {
      const withoutDistrict = prev.filter(f => f.field !== 'address.district');
      return [
        ...withoutDistrict,
        { field: 'address.district', operator: '==', value: district.label },
      ];
    });
    setLocation(prev => ({
      ...prev,
      selectedDistrict: district,
    }));
  };

  useEffect(() => {
    const fetchCities = async () => {
      const citiesRes = await getCities();
      setLocation(prev => ({
        ...prev,
        cities: citiesRes.map((c: any) => ({ label: c.name, value: c.id })),
      }));
    };
    fetchCities();
  }, []);

  const { listings, loadInitialListings, loadMoreListings, favoriteListings } =
    useListings(filters, showFavorites);

  const renderItem = ({ item }: { item: any }) => {
    if (item.isAd) {
      return (
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      );
    }
    return (
      <ListingItem
        data={item}
        favorited={userDetails?.favorites?.includes(item.id) || false}
      />
    );
  };

  useEffect(() => {
    loadInitialListings();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.shouldRefresh) {
        loadInitialListings().then(() => {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        });
        navigation.setParams({ shouldRefresh: false });
      } else {
        flatListRef.current?.scrollToOffset({
          offset: scrollOffset.current,
          animated: false,
        });
      }
    }, [route.params?.shouldRefresh]),
  );

  // Filter functions
  const toggleAnimalFilter = (newFilter: Filter) => {
    setTempFilters(prev => {
      const isSelected = prev.some(
        f => f.field === newFilter.field && f.value === newFilter.value,
      );

      if (isSelected) {
        return prev.filter(f => f.field !== 'animalType');
      } else {
        const withoutAnimalFilters = prev.filter(f => f.field !== 'animalType');
        return [...withoutAnimalFilters, newFilter];
      }
    });
  };

  const resetTempFiltersAndCloseModal = () => {
    setTempFilters([]);
    setFilters([]);
    setLocation(prev => ({
      ...prev,
      selectedCity: null,
      selectedDistrict: null,
      districts: [],
    }));
    loadInitialListings([]);
    setFilterModalVisible(false);
  };

  const applyFilters = () => {
    const isDifferent =
      tempFilters.length !== filters.length ||
      tempFilters.some((f, i) => !isEqual(f, filters[i]));

    if (isDifferent) {
      setFilters(tempFilters);
      loadInitialListings(tempFilters);
    }
    setShowFavorites(false);
    setFilterModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <InformationBox />
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { paddingHorizontal: 24, paddingVertical: 10 },
            showFavorites && { backgroundColor: colors.primary },
          ]}
          onPress={() => setShowFavorites(!showFavorites)}
        >
          <Icon
            name="heart"
            type="material-community"
            size={16}
            color={showFavorites ? colors.white : colors.primary}
          />
          <Text
            style={[
              styles.filterButtonText,
              showFavorites && { color: colors.white },
            ]}
          >
            Favoriler
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { paddingHorizontal: 24, paddingVertical: 10 },
          ]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Icon name="filter" type="ion" size={18} color={colors.primary} />
          <Text style={styles.filterButtonText}>Filtrele</Text>
          {filters.length > 0 && (
            <View style={styles.filterCountBadge}>
              <Text style={styles.filterCountBadgeText}>{filters.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        onScroll={e => {
          scrollOffset.current = e.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
        contentContainerStyle={
          listings.length === 0
            ? styles.emptyListingContainer
            : styles.listingsContentContainer
        }
        data={showFavorites ? favoriteListings : listings}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        onEndReachedThreshold={0.5}
        onEndReached={() => loadMoreListings()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshing={isRefreshing}
        onRefresh={() => {
          setIsRefreshing(true);
          resetPagination();
          loadInitialListings(filters).finally(() => setIsRefreshing(false));
        }}
        ListEmptyComponent={() => {
          return (
            <EmptyList
              label="İlan bulunamadı"
              image={
                <LottieView
                  autoPlay={true}
                  loop={true}
                  source={require('@assets/lottie/notFound.json')}
                  style={styles.notFoundAnimation}
                />
              }
            />
          );
        }}
      />

      <Modal
        style={styles.filterModalContainer}
        isVisible={filterModalVisible}
        onBackButtonPress={() => setFilterModalVisible(false)}
        onBackdropPress={() => setFilterModalVisible(false)}
      >
        <View style={styles.filterModalContentContainer}>
          {filters.length > 0 && (
            <Pressable onPress={resetTempFiltersAndCloseModal}>
              <Text style={styles.resetFiltersText}>Filtreleri Sıfırla</Text>
            </Pressable>
          )}

          <View>
            <Text style={styles.filterTitle}>Hayvan Türü</Text>
            <View style={styles.filterButtonsContainer}>
              {Object.entries(animalFilters).map(([key, filter]) => {
                const isSelected = tempFilters.some(
                  f => f.field === filter.field && f.value === filter.value,
                );
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => {
                      toggleAnimalFilter(filter as Filter);
                    }}
                    style={[
                      styles.filterButton,
                      {
                        backgroundColor: isSelected
                          ? colors.primary
                          : 'transparent',
                        borderColor: isSelected
                          ? 'transparent'
                          : colors.primary,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Icon
                      name={
                        key === 'cat'
                          ? 'cat'
                          : key === 'dog'
                          ? 'dog'
                          : key === 'bird'
                          ? 'bird'
                          : key === 'fish'
                          ? 'fish'
                          : 'dots-horizontal'
                      }
                      type="material-community"
                      size={24}
                      color={isSelected ? 'white' : colors.primary}
                    />
                    <Text
                      style={[
                        styles.filterButtonText,
                        { color: isSelected ? 'white' : colors.primary },
                      ]}
                    >
                      {filter.value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <Picker
            items={location.cities}
            label="Şehir"
            value={location.selectedCity?.value || null}
            onSelect={handleCitySelect}
          />

          {location.selectedCity && (
            <Picker
              label="İlçe"
              items={location.districts}
              value={location.selectedDistrict?.value || null}
              onSelect={handleDistrictSelect}
            />
          )}
          <View style={{ marginTop: 6 }}>
            <Button label="Filtre Uygula" onPress={applyFilters} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Adoptions;
