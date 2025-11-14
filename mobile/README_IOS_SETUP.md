# iOS 설정 가이드 (맥북)

## 1. 필수 도구 설치

### Xcode 설치
- App Store에서 Xcode 설치
- Xcode Command Line Tools 설치:
  ```bash
  xcode-select --install
  ```

### CocoaPods 설치
```bash
sudo gem install cocoapods
```

## 2. iOS 프로젝트 생성

현재 프로젝트에 `ios` 폴더가 없으므로 생성해야 합니다.

### 방법 1: React Native CLI로 iOS 프로젝트 생성 (권장)
```bash
cd mobile
npx react-native init TempProject --skip-install
# TempProject/ios 폴더를 현재 프로젝트로 복사
cp -r TempProject/ios .
rm -rf TempProject
```

### 방법 2: 수동으로 ios 폴더 생성
React Native 0.73 버전에 맞는 ios 프로젝트 구조를 생성해야 합니다.

## 3. 의존성 설치

```bash
cd mobile/ios
pod install
cd ..
```

## 4. 앱 실행

```bash
# Metro bundler 시작 (별도 터미널)
npm start

# iOS 시뮬레이터에서 실행
npm run ios

# 또는 특정 시뮬레이터 지정
npm run ios -- --simulator="iPhone 15"
```

## 5. 실제 기기에서 실행

1. Xcode에서 `ios/ZZIN.xcworkspace` 열기
2. 상단에서 기기 선택
3. 개발자 계정으로 Signing 설정
4. Run 버튼 클릭

## 주의사항

- `react-native-maps`를 사용하므로 iOS에서도 추가 설정이 필요할 수 있습니다.
- `Info.plist`에 위치 권한 설정이 필요할 수 있습니다.

