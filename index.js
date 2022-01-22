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
}

function fillTable(table, data) {

}

createTable(table, columns)
fillTable(table, data)