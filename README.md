# CINEMO

**CINEMO** = Cinema + Motion.  
Cinema in Motion — 영화가 움직이고, 사람들이 움직이고, 이야기가 움직이는 영화관 로비.

Cinema는 그리스어 *kínēma*(κίνημα, 움직임)에서 온 말.  
Movie가 “한 편의 영상”에 가깝다면, Cinema는 영화라는 매체·공간·문화 쪽 뉘앙스.  
로비 → 뽑기 → 후기 → 카페테리아처럼 **사람이 움직이며 이야기가 이어지는** 구조라서 이 이름을 씀.

NestJS + Next.js 모노레포 (웹 먼저 → 나중에 모바일).

## 구조

```
cinemo/
  apps/api        # NestJS + Prisma
  apps/web        # Next.js
  packages/shared # api/web 공유 (`@cinemo/shared`)
```

```bash
pnpm install
pnpm build:shared   # 공유 패키지 빌드 (install 시 prepare로도 실행)
pnpm dev:api   # http://localhost:3050
pnpm dev:web   # http://localhost:3051
```

공유 코드: `@cinemo/shared` (`workspace:*`)  

| | 포트 |
|--|--|
| API | 3050 |
| Web | 3051 |
| Postgres | 5445 |

```bash
docker compose up -d   # Postgres
```

로컬 메모: `docs/state.md` · `docs/docker.md` (gitignore)  
Redis · FCM은 나중.

## 컨셉 (초안)

- 전광판(매표소 위): 오늘 입장수 · 추이 그래프
- 중앙 매표소: 환영 / 로그인 유도 / 티켓 발급
- 티켓: 오늘 뽑기 1회권
- 뽑기방: 티켓으로 영화 + 쪽지
- 후기방: 오늘의 추천 포스터 벽(중복 가능) · 짧은 후기
- 카페테리아: 채팅·수다 · 실시간(WebSocket)

클라이언트: **웹(Next) 먼저** → 나중에 `apps/mobile`(Expo) 추가.

영화 포스터/메타는 TMDB API 사용 예정.
