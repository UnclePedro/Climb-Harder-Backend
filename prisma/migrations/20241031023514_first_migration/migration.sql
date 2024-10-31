-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "apiKey" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" SERIAL NOT NULL,
    "quote" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'Unknown',
    "authorId" INTEGER NOT NULL,
    "isUserQuote" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_apiKey_key" ON "User"("apiKey");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
