import React from 'react';

//react native components
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

//packages
import Swiper from 'react-native-swiper';

//config

//styles
import { Colors } from '../styles';

export default function SmallListItem(props) {
    const { title, data, link } = props;

    return (
        <TouchableOpacity
            activeOpacity={1}
        >
            <View style={
                styles.titleContainer}
            >
                <View style={{ flex: 0.25 }}>
                    <Text style={styles.titleText}>
                        {title}
                    </Text>
                </View>

                <View style={{ flex: 0.7, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Text
                        numberOfLines={2}
                        style={styles.contentText}
                    >
                        {data}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.midGrey
    },
    cardContainer: {
        paddingHorizontal: 15,
        paddingBottom: 5,
    },
    titleContainer: {
        flexDirection: 'row',
        borderTopColor: Colors.midGrey,
        borderTopWidth: 1,
        height: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 14
    },
    subtitleText: {
        fontSize: 14
    },
    textContainer: {
        flexDirection: 'row',
        borderBottomColor: Colors.midGrey,
        borderBottomWidth: 1,
    },
    contentText: {
        fontSize: 13,
        textAlign: 'right'
    }
});