import React from 'react';

import { StyleSheet, Text, View, Image } from 'react-native';
import { Colors } from '../../../styles';

export default function ProductPriceBar(props) {
    const { price, newPrice, buttonText } = props.data;

    return (
        <View style={styles.container}>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 20
            }}
            >
                <View
                    style={{
                        borderRightWidth: 1,
                        borderRightColor: Colors.lightGrey,
                        paddingLeft: 5,
                        paddingRight: 15
                    }}>
                    <Image
                        style={styles.image}
                        source={require('../../../assets/product/cart.png')}
                        resizeMode='contain'
                    />
                </View>


                <Text
                    style={{
                        color: Colors.red,
                        fontSize: 20,
                        fontWeight: '500',
                        marginLeft: 15
                    }}
                >
                    ${newPrice}
                </Text>

                <Text
                    style={{
                        fontSize: 16,
                        color: Colors.black,
                        textDecorationLine: 'line-through',
                        alignSelf: 'flex-end',
                        marginLeft: 5
                    }}
                >
                    ${price}
                </Text>
            </View>

            <View style={styles.button}>
                <Text style={styles.buttonText}>
                    加入购物车
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    image: {
        width: 25,
        height: 25
    },
    button: {
        borderRadius: 20,
        height: 30,
        marginRight: 20,
        paddingVertical: 3,
        paddingHorizontal: 20,
        backgroundColor: Colors.primary,
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 16,
        textAlign: 'center',
    }
});
