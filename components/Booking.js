import React from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import {Card} from 'react-native-elements';

class Booking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomNumber: '1',
      nightNumber: '1',
    };
  }

  componentDidMount() {
    // initialize total price count
    this.calculateTotalPrice();
  }

  // Booking total price count
  // Total price depends on hotel price, number of night and number of rooms
  calculateTotalPrice() {
    let hotelPrice = this.props.hotelPrice;
    let totalPrice =
      parseFloat(hotelPrice.replace('$', '').replace(',', '')) *
      parseInt(this.state.nightNumber) *
      parseInt(this.state.roomNumber);

    this.setState({
      totalPrice: totalPrice || 0,
    });
  }

  //Rooms number TextInput changed
  onChangeRooms = (roomNumber) => {
    this.setState({roomNumber}, () => {
      this.calculateTotalPrice();
    });
  };

  //Nights number TextInput changed
  onChangeNights = (nightNumber) => {
    this.setState({nightNumber}, () => {
      this.calculateTotalPrice();
    });
  };

  render() {
    const {roomNumber, nightNumber, totalPrice} = this.state;
    return (
      <Card wrapperStyle={styles.modalContainer}>
        <View style={styles.modalLine}>
          <Text style={styles.modalText}>Nombre des chambres a réserver:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.onChangeRooms(text)}
            value={roomNumber}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.modalLine}>
          <Text style={styles.modalText}>Nombre des nuits:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.onChangeNights(text)}
            value={nightNumber}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.modalLine}>
          <Text style={styles.modalText}>Prix total</Text>
          <Text style={styles.TotalPriceText}>{`$ ${totalPrice}`}</Text>
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    paddingTop: 20,
  },
  modalLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    fontSize: 18,
    flex: 0.4,
  },
  modalText: {
    fontSize: 18,
    flex: 0.5,
  },
  divider: {
    backgroundColor: 'gray',
    height: 1,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 30,
  },
  TotalPriceText: {
    fontSize: 18,
    flex: 1,
    textAlign: 'right',
    color: 'steelblue',
  },
});

export default Booking;
