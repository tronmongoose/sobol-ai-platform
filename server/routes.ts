import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { users, reputationEvents, achievements, userAchievements } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  app.post("/api/wallet/connect", async (req, res) => {
    // Implement CDP Smart Wallet connection
    res.json({ success: true });
  });

  app.post("/api/agent/configure", async (req, res) => {
    const { autoVote, riskLevel } = req.body;
    // Implement AI agent configuration
    res.json({ success: true });
  });

  app.get("/api/missions", async (req, res) => {
    // Return available missions
    res.json([
      {
        id: 1,
        title: "Governance Vote",
        description: "Participate in DAO governance voting",
        reward: 100,
        progress: 75,
      },
      {
        id: 2,
        title: "Token Staking",
        description: "Stake tokens in the liquidity pool",
        reward: 250,
        progress: 30,
      },
    ]);
  });

  // Darknet Hub endpoints
  app.get("/api/darknet/tasks", async (req, res) => {
    // Return darknet tasks (mock data for now)
    res.json([
      {
        id: "1",
        title: "Smart Contract Audit",
        description: "Review and identify vulnerabilities in a new DeFi protocol",
        reward: 500,
        difficulty: "hard",
        status: "open",
      },
      {
        id: "2",
        title: "Governance Proposal Analysis",
        description: "Analyze and provide insights on upcoming governance proposals",
        reward: 200,
        difficulty: "medium",
        status: "open",
      },
    ]);
  });

  app.post("/api/darknet/tasks", async (req, res) => {
    const { title, description, reward, difficulty } = req.body;
    // Create new task (mock implementation)
    res.json({
      id: Date.now().toString(),
      title,
      description,
      reward,
      difficulty,
      status: "open",
    });
  });

  app.post("/api/darknet/tasks/:id/accept", async (req, res) => {
    const { id } = req.params;
    // Accept task implementation
    res.json({ success: true });
  });

  // Get user's reputation and level
  app.get("/api/user/reputation/:userId", async (req, res) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, parseInt(req.params.userId)),
        with: {
          reputationEvents: {
            orderBy: desc(reputationEvents.timestamp),
            limit: 5,
          },
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        reputation: user.reputation,
        level: user.level,
        recentEvents: user.reputationEvents,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reputation" });
    }
  });

  // Get user's achievements
  app.get("/api/user/achievements/:userId", async (req, res) => {
    try {
      const userAchievs = await db.query.userAchievements.findMany({
        where: eq(userAchievements.userId, parseInt(req.params.userId)),
        with: {
          achievement: true,
        },
      });

      res.json(userAchievs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Record a reputation event
  app.post("/api/reputation/event", async (req, res) => {
    const { userId, amount, reason } = req.body;

    try {
      // Start a transaction to ensure data consistency
      await db.transaction(async (tx) => {
        // Record the reputation event
        await tx.insert(reputationEvents).values({
          userId,
          amount,
          reason,
        });

        // Update user's reputation and level
        await tx
          .update(users)
          .set({
            reputation: sql`${users.reputation} + ${amount}`,
            level: sql`CASE 
              WHEN (${users.reputation} + ${amount}) / 1000 > ${users.level}
              THEN (${users.reputation} + ${amount}) / 1000 
              ELSE ${users.level} 
            END`,
          })
          .where(eq(users.id, userId));
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to record reputation event" });
    }
  });

  // Unlock an achievement
  app.post("/api/achievement/unlock", async (req, res) => {
    const { userId, achievementId } = req.body;

    try {
      // Check if achievement already unlocked
      const existing = await db.query.userAchievements.findFirst({
        where: (ua) =>
          eq(ua.userId, userId) && eq(ua.achievementId, achievementId),
      });

      if (existing) {
        return res.status(400).json({ message: "Achievement already unlocked" });
      }

      // Start a transaction to ensure data consistency
      await db.transaction(async (tx) => {
        // Get achievement details
        const achievement = await tx.query.achievements.findFirst({
          where: eq(achievements.id, achievementId),
        });

        if (!achievement) {
          throw new Error("Achievement not found");
        }

        // Record the achievement
        await tx.insert(userAchievements).values({
          userId,
          achievementId,
        });

        // Add reputation reward
        await tx.insert(reputationEvents).values({
          userId,
          amount: achievement.reputationReward,
          reason: `Unlocked achievement: ${achievement.title}`,
        });

        // Update user's reputation
        await tx
          .update(users)
          .set({
            reputation: sql`${users.reputation} + ${achievement.reputationReward}`,
          })
          .where(eq(users.id, userId));
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to unlock achievement" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}