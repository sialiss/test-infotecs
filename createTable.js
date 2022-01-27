import { makeElement } from "./makeElement.js" 
// import { createHideBtn } from "./buttons.js"
// import { tableSort } from "./tableSort.js"
export class AwesomeCoolTable {

    constructor(table, tableMenu, { rowsPerPage, columns }, data) {
        this.table = table // Элемент таблицы в DOC
        this.tableMenu = tableMenu // Элемент меню в DOC
        this.rowsPerPage = rowsPerPage // Количество строк на странице
        this.columns = columns // Названия колонок в таблице
        this.data = data // Массив объектов данных из JSON
        this.tableSortMore = true
    }

    createTable() {
        // "🠓"
        // Создание хеда таблицы
        const thead = makeElement("thead",
            makeElement("tr",
                ...Object.keys(this.columns).map((column) => 
                    // Создание и заполнение заголовков таблицы
                    this.createHeader(column)
                )
            )
        )
        this.table.append(thead)
        this.fillTableMenu()
        // создание и заполнение боди таблицы
        this.fillTable()
    }

    createHeader(column) {
        const th = makeElement("th",
            String(this.columns[column]),
        ) 
        const pointer = makeElement("p",
            "🠓")
        th.append(pointer)
        th.addEventListener("click", () => this.tableSort(pointer, column))
        return th
    }

    fillTableMenu() {
        // здесь чекбоксы для скрытия колонок, изменение таблицы
        for (const column of Object.keys(this.columns)) {
            this.tableMenu.append(this.createHideBtn(column))
        }
    }
    
    fillTable() {
        // Создаёт тело таблицы
        const tbody = makeElement("tbody",
            ...this.data.map((object) => 
                this.fillRow(object)
            )
        )
        this.table.append(tbody)
    }

    fillRow(object) {
        // Заполняет данные для каждого объекта
        const tr = makeElement("tr",
            ...Object.keys(this.columns).map((column) =>
                // Создаёт ячейку (столбик)
                this.createTd(object, column)
            ) 
        )
        return tr
    }

    createTd(object, column) {
        // console.log(object, column)
        const td = makeElement("td")
        if (column == 'about') {
            // добавляет колонке about css класс (для скрытия информации)
            td.classList.add('about')
        }
        if (object[column] != undefined) {
            // если у объекта json есть колонка с нужным названием,
            // то ячейка заполняется
            td.innerText = object[column]
        }
        else {
            // если колонка не определена, 
            // то проверяет есть ли нужные данные в свойствах
            td.innerText = this.getFromProperties(object, column)
        }
        return td
    }

    tableSort(pointer, column) {
        // разделить на функции
        // изменить работу стрелочки, возможно писать это в меню (колонка, стрелочка)

        const sortConditionMore = [
            (objA, objB) => objA[column] > objB[column] ? 1 : -1,
            (objA, objB) =>
                this.getFromProperties(objA, column) >
                    this.getFromProperties(objB, column) ? 1 : -1    
        ]
        const sortConditionLess = [
            (objA, objB) => objA[column] < objB[column] ? 1 : -1,
            (objA, objB) =>
                this.getFromProperties(objA, column) <
                    this.getFromProperties(objB, column) ? 1 : -1 
        ]

        // если у первого объекта есть данные в нужной колонке, то сортирует
        if (this.data[0][column] != undefined) {
            
            if (this.tableSortMore) {
                // сортирует по алфавиту, если стейт true
                this.data.sort(sortConditionMore[0])
            } 
            // обратная сортировка
            else {
                this.data.sort(sortConditionLess[0])
            }
        }
        // если колонка не определена
        else {
            // берёт данные в свойствах
            if (this.tableSortMore) {
                this.data.sort(sortConditionMore[1])
            } 
            else {
                this.data.sort(sortConditionLess[1])
            }
        }

        this.table.tBodies[0].remove() // убирает старый вариант тела таблицы
        this.fillTable() // перерендер тела таблицы
        
        if (this.tableSortMore == true) {
            this.tableSortMore = false
        }
        else {
            this.tableSortMore = true
        }
        pointer.classList.toggle("rotated")
}
    createHideBtn(i) {
        const btn = makeElement("button", "☓")
        btn.addEventListener("click", () => this.hideColumn(i))
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

    getFromProperties(object, nedeedData) {
        // берёт нужные данные в свойствах (если нет, то undefined)
        // проходит по всем свойствам объекта json, 
        // если находит, возвращает необходимую информацию
        for (const name of Object.keys(object)) {
                    if (object[name][nedeedData]) {
                        return object[name][nedeedData]
                    }
                }
    }
}

