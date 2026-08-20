-- CreateEnum
CREATE TYPE "MovieProviderOverrideAction" AS ENUM ('add', 'remove');

-- CreateTable
CREATE TABLE "movie_provider_overrides" (
    "id" UUID NOT NULL,
    "tmdb_id" INTEGER NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "provider_name" TEXT NOT NULL,
    "logo_path" TEXT,
    "action" "MovieProviderOverrideAction" NOT NULL,
    "note" TEXT,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "movie_provider_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "movie_provider_overrides_tmdb_id_provider_id_action_key" ON "movie_provider_overrides"("tmdb_id", "provider_id", "action");

-- CreateIndex
CREATE UNIQUE INDEX "movie_provider_overrides_tmdb_id_key" ON "movie_provider_overrides"("tmdb_id");

-- AddForeignKey
ALTER TABLE "movie_provider_overrides" ADD CONSTRAINT "movie_provider_overrides_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
