async function handleTaskSelection(event) {
  const task = event.target.value;
  insertSpinnerInPlaceholder(
    "import_selection_container",
    true,
    CHATBOT_RESPONSE_SPINNER
  );
  setTimeout(async function handleSubmission() {
    await postDataAndEmbedTemplateInPlaceholder(
      "/design_assistant/task",
      "import_selection_container",
      task
    );
    assignClickEventToImportForm();
  }, 1000);

  const task_options = document.querySelectorAll(".task_field_option");
  task_options.forEach(function (other_option) {
    if (other_option !== this) {
      other_option.disabled = true;
    }
  });
}


async function handleImportSelection(event) {
  const import_selection = event.target.value;
  insertSpinnerInPlaceholder(
    "material_type_container",
    true,
    CHATBOT_RESPONSE_SPINNER
  );
  setTimeout(async function handleSubmission() {
    await postDataAndEmbedTemplateInPlaceholder(
      "/design_assistant/import_selection",
      "material_type_container",
      import_selection
      );
    assignClickEventToMaterialTypeField();
  }, 1000)
  const import_options = document.querySelectorAll(".import_selection_option");
  import_options.forEach(function (other_option) {
    if (other_option !== this) {
      other_option.disabled = true;
    }
  });
}

async function handleMaterialTypeSelection(event) {
  const material_type_selection = event.target.value;
    insertSpinnerInPlaceholder(
    "design_targets_container",
    true,
    CHATBOT_RESPONSE_SPINNER
  );
  setTimeout(async function handleSubmission () {
    await postDataAndEmbedTemplateInPlaceholder(
      "/design_assistant/material_type",
      "design_targets_container",
      material_type_selection
    );
    assignClickEventToSubmitButton(
      "design_targets_submit_button",
      handleDesignTargetsSubmission
    );
    assignClickEventToDesignTargetForm();
    assignClickEventToSubmitButton(
      "additional_design_targets_button",
      handleAddingDesignTargets
    );
  },1000)
  const material_type_options = document.querySelectorAll(
    ".material_type_field_option"
  );
  material_type_options.forEach(function (other_option) {
    if (other_option !== this) {
      other_option.disabled = true;
    }
  });
}

async function handleDesignTargetsSubmission(event) {
  let design_targets = {};
  const design_target_options = document.querySelectorAll(".design_target_option");
  design_target_options.forEach(function (option) {
    if (option.checked) {
      const design_target_value = option.closest("div").nextElementSibling.querySelector(".design_target_value");
      design_targets[option.value] = design_target_value.value;
      option.disabled = true;
    }
  });
  document.getElementById("additional_design_targets_button").disabled = true;
  document.getElementById("design_targets_submit_button").disabled = true;
  insertSpinnerInPlaceholder( "powders_container", true, CHATBOT_RESPONSE_SPINNER );
  setTimeout(async function handleSubmission() {
      await postDataAndEmbedTemplateInPlaceholder( "/design_assistant/design_targets", "powders_container", design_targets);
      assignClickEventToSubmitButton( "powders_submit_button", handlePowdersSubmission);
      assignClickEventToPowdersForm();
  },1000)
}

function handleDesignTargetsSelection(event) {
  const design_target_value = event.target
    .closest("div")
    .nextElementSibling.querySelector(".design_target_value");
  if (design_target_value.disabled) {
    design_target_value.disabled = false;
    design_target_value.focus();
  } else {
    design_target_value.disabled = true;
    design_target_value.value = "";
  }
  const design_target_options = document.querySelectorAll(
    ".design_target_option"
  );
  const count = countSelectedOptions(design_target_options);
  const submit_button = document.getElementById("design_targets_submit_button");
  design_target_options.forEach(function (design_target_option) {
    if (count >= 2 && !design_target_option.checked) {
      design_target_option.disabled = true;
    } else {
      design_target_option.disabled = false;
    }
  });
  if (count >= 1) {
    submit_button.disabled = false;
  } else {
    submit_button.disabled = true;
  }
}

async function handlePowdersSubmission() {
  const powders_submission = {};
  const selected_powders = [];
  const powders_options = document.querySelectorAll(".powder_option");
  powders_options.forEach(function (option) {
    if (option.checked) {
      console.log(option);
      selected_powders.push(option.value);
    }
    option.disabled = true;
  });
  powders_submission["selected_powders"] = selected_powders;
  const blend_powder_options = document.querySelectorAll(".blend_powder_option");
  blend_powder_options.forEach(function (option) {
    if (option.checked) {
      powders_submission["blend_powders"] = option.value;
    }
    option.disabled = true;
  });
  if (!powders_submission["blend_powders"]) {
    powders_submission["blend_powders"] = "no";
  }
  document.getElementById("powders_submit_button").disabled = true;
  insertSpinnerInPlaceholder( "liquids_container", true, CHATBOT_RESPONSE_SPINNER);
  setTimeout(async function handleSubmission(){
      await postDataAndEmbedTemplateInPlaceholder(
      "/design_assistant/powders",
      "liquids_container",
      powders_submission
    );
    assignClickEventToSubmitButton("submit_liquid_button", handleLiquidSubmission);
    assignClickEventToSubmitButton("additional_liquid_button", handleAddingLiquid);
    assignClickEventToLiquidForm();
  }, 1000)
}

function handlePowdersSelection() {
  const powders_options = document.querySelectorAll(".powder_option");
  const count = countSelectedOptions(powders_options);
  const blend_powder_options = document.querySelectorAll(
    ".blend_powder_option"
  );
  console.log(count);
  blend_powder_options.forEach(function (blend_powder_option) {
    if (count >= 2) {
      blend_powder_option.disabled = false;
      document.getElementById("powders_submit_button").disabled = true;
      document.getElementById(
        "campaign_form-blend_powders_field-1"
      ).checked = false;
    } else if (count == 1) {
      document.getElementById("powders_submit_button").disabled = false;
      document.getElementById(
        "campaign_form-blend_powders_field-1"
      ).checked = true;
      blend_powder_option.disabled = true;
    } else {
      blend_powder_option.disabled = true;
      document.getElementById("powders_submit_button").disabled = true;
    }
  });
}

function handleBlendPowdersSelection() {
  document.getElementById("powders_submit_button").disabled = false;
}

function countSelectedOptions(options) {
  let count = 0;
  options.forEach(function (option) {
    if (option.checked) {
      ++count;
    }
  });
  return count;
}

function assignClickEventToTaskForm() {
  const task_options = document.querySelectorAll(".task_field_option");
  task_options.forEach((task_option) =>
    task_option.addEventListener("click", handleTaskSelection)
  );
}

function assignClickEventToImportForm() {
  const import_options = document.querySelectorAll(".import_selection_option");
  import_options.forEach((import_option) =>
    import_option.addEventListener("click", handleImportSelection)
  );
}

function assignClickEventToMaterialTypeField() {
  const material_type_options = document.querySelectorAll(
    ".material_type_field_option"
  );
  material_type_options.forEach((material_type_option) =>
    material_type_option.addEventListener("click", handleMaterialTypeSelection)
  );
}

function assignClickEventToSubmitButton(button_id, handle_function) {
  const submit_button = document.getElementById(button_id);
  if (submit_button) {
    submit_button.addEventListener("click", handle_function);
  }
}

function assignClickEventToDesignTargetForm() {
  const design_target_options = document.querySelectorAll(
    ".design_target_option"
  );
  design_target_options.forEach(function (design_target_option) {
    design_target_option.addEventListener(
      "click",
      handleDesignTargetsSelection
    );
  });
}

function assignClickEventToPowdersForm() {
  const powder_options = document.querySelectorAll(".powder_option");
  powder_options.forEach(function (powder_option) {
    powder_option.addEventListener("click", handlePowdersSelection);
  });
  const blend_powder_options = document.querySelectorAll(
    ".blend_powder_option"
  );
  blend_powder_options.forEach(function (blend_powder_option) {
    blend_powder_option.addEventListener("click", handleBlendPowdersSelection);
  });
}

function assignClickEventToLiquidForm() {
  const liquid_options = document.querySelectorAll(".liquid_option");
  liquid_options.forEach(function (liquid_option) {
    liquid_option.addEventListener("click", handleLiquidSelection);
  });
}

async function handleDeleteDesignAssistantSession() {
  const token = document.getElementById("csrf_token").value;
  const response = await fetch("/design_assistant/delete_session", {
    method: "POST",
    headers: {
      "X-CSRF-TOKEN": token,
    },
  });
  if (response.ok) {
    window.location.reload();
  } else {
    const error = await response.text();
    document.write(error);
  }
}

function handleAddingDesignTargets() {
  console.log("working");

  const container = document.getElementById("design_target_options_container");

  const design_target_option_container = document.createElement("div");
  design_target_option_container.classList.add(
    "design_target_option_container",
    "d-flex",
    "justify-content-between",
    "additional_design_target_input"
  );

  const design_target_option_container_2 = document.createElement("div");

  const design_target_option_input_checkbox = document.createElement("input");
  design_target_option_input_checkbox.classList.add("design_target_option");
  design_target_option_input_checkbox.type = "checkbox";
  design_target_option_input_checkbox.value =
    "additional design target checkbox";
  const design_target_option_input = document.createElement("input");

  const design_target_value_container = document.createElement("div");
  const design_target_value_unit = document.createElement("input");
  const design_target_value_input = document.createElement("input");
  design_target_option_input.placeholder = "Name of the design target";
  design_target_value_input.placeholder = "Target value";
  design_target_value_input.type = "number";
  design_target_value_input.disabled = "true";
  design_target_value_input.step = "0.01";
  design_target_value_unit.placeholder = "Unit";

  design_target_value_input.classList.add("design_target_value");

  design_target_value_container.appendChild(design_target_value_unit);
  design_target_value_container.appendChild(design_target_value_input);

  design_target_option_container_2.appendChild(
    design_target_option_input_checkbox
  );
  design_target_option_container_2.appendChild(design_target_option_input);
  design_target_option_container.appendChild(design_target_option_container_2);
  design_target_option_container.appendChild(design_target_value_container);
  container.appendChild(design_target_option_container);

  design_target_option_input.addEventListener("input", function (event) {
    const design_target_option =
      event.target.closest("input").previousElementSibling;

    design_target_option.value = event.target.value.toLowerCase();
    console.log(design_target_option);
  });
  assignClickEventToDesignTargetForm();
  assignInputEventToLiquidForm();
}

async function handleLiquidSubmission() {
  const submit_liquid_button = document.getElementById("submit_liquid_button");
  submit_liquid_button.disabled = "true";
  const additional_liquid_button = document.getElementById(
    "additional_liquid_button"
  );
  additional_liquid_button.disabled = "true";
  const liquid_options = document.querySelectorAll(".liquid_option");
  let liquid;
  liquid_options.forEach(function (liquid_option) {
    if (liquid_option.checked) {
      liquid = liquid_option.value;
    }
    liquid_option.disabled = "true";
  });
  insertSpinnerInPlaceholder( "other_container", true, CHATBOT_RESPONSE_SPINNER );
  setTimeout(async function handleSubmission() {
    await postDataAndEmbedTemplateInPlaceholder(
      "/design_assistant/liquid",
      "other_container",
      liquid
    );
    assignClickEventToSubmitButton("submit_other_button", handleOtherSubmission);
    assignClickEventToSubmitButton("additional_other_button", handleAddingOther);
    assignClickEventToOtherForm();
  },1000)
}

function handleLiquidSelection(event) {
  const submit_liquid_button = document.getElementById("submit_liquid_button");
  if (event.target.classList.contains("custom_liquid_option")) {
    const custom_liquid_option_name = event.target.nextElementSibling;
    if (custom_liquid_option_name.value) {
      submit_liquid_button.disabled = false;
    }
  } else {
    submit_liquid_button.disabled = false;
  }
}

function handleCustomLiquidNaming(event) {
  const submit_liquid_button = document.getElementById("submit_liquid_button");
  const custom_liquid_option = event.target.previousElementSibling;
  custom_liquid_option.value = event.target.value;
  if (event.target.value && custom_liquid_option.checked) {
    submit_liquid_button.disabled = false;
  } else {
    submit_liquid_button.disabled = true;
  }
}

function assignInputEventToLiquidForm() {
  const custom_liquid_name_fields = document.querySelectorAll(
    ".liquid_option_name"
  );
  custom_liquid_name_fields.forEach(function (custom_liquid_name_field) {
    custom_liquid_name_field.addEventListener(
      "input",
      handleCustomLiquidNaming
    );
  });
}

function handleAddingLiquid() {
  const liquids_container = document.getElementById("liquids_option_container");

  const liquid_container = document.createElement("div");
  const liquid_name_input = document.createElement("input");
  const liquid_option_input = document.createElement("input");
  liquid_option_input.type = "radio";
  liquid_option_input.name = "liquid_option";
  liquid_option_input.classList.add("liquid_option", "custom_liquid_option");
  liquid_name_input.placeholder = "Name of liquid";
  liquid_name_input.classList.add("liquid_option_name");

  liquid_container.appendChild(liquid_option_input);
  liquid_container.appendChild(liquid_name_input);
  liquids_container.appendChild(liquid_container);
  assignClickEventToLiquidForm();
  assignInputEventToLiquidForm();
}
///

function assignClickEventToOtherForm() {
  const other_options = document.querySelectorAll(".other_option");
  other_options.forEach(function (other_option) {
    other_option.addEventListener("click", handleOtherSelection);
  });
}

async function handleOtherSubmission() {
  const submit_other_button = document.getElementById("submit_other_button");
  submit_other_button.disabled = "true";
  const additional_other_button = document.getElementById(
    "additional_other_button"
  );
  additional_other_button.disabled = "true";
  const other_options = document.querySelectorAll(".other_option");
  let other;
  other_options.forEach(function (other_option) {
    if (other_option.checked) {
      other = other_option.value;
    }
    other_option.disabled = "true";
  });
  console.log(other);
  insertSpinnerInPlaceholder( "knowledge_container", true, CHATBOT_RESPONSE_SPINNER );
  setTimeout(async function handleSubmission(){
    await postDataAndEmbedTemplateInPlaceholder(
      "/design_assistant/other",
      "knowledge_container",
      other
    );
    assignInputEventToCommentForm();
    assignClickEventToSubmitButton("submit_comment_button", handleCommentSubmission);
  },1000)
}

function handleOtherSelection(event) {
  const submit_other_button = document.getElementById("submit_other_button");
  if (event.target.classList.contains("custom_other_option")) {
    const custom_other_option_name = event.target.nextElementSibling;
    if (custom_other_option_name.value) {
      submit_other_button.disabled = false;
    }
  } else {
    submit_other_button.disabled = false;
  }
}

function handleCustomOtherNaming(event) {
  const submit_other_button = document.getElementById("submit_other_button");
  const custom_other_option = event.target.previousElementSibling;
  custom_other_option.value = event.target.value;
  if (event.target.value && custom_other_option.checked) {
    submit_other_button.disabled = false;
  } else {
    submit_other_button.disabled = true;
  }
}

function assignInputEventToOtherForm() {
  const custom_other_name_fields =
    document.querySelectorAll(".other_option_name");
  custom_other_name_fields.forEach(function (custom_other_name_field) {
    custom_other_name_field.addEventListener("input", handleCustomOtherNaming);
  });
}

function handleAddingOther() {
  const others_container = document.getElementById("other_option_container");

  const other_container = document.createElement("div");
  const other_name_input = document.createElement("input");
  const other_option_input = document.createElement("input");
  other_option_input.type = "radio";
  other_option_input.name = "other_option";
  other_option_input.classList.add("other_option", "custom_other_option");
  other_name_input.placeholder = "Name of other";
  other_name_input.classList.add("other_option_name");

  other_container.appendChild(other_option_input);
  other_container.appendChild(other_name_input);
  others_container.appendChild(other_container);
  assignClickEventToOtherForm();
  assignInputEventToOtherForm();
}

function assignInputEventToCommentForm() {
  const comment_input = document.getElementById("comment");
  if (comment_input) {
    comment_input.addEventListener("input", handleCommentInput);
  }
}

function handleCommentInput(event) {
  const comment_input = document.getElementById("comment");
  const submit_comment_button = document.getElementById(
    "submit_comment_button"
  );
  console.log(comment_input.value)
  comment_input.value = event.target.value;
  if (comment_input.value) {
    submit_comment_button.disabled = false;
  }
}

async function handleCommentSubmission() {
  const comment_input = document.getElementById("comment");
  comment_input.disabled = "true";
  const submit_comment_button = document.getElementById(
    "submit_comment_button"
  );
  submit_comment_button.disabled = "true";
  insertSpinnerInPlaceholder( "knowledge_container", true, CHATBOT_RESPONSE_SPINNER );
  setTimeout(async function handleSubmission() {
    await postDataAndEmbedTemplateInPlaceholder(
      "/design_assistant/comment",
      "knowledge_container",
      comment_input.value
    );
  },1000)

}

window.addEventListener("load", function () {
  assignClickEventToSubmitButton(
    "delete_session_button",
    handleDeleteDesignAssistantSession
  );
  assignClickEventToTaskForm();
  assignClickEventToImportForm();
  assignClickEventToMaterialTypeField();
  assignClickEventToSubmitButton(
    "design_targets_submit_button",
    handleDesignTargetsSubmission
  );
  assignClickEventToSubmitButton(
    "powders_submit_button",
    handlePowdersSubmission
  );
  assignClickEventToDesignTargetForm();
  assignClickEventToPowdersForm();
  assignClickEventToSubmitButton(
    "additional_design_targets_button",
    handleAddingDesignTargets
  );
  assignClickEventToSubmitButton(
    "submit_liquid_button",
    handleLiquidSubmission
  );
  assignClickEventToSubmitButton(
    "additional_liquid_button",
    handleAddingLiquid
  );
  assignClickEventToLiquidForm();
  assignClickEventToSubmitButton("submit_other_button", handleOtherSubmission);
  assignClickEventToSubmitButton("additional_other_button", handleAddingOther);
  assignClickEventToOtherForm();
  assignInputEventToCommentForm();
  assignClickEventToSubmitButton(
    "submit_comment_button",
    handleCommentSubmission
  );
});
