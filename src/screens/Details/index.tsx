import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation'; 

type DetailsRouteProp = RouteProp<RootStackParamList, 'DetailsScreen'>;

interface AnimeAttributes {
  canonicalTitle?: string;
  titles?: { en?: string; ja_jp?: string; en_jp?: string };
  posterImage?: { large?: string; medium?: string };
  coverImage?: { large?: string; small?: string };
  synopsis?: string;
  startDate?: string;
  status?: string;
  averageRating?: string;
  popularityRank?: number;
  ratingRank?: number;
  ageRatingGuide?: string;
  episodeCount?: number;
  episodeLength?: number;
}

interface AnimeData {
  id: string;
  attributes: AnimeAttributes;
}

const FALLBACK_IMAGE = 'https://via.placeholder.com/300x400/2f343b/A0AAB2?text=Sem+Imagem';

export default function DetailsScreen() {
  const route = useRoute<DetailsRouteProp>();
  const { animeId } = route.params;

  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://kitsu.io/api/edge/anime/${animeId}`);
        const json = await response.json();
        setAnimeData(json.data);
      } catch (err) {
        console.error('Erro ao carregar detalhes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [animeId]);

  const getSafeUrl = (url?: string) =>
    url ? `https://images.weserv.nl/?url=${encodeURIComponent(url)}` : FALLBACK_IMAGE;

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case 'current':
        return { label: 'Em Produção', color: '#2EC4B6' }; 
      case 'finished':
        return { label: 'Encerrado', color: '#E63946' }; 
      default:
        return { label: status ? status.toUpperCase() : 'N/A', color: '#6C757D' };
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#E63946" />
      </View>
    );
  }

  if (!animeData) return null;

  const attr = animeData.attributes;
  const statusConfig = getStatusConfig(attr.status);
  const year = attr.startDate ? attr.startDate.split('-')[0] : 'N/A';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {attr.coverImage?.large && (
        <Image
          source={{ uri: getSafeUrl(attr.coverImage.large) }}
          style={styles.coverBanner}
        />
      )}

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Image
            source={{ uri: getSafeUrl(attr.posterImage?.large || attr.posterImage?.medium) }}
            style={styles.poster}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{attr.canonicalTitle}</Text>
            {attr.titles?.ja_jp && (
              <Text style={styles.japaneseTitle}>{attr.titles.ja_jp}</Text>
            )}

            <View style={[styles.badge, { backgroundColor: statusConfig.color }]}>
              <Text style={styles.badgeText}>{statusConfig.label}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>★ {Math.round(Number(attr.averageRating || 0))}%</Text>
            <Text style={styles.statLabel}>Nota Média</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>#{attr.popularityRank || 'N/A'}</Text>
            <Text style={styles.statLabel}>Popularidade</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{attr.episodeCount || '?'} eps</Text>
            <Text style={styles.statLabel}>
              {attr.episodeLength ? `${attr.episodeLength} min/ep` : 'Duração'}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{year}</Text>
            <Text style={styles.statLabel}>Lançamento</Text>
          </View>
        </View>

        {attr.ageRatingGuide && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Classificação:</Text>
            <Text style={styles.infoValue}>{attr.ageRatingGuide}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Sinopse</Text>
        <Text style={styles.synopsis}>{attr.synopsis || 'Sem sinopse disponível.'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e', 
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25292e',
  },
  coverBanner: {
    width: '100%',
    height: 160,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    marginTop: -30,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  poster: {
    width: 110,
    height: 160,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#25292e',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  japaneseTitle: {
    fontSize: 14,
    color: '#A0AAB2',
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '48%', 
    backgroundColor: '#2f343b', 
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    color: '#E63946',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statLabel: {
    color: '#A0AAB2',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#E63946',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#2f343b',
    padding: 14,
    borderRadius: 12,
  },
  infoLabel: {
    color: '#A0AAB2',
    fontWeight: 'bold',
    marginRight: 8,
  },
  infoValue: {
    color: '#FFFFFF',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  synopsis: {
    fontSize: 15,
    color: '#A0AAB2',
    lineHeight: 24,
    textAlign: 'justify',
  },
});