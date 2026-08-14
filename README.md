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

Swagger UI: http://localhost:3050/api

프론트 타입: Swagger OpenAPI → `openapi-typescript`로 web 타입 자동 생성 예정  
(예: api에서 openapi.json dump → `pnpm gen:api` → `apps/web`에 `.d.ts`)

공유 코드: `@cinemo/shared` (`workspace:*`)  
- shared = 방 ID·티켓 상태 등 **도메인 상수/타입**
- openapi-typescript = **API 요청/응답** 타입 (서버 스펙과 동기화)
  

| | 포트 |
|--|--|
| API | 3050 |
| Web | 3051 |
| Postgres | 5445 |

```bash
docker compose up -d   # Postgres
```

로컬 메모: `docs/state.md` · `docs/docker.md` · `docs/prisma/` (gitignore)  
Redis · FCM은 나중.

## 컨셉 (초안)

- 전광판(매표소 위): 오늘 입장수 · 추이 그래프
- 중앙 매표소: 환영 / 로그인 유도 / 티켓 발급
- 티켓: 오늘 뽑기 1회권
- 뽑기방: 티켓으로 영화 뽑기
- 후기방: REVIEW BALL · 짧은 후기·별점 · /review
- 카페테리아: 북적 짧은 채팅 · presence (WebSocket) · 명대사방은 별도·더 나중

클라이언트: **웹(Next) 먼저** → 나중에 `apps/mobile`(Expo) 추가.

영화 포스터/메타는 TMDB API 사용.  
로컬 메모: [docs/web/tmdb.md](docs/web/tmdb.md) · [docs/web/gacha.md](docs/web/gacha.md) · [docs/web/review.md](docs/web/review.md) (gitignore)
