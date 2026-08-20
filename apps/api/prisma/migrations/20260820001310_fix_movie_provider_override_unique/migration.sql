-- DropIndex
DROP INDEX "movie_provider_overrides_tmdb_id_key";

-- CreateIndex
CREATE INDEX "movie_provider_overrides_tmdb_id_idx" ON "movie_provider_overrides"("tmdb_id");
