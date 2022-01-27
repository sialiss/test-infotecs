import { makeElement } from "./makeElement"

export function createSortBtn(i) {
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

export function createHideBtn(i) {
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