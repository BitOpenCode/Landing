// ============================================
// N8N CODE NODE: Формирование лидерборда пулов
// ============================================
// Этот код должен быть вставлен в ноду "Code" в n8n
// между нодой Postgres и нодой Webhook Response

// 1) Получаем данные из предыдущей ноды (Postgres)
const raw = $input.all().map(i => i.json);

// 2) Функция для извлечения массива из разных форматов ответа
function extractArray(obj) {
  if (Array.isArray(obj)) return obj;
  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj.result)) return obj.result;
    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.rows)) return obj.rows;
    if (Array.isArray(obj.records)) return obj.records;
    if (Array.isArray(obj.items)) return obj.items;
  }
  return null;
}

// 3) Нормализация данных - собираем все записи в один массив
let pools = [];
for (const item of raw) {
  const arr = extractArray(item);
  if (arr) {
    pools.push(...arr);
  } else {
    pools.push(item);
  }
}

console.log(`Получено ${pools.length} пулов из Postgres`);

// 4) Фильтруем только активные пулы
const activePools = pools.filter(pool => {
  return pool.status === 'active';
});

console.log(`Активных пулов: ${activePools.length}`);

// 5) Сортируем по total_hashrate (по убыванию)
const sortedPools = activePools.sort((a, b) => {
  const hashA = parseFloat(a.total_hashrate || 0);
  const hashB = parseFloat(b.total_hashrate || 0);
  return hashB - hashA; // По убыванию
});

// 6) Берем топ-3 пула
const top3Pools = sortedPools.slice(0, 3);

console.log(`Топ-3 пулов:`);
top3Pools.forEach((pool, index) => {
  console.log(`  ${index + 1}. ${pool.name} (Hashrate: ${pool.total_hashrate})`);
});

// 7) Форматируем данные для фронтенда
// Возвращаем массив пулов в формате, который ожидает фронтенд
const formattedPools = top3Pools.map((pool, index) => ({
  id: pool.id,
  owner_id: pool.owner_id,
  owner_name: pool.owner_name || `Owner${pool.owner_id || ''}`, // Имя владельца
  name: pool.name || 'Unnamed Pool',
  description: pool.description,
  reward_type: pool.reward_type,
  commission: pool.commission || '0',
  payment_frequency: pool.payment_frequency,
  visibility: pool.visibility,
  status: pool.status,
  total_hashrate: pool.total_hashrate || '0',
  created_at: pool.created_at,
  updated_at: pool.updated_at,
  lvl: pool.lvl || 1,
  max_lvl: pool.max_lvl || 1,
  // Дополнительные поля для карточки
  rating: pool.rating || Math.floor(Math.random() * 3) + 1, // Рейтинг 1-5 (временное, пока нет в БД)
  participants: pool.participants || { 
    current: Math.floor(Math.random() * 20) + 10, 
    max: (pool.lvl || 1) === 1 ? 30 : 50 
  }, // Участники (временное, пока нет в БД)
  luck: pool.luck || ((pool.lvl || 1) === 1 ? 105 : 110), // Luck % (временное)
  bonus: pool.bonus || ((pool.lvl || 1) === 1 ? 5 : 10) // Bonus % (временное)
}));

// 8) Возвращаем результат в формате n8n
// ПРОБЛЕМА: responseMode: "lastNode" берет только первый элемент массива
// РЕШЕНИЕ: Возвращаем один объект с массивом pools внутри
// Тогда lastNode вернет этот объект, и фронтенд сможет извлечь массив

return [{
  json: {
    pools: formattedPools
  }
}];

