import { useEffect, useState } from 'react';

import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
} from 'react-native';

// import {useNavigation} from '@reactnative'

interface PosterImage {
    small?: string;
    medium?: string;
    large?: string;
    original?: string;
}

interface Titles {
    en?: string;
    en_jp?: string;
    ja_jp?: string;
}

interface Attributes {
    canonicalTitle?: string;
    titles?: Titles;
    posterImage?: PosterImage;
    subtype?: string;
    episodeCount?: number;
    chapterCount?: number;
    startDate?: string;
    averageRating?: string | number;
    status?: string;
}

interface KitsuItem {
    id: string;
    attributes: Attributes;
}

interface KitsuResponse {
    data: KitsuItem[];
}

interface Category {
    label: string;
    value: string;
    url: string;
}


const FALLBACK_IMAGE =
    'https://via.placeholder.com/300x400/1a1a24/a78bfa?text=Sem+Imagem';


export default function ListScreen() {

    const [endpoint, setEndpoint] = useState<string>(
        'https://kitsu.io/api/edge/anime?page[limit]=20'
    );

    const [activeCategory, setActiveCategory] =
        useState<string>('anime');

    const [items, setItems] = useState<KitsuItem[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    const [error, setError] = useState<string | null>(null);

    const [selectedItem, setSelectedItem] = useState<KitsuItem | null>(null);


    const categories: Category[] = [
        {
            label: 'Animes Populares',
            value: 'anime',
            url: 'https://kitsu.io/api/edge/anime?page[limit]=20',
        },
        {
            label: 'Animes em Alta',
            value: 'trending-anime',
            url: 'https://kitsu.io/api/edge/trending/anime',
        },
        {
            label: 'Mangás Populares',
            value: 'manga',
            url: 'https://kitsu.io/api/edge/manga?page[limit]=20',
        },
        {
            label: 'Mangás em Alta',
            value: 'trending-manga',
            url: 'https://kitsu.io/api/edge/trending/manga',
        },
    ];

    useEffect(() => {

        const fetchData = async (): Promise<void> => {

            setLoading(true);
            setError(null);

            try {

                const response = await fetch(endpoint);

                if (!response.ok) {
                    throw new Error(
                        'Falha ao buscar dados da API Kitsu'
                    );
                }

                const json: KitsuResponse = await response.json();

                setItems(json.data || []);

            } catch (err: unknown) {

                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError(
                        'Ocorreu um erro ao buscar os dados.'
                    );
                }

            } finally {

                setLoading(false);

            }
        };

        fetchData();

    }, [endpoint]);


    const getSafeImageUrl = (
        rawUrl?: string
    ): string => {

        if (!rawUrl) {
            return FALLBACK_IMAGE;
        }

        return `https://images.weserv.nl/?url=${encodeURIComponent(
            rawUrl
        )}`;
    };



    return (

        <View style={styles.container}>

            {/* TÍTULO */}

            <Text style={styles.title}>
                Kitsu Anime & Manga Explorer
            </Text>

            {/* CATEGORIAS */}

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
            >

                {categories.map((cat: Category) => (

                    <TouchableOpacity
                        key={cat.value}
                        onPress={() => {
                            setActiveCategory(cat.value);
                            setEndpoint(cat.url);
                        }}
                        style={[
                            styles.categoryButton,
                            activeCategory === cat.value &&
                            styles.categoryButtonActive,
                        ]}
                    >

                        <Text
                            style={[
                                styles.categoryButtonText,
                                activeCategory === cat.value &&
                                styles.categoryButtonTextActive,
                            ]}
                        >
                            {cat.label}
                        </Text>

                    </TouchableOpacity>

                ))}

            </ScrollView>

            {loading && (

                <View style={styles.loadingContainer}>

                    <ActivityIndicator
                        size="large"
                        color="#a78bfa"
                    />

                    <Text style={styles.loadingText}>
                        Carregando catálogo...
                    </Text>

                </View>

            )}

            {error && !loading && (

                <View style={styles.errorContainer}>

                    <Text style={styles.errorText}>
                        Erro: {error}
                    </Text>

                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                            setEndpoint((current) => current);
                        }}
                    >
                        <Text style={styles.retryButtonText}>
                            Tentar novamente
                        </Text>
                    </TouchableOpacity>

                </View>

            )}

            {!loading && !error && (

                <ScrollView
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                >

                    <View style={styles.cardsContainer}>

                        {items.map((item: KitsuItem) => {

                            const attr = item.attributes;

                            const title =
                                attr.canonicalTitle ||
                                attr.titles?.en ||
                                attr.titles?.en_jp ||
                                'Sem título';

                            const originalImage =
                                attr.posterImage?.small ||
                                attr.posterImage?.medium ||
                                attr.posterImage?.large;

                            return (

                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.card}
                                    activeOpacity={0.8}
                                    onPress={() => setSelectedItem(item)}
                                >

                                    <Image
                                        source={{
                                            uri: getSafeImageUrl(
                                                originalImage
                                            ),
                                        }}
                                        style={styles.image}
                                        resizeMode="cover"
                                        onError={(event) => {
                                            console.log(
                                                'Erro ao carregar imagem:',
                                                event.nativeEvent
                                            );
                                        }}
                                    />

                                    <View style={styles.infoContainer}>

                                        <Text
                                            style={styles.cardTitle}
                                            numberOfLines={2}
                                        >
                                            {title}
                                        </Text>


                                        <Text style={styles.infoText}>
                                            <Text style={styles.infoLabel}>
                                                Tipo:
                                            </Text>{' '}
                                            {attr.subtype
                                                ? attr.subtype.toUpperCase()
                                                : 'N/A'}
                                        </Text>

                                        {attr.episodeCount !==
                                            undefined && (

                                                <Text style={styles.infoText}>
                                                    <Text
                                                        style={styles.infoLabel}
                                                    >
                                                        Episódios:
                                                    </Text>{' '}
                                                    {attr.episodeCount}
                                                </Text>

                                            )}

                                        {attr.chapterCount !==
                                            undefined && (

                                                <Text style={styles.infoText}>
                                                    <Text
                                                        style={styles.infoLabel}
                                                    >
                                                        Capítulos:
                                                    </Text>{' '}
                                                    {attr.chapterCount}
                                                </Text>

                                            )}

                                        <Text style={styles.infoText}>
                                            <Text style={styles.infoLabel}>
                                                Ano:
                                            </Text>{' '}

                                            {attr.startDate
                                                ? attr.startDate.split(
                                                    '-'
                                                )[0]
                                                : 'N/A'}
                                        </Text>


                                        <View style={styles.cardFooter}>


                                            <View style={styles.rating}>

                                                <Text
                                                    style={
                                                        styles.ratingText
                                                    }
                                                >
                                                    ★{' '}
                                                    {attr.averageRating
                                                        ? `${Math.round(
                                                            Number(
                                                                attr.averageRating
                                                            )
                                                        )}%`
                                                        : 'N/A'}
                                                </Text>

                                            </View>


                                            <Text
                                                style={styles.status}
                                                numberOfLines={1}
                                            >
                                                {attr.status || 'N/A'}
                                            </Text>

                                        </View>

                                    </View>

                                </TouchableOpacity>

                            );

                        })}

                    </View>

                </ScrollView>

            )}

            {selectedItem && (
                <Modal
                    visible={true}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setSelectedItem(null)}
                >
                    <View style={styles.modalOverlay}>

                        <View style={styles.modalContainer}>

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setSelectedItem(null)}
                            >
                                <Text style={styles.closeButtonText}>
                                    ✕
                                </Text>
                            </TouchableOpacity>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                            >

                                <Image
                                    source={{
                                        uri: getSafeImageUrl(
                                            selectedItem.attributes.posterImage?.large ||
                                            selectedItem.attributes.posterImage?.medium ||
                                            selectedItem.attributes.posterImage?.small
                                        ),
                                    }}
                                    style={styles.modalImage}
                                    resizeMode="cover"
                                />

                                <Text style={styles.modalTitle}>
                                    {selectedItem.attributes.canonicalTitle ||
                                        selectedItem.attributes.titles?.en ||
                                        selectedItem.attributes.titles?.en_jp ||
                                        'Sem título'}
                                </Text>

                                <Text style={styles.modalInfo}>
                                    <Text style={styles.modalLabel}>
                                        Tipo:
                                    </Text>{' '}
                                    {selectedItem.attributes.subtype
                                        ? selectedItem.attributes.subtype.toUpperCase()
                                        : 'N/A'}
                                </Text>

                                {selectedItem.attributes.episodeCount !== undefined && (
                                    <Text style={styles.modalInfo}>
                                        <Text style={styles.modalLabel}>
                                            Episódios:
                                        </Text>{' '}
                                        {selectedItem.attributes.episodeCount}
                                    </Text>
                                )}

                                {selectedItem.attributes.chapterCount !== undefined && (
                                    <Text style={styles.modalInfo}>
                                        <Text style={styles.modalLabel}>
                                            Capítulos:
                                        </Text>{' '}
                                        {selectedItem.attributes.chapterCount}
                                    </Text>
                                )}

                                <Text style={styles.modalInfo}>
                                    <Text style={styles.modalLabel}>
                                        Ano:
                                    </Text>{' '}
                                    {selectedItem.attributes.startDate
                                        ? selectedItem.attributes.startDate.split('-')[0]
                                        : 'N/A'}
                                </Text>

                                <Text style={styles.modalInfo}>
                                    <Text style={styles.modalLabel}>
                                        Avaliação:
                                    </Text>{' '}
                                    {selectedItem.attributes.averageRating
                                        ? `${Math.round(
                                            Number(selectedItem.attributes.averageRating)
                                        )}%`
                                        : 'N/A'}
                                </Text>

                                <Text style={styles.modalInfo}>
                                    <Text style={styles.modalLabel}>
                                        Status:
                                    </Text>{' '}
                                    {selectedItem.attributes.status || 'N/A'}
                                </Text>

                            </ScrollView>

                        </View>

                    </View>
                </Modal>
            )}

        </View>

    );


}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#0f0f15',
        paddingTop: 35,
    },

    title: {
        color: '#a78bfa',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1,
        marginHorizontal: 20,
        marginBottom: 20,
    },


    categoriesContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingTop: 5,
        paddingBottom: 5,
        gap: 10,
        marginBottom: 20,
        alignItems: 'center',
    },

    categoryButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        minWidth: 90,
        minHeight: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2d2d3a',
        backgroundColor: '#1a1a24',
        alignItems: 'center',
        justifyContent: 'center'
    },

    categoryButtonActive: {
        borderWidth: 2,
        borderColor: '#a78bfa',
        backgroundColor: '#a78bfa',
    },

    categoryButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        includeFontPadding: true
    },

    categoryButtonTextActive: {
        color: '#0f0f15',
    },



    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },

    loadingText: {
        color: '#a78bfa',
        fontSize: 16,
        marginTop: 12,
    },



    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },

    errorText: {
        color: '#ff4d4d',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },

    retryButton: {
        backgroundColor: '#a78bfa',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },

    retryButtonText: {
        color: '#0f0f15',
        fontWeight: 'bold',
    },


    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 30,
    },

    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },



    card: {
        width: '48%',
        backgroundColor: '#1a1a24',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2d2d3a',
        overflow: 'hidden',
        marginBottom: 15,
    },


    image: {
        width: '100%',
        height: 250,
        backgroundColor: '#1a1a24',
    },


    infoContainer: {
        padding: 12,
        minHeight: 180,
    },

    cardTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        lineHeight: 20,
        marginBottom: 8,
    },

    infoText: {
        color: '#a0a0b0',
        fontSize: 12,
        marginBottom: 5,
    },

    infoLabel: {
        color: '#fff',
        fontWeight: 'bold',
    },



    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },

    rating: {
        backgroundColor: '#2d2d3a',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
    },

    ratingText: {
        color: '#a78bfa',
        fontSize: 11,
        fontWeight: 'bold',
    },

    status: {
        color: '#888',
        fontSize: 11,
        textTransform: 'capitalize',
        flex: 1,
        textAlign: 'right',
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'flex-end',
    },

    modalContainer: {
        backgroundColor: '#1a1a24',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '90%',
    },

    closeButton: {
        position: 'absolute',
        right: 15,
        top: 15,
        zIndex: 10,
        width: 35,
        height: 35,
        borderRadius: 20,
        backgroundColor: '#2d2d3a',
        justifyContent: 'center',
        alignItems: 'center',
    },

    closeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    modalImage: {
        width: '100%',
        height: 350,
        borderRadius: 12,
        marginBottom: 15,
    },

    modalTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },

    modalInfo: {
        color: '#a0a0b0',
        fontSize: 14,
        marginBottom: 10,
    },

    modalLabel: {
        color: '#fff',
        fontWeight: 'bold',
    },


});
