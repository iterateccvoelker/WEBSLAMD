const CEMENT_FORMULATIONS_MATERIALS_URL = `${window.location.protocol}//${window.location.host}/materials/formulations/cement`;
let cementWeightConstraint = "";

async function confirmSelection() {
    removeInnerHtmlFromPlaceholder("formulations_min_max_placeholder");
    removeInnerHtmlFromPlaceholder("formulations_weights_placeholder");
    document.getElementById("submit").disabled = true;
    cementWeightConstraint = document.getElementById("weight_constraint").value;

    const selectedMaterials = collectCementFormulationSelection();
    const url = `${CEMENT_FORMULATIONS_MATERIALS_URL}/add_min_max_entries`;

    insertSpinnerInPlaceholder("formulations_min_max_placeholder");
    await postDataAndEmbedTemplateInPlaceholder(url, "formulations_min_max_placeholder", selectedMaterials);
    removeSpinnerInPlaceholder("formulations_min_max_placeholder");

    addListenersToIndependentFields();
    assignConfirmFormulationsConfigurationEvent();
}

window.addEventListener("load", function () {
    document.getElementById("confirm_materials_and_processes_selection_button").addEventListener("click", confirmSelection);

    document.getElementById("change_materials_and_processes_selection_button").disabled = false;
    document.getElementById("submit").disabled = false;
    document.getElementById("delete_formulations_batches_button").disabled = false;
});
