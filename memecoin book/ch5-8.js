const B = require("./build");
const { children, H1, H2, P, Lead, BL, NL, QUOTE, PageBreakPara, CalloutBox, SpacerAfterTable } = B;

// ===================== CHAPTER 5 =====================
children.push(H1("Chapter 5: Robinhood Chain and the New Retail Frontier"));
children.push(Lead("Corporate roadmaps are blueprints for worlds that users refuse to inhabit. Memes will always rewrite infrastructure."));

children.push(H2("5.1 The July Mutation"));
children.push(P("On July 1, 2026, Robinhood Chain launched its permissionless L2 network, built on Arbitrum Orbit. The official marketing was sterile: tokenized real-world assets, institutional custody, and 'agentic' AI finance. It was built for suits. But within days, the degens arrived."));
children.push(P("Trading volume exploded from a quiet $200,000 to over $500 million in nine days. The fuel wasn't tokenized treasury bills; it was CASHCAT — a community token based on Robinhood's mascot, explicitly disclaimed as 'fan fiction with a ticker.' When Robinhood's main retail app integrated direct trading for the token, the loop was closed. The institution had to adopt the meme to capture the volume."));

children.push(H2("5.2 The Lesson of CASHCAT"));
children.push(BL("Attention is a liquid asset. It will flow to the path of least resistance, ignoring corporate intentions."));
children.push(BL("New chains mean unseasoned launchpads (like NOXA.fun). These are playgrounds for exploiters who take advantage of fresh, un-audited code."));
children.push(BL("Affiliation is easily faked. Just because a token has the name of a brand or broker doesn't mean it's official. Verify the contract address from verified sources."));

children.push(PageBreakPara());

// ===================== CHAPTER 6 =====================
children.push(H1("Chapter 6: The Life Cycle of a Memecoin"));
children.push(Lead("Every token follows a lifecycle that mimics the stages of grief, or euphoria. Spotting where you are on the curve is the only analysis that matters."));

children.push(H2("Stage 1: The Bonding Curve / Launch"));
children.push(P("A developer deploys a contract. The liquidity is thin, the chart is chaotic, and transactions happen in milliseconds. Insiders and automated sniper bots have a massive structural edge here. 99% of tokens die in this stage, lasting less than thirty minutes."));

children.push(H2("Stage 2: Early Momentum and Graduation"));
children.push(P("The token gains social volume. It Graduates from the launchpad curve to a real DEX pool. DexScreener trending tags light up. Middle-tier accounts on X start posting the ticker. Narrative begins to take shape."));

children.push(H2("Stage 3: The Influencer / KOL Euphoria"));
children.push(P("A large influencer (KOL) posts the token. The chart verticalizes. This is the moment of maximum emotional gravity. You see the screenshots of 100x gains on your timeline. Your chest tightens. You want to buy. But statistically, this is the exact moment early buyers are preparing to exit."));

children.push(H2("Stage 4: Distribution"));
children.push(P("Insiders, developers, and early snipers slowly sell their supply into the buy pressure of late retail. The price chops sideways. Influencers claim it's 'healthy consolidation' or a 'cup-and-handle pattern.' It is actually a slow, coordinated exit."));

children.push(H2("Stage 5: Decline and Decay"));
children.push(P("Volume dries up. The social chatter fades. Liquidity is removed or slowly drained by sellers. The price drifts toward zero. In rare cases, a token finds a second wind (like PEPE or WIF), but for every survivor, ten thousand projects turn into permanent digital dust."));

children.push(CalloutBox("The Tragedy of Stage 3", [
  "When a token feels most inevitable, it is most dangerous.",
  "If you are buying because you are tired of watching other people make money, you are not trading. You are donating your capital to the early snipers."
]));
children.push(SpacerAfterTable());
children.push(PageBreakPara());

// ===================== CHAPTER 7 =====================
children.push(H1("Chapter 7: Reading a Chart and Screening a Contract"));
children.push(Lead("You don't need technical indicators. You need a defensive checklist that separates real projects from digital traps."));

children.push(H2("7.1 The Pre-Buy Safety Scan"));
children.push(P("Before you click swap, run the contract address through RugCheck and Bubblemaps. Answer these questions:"));
children.push(NL("Is the liquidity pool (LP) locked or burned? If not, the deployer can pull the cash out at 3 AM."));
children.push(NL("Has the mint authority been renounced? If the deployer can mint infinite new tokens, your shares will be diluted to zero."));
children.push(NL("What is the top-10 holder concentration? If a handful of wallets control 40% of the circulating supply, they can tank the price with a single click."));
children.push(NL("Is there wallet clustering? Bubblemaps will show if the top wallets are linked, indicating an insider ring that bought before the launch was public."));

children.push(H2("7.2 Chart Anatomy"));
children.push(BL("Candlesticks: Look at the 5-minute chart to identify short-term momentum, but zoom out to the 1-hour or 4-hour chart to see if the token is in a permanent downtrend."));
children.push(BL("Volume: A price increase with falling volume is an illusion. True moves require rising volume."));
children.push(BL("Support & Resistance: Look for price levels where buyers have repeatedly stepped in. If support breaks on thin volume, the exit door closes quickly."));

children.push(...QUOTE("The discipline that protects you is to identify the specific contract, verify it against the real creator's verified social account, and scan the supply structure before executing.", "— Crypto.news analysis of insider token launches, 2026"));

children.push(PageBreakPara());

// ===================== CHAPTER 8 =====================
children.push(H1("Chapter 8: Risk Management — The Only Edge That Reliably Works"));
children.push(Lead("Managing risk is boring. It has no excitement. But it is the only reason I survived long enough for learning to matter, while others became digital fossils."));

children.push(H2("8.1 Position Sizing: My 2% Rule"));
children.push(P("In my trading, I forced myself never to deploy more than 1% to 2% of my total trading capital into a single memecoin position. If my portfolio was $2,000, my max position size was $40. This rule became my absolute shield. If my $40 trade went to zero, it was a bad evening, not a ruined month. The math of recovery taught me a brutal lesson: losing 50% of your account means you need a 100% gain just to get back to even. I couldn't afford that math."));

children.push(H2("8.2 Pre-Committing to My Exits"));
children.push(BL("I learned to set a stop-loss before I bought. I decided at what price I was wrong, and let the software sell it. Negotiating with a falling chart is a loser's game."));
children.push(BL("I scaled out: I sold half my position when the token doubled (100% gain). This took my initial capital off the table and left me with a 'risk-free' moonbag."));
children.push(BL("I wrote it down. A plan that only existed in my head dissolved the second the green candles triggered my adrenaline."));

const sizingRows = [
  ["Account Size", "My Max Position (2%)", "My Daily Drawdown Limit"],
  ["$500", "$10", "$25"],
  ["$2,000", "$40", "$100"],
  ["$10,000", "$200", "$500"]
];
children.push(new B.Table({
  width: { size: 100, type: B.WidthType.PERCENTAGE },
  rows: sizingRows.map((row, i) => new B.TableRow({
    tableHeader: i === 0,
    children: row.map(cellText => new B.TableCell({
      width: { size: 33, type: B.WidthType.PERCENTAGE },
      shading: i === 0 ? { type: B.ShadingType.CLEAR, fill: "2B2B2B" } : undefined,
      margins: { top: 100, bottom: 100, left: 120, right: 120 },
      children: [new B.Paragraph({ children: [new B.TextRun({ text: cellText, bold: i === 0, color: i === 0 ? "FFFFFF" : "000000", size: 20 })] })],
    })),
  })),
}));
children.push(SpacerAfterTable());
children.push(PageBreakPara());
