# site

詞庫的網頁版。讀 `../entries/*.md`，不寫回去。

```
npm run dev       # 開發，改 ../entries 會即時反映
npm run verify    # 檢查渲染，並列出詞庫目前的缺口
npm run build     # 靜態站 → dist/
npm run check     # TypeScript
```

## 三個視圖

| 路由 | 是什麼 |
| --- | --- |
| `/` | 全部詞條的一句話定義，依 family 分組 |
| `/entries/<名稱>/` | 單一詞條，`結構：` 區塊畫成圖 |
| `/domains/` | 把所有例子按領域重排，看同一結構跨領域的樣子 |
| `/tensions/` | 所有核心張力，加上還沒寫張力的詞條 |

## 要改什麼，動哪裡

| 想改 | 檔案 |
| --- | --- |
| 顏色、字體、間距 | `src/styles/tokens.css` |
| 結構圖長什麼樣 | `src/styles/structure.css` |
| 結構語法怎麼被認出來 | `src/lib/structure.ts` |
| family 分組、領域分桶、停用詞 | `src/lib/overlays.ts` |
| 詞條頁的排版 | `src/pages/entries/[name].astro` |

## 兩層資料

`src/lib/parse.ts` 跟 `src/lib/structure.ts` 只反映 `../entries` 裡真的有的東西。

`src/lib/overlays.ts` 全部是推斷出來的：詞條的 family 分組、例子領域的分桶、
概念圖的停用詞。這些不在原始檔案裡，改它不會動到詞庫。

## 結構語法

`結構：` 底下的 fenced block 是一套非正式的 pseudo-code。渲染器認得這些：

| 寫法 | 畫成 |
| --- | --- |
| 行首 `→` | 直向流程，步驟間有連接線 |
| 行中 `→` | 橫向節點鏈 |
| 多行都是 `A → B` | 對齊的兩欄 |
| 在 `核心張力：` 底下的兩三行 | 左右對立的兩極卡片 |
| `A ≠ B` | 對照 |
| `A ↔ B` | 一條軸 |
| `A = B` | 公式，原樣保留 |
| `甲、乙、丙` | 一組 chip |

空行把一個 block 切成互不相干的組。認不出來的行會變成純文字，不會消失，
`npm run verify` 會確認這一點。
