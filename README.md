# Online Cafe ☕

귀여운 온라인 카페 웹앱. 잠시 들러 메뉴를 주문하고, 두 존을 오가며 작업하는 곳.

## 개발

```bash
npm install
npm run dev      # http://localhost:3000
npm run test     # 단위 테스트
```

## 마일스톤 진행 상황

- ✅ M1: 정적 카페 (1인 모드)
- ✅ M2: 멀티유저 + Supabase Realtime
- ⬜ M3: 응원 이모트 + 폴리시

## 환경변수

`.env.example`를 복사해서 `.env.local` 생성 후 Supabase 프로젝트의 URL/anon key 입력.

## 에셋 준비 항목 (수동 업로드)

- `public/audio/notebook-zone.mp3` — 노트북존 배경음 (192kbps mp3 권장, loop)
- `public/audio/terrace-zone.mp3`  — 테라스존 배경음
- `public/images/zone-notebook.png` — (선택) 배경 일러스트 16:9
- `public/images/zone-terrace.png`  — (선택)

파일 없어도 앱은 동작하며, 파일 올리면 자동으로 적용됨.

## 알려진 트레이드오프

- DB-row subscription 기반 presence: 탭 닫기/네트워크 단절 시 캐릭터가 즉시 사라지지 않고, 1분 간격 cron이 `ended` 처리할 때까지 남아 있을 수 있음.
- 클라이언트 측 샘플링: 서버 Edge Function 없이 모든 active 세션을 가져와 클라이언트에서 9명 무작위 선택.
- 로컬 카운트다운: 30초 heartbeat 없이 클라이언트 `expiresAt` 기준 1초 단위 감소. 서버-클라이언트 시차는 M3에서 처리 예정.

## 라이선스

AGPL-3.0. Clawd character © clawd-on-desk contributors (AGPL-3.0).
