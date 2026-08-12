# cinema-lobby

영화관 로비 컨셉의 NestJS + Next.js 소셜 앱.

## 구조

```
cinema-lobby/
  apps/api        # NestJS + Prisma
  apps/web        # Next.js
  packages/shared # api/web 공유 (`@cinema-lobby/shared`)
```

```bash
pnpm install
pnpm build:shared   # 공유 패키지 빌드 (install 시 prepare로도 실행)
pnpm dev:api   # http://localhost:3050
pnpm dev:web   # http://localhost:3051
```

공유 코드: `@cinema-lobby/shared` (`workspace:*`)  
로컬 메모: `docs/` (gitignore)

| | 포트 |
|--|--|
| API | 3050 |
| Web | 3051 |
| Postgres | 5445 |

## 컨셉 (초안)

- 전광판(매표소 위): 오늘 입장수 · 추이 그래프
- 중앙 매표소: 환영 / 로그인 유도 / 티켓 발급
- 티켓: 오늘 뽑기 1회권
- 뽑기방: 티켓으로 영화 + 쪽지
- 후기방: 짧은 후기
- 휴게실: 가벼운 공유·실시간(WebSocket)

영화 포스터/메타는 TMDB API 사용 예정.
