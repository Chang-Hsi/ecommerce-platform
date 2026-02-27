-- Add split recipient name fields for profile addresses.
ALTER TABLE "UserAddress"
ADD COLUMN "recipientLastName" TEXT,
ADD COLUMN "recipientFirstName" TEXT;

-- Backfill from the old single name field.
UPDATE "UserAddress"
SET
  "recipientLastName" = CASE
    WHEN LENGTH(TRIM("recipientName")) > 0 THEN LEFT(TRIM("recipientName"), 1)
    ELSE ''
  END,
  "recipientFirstName" = CASE
    WHEN LENGTH(TRIM("recipientName")) > 1 THEN SUBSTRING(TRIM("recipientName") FROM 2)
    ELSE ''
  END;

ALTER TABLE "UserAddress"
ALTER COLUMN "recipientLastName" SET NOT NULL,
ALTER COLUMN "recipientFirstName" SET NOT NULL;

ALTER TABLE "UserAddress"
DROP COLUMN "recipientName";
