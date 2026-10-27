// 구글 시트: 확장 프로그램 > Apps Script 에 붙여넣고 addDropdowns 를 한 번 실행하세요.
function addDropdowns() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rows = Math.max(sheet.getMaxRows() - 1, 200);
  const clean = (s) => String(s).replace(/\(.*?\)/g, '').replace(/\s+/g, '');

  const single = {
    '영업상태': ['영업중', '폐업'],
    '세부종류': ['종합 한식', '고기구이', '순두부·찌개', '국밥·탕', '치킨', '분식', '포차·술집', '반찬·도시락', '퓨전', '카페·디저트'],
    '가격대': ['$10 미만', '$10–20', '$20–30', '$30–50', '$50–100', '$100 이상'],
    // 한식은 앞의 세 개(한식 스타일), 다른 음식은 뒤의 네 개(본토 느낌)
    '본토느낌': ['요즘 한국 스타일', '그 시절 한국 맛', '미국식 한식', '본토 맛 그대로', '반반', '미국식', '체인점 스타일'],
    '가성비': ['가성비 좋아요', '적당해요', '가격대 있어요'],
    '손님층': ['한국인 많음', '반반', '현지인 많음'],
    '팁': ['팁 안 받아요', '팁 포함', '팁 선택', '팁 필수'],
  };
  const multi = {
    '상황': ['혼밥', '친구랑', '아이 동반', '단체'],
    '키워드': ['한국어 주문 가능', '양 푸짐', '반찬 리필', '주차 편함', '웨이팅 적음', '웨이팅 김', '소주·술 OK', '예약 필수',
      '깔끔·청결', '직원 친절', '늦게까지 영업', '포장 편함', '배달 전문', '푸드트럭', '푸드코트'],
  };

  header.forEach((h, i) => {
    const col = i + 1;
    const key = clean(h);
    if (single[key]) {
      const rule = SpreadsheetApp.newDataValidation().requireValueInList(single[key], true).setAllowInvalid(false).build();
      sheet.getRange(2, col, rows, 1).setDataValidation(rule);
    }
    if (multi[key]) {
      sheet.getRange(1, col).setNote('쉼표(,)로 여러 개 입력 가능:\n' + multi[key].join(', '));
    }
  });
}
