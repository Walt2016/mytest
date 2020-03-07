function _random() {
    return "_" + Math.random().toString(16).slice(2)
}

function _query(el, parent) {
    if (parent) {
        if (typeof parent == "string") {
            if (parent.charAt(0).match(/[\#\.]/)) {
                return document.querySelector(parent + " " + el)
            }
            return document.querySelector("#" + parent + " " + el)
        }
        return document.querySelector("#" + parent.id + " " + el)
    }
    return document.querySelector(el)
}

function _queryAll(el, parent) {
    if (parent) {
        if (typeof parent == "string") {
            if (parent.charAt(0).match(/[\#\.]/)) {
                return document.querySelectorAll(parent + " " + el)
            }
            return document.querySelectorAll("#" + parent + " " + el)
        }
        return document.querySelectorAll("#" + parent.id + " " + el)
    }
    return document.querySelectorAll(el)
}

function _form(options) {
    let {
        el,
        fields,
        click,
        events = [],
        btn,
        btns = [],
        title
    } = options
    el = el ? document.querySelector(el) : document.body
    let id = _random()
    let form = _div({
        class: 'form',
        id
    })
    let formBody = _div({
        class: 'form_body'
    })
    fields.forEach(t => {
        formBody.appendChild(_formItem(t, id))
    })
    let formHeader = _div({
        class: "form_header",
        text: title
    })

    let formFooter = _div({
        class: "form_footer"
    });
    if (events.length == 0 && click) {
        events = [click]
    }

    // events.forEach((t, i) => {

    //     formFooter.appendChild(_btn({
    //         click: t,
    //         text: t.text, //"执行" + i,
    //         form: "#" + id,
    //         name: 'btn' + i
    //         // ,
    //         // outputType: i > 0 ? "form" : ""
    //     }))

    // })

    if (btn) {
        formFooter.appendChild(_btn(
            Object.assign(btn, {
                form: id,
                fields
            })

        ))
    }

    form.appendChild(formHeader)
    form.appendChild(formBody)
    form.appendChild(formFooter)
    el.appendChild(form)
    return form
}

function _btn({
    click,
    text,
    form,
    name,
    fields
}) {
    let btn = document.createElement("button")
    btn.setAttribute("type", "button")
    btn.setAttribute("form", form)
    btn.innerText = text
    btn.name = name

    btn.onclick = (e) => {
        let form = e.target.getAttribute("form")

        console.log(fields)
        let bizModel = {}
        if (fields) {
            fields.forEach(t => {
                bizModel[t.key] = _query("[name='" + t.key + "']", form).value
            })
        }



        let inputs = _queryAll("[name='input']", form)
        let output = _query("[name='output']", form)
        let fn = _query("[name='function']", form)


        // let inputs = document.querySelectorAll(form + " [name='input']")
        // let output = document.querySelector(form + " [name='output']")
        // let fn = document.querySelector(form + " [name='function']") //textarea
        let values = []
        inputs.forEach(t => {
            values.push(JSON.parse(t.value))
        })
        let result = ""
        switch (name) {
            case "submit":
                click(bizModel)

                _query("#" + form).appendChild(_div({
                        text: JSON.stringify(bizModel)
                    }
                ))




                break;
            case "to_form":
                click(JSON.parse(output.value));
                // result = JSON.stringify(click(JSON.parse(output.value)))
                break;

            default:

                if (fn) {
                    try {
                        let e_str = "(" + fn.value + ")(...values)"
                        result = JSON.stringify(eval(e_str))
                    } catch (e) {
                        result = e
                    }

                } else {
                    result = JSON.stringify(click(...values))

                }


                if (output) {
                    output.value = result
                }


        }
    }
    return btn
}

function _div(options) {
    let div = document.createElement("div")
    for (let key in options) {
        if (key == "text") {
            div.innerText = options[key]
        } else {
            div.setAttribute(key, options[key])
        }
    }
    return div
}

function _input(options) {
    let {
        id,
        value
    } = options
    let input = document.createElement("input")
    input.setAttribute("type", "text")
    for (let key in options) {
        if (key == "id") {
            input.setAttribute(key, id)
        } else if (key == "value") {
            if (value) {
                input.value = JSON.stringify(value)
            }
        } else {
            input.setAttribute(key, options[key])
        }
    }
    return input
}

function _textarea(options) {
    let {
        id,
        value
    } = options
    let textarea = document.createElement("textarea")
    for (let key in options) {
        if (key == "id") {
            textarea.setAttribute(key, id)
        } else if (key == "text") {
            textarea.innerHTML = options[key]
        } else if (key == "value") {
            if (value) {
                textarea.value = JSON.stringify(value)
            }
        } else {
            textarea.setAttribute(key, options[key])
        }
    }
    return textarea
}

function _trueorfalse(options) {
    let {
        value
    } = options
    let select = document.createElement("select");
    for (let key in options) {
        select.setAttribute(key, options[key])
    }
    [{
        label: "true",
        value: true
    }, {
        label: "false",
        value: false
    }].forEach(t => {
        let opt = new Option(t.label, t.value);
        select.options.add(opt);
    })
    return select

}

function _formItem(field, form) {
    let {
        label,
        key,
        value,
        type,
        btn
    } = field
    let formItem = _div({
        class: "form_item"
    })
    let labelDiv = _div({
        class: "form_item_label",
        text: label
    })

    formItem.appendChild(labelDiv)

    switch (type) {
        case "textarea":
            let textarea = _textarea(Object.assign({
                class: 'form_item_textarea',
                value,
                name: key
            }, field))
            formItem.appendChild(textarea)
            break;
        case "trueorfalse":
            let div = _trueorfalse(Object.assign({
                class: 'form_item_select',
                name: key
            }, field))
            formItem.appendChild(div)
            break;
        default:
            let input = _input({
                class: 'form_item_input',
                value,
                name: key
            })
            formItem.appendChild(input)
    }
    if (btn) {
        formItem.appendChild(_btn(Object.assign(btn, {
            form
        })))
    }
    return formItem

}

function _wrapper(options) {
    let {
        title,
        events,
        inputs
    } = options
    let fields = inputs.map(t => {
        console.log(typeof t)
        let type = "textarea"
        if (typeof t == "boolean") {
            type = "trueorfalse"
        }

        return {
            label: 'input',
            key: 'input',
            type,
            value: t
        }
    })

    fields.push({
        label: 'function',
        key: 'function',
        type: 'textarea',
        text: events[0], //onclick
        btn: {
            text: "exe",
            click: events[0],
            name: 'exe'
        }
    })
    fields.push({
        label: 'output',
        key: 'output',
        type: 'textarea',
        btn: {
            text: "toForm",
            click: events[1],
            name: 'to_form'
        }
    })
    return _form({
        el: "#wrapper",
        fields,
        // events,
        title
    })
}

// export {
//     _form,
//     _wrapper
// }