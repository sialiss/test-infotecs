import { makeElement } from "./makeElement.js"

export function sliceTbody(originalTbody, rowsPerPage) {
    const slicedTbodies = []
    originalTbody = slicedTbodies.slice.call(originalTbody.children)
    for (let t = 0, len = originalTbody.length, tbody; t < len; t += rowsPerPage) {
        tbody = makeElement("tbody")
        originalTbody
            .slice(t, t + rowsPerPage)
            .map(tr => tbody.appendChild(tr))
        slicedTbodies.push(tbody)
    }
    return slicedTbodies
}