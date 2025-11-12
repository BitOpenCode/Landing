import { useEffect, useState, useMemo } from 'react'

const Assets = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('shelf')
  const [expandedCard, setExpandedCard] = useState(null)
  
  // Блокировка скролла при открытии модального окна
  useEffect(() => {
    if (expandedCard) {
      // Сохраняем текущую позицию скролла
      const scrollY = window.scrollY
      
      // Блокируем скролл
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.documentElement.style.overflow = 'hidden'
      
      return () => {
        // Разблокируем скролл
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.documentElement.style.overflow = ''
        
        // Восстанавливаем позицию скролла
        window.scrollTo(0, scrollY)
      }
    }
  }, [expandedCard])
  
  // Utility functions для glow эффекта
  const centerOfElement = ($el) => {
    const { width, height } = $el.getBoundingClientRect()
    return [width / 2, height / 2]
  }

  const pointerPositionRelativeToElement = ($el, e) => {
    const pos = [e.clientX, e.clientY]
    const { left, top, width, height } = $el.getBoundingClientRect()
    const x = pos[0] - left
    const y = pos[1] - top
    const px = clamp((100 / width) * x)
    const py = clamp((100 / height) * y)
    return { pixels: [x, y], percent: [px, py] }
  }

  const angleFromPointerEvent = ($el, dx, dy) => {
    let angleRadians = 0
    let angleDegrees = 0
    if (dx !== 0 || dy !== 0) {
      angleRadians = Math.atan2(dy, dx)
      angleDegrees = angleRadians * (180 / Math.PI) + 90
      if (angleDegrees < 0) {
        angleDegrees += 360
      }
    }
    return angleDegrees
  }

  const distanceFromCenter = ($card, x, y) => {
    const [cx, cy] = centerOfElement($card)
    return [x - cx, y - cy]
  }

  const closenessToEdge = ($card, x, y) => {
    const [cx, cy] = centerOfElement($card)
    const [dx, dy] = distanceFromCenter($card, x, y)
    let k_x = Infinity
    let k_y = Infinity
    if (dx !== 0) {
      k_x = cx / Math.abs(dx)
    }
    if (dy !== 0) {
      k_y = cy / Math.abs(dy)
    }
    return clamp(1 / Math.min(k_x, k_y), 0, 1)
  }

  const round = (value, precision = 3) => parseFloat(value.toFixed(precision))
  const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max)

  const cardUpdate = ($card) => (e) => {
    const position = pointerPositionRelativeToElement($card, e)
    const [px, py] = position.pixels
    const [perx, pery] = position.percent
    const [dx, dy] = distanceFromCenter($card, px, py)
    const edge = closenessToEdge($card, px, py)
    const angle = angleFromPointerEvent($card, dx, dy)

    $card.style.setProperty('--pointer-x', `${round(perx)}%`)
    $card.style.setProperty('--pointer-y', `${round(pery)}%`)
    $card.style.setProperty('--pointer-°', `${round(angle)}deg`)
    $card.style.setProperty('--pointer-d', `${round(edge * 100)}`)

    $card.classList.remove('animating')
  }

  // Инициализация glow эффекта для карточек
  useEffect(() => {
    const cards = document.querySelectorAll('.feature-card:not(.assets-expanded-card)')
    
    cards.forEach($card => {
      const updateHandler = cardUpdate($card)
      $card.addEventListener('pointermove', updateHandler)
      $card.addEventListener('pointerleave', () => {
        $card.style.setProperty('--pointer-d', '0')
      })
    })

    return () => {
      cards.forEach($card => {
        $card.removeEventListener('pointermove', cardUpdate($card))
      })
    }
  }, [])

  // Инициализация glow эффекта для увеличенной карточки
  useEffect(() => {
    if (expandedCard) {
      let handlePointerMove = null
      let handlePointerLeave = null
      let expandedCardElement = null
      
      // Небольшая задержка для гарантии, что элемент уже в DOM
      const timer = setTimeout(() => {
        expandedCardElement = document.querySelector('.assets-expanded-card')
        if (expandedCardElement) {
          handlePointerMove = cardUpdate(expandedCardElement)
          handlePointerLeave = () => {
            expandedCardElement.style.setProperty('--pointer-d', '0')
          }
          
          expandedCardElement.addEventListener('pointermove', handlePointerMove)
          expandedCardElement.addEventListener('pointerleave', handlePointerLeave)
        }
      }, 100)

      return () => {
        clearTimeout(timer)
        if (expandedCardElement && handlePointerMove && handlePointerLeave) {
          expandedCardElement.removeEventListener('pointermove', handlePointerMove)
          expandedCardElement.removeEventListener('pointerleave', handlePointerLeave)
          expandedCardElement.style.setProperty('--pointer-d', '0')
        }
      }
    }
  }, [expandedCard])

  // Определяем порядок карточек по полкам
  const assets = [
    // Полка 1
    {
      id: 'xp',
      title: 'XP (XP Points)',
      description: 'XP refers to the in-game currency used to purchase in-game assets. XP is not a real currency and cannot be withdrawn. XP may be used exclusively within the game and may be converted into game-related rewards, discounts, or special offers, as defined by the Company.',
      extendedDescription: `XP (ECOS Points) is the in-game currency of ECOS Mining Game, which forms the foundation of the game's economy. XP is used to develop your mining empire: purchasing ASIC miners, energy, infrastructure, and trading on the Marketplace.

Key Features:

💰 Primary currency for all in-game purchases
⚡ Purchased with TON or Telegram Stars
🔄 Earned through gameplay (mining xpBTC, quests, referrals)
🛒 Used to purchase ASICs, kWt (energy), Land, Energy Stations, Datacenters
🤝 Traded between players on the Marketplace
🎁 Converted into bonuses and discounts on real ECOS products

What is XP?

XP (ECOS Points) is a virtual in-game currency in ECOS Mining Game. It is not a cryptocurrency, has no market value outside the game, and cannot be withdrawn to external wallets.

XP is your building material for developing your mining business in the game. Without XP, you cannot:

• Purchase ASIC miners to mine xpBTC
• Buy energy (kWt) to power your equipment
• Build infrastructure (Land, Energy Stations, Datacenters)
• Trade on the Marketplace with other players

How to Get XP?

1. Direct Purchase (Primary Market)
   • Buy XP with TON or Telegram Stars directly from ECOS
   • Price is set by the company and may change
   • Instant credit to your balance

2. Gameplay (Earning)
   📊 Mining xpBTC: Convert mined xpBTC into XP
   ✅ Completing Quests: Earn XP by completing missions
   👥 Referral Program: Invite friends and earn % from their purchases
   🎁 Daily bonuses and events: Participate in promotions

3. Marketplace (Secondary Market)
   🛒 Buy XP from other players for TON
   💱 Price is set by the seller (P2P trading)
   ⚠️ ECOS does not control prices and does not guarantee transactions

How to Use XP?

🔧 Main Applications:

A. Equipment Purchase:
   • ASIC miners — primary tool for mining xpBTC
   • More powerful ASICs generate more xpBTC
   • Price in XP depends on the model (from basic to top-tier)

B. Energy Purchase (kWt):
   • ASIC miners consume kWt (kilowatts) to operate
   • Miners don't work without energy
   • Buy kWt for XP from ECOS or from other players on the Marketplace

C. Infrastructure Construction:
   • Land — territory for placing Energy Stations and Datacenters
   • Energy Station — connects Datacenter to the power grid
   • Datacenter — container for ASIC miners (up to 250 units)

D. Marketplace Trading:
   • Sell excess kWt to other players for XP
   • Buy rare Avatars with developed infrastructure
   • Exchange XP for TON (if other players have listed offers)

⚠️ Limitations and Risks

What XP is NOT:

❌ Not a cryptocurrency — no blockchain token, no contract address
❌ Not a security — does not grant rights to a share in ECOS or company profits
❌ Not an investment — no promise of future returns
❌ Not withdrawable — cannot be withdrawn to external wallets (at current game stage)

💡 XP Usage Strategies

For Beginners:
• Buy a basic XP package
• Purchase your first ASIC miners
• Buy kWt to power them
• Start mining xpBTC and convert to XP
• Reinvest in more powerful equipment

For Advanced Players:
• Build complete infrastructure (Land → Energy Station → Datacenter)
• Fill Datacenter with maximum ASICs
• Generate excess kWt and sell on Marketplace for XP
• Use multiple Avatars for diversification
• Speculate on Marketplace: buy XP cheap, sell higher

For Traders:
• Buy XP from players cheaper than from ECOS
• Sell rare Avatars with infrastructure
• Monopolize the kWt market at certain times
• Monitor game updates — prices may fluctuate

📝 FAQ

Q: Can I withdraw XP to an exchange?
A: No, XP exists only within the game and is not a cryptocurrency.

Q: What happens to my XP if the game closes?
A: ECOS will try to convert XP into equivalent bonuses, but does not guarantee this. See Clause 11.4 ToS.

Q: Can I get a refund for purchased XP?
A: No, all purchases are final (Clause 4.3).

Q: Is it safe to buy XP from other players?
A: ECOS does not control P2P transactions. Fraud risk lies with the buyer (Clause 4.9).

Q: Can I transfer XP to a friend?
A: Not directly. Only through the Marketplace (selling for TON).`,
      icon: '💰',
      image: '/images/xp.png',
      shelf: 1,
      category: 'currency'
    },
    {
      id: 'xpbtc',
      title: 'xpBTC',
      description: 'xpBTC refers to the in-game Bitcoin ticker used exclusively for simulation and educational purposes. It is not a real cryptocurrency and is only relevant within the context of the ECOS Mining Game.',
      extendedDescription: `xpBTC (Experimental Bitcoin)

xpBTC is the simulated in-game representation of Bitcoin within the ECOS BTC Mining Game. It mirrors the logic and economics of real Bitcoin mining but exists solely in the game environment. xpBTC is generated through mining operations performed by your ASIC miners and serves as the foundation for earning and converting value into XP (ECOS Points).

Key Features:

💎 Simulated Bitcoin for gameplay economy
⚙️ Mined using in-game ASIC miners
🔄 Converted into XP to expand your mining empire
📊 Reflects real Bitcoin hashrate and difficulty
🎓 Educational purpose — demonstrates real BTC mining mechanics
🪙 Tracks real BTC price in the background (for simulation accuracy)

What is xpBTC?

xpBTC (Experimental Bitcoin) is a virtual simulation of Bitcoin used exclusively inside the ECOS Mining Game. It is not a real cryptocurrency and cannot be exchanged, withdrawn, or transferred outside the game.

It serves as a reward mechanism for players who build mining infrastructure and operate ASIC miners. Every miner you own produces xpBTC based on its hashrate, energy supply (kWt), and network difficulty — just like in real Bitcoin mining.

How to Earn xpBTC?

⛏️ Mining:

Every ASIC miner in operation generates xpBTC over time.

The output depends on the hashrate (TH/s)

🎯 BTC Mining Pool Bonuses (Advanced):

Join or create mining pools to combine hashrate with other players.

Pool level and contribution determine additional xpBTC rewards.

How to Use xpBTC?

Once mined, xpBTC can be:

🔁 Converted to XP

Exchange your mined xpBTC into XP to expand operations.

Conversion rate reflects the real Bitcoin market price.

The higher BTC's simulated price, the more XP you get.

📈 Tracked as Performance Metric

xpBTC output reflects your mining efficiency and profitability.

Used in leaderboards, stats, and achievements.

🎓 Used for Education & Strategy

xpBTC helps players understand real mining economics: difficulty, hashrate, energy costs, and ROI cycles.

xpBTC Conversion through Game Wallet

If BTC = 100,000 USD
and you mined 0.001 xpBTC,
you can convert it into 100 XP Points at the current simulated rate.

This system allows players to experience real mining dynamics without dealing with real cryptocurrencies.

⚠️ Limitations and Disclaimers

❌ xpBTC is not real Bitcoin.
❌ It cannot be withdrawn or exchanged for BTC or fiat.
❌ It has no on-chain representation or wallet address.
❌ It exists only within the ECOS BTC Mining Game for educational simulation.

All xpBTC values are virtual, designed to simulate mining profitability and economic strategy, not to represent financial instruments or investments.

💡 xpBTC Strategy Tips

For Beginners:

Start with one ASIC and learn how hashrate affects your xpBTC yield.

Convert xpBTC into XP sometimes to scale your operation.

For Traders:

Monitor BTC's real-time ticker to time your xpBTC-to-XP conversion advantageously.

When the BTC price rises, converting xpBTC yields more XP.

📝 FAQ

Q: Is xpBTC a real cryptocurrency?
A: No. xpBTC is an educational simulation token representing virtual mining results in the game.

Q: Can I withdraw xpBTC to an external wallet?
A: No, xpBTC cannot be withdrawn, exchanged, or transferred outside the ECOS Mining Game.

Q: Why does xpBTC value change?
A: Its XP conversion rate is tied to the real Bitcoin market price, which may fluctuate.

Q: Can I trade xpBTC on the Marketplace?
A: No. Only XP, kWt, Land, and other game assets are tradable. xpBTC can only be mined and converted to XP.`,
      icon: '₿',
      image: '/images/xpbtc.png',
      shelf: 1,
      category: 'currency'
    },
    {
      id: 'ticket',
      title: 'Ticket',
      description: 'Ticket — A special item in the game that provides access to exclusive features, events, or rewards.',
      extendedDescription: `Ticket 🎟️

Ticket is a special in-game item in ECOS BTC Mining Game that provides access to exclusive features, mini-games, lotteries, and future events.

At the early stages of the game, Tickets are not yet used, but they are already distributed as part of player progression rewards — symbolizing early participation and future privileges.

Key Features

🎟️ Access to exclusive events and mini-games
💎 Earned automatically through level progression
💰 Can be purchased later via TON or XP
🔓 Will unlock new gameplay modes in future updates

Ticket Distribution

At the current game stage:

🧍 Regular players receive 1 Ticket when advancing through key levels.

👑 Premium players receive 2 Tickets for the same progression.

These Tickets are stored in your inventory and will be activated once the related mini-games and lotteries are launched.

Future Use Cases

🎮 Mini-Games:
Tickets will serve as entry passes to special side games where players can earn XP, energy, or rare items.

🎰 Lotteries & Events:
Use Tickets to participate in raffles and limited-time draws for unique prizes or bonuses.

💼 Exclusive Access:
Certain advanced game features or premium areas may require one or more Tickets to enter.

Important Note

🚧 Early Stage Notice:
Tickets currently have no direct function, but they are already collectible assets that will gain value and utility as the ECOS BTC Mining Game expands.

All details regarding Ticket mechanics, usage, and purchasing options will be revealed in upcoming updates.`,
      icon: '🎫',
      image: '/images/ticket.png',
      shelf: 1,
      category: 'currency'
    },
    // Полка 2
    {
      id: 'kwt',
      title: 'kWt (Kilowatt)',
      description: 'kWt (Kilowatt) — virtual energy that powers ASIC miners and Datacenters. Purchase with XP now; generate through Energy Stations in future updates.',
      extendedDescription: `kWt (Kilowatt) ⚡

kWt (Kilowatt) is the in-game unit of virtual energy required to operate mining equipment (ASIC Miners) and Datacenters in ECOS BTC Mining Game. Without sufficient kWt, your mining operations cannot function, and you won't generate xpBTC.

Key Features:

⚡ Essential resource for all mining operations
💰 Purchased with XP (0.05 XP/kWt)
🔄 Tradable between players on the Marketplace
📊 Consumed by ASIC miners based on their power requirements
⚙️ Required for Datacenter operations

What is kWt?

kWt (Kilowatt) represents virtual electrical energy in the game. Just like real mining equipment needs electricity to operate, your ASIC miners and Datacenters require kWt to function and produce xpBTC.

Each ASIC miner consumes kWt based on its power rating. ASIC S21 Pro has a power rating of 3.51 kW. Without kWt, your miners remain idle and generate no rewards.

How to Get kWt?

1. Direct Purchase (Primary Market)

💰 Buy kWt with XP directly from ECOS
💵 Price: 0.05 XP/kWt (set by the company)
⚡ Instant credit to your energy balance

2. Marketplace (Secondary Market)

🛒 Buy kWt from other players for XP or TON
💱 Price is set by sellers (P2P trading)
⚠️ ECOS does not control prices or guarantee transactions

3. Starting Bonus

🎁 New players receive 10,530 kWt free energy (~526.5 XP value) as part of starting assets

4. Energy Generation (Future Update)

🏭 Generate kWt through Energy Stations (future update)
⚙️ Infrastructure assets will produce kWt over time

How to Use kWt?

🔧 Main Applications:

A. Power ASIC Miners:

Every ASIC miner requires kWt to operate.

ASIC S21 Pro consumption:
• 1 ASIC per 6h session: 21.06 kWt
• 1 ASIC per 24h (4 sessions): 84.24 kWt

Without kWt, miners cannot mine xpBTC.

B. Operate Datacenters:

Datacenters need kWt to power all ASIC miners inside them.

A Datacenter can hold up to 250 ASIC miners.

Total consumption = sum of all miners' power requirements.

Datacenters cannot function without sufficient kWt supply.

C. Energy Storage:

Store excess kWt in Power Storage facilities.

Power Storage levels:
• Level 1: 240,000 kWt capacity (10,000 XP)
• Level 2: 480,000 kWt capacity (25,000 XP)
• Level 3: 7,200,000 kWt capacity (50,000 XP)
• Level 4: 15,360,000 kWt capacity (100,000 XP)

D. Marketplace Trading:

Sell excess kWt to other players for XP.

Buy kWt when you need it urgently.

Trade kWt as a commodity for profit.

Energy System Details

Starting Energy: 10,530 kWt (free)

Energy Station Capacity: 21,060 kWt

Maximum Infrastructure:
• 137 Energy Stations (maximum)
• Maximum Total Energy: 2,885,220 kWt

⚠️ Important Notes

❌ kWt cannot be withdrawn or converted to real electricity
❌ It has no real-world value outside the game
❌ Energy Station does not generate kWt — it enables Datacenter to draw kWt from the power infrastructure
❌ Running out of kWt stops all mining operations

💡 kWt Strategy Tips

For Beginners:

Start with the free 10,530 kWt to power your first ASIC.

Monitor your consumption: 1 ASIC needs 84.24 kWt per day.

Buy kWt at 0.05 XP/kWt when you need more.

For Advanced Players:

Plan your energy consumption based on ASIC count.

Use Power Storage to store excess kWt.

Optimize your infrastructure to minimize energy waste.

For Traders:

Monitor Marketplace prices for kWt arbitrage opportunities.

Buy kWt when demand is low, sell when demand is high.

Trade kWt as a commodity for profit.

📝 FAQ

Q: What happens if I run out of kWt?
A: Your ASIC miners and Datacenters will stop operating until you replenish your kWt supply.

Q: Can I generate kWt without purchasing it?
A: Currently, you must purchase kWt. In future updates, Energy Stations will allow you to generate kWt.

Q: How much kWt does one ASIC consume?
A: ASIC S21 Pro consumes 21.06 kWt per 6-hour session, or 84.24 kWt per 24 hours (4 sessions).

Q: Can I transfer kWt to another player?
A: Yes, through the Marketplace. You can sell kWt for XP or TON to other players.

Q: Does kWt expire or degrade over time?
A: No, kWt does not expire. However, it is consumed when used to power equipment.`,
      icon: '⚡',
      image: '/images/kWt.png',
      shelf: 2,
      category: 'energy'
    },
    // Полка 3
    {
      id: 'avatars',
      title: 'Avatars',
      description: 'Avatars refer to the user-controlled characters in the game, which may have attached Land, EnergyStations, and Datacenters. Users can own multiple Avatars and select them to operate mining activities within the game.',
      extendedDescription: `Avatars 👤

Avatars are player-controlled characters in the ECOS BTC Mining Game, representing your identity, progress, and power within the ECOS universe.
Through Avatars, players perform all in-game actions — mining, building infrastructure, participating in events, and managing their mining empire.

Each player can own multiple Avatars, upgrade them, and connect their mining infrastructure directly to them. Every Avatar carries its own value, attributes, and level of development — forming the core of your personal in-game business.

Key Features

🎭 Unique characters with randomized visual attributes
💎 Can hold Land, Energy Stations, and Datacenters
🚀 Leveling up increases Power and mining efficiency
🪙 Will support minting and external marketplace trading
🏙️ Represents your mining empire on the City Screen
🏆 Sequential numbering (#1, #655, etc.) by player registration order

Avatar Acquisition

When a player purchases an Avatar, they receive it at Level 0.

Base price: $15 (in XP Points equivalent)

Levels range from 0 to 10 (total of 11)

If you were the first player, your Avatar is labeled #1

If you were the 655th, your Avatar will be #655, and so on

Avatar Attributes

Each Avatar is generated with a unique combination of five attributes:

🎨 Background (10 types)
👕 Clothing (10 types)
🏅 Badge (10 types)
👁️ Eyes (10 types)
✨ Effect (10 types)

Each attribute adds a Power multiplier, which affects the overall mining profitability and xpBTC-to-XP conversion efficiency.

Color & Level System

As Avatars grow stronger, their color and base Power change:

Level 0 - Skin-tone: Starter Avatar upon purchase
Level 1 - White: Initial upgrade level
Level 2 - Orange: Early development
Level 3 - Blue: Mid-level stage
Level 4 - Red: Experienced player
Level 5 - Purple: Advanced stage
Level 6 - Silver: Elite level
Level 7 - Gold: Top-tier player
Level 8 - Cosmic: Rare Avatar
Level 9 - Mercury: Very rare Avatar
Level 10 - Holographic: Ultimate, max-level Avatar

Upgrading & Power

Avatars can be upgraded by investing 10,000 to 100,000 ECOS Points.
Each upgrade changes the color, increases Power, and improves the Avatar's rarity and mining performance.

However, the Avatar level cannot exceed the player's current account level.
If your profile is Level 5, your Avatar can only be upgraded up to Level 5.

Power Calculation Example

Avatar Level 8 → Base Power = 800,000

Equivalent profit rate: 8% (or 0.08 in calculations)

Total Power = Base Power (by level) + Attribute Power (from 5 traits)

Power Utility

Avatar Power directly impacts:
⚙️ Mining profitability and xpBTC generation rate
💱 Conversion rate between xpBTC → XP
🏗️ Efficiency of attached mining infrastructure
🎮 Performance in future PvP and mini-game modes

Ownership, Minting & Marketplace

In later stages of the game, Avatars will become mintable digital assets, allowing players to:

✅ Mint their Avatar as a collectible NFT

🛒 Sell or trade Avatars on external marketplaces

When selling an Avatar, the player effectively sells their in-game business:
all attached Land, Energy Stations, Datacenters, and mining progress move together with the Avatar.

On the City Screen, each Avatar represents a visible mining empire — the size, efficiency, and design of which reflect the player's achievements.

By purchasing an Avatar from another player, you inherit their progress, gaining a more advanced setup, higher Power, and time-saving advantages.

Future Development

In future updates, Avatars will gain even deeper functionality:

Unlock legendary effects and visual evolutions

Participate in PvP battles and global events

Obtain unique passive abilities and boosts

Be tradable both inside and outside the ECOS ecosystem`,
      icon: '👤',
      image: '/images/avatar.png',
      shelf: 3,
      category: 'special'
    },
    // Полка 4
    {
      id: 'land',
      title: 'Land',
      description: 'Land — a limited placement area required for building Energy Stations and Datacenters. Without Land, you cannot deploy these facilities.',
      extendedDescription: `Land 🏞️

Land is a limited in-game asset that serves as a placement area required for building and operating Energy Stations and Datacenters. Without owning Land, a User cannot purchase or deploy these in-game facilities. Land functions as the foundational space for placing infrastructure within the Avatar's portfolio.

Key Information

💰 Cost: 10,000 XP

🏗️ Function: Placement area for Datacenter (container with space for 250 ASIC)

🔢 Total quantity in game: 137

⚡ Without Land, players cannot place Datacenter and Energy Station to power their equipment container

What is Land?

Land is the foundational asset in ECOS BTC Mining Game. It serves as the physical space where you can build and operate your mining infrastructure. Each piece of Land can hold one Datacenter and one Energy Station.

Land is essential for:
• Placing Datacenters (containers for up to 250 ASIC miners)
• Building Energy Stations (required to power Datacenters)
• Expanding your mining empire
• Organizing your infrastructure within your Avatar's portfolio

Land Limitations

🔒 Limited Supply: Only 137 Land plots exist in the entire game

🎯 One per Avatar: Each Land plot can be attached to one Avatar

🏗️ Infrastructure Capacity: Each Land can hold:
   • 1 Datacenter (up to 250 ASIC miners)
   • 1 Energy Station (required to power the Datacenter)

💡 Strategic Importance

Land is a critical bottleneck resource in the game. With only 137 plots available, owning Land becomes increasingly valuable as the game grows.

Early players who acquire Land gain a significant advantage:
• Secure infrastructure placement
• Control over mining capacity
• Potential for future value appreciation

⚠️ Important Notes

❌ Land cannot be created or generated — only 137 plots exist
❌ Without Land, you cannot build Datacenters or Energy Stations
❌ Land is permanently attached to your Avatar's portfolio
❌ Each Land plot is unique and limited

📝 FAQ

Q: How many Land plots can I own?
A: You can own multiple Land plots, but the total supply is limited to 137 across all players.

Q: Can I sell or transfer Land?
A: Land is attached to your Avatar. When you sell an Avatar, the Land goes with it.

Q: What happens if all 137 Land plots are owned?
A: New players will need to purchase Avatars with Land from existing players or wait for future game expansions.

Q: Can I build multiple Datacenters on one Land?
A: No, each Land plot can hold only one Datacenter and one Energy Station.

Q: Is Land required for all infrastructure?
A: Yes, Land is required for Datacenters and Energy Stations. Other assets may have different placement requirements.`,
      icon: '🏞️',
      image: '/images/Land.png',
      shelf: 4,
      category: 'infrastructure'
    },
    {
      id: 'energy-station',
      title: 'Energy Station',
      description: 'Energy Station — a limited asset (137 units) that connects Datacenter to power infrastructure. Enables Datacenter to draw kWt for ASIC miners.',
      extendedDescription: `Energy Station ⚡

Energy Station is a limited in-game asset (137 total units) required to connect a Datacenter to the game's power infrastructure. An Energy Station does not itself "generate" virtual energy; rather, it enables a Datacenter to draw the virtual energy (kWt) necessary to operate ASIC Miners and related facilities. Ownership of an Energy Station is a prerequisite for powering and operating a Datacenter.

Key Information

🔢 Total quantity in game: 137 (limited)

⚡ Capacity: 21,060 kWt per Energy Station

🏗️ Function: Connects Datacenter to power infrastructure

🎁 Starting bonus: 1 Energy Station (free for new players)

📊 Maximum total energy: 2,885,220 kWt (137 × 21,060 kWt)

What is Energy Station?

Energy Station is a critical infrastructure component that acts as a power connection point between your Datacenter and the game's power grid. It does not generate energy itself, but rather enables your Datacenter to access and draw kWt (kilowatts) from the power infrastructure.

Without an Energy Station, your Datacenter cannot receive power, and all ASIC miners inside it will remain idle.

How Energy Station Works

🔌 Connection Function:
• Energy Station connects your Datacenter to the power infrastructure
• It enables the Datacenter to draw kWt for powering ASIC miners
• Without Energy Station, Datacenter cannot operate

⚡ Power Capacity:
• Each Energy Station provides access to 21,060 kWt capacity
• This capacity allows your Datacenter to power ASIC miners
• You still need to purchase kWt separately (0.05 XP/kWt)

🏗️ Placement Requirements:
• Energy Station must be placed on Land
• One Energy Station per Land plot
• Cannot be placed without owning Land

Energy Station Limitations

🔒 Limited Supply: Only 137 Energy Stations exist in the entire game

🎯 One per Land: Each Land plot can hold only one Energy Station

⚙️ Prerequisite: Energy Station is required before Datacenter can operate

💡 Strategic Importance

Energy Stations are a critical bottleneck resource. With only 137 units available, they become increasingly valuable as the game grows.

Early players who acquire Energy Stations gain:
• Ability to power their Datacenters
• Access to maximum mining capacity
• Strategic advantage in infrastructure development

Energy Station & Infrastructure Chain

The complete infrastructure chain requires:
1. Land (placement area)
2. Energy Station (power connection)
3. Datacenter (container for ASIC miners)
4. kWt (actual energy to power miners)

Without any of these components, your mining operations cannot function.

⚠️ Important Notes

❌ Energy Station does NOT generate kWt — it only enables Datacenter to draw kWt
❌ You still need to purchase kWt separately (0.05 XP/kWt)
❌ Energy Station is required for Datacenter operation
❌ Only 137 Energy Stations exist — limited supply
❌ Cannot be placed without Land

📝 FAQ

Q: How many Energy Stations can I own?
A: You can own multiple Energy Stations, but the total supply is limited to 137 across all players.

Q: Does Energy Station generate kWt?
A: No, Energy Station does not generate kWt. It enables your Datacenter to draw kWt from the power infrastructure. You still need to purchase kWt separately.

Q: Can I operate a Datacenter without Energy Station?
A: No, Energy Station is a prerequisite for powering and operating a Datacenter.

Q: How much kWt can one Energy Station provide?
A: Each Energy Station provides access to 21,060 kWt capacity for your Datacenter.

Q: Will Energy Stations generate kWt in the future?
A: Yes, in future updates, Energy Stations will allow you to generate kWt, making them both power connectors and energy generators.

Q: Can I place multiple Energy Stations on one Land?
A: No, each Land plot can hold only one Energy Station and one Datacenter.

Q: What happens if all 137 Energy Stations are owned?
A: New players will need to purchase Avatars with Energy Stations from existing players or wait for future game expansions.`,
      icon: '⚡',
      image: '/images/energystation.png',
      shelf: 4,
      category: 'infrastructure'
    },
    {
      id: 'datacenter',
      title: 'Datacenter',
      description: 'Datacenter — a limited hosting facility (137 units) for ASIC miners. Holds up to 250 ASIC miners. Requires Land and Energy Station.',
      extendedDescription: `Datacenter 🏢

Datacenter is a limited in-game asset (137 total units) that serves as a hosting facility for virtual ASIC Miners within the Game. Each Datacenter provides slots for placing and operating ASIC Miners, up to a defined maximum capacity.

Key Information

💰 Cost: 50,000 XP

🏗️ Function: Placement area for 250 ASIC miners

🔢 Total quantity in game: 137 (limited)

🎁 Starting bonus: 1 Datacenter (free for new players)

📊 Maximum capacity: 250 ASIC miners per Datacenter

What is Datacenter?

Datacenter is a container facility that houses and organizes your ASIC mining equipment. It serves as the physical structure where you place and operate your ASIC miners to generate xpBTC.

Each Datacenter can hold up to 250 ASIC miners, making it a critical component for scaling your mining operations.

Datacenter Requirements

To build and operate a Datacenter, you need:

1. Land — placement area (required)
   • Each Land plot can hold one Datacenter
   • Cost: 10,000 XP

2. Energy Station — power connection (required)
   • Connects Datacenter to power infrastructure
   • Enables Datacenter to draw kWt
   • Limited to 137 units

3. kWt — actual energy (required for operation)
   • Powers all ASIC miners inside Datacenter
   • Price: 0.05 XP/kWt
   • Consumption depends on number of ASICs

How Datacenter Works

🔧 Infrastructure Chain:

The complete setup requires:
1. Land (placement area)
2. Energy Station (power connection)
3. Datacenter (ASIC container)
4. ASIC Miners (mining equipment)
5. kWt (energy to power miners)

⚡ Power Requirements:

Datacenter needs kWt to power all ASIC miners inside it.

Example consumption:
• 1 ASIC per 6h session: 21.06 kWt
• 1 ASIC per 24h (4 sessions): 84.24 kWt
• 250 ASICs per 24h: 21,060 kWt

Without sufficient kWt, all miners in the Datacenter remain idle.

📊 Capacity & Scaling

Maximum Capacity:
• Each Datacenter can hold up to 250 ASIC miners
• Total hashrate capacity: 250 × 234 TH = 58,500 TH per Datacenter

Starting Setup:
• New players receive 1 free Datacenter
• Can add up to 249 more ASICs to reach maximum capacity

Datacenter Limitations

🔒 Limited Supply: Only 137 Datacenters exist in the entire game

🎯 One per Land: Each Land plot can hold only one Datacenter

⚙️ Prerequisites: Requires Land and Energy Station to operate

💡 Strategic Importance

Datacenters are a critical bottleneck resource. With only 137 units available, they become increasingly valuable as the game grows.

Early players who acquire Datacenters gain:
• Ability to scale mining operations (up to 250 ASICs)
• Maximum hashrate capacity per infrastructure unit
• Strategic advantage in mining efficiency

⚠️ Important Notes

❌ Datacenter cannot operate without Land
❌ Datacenter cannot operate without Energy Station
❌ Datacenter needs kWt to power ASIC miners
❌ Only 137 Datacenters exist — limited supply
❌ Without kWt, all ASIC miners inside remain idle

📝 FAQ

Q: How many Datacenters can I own?
A: You can own multiple Datacenters, but the total supply is limited to 137 across all players.

Q: How many ASIC miners can I place in one Datacenter?
A: Each Datacenter can hold up to 250 ASIC miners.

Q: Can I operate a Datacenter without Energy Station?
A: No, Energy Station is required to connect Datacenter to the power infrastructure.

Q: Can I place a Datacenter without Land?
A: No, Land is required as a placement area for Datacenter.

Q: What happens if I run out of kWt?
A: All ASIC miners inside the Datacenter will stop operating until you replenish your kWt supply.

Q: Can I place multiple Datacenters on one Land?
A: No, each Land plot can hold only one Datacenter and one Energy Station.

Q: What is the cost of a Datacenter?
A: Datacenter costs 50,000 XP. New players receive one free Datacenter as a starting bonus.`,
      icon: '🏢',
      image: '/images/datacenter.png',
      shelf: 4,
      category: 'infrastructure'
    },
    // Полка 5
    {
      id: 'city',
      title: 'City',
      description: 'City — the main urban environment for additional functionality and game buttons.',
      extendedDescription: `City 🏙️

City is the main urban environment in ECOS BTC Mining Game. It serves as a place for additional functionality and buttons that are present in the game.

What is City?

City is the central hub where players can access various game features, build structures, manage resources, and interact with game elements. It provides space for additional functionality and game controls.

City Features

🏗️ Building Placement:
• Place various buildings and structures
• Manage your infrastructure
• Organize your mining empire

🎮 Game Functions:
• Access additional game functionality
• Use game buttons and controls
• Interact with various game elements

⚠️ Important Notes

❌ City serves as a hub for additional game functionality
❌ Various buildings and structures can be placed in City
❌ Game buttons and controls are accessible through City`,
      icon: '🏙️',
      image: '/images/city.png',
      shelf: 5,
      category: 'infrastructure'
    },
    // Полка 6
    {
      id: 'solar',
      title: 'Solar Power Station',
      description: 'Solar Panels. Price: 20,000 XP. Maintenance: 500 XP (session). Performance: 10 Mvt.',
      extendedDescription: `Solar Power Station ☀️

Solar Panels is a power generation facility in ECOS BTC Mining Game.

Key Information

💰 Price: 20,000 XP

⚙️ Maintenance: 500 XP (per session)

⚡ Performance: 10 Mvt

What is Solar Power Station?

Solar Power Station is a renewable energy facility that generates power using solar panels. It offers entry-level power generation with low maintenance costs.

Power Generation

Solar Power Station provides:
• Performance output: 10 Mvt
• Requires maintenance: 500 XP per session
• Renewable energy source for basic mining operations

⚠️ Important Notes

❌ Solar Power Station requires regular maintenance (500 XP per session)
❌ Performance may vary based on game mechanics
❌ Power generation assets are part of the game's energy infrastructure`,
      icon: '☀️',
      image: '/images/solar.png',
      shelf: 6,
      category: 'power-generation'
    },
    {
      id: 'wind',
      title: 'Wind Energy Station',
      description: 'Wind Power Generators. Price: 35,000 XP. Maintenance: 850 XP. Performance: 20 Mvt.',
      extendedDescription: `Wind Energy Station 💨

Wind Power Generators is a power generation facility in ECOS BTC Mining Game.

Key Information

💰 Price: 35,000 XP

⚙️ Maintenance: 850 XP

⚡ Performance: 20 Mvt

What is Wind Energy Station?

Wind Energy Station is a renewable energy facility that generates power using wind turbines. It offers moderate performance with reasonable maintenance costs.

Power Generation

Wind Energy Station provides:
• Performance output: 20 Mvt
• Requires maintenance: 850 XP per session
• Renewable energy source for mining operations

⚠️ Important Notes

❌ Wind Energy Station requires regular maintenance (850 XP per session)
❌ Performance may vary based on game mechanics
❌ Power generation assets are part of the game's energy infrastructure`,
      icon: '💨',
      image: '/images/wind.png',
      shelf: 6,
      category: 'power-generation'
    },
    {
      id: 'hydro',
      title: 'Hydro-power Plant',
      description: 'Hydro Power Plant. Price: 100,000 XP. Maintenance: 2,500 XP. Performance: 300 Mvt.',
      extendedDescription: `Hydro-power Plant 💧

Hydro Power Plant is a power generation facility in ECOS BTC Mining Game.

Key Information

💰 Price: 100,000 XP

⚙️ Maintenance: 2,500 XP

⚡ Performance: 300 Mvt

What is Hydro-power Plant?

Hydro-power Plant is a renewable energy facility that generates power for your mining operations. It offers high performance with moderate maintenance costs.

Power Generation

Hydro-power Plant provides:
• Performance output: 300 Mvt
• Requires maintenance: 2,500 XP per session
• Renewable energy source for sustainable mining operations

⚠️ Important Notes

❌ Hydro-power Plant requires regular maintenance (2,500 XP per session)
❌ Performance may vary based on game mechanics
❌ Power generation assets are part of the game's energy infrastructure`,
      icon: '💧',
      image: '/images/hydropower.png',
      shelf: 6,
      category: 'power-generation'
    },
    {
      id: 'nuclear',
      title: 'Nuclear Station',
      description: 'Nuclear Power Plant. Price: 35,000 XP. Maintenance: 7,500 XP. Performance: 640 Mvt.',
      extendedDescription: `Nuclear Station ☢️

Nuclear Power Plant is a power generation facility in ECOS BTC Mining Game.

Key Information

💰 Price: 35,000 XP

⚙️ Maintenance: 7,500 XP

⚡ Performance: 640 Mvt

What is Nuclear Station?

Nuclear Station is a high-performance power generation facility that produces energy for your mining operations. It offers one of the highest performance ratings among power generation assets in the game.

Power Generation

Nuclear Station provides:
• High performance output: 640 Mvt
• Requires maintenance: 7,500 XP per session
• Efficient power generation for large-scale mining operations

⚠️ Important Notes

❌ Nuclear Station requires regular maintenance (7,500 XP per session)
❌ Performance may vary based on game mechanics
❌ Power generation assets are part of the game's energy infrastructure`,
      icon: '☢️',
      image: '/images/nuclear.png',
      shelf: 6,
      category: 'power-generation'
    },
    // Полка 7
    {
      id: 'power-storage',
      title: 'Power Storage',
      description: 'Energy Battery — 4 levels. Store excess kWt for strategic use. Capacity ranges from 240,000 to 15,360,000 kWt.',
      extendedDescription: `Power Storage 🔋

Energy Battery is a storage facility for excess kWt (kilowatts) in ECOS BTC Mining Game. It allows you to store energy for strategic use during peak demand or when generation is low.

Key Information

📊 Number of levels: 4

💰 Level costs:
• Level 1: 10,000 XP
• Level 2: 25,000 XP
• Level 3: 50,000 XP
• Level 4: 100,000 XP

⚡ Capacity (kWt):
• Level 1: 240,000 kWt
• Level 2: 480,000 kWt
• Level 3: 7,200,000 kWt
• Level 4: 15,360,000 kWt

What is Power Storage?

Power Storage (Energy Battery) is a facility that allows you to store excess kWt energy. This stored energy can be used during peak demand periods or when your energy generation is low.

Power Storage Levels

Level 1:
• Cost: 10,000 XP
• Capacity: 240,000 kWt

Level 2:
• Cost: 25,000 XP
• Capacity: 480,000 kWt

Level 3:
• Cost: 50,000 XP
• Capacity: 7,200,000 kWt

Level 4:
• Cost: 100,000 XP
• Capacity: 15,360,000 kWt

How Power Storage Works

🔋 Storage Function:
• Store excess kWt when you have more than you need
• Use stored energy when demand exceeds generation
• Strategic energy management for optimal mining operations

💡 Strategic Use

Power Storage is valuable for:
• Storing excess energy from power generation facilities
• Managing energy during peak consumption periods
• Ensuring continuous mining operations during energy shortages
• Optimizing energy costs by buying kWt when prices are low

⚠️ Important Notes

❌ Power Storage requires XP investment to upgrade levels
❌ Higher levels provide significantly more storage capacity
❌ Stored energy does not expire or degrade over time
❌ Energy is consumed when used to power equipment

📝 FAQ

Q: How many Power Storage levels can I have?
A: Power Storage has 4 levels, each with increasing capacity and cost.

Q: Does stored energy expire?
A: No, stored kWt does not expire. However, it is consumed when used to power equipment.

Q: Can I upgrade Power Storage?
A: Yes, you can upgrade Power Storage from Level 1 to Level 4 by paying the upgrade cost.`,
      icon: '🔋',
      image: '/images/pstorage.png',
      shelf: 7,
      category: 'energy'
    },
    // Полка 8
    {
      id: 'office',
      title: 'Building / Office',
      description: 'Office — 3 levels. Provides statistics overview and referral program info. Level 3 grants 1,000 XP daily.',
      extendedDescription: `Building / Office 🏛️

Office is a building in ECOS BTC Mining Game that provides statistics, referral program information, and daily bonuses.

Key Information

📊 Number of levels: 3

💰 Upgrade costs:
• Level 2: 1,000,000 XP
• Level 3: 2,000,000 XP

What is Office?

Office is a management building that serves as your command center. It provides detailed statistics about your mining empire and access to referral program features.

Office Levels

Level 1:
• Base level (starting level)

Level 2:
• Upgrade cost: 1,000,000 XP
• Function: Opens modal window with statistics overview of everything the player owns
• Building appearance changes to reflect level

Level 3:
• Upgrade cost: 2,000,000 XP
• Function: More statistics available, shows referral program and player indicators
• Additional bonus: Provides 1,000 XP once per game day (24 hours)
• Building appearance changes to reflect level

Office Functions

📊 Statistics Overview (Level 2+):
• View all assets you own
• Track your mining progress
• Monitor your infrastructure

👥 Referral Program (Level 3):
• Access referral program information
• View player indicators
• Track referral performance

💰 Daily Bonus (Level 3):
• Receive 1,000 XP once per game day (24 hours)
• Automatic credit to your balance

Visual Display

On each level, the building appearance changes to reflect the current level.

⚠️ Important Notes

❌ Office upgrades require significant XP investment
❌ Level 3 provides daily bonus of 1,000 XP (once per 24 hours)
❌ Building appearance changes with each level upgrade
❌ Statistics and referral features unlock at higher levels

📝 FAQ

Q: How many levels does Office have?
A: Office has 3 levels. Level 1 is the base level, Level 2 and 3 require upgrades.

Q: What statistics are available in Office?
A: Level 2 provides overview of all assets you own. Level 3 adds referral program information and player indicators.

Q: How often can I receive the Level 3 bonus?
A: Level 3 provides 1,000 XP once per game day (24 hours).

Q: Can I see the referral program at Level 2?
A: No, referral program information is only available at Level 3.`,
      icon: '🏛️',
      image: '/images/office.png',
      shelf: 8,
      category: 'buildings'
    },
    {
      id: 'pool',
      title: 'Pool Building',
      description: 'Pool Building — one of the buildings in City. 5 levels with increasing hashrate ranges and bonus percentages.',
      extendedDescription: `Pool Building 🏊

Pool Building is one of the buildings in City in ECOS BTC Mining Game. It provides mining pool functionality with 5 different levels, each offering increasing hashrate capacity and bonus percentages.

Key Information

📊 Number of levels: 5

🏆 Bonus for players in pool:
• Level 1: 5%
• Level 2: 10%
• Level 3: 15%
• Level 4: 20%
• Level 5: 25%

👥 Number of farms in pool (without boosts):
• Level 1: 30
• Level 2: 50
• Level 3: 80
• Level 4: 100
• Level 5: 120

What is Pool Building?

Pool Building is a facility that allows players to join mining pools, combining their hashrate with other players to increase mining efficiency and earn bonus rewards.

Pool Levels

Level 1 - Local Pool:
• Hashrate Range: 0 – 1,000,000 Th/s
• Bonus: 5%
• Participants: 30 farms

Level 2 - Regional Pool:
• Hashrate Range: 1,000,000 – 100,000,000 Th/s
• Bonus: 10%
• Participants: 50 farms

Level 3 - International Pool:
• Hashrate Range: 100,000,000 – 1,000,000,000 Th/s
• Bonus: 15%
• Participants: 80 farms

Level 4 - Continental Pool:
• Hashrate Range: 1,000,000,000 – 3,000,000,000 Th/s
• Bonus: 20%
• Participants: 100 farms

Level 5 - Global Pool:
• Hashrate Range: 3,000,000,000 Th/s and above
• Bonus: 25%
• Participants: 120 farms

How Pool Building Works

🔗 Pool Functionality:
• Join or create mining pools based on your hashrate
• Combine hashrate with other players
• Earn bonus percentage on mining rewards
• Building appearance changes with each level

📈 Progression:
• As your hashrate increases, you can join higher-level pools
• Higher-level pools offer greater bonus percentages
• More participants allowed in higher-level pools

Visual Display

The building appearance changes with each level transition, reflecting the pool's tier and capabilities.

⚠️ Important Notes

❌ Pool Building is located in City
❌ Building appearance changes with level upgrades
❌ Pool functionality expands with each level
❌ Bonus percentages apply to mining rewards
❌ Participant limits are without boosts

📝 FAQ

Q: How many pool levels are there?
A: Pool Building has 5 levels: Local, Regional, International, Continental, and Global.

Q: What bonus do I get from joining a pool?
A: Bonus ranges from 5% (Level 1) to 25% (Level 5), depending on the pool level.

Q: How many players can join a pool?
A: Participant limits range from 30 (Level 1) to 120 (Level 5) farms, without boosts.

Q: Does the building appearance change?
A: Yes, the building appearance changes with each level transition.`,
      icon: '🏊',
      image: '/images/pool.png',
      shelf: 8,
      category: 'buildings'
    },
    {
      id: 'hotel',
      title: 'Hotel',
      description: 'Hotel — A building in the game that provides various services and benefits to players.',
      icon: '🏨',
      image: '/images/hotel.png',
      shelf: 8,
      category: 'buildings'
    },
    // Полка 9
    {
      id: 'airport',
      title: 'Airport',
      description: 'Airport — referral system object. Requires at least one airplane to activate. Visit referrals and collect kWt and XP.',
      extendedDescription: `Airport ✈️

Airport is an object for the referral system in ECOS BTC Mining Game. To activate the airport, a player must purchase at least one airplane.

Key Information

✈️ Number of airplanes: 5

💰 Airplane costs:
1. 2,000,000 XP
2. 3,500,000 XP
3. 4,000,000 XP
4. 50,000,000 XP
5. 100,000,000 XP

What is Airport?

Airport is a referral system facility that allows you to visit your referrals and collect resources from their maps. Each airplane you purchase unlocks different visiting capabilities and bonus features.

Airplane Functions

Visit Capacity (per 24 hours):
1. Visit 1 referral per 24 hours (1 game day)
2. Visit 2 referrals per 24 hours
3. Visit 3 referrals per 24 hours
4. Visit 5 referrals per 24 hours
5. Visit 30 referrals per 24 hours

Additional Functions

1. Collect kWt and XP on referral's map
2. Collect kWt and XP on referral's map
3. Collect kWt and XP on referral's map + Share 5,000 XP with each visited referral
4. Collect kWt and XP on referral's map + Share 10,000 XP with each visited referral
5. Collect kWt and XP on referral's map + Share 30,000 XP with each visited referral

Benefits for Visited Referrals

When you visit a referral:
• The visited referral receives kWt in equal amount to what you collected
• Example: If you collected 12 kWt, the referral also receives 12 kWt

Visual Display

When a player owns airplanes, they are displayed at the airport on the map.

⚠️ Important Notes

❌ Airport requires at least one airplane purchase to activate
❌ Airplane costs range from 2,000,000 to 100,000,000 XP
❌ Visiting capacity depends on airplane level
❌ Higher-level airplanes provide more visiting slots and sharing capabilities

📝 FAQ

Q: How many airplanes can I own?
A: There are 5 different airplanes available, each with different costs and capabilities.

Q: Do I need to buy all 5 airplanes?
A: No, you only need to purchase at least one airplane to activate the airport.

Q: Can I visit the same referral multiple times?
A: Visit capacity is per 24 hours (1 game day), so you can visit referrals once per day based on your airplane's capacity.

Q: What happens when I share XP with referrals?
A: Higher-level airplanes allow you to share XP (5,000, 10,000, or 30,000) with each visited referral as a bonus.`,
      icon: '✈️',
      image: '/images/airport.png',
      shelf: 9,
      category: 'buildings'
    },
    {
      id: 'ref-light',
      title: 'Ref light',
      description: 'Ref light — A lighting system or reference point in the game environment.',
      icon: '💡',
      image: '/images/reflight.png',
      shelf: 9,
      category: 'special'
    },
    // Полка 10
    {
      id: 'airship',
      title: 'Airship',
      description: 'Airship — A flying vehicle in the game that provides unique transportation and gameplay features.',
      icon: '🚁',
      image: '/images/airship.png',
      shelf: 10,
      category: 'transportation'
    },
    {
      id: 'banner',
      title: 'Banner',
      description: 'Advert Place — banner on city map. Displays real-world product ads. Clicking redirects to product via TMA ECOS.',
      extendedDescription: `Advert Banner 🚩

Advert Place is a banner on the city map in ECOS BTC Mining Game that displays advertising related to real-world products from the company.

Key Information

📍 Location: On the city map

🎯 Function: Display advertising for real-world products

🔗 Click Action: Redirects to product via TMA ECOS

What is Advert Banner?

Advert Banner (Advert Place) is a promotional element on the city map that displays advertising related to real-world products from ECOS company. When players click on the banner, they are offered to navigate to a link.

Banner Functions

📢 Advertising Display:
• Display any advertising related to real-world products from the company
• Showcase company products and services
• Promote real-world ECOS products

🔗 Product Links:
• When clicking on the banner, player is offered to navigate to a link
• Links lead to real-world products
• Early game stages feature banner advertising real ASIC S21 Pro

Early Game Implementation

On early game stages, the banner displays:
• Advertisement for real ASIC S21 Pro
• Link leads to product through TMA ECOS launch
• User deep-links to product card via TMA ECOS

⚠️ Important Notes

❌ Banner displays real-world product advertisements
❌ Clicking banner redirects to product links
❌ Early implementation features ASIC S21 Pro advertisement
❌ Links use TMA ECOS for product navigation

📝 FAQ

Q: What does the Advert Banner display?
A: The banner displays advertising related to real-world products from ECOS company.

Q: What happens when I click the banner?
A: When you click the banner, you are offered to navigate to a link that leads to the advertised product.

Q: What product is advertised in early game stages?
A: Early game stages feature a banner advertising real ASIC S21 Pro, with a link leading to the product through TMA ECOS.`,
      icon: '🚩',
      image: '/images/banner.png',
      shelf: 10,
      category: 'special'
    },
    // Полка 11
    {
      id: 'parking',
      title: 'Parking',
      description: 'Parking — 3 levels. Installation: 100,000 XP. Collects additional bonus XP (similar to Daily Check-in).',
      extendedDescription: `Parking 🅿️

Parking is a facility in ECOS BTC Mining Game that provides a place for collecting additional bonus XP, similar to Daily Check-in functionality.

Key Information

📊 Number of levels: 3

💰 Installation cost: 100,000 XP

🎁 Function: Place for collecting additional bonus XP (similar to Daily Check-in)

What is Parking?

Parking is a special facility that allows players to collect additional bonus XP on a regular basis. It functions similarly to a Daily Check-in system, providing players with extra rewards.

Parking Functions

🎁 Bonus XP Collection:
• Collect additional bonus XP
• Similar to Daily Check-in functionality
• Regular reward collection point

📊 Levels:
• Parking has 3 levels
• Each level may provide different benefits or capacities

⚠️ Important Notes

❌ Parking requires installation cost of 100,000 XP
❌ Functions similarly to Daily Check-in
❌ Provides additional bonus XP collection
❌ Has 3 levels with potential different benefits

📝 FAQ

Q: How many levels does Parking have?
A: Parking has 3 levels.

Q: What is the installation cost?
A: Parking installation costs 100,000 XP.

Q: How does Parking work?
A: Parking provides a place for collecting additional bonus XP, similar to Daily Check-in functionality.`,
      icon: '🅿️',
      image: '/images/parking.png',
      shelf: 11,
      category: 'special'
    },
    {
      id: 'yachts',
      title: 'Yachts',
      description: 'Yachts — purchasable object for ambassador program. Generates bonus XP and controls events.',
      extendedDescription: `Yachts 🛥️

Yachts (Ambassador Event Place) in ECOS BTC Mining Game are not fully developed and relate to the ambassador program.

Key Information

💰 Purchasable object

🎁 Generates bonus XP

🎮 Controls events and ambassador assignments

What are Yachts?

Yachts are special objects in the game that are part of the ambassador program. They serve multiple functions related to events and ambassador activities.

Yacht Functions

💰 Purchasable Object:
• Yacht will be a purchasable object in the game
• Players can acquire yachts as part of ambassador program

🎁 Bonus XP Generation:
• Yachts generate their own bonus XP
• Provides additional income source

🎮 Event Control:
• Serves as a means of control for events
• Manages some ambassador assignments

⚠️ Important Notes

🚧 Early Stage Notice:
Yachts in the game are not fully developed yet and are still being worked on. They relate to the ambassador program and will have expanded functionality in future updates.

📝 FAQ

Q: Are yachts fully functional?
A: Yachts are not fully developed yet and are still being worked on as part of the ambassador program.

Q: What do yachts do?
A: Yachts will be purchasable objects that generate bonus XP and serve as a means of control for events and ambassador assignments.

Q: When will yachts be fully available?
A: Yacht functionality will be expanded in future game updates.`,
      icon: '🛥️',
      image: '/images/yachts.png',
      shelf: 11,
      category: 'special'
    }
  ]

  // Фильтрация и сортировка
  const filteredAndSortedAssets = useMemo(() => {
    let filtered = assets.filter(asset => {
      const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           asset.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    if (sortBy === 'shelf') {
      filtered.sort((a, b) => a.shelf - b.shelf)
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'category') {
      filtered.sort((a, b) => a.category.localeCompare(b.category))
    }

    return filtered
  }, [searchQuery, selectedCategory, sortBy])

  // Группировка по полкам
  const assetsByShelf = useMemo(() => {
    const grouped = {}
    filteredAndSortedAssets.forEach(asset => {
      if (!grouped[asset.shelf]) {
        grouped[asset.shelf] = []
      }
      grouped[asset.shelf].push(asset)
    })
    return grouped
  }, [filteredAndSortedAssets])

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'currency', label: 'Currency' },
    { value: 'energy', label: 'Energy' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'power-generation', label: 'Power Generation' },
    { value: 'buildings', label: 'Buildings' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'special', label: 'Special' }
  ]

  return (
    <section className="assets-section section" id="assets">
      <div className="container">
        <h2 className="section-title" data-heading="Assets">Assets</h2>
        
        {/* Фильтры */}
        <div className="assets-filters">
          <div className="assets-search">
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="assets-search-input"
            />
          </div>
          <div className="assets-filter-controls">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="assets-filter-select"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="assets-filter-select"
            >
              <option value="shelf">Sort by Shelf</option>
              <option value="name">Sort by Name</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>
        </div>

        {/* Модальное окно с увеличенной карточкой */}
        {expandedCard && (() => {
          const currentAsset = assets.find(asset => asset.id === expandedCard)
          return currentAsset ? (
            <div 
              className="assets-expanded-overlay"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                cursor: 'pointer'
              }}
              onClick={() => setExpandedCard(null)}
            >
              <div 
                className="assets-expanded-card feature-card"
                style={{
                  display: 'flex',
                  gap: '2rem',
                  maxWidth: '900px',
                  width: '100%',
                  backgroundColor: 'var(--box-color)',
                  borderRadius: '1rem',
                  padding: '2rem',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'visible'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="glow"></span>
                {/* Изображение слева */}
                <div style={{
                  width: '350px',
                  height: '500px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  borderRadius: '0.5rem',
                  padding: '0.5rem'
                }}>
                  {currentAsset.image ? (
                    <img 
                      src={currentAsset.image} 
                      alt={currentAsset.title}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: '8rem' }}>{currentAsset.icon}</span>
                  )}
                </div>
                {/* Текст справа */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  height: '500px',
                  overflow: 'hidden'
                }}>
                  <h3 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'var(--title-color)',
                    margin: 0,
                    flexShrink: 0
                  }}>
                    {currentAsset.title}
                  </h3>
                  <div 
                    className="assets-modal-scrollable"
                    style={{
                      flex: 1,
                      overflowY: 'auto',
                      overflowX: 'hidden',
                      paddingRight: '0.5rem',
                      marginRight: '-0.5rem'
                    }}>
                    <div style={{
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      color: 'var(--text-color)',
                      whiteSpace: 'pre-line'
                    }}>
                      {currentAsset.extendedDescription || currentAsset.description}
                    </div>
                  </div>
                </div>
                {/* Кнопка Close в правом нижнем углу */}
                <button
                  type="button"
                  className="glass-button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('Close button clicked, closing modal')
                    setExpandedCard(null)
                  }}
                  style={{
                    position: 'absolute',
                    bottom: '1.5rem',
                    right: '1.5rem',
                    padding: '0.75rem 1.5rem',
                    width: 'auto',
                    height: 'auto',
                    minWidth: '120px',
                    zIndex: 10001
                  }}
                >
                  <span>Close</span>
                </button>
              </div>
            </div>
          ) : null
        })()}

        {/* Карточки, сгруппированные по полкам */}
        <div 
          className="assets-shelves"
          style={{
            opacity: expandedCard ? 0.3 : 1,
            transition: 'opacity 0.3s ease',
            pointerEvents: expandedCard ? 'none' : 'auto'
          }}
        >
          {Object.keys(assetsByShelf).sort((a, b) => Number(a) - Number(b)).map(shelfNum => (
            <div key={shelfNum} className="assets-shelf">
              <div className="assets-cards-grid">
                {assetsByShelf[shelfNum].map(asset => (
                  <div 
                    key={asset.id} 
                    className={`asset-card feature-card ${expandedCard === asset.id ? 'expanded' : ''}`}
                    onClick={() => setExpandedCard(asset.id)}
                    style={{
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease',
                      transform: expandedCard === asset.id ? 'scale(0.95)' : 'scale(1)'
                    }}
                  >
                    <span className="glow"></span>
                    <div className="asset-card-icon">
                      {asset.image ? (
                        <img 
                          src={asset.image} 
                          alt={asset.title} 
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                          }}
                        />
                      ) : (
                        <span className="asset-icon-emoji">{asset.icon}</span>
                      )}
                    </div>
                    <h3 className="asset-card-title">{asset.title}</h3>
                    <p className="asset-card-description">{asset.description}</p>
                    <button 
                      className="glass-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedCard(asset.id)
                      }}
                      style={{
                        position: 'absolute',
                        bottom: '1rem',
                        right: '1rem',
                        width: '80px',
                        height: '40px',
                        borderRadius: '999px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.03) 100%)',
                        backdropFilter: 'blur(10px)',
                        cursor: 'pointer',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        zIndex: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)'
                        e.target.style.borderColor = 'rgba(255, 111, 0, 0.5)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)'
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      <span style={{
                        fontFamily: '"Orbitron", sans-serif',
                        color: 'var(--title-color)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                      }}>View</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* SVG фильтр для glass эффекта */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <filter
            id="glass"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            primitiveUnits="objectBoundingBox"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.02" result="blur" />
          </filter>
        </svg>
      </div>
    </section>
  )
}

export default Assets
