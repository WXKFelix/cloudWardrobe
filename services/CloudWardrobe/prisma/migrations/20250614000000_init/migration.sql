-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('student', 'worker', 'family');

-- CreateEnum
CREATE TYPE "ClothingCategory" AS ENUM ('top', 'bottom', 'shoes', 'outerwear', 'accessory');

-- CreateEnum
CREATE TYPE "ClothingStatus" AS ENUM ('normal', 'washing', 'in_storage', 'repair', 'donate', 'wearing', 'donated', 'disposed');

-- CreateEnum
CREATE TYPE "OutfitSlot" AS ENUM ('top', 'bottom', 'shoes', 'outerwear', 'accessory');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('storage', 'pickup', 'care');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'processing', 'shipping', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('warning', 'info');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- CreateEnum
CREATE TYPE "StatusLogOperator" AS ENUM ('user', 'system', 'warehouse');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(64) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "user_type" "UserType",
    "avatar_url" TEXT,
    "cloud_quota" INTEGER NOT NULL DEFAULT 50,
    "onboarding_completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "user_id" UUID NOT NULL,
    "notify_outfit" BOOLEAN NOT NULL DEFAULT true,
    "notify_promo" BOOLEAN NOT NULL DEFAULT true,
    "notify_order" BOOLEAN NOT NULL DEFAULT true,
    "dark_mode" BOOLEAN NOT NULL DEFAULT false,
    "privacy_share" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "revoked_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cloud_plans" (
    "id" VARCHAR(32) NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "quota" INTEGER NOT NULL,
    "price_cents" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "cloud_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "user_id" UUID NOT NULL,
    "plan_id" VARCHAR(32) NOT NULL DEFAULT 'free',
    "points" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "point_transactions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "balance_after" INTEGER NOT NULL,
    "reason" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "point_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membership_benefits" (
    "id" UUID NOT NULL,
    "plan_id" VARCHAR(32),
    "icon" VARCHAR(8) NOT NULL,
    "title" VARCHAR(64) NOT NULL,
    "description" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "membership_benefits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clothing_items" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "category" "ClothingCategory" NOT NULL,
    "color_name" VARCHAR(32) NOT NULL,
    "color_hex" CHAR(7) NOT NULL,
    "season" VARCHAR(16) NOT NULL DEFAULT '四季',
    "occasion" VARCHAR(16) NOT NULL DEFAULT '日常',
    "status" "ClothingStatus" NOT NULL DEFAULT 'normal',
    "wear_count" INTEGER NOT NULL DEFAULT 0,
    "last_worn_at" TIMESTAMPTZ(6),
    "thumbnail_url" TEXT,
    "image_url" TEXT,
    "brand" VARCHAR(64),
    "purchase_date" DATE,
    "price_cents" INTEGER,
    "unique_label_id" VARCHAR(64),
    "warehouse_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "clothing_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clothing_images" (
    "id" UUID NOT NULL,
    "clothing_item_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clothing_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clothing_tags" (
    "id" UUID NOT NULL,
    "name" VARCHAR(32) NOT NULL,

    CONSTRAINT "clothing_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clothing_item_tags" (
    "clothing_item_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,

    CONSTRAINT "clothing_item_tags_pkey" PRIMARY KEY ("clothing_item_id","tag_id")
);

-- CreateTable
CREATE TABLE "clothing_status_logs" (
    "id" UUID NOT NULL,
    "clothing_item_id" UUID NOT NULL,
    "from_status" "ClothingStatus",
    "to_status" "ClothingStatus" NOT NULL,
    "operator" "StatusLogOperator" NOT NULL DEFAULT 'user',
    "note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clothing_status_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_recommendations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "recommend_date" DATE NOT NULL,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "title" VARCHAR(64) NOT NULL,
    "description" TEXT,
    "weather_snapshot" JSONB,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_recommendation_items" (
    "recommendation_id" UUID NOT NULL,
    "clothing_item_id" UUID NOT NULL,
    "slot" "OutfitSlot" NOT NULL,

    CONSTRAINT "daily_recommendation_items_pkey" PRIMARY KEY ("recommendation_id","slot")
);

-- CreateTable
CREATE TABLE "outfit_records" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "outfit_date" DATE NOT NULL,
    "recommendation_id" UUID,
    "title" VARCHAR(64),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outfit_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outfit_record_items" (
    "outfit_record_id" UUID NOT NULL,
    "clothing_item_id" UUID NOT NULL,
    "slot" "OutfitSlot" NOT NULL,

    CONSTRAINT "outfit_record_items_pkey" PRIMARY KEY ("outfit_record_id","slot")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" UUID NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "city" VARCHAR(64),
    "address" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_orders" (
    "id" UUID NOT NULL,
    "order_no" VARCHAR(32) NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "OrderType" NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "amount_cents" INTEGER NOT NULL,
    "tracking_no" VARCHAR(64),
    "warehouse_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "cancelled_at" TIMESTAMPTZ(6),

    CONSTRAINT "service_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "clothing_item_id" UUID,
    "item_name_snapshot" VARCHAR(128) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eco_reminders" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "type" "ReminderType" NOT NULL,
    "rule_code" VARCHAR(32),
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eco_reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fashion_tips" (
    "id" UUID NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "description" TEXT NOT NULL,
    "cover_url" TEXT,
    "published_at" TIMESTAMPTZ(6),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fashion_tips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "category" VARCHAR(32) NOT NULL,
    "content" TEXT NOT NULL,
    "contact" VARCHAR(128),
    "status" "FeedbackStatus" NOT NULL DEFAULT 'open',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_attachments" (
    "id" UUID NOT NULL,
    "feedback_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_user_type_idx" ON "users"("user_type");

-- CreateIndex
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "point_transactions_user_id_created_at_idx" ON "point_transactions"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "membership_benefits_plan_id_sort_order_idx" ON "membership_benefits"("plan_id", "sort_order");

-- CreateIndex
CREATE INDEX "clothing_items_user_id_deleted_at_idx" ON "clothing_items"("user_id", "deleted_at");

-- CreateIndex
CREATE INDEX "clothing_items_user_id_category_idx" ON "clothing_items"("user_id", "category");

-- CreateIndex
CREATE INDEX "clothing_items_user_id_status_idx" ON "clothing_items"("user_id", "status");

-- CreateIndex
CREATE INDEX "clothing_items_user_id_wear_count_idx" ON "clothing_items"("user_id", "wear_count" DESC);

-- CreateIndex
CREATE INDEX "clothing_items_last_worn_at_idx" ON "clothing_items"("last_worn_at");

-- CreateIndex
CREATE INDEX "clothing_images_clothing_item_id_sort_order_idx" ON "clothing_images"("clothing_item_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "clothing_tags_name_key" ON "clothing_tags"("name");

-- CreateIndex
CREATE INDEX "clothing_status_logs_clothing_item_id_created_at_idx" ON "clothing_status_logs"("clothing_item_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "daily_recommendations_user_id_recommend_date_idx" ON "daily_recommendations"("user_id", "recommend_date" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "daily_recommendations_user_id_recommend_date_sequence_key" ON "daily_recommendations"("user_id", "recommend_date", "sequence");

-- CreateIndex
CREATE INDEX "outfit_records_user_id_outfit_date_idx" ON "outfit_records"("user_id", "outfit_date" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "outfit_records_user_id_outfit_date_key" ON "outfit_records"("user_id", "outfit_date");

-- CreateIndex
CREATE UNIQUE INDEX "service_orders_order_no_key" ON "service_orders"("order_no");

-- CreateIndex
CREATE INDEX "service_orders_user_id_created_at_idx" ON "service_orders"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "service_orders_user_id_status_idx" ON "service_orders"("user_id", "status");

-- CreateIndex
CREATE INDEX "service_orders_user_id_type_idx" ON "service_orders"("user_id", "type");

-- CreateIndex
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX "eco_reminders_user_id_is_read_created_at_idx" ON "eco_reminders"("user_id", "is_read", "created_at" DESC);

-- CreateIndex
CREATE INDEX "fashion_tips_is_active_sort_order_idx" ON "fashion_tips"("is_active", "sort_order");

-- CreateIndex
CREATE INDEX "feedbacks_status_created_at_idx" ON "feedbacks"("status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "feedback_attachments_feedback_id_idx" ON "feedback_attachments"("feedback_id");

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "cloud_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership_benefits" ADD CONSTRAINT "membership_benefits_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "cloud_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clothing_items" ADD CONSTRAINT "clothing_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clothing_items" ADD CONSTRAINT "clothing_items_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clothing_images" ADD CONSTRAINT "clothing_images_clothing_item_id_fkey" FOREIGN KEY ("clothing_item_id") REFERENCES "clothing_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clothing_item_tags" ADD CONSTRAINT "clothing_item_tags_clothing_item_id_fkey" FOREIGN KEY ("clothing_item_id") REFERENCES "clothing_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clothing_item_tags" ADD CONSTRAINT "clothing_item_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "clothing_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clothing_status_logs" ADD CONSTRAINT "clothing_status_logs_clothing_item_id_fkey" FOREIGN KEY ("clothing_item_id") REFERENCES "clothing_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_recommendations" ADD CONSTRAINT "daily_recommendations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_recommendation_items" ADD CONSTRAINT "daily_recommendation_items_recommendation_id_fkey" FOREIGN KEY ("recommendation_id") REFERENCES "daily_recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_recommendation_items" ADD CONSTRAINT "daily_recommendation_items_clothing_item_id_fkey" FOREIGN KEY ("clothing_item_id") REFERENCES "clothing_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_records" ADD CONSTRAINT "outfit_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_records" ADD CONSTRAINT "outfit_records_recommendation_id_fkey" FOREIGN KEY ("recommendation_id") REFERENCES "daily_recommendations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_record_items" ADD CONSTRAINT "outfit_record_items_outfit_record_id_fkey" FOREIGN KEY ("outfit_record_id") REFERENCES "outfit_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_record_items" ADD CONSTRAINT "outfit_record_items_clothing_item_id_fkey" FOREIGN KEY ("clothing_item_id") REFERENCES "clothing_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "service_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_clothing_item_id_fkey" FOREIGN KEY ("clothing_item_id") REFERENCES "clothing_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eco_reminders" ADD CONSTRAINT "eco_reminders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_attachments" ADD CONSTRAINT "feedback_attachments_feedback_id_fkey" FOREIGN KEY ("feedback_id") REFERENCES "feedbacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Wardrobe name search (pg_trgm — see docs/03-技术架构方案.md)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX "clothing_items_name_trgm_idx" ON "clothing_items" USING gin ("name" gin_trgm_ops);
