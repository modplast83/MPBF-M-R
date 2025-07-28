import { db } from "./db.js";
import { jobOrderUpdates } from "../shared/schema.js";

// Create sample job order updates for testing desktop notifications
export async function createSampleJobOrderUpdates() {
  const sampleUpdates = [
    {
      jobOrderId: 1,
      updateType: "status_change",
      title: "Job Order Status Updated",
      message: "Job Order #1 status changed from pending to in_progress",
      priority: "medium",
      metadata: { 
        oldStatus: "pending", 
        newStatus: "in_progress",
        changedBy: "system" 
      },
      createdBy: "admin",
    },
    {
      jobOrderId: 2,
      updateType: "priority_change",
      title: "High Priority Job Order",
      message: "Job Order #2 priority escalated to urgent due to customer requirements",
      priority: "urgent",
      metadata: { 
        oldPriority: "medium", 
        newPriority: "urgent",
        reason: "customer_requirements" 
      },
      createdBy: "admin",
    },
    {
      jobOrderId: 3,
      updateType: "quality_issue",
      title: "Quality Issue Detected",
      message: "Quality control issue found in Job Order #3 - immediate attention required",
      priority: "critical",
      metadata: { 
        issueType: "dimensional_variance",
        severity: "critical",
        qcInspector: "inspector_001" 
      },
      createdBy: "admin",
    },
    {
      jobOrderId: 4,
      updateType: "delayed",
      title: "Production Delay",
      message: "Job Order #4 experiencing delays due to machine maintenance",
      priority: "urgent",
      metadata: { 
        delayReason: "machine_maintenance",
        estimatedDelay: "4 hours",
        affectedMachine: "extruder_001" 
      },
      createdBy: "admin",
    },
    {
      jobOrderId: 5,
      updateType: "completed",
      title: "Job Order Completed",
      message: "Job Order #5 has been successfully completed and is ready for packaging",
      priority: "low",
      metadata: { 
        completionTime: new Date().toISOString(),
        qualityStatus: "passed",
        nextStep: "packaging" 
      },
      createdBy: "admin",
    },
  ];

  try {
    console.log("Creating sample job order updates...");
    
    for (const update of sampleUpdates) {
      await db.insert(jobOrderUpdates).values(update);
      console.log(`Created update: ${update.title}`);
    }
    
    console.log("Sample job order updates created successfully!");
  } catch (error) {
    console.error("Error creating sample job order updates:", error);
  }
}

// Export for use in other files
export { createSampleJobOrderUpdates };