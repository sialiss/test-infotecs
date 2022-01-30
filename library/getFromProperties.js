export function getFromProperties(object, nedeedData) {
        // берёт нужные данные в свойствах (если нет, то undefined)
        // проходит по всем свойствам объекта json, 
        // если находит, возвращает необходимую информацию
        for (const name of Object.keys(object)) {
                    if (object[name][nedeedData]) {
                        return object[name][nedeedData]
                    }
                }
    }