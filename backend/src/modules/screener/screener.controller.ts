import {
  type Request,
  type Response,
} from "express";

import { runScreener,getScreenerDateRange } from "./screener.service.js";

import {
  validateScreenerParams,
} from "./screener.validation.js";

export async function getScreenerResults(
  req: Request,
  res: Response
) {
  try {
    const period =
      typeof req.query.period === "string"
        ? req.query.period
        : "";

    const type =
      typeof req.query.type === "string"
        ? req.query.type
        : "";

    const date =
      typeof req.query.date === "string"
        ? req.query.date
        : "";

    const limit =
      typeof req.query.limit === "string"
        ? req.query.limit
        : "";

    const params =
      validateScreenerParams(
        period,
        type,
        date,
        limit
      );

    const results =
      await runScreener(
        params.period,
        params.type,
        params.date,
        params.limit
      );

    res.json(results);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        error: error.message,
      });
      return;
    }

    res.status(500).json({
      error: "Failed to run screener",
    });
  }
}

export async function getScreenerDateRangeController(
  req: Request,
  res: Response
) {
  try {
    const dateRange = await getScreenerDateRange();
    res.json(dateRange);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch screener date range",
    });
  }
}