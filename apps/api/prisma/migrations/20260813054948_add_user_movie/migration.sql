-- CreateEnum
CREATE TYPE "UserMovieKind" AS ENUM ('wish', 'watched');

-- CreateTable
CREATE TABLE "user_movies" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "tmdb_id" INTEGER NOT NULL,
    "kind" "UserMovieKind" NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "user_movies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_movies_user_id_tmdb_id_kind_key" ON "user_movies"("user_id", "tmdb_id", "kind");

-- AddForeignKey
ALTER TABLE "user_movies" ADD CONSTRAINT "user_movies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
