const FORMULATIONS_MATERIALS_URL = `${window.location.protocol}//${window.location.host}/materials/formulations`

let currentlySelectedProcesses = []

function toggleSelectionConfirmationButton() {
    const material_selection = document.getElementById("material_selection")
    const materials_selected = Array.from(material_selection.options).filter(option => option.selected);

    const changeSelectionButton = document.getElementById("change_materials_and_processes_selection_button");
    changeSelectionButton.disabled = materials_selected.length === 0
}

function toggleWeigthConstraintInput() {
    const with_constraint = document.getElementById("with_constraint")
    const checked = with_constraint.checked;
    if (checked) {
        document.getElementById("weigth_constraint").disabled = false
    } else {
        document.getElementById("weigth_constraint").disabled = true
        document.getElementById("weigth_constraint").value = ""
    }

}

function toggleProcessSelection() {
    const process_selection = document.getElementById("process_selection")

    const currentlySelectedIndex = process_selection.options.selectedIndex
    const currentlySelectedProcess = Array.from(process_selection.options)[currentlySelectedIndex];
    if (currentlySelectedProcesses.includes(currentlySelectedProcess)) {
        currentlySelectedProcesses = Array.from(process_selection.options).filter(option => option.selected && option !== currentlySelectedProcess)
        process_selection.options[currentlySelectedIndex].selected = false
    } else {
        currentlySelectedProcesses = Array.from(process_selection.options).filter(option => option.selected)
    }


}

async function confirmSelection() {
    removeInnerHtmlFromPlaceholder("formulations_min_max_placeholder")

    const materialsPlaceholder = document.getElementById("material_selection");
    const processesPlaceholder = document.getElementById("process_selection");

    const selectedMaterials = collectSelection(materialsPlaceholder);
    const selectedProcesses = collectSelection(processesPlaceholder);

    const url = `${FORMULATIONS_MATERIALS_URL}/add_min_max_entries/${selectedMaterials.length}/${selectedProcesses.length}`;
    await fetchEmbedTemplateInPlaceholder(url, "formulations_min_max_placeholder");

    prepareMaterialsMinMaxInputFieldsFromSelection(selectedMaterials);
    prepareProcessMinMaxInputFieldsFromSelection(selectedProcesses);
    assignKeyboardEventsToMinMaxForm();
}

function prepareMaterialsMinMaxInputFieldsFromSelection(selectedMaterials) {
    for (let i = 0; i < selectedMaterials.length; i++) {
        document.getElementById(`materials_min_max_entries-${i}-uuid_field`).value = selectedMaterials[i].uuid;
        document.getElementById(`materials_min_max_entries-${i}-materials_entry_name`).value = selectedMaterials[i].name;
    }
}

function prepareProcessMinMaxInputFieldsFromSelection(selectedProcesses) {
    for (let i = 0; i < selectedProcesses.length; i++) {
        document.getElementById(`processes_entries-${i}-uuid_field`).value = selectedProcesses[i].uuid;
        document.getElementById(`processes_entries-${i}-process_name`).value = selectedProcesses[i].name;
    }
}

function assignKeyboardEventsToMinMaxForm() {
    let independentInputFields = collectIndependentInputFields();

    for (let item of independentInputFields) {
        item.min.addEventListener("keyup", () => {
            computeDependentValue("min", item.min, independentInputFields);
            toggleConfirmBlendingButton(independentInputFields);
        });
        item.max.addEventListener("keyup", () => {
            computeDependentValue("max", item.max, independentInputFields);
            toggleConfirmBlendingButton(independentInputFields);
        });
        item.increment.addEventListener("keyup", () => {
            validateIncrementValue(item.increment)
            toggleConfirmBlendingButton(independentInputFields);
        });
    }
}

window.addEventListener("load", function () {
    document.getElementById("confirm_materials_and_processes_selection_button").addEventListener("click", confirmSelection);
    document.getElementById("material_selection").addEventListener("change", toggleSelectionConfirmationButton);
    document.getElementById("with_constraint").addEventListener("change", toggleWeigthConstraintInput);
    // document.getElementById("process_selection").addEventListener("click", toggleProcessSelection);
});
