import {makeElement} from "./makeElement.js" 
export class AwesomeCoolTable {

    constructor(table, { rowsPerPage, columns }, data) {
        this.table = table // Элемент таблицы в DOC
        this.rowsPerPage = rowsPerPage // Количество строк на странице
        this.columns = columns // Названия колонок в таблице
        this.data = data // Массив объектов данных из JSON

        this.createTable()
    }
    
    // makeElement(type, ...children) {
    //     // создание элемента, добавление ему детей (если есть)
    //     const elem = document.createElement(type)
    //     elem.append(...children)
    //     return elem
    // }

    createTable() {
        // Создание хеда таблицы
        const thead = makeElement("thead",
            makeElement("tr",
                ...Object.values(this.columns).map((column, i) => 
                    // Создание и заполнение заголовков таблицы
                    makeElement("th",
                        String(column),
                        // this.createSortBtn(i),
                        // this.createHideBtn(i)
                    )
                )
            )
        )
        this.table.append(thead)
        // создание и заполнение боди таблицы
        this.fillTable()
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

    getFromProperties(object, nedeedData) {
        // проходит по всем свойствам объекта json, 
        // если находит, возвращает необходимую информацию
        for (const name of Object.keys(object)) {
                    if (object[name][nedeedData]) {
                        return object[name][nedeedData]
                    }
                }
    }
}

