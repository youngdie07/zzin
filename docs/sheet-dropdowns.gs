// 구글 시트: 확장 프로그램 > Apps Script 에 붙여넣고 addDropdowns 를 한 번 실행하세요.
function addDropdowns() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rows = Math.max(sheet.getMaxRows() - 1, 200);
  const clean = (s) => String(s).replace(/\(.*?\)/g, '').replace(/\s+/g, '');

  const single = {
    '영업상태': ['영업중', '폐업'],
    '본토느낌': ['본토 맛 그대로', '반반', '미국식', '체인점 스타일'],
    '한국인입맛': ['잘 맞아요', '무난해요', '안 맞아요'],
    '가성비': ['가성비 좋음', '가격만큼', '아쉬움'],
    '손님층': ['한국인 많음', '반반', '현지인 많음'],
    '팁': ['팁 안 받아요', '팁 포함', '팁 선택', '팁 필수'],
  };
  const multi = {
    '입맛포인트': ['많이 짜요', '많이 달아요', '느끼해요', '매콤해요', '담백해요', '밥 생각나는 맛', '국물 있음', '해장 가능'],
    '상황': ['가족 모임', '부모님 모시고', '아이 동반', '데이트', '회식·단체', '혼밥', '차별 없음'],
    '키워드': ['한국어 주문 가능', '양 푸짐', '반찬 리필', '주차 편함', '웨이팅 적음', '웨이팅 김', '소주·술 OK', '예약 필수',
      '깔끔·청결', '직원 친절', '늦게까지 영업', '포장 편함'],
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
