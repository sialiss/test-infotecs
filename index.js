// когда обновляется состояние
// я ищу нужные записи в массиве,
// чищу таблицу и создаю в ней новые ряды

const table = document.getElementById("table")
let quantLine = 10
const columns = ["firstName", "lastName", "about", "eyeColor"]

// преобразование данных из json в массив объектов
const data = await fetch('./data.json').then(res => res.json())

function createTable(table, columns) {
    const thead = document.createElement("thead")
    table.append(thead)
    const tr = document.createElement("tr")
    thead.append(tr)
    for (const column of columns) {
        const th = document.createElement("th")
        th.innerText = column
        tr.append(th)
    }
    fillTable(table, columns, data)
}

function fillTable(table, columns, data) {
    const tbody = document.createElement("tbody")
    table.append(tbody)

    for (const each of data) {
        const tr = document.createElement("tr")
        tbody.append(tr)
        fillRow(tr, each, columns)
    }
}

function fillRow(tr, each, columns) {
    for (const column of columns) {
        const td = document.createElement("td")
        tr.append(td)
        if (column == 'about') {
            td.classList.add('about')
        }
        if (each[column] != undefined) {
            td.innerText = each[column]
        }
        else {
            for (const name of Object.getOwnPropertyNames(each)) {
                if (each[name][column]) {
                    td.innerText = each[name][column]
                }
            }
        }
    }
}

createTable(table, columns)