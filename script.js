const formData = [];
const formContainer = document.getElementById('form-container');

function renderForm() {
    formContainer.innerHTML = '';
    formData.forEach(element => {
        const formElement = document.createElement('div');
        formElement.classList.add('form-element');
        formElement.draggable = true;
        formElement.dataset.id = element.id;

        const labelDiv = document.createElement('div');
        labelDiv.textContent = element.label;
        formElement.appendChild(labelDiv);

        const controlDiv = document.createElement('div');

        if (element.type === 'select') {
            const selectElement = document.createElement('select');
            selectElement.classList.add('select');
            element.placeholder.forEach(optionText => {
                const option = document.createElement('option');
                option.text = optionText;
                selectElement.add(option);
            });
            controlDiv.appendChild(selectElement);
        } else {
            const dynamicElement = document.createElement(element.type);
            dynamicElement.classList.add('type');
            if (element.type === 'input' || element.type === 'textarea') {
                dynamicElement.placeholder = element.placeholder || 'Sample placeholder';
            }
            controlDiv.appendChild(dynamicElement);
        }

        formElement.appendChild(controlDiv);

        formElement.innerHTML += `
            <div class="delete-btn" onclick="deleteElement('${element.id}')">
                <i class="material-icons">delete</i>
            </div>
        </div>`;

        formContainer.appendChild(formElement);
    });

    initDragAndDrop();
}

function addNewElement(type) {
    let label = '';
    switch (type) {
        case 'input':
            label = 'Sample Label';
            break;
        case 'select':
            label = 'Select';
            break;
        case 'textarea':
            label = 'Textarea';
            break;
        default:
            break;
    }

    const newElement = {
        id: generateUniqueId(),
        type: type,
        label: label,
        placeholder: type === 'select' ? ['Sample Option', 'Sample Option', 'Sample Option'] : 'Sample placeholder'
    };
    formData.push(newElement);
    renderForm();
}

function generateUniqueId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function initDragAndDrop() {
    const formElements = document.querySelectorAll('.form-element');

    formElements.forEach(formElement => {
        formElement.addEventListener('dragstart', () => {
            formElement.classList.add('dragging');
        });

        formElement.addEventListener('dragend', () => {
            formElement.classList.remove('dragging');
            updateFormDataOrder();
        });
    });

    formContainer.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(formContainer, e.clientY);
        const draggingElement = document.querySelector('.dragging');
        if (afterElement == null) {
            formContainer.appendChild(draggingElement);
        } else {
            formContainer.insertBefore(draggingElement, afterElement);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.form-element:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function deleteElement(id) {
    formData.splice(formData.findIndex(element => element.id === id), 1);
    renderForm();
}

function updateFormDataOrder() {
    const newOrder = [];
    const formElements = document.querySelectorAll('.form-element');
    formElements.forEach(formElement => {
        const id = formElement.dataset.id;
        const element = formData.find(el => el.id === id);
        newOrder.push(element);
    });
    formData.length = 0;
    formData.push(...newOrder);
}

function saveForm() {
    console.log(JSON.stringify(formData, null, 2));
}

renderForm();
