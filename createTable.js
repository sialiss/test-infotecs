import { makeElement } from "./library/makeElement.js"
import { processObj } from "./library/processObj.js"
// import { tableSort } from "./tableSort.js"
import { handleEditSubmit } from "./library/handleEditSubmit.js"
export class AwesomeCoolTable {

    constructor(table, tableMenu, { rowsPerPage, columns }, data) {
        this.table = table // Элемент таблицы в DOC
        this.tableMenu = tableMenu // Элемент меню в DOC
        this.rowsPerPage = rowsPerPage // Количество строк на странице
        this.columns = columns // Названия колонок в таблице
        this.data = data // Массив объектов данных из JSON
        this.objects = []
        for (const object of this.data) {
            // Заполняет массив обработанными объектами,
            // каждый объект содержит в свойствах необходимые для таблицы данные
            // это нужно, чтобы обработать объекты только один раз,
            // и не извлекать данные некоторых колонок из свойств объектов
                this.objects.push(processObj(object, this.columns))
        }

        // state сортировки (включена ли)
        this.tableSortOn = false
        // state формы (открыта ли)
        this.formOpen = false
    }

    createTable() {
        // Создание хеда таблицы
        const thead = makeElement("thead",
            makeElement(
                "tr",
                    ...Object.keys(this.columns).map((column) => 
                        // Создание и заполнение заголовков таблицы
                        this.createHeader(column)
                    )
            )
        )
        this.table.append(thead)

        // создание и заполнение меню таблицы
        this.fillTableMenu()
        this.tableMenuSorting()
        // создание и заполнение боди таблицы
        this.fillTable()
    }

    createHeader(column) {
        const th = makeElement(
            "th",
            {
                // стейт сортировки колонки (по алфавиту / в обратном порядке)
                sortMore: true, 
                "click": () => this.tableSort(th, column)
            },
                String(this.columns[column].value),
        )
        return th
    }

    fillTableMenu() {
        // здесь чекбоксы для скрытия колонок, изменение таблицы
        this.tableMenu.append(
            makeElement("form",
                { name: "hideMenu" },
                    "отображение колонок:",
                    ...Object.keys(this.columns).map((column, i) =>
                        this.createHideCheckbox(i)
                    )
            )
        )
    }

    tableMenuSorting(sortMore, sort = "выключена") {
        // управление отображением состояния сортировки в меню
        // по умолчанию сортировка выключена
        if (sort == "выключена") {
            // создание элемента в меню
            this.sortingStateEl = makeElement(
                "a",
                { name: "sortingStateEl" },
                    `сортировка: ${sort}`)
            this.tableMenu.append(this.sortingStateEl)
        }
        else {
            // включение сортировки (обновление данных для отображения)
            let direction
            if (sortMore) {
                direction = "A-Я"
            }
            else {
                direction = "Я-А"
            }
            this.sortingStateEl.innerText =
                `сортировка: колонка "${this.columns[sort].value}" (${direction})`
        } 
    }
    
    fillTable() {
        // Создаёт тело таблицы
        const tbody = makeElement(
            "tbody",
                ...this.objects.map((object) => 
                    this.fillRow(object)
                )
        )
        this.table.append(tbody)
    }

    fillRow(object) {
        // Заполняет данные для каждого объекта
        const tr = makeElement(
            "tr",
            {"click" : () => this.editObj(object)},
                ...Object.keys(this.columns).map((column) =>
                    // Создаёт ячейку для каждой колонки
                    this.createTd(object, column)
                ) 
        )
        return tr
    }

    createTd(object, column) {
        // создание и заполнение ячейки
        const td = makeElement(
            "td",
                String(object[column])
        )
        if (column == 'about') {
            // добавляет колонке about css класс (для скрытия информации)
            td.classList.add('about')
        }
        return td
    }

    tableSort(th, column) {
        if (th.sortMore) {
            // сортирует по алфавиту, если стейт true
            this.objects.sort(
                (objA, objB) => objA[column] > objB[column] ? 1 : -1
            )
        } 
        // обратная сортировка
        else {
            this.objects.sort(
                (objA, objB) => objA[column] < objB[column] ? 1 : -1
            )
        }
        this.rerenderTable() // обновление таблицы
        this.tableMenuSorting(th.sortMore, column) // обновление меню
        th.sortMore = !th.sortMore // обновление состояния
    }
    
    createHideCheckbox(i) {
        // создание чекбоксов для отображения/скрытия колонок
        const checkbox = makeElement(
            "input",
            {
                type: "checkbox",
                checked: true,
                "change": () => this.hideColumn(i)
            }
        )
        return checkbox
}

    hideColumn(i) {
        for (const each of this.table.rows) {
            each.children[i].classList.toggle("hidden")
        }
    }

    editObj(object) {
        // форма изменения объекта (строки) таблицы
        let form
        const formName = "editObj"
        if (!this.formOpen) {
            // создание формы с инпутами 
            // (их значение - значение нужной колонки по имени инпута)
            form = makeElement(
                "form",
                { name: formName },
                    ...Object.keys(this.columns).map((column) =>
                        makeElement(
                            "input",
                            {
                                value: object[column],
                                name: column
                            }
                        )
                    ),
                    makeElement(
                        "button",
                        { type: "submit" },
                            "✓"
                    )
            )
            
            this.tableMenu.append(form)
            this.formOpen = true
        }
        else {
            // если форма уже открыта, то берёт форму из документа
            // обновляет инпуты
            form = document.forms[formName]
            const inputNames = Object.keys(this.columns)
            for (const input of inputNames) {
                form[input].value = object[input]
            }
        }

        // обработка подтверждения формы
        form.onsubmit = (e) =>
            this.handleEditSubmit(e, form.name, object,
                ...Object.keys(this.columns).map((column) => column))
    }

    handleEditSubmit(e, formName, object, ...inputNames) {
        // предотвращает стандартное поведение
        e.preventDefault()
        const form = document.forms[formName]
        // обновляет объекту данные по нужной форме
        for (const prop of inputNames) {
            object[prop] = form[prop].value
        }
        // обновляет таблицу и закрывает форму
        this.rerenderTable()
        form.remove()
        // обновляет стейт формы
        this.formOpen = false
    }

    rerenderTable() {
        // обновление таблицы

        // убирает старый вариант тела таблицы
        this.table.tBodies[0].remove() 
        // создаёт новый вариант тела таблицы
        this.fillTable() 
    }
}

