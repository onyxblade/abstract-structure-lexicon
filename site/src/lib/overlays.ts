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

/**
 * What each section label is *doing*.
 *
 * Section labels in the entries are free-form and mostly one-offs: 42 distinct
 * labels across 17 entries, 36 of them used exactly once. Rendered in file
 * order they all look equally important, so 結構 and 數學類比 carry the same
 * weight and the page reads as a pile. A role says which station of the entry
 * a section belongs to, and the entry page lays itself out by station instead.
 *
 * `mechanism` is the entry's own flow. `retelling` is that same flow said again
 * in another domain or another direction, so it renders subordinate to it
 * rather than beside it.
 */
export type Role = 'mechanism' | 'retelling' | 'tension' | 'criterion' | 'part' | 'aside';

export const SECTION_ROLES: Record<string, Role> = {
  結構: 'mechanism',

  恢復結構: 'retelling',
  民主視角: 'retelling',
  '程序 / AI 版本': 'retelling',
  模型版本: 'retelling',
  人類版本: 'retelling',
  哲學版本: 'retelling',
  程序版本: 'retelling',
  多觀點版本: 'retelling',
  數學版本: 'retelling',
  數學類比: 'retelling',
  商業流程: 'retelling',
  傳播結構: 'retelling',
  同物異解: 'retelling',
  '與偏向—盲點的關係': 'retelling',

  核心張力: 'tension',
  失配: 'tension',
  失敗模式: 'tension',
  典型失敗: 'tension',
  限制: 'tension',
  底層限制: 'tension',

  核心判準: 'criterion',
  核心修正: 'criterion',
  核心洞察: 'criterion',
  使用原則: 'criterion',
  使用句: 'criterion',
  補償方式: 'criterion',
  盲點掃描: 'criterion',

  常見參數: 'part',
  傳播參數: 'part',
  常見增權因子: 'part',
  常見槓桿: 'part',
  簡化模型: 'part',
  三層區分: 'part',
  兩種不知道: 'part',
  分類: 'part',
  客觀層級: 'part',
  層級: 'part',
  認識論位置: 'part',

  價值: 'aside',
  詞庫賣點: 'aside',
  生物基礎: 'aside',
};

/**
 * The spine every entry page walks through, in this order. Entries fill some
 * stations and not others, and the ones they skip stay visible as gaps — the
 * same move the tensions and domains views already make.
 *
 * `roles` empty means the station is not built from body sections: 例子 and
 * 鄰接 come from the template fields and always exist.
 */
export const STATIONS: { key: string; name: string; hint: string; roles: Role[] }[] = [
  { key: 'how', name: '機制', hint: '結構本身，以及它在別的地方重講一次', roles: ['mechanism', 'retelling'] },
  { key: 'cost', name: '取捨', hint: '兩端各自失敗在哪裡', roles: ['tension'] },
  { key: 'tell', name: '判準', hint: '怎麼分辨，怎麼用', roles: ['criterion'] },
  { key: 'parts', name: '拆解', hint: '它由哪些具名的部分組成', roles: ['part'] },
  { key: 'note', name: '旁註', hint: '不屬於結構本身的補充', roles: ['aside'] },
  { key: 'cases', name: '例子', hint: '同一結構在不同領域的樣子', roles: [] },
  { key: 'near', name: '鄰接', hint: '相近的概念，以及共用概念的詞條', roles: [] },
];
