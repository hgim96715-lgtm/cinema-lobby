-- AlterTable
ALTER TABLE "movie_pool" ADD COLUMN     "genre_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "origin_countries" TEXT[] DEFAULT ARRAY[]::TEXT[];
