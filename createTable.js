import { createHideBtn, createSortBtn } from './buttons.js'
// сделать class AwesomeCoolTable
// креате тейбл - конструктор
// остальное - методы
// (это для того чтобы тейбл не передавать миллион раз)

function makeElement(type, ...children) {
    // создание элемента, добавление ему детей (если есть)
    const elem = document.createElement(type)
    elem.append(...children)
    return elem
}

export function createTable(table, { rowsPerPage, columns }, data) {
    // Создание хеда таблицы
    const thead = makeElement("thead",
        makeElement("tr",
            ...Object.values(columns).map((column, i) => 
                // Создание и заполнение заголовков таблицы
                makeElement("th",
                    String(column),
                    createSortBtn(i),
                    createHideBtn(i)
                )
            )
        )
    )
    table.append(thead)
    // создание и заполнение боди таблицы
    fillTable(table, columns, data)
    fillTable(columns, data)
}

function fillTable(columns, data) {
    // Заполняет таблицу
    // Создаёт тело таблицы
    const tbody = makeElement("tbody",
        ...data.map((row) => 
            fillRow(row, columns)
        )
    )
}

function fillRow(row, columns) {
    // Заполняет данные для каждого объекта
    for (const column of Object.keys(columns)) {
        // Создаёт ячейку (столбик)
        const td = document.createElement("td")
        tr.append(td)
        if (column == 'about') {
            // добавляет колонке about css класс (для скрытия информации)
            td.classList.add('about')
        }
        if (each[column] != undefined) {
            // если у объекта json есть колонка с нужным названием,
            // то ячейка заполняется
            td.innerText = each[column]
        }
        else {
            // если колонка не определена, 
            // то проверяет есть ли нужные данные в свойствах
            td.innerText = getFromProperties(each, column)
        }
    }
}

function getFromProperties(obj, nedeedData) {
    // проходит по всем свойствам объекта json, 
    // если находит, возвращает необходимую информацию
    for (const name of Object.getOwnPropertyNames(obj)) {
                if (obj[name][nedeedData]) {
                    return obj[name][nedeedData]
                }
            }
}