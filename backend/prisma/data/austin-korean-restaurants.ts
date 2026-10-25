// 웹 검색(Time Out, The Infatuation, Austin Chronicle, Community Impact, Yelp 등)으로 확인한 오스틴 한식당 목록.
// - lat/lng 는 좌표 조회 서비스 없이 입력한 "대략값"입니다. 구글 Places 연동 시 교체하세요.
// - priceRange 는 업종 기준 추정값입니다. 영업 여부/전화번호/가격은 구글맵에서 재확인 필요.
export interface RealRestaurant {
  name: string;
  nameKorean: string;
  address: string;
  lat: number;
  lng: number;
  cuisine: string;
  price: number;
  sub?: string; // 한식 세부 종류
  description: string;
  phone?: string;
  reviews: [];
}

const r = (x: Omit<RealRestaurant, 'reviews'>): RealRestaurant => ({ ...x, reviews: [] });

export const realRestaurants: RealRestaurant[] = [
  r({ name: 'Korea House', nameKorean: '코리아하우스', address: '2700 W Anderson Ln #501, Austin, TX 78757', lat: 30.359, lng: -97.7385, cuisine: '한식', sub: 'general', price: 2,
    description: '1988년부터 영업한 오스틴 최초의 한식당. 테이블 불판 바비큐와 불고기, 갈비탕, 비빔밥, 해물파전이 대표 메뉴.' }),
  r({ name: 'Chodang Tofu & BBQ', nameKorean: '초당 두부 & 바비큐', address: '11301 Lakeline Blvd, Austin, TX 78717', lat: 30.465, lng: -97.799, cuisine: '한식', sub: 'tofu', price: 2,
    description: '레이크라인 H마트 근처 파크라인 단지의 두부요리와 한국식 바비큐 전문점.' }),
  r({ name: 'SoGongDong Tofu House', nameKorean: '소공동 순두부', address: '11301 Lakeline Blvd, Austin, TX 78717', lat: 30.4652, lng: -97.7992, cuisine: '한식', sub: 'tofu', price: 2, phone: '(512) 485-0888',
    description: '부드러운 순두부찌개로 유명한 두부집. 김치찌개도 인기.' }),
  r({ name: 'Honey Pig BBQ', nameKorean: '허니피그', address: '11301 Lakeline Blvd Unit 7, Austin, TX 78717', lat: 30.4648, lng: -97.7988, cuisine: '한식', sub: 'bbq', price: 3,
    description: '레이크라인 H마트 근처의 한국식 철판·숯불 고기집.' }),
  r({ name: 'Gangnam Korean BBQ', nameKorean: '강남 코리안 바비큐', address: '1100 Little Texas Ln, Austin, TX 78745', lat: 30.217, lng: -97.768, cuisine: '한식', sub: 'bbq', price: 3, phone: '(512) 344-9945',
    description: '사우스 오스틴의 무한리필 한국 고기집. 2024 Yelp 오스틴 Top 50에 선정.' }),
  r({ name: 'Manna Korean Restaurant', nameKorean: '만나 한식당', address: '6808 N Lamar Blvd, Austin, TX 78752', lat: 30.334, lng: -97.719, cuisine: '한식', sub: 'general', price: 1,
    description: '노스 라마 거리의 작은 가정식 한식당. 갈비, 비빔밥, 김치전이 인기이고 포장 손님이 많음.' }),
  r({ name: 'Oseyo', nameKorean: '오세요', address: '1628 E Cesar Chavez St, Austin, TX 78702', lat: 30.2557, lng: -97.7205, cuisine: '한식', sub: 'general', price: 2,
    description: '이스트 오스틴의 모던 한식당. 사장님 어머니의 레시피에서 영감을 받은 메뉴와 정원 같은 마당 좌석.' }),
  r({ name: 'SOHA Korean Restaurant', nameKorean: '소하', address: '911 W Anderson Ln #114, Austin, TX 78757', lat: 30.3578, lng: -97.734, cuisine: '한식', sub: 'general', price: 2,
    description: '대부분의 날 새벽 2시까지 여는 한식 주점. 달콤매콤 치킨과 소주 안주.' }),
  r({ name: 'K-Bop', nameKorean: '케이밥', address: '2002 Guadalupe St, Austin, TX 78705', lat: 30.2867, lng: -97.742, cuisine: '한식', sub: 'bunsik', price: 1,
    description: 'UT 앞 대학가의 캐주얼 한식 덮밥·비빔밥집.' }),
  r({ name: "Chi'Lantro (Domain/Burnet)", nameKorean: '치란트로 (버넷)', address: '11005 Burnet Rd, Austin, TX 78758', lat: 30.3985, lng: -97.721, cuisine: '한식', sub: 'fusion', price: 1,
    description: '푸드트럭에서 시작한 한국-멕시칸 퓨전. 김치프라이와 불고기·돼지·닭 BBQ 볼.' }),
  r({ name: "Chi'Lantro (Downtown)", nameKorean: '치란트로 (다운타운)', address: '823 Congress Ave, Austin, TX 78701', lat: 30.2699, lng: -97.7424, cuisine: '한식', sub: 'fusion', price: 1,
    description: '다운타운 점심으로 좋은 한국식 BBQ 퓨전 볼과 김치프라이.' }),
  r({ name: 'Korean Grill', nameKorean: '코리안 그릴', address: '10901 N Lamar Blvd Ste B204, Austin, TX 78753', lat: 30.384, lng: -97.693, cuisine: '한식', sub: 'general', price: 2,
    description: '가족이 운영하는 노스 라마의 한식당. 불고기, 비빔밥, 해물파전과 해물 순두부가 인기. 보리차 무료, 평일 런치 해피아워.' }),
  r({ name: 'An Nyeong K Tofu & BBQ', nameKorean: '안녕 K 두부 & 바비큐', address: '5011 Burnet Rd, Austin, TX 78756', lat: 30.3189, lng: -97.7391, cuisine: '한식', sub: 'tofu', price: 2,
    description: '브렌트우드의 정통 한식당. 푸짐한 반찬, 순두부, 간장게장. 2024 Yelp 오스틴 Top 50에 선정.' }),
  r({ name: 'Seoulju Korean Kitchen & Bar', nameKorean: '서울주 키친 앤 바', address: '9515 N Lamar Blvd #230, Austin, TX 78753', lat: 30.372, lng: -97.696, cuisine: '한식', sub: 'pocha', price: 2,
    description: 'BBQ보다는 한식 가정식 중심의 코리안 키친 앤 바.' }),
  r({ name: "Mom's Taste", nameKorean: '맘스 테이스트 (반찬천국)', address: '6613 Airport Blvd, Austin, TX 78752', lat: 30.3265, lng: -97.7115, cuisine: '한식', sub: 'banchan', price: 1,
    description: '저렴하게 집밥 스타일 한식과 반찬을 파는 곳.' }),
  r({ name: 'Gen Korean BBQ House', nameKorean: '젠 코리안 바비큐', address: '6406 N Interstate 35 Frontage Rd, Austin, TX 78752', lat: 30.3295, lng: -97.7089, cuisine: '한식', sub: 'bbq', price: 3,
    description: '더 링크 쇼핑센터의 무한리필 고기집. 런치 약 $20, 디너 $30대 정액제.' }),
  r({ name: 'Gen Korean BBQ House (Pflugerville)', nameKorean: '젠 코리안 바비큐 (플루거빌)', address: '18900 Limestone Commercial Dr #100, Pflugerville, TX 78660', lat: 30.454, lng: -97.618, cuisine: '한식', sub: 'bbq', price: 3,
    description: '플루거빌의 무한리필 고기집 체인.' }),
  r({ name: 'KPOT Korean BBQ & Hot Pot', nameKorean: '케이팟', address: '5200 Brodie Ln, Austin, TX 78745', lat: 30.216, lng: -97.815, cuisine: '한식', sub: 'bbq', price: 3,
    description: '사우스 오스틴의 한국식 바비큐와 핫팟 무한리필.' }),
  r({ name: 'K-Ramyun', nameKorean: '케이라면', address: '1821 S Lakeline Blvd, Cedar Park, TX 78613', lat: 30.499, lng: -97.809, cuisine: '한식', sub: 'bunsik', price: 1,
    description: '시더파크의 한국식 라면·면 요리 전문점.' }),
  r({ name: 'Kochu Korean Eatery', nameKorean: '고추', address: '13450 Research Blvd Ste 118, Austin, TX 78750', lat: 30.439, lng: -97.759, cuisine: '한식', sub: 'general', price: 1, phone: '(512) 331-8168',
    description: '푸짐한 불고기 볼, 김치프라이, K-윙이 인기인 캐주얼 한식집.' }),
  r({ name: 'Charm BBQ Chicken', nameKorean: '참 BBQ 치킨', address: '12233 N RM 620 Ste 104, Austin, TX 78750', lat: 30.445, lng: -97.799, cuisine: '한식', sub: 'chicken', price: 2, phone: '(737) 203-8545',
    description: '노스웨스트 오스틴의 한국식 프라이드치킨 전문점. 불고기 플레이트, 오징어볶음, 전골도 판매.' }),
  r({ name: 'Bonchon Round Rock', nameKorean: '본촌치킨 라운드락', address: '2800 S I-35 Ste 120, Round Rock, TX 78664', lat: 30.495, lng: -97.687, cuisine: '한식', sub: 'chicken', price: 2, phone: '(512) 519-9175',
    description: '간장·매운 양념 한국식 프라이드치킨 체인. 비빔밥, 불고기도 판매. (2018년 개점 기사 기준, 영업 확인 필요)' }),
];
