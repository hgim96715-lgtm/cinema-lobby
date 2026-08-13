-- CreateTable
CREATE TABLE "movie_pool" (
    "id" UUID NOT NULL,
    "tmdb_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "poster_path" TEXT,
    "release_date" TEXT NOT NULL DEFAULT '',
    "director" TEXT,
    "synced_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movie_pool_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "movie_pool_tmdb_id_key" ON "movie_pool"("tmdb_id");
