import { NextApiRequest, NextApiResponse } from "next";
import { generateCommentary } from "@/lib/gemini";
import yahooFinance from "yahoo-finance2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { symbol } = req.body;
  const data = await yahooFinance.quoteSummary(symbol, { modules: ["price", "summaryDetail"] });
  console.log("Fetched data:", data);
  const price = data.price.regularMarketPrice;
  const volume = data.summaryDetail.volume;

  const prompt = `Generate a 2-paragraph commentary for ${symbol}. 
    The price is ${price}, and the volume is ${volume}. 
    Use a financial analyst tone.`;

  const commentary = await generateCommentary(prompt);
  res.status(200).json({ commentary });
}
