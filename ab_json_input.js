/**
 * AB_JSON_INPUT - Класс для создания динамической формы редактирования JSON
 * Использует Bootstrap 5 стили
 *
 * @author Abral syndicate
 * @license MIT
 * @version 1.0.0
 */
class AB_JSON_INPUT {
    /**
     * @param {string} inputId - ID скрытого input для хранения JSON
     * @param {string} containerId - ID контейнера для формы
     * @param {Array} fields - Массив объектов {name: string, type: string}
     */
    constructor(inputId, containerId, fields) {
        this.inputElement = document.getElementById(inputId);
        this.container = document.getElementById(containerId);
        this.fields = fields;
        this.data = [];

        if (!this.inputElement || !this.container) {
            console.error('AB_JSON_INPUT: Элементы не найдены');
            return;
        }

        // Загружаем существующие данные из input
        this._loadFromInput();

        // Рендерим форму
        this._render();
    }

    /**
     * Загрузка данных из input элемента
     */
    _loadFromInput() {
        const value = this.inputElement.value.trim();
        if (value) {
            try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    this.data = parsed;
                }
            } catch (e) {
                console.warn('AB_JSON_INPUT: Невалидный JSON в input');
                this.data = [];
            }
        }
    }

    /**
     * Сохранение данных в input и вызов события change
     */
    _saveToInput() {
        this.inputElement.value = JSON.stringify(this.data);

        // Вызываем событие change
        const event = new Event('change', { bubbles: true });
        this.inputElement.dispatchEvent(event);

        // Также вызываем input событие для совместимости
        const inputEvent = new Event('input', { bubbles: true });
        this.inputElement.dispatchEvent(inputEvent);
    }

    /**
     * Создание пустого объекта на основе полей
     */
    _createEmptyItem() {
        const item = {};
        this.fields.forEach(field => {
            item[field.name] = field.type === 'number' ? 0 : '';
        });
        return item;
    }

    /**
     * Рендер всей формы
     */
    _render() {
        this.container.innerHTML = '';

        // Кнопка "Добавить"
        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'btn btn-primary mb-3';
        addBtn.innerHTML = '<i class="bi bi-plus-circle"></i> Добавить';
        addBtn.addEventListener('click', () => this._addItem());
        this.container.appendChild(addBtn);

        // Контейнер для строк
        this.rowsContainer = document.createElement('div');
        this.rowsContainer.className = 'ab-json-rows';
        this.container.appendChild(this.rowsContainer);

        // Рендерим существующие элементы
        this.data.forEach((item, index) => {
            this._renderRow(item, index);
        });
    }

    /**
     * Рендер одной строки
     */
    _renderRow(item, index) {
        const row = document.createElement('div');
        row.className = 'row mb-3 align-items-end ab-json-row';
        row.dataset.index = index;

        this.fields.forEach(field => {
            const col = document.createElement('div');
            col.className = 'col';

            const label = document.createElement('label');
            label.className = 'form-label';
            label.textContent = field.name;

            const input = this._createInput(field, item[field.name], index);

            col.appendChild(label);
            col.appendChild(input);
            row.appendChild(col);
        });

        // Колонка с кнопкой удаления
        const deleteCol = document.createElement('div');
        deleteCol.className = 'col-auto';

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.innerHTML = '<i class="bi bi-x"></i> delete';
        deleteBtn.addEventListener('click', () => this._removeItem(index));

        deleteCol.appendChild(deleteBtn);
        row.appendChild(deleteCol);

        this.rowsContainer.appendChild(row);
    }

    /**
     * Создание input элемента в зависимости от типа
     */
    _createInput(field, value, rowIndex) {
        let input;

        if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.className = 'form-control';
            input.rows = 2;
            input.value = value || '';
        } else if (field.type === 'select' && field.options) {
            input = document.createElement('select');
            input.className = 'form-select';
            field.options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.value || opt;
                option.textContent = opt.label || opt;
                if (value === (opt.value || opt)) {
                    option.selected = true;
                }
                input.appendChild(option);
            });
        } else {
            input = document.createElement('input');
            input.type = field.type || 'text';
            input.className = 'form-control';

            // Для color устанавливаем значение по умолчанию
            if (field.type === 'color') {
                input.value = value || '#000000';
            } else {
                input.value = value ?? '';
            }
        }

        // Добавляем placeholder если есть
        if (field.placeholder) {
            input.placeholder = field.placeholder;
        }

        // Реактивное сохранение при изменении
        input.addEventListener('input', () => {
            this._updateField(rowIndex, field.name, input.value);
        });

        input.addEventListener('change', () => {
            this._updateField(rowIndex, field.name, input.value);
        });

        return input;
    }

    /**
     * Обновление значения поля
     */
    _updateField(rowIndex, fieldName, value) {
        if (this.data[rowIndex]) {
            // Преобразуем в число для number типа
            const field = this.fields.find(f => f.name === fieldName);
            if (field && field.type === 'number') {
                this.data[rowIndex][fieldName] = value === '' ? 0 : Number(value);
            } else {
                this.data[rowIndex][fieldName] = value;
            }
            this._saveToInput();
        }
    }

    /**
     * Добавление нового элемента
     */
    _addItem() {
        const newItem = this._createEmptyItem();
        this.data.push(newItem);
        this._renderRow(newItem, this.data.length - 1);
        this._saveToInput();
    }

    /**
     * Удаление элемента
     */
    _removeItem(index) {
        this.data.splice(index, 1);
        // Перерендериваем все строки для корректной индексации
        this._renderRows();
        this._saveToInput();
    }

    /**
     * Перерендер только строк
     */
    _renderRows() {
        this.rowsContainer.innerHTML = '';
        this.data.forEach((item, index) => {
            this._renderRow(item, index);
        });
    }

    /**
     * Получить текущие данные
     */
    getData() {
        return this.data;
    }

    /**
     * Установить данные программно
     */
    setData(data) {
        if (Array.isArray(data)) {
            this.data = data;
            this._renderRows();
            this._saveToInput();
        }
    }

    /**
     * Очистить все данные
     */
    clear() {
        this.data = [];
        this._renderRows();
        this._saveToInput();
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AB_JSON_INPUT;
}
