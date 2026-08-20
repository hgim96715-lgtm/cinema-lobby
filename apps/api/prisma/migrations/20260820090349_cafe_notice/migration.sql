-- CreateTable
CREATE TABLE "cafe_notices" (
    "id" UUID NOT NULL,
    "key" VARCHAR(16) NOT NULL DEFAULT 'cafe',
    "kicker" VARCHAR(64) NOT NULL DEFAULT 'CINEMO SNACK BAR',
    "title" VARCHAR(128) NOT NULL DEFAULT '주의사항',
    "rules" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "cafe_notices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cafe_notices_key_key" ON "cafe_notices"("key");
