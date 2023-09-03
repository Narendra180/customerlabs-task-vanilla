const saveSegmentBtn = document.getElementsByClassName("save-segment-btn")[0];
const sidebar = document.getElementsByClassName("sidebar")[0];
const sidebarContentContainer = document.getElementsByClassName("sidebar-content-container")[0];
const sidebarCotentHeaderBackBtn = document.getElementsByClassName("sidebar-content-header-back-button")[0];
const addNewSchemaLink = document.getElementsByClassName("add-new-schema-link")[0];
const schemaSelectorDropdown = document.getElementById("schema-selector-dropdown");
let selectedSchema = "";
const selectedSchemasDropdownscontainer = document.querySelector(".selected-schemas-dropdowns-container .dropdowns-container");
const saveSegmentForm = document.getElementById("save-segment-form");
const segmentNameInput = document.getElementById("segment-input");
const cancelBtn = document.querySelector(".cancel-btn");


saveSegmentBtn.addEventListener('click', () => {
  showSidebar();
})

// hide sidebar when clicked on empty area of sidebar.
sidebar.addEventListener('click', (e) => {
  hideSidebar();
});

sidebarContentContainer.addEventListener('click', (e) => {
  e.stopPropagation();
})

sidebarCotentHeaderBackBtn.addEventListener('click', (e) => {
  hideSidebar();
})

cancelBtn.addEventListener('click', (e) => {
  hideSidebar();
})

schemaSelectorDropdown.addEventListener('change', (e) => {
  if(e.target.value != "") {
    const optionElementsArray = schemaSelectorDropdown.options;
    const selectedIndex = e.target.selectedIndex;
    const selectedOptionEle = optionElementsArray[selectedIndex];
    const data = selectedOptionEle.dataset;
    const value = e.target.value;
    selectedSchema = {...data,value}
  } else {
    selectedSchema = ""
  }
})

addNewSchemaLink.addEventListener('click', (e) => {
  e.preventDefault();
  if(selectedSchema) {
    addSchemaDropdown(selectedSchema);
    removeOptionFromSchemaSelector(selectedSchema);
  }
});

saveSegmentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const segmentName = segmentNameInput.value;
  const schemaArray = [];
  Array.from(selectedSchemasDropdownscontainer.children).forEach(node => {
    const selectElement = node.children[1];
    if(selectElement)
      schemaArray.push({
        [selectElement.name]: selectElement.value
      });
  })

  const segment = {
    "segment_name": segmentName,
    "schema": schemaArray
  };

  fetch("https://webhook.site/7463c7a7-376f-4b52-9483-6cdd68c51b10",{
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(segment)
  })
});


function showSidebar() {
  sidebar.classList.add("sidebar-visible");
  sidebarContentContainer.classList.add("sidebar-content-visible");
}

function hideSidebar() {
  sidebar.classList.remove("sidebar-visible");
  sidebarContentContainer.classList.remove("sidebar-content-visible");
}

// Adds a dropdown to selected schemas dropdown container.
function addSchemaDropdown(selectedSchema) {
  const { value, label, trait, index } = selectedSchema;

  const newDivEle = document.createElement("div");

  const indicationSpanEle = document.createElement("span");
  indicationSpanEle.classList.add(`${trait}-traits-indication`);
  const indicationDotSpan = document.createElement("span");
  indicationDotSpan.classList.add("indication-dot");
  indicationSpanEle.appendChild(indicationDotSpan);

  const newSelectEle = document.createElement("select");
  newSelectEle.name = value;
  newSelectEle.dataset.trait = trait;
  newSelectEle.dataset.label = label;
  newSelectEle.dataset.value = value;
  newSelectEle.dataset.index = index;

  const option = document.createElement("option");
  option.textContent = label;
  option.value = label;
  newSelectEle.appendChild(option);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "➖";
  deleteButton.addEventListener('click', (e) => removeSchemaDropdown(e,selectedSchema));
  deleteButton.classList.add("delete-schema-btn");
  
  newDivEle.appendChild(indicationSpanEle);
  newDivEle.appendChild(newSelectEle);
  newDivEle.appendChild(deleteButton);

  newDivEle.classList.add("individual-dropdown-container");

  if(document.querySelector(".dropdowns-container p")) {
    selectedSchemasDropdownscontainer.removeChild(document.querySelector(".dropdowns-container p"))
  }
  selectedSchemasDropdownscontainer.appendChild(newDivEle);
}

// Removes dropdown from selected schemas dropdown container.
function removeSchemaDropdown(e,selectedSchema) {
  const nodeToBeDeleted = e.target.parentNode;
    selectedSchemasDropdownscontainer.removeChild(nodeToBeDeleted);
    addOptionToSchemaSelector(selectedSchema);
  
    if(!selectedSchemasDropdownscontainer.children.length) {
      const emptyP = document.createElement("p");
      emptyP.textContent = "Please use below dropdown to select a schema";
      selectedSchemasDropdownscontainer.appendChild(emptyP);
    }
}

// Adds option to schema selector dropdown.
function addOptionToSchemaSelector(selectedSchema) {
  const { value, label, trait, index } = selectedSchema;
  const option = document.createElement("option");
  option.dataset.label = label;
  option.dataset.trait = trait;
  option.dataset.index = index;
  option.textContent = label;
  option.value = value;

  const indexAtWhichOptionTobeInserted = Number(index);
  const schemaSelectorDropdownChildren = schemaSelectorDropdown.children;
  if(index >= schemaSelectorDropdownChildren.length) {
    schemaSelectorDropdown.appendChild(option);
  } else {
    const referenceNode = schemaSelectorDropdownChildren[indexAtWhichOptionTobeInserted];
    schemaSelectorDropdown.insertBefore(option,referenceNode);
  }
}

// Removes option from schema selector dropdown.
function removeOptionFromSchemaSelector(selectedSchemaArg) {
  const value = selectedSchemaArg.value;
  const optionElementToBeRemoved = document.querySelector(`#schema-selector-dropdown option[value='${value}']`);
  schemaSelectorDropdown.removeChild(optionElementToBeRemoved);
  selectedSchema = "";
}