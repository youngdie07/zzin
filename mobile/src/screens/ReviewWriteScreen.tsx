import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { reviewService } from '../services/review.service';
import { RootStackParamList } from '../navigation/types';

type ReviewWriteRouteProp = RouteProp<RootStackParamList, 'ReviewWrite'>;
type ReviewWriteNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ReviewWrite'
>;

const ReviewWriteScreen = () => {
  const route = useRoute<ReviewWriteRouteProp>();
  const navigation = useNavigation<ReviewWriteNavigationProp>();
  const { restaurantId } = route.params;

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [tasteRating, setTasteRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [atmosphereRating, setAtmosphereRating] = useState(5);

  const [koreanOptions, setKoreanOptions] = useState({
    goodForFamily: false,
    noDiscrimination: true,
    authenticKorean: false,
    koreanFriendly: false,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('알림', '리뷰 내용을 작성해주세요.');
      return;
    }

    try {
      setLoading(true);
      await reviewService.createReview({
        restaurantId,
        rating,
        content,
        tasteRating,
        serviceRating,
        atmosphereRating,
        ...koreanOptions,
      });
      Alert.alert('성공', '리뷰가 작성되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('오류', error.response?.data?.error || '리뷰 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (value: number, onChange: (value: number) => void) => {
    return (
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => onChange(star)}>
            <Icon
              name={star <= value ? 'star' : 'star-outline'}
              size={32}
              color="#FFD700"
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* 전체 평점 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>전체 평점</Text>
          {renderStars(rating, setRating)}
        </View>

        {/* 세부 평점 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>맛</Text>
          {renderStars(tasteRating, setTasteRating)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>서비스</Text>
          {renderStars(serviceRating, setServiceRating)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>분위기</Text>
          {renderStars(atmosphereRating, setAtmosphereRating)}
        </View>

        {/* 리뷰 내용 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>리뷰</Text>
          <TextInput
            style={styles.textArea}
            placeholder="이 음식점에 대한 솔직한 리뷰를 작성해주세요..."
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
        </View>

        {/* 한국인 맞춤 옵션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>한국인 맞춤 평가</Text>

          <View style={styles.optionRow}>
            <View style={styles.optionLabel}>
              <Icon name="people" size={20} color="#4CAF50" />
              <Text style={styles.optionText}>가족 동반 추천</Text>
            </View>
            <Switch
              value={koreanOptions.goodForFamily}
              onValueChange={(value) =>
                setKoreanOptions({ ...koreanOptions, goodForFamily: value })
              }
              trackColor={{ false: '#ddd', true: '#4CAF50' }}
            />
          </View>

          <View style={styles.optionRow}>
            <View style={styles.optionLabel}>
              <Icon name="shield-checkmark" size={20} color="#2196F3" />
              <Text style={styles.optionText}>인종차별 없음</Text>
            </View>
            <Switch
              value={koreanOptions.noDiscrimination}
              onValueChange={(value) =>
                setKoreanOptions({ ...koreanOptions, noDiscrimination: value })
              }
              trackColor={{ false: '#ddd', true: '#2196F3' }}
            />
          </View>

          <View style={styles.optionRow}>
            <View style={styles.optionLabel}>
              <Icon name="checkmark-circle" size={20} color="#FF9800" />
              <Text style={styles.optionText}>정통 한식 느낌</Text>
            </View>
            <Switch
              value={koreanOptions.authenticKorean}
              onValueChange={(value) =>
                setKoreanOptions({ ...koreanOptions, authenticKorean: value })
              }
              trackColor={{ false: '#ddd', true: '#FF9800' }}
            />
          </View>

          <View style={styles.optionRow}>
            <View style={styles.optionLabel}>
              <Icon name="heart" size={20} color="#E91E63" />
              <Text style={styles.optionText}>한국인 친화적</Text>
            </View>
            <Switch
              value={koreanOptions.koreanFriendly}
              onValueChange={(value) =>
                setKoreanOptions({ ...koreanOptions, koreanFriendly: value })
              }
              trackColor={{ false: '#ddd', true: '#E91E63' }}
            />
          </View>
        </View>

        {/* 제출 버튼 */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>리뷰 작성 완료</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  stars: {
    flexDirection: 'row',
    gap: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 120,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReviewWriteScreen;
