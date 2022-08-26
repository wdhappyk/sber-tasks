/* Задача 1
* Даны два массива clientsInfo и clientsOrder. Примеры ниже.
* Запись о пользователе считается корректной, если
*   - содержит имя (firstName) или фамилию (secondName)
*   - содержат номер телефона (phoneNumber)
*   - номер телефона корректный, если в поле есть хотя бы один
*     символ не цифра или в поле меньше 11 знаков
* Напишите функцию, которая предоставляет информацию о заказах пользователей.
* */

/* Откуда получены данные о клиентах неизвестно, но из условия можно предположить,
* что источник не позаботился о их проверке и приведению к виду, с которым можно
* перейти к решению задачи определения заказов по каждому клиенту.
* Информацию по заказам будем считать корректной, где каждый объект имеет поля:
*   - name - имя клиента в формате "Имя Фамилия" или "Имя" или "Фамилия" (судя по условию)
*   - order - номер заказа (число)
* Так же будем считать, что все данные приходят в виде простых объектов
* JavaScript, чтобы не предусматривать вариант наличия поля в прототипе.
* В случае присутствия в данных неизвестной информации будем её игнорировать. */

/* Входные данные */
// Информация о клиентах
const clientInfo = [{
  firstName: 'ivan',
  lastName: 'ivanov', // пример записи из условия с неизвестным полем
  phoneNumber: 819242412,
  email: 'ivanIvanov@gmail.com',
}, {
  firstName: 'ivan',
  secondName: 'ivanov',
  phoneNumber: 123123123,
  email: 'ivanIvanov@gmail.com',
}, {
  firstName: 'vitaLiY',
  secondName: 'Braun',
  phoneNumber: '+7 (123) 123-123-12',
  email: 'vit@braun.com',
}];
// Заказы клиентов
const clientsOrder = [{
  name: 'Ivan Ivanov',
  order: 3452,
}, {
  name: 'Vitaliy Braun',
  order: 421,
}];


/* Разработка ведётся на JavaScript, поэтому лучше обезопасить себя
* от опечаток и создать перечисление для полей структур данных.
* Кроме этого, в будущем это поможет быстро вносить правки в наименования полей */
const ClientInfoFields = {
  FirstName: 'firstName',
  SecondName: 'secondName',
  PhoneNumber: 'phoneNumber',
};


/* И определим два регулярных выражения для проверки корректности номера телефона */
const hasNewLineRegExp = /\n/;
const noDigitRegExp = /\D/;
const correctOnlyDigitsNumberRegExp = /^\d{0,10}$/;
// выражения разбиты на 2 из-за того, что проверка на одно свойство будет
// быстрее, чем на все сразу с использованием оператора или (|) в регулярном выражении

/* Для начала необхоидмо проверить запись на корректность,
* поэтому создадим функцию проверки одной записи */

/**
 * @param {object} record - Object with information about client
 * @return {boolean} */
function isClientInfoCorrect(record) {
  return !!record && typeof record === 'object' // удостоверимся, что это объект и не null
    // проверим наличие имени или фамилии, корректность типов данных полей и наличие значений
    && (
      isClientInfoNameFieldCorrect(record, ClientInfoFields.FirstName)
      || isClientInfoNameFieldCorrect(record, ClientInfoFields.SecondName)
    )
    // удостоверимся в наличии информации о номере телефона
    && record.hasOwnProperty(ClientInfoFields.PhoneNumber)
    // и его корректности
    && isPhoneNumberCorrect(record[ClientInfoFields.PhoneNumber]);
}

/* Функция проверки строкового поля в объекте с информацией о клиенте */
/**
 * @param {object} record - Object with information about client
 * @param {string} fieldName - Field name
 * @return {boolean} - Field exists, has string type and not empty */
function isClientInfoNameFieldCorrect(record, fieldName) {
  return record.hasOwnProperty(fieldName)
    && typeof record[fieldName] === 'string'
    && !!record[fieldName].trim();
}

/* Функция проверки корректности номера телефона
* Из условия:
* номер телефона корректный, если в поле есть хотя бы один
* символ не цифра или в поле меньше 11 знаков.
* Дополнительно отбрасываю значения с символом переноса строки.
* Использовались регулярные выражения, т.к. может быть подана строка
* в научном виде (н-р 1e3), что при преобразовании в число при помощи parseInt
* будет медленным, а унарный + отдаст число */

/**
 * @param {any} number
 * @return {boolean} */
function isPhoneNumberCorrect(number) {
  const type = typeof number;
  if (type === 'number' || type === 'string') {
    const str = String(number);
    return !hasNewLineRegExp.test(str) && (
      noDigitRegExp.test(str) || correctOnlyDigitsNumberRegExp.test(str)
    );
  }
  return false;
}

/* Для решения задачи потребуется создать индекс номеров телефонов клиентов
* по их имени, для чего его нужно будет составить имена из имеющейся информации.
* В дальнейшем из этого индекса можно будет получить номера телефонов клиентов
* для объектов заказов. */

/* Функция получения имени из объекта информации о клиенте */
/**
 * @param {object} clientInfo - Object with information about client
 * @return {string} - Name */
function getName(clientInfo) {
  return [ClientInfoFields.FirstName, ClientInfoFields.SecondName]
    .filter(field => isClientInfoNameFieldCorrect(clientInfo, field))
    .map(field => normalizeNamePart(clientInfo[field]))
    .join(' ');
}

/* Функция корректировки части имени */
/**
 * @param {string} part - Part of Client Name
 * @return {string} - normalized name part */
function normalizeNamePart(part) {
  const processedPart = part.trim();
  return processedPart[0].toUpperCase() + processedPart.slice(1).toLowerCase();
}

/* Утилитарная функция для разбиения списка на две группы по предикату, где
* первая группа соответсвует условию, а вторая - нет */
/**
 * @param {Iterable} collection
 * @param {Function} predicate
 * @return [Array, Array] */
function partition(collection, predicate) {
  const truth = [];
  const falsely = [];
  for (const item of collection) {
    if (predicate(item)) {
      truth.push(item);
    } else {
      falsely.push(item);
    }
  }
  return [truth, falsely];
}

/* Решим задачу */

// разобьём информацию о клиентах на две группы:
// 1) корретные записи
// 2) записи с ошибками
const [correctClientsInfo, incorrectClientsInfo] = partition(clientInfo, isClientInfoCorrect);

// создадим индекс номеров телефонов по имени клиента
const phonesIndex = new Map(correctClientsInfo
  .map(clientInfo => [
    getName(clientInfo),
    clientInfo[ClientInfoFields.PhoneNumber].toString(),
  ]));


// разобьём заказы на две группы:
// 1) для которых номера известны
// 2) для которых номер найти не удалось
const [ordersWithKnownPhoneNumber, ordersWithUnknownPhoneNumber] = partition(
  clientsOrder, item => phonesIndex.has(item.name),
);

// дополним информацию о заказах номерами телефонов
// но только для тех записей, номера телефонов для которых известны
const ordersWithPhoneNumber = ordersWithKnownPhoneNumber
  .map(item => ({
    name: item.name,
    phoneNumber: phonesIndex.get(item.name),
    order: item.order.toString(),
  }));

// выведем результат в консоль
console.log(ordersWithPhoneNumber);

/* Информацию о некорректных записях с информацией о клиентах
* и заказах, клиенты которых "потерялись" можно использовать для вывода ошибок
* или предупреждений.
* Так же не был рассмотрен случай, когда имена клиентов повторяются.
* Для решения данной задачи нужно изменить решение для построения индекса номеров телефонов
* и выбрасывать исключение в случае конфликта значений с одним ключём */
