const dragZone = document.getElementById('dragZone') as HTMLElement;

dragZone.addEventListener('pointerdown', createSquare);

const gridDropZone = document.getElementById('gridDropZone') as HTMLElement;

const fixedDropZone = document.getElementById('fixedDropZone') as HTMLElement;

let draggedSquare: HTMLElement | null = null;

function createSquare(event: PointerEvent) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.style.backgroundColor = getRandomColor();
    square.style.left = `${event.clientX - 50}px`;
    square.style.top = `${event.clientY - 50}px`;
    square.style.position = 'absolute';
    square.style.width = '100px';
    square.style.height = '100px';

    dragZone.appendChild(square);

    draggedSquare = square;

    console.log('position ', draggedSquare.style.position);

    square.setPointerCapture(event.pointerId);
    square.addEventListener('pointermove', dragSquare);
    square.addEventListener('pointerup', dropSquare);
}

function dragSquare(event: PointerEvent) {
    event.preventDefault();
    if (draggedSquare != null) {
        draggedSquare.classList.add('dragged');
        draggedSquare.style.left = `${event.clientX - 50}px`;
        draggedSquare.style.top = `${event.clientY - 50}px`;
    }
}

function dropSquare(event: PointerEvent) {
    event.preventDefault();
    if (draggedSquare) {
        draggedSquare.classList.remove('dragged');
        draggedSquare.releasePointerCapture(event.pointerId);
        draggedSquare.removeEventListener('pointermove', dragSquare);
        draggedSquare.removeEventListener('pointerup', dropSquare);

        const isInsideGrid = isInsideElement(event.clientX, event.clientY, gridDropZone);
        const isInsideFixed = isInsideElement(event.clientX, event.clientY, fixedDropZone);

        if (isInsideGrid) {
            dropGrid(event);
        } else if (isInsideFixed) {
            dropFixed(event);
        } else {
            draggedSquare.remove();
        }

        draggedSquare = null;
    }
}

function dropGrid(event: PointerEvent) {
    event.preventDefault();
    if (draggedSquare != null) {
        draggedSquare.style.position = 'static';
        gridDropZone.appendChild(draggedSquare);
    }
}

function dropFixed(event: PointerEvent) {
    console.log('fixedGrid');
    event.preventDefault();
    if (draggedSquare != null) {
        fixedDropZone.appendChild(draggedSquare);
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function isInsideElement(x: number, y: number, element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}
