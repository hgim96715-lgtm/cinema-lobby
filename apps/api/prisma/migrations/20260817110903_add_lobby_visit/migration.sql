-- CreateTable
CREATE TABLE "lobby_visits" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "visit_date" DATE NOT NULL,
    "visited_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lobby_visits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lobby_visits_visit_date_idx" ON "lobby_visits"("visit_date");

-- CreateIndex
CREATE INDEX "lobby_visits_visited_at_idx" ON "lobby_visits"("visited_at");

-- CreateIndex
CREATE UNIQUE INDEX "lobby_visits_user_id_visit_date_key" ON "lobby_visits"("user_id", "visit_date");

-- AddForeignKey
ALTER TABLE "lobby_visits" ADD CONSTRAINT "lobby_visits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
