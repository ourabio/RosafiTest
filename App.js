/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Image,
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Modal,
  PixelRatio,
} from 'react-native';

import {Card, Rating} from 'react-native-elements';
import Booking from './components/Booking';

const window = Dimensions.get('window');

class App extends React.Component {
  images = [
    require('./assets/No_Image_Available.jpg'),
    require('./assets/hotel_one.jpeg'),
    require('./assets/hotel_two.jpeg'),
    require('./assets/hotel_three.jpeg'),
    require('./assets/hotel_four.jpeg'),
  ];

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isLargeScreen: this.isLargeScreen(window),
      dataSource: [],
      isModalVisible: false,
      selectedHotelPrice: '',
      roomNumber: '1',
      nightNumber: '1',
      totalPrice: 0,
    };
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this.onChange);
    this.fetchData();
  }

  // Window size changed
  onChange = ({window}) => {
    console.log('changed', window);
    let isLargeScreen = this.isLargeScreen(window);
    this.setState({isLargeScreen});
  };

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onChange);
  }

  // Check if the screen is large (>= 768)
  isLargeScreen(window) {
    let isLargeScreen =
      PixelRatio.getPixelSizeForLayoutSize(window.width) < 768 ? false : true;

    return isLargeScreen;
  }

  // Get the hotels list from database
  fetchData() {
    fetch('http://10.0.2.2:3000/hotels')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          loading: false,
          dataSource: responseJson,
        });
      })
      .catch((error) => console.log(error));
  }

  // Get image source based on the image name (require does not accept variables)
  getImage(image) {
    let hotelImage;
    switch (image) {
      case 'hotel_one.jpeg':
        hotelImage = this.images[1];
        break;
      case 'hotel_two.jpeg':
        hotelImage = this.images[2];
        break;
      case 'hotel_three.jpeg':
        hotelImage = this.images[3];
        break;
      case 'hotel_four.jpeg':
        hotelImage = this.images[4];
        break;
      default:
        hotelImage = this.images[0];
        break;
    }
    return hotelImage;
  }

  // Get the new price after promotion
  getNewPrice(price, offer) {
    // Format the price string to prepare it for parsing and calculate
    let formattedPrice = parseFloat(price.replace('$', '').replace(',', ''));
    let newPrice = (1 - parseFloat(offer) / 100) * formattedPrice;
    return `$ ${newPrice}`;
  }

  // Booking button pressed action
  onPressBook = (price) => {
    this.setState({selectedHotelPrice: price}, () => {
      this.setModalVisible(true);
    });
  };

  // Show/Hide the booking Modal
  setModalVisible = (isModalVisible) => {
    this.setState({isModalVisible});
  };

  // Hotel item render
  renderItem = (hotel) => {
    let imageSource = this.getImage(hotel.item.HotelImg);
    let hotelPrice = hotel.item.Offer
      ? this.getNewPrice(hotel.item.HotelPrice, hotel.item.Offer)
      : hotel.item.HotelPrice;
    const {isLargeScreen} = this.state;
    return (
      <Card
        wrapperStyle={styles.itemContainer}
        containerStyle={styles.itemContainer}>
        <View style={styles.itemImageContainer}>
          <Image style={styles.itemImage} source={imageSource} />
          {hotel.item.Offer && <Text style={styles.badge}>Offer</Text>}
        </View>

        <View style={styles.itemInfoContainer}>
          <Text style={styles.nameText}>{hotel.item.HotelName}</Text>

          <Rating
            imageSize={25}
            readonly
            ratingColor="#3498db"
            ratingBackgroundColor="#c8c7c8"
            startingValue={parseInt(hotel.item.rating)}
            style={styles.rating}
          />

          <View style={styles.priceContainer}>
            {hotel.item.Offer && (
              <Text style={styles.oldPriceText}>{hotel.item.HotelPrice}</Text>
            )}
            <Text style={styles.priceText}>{hotelPrice}</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.onPressBook(hotelPrice)}>
            <Text style={styles.buttonText}>
              {isLargeScreen ? 'Réserver maintenant' : 'Réserver'}
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  render() {
    const {dataSource, isModalVisible, selectedHotelPrice} = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View style={styles.body}>
            <FlatList
              data={dataSource}
              renderItem={(item) => this.renderItem(item)}
              keyExtractor={(item) => item.HotelName.toString()}
            />
            <Modal
              animationType="slide"
              presentationStyle="overFullScreen"
              visible={isModalVisible}
              onRequestClose={() => this.setModalVisible(false)}>
              <Booking hotelPrice={selectedHotelPrice} />
            </Modal>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingRight: 6,
  },
  itemImageContainer: {
    marginRight: 20,
  },
  itemInfoContainer: {
    flex: 1,

    justifyContent: 'space-between',
  },
  itemImage: {
    height: 50 * PixelRatio.get(),
    width: 50 * PixelRatio.get(),
  },
  badge: {
    height: 50,
    width: 50,
    position: 'absolute',
    left: -20,
    top: -20,
    borderRadius: 25,
    backgroundColor: '#ffa500',
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  rating: {
    alignSelf: 'flex-start',
  },
  priceContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 16,
  },
  priceText: {
    fontSize: 18,
    color: 'steelblue',
  },
  oldPriceText: {
    fontSize: 18,
    color: 'black',
    textDecorationLine: 'line-through',
    marginRight: 18,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#72bf44',
    padding: 4,
    color: 'white',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default App;
