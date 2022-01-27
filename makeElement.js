export function makeElement(type, ...children) {
        // создание элемента, добавление ему детей (если есть)
        const elem = document.createElement(type)
        elem.append(...children)
        return elem
}