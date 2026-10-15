// 기본: 실제 오스틴 한식당(리뷰 없음). SEED_DEMO=1 이면 가상의 샘플 식당/리뷰도 추가 (실제 업체와 무관)
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { realRestaurants } from './data/austin-korean-restaurants';

const prisma = new PrismaClient();

// 플래그: f=가족 모임, d=차별 없음, a=진짜 한식 느낌, k=한국인 입맛
type Rev = [user: number, rating: number, flags: string, text: string];

interface Seed {
  name: string;
  nameKorean: string;
  address: string;
  lat: number;
  lng: number;
  cuisine: string;
  price: number;
  description: string;
  phone?: string;
  reviews: Rev[];
}

const users = [
  ['demo@zzin.app', '김민준'], ['seoyeon@zzin.app', '이서연'], ['jihoon@zzin.app', '박지훈'],
  ['yuna@zzin.app', '최유나'], ['daeun@zzin.app', '정다은'], ['sangwoo@zzin.app', '한상우'],
  ['sejin@zzin.app', '오세진'], ['haneul@zzin.app', '윤하늘']
];

const demoRestaurants: Seed[] = [
  {
    name: 'Seoul Jeong', nameKorean: '서울정', address: '2400 W Anderson Ln, Austin, TX', lat: 30.3545, lng: -97.7312,
    cuisine: '한식', price: 2,
    description: '순두부찌개와 갈비탕이 대표 메뉴인 가정식 한식당. 반찬이 리필되고 사장님이 한국분이라 주문이 편해요.',
    reviews: [
      [0, 5, 'fdak', '순두부 맛이 한국이랑 거의 똑같아요. 부모님 모시고 왔는데 반찬까지 만족하셨습니다.'],
      [1, 5, 'fdak', '오스틴에서 이 정도 갈비탕이면 만족. 점심시간엔 웨이팅이 있어요.'],
      [4, 4, 'fdak', '주차 넉넉하고 아이들 메뉴도 있어서 가족 외식으로 자주 와요.'],
      [6, 4, 'dak', '김치가 직접 담근 맛이에요. 가격이 조금 올랐지만 양은 그대로.']
    ]
  },
  {
    name: 'Gwanghwamun BBQ', nameKorean: '광화문 바비큐', address: '11301 Domain Dr, Austin, TX', lat: 30.4018, lng: -97.7254,
    cuisine: '한식', price: 3,
    description: '도메인 근처 고깃집. 직원이 불판을 직접 관리해주고 고기 질이 좋아요. 회식과 손님 접대에 추천.',
    reviews: [
      [2, 5, 'fdak', '한국 손님 접대용으로 딱입니다. 고기 퀄리티가 좋고 직원분들이 친절해요.'],
      [3, 4, 'fdk', '된장찌개와 냉면까지 제대로예요. 주말 저녁은 예약 필수.'],
      [5, 4, 'dak', '숯불 향이 좋아요. 환기가 약해서 옷에 냄새가 배는 건 감안하세요.'],
      [7, 5, 'fdak', '가족 모임 8명이 가도 자리 잡아줘서 편했어요.']
    ]
  },
  {
    name: 'Halmae Gukbap', nameKorean: '할매국밥', address: '8800 N Lamar Blvd, Austin, TX', lat: 30.3622, lng: -97.7021,
    cuisine: '한식', price: 1,
    description: '돼지국밥과 순대국이 전문인 해장 맛집. 오전 일찍부터 영업하고 현금 할인이 있어요.',
    reviews: [
      [5, 5, 'dak', '술 먹은 다음날 오면 살아납니다. 국물이 진짜 부산식이에요.'],
      [1, 4, 'dak', '혼밥하기 좋고 가격 착해요. 가족 모임보다는 간단한 식사용.'],
      [6, 5, 'dak', '순대국 국물이 진하고 깍두기가 맛있어요.']
    ]
  },
  {
    name: 'Lone Star Smokehouse', nameKorean: '론스타 스모크하우스', address: '1500 S Lamar Blvd, Austin, TX', lat: 30.2532, lng: -97.7627,
    cuisine: '양식', price: 2,
    description: '정통 텍사스 브리스킷 바비큐. 한국 손님도 많아서 고기 양념 없이도 담백하게 즐길 수 있어요.',
    reviews: [
      [2, 5, 'fd', '브리스킷이 입에서 녹아요. 김치랑 같이 먹으면 의외로 잘 어울립니다.'],
      [4, 4, 'fdk', '고기 양이 많아서 한국 가족이 나눠 먹기 좋아요. 사이드는 짠 편.'],
      [0, 4, 'd', '줄이 길지만 직원들이 친절하고 차별 느낌은 전혀 없었어요.']
    ]
  },
  {
    name: 'Capital City Burger', nameKorean: '캐피탈 시티 버거', address: '600 Congress Ave, Austin, TX', lat: 30.2661, lng: -97.7429,
    cuisine: '양식', price: 2,
    description: '다운타운의 수제버거집. 패티가 두툼한 미국식 버거로 짜지 않은 편이에요.',
    reviews: [
      [3, 4, 'd', '버거 자체는 훌륭한데 감자튀김 양이 너무 많아요. 둘이 하나만 시켜도 충분.'],
      [7, 3, '', '맛은 평범했고 다소 느끼해요. 한국인 입맛엔 호불호 있을 듯.'],
      [1, 4, 'dk', '피클과 소스가 과하지 않아서 좋았어요.']
    ]
  },
  {
    name: 'Sakura Omakase', nameKorean: '사쿠라 오마카세', address: '1100 S Congress Ave, Austin, TX', lat: 30.2509, lng: -97.7497,
    cuisine: '일식', price: 4,
    description: '카운터 12석의 오마카세. 셰프가 일본분이고 한국 손님이 많아서 설명도 세심해요.',
    reviews: [
      [2, 5, 'dak', '기념일에 갔는데 한국분들 취향에 맞게 와사비를 조절해 주셨어요.'],
      [4, 5, 'dk', '네타 신선도 최고. 가격은 높지만 오스틴에서는 손꼽히는 곳.'],
      [5, 4, 'd', '분위기 조용하고 예약 시간 엄격해요. 아이 동반은 비추.']
    ]
  },
  {
    name: 'Ramen Tatsu', nameKorean: '라멘 타츠', address: '2800 Guadalupe St, Austin, TX', lat: 30.2958, lng: -97.7417,
    cuisine: '일식', price: 2,
    description: 'UT 근처 돈코츠 라멘집. 면 굵기와 국물 농도를 고를 수 있어요.',
    reviews: [
      [7, 5, 'dk', '국물이 진한데 느끼하지 않아요. 밥 말아 먹으면 끝!'],
      [0, 4, 'dk', '대학생 가격으로 푸짐하게 먹을 수 있어요. 줄이 좀 있어요.'],
      [3, 4, 'd', '혼자 먹기 좋고 직원들이 빨라요.']
    ]
  },
  {
    name: 'Golden Dragon Palace', nameKorean: '골든 드래곤 팰리스', address: '10900 Research Blvd, Austin, TX', lat: 30.4026, lng: -97.7366,
    cuisine: '중식', price: 2,
    description: '광동식 딤섬과 사천요리를 하는 중식당. 큰 원탁이 있어 대가족 모임에 좋아요.',
    reviews: [
      [6, 4, 'fd', '주말 딤섬 카트가 재밌고 원탁이 있어서 부모님 모시고 가기 좋아요.'],
      [1, 4, 'fk', '마파두부가 한국식 중국집 맛은 아니지만 정통 사천 스타일로 괜찮아요.'],
      [2, 5, 'fdk', '짬뽕 느낌의 해물면이 있어요. 한국인 입맛에 잘 맞아요.']
    ]
  },
  {
    name: 'Bangkok Garden', nameKorean: '방콕 가든', address: '1700 S 1st St, Austin, TX', lat: 30.2457, lng: -97.7571,
    cuisine: '태국', price: 2,
    description: '팟타이와 똠얌이 맛있는 태국 음식점. 맵기를 5단계로 조절할 수 있어요.',
    reviews: [
      [4, 5, 'dk', '똠얌 국물이 시원해서 해장용으로도 좋아요. 맵기 3단계가 딱 한국 매운맛.'],
      [5, 4, 'd', '팟타이가 달지 않아서 좋아요. 직원분들 친절.'],
      [3, 4, 'dk', '그린커리와 밥 조합이 훌륭합니다.']
    ]
  },
  {
    name: 'La Cantina Verde', nameKorean: '라 칸티나 베르데', address: '1900 E 6th St, Austin, TX', lat: 30.2636, lng: -97.7248,
    cuisine: '멕시칸', price: 2,
    description: '이스트 오스틴의 텍스멕스 레스토랑. 타코와 파히타가 인기고 해피아워가 유명해요.',
    reviews: [
      [0, 5, 'dk', '타코 가격 대비 최고. 살사가 매콤해서 한국인 입맛에 잘 맞아요.'],
      [7, 4, 'd', '분위기가 활기차고 야외석이 좋아요.'],
      [5, 4, 'fd', '가족 단위 손님이 많아서 아이 데려가도 눈치 안 보여요.']
    ]
  },
  {
    name: 'Pho Saigon House', nameKorean: '포 사이공 하우스', address: '10901 N Lamar Blvd, Austin, TX', lat: 30.3768, lng: -97.6984,
    cuisine: '베트남', price: 1,
    description: '쌀국수와 반미가 주력. 육수가 깔끔하고 한국인 단골이 많은 베트남 식당.',
    reviews: [
      [1, 5, 'dk', '국물이 맑고 깊어요. 반미 샌드위치도 간단하게 먹기 좋아요.'],
      [6, 4, 'fdk', '가격이 착하고 가족이 가도 부담 없어요.'],
      [2, 4, 'dk', '고수를 빼달라고 하면 바로 해줘요.']
    ]
  },
  {
    name: 'Trattoria Bella', nameKorean: '트라토리아 벨라', address: '4000 Bee Cave Rd, Austin, TX', lat: 30.2785, lng: -97.7905,
    cuisine: '이탈리안', price: 3,
    description: '생면 파스타를 직접 만드는 이탈리안. 와인 리스트가 좋아서 데이트나 모임에 어울려요.',
    reviews: [
      [3, 5, 'fd', '생면 파스타 식감이 훌륭하고 서버가 와인을 잘 추천해줘요.'],
      [4, 4, 'd', '분위기 좋고 양이 적당해요. 예약 추천.'],
      [5, 3, 'd', '맛은 좋은데 소금간이 센 편입니다.']
    ]
  },
  {
    name: 'Hill Country Brunch Co.', nameKorean: '힐 컨트리 브런치', address: '1200 E 11th St, Austin, TX', lat: 30.2693, lng: -97.7318,
    cuisine: '브런치', price: 2,
    description: '주말 브런치로 유명한 카페 겸 레스토랑. 팬케이크와 에그 베네딕트가 인기예요.',
    reviews: [
      [7, 4, 'fd', '주말 브런치로 가족이랑 가기 좋고 아이용 메뉴도 있어요.'],
      [4, 5, 'dk', '에그 베네딕트가 정말 맛있고 커피도 훌륭합니다.'],
      [0, 4, 'd', '웨이팅이 길지만 대기 중 커피 서비스가 있어요.']
    ]
  },
  {
    name: 'Kimchi Taco Truck', nameKorean: '김치 타코 트럭', address: '1600 E Cesar Chavez St, Austin, TX', lat: 30.2559, lng: -97.7288,
    cuisine: '퓨전', price: 1,
    description: '불고기 타코와 김치 퀘사디아를 파는 푸드트럭. 한국인 주인이 운영해서 맛이 익숙해요.',
    reviews: [
      [2, 5, 'dak', '불고기 타코는 소스가 정말 한국 맛이에요. 향수병 날 때 가요.'],
      [3, 4, 'dak', '김치 퀘사디아가 별미. 가격도 착합니다.'],
      [0, 5, 'dak', '사장님이 한국분이라 주문하기 편하고 양 많이 주세요.'],
      [5, 4, 'dk', '포장해서 공원에서 먹기 좋아요.']
    ]
  }
];

async function main() {
  await prisma.bookmark.deleteMany();
  await prisma.review.deleteMany();
  await prisma.restaurantTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('demo1234', 10);
  const createdUsers = [];
  for (const [email, name] of users) {
    createdUsers.push(await prisma.user.create({ data: { email, name, password, isKorean: true } }));
  }

  const demo = process.env.SEED_DEMO
    ? demoRestaurants.map((d) => ({
        ...d,
        phone: '(512) 555-' + String(Math.floor(100 + Math.random() * 900)).padStart(4, '0')
      }))
    : [];
  const restaurants: Seed[] = [...realRestaurants, ...demo];

  for (const r of restaurants) {
    const restaurant = await prisma.restaurant.create({
      data: {
        name: r.name,
        nameKorean: r.nameKorean,
        address: r.address,
        latitude: r.lat,
        longitude: r.lng,
        phoneNumber: r.phone ?? null,
        cuisineType: r.cuisine,
        priceRange: r.price,
        description: r.description,
        images: '[]'
      }
    });

    for (const [u, rating, flags, text] of r.reviews) {
      await prisma.review.create({
        data: {
          userId: createdUsers[u].id,
          restaurantId: restaurant.id,
          rating,
          content: text,
          images: '[]',
          tasteRating: rating,
          serviceRating: Math.max(1, rating - (flags.includes('d') ? 0 : 1)),
          atmosphereRating: Math.max(1, rating - (u % 2)),
          goodForFamily: flags.includes('f'),
          noDiscrimination: flags.includes('d'),
          authenticKorean: flags.includes('a'),
          koreanFriendly: flags.includes('k'),
          likes: (u * 3 + rating) % 9
        }
      });
    }
  }

  console.log(`시드 완료: 사용자 ${users.length}명, 음식점 ${restaurants.length}곳`);
  console.log('데모 계정: demo@zzin.app / demo1234');
}

main().finally(() => prisma.$disconnect());
