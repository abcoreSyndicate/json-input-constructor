# AB_JSON_INPUT

Bootstrap 5 динамический конструктор JSON форм.

Класс для создания интерактивных форм, которые позволяют пользователям создавать и редактировать массивы JSON-объектов через удобный визуальный интерфейс.

## Установка

### Локально
Скачайте `src/ab_json_input.js` и подключите в проект:
```html
<script src="path/to/ab_json_input.js"></script>
```

## Зависимости

- Bootstrap 5.3+ CSS
- Bootstrap Icons (опционально, для иконок кнопок)

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
```

## Использование

### HTML разметка
```html
<!-- Скрытый input для хранения JSON -->
<input type="hidden" id="jsonInputval1" value="">

<!-- Контейнер для формы -->
<div id="jsonInput1"></div>
```

### JavaScript инициализация
```javascript
const form = new AB_JSON_INPUT('jsonInputval1', 'jsonInput1', [
    { name: 'Имя', type: 'text' },
    { name: 'Фамилия', type: 'text' },
    { name: 'Возраст', type: 'number' },
    { name: 'любимый цвет', type: 'color' },
    { name: 'Дата рождения', type: 'date' }
]);
```

### С предзаполненными данными
```html
<input type="hidden" id="jsonInputval2"
    value='[{"Имя":"Иван","Фамилия":"Петров","Возраст":25}]'>
<div id="jsonInput2"></div>
```

```javascript
const form = new AB_JSON_INPUT('jsonInputval2', 'jsonInput2', [
    { name: 'Имя', type: 'text' },
    { name: 'Фамилия', type: 'text' },
    { name: 'Возраст', type: 'number' }
]);
// Форма автоматически загрузит существующие данные
```

## Поддерживаемые типы полей

| Тип | Описание |
|-----|----------|
| `text` | Текстовое поле |
| `number` | Числовое поле |
| `color` | Выбор цвета |
| `date` | Выбор даты |
| `email` | Email |
| `tel` | Телефон |
| `url` | URL адрес |
| `textarea` | Многострочный текст |
| `select` | Выпадающий список |

### Пример с select
```javascript
const form = new AB_JSON_INPUT('input', 'container', [
    { name: 'Статус', type: 'select', options: [
        { value: 'active', label: 'Активен' },
        { value: 'inactive', label: 'Неактивен' }
    ]}
]);
```

### Дополнительные параметры поля
```javascript
{
    name: 'Email',
    type: 'email',
    placeholder: 'example@mail.com'  // Подсказка в поле
}
```

## API

### Конструктор
```javascript
new AB_JSON_INPUT(inputId, containerId, fields)
```

| Параметр | Тип | Описание |
|----------|-----|----------|
| `inputId` | string | ID input элемента для хранения JSON |
| `containerId` | string | ID контейнера для рендера формы |
| `fields` | Array | Массив объектов описания полей |

### Методы

| Метод | Описание |
|-------|----------|
| `getData()` | Возвращает текущий массив данных |
| `setData(array)` | Устанавливает данные и обновляет форму |
| `clear()` | Очищает все данные |

### События

Input элемент генерирует события при изменениях:

```javascript
document.getElementById('jsonInputval1').addEventListener('change', (e) => {
    console.log('Данные изменены:', e.target.value);
});
```

## Стилизация

Рекомендуемые CSS стили для строк:

```css
.ab-json-row {
    padding: 10px;
    background: #f8f9fa;
    border-radius: 5px;
    margin-bottom: 10px;
}
```

## Демо

Откройте `examples/index.html` в браузере для просмотра примеров.

## Лицензия

MIT License - Abral syndicate

## Автор

**Abral syndicate**
