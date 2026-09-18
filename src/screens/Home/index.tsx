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
            {/* Logo da Aplicação */}
            <Image source={require('../../../assets/logo.png')} style={styles.image} />

            {/* 1. Nome ou título da aplicação */}
            <Text style={styles.title}>Kitsu Fox</Text>

            {/* 2. Breve descrição da aplicação */}
            <Text style={styles.description}>
                Explore o universo dos animes e mangás. Descubra novos títulos e consulte as informações direto da API.
            </Text>

            {/* 3. Botão para acessar os dados da API */}
            <TouchableOpacity 
                style={styles.button} 
                activeOpacity={0.8}
                onPress={() => navigation.navigate('ApiDataScreen')} 
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
        paddingHorizontal: 30, // Adicionado padding para o texto não colar nas bordas
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 24, // Espaçamento entre a logo e o título
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
        color: '#A0AAB2', // Cinza azulado para leitura confortável no fundo escuro
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40, // Espaço generoso antes do botão
    },
    button: {
        backgroundColor: '#E63946', // Vermelho para combinar com a raposa e as cerejeiras
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        width: '100%', // Ocupa a largura disponível
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});