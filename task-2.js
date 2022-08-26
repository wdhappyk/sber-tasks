/* Напишите функцию, которая вернет не более 10 пользователей
* из отсортированного по дате списка с пользователями:
*   - удалите дублирующихся пользователей (с одинаковыми полями userId)
*   - отсортируйте список по дате (поле timestamp) по убыванию (сначала те, что раньше)
*   - возьмите первые 10 записей, если записей меньше 10, то выведите их все
*   - если дата невалидная, удалите контакт
* */

/* Будем считать timestamp невалидным, если значение не является строкой с числом, либо
* число (в строке) отрицательное. Дробные значения и значения из будущего считаем корректными */

/* Составим тестовый набор данных
* Данный список содержит 10 уникальных userId, на каждый из которого приходится по две
* записи. Для некоторых userId одна из записей имеет некорретный timestamp */
const users = [
  { userId: '1', timestamp: '1' },
  { userId: '2', timestamp: '-5' },
  { userId: '3', timestamp: '123' },
  { userId: '4', timestamp: '1234' },
  { userId: '5', timestamp: '-12345' },
  { userId: '6', timestamp: '123456' },
  { userId: '7', timestamp: { toString: () => '555', valueOf: () => 555 } },
  { userId: '8', timestamp: '-12345678' },
  { userId: '9', timestamp: '123456789' },
  { userId: '10', timestamp: 555 },
  { userId: '1', timestamp: '1' },
  { userId: '2', timestamp: '12' },
  { userId: '3', timestamp: '123' },
  { userId: '4', timestamp: '1234' },
  { userId: '5', timestamp: '12345' },
  { userId: '6', timestamp: 'qwerty' },
  { userId: '7', timestamp: '1234567' },
  { userId: '8', timestamp: '12345678' },
  { userId: '9', timestamp: '123456789' },
  { userId: '10', timestamp: '1234567890' },
];

/* Для начала определим функцию проверки корректности временной отметки */
/**
 * @param {any} timestamp*/
function isTimestampCorrect(timestamp) {
  // важно проверить строку на пустоту, т.к. +"" === 0
  if (typeof timestamp !== 'string' || !timestamp.trim()) {
    return false;
  }
  const n = +timestamp;
  return !Number.isNaN(n) && n >= 0;
}

/* Определим функцию поиска записей */
/**
 * @param {Array} users
 * @param {number} count
 * @return {Array} - last {count} unique users */
function findLastUsers(users, count = 10) {
  // опустим проверки на корректность типов входных данных users
  // и будем считать, что передан массив с объектами, однозначно имеющими поле userId,
  // а timestamp считаем необязательным

  if (count <= 0) {
    throw new Error('count must be > 0');
  }

  // первым шагом удалим "мусор", чтобы при удалении дубликатов не взять некорректный объект
  const correctUsers = users.filter(u => isTimestampCorrect(u.timestamp));
  // отсортируем только что полученный список по убыванию значений timestamp
  correctUsers.sort((u1, u2) => +u2.timestamp - +u1.timestamp);
  // и возьмём первые 10 уникальных записей
  const result = [];
  const usedIds = new Set(); // набор для проверки наличия записи с таким userId в result
  for (const u of correctUsers) {
    if (!usedIds.has(u.userId)) {
      result.push(u);
      usedIds.add(u.userId);
      if (result.length === count) {
        break;
      }
    }
  }
  return result;
}


/* Проверим решение */
console.log(findLastUsers(users, 10));
