import prisma from "../src/utils/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Starting seeding...");

  // Clear existing data (optional, but good for clean state)
  await prisma.booking.deleteMany();
  await prisma.message.deleteMany();
  await prisma.review.deleteMany();
  await prisma.studio.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create test owner
  const owner = await prisma.user.create({
    data: {
      name: "Test Owner",
      email: "owner@test.com",
      password: hashedPassword,
      role: "STUDIO_OWNER",
    },
  });

  console.log("Created user:", owner.email);

  // Create test studio
  const studio = await prisma.studio.create({
    data: {
      name: "Skyline Creative Studio",
      description: "A beautiful studio with panoramic views of Kigali. Perfect for photography and recording.",
      location: "Kigali, Gasabo",
      pricePerHour: 25.0,
      images: ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop"],
      features: ["WiFi", "Parking", "Soundproof", "Equipment Hire"],
      rating: 4.8,
      ownerId: owner.id,
    },
  });

  console.log("Created studio:", studio.name);

  // Create admin user for dev/testing
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@test.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Created admin user:", admin.email, "password: password123");



  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
