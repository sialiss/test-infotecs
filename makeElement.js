export function makeElement(type, ...children) {
        // создание элемента, добавление ему детей (если есть)
        // функция упрощает читаемость кода, вводит структурированность
        const elem = document.createElement(type)
        elem.append(...children)
        return elem
}