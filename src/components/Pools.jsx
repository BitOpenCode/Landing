import { useState, useEffect, useMemo } from 'react'
import { useGlowEffect } from '../hooks/useGlowEffect'

const Pools = () => {
  useGlowEffect()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('level')
  const [expandedCard, setExpandedCard] = useState(null)
  const [calculatorInput, setCalculatorInput] = useState({ 
    th: 234, 
    level: 1, 
    asicCount: 1,
    poolFee: 1 
  })
  const [btcPrice, setBtcPrice] = useState(null)
  const [btcPriceLoading, setBtcPriceLoading] = useState(true)
  const [manualThInput, setManualThInput] = useState(false)
  const [topPools, setTopPools] = useState([])
  const [topPoolsLoading, setTopPoolsLoading] = useState(true)

  // Отслеживание изменений topPools для отладки
  useEffect(() => {
    console.log('🔄 State topPools изменился:', topPools.length, 'пулов')
    topPools.forEach((pool, idx) => {
      console.log(`  Пул ${idx + 1}: ${pool.name} (ID: ${pool.id})`)
    })
  }, [topPools])

  // Блокировка скролла при открытии модального окна
  useEffect(() => {
    if (expandedCard) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      
      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [expandedCard])

  // Автоматическое обновление хешрейта при изменении количества ASIC (только если не было ручного ввода)
  useEffect(() => {
    if (!manualThInput) {
      const thPerAsic = 234
      const calculatedTh = calculatorInput.asicCount * thPerAsic
      if (calculatorInput.th !== calculatedTh) {
        setCalculatorInput(prev => ({
          ...prev,
          th: calculatedTh
        }))
      }
    }
  }, [calculatorInput.asicCount, manualThInput])

  // Получение реального курса BTC через CoinGecko API
  useEffect(() => {
    const fetchBtcPrice = async () => {
      try {
        setBtcPriceLoading(true)
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
        const data = await response.json()
        if (data.bitcoin && data.bitcoin.usd) {
          setBtcPrice(data.bitcoin.usd)
        }
      } catch (error) {
        console.error('Ошибка при получении курса BTC:', error)
      } finally {
        setBtcPriceLoading(false)
      }
    }

    fetchBtcPrice()
    // Обновляем курс каждые 60 секунд
    const interval = setInterval(fetchBtcPrice, 60000)

    return () => clearInterval(interval)
  }, [])

  // Получение данных о топ пулах через вебхук
  useEffect(() => {
    const fetchTopPools = async () => {
      try {
        setTopPoolsLoading(true)
        const response = await fetch('https://n8n-p.blc.am/webhook/game-pools')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        // Получаем ответ как текст для полного контроля
        const text = await response.text()
        console.log('📥 Raw response (первые 2000 символов):', text.substring(0, 2000))
        console.log('📏 Длина ответа:', text.length, 'символов')
        console.log('📏 Начинается с "[":', text.trim().startsWith('['))
        console.log('📏 Начинается с "{":', text.trim().startsWith('{'))
        
        let data
        try {
          data = JSON.parse(text)
        } catch (parseError) {
          console.error('❌ Ошибка парсинга JSON:', parseError)
          console.error('Полный текст:', text)
          throw parseError
        }
        
        console.log('📦 Parsed data:', data)
        console.log('📦 Тип данных:', typeof data, 'Является массивом:', Array.isArray(data))
        
        // Обработка формата ответа от n8n
        // Когда тестируете напрямую - получаете массив
        // Когда через браузер - может приходить один объект
        let poolsArray = []
        
        if (Array.isArray(data)) {
          // Это массив - отлично!
          if (data.length > 0 && data[0].json) {
            // Формат: [{ json: {...} }, { json: {...} }]
            poolsArray = data.map(item => item.json)
            console.log('✅ Обработан массив с полем json, количество пулов:', poolsArray.length)
          } else {
            // Формат: [{...}, {...}] - уже развернутый массив
            poolsArray = data
            console.log('✅ Получен готовый массив пулов, количество:', poolsArray.length)
          }
        } else if (data && typeof data === 'object' && !Array.isArray(data)) {
          // Это объект - проверяем, есть ли в нем массив pools
          if (data.pools && Array.isArray(data.pools)) {
            // Формат: { pools: [{...}, {...}] }
            poolsArray = data.pools
            console.log('✅ Найден массив в data.pools, количество пулов:', poolsArray.length)
          } else if (data.json && data.json.pools && Array.isArray(data.json.pools)) {
            // Формат: { json: { pools: [{...}, {...}] } }
            poolsArray = data.json.pools
            console.log('✅ Найден массив в data.json.pools, количество пулов:', poolsArray.length)
          } else {
            // Это просто один объект пула (старый формат)
            poolsArray = [data]
            console.log('⚠️ Получен один объект пула, обернут в массив')
            console.log('⚠️ Обновите Code ноду в n8n, чтобы возвращать { pools: [...] }')
          }
        } else {
          console.error('❌ Неожиданный формат данных:', data)
        }
        
        console.log('📊 Итого пулов для отображения:', poolsArray.length)
        poolsArray.forEach((p, i) => {
          console.log(`  ${i + 1}. ${p.name} (ID: ${p.id}, Hashrate: ${p.total_hashrate}, Level: ${p.lvl})`)
        })
        
        if (poolsArray.length > 0) {
          // Данные уже обработаны в n8n (отфильтрованы, отсортированы, топ-3)
          setTopPools(poolsArray)
          console.log('✅ Установлено в state:', poolsArray.length, 'пулов')
        } else {
          console.warn('⚠️ Данные о пулах пусты')
          setTopPools([])
        }
      } catch (error) {
        console.error('❌ Ошибка при получении данных о пулах:', error)
        setTopPools([])
      } finally {
        setTopPoolsLoading(false)
      }
    }

    // Загружаем данные только при монтировании компонента (перезагрузка страницы)
    fetchTopPools()
  }, [])

  // Данные о пулах - организованы по категориям
  const poolsData = [
    // Уровни пулов
    {
      id: 'level1',
      title: 'Level 1 - Local Pool',
      category: 'levels',
      shelf: 1,
      icon: '🏠',
      description: 'Entry-level pool for beginners. Start your mining journey with a local community of miners.',
      details: {
        powerRange: '0 – 1,000,000 Th/s',
        bonus: '+5%',
        farmsBase: '30',
        farmsBoosted: '60',
        boostCards: '3 cards × 10 people',
        fee: '1% (fixed)',
        additionalIncome: '+0.000000024 xpBTC per 1 TH'
      },
      features: [
        'Perfect for new miners',
        'Fixed 1% fee - no surprises',
        'Up to 30 farms without boost',
        'Can expand to 60 farms with boost cards'
      ]
    },
    {
      id: 'level2',
      title: 'Level 2 - Regional Pool',
      category: 'levels',
      shelf: 1,
      icon: '🌍',
      description: 'Regional pool connecting miners across a wider area. Increased capacity and adjustable fees.',
      details: {
        powerRange: '1,000,000 – 100,000,000 Th/s',
        bonus: '+10%',
        farmsBase: '50',
        farmsBoosted: '100',
        boostCards: '5 cards × 10 people',
        fee: '0-3% (adjustable)',
        additionalIncome: '+0.000000048 xpBTC per 1 TH'
      },
      features: [
        'Double bonus compared to Level 1',
        'Owner can adjust fee (0-3%)',
        'Up to 50 farms base capacity',
        'Can expand to 100 farms with boost'
      ]
    },
    {
      id: 'level3',
      title: 'Level 3 - International Pool',
      category: 'levels',
      shelf: 1,
      icon: '🌐',
      description: 'International pool connecting miners globally. Higher bonuses and more flexibility.',
      details: {
        powerRange: '100,000,000 – 1,000,000,000 Th/s',
        bonus: '+15%',
        farmsBase: '80',
        farmsBoosted: '160',
        boostCards: '8 cards × 10 people',
        fee: '0-10% (adjustable)',
        additionalIncome: '+0.000000072 xpBTC per 1 TH'
      },
      features: [
        'Triple bonus from base income',
        'Wide fee range (0-10%)',
        'Up to 80 farms base capacity',
        'Can expand to 160 farms with boost'
      ]
    },
    {
      id: 'level4',
      title: 'Level 4 - Continental Pool',
      category: 'levels',
      shelf: 1,
      icon: '🌎',
      description: 'Continental pool with massive capacity. Premium bonuses and extensive control options.',
      details: {
        powerRange: '1,000,000,000 – 3,000,000,000 Th/s',
        bonus: '+20%',
        farmsBase: '100',
        farmsBoosted: '200',
        boostCards: '10 cards × 10 people',
        fee: '0-15% (adjustable)',
        additionalIncome: '+0.000000096 xpBTC per 1 TH'
      },
      features: [
        'Quadruple bonus from base',
        'Fee range up to 15%',
        'Up to 100 farms base capacity',
        'Can expand to 200 farms with boost'
      ]
    },
    {
      id: 'level5',
      title: 'Level 5 - Global Pool',
      category: 'levels',
      shelf: 1,
      icon: '🚀',
      description: 'The ultimate pool level. Maximum bonuses, capacity, and control for elite miners.',
      details: {
        powerRange: '3,000,000,000+ Th/s',
        bonus: '+25%',
        farmsBase: '120',
        farmsBoosted: '240',
        boostCards: '12 cards × 10 people',
        fee: '0-20% (adjustable)',
        additionalIncome: '+0.00000012 xpBTC per 1 TH'
      },
      features: [
        'Maximum 25% bonus',
        'Highest fee range (0-20%)',
        'Up to 120 farms base capacity',
        'Can expand to 240 farms with boost'
      ]
    },
    // Создание пула
    {
      id: 'pool-creation',
      title: 'Pool Creation',
      category: 'creation',
      shelf: 2,
      icon: '💰',
      description: 'Create your own mining pool for 500,000 XP. Choose name, set entry requirements, and start building your community.',
      details: {
        cost: '500,000 XP',
        requirements: 'Choose pool name and minimum entry level',
        process: 'XP deducted upon confirmation'
      },
      features: [
        'One-time cost: 500,000 XP',
        'Custom pool name',
        'Set minimum entry level',
        'Full ownership and control'
      ]
    },
    {
      id: 'leveling-logic',
      title: 'Leveling Logic',
      category: 'creation',
      shelf: 2,
      icon: '📊',
      description: 'Understanding how pools level up. 1000 Th = 1 Ph. Level 2 requires 1,000 PH. No rollback - once leveled, always leveled.',
      details: {
        conversion: '1000 Th = 1 Ph',
        level2Requirement: '1,000,000 TH (1,000 PH)',
        noRollback: 'Pool level never decreases',
        example: 'Pool at 1001 PH (Level 2) → 5 members leave (500 PH) → Still Level 2'
      },
      features: [
        'Simple conversion: 1000 Th = 1 Ph',
        'Level 2 requires 1,000 PH',
        'No level rollback protection',
        'Level persists even if power drops'
      ]
    },
    {
      id: 'pool-features',
      title: 'Pool Features & Controls',
      category: 'creation',
      shelf: 2,
      icon: '⚙️',
      description: 'Comprehensive control options for pool owners. Adjust fees, change settings, and manage your pool effectively.',
      details: {
        level1Fee: 'Fixed 1% fee',
        level2PlusFee: 'Owner can adjust fee (0-3% to 0-20%)',
        ownerControls: 'Change name, entry level, fee',
        strategy: 'Low fee + high Luck = more members'
      },
      features: [
        'Level 1: Fixed 1% fee',
        'Level 2+: Adjustable fee range',
        'Change pool name anytime',
        'Modify entry requirements'
      ]
    },
    // Функции владельца
    {
      id: 'boost-pool',
      title: 'Boost Pool Capacity',
      category: 'owner',
      shelf: 3,
      icon: '🚀',
      description: 'Increase your pool\'s member capacity by purchasing boost cards. More capacity = more members = more power.',
      details: {
        level1: '3 cards × 10 people',
        level2: '5 cards × 10 people',
        level3: '8 cards × 10 people',
        level4: '10 cards × 10 people',
        level5: '12 cards × 10 people'
      },
      features: [
        'Double your pool capacity',
        'Purchase boost cards in pool shop',
        'Each card adds 10 member slots',
        'More cards available at higher levels'
      ]
    },
    {
      id: 'gift-pool',
      title: 'Gift Your Pool',
      category: 'owner',
      shelf: 3,
      icon: '🎁',
      description: 'Reward your pool members by distributing XP gifts. Set timer and amount for equal distribution among all members.',
      details: {
        timer: 'Set distribution timer',
        amount: 'Specify XP amount',
        distribution: 'Equal split among all members',
        interface: 'Modal window interface'
      },
      features: [
        'Set custom timer',
        'Choose XP amount',
        'Equal distribution',
        'Easy modal interface'
      ]
    },
    {
      id: 'pool-control',
      title: 'Pool Control Panel',
      category: 'owner',
      shelf: 3,
      icon: '⚙️',
      description: 'Full control over your pool settings. Adjust commission, change name, modify entry requirements.',
      details: {
        commission: 'Set fee for members',
        name: 'Change pool name',
        entry: 'Change minimum entry level',
        interface: 'Modal window interface'
      },
      features: [
        'Adjust commission fee',
        'Change pool name',
        'Modify entry requirements',
        'User-friendly modal interface'
      ]
    },
    {
      id: 'my-members',
      title: 'My Members',
      category: 'owner',
      shelf: 3,
      icon: '👥',
      description: 'View and manage all pool members. See member details, hashrate share, and manage membership.',
      details: {
        memberInfo: 'Name, level, hashrate share %, total Th',
        kickUser: 'Remove members if needed',
        placeholder: 'Placeholder for member images'
      },
      features: [
        'View all pool members',
        'Member name and level',
        'Hashrate share percentage',
        'Kick user functionality'
      ]
    },
    // Лидерборд и фильтры
    {
      id: 'pool-filters',
      title: 'Pool Leaderboard Filters',
      category: 'leaderboard',
      shelf: 4,
      icon: '🔍',
      description: 'Advanced filtering system to find the perfect pool. Filter by rating, power, fee, luck bonus, and members.',
      details: {
        rating: '1-5 stars (based on pool level)',
        power: 'Filter by PH in pool',
        fee: 'Filter by commission',
        luck: 'Filter by % bonuses',
        members: 'Filter by participants count'
      },
      features: [
        'Rating: 1-5 stars',
        'Power filtering',
        'Fee range filtering',
        'Luck bonus filtering',
        'Member count filtering'
      ]
    },
    {
      id: 'pool-card-info',
      title: 'Pool Card Information',
      category: 'leaderboard',
      shelf: 4,
      icon: '📋',
      description: 'Comprehensive pool information displayed on each card. See ranking, members, power, luck, fee, and bonus.',
      details: {
        ranking: 'Position (#2)',
        avatar: 'Telegram account avatar',
        members: '17/50 (occupied/total slots)',
        power: 'PH indicator',
        luck: 'Income indicator with Bonus',
        fee: 'Commission indicator',
        bonus: 'Pool profitability indicator'
      },
      features: [
        'Ranking position',
        'Member count display',
        'Power (PH) indicator',
        'Luck and bonus info',
        'Fee display'
      ]
    },
    {
      id: 'detailed-pool-view',
      title: 'Detailed Pool View',
      category: 'leaderboard',
      shelf: 4,
      icon: '📊',
      description: 'In-depth pool analytics with progress bars, charts, and detailed statistics. Track performance over time.',
      details: {
        progressBar: 'Power progress to next level',
        bonusIncome: 'Bonus income indicator',
        chart: 'Luck, Fee, Hashrate indicators',
        timePeriods: '1 day, 1 week, 1 month',
        movingAverage: 'Moving Average for each point',
        shareButton: 'Share Pool Chart',
        xpDistribution: 'XP distribution indicator'
      },
      features: [
        'Progress bar to next level',
        'Bonus income display',
        'Interactive charts',
        'Multiple time periods',
        'Share functionality'
      ]
    },
    // Доходность
    {
      id: 'base-income',
      title: 'Base Income',
      category: 'income',
      shelf: 5,
      icon: '💰',
      description: 'The foundation of all mining income. Base rate of 0.00000048 xpBTC per 1 TH before any bonuses.',
      details: {
        rate: '0.00000048 xpBTC per 1 TH',
        calculation: 'Base profit in game',
        appliesTo: 'All pool levels'
      },
      features: [
        'Standard base rate',
        'Applies to all pools',
        'Foundation for bonuses',
        'Consistent across game'
      ]
    },
    {
      id: 'bonus-level1',
      title: 'Level 1 Bonus (+5%)',
      category: 'income',
      shelf: 5,
      icon: '📈',
      description: 'Level 1 pools provide a 5% bonus on top of base income. Additional 0.000000024 xpBTC per 1 TH.',
      details: {
        bonus: '+5%',
        additionalIncome: '+0.000000024 xpBTC per 1 TH',
        calculation: '0.00000048 × 5% = 0.000000024'
      },
      features: [
        '5% bonus multiplier',
        'Small but consistent',
        'Perfect for beginners',
        'Fixed fee structure'
      ]
    },
    {
      id: 'bonus-level2',
      title: 'Level 2 Bonus (+10%)',
      category: 'income',
      shelf: 5,
      icon: '📈',
      description: 'Level 2 pools double the bonus to 10%. Additional 0.000000048 xpBTC per 1 TH with adjustable fees.',
      details: {
        bonus: '+10%',
        additionalIncome: '+0.000000048 xpBTC per 1 TH',
        calculation: '0.00000048 × 10% = 0.000000048'
      },
      features: [
        'Double bonus from Level 1',
        'Adjustable fee (0-3%)',
        'Better capacity',
        'More flexibility'
      ]
    },
    {
      id: 'bonus-level3',
      title: 'Level 3 Bonus (+15%)',
      category: 'income',
      shelf: 5,
      icon: '📈',
      description: 'Level 3 pools offer 15% bonus. Additional 0.000000072 xpBTC per 1 TH with international reach.',
      details: {
        bonus: '+15%',
        additionalIncome: '+0.000000072 xpBTC per 1 TH',
        calculation: '0.00000048 × 15% = 0.000000072'
      },
      features: [
        'Triple bonus from base',
        'Wide fee range (0-10%)',
        'International scale',
        'High capacity'
      ]
    },
    {
      id: 'bonus-level4',
      title: 'Level 4 Bonus (+20%)',
      category: 'income',
      shelf: 5,
      icon: '📈',
      description: 'Level 4 pools provide 20% bonus. Additional 0.000000096 xpBTC per 1 TH with continental scale.',
      details: {
        bonus: '+20%',
        additionalIncome: '+0.000000096 xpBTC per 1 TH',
        calculation: '0.00000048 × 20% = 0.000000096'
      },
      features: [
        'Quadruple bonus from base',
        'Fee range up to 15%',
        'Continental scale',
        'Premium features'
      ]
    },
    {
      id: 'bonus-level5',
      title: 'Level 5 Bonus (+25%)',
      category: 'income',
      shelf: 5,
      icon: '📈',
      description: 'Level 5 pools offer maximum 25% bonus. Additional 0.00000012 xpBTC per 1 TH - the ultimate mining experience.',
      details: {
        bonus: '+25%',
        additionalIncome: '+0.00000012 xpBTC per 1 TH',
        calculation: '0.00000048 × 25% = 0.00000012'
      },
      features: [
        'Maximum 25% bonus',
        'Highest fee range (0-20%)',
        'Global scale',
        'Elite tier features'
      ]
    },
    // Навигация
    {
      id: 'access-points',
      title: 'Access Points',
      category: 'navigation',
      shelf: 6,
      icon: '🔗',
      description: 'Multiple ways to access pools. From main screen, statistics, or leaderboard with filters.',
      details: {
        poolsScreen: 'Button "Pools" on Pools screen',
        statScreen: 'Bottom nav → "Stat" → Filter "Pools"',
        leaderboard: 'Leaderboard screen with filters'
      },
      features: [
        'Main Pools button',
        'Statistics screen access',
        'Leaderboard integration',
        'Multiple entry points'
      ]
    },
    {
      id: 'share-pool',
      title: 'Share Pool Chart',
      category: 'navigation',
      shelf: 6,
      icon: '📤',
      description: 'Share pool charts with indicators and deep links. Members and users can share via chat, groups, or social networks.',
      details: {
        whoCanShare: 'Pool members or random users',
        shareOptions: 'Chat, group, social network, contact',
        content: 'Chart with indicators + deep link',
        recipientAction: 'Click deep link to navigate to pool'
      },
      features: [
        'Share pool charts',
        'Multiple sharing options',
        'Deep link integration',
        'Easy navigation for recipients'
      ]
    }
  ]

  // Категории для фильтрации
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'levels', label: 'Pool Levels' },
    { value: 'creation', label: 'Pool Creation' },
    { value: 'owner', label: 'Owner Features' },
    { value: 'leaderboard', label: 'Leaderboard' },
    { value: 'income', label: 'Income & Bonuses' },
    { value: 'navigation', label: 'Navigation' }
  ]

  // Фильтрация и сортировка
  const filteredAndSortedPools = useMemo(() => {
    let filtered = poolsData.filter(pool => {
      const matchesSearch = pool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pool.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      if (selectedCategory === 'all') {
        return matchesSearch
      }
      
      return matchesSearch && pool.category === selectedCategory
    })

    // Сортировка
    if (sortBy === 'level') {
      filtered.sort((a, b) => {
        if (a.shelf !== b.shelf) return a.shelf - b.shelf
        return a.title.localeCompare(b.title)
      })
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'category') {
      filtered.sort((a, b) => {
        if (a.category !== b.category) return a.category.localeCompare(b.category)
        return a.title.localeCompare(b.title)
      })
    }

    return filtered
  }, [searchQuery, selectedCategory, sortBy])

  // Группировка по полкам
  const poolsByShelf = useMemo(() => {
    const grouped = {}
    filteredAndSortedPools.forEach(pool => {
      if (!grouped[pool.shelf]) {
        grouped[pool.shelf] = []
      }
      grouped[pool.shelf].push(pool)
    })
    return grouped
  }, [filteredAndSortedPools])

  const currentPool = expandedCard ? poolsData.find(pool => pool.id === expandedCard) : null

  // Данные для калькулятора
  const poolLevels = [
    {
      level: 1,
      name: 'Local Pool',
      bonus: 5,
      color: '#ff6f00'
    },
    {
      level: 2,
      name: 'Regional Pool',
      bonus: 10,
      color: '#ff8f00'
    },
    {
      level: 3,
      name: 'International Pool',
      bonus: 15,
      color: '#ffaa00'
    },
    {
      level: 4,
      name: 'Continental Pool',
      bonus: 20,
      color: '#ffcc00'
    },
    {
      level: 5,
      name: 'Global Pool',
      bonus: 25,
      color: '#ffdd00'
    }
  ]

  // Расчет доходности
  const calculateIncome = (th, level, asicCount, poolFee) => {
    // Базовая прибыль на 1 TH за сутки (4 сессии)
    const baseIncomePerThPer4Sessions = 0.00000048
    
    // Базовая прибыль на 1 TH за 1 сессию (6 часов)
    const baseIncomePerThPerSession = baseIncomePerThPer4Sessions / 4
    
    // Получаем данные пула
    const poolData = poolLevels[level - 1]
    
    // Дополнительный доход на 1 TH за сутки (4 сессии) в зависимости от уровня пула
    // Формула: (baseIncomePerThPer4Sessions × bonus%) / 100
    // Например, для уровня 1 (+5%): (0.00000048 × 5) / 100 = 0.00000240 / 100 = 0.000000024
    const bonusIncomePerThPer4Sessions = (baseIncomePerThPer4Sessions * poolData.bonus) / 100
    
    // Дополнительный доход на 1 TH за 1 сессию
    const bonusIncomePerThPerSession = bonusIncomePerThPer4Sessions / 4
    
    // Общая мощность с учетом количества ASIC
    const totalTh = th * asicCount
    
    // Количество сессий в сутках
    const sessionsPerDay = 4 // 4 сессии по 6 часов = 24 часа
    
    // Базовая прибыль за 1 сессию
    const baseIncomePerSession = baseIncomePerThPerSession * totalTh
    
    // Бонусная прибыль за 1 сессию
    const bonusIncomePerSession = bonusIncomePerThPerSession * totalTh
    
    // Общая прибыль за 1 сессию до вычета комиссии
    const totalIncomePerSession = baseIncomePerSession + bonusIncomePerSession
    
    // Комиссия пула за 1 сессию (в процентах)
    const feeAmountPerSession = totalIncomePerSession * (poolFee / 100)
    
    // Итоговый доход за 1 сессию после вычета комиссии
    const finalIncomePerSession = totalIncomePerSession - feeAmountPerSession
    
    // Прибыль за 4 сессии (сутки) = прибыль за 1 сессию × 4
    const baseIncomePerDay = baseIncomePerSession * sessionsPerDay
    const bonusIncomePerDay = bonusIncomePerSession * sessionsPerDay
    const feeAmountPerDay = feeAmountPerSession * sessionsPerDay
    const finalIncomePerDay = finalIncomePerSession * sessionsPerDay
    
    // Месячный доход (30 дней)
    const monthlyIncome = finalIncomePerDay * 30
    
    return {
      // За 1 сессию (6 часов)
      perSession: {
        base: baseIncomePerSession,
        bonus: bonusIncomePerSession,
        fee: feeAmountPerSession,
        total: finalIncomePerSession
      },
      // За 4 сессии (сутки / 24 часа)
      per4Sessions: {
        base: baseIncomePerDay,
        bonus: bonusIncomePerDay,
        fee: feeAmountPerDay,
        total: finalIncomePerDay
      },
      // За час (для совместимости со старым кодом)
      base: baseIncomePerDay / 24,
      bonus: bonusIncomePerDay / 24,
      fee: feeAmountPerDay / 24,
      total: finalIncomePerDay / 24,
      daily: finalIncomePerDay,
      monthly: monthlyIncome
    }
  }

  const income = calculateIncome(
    calculatorInput.th, 
    calculatorInput.level, 
    calculatorInput.asicCount, 
    calculatorInput.poolFee
  )

  // Форматирование мощности для иерархии
  const formatPower = (th) => {
    if (th >= 1000000000) return (th / 1000000000).toFixed(2) + 'B Th/s'
    if (th >= 1000000) return (th / 1000000).toFixed(2) + 'M Th/s'
    if (th >= 1000) return (th / 1000).toFixed(2) + 'K Th/s'
    return th + ' Th/s'
  }

  // Форматирование числа с пробелами
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  // Конвертация Th в PH (1000 Th = 1 PH)
  const convertThToPh = (th) => {
    return parseFloat(th) / 1000
  }

  // Форматирование PH с нужным количеством знаков после запятой
  const formatPh = (ph) => {
    return parseFloat(ph).toFixed(1)
  }

  // Данные для иерархии уровней
  const hierarchyLevels = [
    {
      level: 1,
      name: 'Local Pool',
      bonus: 5,
      color: '#ff6f00',
      icon: '🏠',
      powerRange: { min: 234, max: 1000000 },
      participants: { partners: 30, additional: 30 },
      partnersBonus: '+5% bonus to xpBTC mining rewards per claim',
      poolOwnerFee: 'Pool owner receives 1% from all partner bonuses',
      poolStat: null,
      description: 'Start your mining journey! Perfect entry point for new miners. Build your local mining community and earn your first bonuses.'
    },
    {
      level: 2,
      name: 'Regional Pool',
      bonus: 10,
      color: '#ff8f00',
      icon: '🌍',
      powerRange: { min: 1000000, max: 100000000 },
      participants: { partners: 50, additional: 50 },
      partnersBonus: '+10% bonus to xpBTC mining rewards per claim',
      poolOwnerFee: 'Flexible fee system: 0% - 3% (owner controls pool fees)',
      poolStat: 'Advanced Pool Control Features',
      description: 'Expand your influence! Unlock advanced pool management tools and attract more miners to your regional network.'
    },
    {
      level: 3,
      name: 'International Pool',
      bonus: 15,
      color: '#ffaa00',
      icon: '🌐',
      powerRange: { min: 100000000, max: 1000000000 },
      participants: { partners: 80, additional: 80 },
      partnersBonus: '+15% bonus to xpBTC mining rewards per claim',
      poolOwnerFee: 'Flexible fee system: 0% - 10% (owner controls pool fees)',
      poolStat: 'Advanced Pool Control Features',
      description: 'Go global! Command an international mining network with powerful management features and competitive bonuses.'
    },
    {
      level: 4,
      name: 'Continental Pool',
      bonus: 20,
      color: '#ffcc00',
      icon: '🌎',
      powerRange: { min: 1000000000, max: 3000000000 },
      participants: { partners: 100, additional: 100 },
      partnersBonus: '+20% bonus to xpBTC mining rewards per claim',
      poolOwnerFee: 'Flexible fee system: 0% - 15% (owner controls pool fees)',
      poolStat: 'Advanced Pool Control Features',
      description: 'Master the continent! Lead one of the largest mining operations with maximum control and premium rewards.'
    },
    {
      level: 5,
      name: 'Global Pool',
      bonus: 30,
      color: '#ffdd00',
      icon: '🚀',
      powerRange: { min: 3000000000, max: Infinity },
      participants: { partners: 120, additional: 120 },
      partnersBonus: '+30% bonus to xpBTC mining rewards per claim',
      poolOwnerFee: 'Flexible fee system: 0% - 25% (owner controls pool fees)',
      poolStat: 'Advanced Pool Control Features',
      description: 'Elite status achieved! Rule the global mining network with ultimate power, maximum bonuses, and full control over your empire.'
    }
  ]

  return (
    <section className="content-section section pools-section" id="pools">
      <div className="container" style={{ textAlign: 'left' }}>
        <h2 className="section-title" data-heading="BTC Game Pools">BTC Game Pools</h2>
        
        {/* Калькулятор и иерархия в одной строке */}
        <div className="pools-main-content">
          {/* Иерархия уровней - компактная карточка слева */}
          <div className="pools-hierarchy-card feature-card">
            <span className="glow"></span>
            <h3 className="card-title" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem' }}>
              Pool Levels Hierarchy
            </h3>
            <div className="pools-hierarchy-list">
              {hierarchyLevels.map((pool) => {
                const minPh = convertThToPh(pool.powerRange.min)
                const maxPh = pool.powerRange.max === Infinity ? Infinity : convertThToPh(pool.powerRange.max)
                const hashrateRange = pool.powerRange.max === Infinity 
                  ? `${formatPh(minPh)} PH/s and more`
                  : `${formatPh(minPh)} – ${formatPh(maxPh)} PH/s`
                
                return (
                  <div key={pool.level} className="pools-hierarchy-item-detailed" style={{ borderColor: pool.color }}>
                    <div className="pools-hierarchy-item-header">
                      <img 
                        src="/images/poolicon.png" 
                        alt={pool.name}
                        className="pools-hierarchy-icon"
                        style={{
                          width: '32px',
                          height: '32px',
                          objectFit: 'contain'
                        }}
                      />
                      <span className="pools-hierarchy-item-title">Level {pool.level} - {pool.name}</span>
                    </div>
                    
                    <div className="pools-hierarchy-item-content">
                      <div className="pools-hierarchy-info-row">
                        <span className="pools-hierarchy-info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img 
                            src="/images/hash.png" 
                            alt="Hashrate"
                            style={{
                              width: '16px',
                              height: '16px',
                              objectFit: 'contain'
                            }}
                          />
                          Hashrate Range
                        </span>
                        <span className="pools-hierarchy-info-value">{hashrateRange}</span>
                      </div>
                      
                      <div className="pools-hierarchy-info-row">
                        <span className="pools-hierarchy-info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img 
                            src="/images/user.png" 
                            alt="Participants"
                            style={{
                              width: '16px',
                              height: '16px',
                              objectFit: 'contain'
                            }}
                          />
                          Participants
                        </span>
                        <span className="pools-hierarchy-info-value">{pool.participants.partners} Partners + {pool.participants.additional} additional</span>
                      </div>
                      
                      {pool.poolStat && (
                        <div className="pools-hierarchy-info-row">
                          <span className="pools-hierarchy-info-label">🎮 Pool Stat</span>
                          <span className="pools-hierarchy-info-value">{pool.poolStat}</span>
                        </div>
                      )}
                      
                      <div className="pools-hierarchy-section">
                        <div className="pools-hierarchy-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img 
                            src="/images/formembers.png" 
                            alt="For Members"
                            style={{
                              width: '16px',
                              height: '16px',
                              objectFit: 'contain'
                            }}
                          />
                          For Members
                        </div>
                        <div className="pools-hierarchy-info-row">
                          <span className="pools-hierarchy-info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img 
                              src="/images/bonus.png" 
                              alt="Partners Bonus"
                              style={{
                                width: '16px',
                                height: '16px',
                                objectFit: 'contain'
                              }}
                            />
                            Partners Bonus
                          </span>
                          <span className="pools-hierarchy-info-value">{pool.partnersBonus}</span>
                        </div>
                        <div className="pools-hierarchy-info-row">
                          <span className="pools-hierarchy-info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img 
                              src="/images/fee.png" 
                              alt="Pool Owner Fee"
                              style={{
                                width: '16px',
                                height: '16px',
                                objectFit: 'contain'
                              }}
                            />
                            Pool Owner Fee
                          </span>
                          <span className="pools-hierarchy-info-value">{pool.poolOwnerFee}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Калькулятор доходности */}
          <div className="feature-card pools-calculator-card">
            <span className="glow"></span>
            <h3 className="card-title" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem' }}>
              💰 Income Calculator
            </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--title-color)' }}>
                Your Hashrate (Th/s):
              </label>
              <input
                type="number"
                value={calculatorInput.th || ''}
                onChange={(e) => {
                  setManualThInput(true)
                  const value = e.target.value === '' ? '' : parseInt(e.target.value) || 0
                  setCalculatorInput({ ...calculatorInput, th: value === '' ? 0 : value })
                }}
                onFocus={() => setManualThInput(true)}
                onBlur={(e) => {
                  if (e.target.value === '' || e.target.value === '0') {
                    setCalculatorInput(prev => ({
                      ...prev,
                      th: prev.asicCount * 234
                    }))
                    setManualThInput(false)
                  }
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid rgba(255, 111, 0, 0.3)',
                  background: 'var(--body-color)',
                  color: 'var(--text-color)',
                  fontSize: '1rem',
                  fontFamily: 'var(--body-font)'
                }}
                min="0"
              />
              <div style={{ fontSize: '0.75rem', opacity: 0.7, color: 'var(--text-color)', marginTop: '0.25rem' }}>
                {manualThInput ? (
                  <span>Manual input • <button 
                    type="button"
                    onClick={() => {
                      setManualThInput(false)
                      setCalculatorInput(prev => ({
                        ...prev,
                        th: prev.asicCount * 234
                      }))
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--skin-color)',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: 0,
                      fontSize: '0.75rem'
                    }}
                  >Auto-calculate</button></span>
                ) : (
                  <span>Auto-calculated: {calculatorInput.asicCount} ASIC × 234 Th/s</span>
                )}
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--title-color)' }}>
                Pool Level:
              </label>
              <select
                value={calculatorInput.level}
                onChange={(e) => setCalculatorInput({ ...calculatorInput, level: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid rgba(255, 111, 0, 0.3)',
                  background: 'var(--body-color)',
                  color: 'var(--text-color)',
                  fontSize: '1rem',
                  fontFamily: 'var(--body-font)'
                }}
              >
                {poolLevels.map(pool => (
                  <option key={pool.level} value={pool.level}>
                    Level {pool.level} - {pool.name} (+{pool.bonus}%)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--title-color)' }}>
                ASIC Count:
              </label>
              <input
                type="number"
                value={calculatorInput.asicCount}
                onChange={(e) => setCalculatorInput({ ...calculatorInput, asicCount: parseInt(e.target.value) || 1 })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid rgba(255, 111, 0, 0.3)',
                  background: 'var(--body-color)',
                  color: 'var(--text-color)',
                  fontSize: '1rem',
                  fontFamily: 'var(--body-font)'
                }}
                min="1"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--title-color)' }}>
                Pool Fee (%):
              </label>
              <input
                type="number"
                value={calculatorInput.poolFee || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? '' : parseFloat(e.target.value) || 0
                  setCalculatorInput({ ...calculatorInput, poolFee: value === '' ? 0 : value })
                }}
                onBlur={(e) => {
                  if (e.target.value === '' || e.target.value === '0') {
                    setCalculatorInput(prev => ({
                      ...prev,
                      poolFee: 1
                    }))
                  }
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid rgba(255, 111, 0, 0.3)',
                  background: 'var(--body-color)',
                  color: 'var(--text-color)',
                  fontSize: '1rem',
                  fontFamily: 'var(--body-font)'
                }}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>

          <div className="income-calculator-results">
            <div className="income-header">
              <h4 className="income-title">Estimated Income</h4>
              {btcPrice && (
                <div className="btc-price-display">
                  <span className="btc-price-label">xpBTC Price:</span>
                  <span className="btc-price-value">${btcPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
              {btcPriceLoading && !btcPrice && (
                <div className="btc-price-loading">Loading BTC price...</div>
              )}
            </div>
            
            {/* Прибыль за 1 сессию (6 часов) */}
            <div className="income-section">
              <div className="income-section-header">
                <span className="income-section-label">Per Session</span>
                <span className="income-section-time">6 hours</span>
              </div>
              <div className="income-table">
                <div className="income-row">
                  <div className="income-label">Base Income</div>
                  <div className="income-value income-base">{income.perSession.base.toFixed(8)} <span className="income-currency">xpBTC</span></div>
                </div>
                <div className="income-row">
                  <div className="income-label">Bonus Income</div>
                  <div className="income-value income-bonus">+{income.perSession.bonus.toFixed(8)} <span className="income-currency">xpBTC</span></div>
                </div>
                <div className="income-row">
                  <div className="income-label">Pool Fee</div>
                  <div className="income-value income-fee">-{income.perSession.fee.toFixed(8)} <span className="income-currency">xpBTC</span></div>
                </div>
                <div className="income-row income-row-total">
                  <div className="income-label">Net Income</div>
                  <div className="income-value-wrapper">
                    <div className="income-value income-total">{income.perSession.total.toFixed(8)} <span className="income-currency">xpBTC</span></div>
                    {btcPrice && (
                      <div className="income-value-xp">≈ {(income.perSession.total * btcPrice).toFixed(2)} <span className="income-currency">XP</span></div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Прибыль за 4 сессии (сутки) */}
            <div className="income-section">
              <div className="income-section-header">
                <span className="income-section-label">Per Day</span>
                <span className="income-section-time">4 sessions / 24 hours</span>
              </div>
              <div className="income-table">
                <div className="income-row">
                  <div className="income-label">Base Income</div>
                  <div className="income-value income-base">{income.per4Sessions.base.toFixed(8)} <span className="income-currency">xpBTC</span></div>
                </div>
                <div className="income-row">
                  <div className="income-label">Bonus Income</div>
                  <div className="income-value income-bonus">+{income.per4Sessions.bonus.toFixed(8)} <span className="income-currency">xpBTC</span></div>
                </div>
                <div className="income-row">
                  <div className="income-label">Pool Fee</div>
                  <div className="income-value income-fee">-{income.per4Sessions.fee.toFixed(8)} <span className="income-currency">xpBTC</span></div>
                </div>
                <div className="income-row income-row-total">
                  <div className="income-label">Net Income</div>
                  <div className="income-value-wrapper">
                    <div className="income-value income-total">{income.per4Sessions.total.toFixed(8)} <span className="income-currency">xpBTC</span></div>
                    {btcPrice && (
                      <div className="income-value-xp">≈ {(income.per4Sessions.total * btcPrice).toFixed(2)} <span className="income-currency">XP</span></div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Месячный доход */}
            <div className="income-section income-section-monthly">
              <div className="income-section-header">
                <span className="income-section-label">Monthly Income</span>
                <span className="income-section-time">30 days</span>
              </div>
              <div className="income-monthly-wrapper">
                <div className="income-monthly-value">
                  {income.monthly.toFixed(6)} <span className="income-currency">xpBTC</span>
                </div>
                {btcPrice && (
                  <div className="income-monthly-xp">
                    ≈ {(income.monthly * btcPrice).toFixed(2)} <span className="income-currency">XP</span>
                  </div>
                )}
              </div>
            </div>

            {/* TOP BTC Mining GAME Pools (Live) */}
            <div className="income-section income-section-top-pools">
              <div className="income-section-header income-section-header-centered">
                <span className="income-section-label">TOP BTC Mining GAME Pools (Live)</span>
              </div>
              <div className="top-pools-content">
                {topPoolsLoading ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color)' }}>
                    Loading pools data...
                  </div>
                ) : topPools.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color)' }}>
                    <div style={{ marginBottom: '0.5rem' }}>No pools data available</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                      Check browser console for details
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ 
                      textAlign: 'center', 
                      marginBottom: '1rem', 
                      fontSize: '0.9rem', 
                      color: 'var(--text-color)', 
                      opacity: 0.7 
                    }}>
                      Found {topPools.length} pool{topPools.length !== 1 ? 's' : ''}
                    </div>
                    <div className="top-pools-grid">
                      {(() => {
                        console.log('🎨 Начало рендеринга, topPools.length:', topPools.length)
                        console.log('🎨 topPools массив:', topPools)
                        return topPools.map((pool, index) => {
                          const rank = index + 1
                          const powerPh = formatPh(convertThToPh(pool.total_hashrate || 0))
                          const commission = parseFloat(pool.commission || '0').toFixed(1)
                          
                          console.log(`🎨 Рендерим пул #${rank} (index ${index}):`, {
                            id: pool.id,
                            name: pool.name,
                            hashrate: pool.total_hashrate,
                            ph: powerPh,
                            commission: pool.commission,
                            commissionFormatted: commission,
                            key: pool.id || `pool-${index}`
                          })
                          
                          // Вычисляем дополнительные данные для карточки
                          const poolLevel = pool.lvl || 1 // Уровень пула определяет количество звезд
                          const luck = pool.luck || (pool.lvl === 1 ? 105 : 110) // Временное значение
                          const bonus = pool.bonus || (pool.lvl === 1 ? 5 : 10) // Временное значение
                          
                          // Прогресс до следующего уровня
                          const currentHashrate = parseFloat(pool.total_hashrate || 0) / 1000 // PH
                          const nextLevelHashrate = pool.lvl === 1 ? 1000 : 100000 // PH для следующего уровня
                          const progressPercent = Math.min(100, (currentHashrate / nextLevelHashrate) * 100)
                          const nextLevel = (pool.lvl || 1) + 1
                          
                          // Выбираем аватар в зависимости от места в лидерборде
                          let avatarSrc = '/images/avatar.png' // По умолчанию для 3-го места
                          if (rank === 1) {
                            avatarSrc = '/images/avatarleader1.png'
                          } else if (rank === 2) {
                            avatarSrc = '/images/avatarleader2.png'
                          }
                          
                          return (
                            <div key={`pool-${pool.id}-${index}`} className={`top-pool-card top-pool-card-${rank}`}>
                              <div className="top-pool-header">
                                <div className="top-pool-rank-badge">#{rank}</div>
                                <div className="top-pool-avatar">
                                  <img src={avatarSrc} alt="Pool Owner" onError={(e) => {
                                    // Если изображение не найдено, используем fallback
                                    e.target.src = '/images/avatar.png'
                                  }} />
                                </div>
                                <div className="top-pool-name-section">
                                  <div className="top-pool-name">{pool.name || 'Unnamed Pool'}</div>
                                </div>
                                <div className="top-pool-rating">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < poolLevel ? 'star-filled' : 'star-empty'}>⭐</span>
                                  ))}
                                </div>
                              </div>
                              <div className="top-pool-stats">
                                <div className="top-pool-stat top-pool-stat-power">
                                  <div className="top-pool-stat-icon">⚡</div>
                                  <div className="top-pool-stat-label">Power</div>
                                  <div className="top-pool-stat-value">{powerPh} PH</div>
                                </div>
                                <div className="top-pool-stat top-pool-stat-luck">
                                  <div className="top-pool-stat-icon">🍀</div>
                                  <div className="top-pool-stat-label">Luck</div>
                                  <div className="top-pool-stat-value">{luck}%</div>
                                </div>
                                <div className="top-pool-stat top-pool-stat-fee">
                                  <div className="top-pool-stat-icon">🤝</div>
                                  <div className="top-pool-stat-label">Fee</div>
                                  <div className="top-pool-stat-value">{commission}%</div>
                                </div>
                                <div className="top-pool-stat top-pool-stat-bonus">
                                  <div className="top-pool-stat-icon">🍀</div>
                                  <div className="top-pool-stat-label">Bonus</div>
                                  <div className="top-pool-stat-value">+{bonus}%</div>
                                </div>
                              </div>
                              <div className="top-pool-progress">
                                <div className="top-pool-progress-label">
                                  Progress to Level {nextLevel} <span style={{ opacity: 0.7, fontWeight: 'normal' }}>({progressPercent.toFixed(1)}%)</span>
                                </div>
                                <div className="top-pool-progress-bar-container">
                                  <div className="top-pool-progress-bar" style={{ width: `${progressPercent}%` }}></div>
                                </div>
                                <div className="top-pool-progress-text">
                                  {currentHashrate.toFixed(0)} PH / {nextLevelHashrate.toLocaleString()} PH
                                </div>
                              </div>
                            </div>
                          )
                        })
                      })()}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Фильтры */}
        <div className="assets-filters">
          <div className="assets-search">
            <input
              type="text"
              placeholder="Search pools information..."
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
              <option value="level">Sort by Shelf</option>
              <option value="name">Sort by Name</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>
        </div>

        {/* Модальное окно с увеличенной карточкой */}
        {expandedCard && currentPool && (
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
              {/* Иконка слева */}
              <div style={{
                width: '200px',
                height: '200px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                borderRadius: '0.5rem',
                fontSize: '8rem'
              }}>
                {currentPool.icon}
              </div>
              {/* Текст справа */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <h3 style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'var(--title-color)',
                  margin: 0
                }}>
                  {currentPool.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: 'var(--text-color)',
                  margin: 0
                }}>
                  {currentPool.description}
                </p>
                {currentPool.details && (
                  <div style={{ marginTop: '1rem' }}>
                    {Object.entries(currentPool.details).map(([key, value]) => (
                      <div key={key} style={{ marginBottom: '0.5rem' }}>
                        <strong style={{ color: 'var(--skin-color)' }}>
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
                        </strong>{' '}
                        <span style={{ color: 'var(--text-color)' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {currentPool.features && (
                  <ul style={{
                    color: 'var(--text-color)',
                    paddingLeft: '1.5rem',
                    margin: '1rem 0 0 0',
                    fontSize: '0.9rem',
                    lineHeight: 1.8
                  }}>
                    {currentPool.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Кнопка Close */}
              <button
                type="button"
                className="glass-button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
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
        )}

        {/* Карточки, сгруппированные по полкам */}
        <div 
          className="assets-shelves"
          style={{
            opacity: expandedCard ? 0.3 : 1,
            transition: 'opacity 0.3s ease',
            pointerEvents: expandedCard ? 'none' : 'auto'
          }}
        >
          {Object.keys(poolsByShelf).sort((a, b) => Number(a) - Number(b)).map(shelfNum => (
            <div key={shelfNum} className="assets-shelf">
              <div className="assets-cards-grid">
                {poolsByShelf[shelfNum].map(pool => (
                  <div 
                    key={pool.id} 
                    className={`asset-card feature-card ${expandedCard === pool.id ? 'expanded' : ''}`}
                    onClick={() => setExpandedCard(pool.id)}
                    style={{
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease',
                      transform: expandedCard === pool.id ? 'scale(0.95)' : 'scale(1)'
                    }}
                  >
                    <span className="glow"></span>
                    {/* Иконка сверху */}
                    <div className="asset-card-icon" style={{
                      fontSize: '4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}>
                      {pool.icon}
                    </div>
                    {/* Текст снизу */}
                    <div className="asset-card-content" style={{ padding: '0 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 className="asset-card-title" style={{ 
                        color: 'var(--title-color)', 
                        marginBottom: '0.5rem', 
                        fontSize: '1rem', 
                        fontWeight: 'bold' 
                      }}>
                        {pool.title}
                      </h3>
                      <p className="asset-card-description" style={{ 
                        color: 'var(--text-color)', 
                        marginBottom: '0.5rem', 
                        fontSize: '0.75rem', 
                        lineHeight: '1.4',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {pool.description}
                      </p>
                    </div>
                    <button 
                      className="glass-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedCard(pool.id)
                      }}
                      style={{
                        position: 'absolute',
                        bottom: '1rem',
                        right: '1rem'
                      }}
                    >
                      <span>View</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pools
