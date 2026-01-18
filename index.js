const filters = {
    brightness: {
        value: 100,
        min: 0,
        max: 200, 
        unit: "%"
    },
    contrast: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%"
    },
    saturation: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%"
    },
    hueRotation: {
        value: 0,
        min: 0,
        max: 360,
        unit: "deg"
    },
    blur: {
        value: 0,
        min: 0,
        max: 20,
        unit: "px"
    },
    grayscale: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%"
    },
    sepia: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%"
    },
    opacity: {
        value: 100,
        min: 0,
        max: 100,
        unit: "%"
    },
    invert: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%"
    }
}

const imageCanvas = document.querySelector("#image-canvas");
const imgInput = document.querySelector("#image-input");
const canvasCtx = imageCanvas.getContext("2d");

const filtersContainer = document.querySelector(".filters");

function createFilterElement(name, unit = "%", value, min, max) {

    const div = document.createElement("div");
    div.classList.add("filter");

    const input = document.createElement("input");
    input.type = "range";
    input.min = min;
    input.max = max;
    input.value = value;
    input.id = name;

    const p = document.createElement("p");
    p.innerText = name

    div.appendChild(p);
    div.appendChild(input);

    return div;
}

let originalImage = null;

Object.keys(filters).forEach(filter => {
    const filterElement = createFilterElement(filter, filters[filter].unit, filters[filter].value, filters[filter].min, filters[filter].max);
    filtersContainer.appendChild(filterElement);
});

function applyFilters() {
    if (!originalImage) return;
    
    const b = filters.brightness.value;
    const c = filters.contrast.value;
    const s = filters.saturation.value;
    const h = filters.hueRotation.value;
    const bl = filters.blur.value;
    const g = filters.grayscale.value;
    const sp = filters.sepia.value;
    const o = filters.opacity.value;
    const i = filters.invert.value;

    const filterString = `
        brightness(${b}%) 
        contrast(${c}%) 
        saturate(${s}%) 
        hue-rotate(${h}deg) 
        blur(${bl}px) 
        grayscale(${g}%) 
        sepia(${sp}%) 
        invert(${i}%)
        opacity(${o}%)
    `;

    imageCanvas.style.filter = filterString;
}

const filterInputs = document.querySelectorAll(".filter input");
filterInputs.forEach(input => {
    input.addEventListener("input", (e) => {
        const filterName = e.target.id;
        filters[filterName].value = e.target.value;
        applyFilters();
    });
});

imgInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const imagePlaceholder = document.querySelector("#placeholder");
    
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = function() {
        originalImage = img;
        imagePlaceholder.style.display = "none";
        imageCanvas.width = img.width;
        imageCanvas.height = img.height;
        canvasCtx.drawImage(img, 0, 0);
        applyFilters();
    };
});

document.getElementById("reset-btn").addEventListener("click", () => {
    Object.keys(filters).forEach(key => {
        filters[key].value = filters[key].value === 0 ? 0 : 100;
        const input = document.getElementById(key);
        if (input) {
            input.value = filters[key].value;
        }
    });
    imageCanvas.style.filter = "none";
});

document.getElementById("download-btn").addEventListener("click", () => {
    if (!originalImage) {
        alert("Please select an image first");
        return;
    }
    
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = imageCanvas.toDataURL();
    link.click();
});    