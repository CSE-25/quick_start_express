-- Drop table if it exists
DROP TABLE IF EXISTS "User";

-- Create table
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Drop index if it exists
DROP INDEX IF EXISTS "User_email_key";

-- Create index
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
