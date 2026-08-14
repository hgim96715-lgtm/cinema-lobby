/*
  Warnings:

  - Added the required column `rating` to the `wall_posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "wall_posts" ADD COLUMN     "rating" INTEGER NOT NULL;
