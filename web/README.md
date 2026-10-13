# ZZIN Web App

오스틴 한인 맛집 앱 - React 웹 애플리케이션

## 기술 스택

- React 18 + TypeScript
- Vite (빌드 도구)
- React Router (라우팅)
- Axios (API 통신)
- React Leaflet (지도)

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

웹 앱이 http://localhost:3001 에서 실행됩니다.

### 3. 백엔드 연동

백엔드 API 서버가 http://localhost:3000 에서 실행 중이어야 합니다.

```bash
# 다른 터미널에서
cd ../backend
npm run dev
```

## 빌드

```bash
npm run build
npm run preview
```

## 주요 기능

- ✅ 음식점 목록 (카테고리 필터, 한국인 맞춤 필터)
- ✅ 음식점 상세 정보
- ✅ 검색
- ✅ 북마크
- ✅ 리뷰 작성
- ✅ 로그인/회원가입
- ✅ 마이페이지

## 프로젝트 구조

```
web/
├── src/
│   ├── components/    # 재사용 컴포넌트
│   ├── pages/         # 페이지 컴포넌트
│   ├── services/      # API 서비스
│   ├── types/         # TypeScript 타입
│   └── styles/        # CSS 스타일
├── index.html
└── vite.config.ts
```

## 배포

Vercel, Netlify 등에서 쉽게 배포 가능합니다.

환경 변수 설정:
- `VITE_API_URL`: 백엔드 API 주소 (프로덕션)

## PWA 지원

향후 PWA로 확장하여 모바일 앱처럼 설치 가능하게 할 수 있습니다.
