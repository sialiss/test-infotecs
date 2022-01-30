export function tableSort(table, i) {

    moreOrLess = ">"
    
    // сделать стейты ансорт, сорталф, сортреверсалф, сделать либо две кнопки, 
    // либо чтобы оно по повторному нажатию менялось, лучше выпадающий список
    // получает колонку
    const unsortedRows = Array.from(table.rows)
    let sortedRows = unsortedRows
    // отрезает заголовки    
    .slice(1) 
    // сортирует по алфавиту
    .sort((rowA, rowB) =>
            rowA.cells[i].innerHTML > rowB.cells[i].innerHTML ? 1 : -1);

    table.tBodies[0].remove()
    moreLess.classList.toggle("less")
}