import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://192.168.241.210:8000/llm/sample-images/';
const screenWidth = Dimensions.get('window').width;
const imageSize = (screenWidth - 40) / 2 - 10;

const FoodAppUI = () => {
  const navigation = useNavigation();
  const [foodData, setFoodData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchFoodData();
  }, []);

  const fetchFoodData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setFoodData(data);
    } catch (error) {
      console.error('Error fetching food images:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderImages = ({ item, index }) => (
    <TouchableOpacity
      key={index}
      onPress={() =>
        navigation.navigate('Camera', {
          image: `http://192.168.241.210:8000${item.image}`,
        })
      }
      style={styles.imageWrapper}
    >
      <Image
        source={{ uri: `http://192.168.241.210:8000${item.image}` }}
        style={styles.foodImage}
      />
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View>
      {/* Category Pills */}
      <FlatList
        data={Object.keys(foodData)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.categoryContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.category,
              selectedCategory === item && styles.activeCategory,
            ]}
            onPress={() =>
              setSelectedCategory((prev) => (prev === item ? null : item))
            }
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item && styles.activeCategoryText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Category Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {selectedCategory || 'All Categories'}
        </Text>
        {selectedCategory && (
          <TouchableOpacity onPress={() => setSelectedCategory(null)}>
            <Text style={styles.viewAll}>Show All</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const getFlatListData = () => {
    if (selectedCategory) {
      return foodData[selectedCategory] || [];
    } else {
      return Object.values(foodData).flat();
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#4C8CFF" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={getFlatListData()}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          ListHeaderComponent={ListHeader}
          columnWrapperStyle={styles.gridRow}
          renderItem={renderImages}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C1326',
    paddingTop: 40,
    paddingHorizontal: 15,
  },
  categoryContainer: {
    paddingBottom: 10,
  },
  category: {
    backgroundColor: '#1A2236',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  activeCategory: {
    backgroundColor: '#4C8CFF',
    borderColor: '#4C8CFF',
  },
  categoryText: {
    color: '#ccc',
    fontSize: 16,
  },
  activeCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    color: '#4C8CFF',
    fontSize: 14,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  imageWrapper: {
    width: imageSize,
  },
  foodImage: {
    width: imageSize,
    height: imageSize,
    borderRadius: 12,
  },
});

export default FoodAppUI;
