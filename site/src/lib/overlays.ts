// Editorial overlays.
//
// NOTHING IN THIS FILE COMES FROM ../entries. These are groupings inferred by
// reading the lexicon, kept here so they are obvious and easy to disagree with.
// Change them freely; the site rebuilds around whatever you put here.

/** Which entries feel like they are about the same thing. Drives the sidebar. */
export const FAMILIES: [string, string[]][] = [
  ['反饋與控制', ['制衡負反饋', '描述—規範迴路', '認知成本制衡', '適應速率匹配', '同步張力', '風險記憶']],
  ['知識與客觀', ['事實符合性—事實不可達性', '客觀作為共享不變項', '觀點解讀器', '信號壓制—可恢復盲點']],
  ['模型與存在', ['預設存在體', '部分結構現實', '物理排列取捨']],
  ['潛勢與時間', ['潛勢寫入—情境實現', '過去鎖定—未來恢復']],
  ['權力與價值', ['槓桿化價值捕獲', '參數化政治觀']],
];

/**
 * The example tags in the entries are fine-grained: 行式資料庫, 創傷/風險記憶,
 * 戰時體制. Too many to pivot on directly, so they roll up into these buckets.
 * The original tag stays visible on every row.
 */
export const DOMAIN_BUCKETS: [string, string[]][] = [
  ['心智與經驗', ['心理', '個人認知', '個人記憶', '自我', '身分', '創傷', '創傷/風險記憶', '習慣養成', '人類技能', '教育', '視覺', '關係', '職涯', '人', '討論']],
  ['軟體、資料與 AI', ['程式', '軟體', '資料庫', 'API', '除錯', '行式資料庫', '列式資料庫', 'LLM', 'AI', '筆記分類']],
  ['組織與制度', ['組織', '組織設計', '平台治理', 'KPI', 'DSM', '排行榜', '法律']],
  ['科學與知識', ['科學', '哲學', '語言', '詞典', '新聞', '家譜']],
  ['政治與社會', ['政治', '民主', '威權', '戰時體制', '社會']],
  ['市場與商業', ['金融', '投資者', '品牌', '平台', '內容']],
  ['生物與生態', ['動物']],
];

/**
 * Words that appear across many 相近概念 tags without meaning anything on their
 * own. Without these the concept graph links entries through `theory` and `anti`.
 */
export const STOPWORDS = new Set([
  'of', 'the', 'to', 'for', 'as', 'and', 'a', 'an', 'in', 'on', 'like', 'vs', 'anti', 'theory',
]);
