import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import readline from "node:readline";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not configured in .env or .env.local.",
  );
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(text) {
  return new Promise((resolve) => {
    rl.question(text, resolve);
  });
}

async function main() {
  console.log("");
  console.log("=== IJER ADMIN ACCOUNT CREATION ===");
  console.log("");

  const name = String(
    await question("Admin name: "),
  ).trim();

  const email = String(
    await question("Admin email: "),
  )
    .trim()
    .toLowerCase();

  const password = String(
    await question("Admin password: "),
  );

  const confirmPassword = String(
    await question("Confirm password: "),
  );

  if (!name) {
    throw new Error(
      "Admin name is required.",
    );
  }

  if (
    !email ||
    !email.includes("@")
  ) {
    throw new Error(
      "Enter a valid email address.",
    );
  }

  if (password.length < 8) {
    throw new Error(
      "Password must contain at least 8 characters.",
    );
  }

  if (password !== confirmPassword) {
    throw new Error(
      "Passwords do not match.",
    );
  }

  const existing =
    await prisma.admin.findUnique({
      where: {
        email,
      },
    });

  if (existing) {
    throw new Error(
      "An administrator with this email already exists.",
    );
  }

  const passwordHash =
    await bcrypt.hash(
      password,
      12,
    );

  const admin =
    await prisma.admin.create({
      data: {
        name,
        email,
        passwordHash,
        role: "SUPER_ADMIN",
        active: true,
      },
    });

  console.log("");
  console.log(
    "ADMIN ACCOUNT CREATED SUCCESSFULLY",
  );
  console.log(
    "----------------------------------",
  );
  console.log(`Name:  ${admin.name}`);
  console.log(`Email: ${admin.email}`);
  console.log(`Role:  ${admin.role}`);
  console.log("");
}

main()
  .catch((error) => {
    console.error("");
    console.error(
      "ERROR:",
      error instanceof Error
        ? error.message
        : error,
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });