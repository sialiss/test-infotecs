import { getFromProperties } from "./getFromProperties.js"

/**
 * создаёт обработанный объект,
 * добавляя ему указанные свойства оригинального объекта
 * @param {object} object - обрабатываемый объект
 * @param {Array} props - необходимые свойства
 * @returns {object} обработанный объект
*/  
export function processObj(object, props) {
    const processedObj = {}
    for (const prop of props) {
        if (object[prop] != undefined) {
            // если у объекта json есть колонка с нужным названием,
            // то ячейка заполняется
            processedObj[prop] = object[prop]
        }
        else {
            // если колонка не определена, 
            // то проверяет есть ли нужные данные в свойствах
            processedObj[prop] = getFromProperties(object, prop)
        }
    }
    return processedObj
}