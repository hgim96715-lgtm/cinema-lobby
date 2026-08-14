-- CreateTable
CREATE TABLE "wall_posts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "tmdb_id" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wall_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "wall_posts_created_at_idx" ON "wall_posts"("created_at" DESC);

-- AddForeignKey
ALTER TABLE "wall_posts" ADD CONSTRAINT "wall_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
