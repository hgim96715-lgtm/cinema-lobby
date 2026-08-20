# disposable

**운영 전·데모용** 스크립트·설정. 오픈 전에 통째로 지우거나 DB purge만 하고 폴더 삭제.

```txt
demo-seed/   하루 demo 활동 CLI (register · login · visit · ticket · review)
문서         docs/seed.md (구현·재사용) · docs/web/disposable-demo.md (제품 설계)
```

## 실행 (apps/api `.env` + DB 필요)

엔트리: `apps/api/src/cli/demo-seed-day.ts` · 페르소나: `demo-seed/personas.json`

```bash
# .env
ENABLE_DEMO_SEED=1
DEMO_SEED_PASSWORD=your-demo-password-min-8

pnpm --filter api demo:seed-day   # KST 오늘 · 신규 2 + 재방 3
pnpm --filter api demo:purge      # @demo.cinemo.invalid 유저 일괄 삭제
```

- `NODE_ENV=production` 이면 거부
- prod cron에 묶지 말 것
- MoviePool이 비어 있으면 TMDB 호출 — `/admin/ops` seed 권장

purge 시 demo 유저(`@demo.cinemo.invalid`)와 FK로 연결된 후기·티켓·visit 등 제거.
