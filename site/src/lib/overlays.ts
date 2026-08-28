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

/**
 * Traits.
 *
 * The entries do not form an inheritance tree. Scanning all 17 for one entry
 * being *a kind of* another turns up exactly one case, 風險記憶 appearing
 * inside 潛勢寫入—情境實現, and it is written there as an example rather than
 * as a relation. What the entries actually share is parts. So a trait names one
 * recurring mechanical part, an entry is the set of traits it carries, and two
 * entries are close when they are built from the same parts — composition, not
 * descent.
 *
 * `test` is the question you ask an entry to decide whether it carries the
 * trait. It is there so the assignment below can be argued with instead of
 * just believed.
 */
export type TraitId =
  | 'loop'
  | 'weight'
  | 'store'
  | 'recover'
  | 'mediate'
  | 'interpreters'
  | 'amplify'
  | 'carve'
  | 'total'
  | 'graded';

/**
 * A trait, told from the shallow end.
 *
 * 潛伏 and 程度 mean nothing the first time you read them, and a gloss does not
 * fix that: a gloss is a definition, and a definition assumes you already know
 * what kind of thing is being defined. The one-word name is the *last* thing
 * you learn about a concept, not the first. It is a compression, and a
 * compression only pays once you are already holding the thing it compresses.
 *
 * So a trait carries a ladder rather than a definition, climbed in this order:
 *
 *   plain  one ordinary sentence, nothing in it to look up
 *   first  one concrete situation, before anything has a name
 *   pair   two cases differing only in this trait, and what that shows
 *   test   the question you ask an entry
 *   name   the word at last, and why this word
 *   gloss  the same thing said abstractly
 *   form   the shape written out
 *
 * `needs` is the other half: which traits have to be held before this one can
 * be taught at all. That is a teaching order, and it is not the lattice order.
 * The two agree that 全定義 comes after 切分 and 多解讀器 after 中介. They
 * disagree about 可逆, which is learned from 潛伏 but which in this lexicon
 * only ever occurs alongside 權重 — so that implication is a fact about these
 * seventeen entries rather than about the concept, and the likeliest of the
 * three to be broken by the next entry. src/lib/traits.ts computes both.
 */
export interface Trait {
  id: TraitId;
  plain: string;
  first: string;
  /** `a` lacks the trait, `b` has it, and `point` is what the difference buys. */
  pair: { a: string; b: string; point: string };
  test: string;
  name: string;
  why: string;
  gloss: string;
  form: string;
  needs: TraitId[];
}

export const TRAITS: Trait[] = [
  {
    id: 'loop',
    plain: '結果會回頭改變原因。',
    first:
      '公司訂了一個指標，本來只是想知道事情做得怎麼樣。量了半年之後，大家開始為了那個數字做事，於是指標量到的已經不是原來那件事了。',
    pair: {
      a: '溫度計量房間幾度。量完，房間還是那麼熱。',
      b: '溫控器量房間幾度，太冷就開暖氣。量完，房間就不一樣了。',
      point: '差別不在量得準不準，在「量」這個動作有沒有接回去。',
    },
    test: '走完一圈之後，起點的值變了嗎？',
    name: '迴路',
    why: '叫迴路，因為它繞回來了。只要繞回來，它就會自己餵自己，不需要有人一直推。',
    gloss: '輸出繞回輸入端，結構會餵養自己',
    form: '量測 → 行動 → 被量的東西變了 → 量測',
    needs: [],
  },
  {
    id: 'weight',
    plain: '東西都在，但只有一個出得來。',
    first:
      '你同時想睡、想把手上的事做完、想回一則訊息。三件事都在，能力也都有，最後只做了一件。沒被做的那兩件並沒有消失，它們只是輸了。',
    pair: {
      a: '行李箱塞不下第二雙鞋，因為真的沒有空間。',
      b: '行李箱塞得下，你還是只帶一雙，因為另一雙比較不重要。',
      point: '前者是容量，後者是權重。看起來都是「放不進去」，能動的地方完全不同。',
    },
    test: '東西都在，為什麼只有一個出得來？',
    name: '權重',
    why: '叫權重，因為輸掉的東西沒有被拿走，只是分到的數字比較小。數字是可以改的。',
    gloss: '幾個都在場的輸入，按權重爭同一條輸出路徑',
    form: '出來的 = Σ wᵢ × 進去的ᵢ，只有 w 大的看得見',
    needs: [],
  },
  {
    id: 'store',
    plain: '現在寫下去，以後才算數。',
    first:
      '被狗咬過一次，當下只是痛。三年後看到狗還是會退一步，儘管那三年裡什麼都沒發生。那三年，它一直放在某個地方。',
    pair: {
      a: '按下開關，燈就亮了。',
      b: '買了保險，二十年後才用到。',
      point: '中間那段從外面什麼都看不出來，但東西在裡面。看不出來不等於沒有。',
    },
    test: '寫入和生效之間隔了多久？',
    name: '潛伏',
    why: '叫潛伏，是借潛伏期的意思：已經進去了，還沒發作，而它一直在。',
    gloss: '現在寫進去的不在現在生效，中間有一個存放處',
    form: '寫入（t₀） → 存放 → 條件到了 → 生效（t₁）',
    needs: [],
  },
  {
    id: 'recover',
    plain: '被壓住的東西還能再叫出來。',
    first:
      '想不起一個人的名字。別人提第一個字，馬上就想起來了。名字一直都在，只是剛剛拿不到。',
    pair: {
      a: '檔案刪了，那塊硬碟也被覆寫過。',
      b: '檔案還在資源回收筒。',
      point: '兩個都叫「不見了」，只有一個回得來。分不出來，就會在沒救的地方硬撐，在有救的地方放棄。',
    },
    test: '有沒有一條路回得去？',
    name: '可逆',
    why: '叫可逆，因為關鍵不在有沒有壞掉，在那個方向能不能倒過來走。',
    gloss: '狀態能被後來的信號解除，不是單向的',
    form: '狀態 → 被壓住 → 一個提示 → 狀態回來',
    needs: ['store'],
  },
  {
    id: 'mediate',
    plain: '你摸得到的只是它的替身。',
    first:
      '你說「那條路在塞車」。你並沒有站在那條路上，你看的是地圖上一條變紅的線。你可以把那條線改成綠的，路還是塞的。',
    pair: {
      a: '路在塞車。',
      b: '地圖說路在塞車。',
      point: '能單獨被改動的那一層就是中介層。它存在的證據，就是它可以錯。',
    },
    test: '拿掉中介層之後還剩下什麼？',
    name: '中介',
    why: '叫中介，因為中間那層擋不掉。不是碰不到，是只碰得到它。',
    gloss: '只碰得到表徵，碰不到被表徵的那個東西',
    form: '世界 → 表徵 → 你，而你只在最後一段',
    needs: ['carve'],
  },
  {
    id: 'interpreters',
    plain: '要有第二個人，這句話才講得完。',
    first:
      '同一場會議，兩個人回去各講一個版本。兩邊都講到的那一段，你會比較敢當成真的發生過。',
    pair: {
      a: '這杯咖啡對我來說太苦。',
      b: '這杯咖啡真的很苦。',
      point: '第二句偷偷需要別人。只剩一個人的時候，它跟第一句沒有差別。',
    },
    test: '只剩一個人時，這句話還成立嗎？',
    name: '多解讀器',
    why: '叫多解讀器，因為重點不是人多，是有幾個獨立的解讀端。儀器也算一個。',
    gloss: '至少要兩個解讀者才講得完這個結構',
    form: '客觀 = A 的解讀 ∩ B 的解讀，交集越大越硬',
    needs: ['mediate'],
  },
  {
    id: 'amplify',
    plain: '出來的比進去的多。',
    first:
      '一則貼文一個人寫，一百萬個人看到。寫的那個人並沒有多花一百萬倍的力氣。',
    pair: {
      a: '要搬十箱書，就得搬十趟。',
      b: '寫一次腳本，跑十萬次。',
      point: '有放大的地方，投入和結果不再成比例，於是「誰拿到那個倍數」就變成一個問題。',
    },
    test: '投入加一倍，輸出加幾倍？',
    name: '放大',
    why: '叫放大，是借放大器：訊號本身沒變，只是被乘上一個大於一的數。',
    gloss: '一份投入產生多於一份的輸出或影響',
    form: '輸出 = k × 輸入，k > 1',
    needs: [],
  },
  {
    id: 'carve',
    plain: '線是人畫的，畫在哪裡有代價。',
    first:
      '把筆記分資料夾。分完之後，同時屬於兩個資料夾的東西就沒地方放，你只能挑一邊，或者再開一個資料夾。',
    pair: {
      a: '同一批資料按行存：查一整筆很快，統計一個欄位很慢。',
      b: '同一批資料按列存：統計一個欄位很快，查一整筆很慢。',
      point: '資料一個字都沒變，只有切法變了，代價就換到另一邊。可見代價是切法的性質，不是資料的性質。',
    },
    test: '這條線是誰畫的，換一條會怎樣？',
    name: '切分',
    why: '叫切分，因為那一刀一定要下。問題從來不是切不切，是切在哪裡。',
    gloss: '得先把連續的東西切成具名的部分，切法本身帶著代價',
    form: '連續的東西 → 具名的部分 ＋ 切在這裡的代價',
    needs: [],
  },
  {
    id: 'total',
    plain: '模型要求每一格都有值，現實只是通常有。',
    first:
      '家譜要求每個人都有父親。一路往上追，最早那個人的那一格要填什麼？填他自己就變成循環，留白就違反規則。',
    pair: {
      a: 'f: A → B，每個 a 都保證有 f(a)。',
      b: 'f: A ⇀ B，有些 a 就是沒有。',
      point: '出事的地方永遠是起點、邊界、缺漏和例外，因為那正是「每一個」開始不成立的地方。',
    },
    test: '起點和邊界那一格填什麼？',
    name: '全定義',
    why: '叫全定義，因為模型宣稱自己處處有定義，而問題就出在「處處」這兩個字。',
    gloss: '模型要求處處有值，現實只是通常有',
    form: '該寫 f: A ⇀ B 的地方，寫成了 f: A → B',
    needs: ['carve'],
  },
  {
    id: 'graded',
    plain: '問的不是有沒有，是多少。',
    first:
      '問一個人「你信任我嗎」，只有兩個答案，而且哪一個都不太對。問「你有多信任我」，就有一條線，位置還會隨事情移動。',
    pair: {
      a: '他是不是客觀的？',
      b: '這件事有多客觀，在誰跟誰之間？',
      point: '換掉的不是答案，是問題的形狀。第二種問法一問出口，就同時逼出了刻度和範圍。',
    },
    test: '問的是它有多少，還是它是不是？',
    name: '程度',
    why: '叫程度，因為它把一個身分換成一條刻度。權重是它的一個特例：那條刻度拿來決定誰出得來。',
    gloss: '用一條連續的量取代是非題',
    form: '是非題 {0, 1} → 一條量 [0, 1]',
    needs: ['weight'],
  },
];

/** Which traits each entry is built from. Order inside a row is not meaningful. */
export const ENTRY_TRAITS: Record<string, TraitId[]> = {
  '描述—規範迴路': ['loop', 'store', 'amplify'],
  風險記憶: ['store', 'weight', 'recover'],
  同步張力: ['weight', 'store', 'graded'],
  適應速率匹配: ['weight', 'recover', 'graded'],
  制衡負反饋: ['loop', 'amplify', 'graded'],
  參數化政治觀: ['loop', 'graded'],
  認知成本制衡: ['loop', 'graded'],
  物理排列取捨: ['carve'],
  '潛勢寫入—情境實現': ['store', 'weight'],
  '過去鎖定—未來恢復': ['loop', 'weight', 'store', 'recover'],
  預設存在體: ['total', 'carve', 'mediate'],
  部分結構現實: ['total', 'carve'],
  槓桿化價值捕獲: ['amplify', 'graded'],
  客觀作為共享不變項: ['mediate', 'interpreters', 'carve', 'graded'],
  觀點解讀器: ['mediate', 'interpreters', 'amplify'],
  '事實符合性—事實不可達性': ['mediate', 'graded'],
  '信號壓制—可恢復盲點': ['weight', 'recover', 'mediate'],
};
