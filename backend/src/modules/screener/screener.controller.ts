import { Request, Response } from "express";

export async function getScreenerResults(_req: Request, res: Response) {
  res.status(501).json({ message: "Screener not implemented yet" });
}
