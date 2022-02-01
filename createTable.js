import { makeElement } from "./library/makeElement.js"
import { processObj } from "./library/processObj.js"
import { sliceTbody } from "./library/sliceTbody.js"
export class AwesomeCoolTable {

    constructor(table, tableMenu, { rowsPerPage, columns }, data) {
        this.tableEl = table // Элемент таблицы в DOC
        this.tableMenu = tableMenu // Элемент меню в DOC
        this.rowsPerPage = rowsPerPage // Количество строк на странице
        this.columns = columns // Названия колонок в таблице
        this.data = data // Массив объектов данных из JSON
        this.pages = {} // Страницы таблицы
        this.objects = []
        for (const object of this.data) {
            // Заполняет массив обработанными объектами,
            // каждый объект содержит в свойствах необходимые для таблицы данные
            // это нужно, чтобы обработать объекты только один раз,
            // и не извлекать данные некоторых колонок из свойств объектов
                this.objects.push(processObj(object, this.columns))
        }

        for (const column of Object.keys(this.columns)) {
            // для каждой колонки стейт отображения
            this.columns[column].hidden = false
        }
        // state сортировки (включена ли)
        this.tableSortOn = false
        // state формы изменения объекта (открыта ли)
        this.formOpen = false
        // state страниц (номер открытой страницы)
        this.openedPage = 1
        // state меню переключения страниц
        this.changePageOn = false
    }

    createTable() {
        // Создание хеда таблицы
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

    createHeader(column) {
        const th = makeElement(
            "th",
            {
                // стейт сортировки колонки (по алфавиту / в обратном порядке)
                sortMore: true, 
                "click": () => this.tableSort(th, column)
            },
                String(this.columns[column].value),
        )
        return th
    }

    fillTableMenu() {
        // здесь чекбоксы для скрытия колонок, сортировка таблицы таблицы
        this.tableMenu.append(
            makeElement("form",
                { name: "hideMenu" },
                    "отображение колонок:",
                    ...Object.keys(this.columns).map((column, i) =>
                        this.createHideCheckbox(column, i)
                    )
                    
            ),
            this.tableMenuSorting()
        )
    }

    tableMenuSorting(sortMore, sort = "выключена") {
        // управление отображением состояния сортировки в меню
        // по умолчанию сортировка выключена
        if (sort == "выключена") {
            // создание элемента в меню
            this.sortingStateEl = makeElement(
                "a",
                { name: "sortingStateEl" },
                    `сортировка: ${sort}`)
            return this.sortingStateEl
        }
        else {
            // включение сортировки (обновление данных для отображения)
            let direction
            if (sortMore) {
                direction = "A-Я"
            }
            else {
                direction = "Я-А"
            }
            this.sortingStateEl.innerText =
                `сортировка: колонка "${this.columns[sort].value}" (${direction})`
        } 
    }

    tableMenuPages() {
        let form
        const formName = "pages"
        if (!this.changePageOn) {
            form = makeElement("form",
                {
                    name: formName,
                    class: "wrapper"
                },
                    makeElement("div",
                        makeElement("button",
                            {
                                type: "button",
                                name: "previous",
                                "click": () => this.changePage(this.openedPage-1)
                            },
                                "🠔"
                        ),
                        makeElement("button",
                            {
                                type: "button",
                                name: "next",
                                "click": () => this.changePage(this.openedPage+1)
                            },
                                "➝"
                        )
                    ),
                    makeElement("a",
                        { name: "pagesCount" }, 
                            `[ ${this.openedPage}/${Object.keys(this.pages).length} ]`
                    )
            )

            this.changePageOn = true
            this.tableMenu.append(form)
        }
        else {
            form = document.forms[formName]
            form.lastChild.innerText = `[ ${this.openedPage}/${Object.keys(this.pages).length} ]`
        }

        // прячет кнопки, если следующей страницы для этой кнопки не существует
        // открывает, если они есть
        if (this.pages[this.openedPage - 1] == undefined) {
            form.firstChild.firstChild.classList.add("hidden")
        }
        else {
            form.firstChild.firstChild.classList.remove("hidden")
        }
        if (this.pages[this.openedPage + 1] == undefined) {
            form.firstChild.lastChild.classList.add("hidden")
        }
        else {
            form.firstChild.lastChild.classList.remove("hidden")
        }
    }
    
    fillTable() {
        // Создаёт тело таблицы
        const tbody = makeElement(
            "tbody",
                ...this.objects.map((object) =>
                    this.createRow(object)
                )
        )

        this.createPages(tbody)
    }

    createRow(object) {
        // Заполняет данные для каждого объекта
        const tr = makeElement(
            "tr",
            { "click": () => this.editObj(object) },
                ...Object.keys(this.columns).map((column) =>
                    this.createTd(object, column))
        )
        return tr
    }

    createTd(object, column) {
        // создание и заполнение ячейки
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
            Я подумала, что лучше оставить название.
            */

            td.classList.add("eyeColor")
            const color = makeElement("img", { "class": "color" })
            color.style["background-color"] = object[column]
            
            td.insertBefore(color, td.firstChild)
        }
        return td
    }

    createPages(tbody) {
        // разбивает tbody на страницы
        // добавляет страницу по умолчанию в таблицу

        sliceTbody(tbody, this.rowsPerPage).forEach((page, i) => {
            this.pages[i+1] = page
        });
        this.tableEl.append(this.pages[this.openedPage])
        
        // создание и заполнение меню для страниц
        this.tableMenuPages()
    }

    changePage(i) {
        // убирает открытую страницу и добавляет новую
        this.tableEl.children[1].remove()
        this.tableEl.append(this.pages[i])
        // обновляет стейт открытой таблицы и меню переключения таблиц
        this.openedPage = i
        this.tableMenuPages()
    }

    tableSort(th, column) {
        if (th.sortMore) {
            // сортирует по алфавиту, если стейт true
            this.objects.sort(
                (objA, objB) => objA[column] > objB[column] ? 1 : -1
            )
        } 
        // обратная сортировка
        else {
            this.objects.sort(
                (objA, objB) => objA[column] < objB[column] ? 1 : -1
            )
        }
        this.rerenderTable() // обновление таблицы
        this.tableMenuSorting(th.sortMore, column) // обновление меню
        th.sortMore = !th.sortMore // обновление состояния
    }
    
    createHideCheckbox(column, i) {
        // создание чекбоксов для отображения/скрытия колонок
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

    hideColumn(column, i) {
        // скрывает выбранную колонку
        for (const page of Object.keys(this.pages)) {
            this.tableEl.rows[0].children[i].classList.toggle("hidden")
            this.hideCells(page, i)
        }
        // обновляет стейт отображения колонки
        this.columns[column].hidden = !this.columns[column].hidden
    }

    hideCells(page, i) {
        // скрывает ячейку нужной колонки в каждой таблице
        for (const each of this.pages[page].rows) {
               each.children[i].classList.toggle("hidden")
        }
    }

    editObj(object) {
        // форма изменения объекта (строки) таблицы
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

    handleEditSubmit(e, formName, object, ...inputNames) {
        // предотвращает стандартное поведение
        e.preventDefault()
        const form = document.forms[formName]
        // обновляет объекту данные по нужной форме
        for (const prop of inputNames) {
            object[prop] = form[prop].value
        }
        // обновляет таблицу
        this.rerenderTable()
        this.hideForm(form)
    }

    hideForm(form) {
        // закрывает форму редактирования данных
        form.remove()
        // обновляет стейт формы
        this.formOpen = false
    }

    rerenderTable() {
        // обновление таблицы

        // убирает старый вариант тела таблицы
        this.tableEl.tBodies[0].remove() 
        // создаёт новый вариант тела таблицы
        this.fillTable() 
    }
}