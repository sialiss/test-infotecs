import { getFromProperties } from "./getFromProperties.js"

export function processObj(object, columns) {
        const processedObj = {}
        for (const column of Object.keys(columns)) {
            if (object[column] != undefined) {
                // если у объекта json есть колонка с нужным названием,
                // то ячейка заполняется
                processedObj[column] = object[column]
            }
            else {
                // если колонка не определена, 
                // то проверяет есть ли нужные данные в свойствах
                processedObj[column] = getFromProperties(object, column)
            }
        }
        return processedObj
    }