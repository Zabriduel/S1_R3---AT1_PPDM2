import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Image, View, Text, TouchableOpacity } from "react-native";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;

export default function HomeScreen() {
    const navigation = useNavigation<NavigationProps>();
    
    return (
        <View style={styles.container}>
        
            <Image source={require('../../../assets/logo.png')} style={styles.image} />

            <Text style={styles.title}>Kitsu Fox</Text>

            
            <Text style={styles.description}>
                Explore o universo dos animes. Descubra novos títulos e consulte as informações direto da API.
            </Text>

            <TouchableOpacity 
                style={styles.button} 
                activeOpacity={0.8}
                onPress={() => navigation.navigate('ListScreen')} 
            >
                <Text style={styles.buttonText}>Acessar Catálogo</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#25292e',
        paddingHorizontal: 30, 
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 24, 
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#A0AAB2', 
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40, 
    },
    button: {
        backgroundColor: '#E63946',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        width: '100%', 
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});