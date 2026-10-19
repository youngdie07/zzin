// 구글 시트: 확장 프로그램 > Apps Script 에 붙여넣고 addDropdowns 를 한 번 실행하세요.
function addDropdowns() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rows = Math.max(sheet.getMaxRows() - 1, 200);
  const clean = (s) => String(s).replace(/\(.*?\)/g, '').replace(/\s+/g, '');

  const single = {
    '영업상태': ['영업중', '폐업'],
    '맛스타일': ['한국 맛 그대로', '반반', '현지화됨'],
    '가성비': ['가성비 좋음', '가격만큼', '아쉬움'],
    '손님층': ['한국인 많음', '반반', '현지인 많음'],
    '팁': ['팁 안 받아요', '팁 포함', '팁 선택', '팁 필수'],
  };
  const multi = {
    '상황': ['가족 모임', '차별 없음', '한국인 입맛'],
    '키워드': ['한국어 주문 가능', '양 푸짐', '반찬 리필', '주차 편함', '웨이팅 적음', '웨이팅 김', '혼밥 OK', '소주·술 OK',
      '아이 동반 OK', '단체·회식 OK', '예약 필수', '깔끔·청결', '직원 친절', '늦게까지 영업', '포장 편함'],
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
