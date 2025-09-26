import mutate from "@/lib/firebase/mutate-data";
import { seedBranches, seedServices } from "./seed-data";

/**
 * Seed Database Function
 * 
 * This function populates the Firebase database with sample data
 * for services and branches to demonstrate the UI functionality.
 */

export interface SeedResult {
  success: boolean;
  servicesCreated: number;
  branchesCreated: number;
  errors: string[];
}

export async function seedDatabase(): Promise<SeedResult> {
  const result: SeedResult = {
    success: true,
    servicesCreated: 0,
    branchesCreated: 0,
    errors: []
  };

  try {
    // Seed Services
    console.log("🌱 Seeding services...");
    for (const serviceData of seedServices) {
      try {
        const serviceResult = await mutate({
          path: "services",
          data: {
            ...serviceData,
            createdAt: new Date().toISOString(),
          },
          action: "createWithId",
        });

        if (serviceResult.success) {
          result.servicesCreated++;
          console.log(`✅ Created service: ${serviceData.title}`);
        } else {
          result.errors.push(`Failed to create service: ${serviceData.title}`);
        }
      } catch (error) {
        const errorMessage = `Error creating service ${serviceData.title}: ${error}`;
        result.errors.push(errorMessage);
        console.error(errorMessage);
      }
    }

    // Seed Branches
    console.log("🌱 Seeding branches...");
    for (const branchData of seedBranches) {
      try {
        const branchResult = await mutate({
          path: "branches",
          data: {
            ...branchData,
            createdAt: new Date().toISOString(),
          },
          action: "createWithId",
        });

        if (branchResult.success) {
          result.branchesCreated++;
          console.log(`✅ Created branch: ${branchData.name}`);
        } else {
          result.errors.push(`Failed to create branch: ${branchData.name}`);
        }
      } catch (error) {
        const errorMessage = `Error creating branch ${branchData.name}: ${error}`;
        result.errors.push(errorMessage);
        console.error(errorMessage);
      }
    }

    // Check if we have any errors
    if (result.errors.length > 0) {
      result.success = false;
    }

    console.log(`🎉 Seeding completed! Created ${result.servicesCreated} services and ${result.branchesCreated} branches`);
    
    return result;
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    result.success = false;
    result.errors.push(`Seeding failed: ${error}`);
    return result;
  }
}

/**
 * Clear Database Function
 * 
 * This function removes all services and branches from the database.
 * Use with caution!
 */
export async function clearDatabase(): Promise<{ success: boolean; errors: string[] }> {
  const result = {
    success: true,
    errors: [] as string[]
  };

  try {
    console.log("🗑️ Clearing database...");
    
    // Clear services
    const servicesResult = await mutate({
      path: "services",
      action: "delete",
    });

    if (!servicesResult.success) {
      result.errors.push("Failed to clear services");
    }

    // Clear branches
    const branchesResult = await mutate({
      path: "branches",
      action: "delete",
    });

    if (!branchesResult.success) {
      result.errors.push("Failed to clear branches");
    }

    if (result.errors.length > 0) {
      result.success = false;
    }

    console.log("✅ Database cleared successfully");
    return result;
  } catch (error) {
    console.error("❌ Clearing database failed:", error);
    result.success = false;
    result.errors.push(`Clearing failed: ${error}`);
    return result;
  }
}