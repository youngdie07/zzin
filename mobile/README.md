# ZZIN Mobile App

오스틴 한인 맛집 앱 - React Native 모바일 애플리케이션

## 기술 스택

- React Native 0.73
- TypeScript
- React Navigation
- React Native Maps
- Axios
- AsyncStorage

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. iOS 설정 (macOS만 해당)

```bash
cd ios && pod install && cd ..
```

### 3. 앱 실행

```bash
# Android
npm run android

# iOS
npm run ios

# Metro bundler 시작
npm start
```

## 주요 기능

### 화면 구성

1. **홈 화면** - 음식점 목록, 카테고리 필터, 한국인 맞춤 필터
2. **지도 화면** - 지도에서 음식점 위치 확인
3. **북마크 화면** - 저장한 음식점 목록
4. **마이페이지** - 프로필, 설정, 내 리뷰

### 상세 화면

- **음식점 상세** - 정보, 리뷰, 한국인 맞춤 통계
- **리뷰 작성** - 별점, 세부 평가, 한국인 맞춤 옵션
- **검색** - 음식점 이름, 음식 종류로 검색

### 한국인 맞춤 기능

리뷰 작성 시 선택 가능한 옵션:
- 가족 동반 추천
- 인종차별 없음
- 정통 한식 느낌
- 한국인 친화적

각 음식점에서 한국인들의 평가 통계를 확인할 수 있습니다.

## API 연동

백엔드 API 주소는 `src/services/api.ts`에서 설정합니다.

개발 환경:
```typescript
const API_BASE_URL = 'http://localhost:3000/api';
```

프로덕션 환경에서는 실제 서버 주소로 변경하세요.

## 프로젝트 구조

```
mobile/
├── src/
│   ├── components/      # 재사용 가능한 컴포넌트
│   ├── screens/         # 화면 컴포넌트
│   ├── navigation/      # 네비게이션 설정
│   ├── services/        # API 서비스
│   ├── types/          # TypeScript 타입 정의
│   └── utils/          # 유틸리티 함수
├── App.tsx             # 앱 진입점
└── package.json
```

## 개발 가이드

### 새로운 화면 추가

1. `src/screens/` 에 화면 컴포넌트 생성
2. `src/navigation/types.ts` 에 라우트 타입 추가
3. `src/navigation/AppNavigator.tsx` 에 화면 등록

### API 서비스 추가

1. `src/services/` 에 서비스 파일 생성
2. `src/types/index.ts` 에 타입 정의
3. 화면에서 서비스 호출

## 주의사항

- iOS에서 지도 사용 시 `Info.plist`에 위치 권한 추가 필요
- 이미지 선택 시 카메라/갤러리 권한 설정 필요
- 프로덕션 빌드 전 API URL 변경 필수
