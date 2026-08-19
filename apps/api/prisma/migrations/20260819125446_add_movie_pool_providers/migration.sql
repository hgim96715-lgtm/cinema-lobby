-- AlterTable
ALTER TABLE "movie_pool" ADD COLUMN     "providers" JSONB NOT NULL DEFAULT '[]';
