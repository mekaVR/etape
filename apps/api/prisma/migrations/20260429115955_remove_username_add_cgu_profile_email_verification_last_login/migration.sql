/*
  Warnings:

  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - Added the required column `cguAcceptedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Civilite" AS ENUM ('MADAME', 'MONSIEUR');

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "username",
ADD COLUMN     "cguAcceptedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "lastLoginAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "BeneficiaireProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "civilite" "Civilite",
    "nom" TEXT,
    "prenom" TEXT,
    "dateNaissance" TIMESTAMP(3),
    "lieuNaissance" TEXT,
    "nationalite" TEXT,
    "numeroSecuriteSociale" TEXT,
    "adresseNumero" TEXT,
    "adresseVoie" TEXT,
    "adresseComplement" TEXT,
    "codePostal" TEXT,
    "ville" TEXT,
    "telephoneFixe" TEXT,
    "telephonePortable" TEXT,
    "datePremierEmploi" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BeneficiaireProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BeneficiaireProfile_userId_key" ON "BeneficiaireProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BeneficiaireProfile_numeroSecuriteSociale_key" ON "BeneficiaireProfile"("numeroSecuriteSociale");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_tokenHash_key" ON "EmailVerificationToken"("tokenHash");

-- CreateIndex
CREATE INDEX "EmailVerificationToken_userId_idx" ON "EmailVerificationToken"("userId");

-- AddForeignKey
ALTER TABLE "BeneficiaireProfile" ADD CONSTRAINT "BeneficiaireProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
