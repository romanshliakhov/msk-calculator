// ----------------------------------------------------
const removeCustomClass = (item, customClass = 'active') => {
  const classes = customClass.split(',').map(cls => cls.trim());
  classes.forEach(className => {
    item.classList.remove(className);
  });
}

// ----------------------------------------------------
const toggleCustomClass = (item, customClasses = 'active') => {
  const classes = customClasses.split(',').map(cls => cls.trim());
  classes.forEach(className => {
    item.classList.toggle(className);
  });
}

// ----------------------------------------------------
const addCustomClass = (item, customClass = 'active') => {
  const classes = customClass.split(',').map(cls => cls.trim());
  classes.forEach(className => {
    item.classList.add(className);
  });
}

// ----------------------------------------------------
const removeClassInArray = (arr, customClass = 'active') => {
  const classes = customClass.split(',').map(cls => cls.trim());
  arr.forEach((item) => {
    classes.forEach(className => {
      item.classList.remove(className);
    });
  });
}

const closeSelect = function (selectBody, select , className = "active") {
  selectBody.style.height = 0;
  removeCustomClass(select, className);
};

const openSelect = function (selectBody, select , className = "active") {
  selectBody.style.height = "auto";
  addCustomClass(select, className);
};

const checkIsSelectOpen = function (select) {
  return select.classList.contains('active');
}

const select = document.querySelectorAll("[data-select]");

if (select.length) {
  select.forEach((item) => {
    const selectCurrent = item.querySelector(".select__current");
    const selectInput = item.querySelector(".select__input");
    const selectBody = item.querySelector(".select__body");

    if (selectInput) {
      const currentId = selectCurrent.getAttribute("data-id");
      selectInput.setAttribute("value", currentId);
    }

    item.addEventListener("click", (e) => {
      if (e.target.tagName.toLowerCase() !== 'a') {
        e.preventDefault();
      }

      const isSelectOpen = checkIsSelectOpen(item);
      const el = e.target.dataset.type;
      const innerSelect = e.target.innerHTML;
      let items = item.querySelectorAll(`.select__list [data-id]`);
      let currentItem = item.querySelector(`.select__list [data-id='${selectInput.getAttribute("value")}']`)

      if (el === "option") {
        selectCurrent.innerHTML = innerSelect;
        selectInput.setAttribute("value", e.target.getAttribute("data-id"));
        selectCurrent.setAttribute("data-id", e.target.getAttribute("data-id"));
      }

      removeClassInArray(items, 'active');
      items.forEach(function (item) {item.style.display = "flex"});

      if (isSelectOpen) {
        closeSelect(selectBody, item);
      } else {
        openSelect(selectBody, item)
      }
    });


    document.addEventListener("click", function (event) {
      if (!item.contains(event.target) && checkIsSelectOpen(item)) {
        closeSelect(selectBody, item);
      }
    });
  });
}
