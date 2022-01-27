import { tableParam } from "./tableData.js"
import { AwesomeCoolTable } from "./createTable.js"

// когда обновляется состояние
// я ищу нужные записи в массиве,
// чищу таблицу и создаю в ней новые ряды

async function start() {
    // получение элемента таблицы
    const tableEl = document.getElementById("table")

    // преобразование данных из json в массив объектов
    // для использования fetch нужен сервер
    const data = await fetch('./data.json').then(res => res.json())

    const table = new AwesomeCoolTable(tableEl, tableParam, data)

}

// создание таблицы начинается после загрузки DOM
document.addEventListener("DOMContentLoaded", start)