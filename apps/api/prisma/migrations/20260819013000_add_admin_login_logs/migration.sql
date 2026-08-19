-- CreateTable
CREATE TABLE "admin_login_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "logged_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_login_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_login_logs_logged_at_idx" ON "admin_login_logs"("logged_at" DESC);

-- CreateIndex
CREATE INDEX "admin_login_logs_user_id_logged_at_idx" ON "admin_login_logs"("user_id", "logged_at" DESC);

-- AddForeignKey
ALTER TABLE "admin_login_logs" ADD CONSTRAINT "admin_login_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
