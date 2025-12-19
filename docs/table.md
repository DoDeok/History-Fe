# Database Schema Documentation

## Overview
List of tables in the `history` Supabase project.

## Tables

### 1. `users`
사용자 정보를 저장하는 테이블입니다.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `gen_random_uuid()` |
| `user_id` | `text` | Unique User Identifier (Login ID) |
| `password` | `text` | User Password |
| `created_at` | `timestamptz` | Record creation timestamp |

### 2. `cards`
학습지(문서) 전체 내용을 저장하는 테이블입니다. 기존 `documents` 테이블과 통합되었습니다.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `gen_random_uuid()` |
| `user_id` | `uuid` | Foreign Key -> `users.id` |
| `title` | `text` | Card Title (Document Title) |
| `content` | `text` | Full Content of the card/document |
| `created_at` | `timestamptz` | Record creation timestamp |
| `isQuiz` | `boolean` | Whether a quiz exists for this card |

### 3. `flow`
카드 내의 역사적 사건 흐름(Flow)을 저장하는 테이블입니다.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `gen_random_uuid()` |
| `card_id` | `uuid` | Foreign Key -> `cards.id` |
| `flow` | `text` | Name of the Flow group |
| `node_order` | `integer` | Order of the node within the flow |
| `title` | `text` | Node Title |
| `content` | `text` | Main description of the node |
| `date` | `text` | Historical date/period |
| `cause` | `text` | Cause of the event |
| `result` | `text` | Result of the event |
| `people` | `text[]` | Array of related historical figures |
| `significance` | `text` | Historical significance |
| `created_at` | `timestamptz` | Record creation timestamp |

### 4. `quiz`
학습 내용 기반의 퀴즈 정보를 저장하는 테이블입니다.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `gen_random_uuid()` |
| `user_id` | `uuid` | Foreign Key -> `users.id` |
| `card_id` | `uuid` | (Optional) Link to specific card context |
| `title` | `text` | Quiz Title |
| `content` | `text` | Quiz Content/Question |
| `correct_answer`| `text` | Correct Answer |
| `score` | `integer` | Score/Points for the quiz |
| `options` | `text[]` | Options for multiple choice (Nullable) |
| `type` | `text` | Question Type ('MULTIPLE_CHOICE', 'SHORT_ANSWER') |
| `created_at` | `timestamptz` | Record creation timestamp |

### 5. `game_records`
게임(퀴즈 풀이 등) 기록을 저장하는 테이블입니다.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `gen_random_uuid()` |
| `user_id` | `uuid` | Foreign Key -> `users.id` |
| `quiz_id` | `uuid` | Foreign Key -> `quiz.id` |
| `card_id` | `uuid` | Foreign Key -> `cards.id` |
| `is_correct` | `boolean` | Whether the answer was correct |
| `flow` | `text` | Associated flow |
| `order` | `integer` | Order |
| `title` | `text` | Title |
| `content` | `text` | Content |
| `created_at` | `timestamptz` | Record creation timestamp |

> [!NOTE]
> `game_records` schema might need review to ensure `document_id` references `cards` if `documents` table was dropped, or if it's meant to be loose. Currently it shows FK constraints in schema fetching results which might be stale if table dropped CASCADE. The executed drop was `DROP TABLE documents CASCADE`, so FKs in `game_records` pointing to `documents` should have been dropped automatically.
