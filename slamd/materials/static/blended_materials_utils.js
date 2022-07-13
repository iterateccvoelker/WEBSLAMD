function collectBaseMaterialSelection(placeholder) {
    count = 0
    selectedMaterials = []
    if (placeholder.childElementCount !== 0) {
        let options = placeholder.children;
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                count++
                selectedMaterials.push({
                    uuid: options[i].value,
                    name: options[i].innerHTML
                })
            }
        }
    }
    return {count, selectedMaterials};
}

function countSelectedBaseMaterials(placeholder) {
    count = 0
    if (placeholder.childElementCount !== 0) {
        let options = placeholder.children;
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                count++
            }
        }
    }
    return count;
}

function resetConfiguration() {
    let minMaxPlaceholder = document.getElementById("min-max-placeholder");
    let ratioPlaceholder = document.getElementById("blending_ratio_placeholder");
    minMaxPlaceholder.innerHTML = "";
    ratioPlaceholder.innerHTML = "";
}

function prepareMinMaxInputFieldsFromSelection(selectedMaterials) {
    for (let i = 0; i < selectedMaterials.length; i++) {
        document.getElementById(`all_min_max_entries-${i}-uuid_field`).value = selectedMaterials[i].uuid;
        document.getElementById(`all_min_max_entries-${i}-blended_material_name`).value = selectedMaterials[i].name;
        if (i === selectedMaterials.length - 1) {
            document.getElementById(`all_min_max_entries-${i}-increment`).disabled = true;
            document.getElementById(`all_min_max_entries-${i}-max`).disabled = true;
            document.getElementById(`all_min_max_entries-${i}-min`).disabled = true;
        }
    }
}

function toggleConfirmBlendingButton(independentInputFields) {
    let allIncrementsFilled = independentInputFields.filter(item => item['increment'].value === "").length === 0;
    let allMinFilled = independentInputFields.filter(item => item['min'].value === "").length === 0;
    let allMaxFilled = independentInputFields.filter(item => item['max'].value === "").length === 0;
    document.getElementById("confirm_blending_configuration_button").disabled = !(allIncrementsFilled && allMinFilled && allMaxFilled);
}

function assignKeyboardEventsToRatiosForm() {
    const numberOfRatioFields = document.querySelectorAll('[id$="-ratio"]').length;

    let ratioInputFields = []
    for (let i = 0; i < numberOfRatioFields; i++) {
        let ratio = document.getElementById(`all_ratio_entries-${i}-ratio`)
        ratioInputFields.push(ratio)
    }

    let numberOfBaseMaterials = document.querySelectorAll('[id$="-min"]').length - 1;
    for(let ratioInput of ratioInputFields){
        ratioInput.addEventListener("keyup", () => {


            let regex = new RegExp("\^\\d+(/\\d+){" + numberOfBaseMaterials + "}$");
            if(regex.test(ratioInput.value)){
                console.log("MATCHES")
            }
            else{
                console.log("DOES NOT MATCHES")
            }

        })
    }

}

function assignKeyboardEventsToMinMaxForm() {
    let {numberOfIndependentRows, independentInputFields} = collectIndependentInputFields();

    for (let item of independentInputFields) {
        item.min.addEventListener("keyup", () => {
            computeDependentValue("min", item.min, independentInputFields, numberOfIndependentRows);
            toggleConfirmBlendingButton(independentInputFields);
        });
        item.max.addEventListener("keyup", () => {
            computeDependentValue("max", item.max, independentInputFields, numberOfIndependentRows);
            toggleConfirmBlendingButton(independentInputFields);
        });
        item.increment.addEventListener("keyup", () => {
            validateIncrementValue(item.increment)
            toggleConfirmBlendingButton(independentInputFields);
        });
    }
}

function createMinMaxValuesWithIncrements() {
    const numberOfIndependentRows = document.querySelectorAll('[id$="-min"]').length - 1;

    let minMaxValuesWithIncrements = []
    for (let i = 0; i <= numberOfIndependentRows; i++) {
        let min = document.getElementById(`all_min_max_entries-${i}-min`)
        let max = document.getElementById(`all_min_max_entries-${i}-max`)
        let increment = document.getElementById(`all_min_max_entries-${i}-increment`)
        minMaxValuesWithIncrements.push({
            idx: i,
            min: parseFloat(min.value),
            max: parseFloat(max.value),
            increment: parseFloat(increment.value)
        })
    }
    return minMaxValuesWithIncrements;
}

/**
 * The method extracts all min, max and increment input fields except the last one as the latter will be computed dynamically in terms
 * of all the other min/max values. The number of min items always equals the number of min items. Therefore we can get the
 * total number of rows simply by extracting the tags with id ending on -min.
 */
function collectIndependentInputFields() {
    const numberOfIndependentRows = document.querySelectorAll('[id$="-min"]').length - 1;

    let independentInputFields = []
    for (let i = 0; i <= numberOfIndependentRows; i++) {
        if (i !== numberOfIndependentRows) {
            let min = document.getElementById(`all_min_max_entries-${i}-min`)
            let max = document.getElementById(`all_min_max_entries-${i}-max`)
            let increment = document.getElementById(`all_min_max_entries-${i}-increment`)
            independentInputFields.push({
                min: min,
                max: max,
                increment: increment
            })
        }
    }
    return {numberOfIndependentRows, independentInputFields};
}

function computeDependentValue(type, currentInputField, independentMinMaxInputFields, numberOfIndependentRows) {
    const unfilledMinFields = independentMinMaxInputFields.filter(item => item[type].value === "");

    const moreThanTwoDigitsDotSeperated = /^\d*\.\d{3,}$/;
    const moreThanTwoDigitsColonSeperated = /^\d*\\,\d{3,}$/;

    if (moreThanTwoDigitsDotSeperated.test(currentInputField.value) || moreThanTwoDigitsColonSeperated.test(currentInputField.value)) {
        currentInputField.value = parseFloat(currentInputField.value).toFixed(2);
    }

    if (currentInputField.value < 0) {
        currentInputField.value = 0;
    }

    let sum = independentMinMaxInputFields
        .filter(item => item[type].value !== "")
        .map(item => parseFloat(item[type].value))
        .reduce((x, y) => x + y, 0);

    if (sum > 100) {
        currentInputField.value = (100 - (sum - currentInputField.value)).toFixed(2)
        sum = 100
    }
    if (unfilledMinFields.length === 0) {
        const lastMinItem = document.getElementById(`all_min_max_entries-${numberOfIndependentRows}-${type}`);
        lastMinItem.value = (100 - sum).toFixed(2)
    }
}

function validateIncrementValue(increment) {
    const moreThanTwoDigitsDotSeperated = /^\d*\.\d{3,}$/;
    const moreThanTwoDigitsColonSeperated = /^\d*\\,\d{3,}$/;

    if (moreThanTwoDigitsDotSeperated.test(increment.value) || moreThanTwoDigitsColonSeperated.test(increment.value)) {
        increment.value = parseFloat(increment.value).toFixed(2);
    }

    if (increment.value < 0) {
        increment.value = 0;
    }
    if (increment.value > 100) {
        increment.value = 100;
    }
}
