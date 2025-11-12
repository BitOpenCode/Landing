// ============================================
// N8N CODE NODE: Формирование лидерборда пользователей
// ============================================
// Этот код должен быть вставлен в ноду "Code" в n8n
// между нодой Postgres и нодой Webhook Response
//
// Предполагаемая структура данных из Postgres:
// - user_id или id (ID пользователя)
// - username или name (имя пользователя)
// - asic_count (количество ASIC)
// - avatar_url (опционально, URL аватара)
// - другие поля по необходимости

// 1) Получаем данные из предыдущей ноды (Postgres)
const raw = $input.all().map(i => i.json);

console.log('=== DEBUG: Raw input ===');
console.log('Raw length:', raw.length);
console.log('First raw item:', JSON.stringify(raw[0], null, 2));

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
let users = [];

// Если raw[0] - это уже массив, используем его напрямую
if (raw.length > 0 && Array.isArray(raw[0])) {
  users = raw[0];
  console.log('Данные пришли как массив напрямую');
} else {
  // Иначе обрабатываем каждый элемент
  for (const item of raw) {
    const arr = extractArray(item);
    if (arr) {
      users.push(...arr);
    } else if (item && typeof item === 'object') {
      // Если это объект с данными пользователя, добавляем его
      users.push(item);
    }
  }
}

console.log(`Получено ${users.length} пользователей из Postgres`);
if (users.length > 0) {
  console.log('Пример первого пользователя:', JSON.stringify(users[0], null, 2));
}

// 4) Вычисляем Th для каждого пользователя и фильтруем тех, у кого есть ASIC
const usersWithTh = users
  .map(user => {
    // Получаем количество ASIC (может быть в разных полях, включая total_asics)
    // Значения могут приходить как строки, поэтому используем parseInt
    const asicCount = parseInt(
      user.total_asics || 
      user.asic_count || 
      user.asicCount || 
      user.asics || 
      user.totalAsics || 
      0
    );
    
    // Вычисляем Th: ASIC * 234
    const th = asicCount * 234;
    
    return {
      ...user,
      asic_count: asicCount,
      th: th
    };
  })
  .filter(user => user.asic_count > 0); // Фильтруем только тех, у кого есть ASIC

console.log(`Пользователей с ASIC: ${usersWithTh.length}`);

// 5) Сортируем по Th (по убыванию) - пользователи соревнуются по Th
const sortedUsers = usersWithTh.sort((a, b) => {
  return b.th - a.th; // По убыванию Th
});

// 6) Добавляем место (rank) и форматируем данные для фронтенда
const leaderboard = sortedUsers.map((user, index) => {
  const rank = index + 1; // Место начинается с 1
  
  return {
    rank: rank,
    user_id: user.user_id || user.id || user.userId || null,
    username: user.username || user.name || user.userName || `User ${user.user_id || user.id || index + 1}`,
    asic_count: user.asic_count,
    th: user.th,
    // Дополнительные поля (если есть в БД)
    avatar_url: user.avatar_url || user.avatarUrl || user.avatar || null,
    // Можно добавить другие поля по необходимости
    // total_xpbtc_mined: user.total_xpbtc_mined || 0,
    // level: user.level || 1,
    // и т.д.
  };
});

console.log(`Сформирован лидерборд из ${leaderboard.length} пользователей`);
console.log(`Топ-5:`);
leaderboard.slice(0, 5).forEach(user => {
  console.log(`  ${user.rank}. ${user.username} - ${user.asic_count} ASIC (${user.th} Th)`);
});

// 7) Возвращаем результат в формате n8n
// Используем тот же подход, что и для пулов - возвращаем объект с массивом
// Это решает проблему с responseMode: "lastNode"
return [{
  json: {
    leaderboard: leaderboard,
    total: leaderboard.length
  }
}];

