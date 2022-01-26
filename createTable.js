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
    table.append(tbody)
    // создание и заполнение боди таблицы
    fillTable(table, columns, data)
    fillTable(columns, data)
}

function createSortBtn(i) {
    const btn = makeElement("button", "🠓")
    btn.addEventListener("click", () => tableAbcSort(i))
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
    const btn = makeElement("button", "☓")
    btn.addEventListener("click", () => hideColumn(i))
    return btn
}

function hideColumn(n) {
    const rows = Array.from(table.rows)
    for (const row of rows) {
        console.log(row)
    }
    // elemDoc.classList.toggle("hidden")
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