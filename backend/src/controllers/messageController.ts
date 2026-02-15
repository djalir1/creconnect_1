import { Request, Response } from "express";
import prisma from "../utils/prisma.js";
import { z } from "zod";

const sendMessageSchema = z.object({
  receiverId: z.string().uuid(),
  content: z.string().min(1, "Message content cannot be empty"),
});

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const senderId = req.user?.userId;
    if (!senderId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { receiverId, content } = sendMessageSchema.parse(req.body);

    if (senderId === receiverId) {
      res.status(400).json({ message: "Cannot send message to yourself" });
      return;
    }

    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      res.status(404).json({ message: "Receiver not found" });
      return;
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });

    res.status(201).json(message);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: (error as any).issues[0]?.message || "Validation error" });
      return;
    }
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { otherUserId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyConversations = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Fetch messages where user is sender or receiver
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
      },
    });

    const contactIds = new Set<string>();
    const conversations: any[] = [];

    for (const msg of messages) {
      if (msg.senderId === null) {
        // Guest message
        conversations.push({
          id: msg.id,
          participantName: msg.guestName || "Guest Client",
          participantAvatar: null,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt
        });
        continue;
      }

      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!otherUser) continue;
      
      const otherId = otherUser.id;
      if (!contactIds.has(otherId)) {
        contactIds.add(otherId);
        conversations.push({
          id: msg.id,
          participantName: otherUser.name,
          participantAvatar: otherUser.avatar,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt
        });
      }
    }

    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
