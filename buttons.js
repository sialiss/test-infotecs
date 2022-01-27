import { makeElement } from "./makeElement.js"
// сделать это классом? для перерендера красивого

export function createHideBtn(i) {
    const btn = makeElement("button", "☓")
    btn.addEventListener("click", () => hideColumn(i))
    return btn
}

function hideColumn(i) {
    // вместо этого сделать перерендер таблицы без колонки с iтым номером
    // сделать стейты для проверки
    // сделать кнопку чекбоксом
    
    this.data.

    this.table.tBodies[0].remove() // убирает старый вариант тела таблицы
    this.c() // перерендер тела таблицы
}