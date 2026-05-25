# 勤怠ナビ（hrms-ja）

中小企業（特に **軽貨物運送・飲食・介護**）向けに、Frappe HRMS を日本仕様にカスタマイズしたフォーク。

> 上流: [frappe/hrms](https://github.com/frappe/hrms) (GPL v3)
> フォーク元: [taniiseiya/hrms-ja](https://github.com/taniiseiya/hrms-ja)

---

## 🎯 何ができるか

| 機能 | 用途 |
|---|---|
| 勤怠管理 | 打刻（位置情報付き）、遅刻・早退管理 |
| シフト作成 | 早番/中番/夜勤の自動割当、希望休考慮 |
| 休暇管理 | 有給・特休・代休、申請→承認フロー |
| 給与計算 | 残業・深夜・休日割増の自動計算 |
| 入退社管理 | オンボーディング、退職手続き |
| 評価・目標 | 1on1、KPI管理 |

---

## 🚀 デモ（モック）

Docker未導入の環境でも見られる**営業デモ用静的HTML**：

```bash
open mock/index.html
```

または：
```bash
python3 -m http.server 8080 --directory mock
# → http://localhost:8080
```

---

## 🐳 本番セットアップ（Docker）

### 前提
- Docker Desktop / OrbStack / Colima のいずれか
- 8GB以上のRAM
- 20GB以上の空きディスク

### 起動

```bash
cd docker
docker compose up -d
# 初回は10〜20分（MariaDB初期化 + ERPNext + HRMS インストール）

# 進捗を見る
docker compose logs -f frappe

# 完了したら
open http://localhost:8000
# 初期ログイン: Administrator / admin
```

### 日本仕様設定（初回ログイン後）

| 項目 | 設定値 |
|---|---|
| Timezone | Asia/Tokyo |
| Language | ja |
| Currency | JPY |
| Date Format | yyyy-mm-dd |
| Number Format | #,###.## |
| Country | Japan |

---

## 🇯🇵 日本ローカライズの差分（軽量版）

| 項目 | 上流 | このフォーク |
|---|---|---|
| デフォルトTZ | UTC | Asia/Tokyo |
| 通貨 | USD | JPY |
| 言語 | en | ja |
| 祝日 | なし | 内閣府カレンダー連携（TODO） |
| インボイス対応 | なし | TODO |

中量・重量版（祝日・郵便番号・インボイス制度対応）は別ブランチで対応予定。

---

## 💼 営業向け資料

- `mock/index.html` — 顧客に見せるダッシュボードデモ
- 想定単価: **初期20万 + 月3万 / 30人規模**
- 想定顧客: 軽貨物運送業（ドライバー10〜30名）、介護事業所、飲食チェーン3〜5店

---

## ⚖ ライセンス

- 上流: GPL v3
- このフォーク: GPL v3 を継承
- 商用利用可・改変可・**SaaS提供時はソース公開義務あり**

---

## 📝 TODO

- [ ] docker-compose に TZ=Asia/Tokyo を環境変数で設定
- [ ] 日本の祝日マスタ追加
- [ ] 給与計算の社会保険料計算（健保・厚年・雇用・労災）
- [ ] 年末調整対応
- [ ] マイナンバー暗号化保管
- [ ] 電帳法対応（領収書OCR連携）
