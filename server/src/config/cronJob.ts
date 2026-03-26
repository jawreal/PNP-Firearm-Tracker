import cron from "node-cron";
import { AuditLogModel } from "@/models/auditModel";

// check everyday 0 0 * * *
// check per 2 mins */2 * * * * (for testing)

cron.schedule("0 0 * * *", async () => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  try {
    const { deletedCount } = await AuditLogModel.deleteMany({
      createdAt: {
        $lte: thirtyDaysAgo,
      },
    });

    if (deletedCount > 0) {
      console.log("An audit record has been deleted");
    }
    console.log("Cron job runs")
  } catch (error) {
    console.error("Error updating expired users:", error);
  }
});
