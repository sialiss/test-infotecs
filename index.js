import { tableParam } from "./data/tableData.js"
import { AwesomeCoolTable } from "./createTable.js"

/**
 * получение элементов таблицы и меню,
 * преобразование данных JSON в массив объектов, 
 * создание экземпляра класса и запуск его работы
 */
async function start() {
    // получение элемента таблицы
    const tableEl = document.getElementById("table")
    const tableMenuEl = document.getElementById("tableMenu")

    // преобразование данных из json в массив объектов
    // для использования fetch нужен сервер
    const data = await fetch('./data/data.json').then(res => res.json())

    const table = new AwesomeCoolTable(tableEl, tableMenuEl, tableParam, data)
}

// создание таблицы начинается после загрузки DOM
document.addEventListener("DOMContentLoaded", start)