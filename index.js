// когда обновляется состояние
// я ищу нужные записи в массиве,
// чищу таблицу и создаю в ней новые ряды
import {quantLine, columns} from "./table"

// Элемент таблицы
const table = document.getElementById("table")

// преобразование данных из json в массив объектов
// для использования fetch нужен сервер
const data = await fetch('./data.json').then(res => res.json())

function createTable(table, columns) {
    // Создание головы таблциы
    const thead = document.createElement("thead")
    table.append(thead)
    const tr = document.createElement("tr")
    thead.append(tr)

    for (const column of Object.getOwnPropertyNames(columns)) {
        // Создание и заполнение заголовков таблицы
        const th = document.createElement("th")
        th.innerText = columns[column]
        tr.append(th)
    }
    fillTable(table, columns, data)
}

function fillTable(table, columns, data) {
    // Заполняет таблицу
    // Создаёт тело таблицы
    const tbody = document.createElement("tbody")
    table.append(tbody)

    for (const each of data) {
        const tr = document.createElement("tr")
        tbody.append(tr)
        fillRow(tr, each, columns)
    }
}

function fillRow(tr, each, columns) {
    // Заполняет данные для каждого объекта
    for (const column of Object.getOwnPropertyNames(columns)) {
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

createTable(table, columns)