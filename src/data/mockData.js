// 假資料：先讓畫面能跑起來，之後再換成 Firebase 的資料

export const salesperson = {
  name: '張偉明',
  title: '資深業務 · 台北旗艦展間',
  email: 'wei.chang@carbrand.com',
  phone: '0912-345-678',
  dealsThisMonth: 2,
};

export const stats = {
  customersThisMonth: 12,
  pending: 4,
  dealsThisWeek: 2,
};

// temperature：hot 熱 / warm 溫 / cold 冷
export const initialCustomers = [
  { id: 'c1', name: '陳志豪', note: '太太預產 · 月底前要定車', temperature: 'hot' },
  { id: 'c2', name: '林雅婷', note: '喜歡喝紅酒 · GLC 試乘', temperature: 'warm' },
  { id: 'c3', name: '王建國', note: '養貓 · 看過 Volvo XC60', temperature: 'cold' },
];

// VoiceRec 即時逐字稿
export const transcript = [
  { id: 't1', speaker: 'sales', text: '上次您說對 BMW X5 比較有興趣，今天想看看實車嗎？' },
  {
    id: 't2',
    speaker: 'customer',
    text: '對，我太太說她喜歡白色的，不過她快生了，我想在她月子前就把車定下來。預算想控制在 170 萬左右，配備要有 ADAS。',
  },
];
export const detectedKeywords = ['太太快生了', '白色偏好', '170萬預算', 'ADAS需求'];

// AI 智慧摘要（兩個 Agent 的結果）
export const analysis = {
  c1: {
    hard: [
      { label: '車款', value: 'BMW X5 / Benz GLC' },
      { label: '顏色', value: '白色（太太偏好）' },
      { label: '預算', value: '150–170 萬' },
      { label: '配備', value: 'ADAS 主動安全系統' },
      { label: '用途', value: '家庭用、嬰兒車空間需求' },
    ],
    emotion: [
      { label: '家庭', value: '太太下個月中預產' },
      { label: '時間', value: '希望月子前定車' },
      { label: '心理', value: '決策壓力大，需快確認' },
    ],
  },
};

// 回訪軍師
export const revisit = {
  c1: {
    daysSinceLast: 7,
    summary: '太太預產期快到，是關鍵決策點。建議先問候，再切入報價。',
    openers: [
      { title: '情感開場', text: '上次聽你說太太快生了，這幾天狀況還好嗎？月子中心都安排好了嗎？' },
      { title: '需求確認', text: '白色 X5 的現車我幫你確認好了，嬰兒車放進去沒問題，我們去看看？' },
      { title: '時間緊迫感', text: '月底前訂車我可以幫你申請到額外的配件優惠，這週應該是最好的時機。' },
    ],
    avoid: ['預算 150–170萬', 'ADAS 配備', '白色偏好'],
  },
};
