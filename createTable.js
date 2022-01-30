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

        // state сортировки 
        this.tableSortOn = false // включена ли
        this.tableSortMore = true // по алфавиту/против
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
        // создание и заполнение боди таблицы
        this.fillTable()
    }

    createHeader(column) {
        const pointer = makeElement(
            "p",
            {sortOn : false}, // state сортировки (включена ли)
                "○"
                
        )
        const th = makeElement(
            "th",
            {"click" : () => this.tableSort(pointer, column)},
                String(this.columns[column]),
                pointer
        ) 
        
        return th
    }

    fillTableMenu() {
        // здесь чекбоксы для скрытия колонок, изменение таблицы
        this.tableMenu.append(
            makeElement("div",
                ...Object.keys(this.columns).map((column) =>
                    this.createHideBtn(column)
                )
            )
        )
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

    tableSort(pointer, column) {
        // разделить на функции

        // if (!(pointer.sortOn)) {
        //     pointer.sortOn = !pointer.sortOn
        //     pointer.innerText = "🠑"
        //     this.tableSortOn = true
        // }

        if (this.tableSortMore) {
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

        this.tableRerender() // обновление таблицы
        this.tableSortMore = !this.tableSortMore

        // pointer.classList.toggle("rotated")
    }
    
    createHideBtn(i) {
        const btn = makeElement(
            "button",
            { "click" : () => this.hideColumn(i) },
                "☓"
        )
        return btn
}

    hideColumn(column) {
        // вместо этого сделать перерендер таблицы без колонки с iтым номером
        // сделать стейты для проверки
        // сделать кнопку чекбоксом
        
    
        delete this.columns[column]

        this.table.tBodies[0].remove() // убирает старый вариант тела таблицы
        this.table.tHead.remove()
        this.tableMenu.buttons.remove()
        this.createTable() // перерендер тела таблицы
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
        this.tableRerender()
        form.remove()
        // обновляет стейт формы
        this.formOpen = false
    }

    tableRerender() {
        // обновление таблицы

        // убирает старый вариант тела таблицы
        this.table.tBodies[0].remove() 
        // создаёт новый вариант тела таблицы
        this.fillTable() 
    }
}

