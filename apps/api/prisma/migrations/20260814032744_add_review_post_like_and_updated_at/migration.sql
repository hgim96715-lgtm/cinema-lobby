/*
  Warnings:

  - Added the required column `updated_at` to the `review_posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "review_posts" ADD COLUMN     "updated_at" TIMESTAMPTZ(3) NOT NULL;
ALTER TABLE "review_posts" RENAME CONSTRAINT "wall_posts_pkey" TO "review_posts_pkey";

-- CreateTable
CREATE TABLE "review_post_likes" (
    "id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_post_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "review_post_likes_post_id_user_id_key" ON "review_post_likes"("post_id", "user_id");

-- RenameForeignKey
ALTER TABLE "review_posts" RENAME CONSTRAINT "wall_posts_user_id_fkey" TO "review_posts_user_id_fkey";

-- AddForeignKey
ALTER TABLE "review_post_likes" ADD CONSTRAINT "review_post_likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "review_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_post_likes" ADD CONSTRAINT "review_post_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "wall_posts_created_at_idx" RENAME TO "review_posts_created_at_idx";
