-- CreateTable
CREATE TABLE "admin_daily_stats" (
    "date" DATE NOT NULL,
    "visits" INTEGER NOT NULL DEFAULT 0,
    "tickets_issued" INTEGER NOT NULL DEFAULT 0,
    "tickets_used" INTEGER NOT NULL DEFAULT 0,
    "reviews" INTEGER NOT NULL DEFAULT 0,
    "cafe_messages" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "admin_daily_stats_pkey" PRIMARY KEY ("date")
);

-- CreateTable
CREATE TABLE "admin_hourly_stats" (
    "date" DATE NOT NULL,
    "hour" INTEGER NOT NULL,
    "visits" INTEGER NOT NULL DEFAULT 0,
    "logins" INTEGER NOT NULL DEFAULT 0,
    "cafe_messages" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "admin_hourly_stats_pkey" PRIMARY KEY ("date","hour")
);
