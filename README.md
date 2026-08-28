# Abstract Structure Lexicon

merely 的抽象結構 / pattern 詞庫。網頁版：<https://onyxblade.github.io/abstract-structure-lexicon/>

- `abstract-structure-lexicon.md`：索引與詞條模板
- `entries/`：每個詞條一個 Markdown 文件
- `site/`：詞庫的網頁版，由 `entries/` 產生（見 [site/README.md](site/README.md)）

`entries/` 是唯一的 source of truth。`site/` 只讀不寫，刪掉也不影響詞庫。
推到 main 之後 `.github/workflows/deploy.yml` 會重新發佈網頁版。

```
cd site
npm install
npm run dev       # http://localhost:4321，改 entries/ 會即時反映
npm run verify    # 檢查每個結構區塊都能被解析
npm run build     # 產生靜態站到 site/dist
```
