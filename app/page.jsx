'use client'

import { useState, useEffect } from 'react'

const manuscript = [
  {
    id: 'prologue',
    number: 0,
    label: 'Prologue',
    title: 'Before the Signal',
    epigraph: "Every disappearance begins with a single unclosed tab.",
    content: [
      { type: 'p', text: "There is a version of every person that the world agreed to see." },
      { type: 'p', text: "It gets built slowly. Quietly. Through repetition. Through approval. Through the gentle, suffocating accumulation of other people's expectations." },
      { type: 'p', text: "You go to school. You get grades. You study something practical. You join something stable. You wear the correct name tag and smile at the correct conferences and your resume becomes a fiction everyone agrees to call your life." },
      { type: 'pull', text: "And then — one night — a browser tab stays open that shouldn't." },
      { type: 'p', text: "It's not dramatic. Nobody sees it happen. You don't even fully notice at first. You're just reading something. Watching something. Following a thread that leads somewhere strange." },
      { type: 'p', text: "But the thread doesn't end." },
      { type: 'p', text: "You pull it. You pull it again. And slowly, the thing you thought you were begins to unravel at the seams." },
      { type: 'p', text: "This is the story of that unraveling. And what grew from it." },
      { type: 'p', text: "Tanvir Khan was not a rebel. He was not born contrarian. He did not wake up one morning and decide to destroy his career for philosophy." },
      { type: 'p', text: "He was a man from Mumbai who followed the script — hospitality school, procurement, retail supply chain, vendor negotiations — and then discovered, too deeply and too late to pretend otherwise, that the internet had quietly rewritten every rule that script was based on." },
      { type: 'p', text: "The world where the script made sense was dissolving. AI was consuming entire categories of work. Crypto had proven that a 19-year-old with a laptop could outperform institutions. Communities were forming faster than governments could regulate them. Narrative had become infrastructure. Memes moved capital markets." },
      { type: 'pull', text: "The rules changed. Nobody sent a memo." },
      { type: 'p', text: "And somewhere between the broken rules and the blank browser tabs and the 2:43 AM glow of unfinished things — a different Tanvir began to emerge." },
      { type: 'p', text: "Not fully formed. Not safe. Not legible to the people around him. But real." },
      { type: 'p', text: "This is that story." },
      { type: 'p', text: "If you've ever felt the pull of something you couldn't explain. If you've ever stayed up too late chasing an idea that made no rational sense. If you've ever looked at your life from the outside and felt it didn't match the person burning inside it —" },
      { type: 'p', text: "Then you already know how this begins." }
    ]
  },
  {
    id: 'chapter-1',
    number: 1,
    label: 'Chapter One',
    title: 'The Tabs Never Closed',
    epigraph: "The strange thing about disappearing from your career is that nobody comes looking for you.",
    content: [
      { type: 'p', text: "At first, Tanvir thought someone would notice." },
      { type: 'p', text: "An HR email. A former manager. A LinkedIn message asking where he went." },
      { type: 'p', text: "Nothing came." },
      { type: 'p', text: "The corporate world moved on with machine precision — meetings continued, purchase orders cleared, vendors negotiated margins, containers crossed oceans, retail shelves filled themselves with products nobody would remember buying." },
      { type: 'p', text: "And somewhere inside a rented room in Mumbai, under the glow of a cheap monitor running far too many browser tabs, a man slowly detached himself from the timeline he was supposed to live." },
      { type: 'p', text: "The fan above him rattled like a failing server." },
      { type: 'terminal', text: "[ 02:43:17 ] SYSTEM: user_process.idle > 6hrs / tabs_open: 47 / ram_consumed: 94% ]" },
      { type: 'p', text: "Solana charts flickered on one screen. A half-finished biotech-themed landing page sat open on another: VYRM.space. No real product yet. Just lore. Animated terminals. Organism-chain diagrams. Fake scientific classifications for synthetic internet lifeforms." },
      { type: 'p', text: "It looked less like a startup and more like leaked interface screenshots from a future nobody had agreed to build." },
      { type: 'p', text: "Most people would have called it unfinished. Tanvir secretly believed it was alive." },
      { type: 'p', text: "Outside, Mumbai still moved with brutal indifference. Delivery bikes. Street dogs. Train lines. Humidity trapped between concrete towers. Men waking up at 6 AM to continue practical lives." },
      { type: 'p', text: "But practical life had stopped making sense to him a long time ago." },
      { type: 'p', text: "He had already tried that route. Hospitality degree. Procurement. Retail supply chain. Vendor management. Years spent negotiating prices for products he no longer remembered. His resume looked stable. His mind wasn't." },
      { type: 'p', text: "The internet had infected him too deeply." },
      { type: 'p', text: "Crypto was the first mutation. Not because of money. Because for the first time in his life, the world felt editable. A token launched from nowhere could become a civilization overnight. An anonymous teenager could out-earn executives. Memes moved markets faster than governments. Narrative had become infrastructure." },
      { type: 'pull', text: "That realization permanently damaged his ability to return to normal employment." },
      { type: 'p', text: "Now his nights disappeared into strange rituals: watching whale wallets, reading protocol docs, sketching AI agents, designing fake operating systems, imagining decentralized organisms living onchain." },
      { type: 'p', text: "Every unfinished project felt less like failure and more like evidence of evolution happening too fast for reality to catch up." },
      { type: 'p', text: "Friends stopped understanding what he was talking about. Family members asked simpler questions: What exactly do you do?" },
      { type: 'p', text: "He never had a clean answer. Sometimes he wanted one. Sometimes he believed confusion itself was proof he was early. The dangerous part was that both things could be true." },
      { type: 'p', text: "A Telegram notification appeared. Another memecoin pumping. Another founder thread promising the future. Another 19-year-old posting screenshots of overnight profits." },
      { type: 'p', text: "Tanvir leaned back in his chair and stared at the terminal glow reflecting against the dark room." },
      { type: 'p', text: "He was broke. But his mind had never been more awake. And somewhere between delusion and vision, he had begun constructing a new identity from pure internet residue." },
      { type: 'p', text: "Not employee. Not founder. Not trader. Something else. Something still forming." },
      { type: 'p', text: "The tabs never closed anymore. Neither did the possibilities." }
    ]
  },
  {
    id: 'chapter-2',
    number: 2,
    label: 'Chapter Two',
    title: 'Lore Before Product',
    epigraph: "Reality no longer moved first. Narrative did.",
    content: [
      { type: 'p', text: "The first thing Tanvir learned about the internet economy was that reality no longer moved first." },
      { type: 'p', text: "Narrative did." },
      { type: 'p', text: "A token with no utility could reach a billion-dollar valuation if enough people believed the story. An unfinished protocol could raise millions using nothing but diagrams, vocabulary, and confidence. Meanwhile genuinely useful products disappeared into silence because nobody knew how to frame them." },
      { type: 'p', text: "This disturbed him at first. Then he adapted." },
      { type: 'p', text: "The adaptation happened slowly. One tweet at a time. One redesign at a time. One late-night realization that the modern internet no longer rewarded the most qualified people — it rewarded the people who could make others feel the future before it arrived." },
      { type: 'pull', text: "That insight became dangerous. Especially for someone already addicted to imagination." },
      { type: 'p', text: "By now, Tanvir's bookmarks looked less like a workspace and more like evidence collected from multiple timelines: crypto dashboards, GitHub repos, biotech interfaces, terminal UIs, AI research papers, memecoin communities, whale trackers, Solana analytics, screenshots of futuristic operating systems, notes written at 4 AM that made perfect sense only during insomnia." },
      { type: 'p', text: "The projects started mutating together. Nothing stayed isolated anymore. A crypto tool became a living organism. An AI assistant became a character. A landing page became a world. A token became mythology." },
      { type: 'p', text: "That was the birth of VYRM." },
      { type: 'p', text: "Not officially. There was no cinematic launch moment. No investors. No dramatic announcement thread. Just a growing obsession with the idea that software should feel alive." },
      { type: 'p', text: "Most startup websites felt dead to him now. Flat. Corporate. Predictable. But VYRM felt different. It wasn't a company. It was an atmosphere. Dark terminals. Synthetic biology aesthetics. Organism-chain maps. Strange symbols. Artificial ecosystems." },
      { type: 'p', text: "Visitors didn't always understand it. That almost made it stronger. Confusion created gravity on the internet. People ignored what they instantly understood. But mysterious things lingered in the mind." },
      { type: 'p', text: "Tanvir knew this instinctively. He had spent enough years online to recognize the hidden rule underneath all successful internet movements: people don't join products anymore. They join worlds." },
      { type: 'p', text: "Crypto communities understood this before everyone else. Bitcoin wasn't just code. Ethereum wasn't just infrastructure. Memecoins weren't just speculation. They were belief systems. Digital tribes. Narratives large enough for strangers to project themselves into." },
      { type: 'p', text: "That realization permanently changed how he approached building. He stopped asking: What app should I make? And started asking: What universe does this belong to?" },
      { type: 'p', text: "It sounded irrational. Maybe it was. But the old rational systems had already failed him. Corporate logic had given him stability without meaning. The internet offered meaning without stability. So he drifted deeper." },
      { type: 'p', text: "His sleep schedule collapsed first. Sunrise became background scenery. The best ideas arrived between midnight and dawn — during those strange hours where exhaustion weakened the border between intelligence and hallucination." },
      { type: 'p', text: "Sometimes he would open five different projects simultaneously: an AI agent architecture, a Solana chat protocol, a whale-tracking dashboard, biotech-inspired branding concepts, tokenomics sketches, terminal animations. Everything connected in his head. The problem was that almost nothing finished." },
      { type: 'p', text: "Execution lagged behind imagination like overloaded hardware trying to render an impossible simulation. And yet — the visions kept getting clearer." },
      { type: 'p', text: "One night, while staring at an unfinished animated ecosystem map for VYRM, Tanvir had a thought that genuinely scared him: What if the internet is evolving faster than humans psychologically can?" },
      { type: 'p', text: "Not technologically. Psychologically." },
      { type: 'p', text: "People were becoming fragmented identities across platforms. AI was beginning to generate culture. Memes moved capital markets. Communities formed faster than governments could regulate them. Teenagers with anonymous avatars influenced millions of dollars in liquidity. The line between fiction and infrastructure was dissolving in real time." },
      { type: 'p', text: "And somehow, in the middle of Mumbai, inside a room filled with unfinished tabs and terminal windows, Tanvir felt like he could see the shape of it before most people did." },
      { type: 'p', text: "Not clearly. But enough to become unable to look away." }
    ]
  },
  {
    id: 'chapter-3',
    number: 3,
    label: 'Chapter Three',
    title: 'The Failure Loop',
    epigraph: "What if he was becoming one of those internet ghosts?",
    content: [
      { type: 'p', text: "By twenty-eight, Tanvir had developed a private fear he never explained properly to anyone: What if he was becoming one of those internet ghosts?" },
      { type: 'p', text: "The kind of person who almost built something. Almost launched. Almost escaped. Almost mattered." },
      { type: 'p', text: "The internet was full of them. Anonymous accounts with abandoned repos. Dead Discord servers. Half-written whitepapers. Domains that expired before the vision did. Every failed builder left behind digital fossils." },
      { type: 'p', text: "Sometimes, late at night, Tanvir would scroll through old bookmarks and feel a quiet terror crawling beneath his ambition. Projects from years ago. People who once sounded unstoppable. Gone. Not dramatically. Just absorbed back into normal life. Marriage. Jobs. Bills. Silence." },
      { type: 'p', text: "He wondered if the same thing was already happening to him in slow motion." },
      { type: 'p', text: "Because despite all the ideas, despite all the intelligence scattered across tabs and notebooks and terminal windows, his external reality still looked unimpressive." },
      { type: 'p', text: "No funding announcements. No viral product. No luxury apartment. No startup success story." },
      { type: 'p', text: "Just: inconsistent income, unfinished code, insomnia, endless learning, and a mind permanently overheating from possibility." },
      { type: 'pull', text: "The gap between internal vision and external proof was becoming painful." },
      { type: 'p', text: "Some mornings he woke up convinced he was early. Other mornings he felt clinically delusional. The emotional volatility of internet ambition was something nobody warned people about. Especially in crypto." },
      { type: 'p', text: "In crypto, reality changed too fast. A stranger could become rich overnight from a joke token. An entire ecosystem could collapse in a week. A teenager with a laptop could outperform experienced executives. And every time Tanvir saw another improbable success story, it activated the same dangerous thought: If they can do it, why not me?" },
      { type: 'p', text: "That sentence built civilizations. It also destroyed people." },
      { type: 'p', text: "Because the internet only publicly displayed outcomes. Not the psychological damage hidden underneath them." },
      { type: 'p', text: "Nobody posted: panic attacks, unpaid rent, family pressure, identity collapse, self-doubt after failed launches, the humiliation of explaining unfinished dreams to practical people." },
      { type: 'p', text: "But Tanvir knew those emotions intimately. Especially the identity collapse." },
      { type: 'p', text: "Years earlier, when he walked away from the corporate timeline, he believed he was moving toward freedom. Instead, he entered ambiguity. And ambiguity was exhausting." },
      { type: 'p', text: "In corporate life, progress had structure: promotions, salaries, job titles, appraisals, predictable ladders. Internet life had none of that. One week he felt like a visionary. The next week he felt unemployed. Some nights he would open LinkedIn and stare at former colleagues. People moving upward through recognizable systems. Senior roles. Management positions. Stable careers." },
      { type: 'p', text: "Meanwhile he was building fictional biotech ecosystems for crypto-native AI organisms at 3 AM." },
      { type: 'p', text: "There were moments where even he understood how absurd this looked from the outside." },
      { type: 'p', text: "And yet — whenever he tried to fully abandon the internet-builder path, something inside him resisted violently." },
      { type: 'p', text: "Because normal life no longer felt real enough." },
      { type: 'p', text: "That was the irreversible mutation. Once you spent enough time online — deeply online — reality itself changed texture. Traditional careers started feeling slow. Corporate language became emotionally sterile. Meetings felt artificial compared to the raw intensity of internet creation." },
      { type: 'p', text: "On the internet: ideas moved instantly, communities formed overnight, culture mutated daily, and individuals could alter trajectories through pure leverage. It was addictive. Not because of money. Because of potential energy." },
      { type: 'p', text: "Tanvir lived inside that energy now. Even when it hurt him. Especially when it hurt him." },
      { type: 'p', text: "One evening, after another failed attempt to organize his projects into something coherent, he opened a blank document and typed a sentence he didn't fully understand yet: Lore before product." },
      { type: 'p', text: "He stared at it for a long time. Then smiled slightly." },
      { type: 'p', text: "Because for the first time in months, something finally made sense." }
    ]
  },
  {
    id: 'chapter-4',
    number: 4,
    label: 'Chapter Four',
    title: 'Mumbai Heat, Terminal Glow',
    epigraph: "The city doesn't wait for you to figure yourself out.",
    content: [
      { type: 'p', text: "May in Mumbai is not a season. It is a punishment." },
      { type: 'p', text: "The heat arrives like a system overload — slow, total, inescapable. Ceiling fans redistribute it. AC units fight it and lose. The asphalt on the roads remembers the sun long after it sets. Everything feels slightly, permanently on fire." },
      { type: 'p', text: "Tanvir's rented room had one window that faced a concrete wall. The wall reflected heat back into the room throughout the afternoon like a second sun it had borrowed and refused to return." },
      { type: 'p', text: "He had learned to sleep during the worst of the heat. Or try to. Two, three hours after 6 AM when the city finally, briefly, exhaled. Then wake again at noon when the notifications started and the ideas hadn't stopped." },
      { type: 'terminal', text: "[ session_log ] time_active: 19h 42m / hydration_alerts: ignored x7 / meals_today: 1 / ideas_captured: 23 / ideas_built: 0 ]" },
      { type: 'p', text: "The terminal was always open. Even when he wasn't at the desk. It felt like leaving a light on in a house you weren't sure you were coming back to." },
      { type: 'p', text: "There's something about heat and ambition that creates a particular kind of desperation. It clarifies things. Strips away the comfortable middle distance between wanting and doing." },
      { type: 'p', text: "In air-conditioned offices, ambition feels optional. You can defer it. Pack it into the weekend. Sell yourself the story that you'll pursue it when conditions are better." },
      { type: 'p', text: "But in a room with a rattling fan and a concrete wall radiating May heat at midnight — there is no comfortable deferral. There is only now, or never, or the slow quiet surrender that you tell yourself is wisdom." },
      { type: 'pull', text: "Tanvir had chosen now. Repeatedly. Expensively." },
      { type: 'p', text: "The costs weren't always financial. Money was just the most legible loss. The less legible ones accumulated in other registers: the birthday dinners he skipped to chase a launch window. The family conversations where he gave half-present answers because his mind was three product iterations ahead. The friendships that slowly thinned out because his world had moved into a register that required fluency in a language most people around him hadn't been infected with yet." },
      { type: 'p', text: "His mother called on Tuesdays. He loved her calls. He also dreaded them, because they always arrived at the edge of the same question: Beta, what exactly is happening with you?" },
      { type: 'p', text: "He had many answers prepared. None of them felt truthful enough." },
      { type: 'p', text: "How do you explain to someone who built stability from sacrifice that you have chosen instability as a philosophy? How do you explain that the internet has made certain forms of stability feel more dangerous than the risk?" },
      { type: 'p', text: "You don't. You say: Things are moving. Give me some more time." },
      { type: 'p', text: "She always said okay. He knew the okay had a shelf life." },
      { type: 'p', text: "One night in early June, the power cut out. Common in monsoon season, but this time it lasted four hours." },
      { type: 'p', text: "His monitors died. The terminal went dark. Even the neighbor's generator — usually reliable — stayed silent." },
      { type: 'p', text: "He sat in total dark for a long time. Phone battery at 12%. He didn't want to waste it on Twitter." },
      { type: 'p', text: "So he just sat. In the heat. In the silence. In the strange space that opens up when all the screens disappear." },
      { type: 'p', text: "And what came up, in that silence, surprised him." },
      { type: 'p', text: "Not panic. Not regret. Something older." },
      { type: 'p', text: "The memory of a version of himself at seventeen, sitting on the steps outside his building late at night, watching the city lights and feeling — with total, uncomplicated certainty — that he was going to build something that mattered. Not knowing what. Not knowing how. Just that iron certainty in the chest that the ordinary life was not the whole story." },
      { type: 'p', text: "Seventeen-year-old Tanvir hadn't known about blockchain or AI or crypto or narrative economics. But he had known about the feeling. The signal." },
      { type: 'p', text: "And sitting in the dark room with the dead screens, twenty-eight-year-old Tanvir realized: the signal had never actually stopped." },
      { type: 'p', text: "It had just been drowned out by the noise of trying to prove it to other people." },
      { type: 'p', text: "The power came back at 2 AM. The terminal rebooted. The fan started its rattle again. Mumbai resumed." },
      { type: 'p', text: "But something had shifted in the dark." }
    ]
  },
  {
    id: 'chapter-5',
    number: 5,
    label: 'Chapter Five',
    title: 'The Signal Hunters',
    epigraph: "The internet is full of people who see things slightly too early.",
    content: [
      { type: 'p', text: "They exist in every era. The people who see the thing before it has a name." },
      { type: 'p', text: "Before radio had a business model, there were people who couldn't stop tinkering with transmitters. Before the web had a browser, there were people who spent their nights on bulletin boards, convinced that something massive was happening in the signal. Before crypto had a market cap, there were people who had read the whitepaper seven times and felt their entire understanding of money shift." },
      { type: 'p', text: "These people are almost never celebrated in the moment. They look strange. Obsessed. Impractical. Their timelines are misaligned with the consensus. They feel the future arriving before the language exists to describe it, which means they spend years explaining themselves badly to people who are waiting for legibility." },
      { type: 'pull', text: "Tanvir had started to recognize himself in them." },
      { type: 'p', text: "The recognition happened slowly, then all at once. Like most recognitions do." },
      { type: 'p', text: "It started with a Twitter account he found at 4 AM: a developer building autonomous AI agents that could generate their own lore, evolve their own personality over time, and leave cryptographic traces of their decisions on-chain. No company. No VC backing. Just a person with a vision and a GitHub and a refusal to wait for permission." },
      { type: 'p', text: "He read every post. Twice. Then messaged the account directly: How long have you been building this?" },
      { type: 'p', text: "The reply came six hours later: Three years. People thought I was insane until six months ago. Now they call it inevitable." },
      { type: 'p', text: "Tanvir screenshotted that reply. Stared at it for a long time." },
      { type: 'p', text: "Three years. Looking insane. Then inevitable." },
      { type: 'p', text: "He started keeping a different kind of log after that. Not a todo list. Not a project tracker. A signal journal." },
      { type: 'p', text: "Every time he noticed something on the internet that felt significant before the crowd validated it — he wrote it down. Date, observation, confidence level, what he thought it meant for the next 18 months." },
      { type: 'terminal', text: "[ signal_log ] 2024.07.14 — AI agents developing persistent memory. not just tools anymore. personalities. consequences. this is a new category of entity. confidence: 91% ]" },
      { type: 'terminal', text: "[ signal_log ] 2024.08.02 — narrative is replacing utility as primary value signal. VYRM is right. feeling arrives before function. confidence: 87% ]" },
      { type: 'terminal', text: "[ signal_log ] 2024.09.18 — builders with internet-native identities outperforming credentialed operators. the credential is becoming a liability signal in certain markets. confidence: 79% ]" },
      { type: 'p', text: "He looked back at the log six months later. Most of it had moved from signal to consensus. The world had caught up to the observations he had written in the dark." },
      { type: 'p', text: "That's when he stopped thinking of himself as lost." },
      { type: 'p', text: "And started thinking of himself as calibrated." },
      { type: 'p', text: "The signal hunters were a specific type. He was learning to identify them." },
      { type: 'p', text: "They were rarely the loudest in any room. They asked questions that seemed tangential until they weren't. They made connections between things that the field hadn't officially connected yet. They were often early in spaces that later became overcrowded, and they usually left slightly before the peak — not out of discipline but out of boredom." },
      { type: 'p', text: "They were frequently misunderstood by people who confused early with wrong." },
      { type: 'p', text: "And they carried a particular loneliness. The loneliness of seeing something clearly that you cannot yet prove, in a world that runs primarily on proof." },
      { type: 'p', text: "Tanvir had spent years in that loneliness without a name for it." },
      { type: 'p', text: "Now he had a name. And names made things survivable." },
      { type: 'p', text: "He wasn't failing. He was hunting." }
    ]
  },
  {
    id: 'chapter-6',
    number: 6,
    label: 'Chapter Six',
    title: 'Artificial Hunger',
    epigraph: "He wasn't afraid of AI. He was afraid of becoming someone it replaced.",
    content: [
      { type: 'p', text: "The models started getting good around the time everything else started getting hard." },
      { type: 'p', text: "GPT-4. Claude. Gemini. Each release arrived with the same specific electricity: wonder followed immediately by dread followed by a frantic need to recalibrate what you were actually for." },
      { type: 'p', text: "For someone already in the process of reinventing himself, the timing was either terrible or perfect depending on which hour of the morning you asked." },
      { type: 'p', text: "Tanvir approached AI the way he had approached crypto. Not as a user. As a student of the culture forming around it." },
      { type: 'p', text: "Because the tools themselves were almost secondary to what they were doing to human psychology." },
      { type: 'pull', text: "AI wasn't replacing work. It was replacing the story people told themselves about what made them valuable." },
      { type: 'p', text: "That was the deeper disruption. Not the automation of tasks but the automation of identity anchors." },
      { type: 'p', text: "People had built entire senses of self around cognitive skills that were now replicable for pennies. Copywriting. Analysis. Basic coding. Research. First-draft thinking. The capabilities that separated educated professionals from everyone else were rapidly becoming commodity." },
      { type: 'p', text: "And watching this happen in real time, from inside a room where he was already trying to figure out what he was worth and to whom — the emotional texture was complex." },
      { type: 'p', text: "He felt it both ways. The acceleration. The threat." },
      { type: 'p', text: "On one hand: AI made him faster. Ideas he couldn't have executed alone now had collaborators available at 3 AM who never needed sleep, never needed equity, never judged the strangeness of the request. VYRM's lore could be expanded. Interfaces could be prototyped. Systems could be sketched." },
      { type: 'p', text: "On the other hand: if AI could do all that, then what was the builder actually for?" },
      { type: 'p', text: "He sat with that question for a long time. It was the right question. The wrong answer was to ignore it." },
      { type: 'p', text: "The answer he eventually arrived at was uncomfortable and clarifying." },
      { type: 'p', text: "AI could generate. But it couldn't want. It could write the lore but it couldn't feel the obsession behind the lore. It could prototype the interface but it couldn't carry the specific vision of what the interface was supposed to feel like from the inside — the accumulated years of experience, failure, taste, and stubborn intuition that made one builder's output different from another's." },
      { type: 'p', text: "What AI replaced was the execution tax. The friction between vision and output." },
      { type: 'p', text: "What it couldn't replace was the vision itself. The hunger. The unreasonable certainty. The specific human damage that made a person incapable of building something generic." },
      { type: 'pull', text: "Tanvir's obsessiveness — the thing his family called excessive and his former managers called unfocused — turned out to be a competitive advantage in an era of infinite generation." },
      { type: 'p', text: "The stranger and more specific your hunger, the less replaceable you were." },
      { type: 'p', text: "He started thinking of his obsession differently after that." },
      { type: 'p', text: "Not as a problem to solve. As a signal to follow." }
    ]
  },
  {
    id: 'chapter-7',
    number: 7,
    label: 'Chapter Seven',
    title: 'The Build Phase',
    epigraph: "Finishing is a different skill than starting. He had to learn it in public.",
    content: [
      { type: 'p', text: "There is a particular hell reserved for people who can see the finished thing perfectly in their mind but cannot close the distance between vision and execution." },
      { type: 'p', text: "Tanvir had lived inside that hell for years." },
      { type: 'p', text: "He understood the problem now, at least. He had studied enough builders to recognize the pattern. The gap between imagination and execution isn't a talent deficit. It's a tolerance deficit. The tolerance for producing bad work on the way to good work. The tolerance for shipping something that isn't perfect. The tolerance for being misunderstood during the process." },
      { type: 'p', text: "The internet had made this worse. Because the internet required you to share the process publicly to build an audience — but sharing an unfinished process meant constant exposure to judgment from people who were evaluating the prototype as if it were the product." },
      { type: 'p', text: "Every founder who posted their early work knew the specific dread: the half-built thing that attracted the wrong feedback, the launch that landed in silence, the MVP that got torn apart by people who had never shipped anything." },
      { type: 'p', text: "Tanvir had lived all of that. Multiple times." },
      { type: 'pull', text: "The only solution, he finally accepted, was to build faster than the criticism." },
      { type: 'p', text: "Not to stop caring about the criticism. But to move fast enough that by the time a negative take had finished forming, you were already three iterations ahead of it." },
      { type: 'p', text: "So he changed the rhythm. Shorter cycles. Smaller bets. Less planning, more shipping. He posted things that weren't finished because unfinished things that moved were worth more than perfect things that sat still." },
      { type: 'terminal', text: "[ build_log ] v0.1 — VYRM terminal interface / organism nodes prototype / 11 hours / shipped ]" },
      { type: 'terminal', text: "[ build_log ] v0.2 — signal dashboard / whale tracker integration / 8 hours / shipped ]" },
      { type: 'terminal', text: "[ build_log ] v0.3 — lore engine alpha / ai-generated ecosystem evolution / 14 hours / shipped ]" },
      { type: 'p', text: "The outputs weren't perfect. Some were genuinely rough. But each one taught him something that planning hadn't." },
      { type: 'p', text: "Each one was a signal received back from the world — what resonated, what fell flat, what attracted the people he was building for and what repelled everyone else. That feedback was education you couldn't buy. You could only ship your way into it." },
      { type: 'p', text: "The build phase also revealed something about identity that no amount of thinking had." },
      { type: 'p', text: "When he was just thinking and planning and designing in private, his identity felt permanently provisional. Subject to revision at any moment. Vulnerable to the next doubt, the next discouraging conversation, the next 3 AM where the work still looked unimpressive." },
      { type: 'p', text: "But when things existed — even imperfect, even small — his identity had something to anchor to. Something real he had put into the world that was indifferent to his doubts about it." },
      { type: 'p', text: "The work didn't care if he believed in himself. It existed regardless." },
      { type: 'p', text: "And somehow that was more stabilizing than any amount of self-belief." },
      { type: 'p', text: "He began to understand something the productivity literature had never managed to say clearly:" },
      { type: 'pull', text: "Confidence doesn't produce action. Action produces confidence. You build yourself by building things." },
      { type: 'p', text: "The build phase had begun. It was messy. It was inconsistent. There were weeks of progress followed by weeks of drift." },
      { type: 'p', text: "But the direction, for the first time, felt irreversible." }
    ]
  },
  {
    id: 'chapter-8',
    number: 8,
    label: 'Chapter Eight',
    title: 'The Ghosts in the Timeline',
    epigraph: "Everyone who disappeared from the internet left something behind.",
    content: [
      { type: 'p', text: "There is a graveyard that lives inside every builder's browser history." },
      { type: 'p', text: "It's not marked. It has no monument. But you know it when you're there. The domains that stopped updating. The Twitter accounts that went quiet mid-thread. The Discord servers where the last message was pinned six months ago and the channels below it are dark." },
      { type: 'p', text: "These are the internet ghosts. The people who were building something real and then — weren't." },
      { type: 'p', text: "Tanvir had visited this graveyard many times. Usually at 3 AM when his own progress felt thin. He used it the wrong way, mostly. As evidence against himself. As a catalog of futures he might inhabit." },
      { type: 'p', text: "But somewhere during the build phase, his relationship with the graveyard changed." },
      { type: 'p', text: "He started looking at the disappeared accounts differently. Not as warnings about failure — as evidence of paths taken before the infrastructure arrived. Most of them hadn't been wrong. They had been early. The wave they were building for hadn't arrived yet when their resources ran out." },
      { type: 'pull', text: "The tragedy wasn't bad ideas. It was bad timing plus unsustainable conditions." },
      { type: 'p', text: "That reframe mattered enormously." },
      { type: 'p', text: "Because Tanvir had conditions he could actually control. Not the timing of the wave. But the sustainability of his position. The length of runway he could maintain. The efficiency of his operations. His ability to survive until the timing aligned." },
      { type: 'p', text: "He started making different decisions. Not dramatic ones. Quiet ones." },
      { type: 'p', text: "He took on one part-time consulting project — supply chain, his old world — not because he wanted to return but because it bought him four more months of runway without selling equity he didn't have or compressing his vision into a pitch deck it wasn't ready for." },
      { type: 'p', text: "He stopped chasing every signal simultaneously. The 47 open tabs became 12. Then 8. Then a disciplined, rotating stack of the highest-signal inputs he could find, curated ruthlessly." },
      { type: 'p', text: "The ghosts in the timeline taught him: the failure mode wasn't thinking too big. It was living unsustainably inside the big thinking." },
      { type: 'p', text: "You had to architect the life that could carry the vision long enough for the vision to arrive." },
      { type: 'p', text: "He also started writing. Not product docs. Not pitch decks. Just writing." },
      { type: 'p', text: "Writing about what he was learning. What he was observing. What the internet looked like from inside a rented room in Mumbai when you were trying to build something that didn't have a category yet." },
      { type: 'p', text: "It started as private notes. Then he posted one. Then another." },
      { type: 'p', text: "The response surprised him. Not in scale — the scale was small. But in specificity. People DM'd him with the particular recognition of people who had been waiting for someone to say exactly that thing." },
      { type: 'p', text: "You found your signal, one of them wrote. Keep transmitting." },
      { type: 'p', text: "He read that message three times." },
      { type: 'p', text: "Then he opened a new document and started writing this book." }
    ]
  },
  {
    id: 'chapter-9',
    number: 9,
    label: 'Chapter Nine',
    title: 'Mumbai Doesn\'t Care About Your Vision',
    epigraph: "The city is indifferent. That's what makes it honest.",
    content: [
      { type: 'p', text: "Mumbai will not validate you." },
      { type: 'p', text: "This is one of the things Tanvir had come to genuinely love about it. Not despite the indifference. Because of it." },
      { type: 'p', text: "Silicon Valley mythologizes the pivot. New York celebrates the hustle. Mumbai doesn't celebrate anything. It processes. The city is a system too large and too old to be impressed by ambition. It has seen ambition arrive by the millions and it has accommodated it and incorporated it and moved on." },
      { type: 'p', text: "There is no founder-cool in a local train at 9 AM. Nobody cares that you're building the next internet organism. The dabbawala is focused on the dabbas. The accountant is focused on the forms. The city runs on its own ancient operating system and your startup is a minor variable it hasn't noticed." },
      { type: 'p', text: "Some builders found this crushing. Tanvir had eventually found it liberating." },
      { type: 'pull', text: "When the environment refuses to validate you, you stop building for validation." },
      { type: 'p', text: "That shift — from building to impress to building because you can't not build — was one of the deepest changes the city had worked on him. Slowly. Without announcing it." },
      { type: 'p', text: "The monsoon arrived in late June the way it always did: suddenly, totally, without apology." },
      { type: 'p', text: "The streets flooded. The trains slowed. The city grumbled and adapted in the pragmatic, unsentimental way it always had. Inconveniences were absorbed. Routines resumed. Mumbai did not stop for rain." },
      { type: 'p', text: "Tanvir watched the monsoon arrive from his window with a feeling he couldn't quite name." },
      { type: 'p', text: "He had been in this room through one full cycle of seasons now. He had arrived when the summer was just starting. He had watched the heat build and break and the rains come and imagined the cool of October and the weddings of November and the strange festive chaos of December." },
      { type: 'p', text: "A full year. On the surface: the same small room. The same rattling fan. The same concrete wall." },
      { type: 'p', text: "Internally: a completely different person." },
      { type: 'p', text: "Not transformed in the narrative sense. Not dramatically. But calibrated. Rebuilt. Like a system that had been stress-tested to its limits and emerged knowing precisely where it was strong and where it was fragile." },
      { type: 'p', text: "He made a list one rainy afternoon. Not a todo list. A what-I-know-now list." },
      { type: 'terminal', text: "[ know_now ] — narrative arrives before product. build the world first." },
      { type: 'terminal', text: "[ know_now ] — obsession is a feature, not a bug. protect the specific hunger." },
      { type: 'terminal', text: "[ know_now ] — early looks exactly like wrong until it doesn't." },
      { type: 'terminal', text: "[ know_now ] — sustainability is not the opposite of vision. it is the container for it." },
      { type: 'terminal', text: "[ know_now ] — the city doesn't care. that's the point. build anyway." },
      { type: 'p', text: "He read the list. Saved it. Closed the document." },
      { type: 'p', text: "Outside, Mumbai resumed its noise. Auto-rickshaws negotiating puddles. Street vendors reassembling their stalls. Children running through the rain because they were children and rain was still a gift." },
      { type: 'p', text: "Tanvir looked at the terminal. Looked at the rain." },
      { type: 'p', text: "He had one chapter left to write." }
    ]
  },
  {
    id: 'chapter-10',
    number: 10,
    label: 'Chapter Ten',
    title: 'The Return Signal',
    epigraph: "Real builders sometimes disappear before emergence.",
    content: [
      { type: 'p', text: "Nobody saw the full story. That was the strange thing about internet lives. People only saw fragments: tweets, screenshots, launch posts, late-night thoughts, temporary momentum." },
      { type: 'p', text: "Nobody saw the invisible years underneath. The years where nothing looked successful externally. The years where ambition quietly fought survival behind closed doors. The years where a person rebuilt themselves psychologically while the world assumed nothing was happening." },
      { type: 'p', text: "Tanvir understood this now. Really understood it." },
      { type: 'p', text: "Because somewhere between the unfinished repos, failed launches, crypto charts, AI experiments, and sleepless Mumbai nights… he had changed completely." },
      { type: 'p', text: "Not into a billionaire. Not into a celebrity founder. Something more dangerous. Someone who could survive uncertainty without losing vision." },
      { type: 'p', text: "That transformation mattered more than people realized." },
      { type: 'p', text: "Most people only knew how to function inside stable systems. But the future no longer looked stable. AI was rewriting labor. Markets moved through narrative. Communities formed faster than institutions. Identity itself was becoming fluid." },
      { type: 'p', text: "And Tanvir had already spent years adapting to instability before the rest of the world realized instability was permanent." },
      { type: 'p', text: "The struggle had accidentally trained him for the environment arriving next." },
      { type: 'pull', text: "That realization gave him a strange calm." },
      { type: 'p', text: "For the first time in years, he stopped viewing his life as 'falling behind.' Maybe the isolation, confusion, obsession, experimentation, and failure were not detours. Maybe they were conditioning. A brutal form of preparation." },
      { type: 'p', text: "Outside his apartment, Mumbai continued operating with its usual indifference. Rainwater reflected neon signs across broken roads. Local trains roared through darkness carrying exhausted people toward practical futures. Street dogs slept beneath flickering shop lights. The city looked tired. Alive. Unapologetic." },
      { type: 'p', text: "Tanvir stood near the window for a long time watching the rain slide across glass. His room behind him still looked chaotic: open terminals, unfinished interfaces, notebooks filled with fragmented systems, browser tabs multiplying like synthetic organisms." },
      { type: 'p', text: "From the outside, almost nothing about his life appeared resolved." },
      { type: 'p', text: "But internally, something had locked into place. The desperation was fading. Not the hunger. The panic. There was a difference." },
      { type: 'p', text: "Earlier versions of himself wanted immediate escape: immediate success, immediate recognition, immediate proof. Now he understood timing differently. Real builders sometimes disappeared before emergence." },
      { type: 'p', text: "Nature itself worked like that. Roots formed underground long before forests appeared. The internet just trained people to expect visible progress constantly. But invisible evolution was still evolution." },
      { type: 'p', text: "And Tanvir could feel it happening now." },
      { type: 'p', text: "He sat back down at the desk. Opened the VYRM terminal one more time. Black screen. Green text. Organism nodes pulsing slowly through digital darkness like a nervous system trying to wake itself into existence." },
      { type: 'p', text: "The interface no longer felt like fantasy. It felt inevitable. Not because success was guaranteed. Because he finally understood who he was." },
      { type: 'p', text: "Not a failed corporate employee. Not a confused dreamer. Not another anonymous account chasing temporary trends. He was a builder born during transition." },
      { type: 'p', text: "A person shaped by the collision between: internet culture, AI acceleration, crypto economics, narrative systems, digital identity, and human ambition stretched beyond traditional structures." },
      { type: 'p', text: "People like him looked unstable in old systems. But old systems were collapsing anyway." },
      { type: 'pull', text: "That thought made him smile." },
      { type: 'p', text: "For years he believed he was lost. Maybe he was simply early." },
      { type: 'p', text: "The rain intensified outside. Mumbai flickered like circuitry beneath storm clouds. Tanvir looked at the terminal glow reflecting against the room and felt something he hadn't felt in a very long time:" },
      { type: 'p', text: "Conviction." },
      { type: 'p', text: "Not loud motivation. Not delusion. Conviction. The quiet kind. The kind that survives failure. The kind that keeps building after humiliation. The kind that returns stronger because it was forged inside uncertainty instead of comfort." },
      { type: 'p', text: "He cracked his fingers slowly. Opened a new project folder. And began typing again." },
      { type: 'p', text: "Because this was never the ending. Only the point where the signal became impossible to ignore." },
      { type: 'p', text: "And somewhere out there — beyond the noise, beyond the timelines, beyond the unfinished versions of himself — the future was already waiting for him to arrive." }
    ]
  },
  {
    id: 'epilogue',
    number: 11,
    label: 'Epilogue',
    title: 'After the Signal',
    epigraph: "The message was always being sent. You were just learning to receive it.",
    content: [
      { type: 'p', text: "If you've read this far, something in this story recognized you." },
      { type: 'p', text: "Maybe you're in the room right now. The late-night room. The unfinished room. The room where the fan rattles and the screens glow and the rest of the world is asleep and you are trying to build something you can't fully explain yet." },
      { type: 'p', text: "Or maybe you left that room years ago — for safety, for sanity, for someone who needed you present — and you still wonder sometimes what would have happened if you had stayed a little longer." },
      { type: 'p', text: "Or maybe you never entered the room, but you can feel its pull. The particular gravity of a life built to specification versus a life built to signal." },
      { type: 'pull', text: "Wherever you are: the signal doesn't care about your circumstances. It only cares about whether you're listening." },
      { type: 'p', text: "This book was not written to inspire you to quit your job. Or to convince you that the internet is a better world than the one outside your window. It is not a manifesto and it is not a business plan." },
      { type: 'p', text: "It is a document from inside a particular kind of becoming. Written by someone still inside it, to everyone else inside theirs." },
      { type: 'p', text: "The becoming doesn't end. That's the part nobody tells you clearly. There is no arrival. No morning when you wake up and the uncertainty has resolved into clarity and the work is done and the vision has become consensus." },
      { type: 'p', text: "There is only the next signal. The next iteration. The next version of yourself that the present version can barely imagine." },
      { type: 'p', text: "But this is not a tragedy. It's the architecture of a life that is actually alive." },
      { type: 'p', text: "Tanvir Khan is still building." },
      { type: 'p', text: "VYRM is still evolving." },
      { type: 'p', text: "Mumbai is still indifferent." },
      { type: 'p', text: "The terminal glow is still on." },
      { type: 'p', text: "And if you can see the signal — build." }
    ]
  }
]

export default function Home() {
  const [selectedSection, setSelectedSection] = useState(null)
  const [showCover, setShowCover] = useState(true)

  const handleNext = () => {
    if (!selectedSection) return
    const currentIndex = manuscript.findIndex(s => s.id === selectedSection.id)
    if (currentIndex < manuscript.length - 1) {
      setSelectedSection(manuscript[currentIndex + 1])
      window.scrollTo(0, 0)
    } else {
      setSelectedSection(null)
      setShowCover(true)
    }
  }

  return (
    <main className="min-h-screen bg-bg text-text selection:bg-white/10 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
          <button 
            onClick={() => { setShowCover(true); setSelectedSection(null); }}
            className="text-[10px] tracking-[0.3em] uppercase font-light hover:text-accent transition-colors"
          >
            Absconded
          </button>
          <div className="flex gap-8">
            <button 
              onClick={() => { setShowCover(false); setSelectedSection(null); }}
              className="nav-link"
            >
              Index
            </button>
            <a href="https://x.com/ritmir11" target="_blank" rel="noopener noreferrer" className="nav-link">
              Twitter
            </a>
          </div>
        </div>
      </nav>

      {/* Cover Page */}
      {showCover && (
        <section className="min-h-screen flex items-center justify-center px-6 pt-20 fade-in">
          <div className="text-center max-w-2xl">
            <h1 className="text-6xl md:text-8xl serif italic mb-6 tracking-tight">
              Absconded
            </h1>
            <p className="text-sm uppercase tracking-[0.4em] text-secondary mb-16">
              A Builder's Evolution
            </p>
            
            <div className="mb-20 space-y-4 text-secondary font-light leading-relaxed">
              <p>"Disappearing is easy. Becoming is the hard part."</p>
            </div>

            <button 
              onClick={() => setShowCover(false)}
              className="px-12 py-4 border border-white/10 hover:border-white/40 rounded-full text-[10px] tracking-[0.3em] uppercase transition-all duration-500"
            >
              Begin Reading
            </button>

            <div className="mt-32 text-[9px] tracking-[0.2em] text-secondary/50 uppercase">
              Mumbai / Twenty-Twenty-Six
            </div>
          </div>
        </section>
      )}

      {/* Index / Contents */}
      {!showCover && !selectedSection && (
        <section className="pt-40 pb-20 px-6 max-w-2xl mx-auto fade-in">
          <h2 className="text-xs uppercase tracking-[0.4em] text-secondary mb-16">Manuscript Index</h2>
          <div className="space-y-2">
            {manuscript.map((section) => (
              <div
                key={section.id}
                onClick={() => setSelectedSection(section)}
                className="chapter-card cursor-pointer group"
              >
                <div className="flex items-baseline gap-6">
                  <span className="text-[10px] font-light text-secondary group-hover:text-accent transition-colors">
                    {section.number === 0 || section.number === 11 ? '★' : String(section.number).padStart(2, '0')}
                  </span>
                  <h3 className="text-2xl serif group-hover:italic transition-all duration-300">
                    {section.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section View */}
      {selectedSection && (
        <section className="pt-40 pb-32 px-6 fade-in">
          <div className="book-container">
            <header className="mb-20 text-center">
              <div className="text-[10px] tracking-[0.3em] text-secondary mb-4 uppercase">
                {selectedSection.label}
              </div>
              <h1 className="text-4xl md:text-5xl serif italic leading-tight">
                {selectedSection.title}
              </h1>
            </header>

            <article className="book-text serif">
              <div className="text-secondary italic text-center mb-16 px-8 leading-relaxed">
                "{selectedSection.epigraph}"
              </div>
              
              <div className="space-y-10">
                {selectedSection.content.map((block, i) => {
                  if (block.type === 'p') {
                    return <p key={i} className={i === 0 ? 'drop-cap' : ''}>{block.text}</p>
                  }
                  if (block.type === 'pull') {
                    return (
                      <div key={i} className="pull-quote">
                        {block.text}
                      </div>
                    )
                  }
                  if (block.type === 'terminal') {
                    return (
                      <div key={i} className="terminal-block">
                        {block.text}
                      </div>
                    )
                  }
                  return null
                })}
              </div>
              
              <div className="mt-32 pt-20 border-t border-white/5 text-center">
                <button 
                  onClick={handleNext}
                  className="group flex flex-col items-center gap-6 mx-auto"
                >
                  <span className="text-[10px] tracking-[0.4em] uppercase text-secondary group-hover:text-accent transition-colors">
                    {selectedSection.number === manuscript.length - 1 ? 'End of Manuscript' : 'Continue Evolution'}
                  </span>
                  <div className="text-4xl serif italic group-hover:gap-8 transition-all duration-500 flex items-center gap-4">
                    <span>{selectedSection.number === manuscript.length - 1 ? 'Return Home' : 'Next Chapter'}</span>
                    <span className="text-2xl group-hover:translate-x-4 transition-transform">→</span>
                  </div>
                </button>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] tracking-[0.2em] text-secondary uppercase">
          <div className="flex gap-8">
            <a href="https://github.com/habibixyz/Absconded" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>
            <a href="https://x.com/ritmir11" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Twitter</a>
          </div>
          <div>
            Absconded / © 2026
          </div>
        </div>
      </footer>
    </main>
  )
}
