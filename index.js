// когда обновляется состояние
// я ищу нужные записи в массиве,
// чищу таблицу и создаю в ней новые ряды
import {tableParam} from "./table.js"

// Элемент таблицы
const table = document.getElementById("table")

// преобразование данных из json в массив объектов
// для использования fetch нужен сервер
const data = await fetch('./data.json').then(res => res.json())

function createTable(table, {quantLines, columns}) {
    // Создание головы таблциы
    const thead = document.createElement("thead")
    table.append(thead)
    const tr = document.createElement("tr")
    thead.append(tr)
    
    Object.values(columns).forEach((column, i) => {
        // Создание и заполнение заголовков таблицы
        const th = document.createElement("th")
        th.innerText = column
        tr.append(th)
        th.append(createSortBtn(i))
        th.append(createHideBtn(i))
    }); 
    fillTable(table, columns, data)
}

function createSortBtn(i) {
    const btn = document.createElement("button")
    btn.addEventListener("click", () => tableAbcSort(i))
    btn.innerText = "🠓" // 🠑
    return btn
}

function tableAbcSort(n) {
    
    // сделать стейты ансорт, сорталф, сортреверсалф, сделать либо две кнопки, 
    // либо чтобы оно по повторному нажатию менялось, лучше выпадающий список
    // получает колонку
    const unsortedRows = Array.from(table.rows)
    let sortedRows = unsortedRows
    // отрезает заголовки    
    .slice(1) 
    // сортирует по алфавиту
    .sort((rowA, rowB) =>
            rowA.cells[n].innerHTML > rowB.cells[n].innerHTML ? 1 : -1);

    table.tBodies[0].append(...sortedRows);
}

function createHideBtn(i) {
    const btn = document.createElement("button")
    btn.addEventListener("click", () => hideColumn(i))
    btn.innerText = "☓"
    return btn
}

function hideColumn(n) {
    const rows = Array.from(table.rows)
    for (const row of rows) {
        console.log(row)
        row
    }
    // elemDoc.classList.toggle("hidden")
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

createTable(table, tableParam)