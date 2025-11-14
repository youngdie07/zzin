# ZZIN (찐) - 오스틴 한인 맛집 앱

텍사스 오스틴의 한국인을 위한 맞춤형 맛집 리뷰 플랫폼

## 프로젝트 개요

ZZIN은 오스틴 지역의 모든 음식점을 대상으로 하되, 한국인의 시각과 취향을 반영한 리뷰와 평가를 제공하는 모바일 앱입니다.

### 주요 특징

- **한국인 중심 리뷰**: 한국인이 작성한 리뷰와 평가만 수집
- **맞춤형 카테고리**:
  - 한국인 가족과 함께 가기 좋은 곳
  - 인종차별 걱정 없는 곳
  - 정통 한식/한국 스타일
  - 한국인 입맛에 맞는 곳
- **상황별 필터링**: 다양한 상황과 목적에 맞는 음식점 추천
- **지도 기반 검색**: 현재 위치 기반 음식점 탐색

## 기술 스택

### Frontend (Mobile)
- React Native + TypeScript
- React Navigation
- React Native Maps
- Axios (API 통신)

### Backend
- Node.js + Express + TypeScript
- PostgreSQL (데이터베이스)
- Prisma (ORM)
- JWT (인증)

## 프로젝트 구조

```
zzin/
├── mobile/           # React Native 앱
├── backend/          # Node.js API 서버
├── shared/           # 공통 타입 정의
└── docs/             # 문서
```

## 시작하기

### 개발 환경 요구사항
- Node.js 18+
- PostgreSQL 14+
- React Native CLI
- iOS: Xcode (macOS)
- Android: Android Studio

### 설치 및 실행

각 디렉토리의 README를 참고하세요.

## 라이선스

MIT License
