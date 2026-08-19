-- CreateTable
CREATE TABLE "anon_visits" (
    "id" UUID NOT NULL,
    "visitor_key" VARCHAR(36) NOT NULL,
    "place" VARCHAR(16) NOT NULL,
    "visit_date" DATE NOT NULL,
    "visited_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anon_visits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "anon_visits_visitor_key_place_visit_date_key" ON "anon_visits"("visitor_key", "place", "visit_date");

-- CreateIndex
CREATE INDEX "anon_visits_visit_date_place_idx" ON "anon_visits"("visit_date", "place");
