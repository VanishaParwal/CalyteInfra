import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertCircleSchema,
  insertJournalSchema,
  insertTrackSchema,
  insertGoalSchema,
  insertGameScoreSchema,
  insertSessionSchema,
  insertAssessmentSchema,
  insertDiscussionSchema // Added
} from "@shared/schema";
import { z } from "zod";

// FIX: Define a valid MongoDB ObjectId to prevent "Cast to ObjectId failed" errors
const TEST_USER_ID = "507f1f77bcf86cd799439011";

export async function registerRoutes(httpServer: Server, app: Express): Promise<void> {

  // ========================
  // AUTHENTICATION
  // ========================
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existing = await storage.getUserByUsername(data.username);
      if (existing) {
        res.status(400).json({ error: "Username already exists" });
        return;
      }
      const user = await storage.createUser(data);
      
      const userObj = user as any;
      const { password, ...safeUser } = userObj; 
      
      res.json(safeUser);
    } catch (error) {
      console.error("Signup Error:", error); // Added Log
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
      } else {
        res.status(400).json({ error: "Invalid user data" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      const targetUser = user as any;

      if (!user || targetUser.password !== password) { 
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      
      const { password: _, ...safeUser } = targetUser;
      res.json(safeUser);
    } catch (error) {
      console.error("Login Error:", error); // Added Log
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      
      const targetUser = user as any;
      const { password, ...safeUser } = targetUser;
      
      res.json(safeUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // ========================
  // TRACKS (Music/Audio)
  // ========================
  app.get("/api/tracks", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const tracks = await storage.getAllTracks(category);
      res.json(tracks);
    } catch (error: any) {
      console.error("Get Tracks Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/tracks", async (req, res) => {
    try {
      const data = insertTrackSchema.parse(req.body);
      const track = await storage.createTrack(data);
      res.status(201).json(track);
    } catch (error: any) {
      console.error("Create Track Error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // ========================
  // GOALS & HABITS
  // ========================
  app.get("/api/goals", async (req, res) => {
    try {
      const userId = req.query.userId as string || TEST_USER_ID;
      const goals = await storage.getUserGoals(userId);
      res.json(goals);
    } catch (error: any) {
      console.error("Get Goals Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const data = insertGoalSchema.parse(req.body);
      const userId = req.body.userId || TEST_USER_ID;
      const goal = await storage.createGoal(userId, data);
      res.status(201).json(goal);
    } catch (error: any) {
      console.error("Create Goal Error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // ========================
  // GAMES & SCORES
  // ========================
  app.get("/api/games/scores", async (req, res) => {
    try {
      const userId = req.query.userId as string || TEST_USER_ID;
      const scores = await storage.getUserGameScores(userId);
      res.json(scores);
    } catch (error: any) {
      console.error("Get Scores Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/games/scores", async (req, res) => {
    try {
      const data = insertGameScoreSchema.parse(req.body);
      const userId = req.body.userId || TEST_USER_ID;
      const score = await storage.saveGameScore(userId, data);
      res.status(201).json(score);
    } catch (error: any) {
      console.error("Save Score Error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // ========================
  // SESSIONS (Live Events)
  // ========================
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getAllSessions();
      res.json(sessions);
    } catch (error: any) {
      console.error("Get Sessions Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const data = insertSessionSchema.parse(req.body);
      const hostId = TEST_USER_ID;
      const hostName = "Test Host"; 
      const session = await storage.createSession({ ...data, hostId, hostName });
      res.status(201).json(session);
    } catch (error: any) {
      console.error("Create Session Error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // ========================
  // CIRCLES (Community)
  // ========================
  app.get("/api/circles", async (req, res) => {
    try {
      const circles = await storage.getAllCircles();
      res.json(circles);
    } catch (error: any) {
      console.error("Get Circles Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/circles", async (req, res) => {
    try {
      const data = insertCircleSchema.parse(req.body);
      const userId = TEST_USER_ID; 
      const circle = await storage.createCircle({ ...data, createdBy: userId });
      res.json(circle);
    } catch (error: any) {
      console.error("Create Circle Error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/circles/:id/join", async (req, res) => {
    try {
      const userId = TEST_USER_ID; 
      const result = await storage.joinCircle(req.params.id, userId);
      res.json({ success: result });
    } catch (error: any) {
      console.error("Join Circle Error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // --- NEW: Circle Discussions (Posts) ---
  app.get("/api/circles/:id/discussions", async (req, res) => {
    try {
      const discussions = await storage.getCircleDiscussions(req.params.id);
      res.json(discussions);
    } catch (error: any) {
      console.error("Get Discussion Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/circles/:id/discussions", async (req, res) => {
    try {
      const data = insertDiscussionSchema.parse(req.body);
      const userId = TEST_USER_ID; // Use valid ID
      const discussion = await storage.createDiscussion(req.params.id, userId, data);
      res.status(201).json(discussion);
    } catch (error: any) {
      console.error("Create Discussion Error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // ========================
  // JOURNAL
  // ========================
  app.get("/api/journal", async (req, res) => {
    try {
      const userId = req.query.userId as string || TEST_USER_ID;
      const entries = await storage.getUserJournalEntries(userId);
      res.json(entries);
    } catch (error: any) {
      console.error("Get Journal Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/journal", async (req, res) => {
    try {
      const data = insertJournalSchema.parse(req.body);
      const userId = req.body.userId || TEST_USER_ID;
      const entry = await storage.createJournalEntry(userId, data);
      res.status(201).json(entry);
    } catch (error: any) {
      console.error("Create Journal Error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // ========================
  // ASSESSMENTS (Mental Health)
  // ========================
  app.post("/api/assessments", async (req, res) => {
    try {
      const data = insertAssessmentSchema.parse(req.body);
      const userId = req.body.userId || TEST_USER_ID; 
      const assessment = await storage.createAssessment(userId, data);
      res.status(201).json(assessment);
    } catch (error: any) {
      console.error("Create Assessment Error:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/assessments", async (req, res) => {
    try {
      const userId = req.query.userId as string || TEST_USER_ID;
      const assessments = await storage.getUserAssessments(userId);
      res.json(assessments);
    } catch (error: any) {
      console.error("Get Assessment Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ========================
  // AI CHAT (Chatbase Integration)
  // ========================
  app.post("/api/chat/messages", async (req, res) => {
    try {
      const { content } = req.body;
      if (!content) {
        res.status(400).json({ error: "Content is required" });
        return;
      }

      const chatbaseAgentId = "6aWohxDZKFG3KTXT_tO5S";
      let aiResponse = null;
      
      try {
        const embedResponse = await fetch(`https://www.chatbase.co/api/v1/chatbots/${chatbaseAgentId}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content }),
        });

        if (embedResponse.ok) {
          const data = await embedResponse.json();
          aiResponse = data.text || data.response || data.answer || data.message;
        }
      } catch (e) {
        console.log("Chatbase primary endpoint failed, trying fallback...");
      }

      if (!aiResponse) {
        aiResponse = "I'm here to support you. How can I help you today?";
      }

      res.json({
        aiMessage: {
          content: aiResponse,
          role: 'assistant',
          createdAt: new Date()
        }
      });
    } catch (error: any) {
      console.error("Chat error:", error.message);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });
}