/** берёт нужные данные в свойствах (если нет, то undefined),
 * проходит по всем свойствам объекта json, 
 * если находит, возвращает необходимую информацию
 * @param { object } object - обрабатываемый объект
 * @param { string } nedeedData - название нужного свойства
*/
export function getFromProperties(object, nedeedData) {
    for (const name of Object.keys(object)) {
        if (object[name][nedeedData]) {
            return object[name][nedeedData]
        }
    }
}