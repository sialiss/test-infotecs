import { makeElement } from "./library/makeElement.js"
import { processObj } from "./library/processObj.js"

/**
 * @property {HTMLTableElement} tableEl Элемент таблицы в DOM
 * @property {HTMLElement} tableMenu Элемент меню в DOM
 * @property {number} rowsPerPage Количество строк на странице
 * @property {object} columns Названия колонок в таблице
 * @property {object[]} data Данные из JSON
 * @property {object[]} objects обработанные данные JSON для таблицы
 * @property {number} currentPage номер открытой страницы
 * @property {boolean} isTableSortOn флаг сортировки (включена ли)
 * @property {boolean} isFormOpen флаг формы изменения объекта (открыта ли)
 * @property {boolean} isChangePageMenuOpen флаг меню переключения страниц (создано ли)
 */
export class AwesomeCoolTable {

    /**
     * @param {HTMLTableElement} table Элемент таблицы в DOM
     * @param {HTMLElement} tableMenu Элемент меню в DOM
     * @param {number} tableData.rowsPerPage Количество строк на странице
     * @param {object} tableData.columns Названия колонок в таблице
     * @param {object[]} data Данные из JSON
     */
    constructor(table, tableMenu, { rowsPerPage, columns }, data) {
        this.tableEl = table
        this.tableMenu = tableMenu
        this.rowsPerPage = rowsPerPage
        this.columns = columns
        this.data = data

        // Заполняет массив обработанными объектами,
        // каждый объект содержит в свойствах необходимые для таблицы данные
        // это нужно, чтобы обработать объекты только один раз,
        // и не извлекать данные некоторых колонок из свойств объектов
        this.objects = this.data.map((object) =>
            processObj(object, Object.keys(this.columns)))

        for (const column of Object.keys(this.columns)) {
            // для каждой колонки стейт отображения
            this.columns[column].hidden = false
        }
        this.isTableSortOn = false
        this.isFormOpen = false
        this.currentPage = 1
        this.isChangePageMenuOpen = false

        this.createTable()
    }

    /** 
     * создаёт голову таблицы,
     * запускает создание меню и тела таблицы 
    */
    createTable() {
        const thead = makeElement("thead",
            makeElement(
                "tr",
                    ...Object.keys(this.columns).map((column) => 
                        // Создание и заполнение заголовков таблицы
                        this.createHeader(column)
                    )
            )
        )
        this.tableEl.append(thead)

        // создание и заполнение меню таблицы
        this.fillTableMenu()
        // создание и заполнение боди таблицы
        this.fillTable()
    }

    /** 
     * создаёт заголовки таблицы 
     * @param {string} column название колонки заголовка
     * @returns {HTMLTableCellElement} заголовок колонки
    */
    createHeader(column) {
        const th = makeElement(
            "th",
            {
                // стейт сортировки колонки (по алфавиту / в обратном порядке)
                sortAscending: true, 
                "click": () => this.tableSort(th, column)
            },
                String(this.columns[column].value),
        )
        return th
    }

    /** 
     * создаёт чекбоксы для скрытия колонок, 
     * сортировку таблицы, управление страницами
    */
    fillTableMenu() {
        this.tableMenu.append(
            makeElement("form",
                { name: "hideMenu" },
                    "отображение колонок:",
                    ...Object.keys(this.columns).map((column, i) =>
                        this.createHideCheckbox(column, i)
                    )
                    
            ),
            this.tableMenuSorting(),
            this.tableMenuPages()
        )
    }

    /** 
     * управляет отображением состояния сортировки в меню,
     * по умолчанию сортировка выключена 
     * @param {boolean} sortAscending направление сортировки
     * @param {string} column название сортируемой колонки
     * @returns {HTMLFormElement} форма меню сортировки
    */
    tableMenuSorting(sortAscending, column) {
        let form
        if (!this.isTableSortOn) {
            // создание элемента в меню
            form = makeElement("form",
                { name: "sortingMenu" },
                    makeElement(
                        "a",
                            "сортировка: выключена"
                    )
            )
            
            this.isTableSortOn = true
        }
        else {
            // включение сортировки (обновление данных для отображения)
            form = document.forms["sortingMenu"]
            let direction
            if (sortAscending) {
                direction = "A-Я"
            }
            else {
                direction = "Я-А"
            }
            form.firstChild.innerText =
                `сортировка: колонка "${this.columns[column].value}" (${direction})`
        } 
        return form
    }

    /** 
     * создаёт или обновляет меню страниц таблицы 
     * @returns {HTMLFormElement} форма меню страниц таблицы
    */
    tableMenuPages() {
        let form
        const formName = "pages"
        if (!this.isChangePageMenuOpen) {
            form = makeElement("form",
                {
                    name: formName,
                    class: "wrapper"
                },
                    makeElement("div",
                        // кнопки переключения страниц 
                        makeElement("button",
                            {
                                type: "button",
                                name: "previous",
                                "click": () => this.changePage(this.currentPage-1)
                            },
                                "🠔"
                        ),
                        makeElement("button",
                            {
                                type: "button",
                                name: "next",
                                "click": () => this.changePage(this.currentPage+1)
                            },
                                "➝"
                        )
                    ),
                    // отображает открытую страницу и количество страниц
                    makeElement("a",
                        { name: "pagesCount" },      
                            `[ ${this.currentPage}/${this.objects.length/this.rowsPerPage} ]`
                    )
            )

            this.isChangePageMenuOpen = true
        }
        else {
            form = document.forms[formName]
            form.lastChild.innerText = `[ ${this.currentPage}/${this.objects.length/this.rowsPerPage} ]`
        }

        // прячет кнопки, если следующей страницы для этой кнопки не существует
        // открывает, если они есть
        form["previous"].classList.toggle(
            "hidden", this.currentPage == 1)
        form["next"].classList.toggle(
            "hidden", this.currentPage ==
                Object.keys(this.objects).length / this.rowsPerPage)
                
        return form
    }
    
    /** 
     * создаёт тело таблицы, неиспользуемые страницы не рендерятся 
    */
    fillTable() {
        const tbody = makeElement(
            "tbody",
                ...this.objects
                    .slice((this.currentPage-1) * this.rowsPerPage,
                        this.currentPage * this.rowsPerPage)
                    .map((object) => this.createRow(object)
                )
        )

        this.tableEl.append(tbody)
    }

    /** 
     * заполняет данные для каждого объекта 
     * @param {object} object объект этой строки
     * @returns {HTMLTableRowElement} ряд таблицы
    */
    createRow(object) {
        const tr = makeElement(
            "tr",
            { "click": () => this.editObj(object) },
                ...Object.keys(this.columns).map((column) =>
                    this.createTd(object, column))
        )
        return tr
    }

    /** 
     * создаёт и заполняет ячейки 
     * @param {object} object объект этой строки
     * @param {string} column название колонки ячейки
     * @returns {HTMLTableCellElement} ячейка таблицы
    */
    createTd(object, column) {
        const td = makeElement(
            "td",
                makeElement("a", String(object[column]))
        )
        if (column == 'about') {
            // добавляет ячейке about css класс (для скрытия информации)
            td.classList.add('about')
        }
        if (this.columns[column].hidden) {
            // скрывает ячейку, если колонка скрыта
            td.classList.add('hidden')
        }
        if (column == 'eyeColor') {
            
            /*
            В колонке “eyeColor” предоставляются данные в виде цвета, 
            сохраняя возможность сортировки по значению.
            Название цвета тоже остаётся и его можно менять через форму,
            при этом цвет также меняется.
            Если надо скрыть название цвета в таблице, 
            то можно присвоить ему ксс класс hidden:
            td.firstChild.classList.add("hidden")
            Я подумала, что лучше оставить название, так удобнее пользователю.

            Картинка глаза тоже легко убирается в css, это просто прикольно.
            */

            td.classList.add("eyeColor")
            const color = makeElement("div", { "class" : "eye" })
            color.style["color"] = object[column]
            
            td.insertBefore(color, td.firstChild)
        }
        return td
    }

    /** 
     * убирает открытую страницу и добавляет новую,
     * обновляет стейт открытой таблицы и меню переключения таблицы
     * @param {number} i страница на которую надо переключиться
    */
    changePage(i) {
        this.currentPage = i
        this.rerenderTable()
        this.tableMenuPages()
    }

    /** 
     * сортирует по алфавиту или в обратном порядке
     * @param {HTMLTableCellElement} th заголовок сортируемой колонки
     * @param {string} column название сортируемой колонки
    */
    tableSort(th, column) {
        if (th.sortAscending) {
            // сортирует по алфавиту
            this.objects.sort(
                (objA, objB) => objA[column] > objB[column] ? 1 : -1
            )
        } 
        else {
            // обратная сортировка
            this.objects.sort(
                (objA, objB) => objA[column] < objB[column] ? 1 : -1
            )
        }
        this.rerenderTable() // обновление таблицы
        this.tableMenuSorting(th.sortAscending, column) // обновление меню
        th.sortAscending = !th.sortAscending // обновление состояния
    }
    
    /** 
     * создаёт чекбоксы для отображения/скрытия колонок 
     * @param {string} column название скрываемой колонки
     * @param {number} i номер скрываемой колонки
     * @returns {HTMLInputElement} чекбокс отображения/скрытия колонки
    */
    createHideCheckbox(column, i) {
        const checkbox = makeElement(
            "input",
            {
                type: "checkbox",
                name: column,
                checked: true,
                "change": () => this.hideColumn(column, i)
            }
        )
        return checkbox
}

    /** 
     * скрывает/возвращает выбранную колонку, 
     * обновляет стейт отображения колонки 
     * @param {string} column название скрываемой колонки
     * @param {number} i номер скрываемой колонки
    */
    hideColumn(column, i) {
        for (const each of this.tableEl.rows) {
            each.children[i].classList.toggle("hidden")
        }
        this.columns[column].hidden = !this.columns[column].hidden
    }

    /** 
     * создание или изменение формы изменения объекта (строки) таблицы
     * @param {object} object изменяемый объект (строка)
    */
    editObj(object) {
        let form
        const formName = "editObj"
        if (!this.formOpen) {
            // создание формы с инпутами 
            // (их значение - значение нужной колонки по имени инпута)
            form = makeElement(
                "form",
                { name: formName },
                    ...Object.keys(this.columns).map((column) =>
                        makeElement(
                            "input",
                            {
                                value: object[column],
                                name: column
                            }
                        )
                    ),
                    makeElement(
                        "button",
                        { type: "submit" },
                            "✓"
                    ),
                    makeElement(
                        "button",
                        {
                            type: "button",
                            "click" : () => this.hideForm(form)
                        },
                            "☓"
                    )
            )
            
            this.tableMenu.append(form)
            this.formOpen = true
        }
        else {
            // если форма уже открыта, то берёт форму из документа
            // обновляет инпуты
            form = document.forms[formName]
            const inputNames = Object.keys(this.columns)
            for (const input of inputNames) {
                form[input].value = object[input]
            }
        }

        // обработка подтверждения формы
        form.onsubmit = (e) =>
            this.handleEditSubmit(e, form.name, object,
                ...Object.keys(this.columns).map((column) => column))
    }

    /** 
     * изменяет объект в соответсвии с данными в форме, обновляет таблицу
     * @param {SubmitEvent} e submitEvent для предотвращения стандартного поведения
     * @param {string} formName название формы
     * @param {object} object изменяемый объект (строка)
     * @param {string[]} inputNames названия инпутов равные названиям соответствующих колонок
    */
    handleEditSubmit(e, formName, object, ...inputNames) {
        // предотвращает стандартное поведение
        e.preventDefault()
        const form = document.forms[formName]
        // обновляет объекту данные по нужной форме
        for (const prop of inputNames) {
            object[prop] = form[prop].value
        }
        this.rerenderTable()
        this.hideForm(form)
    }

    /** закрывает форму редактирования данных, обновляет стейт формы 
     * @param {HTMLFormElement} form форма, которую надо закрыть
    */
    hideForm(form) {
        form.remove()
        this.formOpen = false
    }

    /** 
     * обновляет таблицу 
    */
    rerenderTable() {
        // убирает старый вариант тела таблицы
        this.tableEl.tBodies[0].remove() 
        // создаёт новый вариант тела таблицы
        this.fillTable() 
    }
}