-- CreateEnum
CREATE TYPE "CafeTableAccess" AS ENUM ('open', 'locked');

-- CreateTable
CREATE TABLE "cafe_table_sessions" (
    "table_id" VARCHAR(1) NOT NULL,
    "label" TEXT,
    "access" "CafeTableAccess" NOT NULL DEFAULT 'open',
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "cafe_table_sessions_pkey" PRIMARY KEY ("table_id")
);

-- CreateTable
CREATE TABLE "cafe_table_seats" (
    "table_id" VARCHAR(1) NOT NULL,
    "user_id" UUID NOT NULL,
    "joined_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cafe_table_seats_pkey" PRIMARY KEY ("table_id","user_id")
);

-- CreateTable
CREATE TABLE "cafe_messages" (
    "id" UUID NOT NULL,
    "table_id" VARCHAR(1) NOT NULL,
    "user_id" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "cafe_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cafe_table_seats_table_id_idx" ON "cafe_table_seats"("table_id");

-- CreateIndex
CREATE INDEX "cafe_messages_table_id_created_at_idx" ON "cafe_messages"("table_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "cafe_table_seats" ADD CONSTRAINT "cafe_table_seats_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "cafe_table_sessions"("table_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cafe_table_seats" ADD CONSTRAINT "cafe_table_seats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cafe_messages" ADD CONSTRAINT "cafe_messages_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "cafe_table_sessions"("table_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cafe_messages" ADD CONSTRAINT "cafe_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
