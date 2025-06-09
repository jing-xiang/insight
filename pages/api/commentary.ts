import { NextApiRequest, NextApiResponse } from "next";
import { generateCommentary } from "@/lib/gemini";
import yahooFinance from "yahoo-finance2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { symbol } = req.body;
  const data = await yahooFinance.quoteSummary(symbol, { modules: ["price", "summaryDetail"] });

  const price = data?.price?.regularMarketPrice;
  const volume = data?.summaryDetail?.volume;
  const forwardPE = data?.summaryDetail?.forwardPE;
  const marketCap = data?.summaryDetail?.marketCap;
  const fiftyDayAvg = data?.summaryDetail?.fiftyDayAverage;

  if (price === undefined || volume === undefined || forwardPE === undefined || marketCap === undefined || fiftyDayAvg === undefined) {
    return res.status(400).json({ error: "Missing market data." });
  }

  console.log(data)

  const prompt = `You are a personal assistant and stock detail advisor to a banker. You will give him useful insights based on the current intraday statistics.
   stock ticker. Most importantly, your response needs to add value to the user and ensure that you give them a high level daily update on the stock ticker based on the 
   following parameters for the stock ticker ${symbol}.
   The price is ${price}, and the volume is ${volume}. 
   The forward PE is ${forwardPE}, the market cap is ${marketCap}, and the fifty day moving average is ${fiftyDayAvg}.
   You can use these information to compare the company to market leaders if deemed fit.
   Keep the response to 2 paragraphs and use a financial analyst tone. You do not need to greet the user.`;

  const commentary = await generateCommentary(prompt);
  res.status(200).json({ commentary });
}
