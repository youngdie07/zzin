# ZZIN Backend API

오스틴 한인 맛집 앱의 백엔드 API 서버

## 기술 스택

- Node.js + Express + TypeScript
- PostgreSQL
- Prisma ORM
- JWT 인증
- bcryptjs

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/zzin?schema=public"
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

### 3. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npm run prisma:generate

# 데이터베이스 마이그레이션
npm run prisma:migrate

# (선택) Prisma Studio로 데이터 확인
npm run prisma:studio
```

### 4. 서버 실행

```bash
# 개발 모드
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

## API 엔드포인트

### 인증 (Auth)

- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/profile` - 프로필 조회 (인증 필요)

### 음식점 (Restaurants)

- `GET /api/restaurants` - 음식점 목록 조회 (검색, 필터링)
- `GET /api/restaurants/:id` - 음식점 상세 조회
- `POST /api/restaurants` - 음식점 생성 (인증 필요)
- `PUT /api/restaurants/:id` - 음식점 수정 (인증 필요)
- `POST /api/restaurants/:id/bookmark` - 북마크 토글 (인증 필요)
- `GET /api/restaurants/bookmarks` - 내 북마크 목록 (인증 필요)

### 리뷰 (Reviews)

- `POST /api/reviews` - 리뷰 작성 (인증 필요)
- `PUT /api/reviews/:id` - 리뷰 수정 (인증 필요)
- `DELETE /api/reviews/:id` - 리뷰 삭제 (인증 필요)
- `GET /api/reviews/user` - 내 리뷰 목록 (인증 필요)
- `GET /api/reviews/restaurant/:restaurantId` - 음식점 리뷰 목록

### 사용자 (Users)

- `GET /api/users/:id` - 사용자 프로필 조회
- `PUT /api/users/profile` - 프로필 수정 (인증 필요)

## 데이터베이스 스키마

주요 모델:
- User: 사용자
- Restaurant: 음식점
- Review: 리뷰 (한국인 맞춤 평가 항목 포함)
- Tag: 태그/카테고리
- RestaurantTag: 음식점-태그 매핑
- Bookmark: 북마크

자세한 스키마는 `prisma/schema.prisma` 참조

## 한국인 맞춤 기능

리뷰에 포함된 한국인 맞춤 평가:
- `goodForFamily`: 가족 동반 추천
- `noDiscrimination`: 인종차별 없음
- `authenticKorean`: 정통 한식 느낌
- `koreanFriendly`: 한국인 친화적

각 음식점의 `koreanStats`에서 집계된 통계를 확인할 수 있습니다.
