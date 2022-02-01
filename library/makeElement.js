/**
 * создаёт элемент с указанными параметрами и детьми
 * @param {string} type - тип создаваемого элемента
 * @param {any} children - (необязательно) параметры элемента, дети 
 * @returns {HTMLElement}
*/ 
export function makeElement(type, ...children) {
	// создание элемента, добавление ему детей (если есть)
	// функция упрощает читаемость кода, вводит структурированность
	const elem = document.createElement(type)
	// условие нужно для создания event listeners и свойств элемента
	// они необязательны и прописываются как объект вторым аргументом функции
	if (typeof children[0] === "object" && !(children[0] instanceof HTMLElement)) {
		const attributes = children[0]
		for (const prop of Object.keys(attributes)) {
			if (typeof attributes[prop] === "function") {
				elem.addEventListener(prop, attributes[prop])
			}
			else if (prop == "class") {
				elem.classList.add(attributes[prop])
			}
			else {
				elem[prop] = attributes[prop]
			}
		}
		elem.append(...children.slice(1))
	}
	else {
		elem.append(...children)
	}
	return elem
}