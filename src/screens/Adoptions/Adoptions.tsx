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

import { useListings } from '@hooks/useListings';
import { useAuth } from '@context/AuthContext';

import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import { getCities, getDistricts } from '@api/location';

import colors from '@utils/colors';
import styles from './Adoptions.style';
import animalFilters from '../../constants/animalFilters.json';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { isEqual } from '@utils/basicValidations';
import { LocationState, PickerItem, Filter } from 'types/global';

const Adoptions = () => {
  const route = useRoute<RouteProp<AdoptionStackParamList, 'Adoptions'>>();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<AdoptionStackParamList, 'Adoptions'>
    >();
  const { userDetails } = useAuth();

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
    selectedCity: null,
    selectedDistrict: null,
  });

  const handleCitySelect = async (city: PickerItem) => {
    const districtsRes = await getDistricts(Number(city.value));
    if (districtsRes) {
      setTempFilters((prev: any) => {
        const withoutCityAndDistrict = prev.filter(
          (f: any) =>
            f.field !== 'address.city' && f.field !== 'address.district',
        );
        return [
          ...withoutCityAndDistrict,
          { field: 'address.city', operator: '==', value: city.label },
        ];
      });

      setLocation((prev: any) => ({
        ...prev,
        selectedCity: city,
        selectedDistrict: null,
        districts: districtsRes.map((d: any) => ({
          label: d.name,
          value: d.id,
        })),
      }));
    }
  };
  const handleDistrictSelect = async (district: PickerItem) => {
    setTempFilters((prev: any) => {
      const withoutDistrict = prev.filter(
        (f: Filter) => f.field !== 'address.district',
      );
      return [
        ...withoutDistrict,
        { field: 'address.district', operator: '==', value: district.label },
      ];
    });
    setLocation((prev: any) => ({
      ...prev,
      selectedDistrict: district,
    }));
  };

  useEffect(() => {
    const fetchCities = async () => {
      const citiesRes = await getCities();
      if (citiesRes) {
        console.log('CITIES_RES', citiesRes);
        const formattedCities = citiesRes
          .map((c: any) => ({ label: c.name, value: c.id }))
          .sort((a, b) =>
            a.label.localeCompare(b.label, 'tr', { sensitivity: 'base' }),
          );
        console.log('FORMATTED_CITIES', formattedCities);
        setLocation((prev: any) => ({
          ...prev,
          cities: formattedCities,
        }));
      }
    };
    fetchCities();
  }, []);

  const { listings, loadInitialListings, loadMoreListings, favoriteListings, hasLoadedOnce } =
    useListings(showFavorites);

  useEffect(() => {
    if(!hasLoadedOnce) {
      loadInitialListings();
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.shouldRefresh) {
        loadInitialListings([], true, true).then(() => {
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
      // Mevcut animalType filtresini bul
      const existingAnimalFilter = prev.find(f => f.field === 'animalType');

      let updatedFilters = prev.filter(f => f.field !== 'animalType');
      let updatedValues: string[] = [];

      if (existingAnimalFilter) {
        // Eğer zaten varsa, mevcut değerleri kopyala
        updatedValues = [...existingAnimalFilter.value];

        // Seçilen hayvan zaten varsa çıkar, yoksa ekle
        if (updatedValues.includes(newFilter.value)) {
          updatedValues = updatedValues.filter(v => v !== newFilter.value);
        } else {
          updatedValues.push(newFilter.value);
        }

        // Eğer hiç hayvan kalmadıysa filtreyi tamamen sil
        if (updatedValues.length === 0) {
          return updatedFilters;
        }
      } else {
        // Daha önce hiç animalType filtresi yoksa yeni başlat
        updatedValues = [newFilter.value];
      }

      return [
        ...updatedFilters,
        {
          field: 'animalType',
          operator: 'in',
          value: updatedValues,
        },
      ];
    });
  };

  const resetTempFiltersAndCloseModal = () => {
    setTempFilters([]);
    setFilters([]);
    setLocation((prev: any) => ({
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

      {/* Üst butonlar */}
      <View
        style={[
          styles.topContainer,
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}
      >
        {/* Sol taraf (favoriler) */}
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

        {/* Sağ taraf (filtre) */}
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
      {/* İlanlar listesi */}
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
        renderItem={({ item }) => (
          <ListingItem
            data={item}
            favorited={userDetails?.favorites?.includes(item.id) || false}
          />
        )}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        onEndReachedThreshold={0.5}
        onEndReached={() => loadMoreListings()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshing={isRefreshing}
        onRefresh={() => {
          setIsRefreshing(true);
          loadInitialListings(filters, true, true).finally(() =>
            setIsRefreshing(false),
          );
        }}
        ListEmptyComponent={() => {
          return (
            <EmptyList
              label={
                showFavorites ? 'Favori ilanın bulunamadı' : 'İlan bulunamadı'
              }
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

      {/* Filtre modalı */}
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
                  f =>
                    f.field === filter.field &&
                    Array.isArray(f.value) &&
                    f.value.includes(filter.value),
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
