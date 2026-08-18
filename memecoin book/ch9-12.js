const B = require("./build");
const { children, H1, H2, P, Lead, BL, NL, QUOTE, PageBreakPara, CalloutBox, SpacerAfterTable } = B;

// ===================== CHAPTER 9 =====================
children.push(H1("Chapter 9: The Psychology of the Trenches"));
children.push(Lead("The hardest battle in trading is not against the bots. It is against the chemistry of your own brain."));

children.push(H2("9.1 Manufactured Urgency"));
children.push(P("The interfaces of the trenches are designed to exploit human vulnerability. The flashing green numbers, the sound alerts, the screenshots of an anonymous user who turned $50 into $100,000 — it is all engineered to trigger FOMO. Adrenaline impairs your cognitive processing. When you feel the physical urge to buy immediately because a candle is spike, step away. The candle is not information; it is history."));

children.push(H2("9.2 Timeline Deception"));
children.push(P("Your social timeline is a collection of survivorship bias. Nobody screenshots their losses, their compromised seed phrases, or their rugged balances. If you benchmark your progress against the curated highlight reels of X, you will feel like a failure. Return to the raw data: the base rate says most traders lose. Settle into your own rules, not someone else's marketing."));

children.push(H2("9.3 Revenge Trading and the Lazy Fatigue"));
children.push(P("Revenge trading happens when a loss makes you angry. You try to 'get the money back' by taking larger, un-screened positions, which leads to total account destruction. The only defense is a mechanical daily loss limit."));
children.push(P("The feeling of being 'lazy' and stuck is a natural response to undirected activity. If you work without a system, checking charts constantly without a feedback loop, you exhaust your willpower. True progress is structured and boring: keeping a trade journal, reviewing your metrics, and maintaining self-discipline."));

children.push(PageBreakPara());

// ===================== CHAPTER 10 =====================
children.push(H1("Chapter 10: The Influencer Economy — Murad, Ansem, and the KOL Machine"));
children.push(Lead("The trenches are driven by narratives, and narratives are directed by key opinion leaders. Learn to separate the signal from the marketing."));

children.push(H2("10.1 Murad Mahmudov and the Memecoin Supercycle"));
children.push(P("Murad Mahmudov, a former institutional analyst, became the primary voice of the 'memecoin supercycle' thesis at Token2049 in 2024. He argued that memecoins are 'tokenized communities of faith' and would outperform utility tokens. He accumulated massive positions in SPX6900, GIGA, and POPCAT."));
children.push(P("His wallet holdings peaked in the tens of millions, but by mid-2026, on-chain analytics showed those positions had suffered an 83% peak-to-trough drawdown. Murad continued to hold, showing both the raw scale of unrealized paper gains and the high-risk reality of staying concentrated in illiquid memes through a market correction."));

children.push(H2("10.2 Ansem and the Power of Association"));
children.push(P("Ansem (@blknoiz06) built a massive following through verifiable early calls, including buying Solana at $1.50 and WIF at sub-million market caps. Because his wallets were public, the market treated his transactions as immediate price signals."));
children.push(P("In mid-2026, an anonymous developer launched a token called ANSEM without his involvement. The token pumped millions in volume purely based on the name. Ansem later engaged with the project, redirecting fees back to holders, but the event proved a critical lesson: in the trenches, association and name-recognition move markets faster than actual product utility."));

children.push(H2("10.3 The KOL Rules"));
children.push(BL("Do not buy a token because an influencer posted it. By the time it is on your feed, the early snipers have already set their sell orders."));
children.push(BL("Track wallets, not tweets. What people say on X is marketing; what they do on-chain is their true position."));
children.push(BL("Name-association is a common trap. Always verify contract addresses on official channels before assuming a token has any real connection to a person or project."));

children.push(PageBreakPara());

// ===================== CHAPTER 11 =====================
children.push(H1("Chapter 11: Case Studies — PEPE, MOG, SPX6900, WIF, BONK, Fartcoin"));
children.push(Lead("Six paths, six narratives, one underlying truth: in the trenches, attention is the only currency."));

children.push(H2("11.1 The Blue Chips"));
children.push(P("PEPE and BONK represent the institutionalization of memes. PEPE launched on Ethereum in 2023 with no utility, relying on pure meme resonance. BONK was distributed to the Solana community during the post-FTX dark ages, acts as a cultural rally point. Both achieved multi-billion valuations, showing that narrative conviction can create durable assets out of thin air."));

children.push(H2("11.2 The Conviction Plays"));
children.push(P("WIF (a dog wearing a hat) and MOG represent the triumph of simplicity. WIF was one of Ansem's signature calls, returning over 500x. MOG became a flagship supercycle asset, driven by Murad's community coordination. They prove that a community's willingness to hold through volatile drawdowns determines a token's peak."));

children.push(H2("11.3 Absurdity and Volatility"));
children.push(P("SPX6900 (a meme aiming to 'flip' the S&P 500) and Fartcoin (a leading token of the 2025-2026 AI-agent meme expansion) show the extremes of the trenches. SPX represents financial satire turned into capital flow; Fartcoin represents the market's complete disregard for seriousness. They are reminders that traditional valuations do not apply here."));

children.push(CalloutBox("Case Study Insights", [
  "None of these tokens succeeded because of technology. They succeeded because they captured and held retail attention.",
  "For every WIF or BONK, thousands of identical tokens went to zero. Never confuse historical survivors with predictable outcomes."
]));
children.push(SpacerAfterTable());
children.push(PageBreakPara());

// ===================== CHAPTER 12 =====================
children.push(H1("Chapter 12: Scams, Rugs, and Red Flags"));
children.push(Lead("The trenches are permissionless. That means they are also lawless. Your defense is entirely your own responsibility."));

children.push(H2("12.1 The Weapon of Choice"));
children.push(P("Honeypots (contracts that allow you to buy but block you from selling), fake airdrops, and malicious contract approvals are designed to drain wallets. The most dangerous scam is seed-phrase phishing: a fake support bot, website, or form asks for your recovery phrase. Keep your seed phrase written on paper, stored offline, and never type it into any digital device."));

children.push(H2("12.2 Red Flag Checklist"));
children.push(BL("Unlocked Liquidity: The deployer can pull the pool and rug the project instantly."));
children.push(BL("Unrenounced Mint: The developer can print infinite supply and dump it."));
children.push(BL("Insider Wallets: Top wallets holding large supply and funded by the same deployer address."));
children.push(BL("Artificial Hype: High pressure, countdown timers, and promises of guaranteed returns."));

children.push(PageBreakPara());

// ===================== EPILOGUE =====================
children.push(H1("Epilogue: The Signal Beyond the Screen"));
children.push(Lead("The charts will eventually close. The lesson of the trenches is not about the tokens; it is about who you become when the noise stops."));

children.push(P("The rain began to fall in sheets outside Tanvir's window, washing the dust off the concrete walls and cooling the heavy Mumbai air. He stood up, stretched his back, and closed the browser tabs one by one. The red and green candles disappeared, replaced by the clean black interface of a development terminal."));
children.push(P("He had lost money, slept through sunrises, and questioned his sanity in the dark. But he was no longer the hospitality procurement employee who lived a predictable, sterile life. The trenches had broken his old identity, but they had also given him something durable: the ability to stare into absolute chaos, analyze it without emotion, and build a system anyway."));
children.push(P("Trading memecoins is a temporary grind. The real game is building. Evolving from a speculator chasing someone else's narrative to a builder creating your own. As the terminal cursor blinked in the quiet room, Tanvir smiled. The signal was clear. It was time to build."));

children.push(...QUOTE("The noise is loud, temporary, and cheap. The signal is quiet, permanent, and hard-earned.", "— Tanvir Khan, ABSCONDED"));
