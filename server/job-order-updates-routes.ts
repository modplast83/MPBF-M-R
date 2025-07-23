import { Express } from "express";
import { requireAuth } from "./auth-utils.js";
import { db } from "./db.js";
import { jobOrders, jobOrderUpdates } from "../shared/schema.js";
import { desc, eq, and, gte } from "drizzle-orm";

interface JobOrderUpdate {
  id: number;
  jobOrderId: string;
  type: 'status_change' | 'priority_change' | 'assigned' | 'completed' | 'delayed' | 'quality_issue';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  timestamp: string;
  metadata?: Record<string, any>;
}

export function setupJobOrderUpdateRoutes(app: Express) {
  // Get recent job order updates for desktop notifications
  app.get("/api/job-order-updates", requireAuth, async (req, res) => {
    try {
      const user = req.user;
      const since = req.query.since ? new Date(req.query.since as string) : new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours
      
      // Get recent job order updates
      const updates = await db
        .select()
        .from(jobOrderUpdates)
        .where(gte(jobOrderUpdates.createdAt, since))
        .orderBy(desc(jobOrderUpdates.createdAt))
        .limit(50);

      // Transform to the expected format
      const formattedUpdates: JobOrderUpdate[] = updates.map(update => ({
        id: update.id,
        jobOrderId: update.jobOrderId.toString(),
        type: update.updateType as any,
        title: update.title,
        message: update.message,
        priority: update.priority as any,
        timestamp: update.createdAt.toISOString(),
        metadata: update.metadata as Record<string, any> || {},
      }));

      res.json(formattedUpdates);
    } catch (error) {
      console.error("Error fetching job order updates:", error);
      res.status(500).json({ error: "Failed to fetch job order updates" });
    }
  });

  // Create a new job order update (for internal use)
  app.post("/api/job-order-updates", requireAuth, async (req, res) => {
    try {
      const { jobOrderId, updateType, title, message, priority, metadata } = req.body;
      
      if (!jobOrderId || !updateType || !title || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newUpdate = await db
        .insert(jobOrderUpdates)
        .values({
          jobOrderId: parseInt(jobOrderId),
          updateType,
          title,
          message,
          priority: priority || 'medium',
          metadata: metadata || {},
          createdBy: req.user?.id || null,
        })
        .returning();

      res.status(201).json(newUpdate[0]);
    } catch (error) {
      console.error("Error creating job order update:", error);
      res.status(500).json({ error: "Failed to create job order update" });
    }
  });

  // Trigger notifications for common job order events
  app.post("/api/job-order-updates/trigger/:jobOrderId", requireAuth, async (req, res) => {
    try {
      const { jobOrderId } = req.params;
      const { event, metadata } = req.body;

      // Get job order details
      const jobOrder = await db
        .select()
        .from(jobOrders)
        .where(eq(jobOrders.id, parseInt(jobOrderId)))
        .limit(1);

      if (!jobOrder.length) {
        return res.status(404).json({ error: "Job order not found" });
      }

      const jo = jobOrder[0];
      let updateData: Partial<JobOrderUpdate> = {};

      switch (event) {
        case 'status_changed':
          updateData = {
            type: 'status_change',
            title: `Job Order Status Updated`,
            message: `Job Order ${jobOrderId} status changed to ${metadata?.newStatus || 'unknown'}`,
            priority: metadata?.newStatus === 'urgent' ? 'urgent' : 'medium',
          };
          break;
        
        case 'priority_changed':
          updateData = {
            type: 'priority_change',
            title: `Job Order Priority Updated`,
            message: `Job Order ${jobOrderId} priority changed to ${metadata?.newPriority || 'unknown'}`,
            priority: metadata?.newPriority === 'urgent' ? 'urgent' : 'high',
          };
          break;
        
        case 'assigned':
          updateData = {
            type: 'assigned',
            title: `Job Order Assigned`,
            message: `Job Order ${jobOrderId} assigned to ${metadata?.assignedTo || 'unknown'}`,
            priority: 'medium',
          };
          break;
        
        case 'completed':
          updateData = {
            type: 'completed',
            title: `Job Order Completed`,
            message: `Job Order ${jobOrderId} has been completed`,
            priority: 'low',
          };
          break;
        
        case 'delayed':
          updateData = {
            type: 'delayed',
            title: `Job Order Delayed`,
            message: `Job Order ${jobOrderId} is experiencing delays`,
            priority: 'urgent',
          };
          break;
        
        case 'quality_issue':
          updateData = {
            type: 'quality_issue',
            title: `Quality Issue Detected`,
            message: `Quality issue detected in Job Order ${jobOrderId}`,
            priority: 'critical',
          };
          break;
        
        default:
          return res.status(400).json({ error: "Unknown event type" });
      }

      // Create the update notification
      const newUpdate = await db
        .insert(jobOrderUpdates)
        .values({
          jobOrderId: parseInt(jobOrderId),
          updateType: updateData.type!,
          title: updateData.title!,
          message: updateData.message!,
          priority: updateData.priority!,
          metadata: metadata || {},
          createdBy: req.user?.id || null,
        })
        .returning();

      res.status(201).json(newUpdate[0]);
    } catch (error) {
      console.error("Error triggering job order update:", error);
      res.status(500).json({ error: "Failed to trigger job order update" });
    }
  });

  // Mark job order updates as read
  app.post("/api/job-order-updates/mark-read", requireAuth, async (req, res) => {
    try {
      const { updateIds } = req.body;
      
      if (!Array.isArray(updateIds)) {
        return res.status(400).json({ error: "updateIds must be an array" });
      }

      // For now, we'll just return success since we don't have a read status field
      // In a real implementation, you might want to add a read status field
      res.json({ success: true, markedCount: updateIds.length });
    } catch (error) {
      console.error("Error marking updates as read:", error);
      res.status(500).json({ error: "Failed to mark updates as read" });
    }
  });
}