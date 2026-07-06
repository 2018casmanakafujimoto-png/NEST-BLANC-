# NEST BLANC 婚活価値観診断

## アーキテクチャ

- `src/types/quiz.ts` — 全ドメイン型（診断軸・質問・タイプ・男性タイプ・幸福度・類似度・AIコメント・CTA・記事・CMS用型）
- `src/lib/` — 副作用のない純粋な計算ロジック
  - `scoring.ts` — 回答→軸スコア→100点換算→4タイプ判定（ルール一致 + 複数一致時のタイブレーク + 最近傍フォールバック）
  - `happiness.ts` — 婚活幸福度(100点)の算出
  - `compatibilityScore.ts` — 相性スコア算出式（価値観一致40%＋補完性30%＋婚活データ一致20%＋ライフスタイル一致10%）
  - `similarity.ts` — 成婚女性類似度（コサイン類似度）
  - `aiComment.ts` — AIコメント組み立て（テンプレート方式、下記「判断が必要な仕様上の解釈」参照）
  - `firebase.ts` — Firebase App / Firestore / Authentication / Storage の初期化（すべて `process.env` 経由）
  - `adminAuth.ts` — 管理者ログイン（Email/Password）・`adminUsers` コレクションによる管理者判定
- `src/data/` — CMSの初期値・フォールバック値（questions.ts / types.ts / maleTypes.ts / cms-defaults.ts）
- `src/repositories/` — Repository Pattern。Firestoreを優先して読み書きし、未設定時は `src/data` のデフォルト値にフォールバック
  - `cmsRepository.ts` — `cms` コレクション（タイプ説明・男性タイプ・相性ランキング・幸福度配点・相性計算重み・AIテンプレート・成婚統計）
  - `statsRepository.ts` — `stats` コレクション（タイプ別・成婚女性の平均軸ベクトル）
  - `questionsRepository.ts` — `questions` コレクション（設問・選択肢・配点のCMS編集用データ。※下記「既知の制限」参照）
  - `contentRepository.ts` — `cta` / `articles` コレクション
- `src/services/diagnosisService.ts` — Service Layer。上記を一つに束ね、結果ページが呼ぶ唯一の入り口 `buildDiagnosisResult(answers)` を提供
- `src/components/` — 表示専用コンポーネント（QuestionCard, ProgressBar, RadarChart, HappinessScoreCard, CompatibilityRanking）
- `src/components/admin/` — CMSのフォーム部品（`fields.tsx`, `useCmsForm.ts`, `AdminGuard.tsx`, `forms/*`）
- `src/app/` — ルーティング（`/` ランディング、`/quiz` 診断フロー ※変更なし、`/result` 結果画面、`/admin` CMS管理画面、`/admin/login` 管理者ログイン）
- `scripts/seed.ts` — Firestore初期投入スクリプト（`npm run seed`）
- `firestore.rules` / `firestore.indexes.json` / `firebase.json` — Firestore本番設定

## 実装済み機能

- 設問20問（Q1〜Q20、スペック通りのスコア配点）
- 4タイプ判定（自立度・仕事家庭・距離感・コミュニケーション・ライフスタイルの閾値判定＋複数該当時のタイブレーク）
- 参考MBTI表示（判定ロジックには不使用、結果画面に表示のみ）
- 男性タイプ M1〜M4（プロフィール・特徴・軸ベクトル）
- 相性ランキング（タイプ別、スペック記載の数値をCMS初期値として使用）
- 相性計算式（40/30/20/10の重み付けによる算出スコアも並記）
- 婚活幸福度（100点、5項目の内訳をカードUI＋円グラフで表示）
- 成婚女性類似度（コサイン類似度、Firestore `stats` コレクション対応）
- AIコメント生成（タイプ紹介・強み・幸せになれる男性像・注意点・アドバイスの5部構成、テンプレート方式）
- **Firebase Authentication（Email/Password）**: `/admin` は認証必須。未ログイン・非管理者は `/admin/login` へリダイレクト
- **Admin CMS（フォーム編集）**: JSON編集を廃止し、質問・回答・配点／タイプ／男性タイプ／相性ランキング／設定（幸福度配点・相性計算重み）／AIテンプレート／統計（成婚率・構成比・平均ベクトル）／CTA／記事をフォームでFirestoreへ保存
- **Firestore Security Rules**: 一般ユーザーは読み取りのみ、書き込みは `adminUsers` に登録された管理者のみ
- **Firestore Seeder**: `npm run seed` で初回のみ各コレクションへデフォルト値を投入（既存ドキュメントは上書きしない）

## 判断が必要な仕様上の解釈（要確認）

- **タイプ判定のタイブレーク**: 「①総合スコア→②仕事家庭→③…」の軸別優先順位は、同一回答者内では軸の値がどの候補タイプでも同じため単独では優劣を決められません。そこで各タイプの条件式に登場する軸を合算した「合成スコア」を①として使い、それでも同点の場合はタイプ宣言順（A→B→C→D）で確定させています（`src/lib/scoring.ts`）。
- **婚活幸福度の内訳計算**: 点数配分は仕様通りですが、各項目を軸スコアのどの組み合わせから出すかは指定がなかったため独自ロジックにしています（`src/lib/happiness.ts`）。
- **相性計算式の4指標**: 価値観一致率＝5軸類似度、補完性＝自立度とコミュ力の適度な差分、婚活データ一致率＝CMS設定済みの相性ランキング値、ライフスタイル一致率＝ライフスタイル軸類似度、として実装しています（`src/lib/compatibilityScore.ts`）。
- **AIコメント生成**: 外部LLM APIは呼び出していません。CMSで編集可能な定型文を結合して出力する決定的なテンプレートエンジンです（`src/lib/aiComment.ts`）。

## 既知の制限

- **`/quiz` は引き続き静的データ（`src/data/questions.ts`）を直接参照します。** Admin CMSの「質問・回答・配点」フォームはFirestoreの `questions` コレクションを編集できますが、既存の診断フロー（`src/app/quiz/page.tsx`）を変更しない方針のため、その編集内容は本番の診断にはまだ反映されません。ライブの診断にも反映するには、`quiz/page.tsx` が `questionsRepository.getQuestionsContent()` を読むように変更する別対応が必要です。
- **画像生成・SNSシェア**（Instagram/LINE/X）は未実装です。
- **PWA対応**の設定ファイル一式は未実装です。
- `articles` コレコレクションはCMS上で編集可能ですが、まだどの画面にも表示されていません（将来の記事一覧ページ等での利用を想定した保存領域です）。

## Firebase設定

### 1. Firebase プロジェクト作成

Firebaseコンソールでプロジェクトを作成し、Webアプリを追加してください。Authentication（メール/パスワード プロバイダ）、Firestore、Storageを有効化します。

### 2. .env.local の設定

```bash
cp .env.example .env.local
```

クライアント用（ブラウザに公開される値。Firebaseコンソールの「アプリの設定」からコピー）:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

サーバー用（`npm run seed` 専用。`NEXT_PUBLIC_` を付けないこと。Firebaseコンソール「プロジェクトの設定 > サービスアカウント > 新しい秘密鍵の生成」で発行したJSONの値を転記し、JSONファイル自体はコミットしない）:

```
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

Firebase未設定のままでも `/`, `/quiz`, `/result` はローカルのデフォルト値で動作します（`/admin` はログインが必要なため、動作確認にはAuthenticationの設定が必要です）。

## Authentication設定（管理者アカウント）

1. Firebaseコンソール > Authentication > Sign-in method で「メール/パスワード」を有効化
2. Authentication > Users から管理者用アカウントを追加（メール/パスワード）
3. Firestoreの `adminUsers` コレクションに、そのユーザーのUID をドキュメントIDとするドキュメントを1件作成（内容は空でも可）
   - コンソールから手動作成するか、Admin SDKで `db.collection("adminUsers").doc(uid).set({})` を実行
4. `/admin/login` からそのメール/パスワードでログインすると `/admin` にアクセスできます

`adminUsers` への書き込みはクライアントから一切許可していません（`firestore.rules` 参照）。管理者の追加・削除は必ずFirebaseコンソールかAdmin SDK経由で行ってください。

## Firestore構成

| コレクション | ドキュメントID | 内容 |
| --- | --- | --- |
| `diagnosisResults` | 自動採番 | 診断結果の保存ログ（誰でも作成可、閲覧は管理者のみ） |
| `cms` | typeProfiles / maleTypes / compatibility / happinessWeights / compatibilityFormulaWeights / aiTemplates / marriageStats | CMS編集対象 |
| `stats` | A / B / C / D | タイプ別・成婚女性の平均軸ベクトル |
| `questions` | all | 設問・選択肢・配点（CMS編集用。既知の制限を参照） |
| `cta` | main | 結果ページ末尾の誘導文 |
| `articles` | 記事ごとに任意ID | 記事コンテンツ |
| `adminUsers` | ユーザーUID | 管理者判定用（クライアントから書き込み不可） |

## Security Rules

`firestore.rules` に本番用ルールを定義しています。要旨:

- `cms` / `stats` / `questions` / `cta` / `articles`: 誰でも読み取り可、書き込みは `adminUsers` に自分のUIDのドキュメントが存在するユーザーのみ
- `diagnosisResults`: 誰でも作成可（診断結果の保存用）、閲覧・更新・削除は管理者のみ
- `adminUsers`: 本人のみ自分のドキュメントを読み取り可、書き込みはクライアントから常に不可

デプロイ:

```bash
npm install -g firebase-tools   # 未導入の場合のみ
firebase login
firebase use <あなたのプロジェクトID>
firebase deploy --only firestore:rules,firestore:indexes
```

## Firestore Seeder 実行方法

初回のみ、各コレクションへデフォルト値を投入します（既存ドキュメントがある場合はスキップし、上書きしません）。

```bash
npm install
npm run seed
```

`FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` が `.env.local`（または実行時の環境変数）に設定されている必要があります。

## Admin CMS 利用方法

1. `/admin/login` で管理者アカウントにログイン
2. `/admin` の各フォームセクション（質問・タイプ・男性タイプ・相性ランキング・設定・AIテンプレート・統計・CTA・記事）を編集し、セクションごとの「保存」ボタンでFirestoreへ保存
3. Firestore未設定の場合、読み込みはコード内デフォルト値を表示し、保存は何も行いません（ローカル動作確認用）

## セットアップ（開発）

Node.js (18以降推奨) と npm が必要です。このマシンには未インストールのため、`npm install` 等はNode環境がある場所で実行してください。

```bash
npm install
cp .env.example .env.local   # Firebaseを使う場合のみ値を入力
npm run dev
```

## Hosting・デプロイ手順

このアプリはFirebase Authentication/Firestoreをクライアントから直接呼び出すため、Next.js自体のホスティングはVercel等の標準的なNext.jsホスティング、またはFirebase App Hosting（Next.js対応）のいずれでも構いません。

**Vercelの場合**（最短経路としておすすめ）:

1. リポジトリをVercelにインポート
2. `.env.local` と同じ環境変数（`NEXT_PUBLIC_FIREBASE_*`）をVercelのプロジェクト設定に登録
3. デプロイ

**Firebase Hostingの場合**:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # Next.jsのWebフレームワーク対応を選択
firebase deploy
```

Firestoreルール・インデックスは上記「Security Rules」の手順で別途デプロイしてください。

## セキュリティ

- APIキー・秘密鍵はコードに直書きしない。`process.env` 経由のみ（`src/lib/firebase.ts` 参照）
- `.env*`, `serviceAccount*.json`, `*.pem`, `*.p12`, `*.key` は `.gitignore` 済み
- サービスアカウント資格情報（`FIREBASE_PRIVATE_KEY` 等）はサーバー/CI環境変数としてのみ設定し、`NEXT_PUBLIC_` を付けない（付けるとブラウザに漏洩します）
- Firebase未設定時は読み書きがno-op/デフォルト値フォールバックになるため、実キーなしでも全画面の動作確認が可能
- `/admin` はFirebase Authentication必須＋Firestore側でも `adminUsers` チェックによる二重の保護

## このマシンでの検証について

Node.js/npmが未インストールのため、`npm install` / `npm run build` / `npm run lint` / `npm run type-check` を実行できていません。コードレベルのレビューと型・import/exportの整合性確認のみ実施済みです。Node環境で以下を実行し、エラーが出た場合はお知らせください。

```bash
npm install
npm run build
npm run lint
npm run type-check
```
