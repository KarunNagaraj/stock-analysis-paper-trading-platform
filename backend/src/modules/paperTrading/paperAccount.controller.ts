import type { Request, Response } from "express";
import {
  createAccount,
  getAccount,
  resetAccount
} from "./paperAccount.service.js";
import type { CreatePaperAccountInput } from "./paperAccount.types.js";

//req.user is set by the authenticateToken middleware, which is applied to all routes in paperAccount.route.ts. If req.user is not set, it means the user is not authenticated, and we return a 401 Unauthorized response.
export async function getPaperAccount(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const account = await getAccount(req.user.id);

    if (!account) {
      res.status(404).json({ error: "Paper account not found" });
      return;
    }

    res.json(account);
  } catch (error) {
    console.error("Failed to retrieve paper account:", error);
    res.status(500).json({ error: "Failed to retrieve paper account" });
  }
}

export async function createPaperAccount(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const account = await createAccount(
      req.user.id,
      req.body
    );
    res.status(201).json(account);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create paper account";
    const status = message.includes("already exists") || message.includes("must be") ? 400 : 500;
    res.status(status).json({ error: message });
  }
}

export async function resetPaperAccount(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const input = req.body as CreatePaperAccountInput;

    const account = await resetAccount(
      req.user.id,
      input
    );

    res.status(200).json(account);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      message: "Failed to reset paper trading account",
    });
  }
}
