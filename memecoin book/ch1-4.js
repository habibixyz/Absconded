const B = require("./build");
const { children, H1, H2, P, Lead, BL, NL, QUOTE, PageBreakPara, CalloutBox, SpacerAfterTable } = B;

// ===================== PROLOGUE =====================
children.push(H1("Prologue: The Degen in the Rented Room"));
children.push(Lead("Every transition begins with a rattling ceiling fan and an unclosed chart at 3:14 AM."));

children.push(P("The heat in Mumbai doesn't leave at night; it just settles into the concrete, waiting for the humidity to trap it. In a rented room near the train lines, Tanvir sat in the dark, his face illuminated by the harsh white glow of a DexScreener dashboard. On the screen, green and red lines fought each other in real-time, spikes of retail hope instantly crushed by automated sell orders."));
children.push(P("For years, his life had structure. A hospitality degree. Procurement. Vendor contracts. He negotiated shipping costs for steel widgets and tracked retail supply chains. The corporate world was predictable, clean, and completely dead. It offered stability in exchange for silence."));
children.push(P("Then the internet mutated. Crypto wasn't just a speculation for him; it was an exit. It was the first time the world felt editable. But editing the world turned out to be expensive. Burner wallets drained, FOMO-induced entries at local tops, and the quiet, recurring humiliation of looking at a portfolio that only went down."));
children.push(P("None of this is financial advice. Every word in these chapters represents my personal experience, my own drawdowns, and my raw observations of the market. This guide is written purely for educational purposes to document the mechanics of the memecoin trenches as I lived them. Memecoins are highly speculative, volatile, and carry a high probability of total capital loss."));

children.push(...QUOTE("Disappearing is easy. Evolving inside the digital noise is the hard part.", "— Tanvir Khan, Absconded"));

children.push(PageBreakPara());

// ===================== CHAPTER 1 =====================
children.push(H1("Chapter 1: Why Most People Lose: The Honest Starting Point"));
children.push(Lead("Before you fund a wallet or copy-paste a contract address, you must understand the base rate. The house is not neutral."));

children.push(P("In 2026, CoinGecko analyzed Pump.fun data and revealed what anyone in the trenches already knows: the overwhelming majority of small traders end up flat or deep in the red. Gains and losses are clustered in tiny dollar amounts. The market is not a ladder; it's a high-frequency, low-conviction meat grinder designed to extract capital from late arrivals."));
children.push(P("This is not a warning to stay away. It is an invitation to stop playing like an amateur. In memecoins, you are playing poker in a room full of professionals, insiders, and automated MEV bots. If you don't have a system, you are the liquidity."));

children.push(H2("The Fatigue Loop"));
children.push(P("You feel tired, stuck, and lazy. That isn't a character flaw. It's system fatigue. Spending twelve hours a day refreshing Twitter feeds, chasing green candles, and holding bags of dying tokens produces a unique kind of exhaustion. You are busy, but you aren't progressing. The solution isn't to click faster. It's to build a set of rules that act before you are excited or terrified."));

children.push(...QUOTE("The data indicated that both gains and losses are largely clustered in small amounts, reflecting the high-frequency nature of memecoin speculation where participants deploy small amounts of capital.", "— CoinGecko analysis of Pump.fun trader profitability, 2026"));

children.push(PageBreakPara());

// ===================== CHAPTER 2 =====================
children.push(H1("Chapter 2: Crypto Fundamentals You Actually Need"));
children.push(Lead("You don't need a computer science degree to trade. You do need to understand how the plumbing works, or you will drown in it."));

children.push(H2("2.1 Wallets: The Keys to the Vault"));
children.push(P("A self-custody wallet (Phantom, Solflare, Rabby, MetaMask) is not an account; it is a cryptographic keypair. If you lose the private key or seed phrase, the funds are gone forever. If you type it into a website, you have handed your house keys to a thief. Use a burner wallet for active trading, and keep your core capital in a cold wallet that never signs suspicious contracts."));

children.push(H2("2.2 Market Cap, FDV, and the Liquidity Illusion"));
children.push(P("People lose money because they don't understand the difference between size and depth:"));
children.push(BL("Market Cap: Circulating supply multiplied by current price. It's a vanity metric."));
children.push(BL("Fully Diluted Valuation (FDV): Total supply multiplied by price. If a coin has a $1M market cap but 90% of the supply is locked to be dumped later, the FDV reveals the true supply shock coming."));
children.push(BL("Liquidity: The actual cash (SOL, USDC) sitting in the trading pool. If a coin has a $5M market cap but only $20,000 in liquidity, a single $3,000 sell will crater the price by 50%. You cannot exit a large position if the pool is dry."));

children.push(H2("2.3 Bonding Curves and Slippage"));
children.push(P("A bonding curve is a mathematical contract that acts as the counterparty. As people buy, the price rises along a curve. There is no order book. Slippage is the difference between the price you clicked and the price you got. MEV bots watch the mempool, sandwiching your trades to buy before you and sell after, skimming your slippage."));

children.push(H2("2.4 Trench Glossary"));
const glossaryRows = [
  ["Term", "The Street Reality"],
  ["Aping", "Buying on momentum with zero research because you're scared of being left behind."],
  ["Bagholder", "The person left holding the token after the creators and insiders have cashed out."],
  ["Rug Pull", "The developers drain the liquidity pool or dump their supply, vanishing with the funds."],
  ["Trenches", "The brutal, high-speed launchpads where tokens live and die in seconds."],
  ["Whale", "A wallet with enough capital to crash the chart with a single click."],
  ["Jeet", "A paper-handed trader who dumps their position at the first sign of a dip, ruining momentum."]
];
children.push(new B.Table({
  width: { size: 100, type: B.WidthType.PERCENTAGE },
  rows: glossaryRows.map((row, i) => new B.TableRow({
    tableHeader: i === 0,
    children: row.map(cellText => new B.TableCell({
      width: { size: 50, type: B.WidthType.PERCENTAGE },
      shading: i === 0 ? { type: B.ShadingType.CLEAR, fill: "2B2B2B" } : undefined,
      margins: { top: 100, bottom: 100, left: 120, right: 120 },
      children: [new B.Paragraph({ children: [new B.TextRun({ text: cellText, bold: i === 0, color: i === 0 ? "FFFFFF" : "000000", size: 20 })] })],
    })),
  })),
}));
children.push(SpacerAfterTable());
children.push(PageBreakPara());

// ===================== CHAPTER 3 =====================
children.push(H1("Chapter 3: The Solana Engine — Pump.fun, Bonding Curves, and PumpSwap"));
children.push(Lead("Solana didn't win because of superior tech. It won because it made speculation cheap enough for the masses."));

children.push(H2("3.1 The Low-Fee Casino"));
children.push(P("Solana's transaction fees are fractions of a cent, and its block times are 400 milliseconds. This speed and cost profile allows a trader to deploy $15 into a new token without losing $50 in gas fees (like Ethereum). This accessibility built the modern trenches."));

children.push(H2("3.2 How Pump.fun Dictates the Meta"));
children.push(P("Pump.fun removed the technical barrier to launching a coin. Anyone can create a token for 0.02 SOL with no coding. It starts on a bonding curve. If the curve is filled, the token 'graduates' to PumpSwap or Raydium, where real AMM trading begins."));
children.push(P("But graduation is a statistical anomaly. In 2026, less than 1% of launched tokens graduated. The rest died on the curve, leaving buyers with worthless dust. The platform's activity swings wildly from euphoria to depression, acting as a macro indicator for retail appetite."));

children.push(H2("3.3 The Trench Toolset"));
children.push(BL("DexScreener/GMGN: Your command center. Real-time charts, holder data, and transaction flows."));
children.push(BL("Bubblemaps: Shines a light on insider rings. If ten wallets hold 45% of the supply and are linked on-chain, it's a coordinated dump waiting to happen."));
children.push(BL("RugCheck: Automated contract scanner that flags mint authority and locked liquidity status."));

children.push(...QUOTE("Solana became the home of memecoin culture because it reduced the cost of being wrong to cents.", "— Altrady Solana Memecoin Trading Guide, 2026"));

children.push(PageBreakPara());

// ===================== CHAPTER 4 =====================
children.push(H1("Chapter 4: Base, Clanker, Zora, and the EVM Meme Scene"));
children.push(Lead("EVM chains didn't die; they migrated. Coinbase's Base layer built an ecosystem that trades speed for social context."));

children.push(H2("4.1 Base and Farcaster Culture"));
children.push(P("Base is Ethereum's Layer-2, backed by Coinbase. Its memecoin ecosystem grew out of social client frameworks like Farcaster and Warpcast. Unlike Solana's anonymous, bot-driven casino, Base meme culture revolves around communities, creators, and social identity."));
children.push(P("Tools like Clanker allow users to launch tokens directly from a social post. Zora connects NFT creators and social tokens to digital art. The trades are slower, but the narratives have longer half-lives because they are anchored to actual communities."));

children.push(H2("4.2 The Blue Chips of Base"));
children.push(P("Tokens like DEGEN, TOSHI, and BRETT have sustained valuations because they are woven into the infrastructure of the L2. DEGEN is used to tip creators on Farcaster; TOSHI is the mascot of the chain's builder ethos. But do not mistake social alignment for safety. When the market turns, community-centric coins dump just as hard as anonymous pump tokens."));

children.push(CalloutBox("Trench Comparison Matrix", [
  "Solana: High speed, low fees, extreme bot saturation. The meta changes in minutes.",
  "Base: Social-native, creator-focused, slower execution. Heavily tied to Farcaster networks.",
  "EVM (Ethereum Mainnet): High gas fees protect against micro-launches, leaving it as the playground for large-scale whale speculation."
]));
children.push(SpacerAfterTable());
children.push(PageBreakPara());
