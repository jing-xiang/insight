import { NextApiRequest, NextApiResponse } from "next";
import { generateCommentary } from "@/lib/gemini";
import yahooFinance from "yahoo-finance2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { symbol } = req.body;
  
  try {
    const data = await yahooFinance.quoteSummary(symbol, { modules: ["price", "summaryDetail"] });

    const price = data?.price?.regularMarketPrice;
    const volume = data?.summaryDetail?.volume;

    if (price === undefined || volume === undefined) {
      return res.status(400).json({ error: "Missing price or volume data." });
    }

    const prompt = `Generate a 2-paragraph commentary for ${symbol}. 
      The price is ${price}, and the volume is ${volume}. 
      Use a financial analyst tone. Avoid using placeholders like [Next Quarter] or generic suggestions. Focus on actual data provided and current market tone.`;

    const commentary = await generateCommentary(prompt);
    console.log(data)
    // console.log(commentary);
    // console.log("Commentary type:", typeof commentary);
    res.status(200).json({ commentary });

  } catch (error: unknown) {
    let errorString = "An unknown error occurred.";

    if (error instanceof Error) {
      errorString = error.message;
    } else if (typeof error === "string") {
      errorString = error;
    } else {
      errorString = JSON.stringify(error);
    }

    console.log("Error caught:", errorString);
    res.status(200).json({ commentary: errorString });
  };
}
