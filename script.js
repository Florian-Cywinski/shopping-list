// To navigate to the relevant elements of the HTML file
const itemForm = document.getElementById('item-form');    //The form itself - <form id="item-form">...</form>
const itemInput = document.getElementById('item-input');  //The item that was submitted
const itemList = document.getElementById('item-list');    //The list (ul) in which the items are listed
const clearBtn = document.getElementById('clear');        //The Clear All button
const itemFilter = document.getElementById('filter');     //The filter field
const formBtn = itemForm.querySelector('button');         //The button associated to the form
let isEditMode = false;

// To display all items from the local storage when the DOM content is loaded
function displayItems() {
  const itemsFromStorage = getItemsFromStorage(); // To get and store all items from the local storage
  itemsFromStorage.forEach(item => {
    addItemToDOM(item)
  })
  checkUI();
}

// To add new items to the shopping list via the input field using a button
function onAddItemSubmit(e) {   // e is the event object
  e.preventDefault();   //It blocks the default action - In this case, it prevents the file submission so that individual functions can be implemented with this method

  const newItem = itemInput.value;  //The submitted item

  // Validate Input - If the customer has not entered anything, they will be asked to do so
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  // Create item DOM element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);

  itemInput.value = '';     //Resets the value of the submitted item

  checkUI();  // Calls the function - Checks whether there are items in the item list when the removeItem function is called
}


// Adds item to DOM
function addItemToDOM(item) {
    // Create list item
    const li = document.createElement('li');    //Creates a new list item
    li.appendChild(document.createTextNode(item)); //Appends the entered name (newItem) to the list item
  
    const button = createButton('remove-item btn-link text-red'); //Calls the function createButton with the classes and stores this in a constant
    li.appendChild(button);   //Appends the button to the li element
  
    // Add item to the DOM
    itemList.appendChild(li); //Appends the li element to the list
}


//The function that creates the li button
function createButton(classes) {  
  const button = document.createElement('button');  //Creates a new button
  button.className = classes; //Transfers the classes entered in the function
  const icon = createIcon('fa-solid fa-xmark');//Calls the function createIcon with the classes and stores this in a constant
  button.appendChild(icon); //Appends the icon to the button
  return button;  //Hands over the new created button
}


//The function that creates the icon (part of the li button)
function createIcon(classes) {  
  const icon = document.createElement('i'); //Creates a new icon
  icon.className = classes; //Transfers the classes entered in the function
  return icon;  //Hands over the new created icon
}


// Adds item to Storage (local)
function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage(); // To get and store all items from the local storage

  // To add the new item to the array (itemsFromStorage) - if true: in an empty array else: in the array with already existing items - see above
  itemsFromStorage.push(item);

  // Converts the array (itemsFromStorage) back to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}


// Get items from Storage (local)
function getItemsFromStorage() {
  let itemsFromStorage; // This will be the array where the items are stored localy
  
  if (localStorage.getItem('items') === null) { // Checks whether there is at least an item stored localy - items is the key
    itemsFromStorage = [];  // Sets an array with nothing in it if there is no item yet
  } else {  //If there is one item or more in storage
    itemsFromStorage = JSON.parse(localStorage.getItem('items')); //To be that string (localStorage.getItem('items')) an array (again) we have to parse it (JSON.parse)
    
  }

  return itemsFromStorage;
}


// The handler to remove a list item element due to a click on the icon x
function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) { //Query by the class 'remove-item' whether the parent element is the li button
    removeItem(e.target.parentElement.parentElement)

    checkUI();  // Calls the function - Checks whether there are items in the item list when the removeItem function is called
  } else {
    setItemToEdit(e.target);
  }
}


// The function that set a clicked item to edit
function setItemToEdit(item) {
  isEditMode = true;

  itemList.querySelectorAll('li').forEach(itm => itm.classList.remove('edit-mode'));  // Reset: Removes the class 'edit-mode' from each item

  item.classList.add('edit-mode');  // Adds the class 'edit-mode' from the css file
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>     Update Item';  // Changes the button text and some style as well
  formBtn.style.backgroundColor = '#228B22';  // Changes the button color so that it is more clear that we are in edit mode
  itemInput.value = item.textContent; // Gets the item name and puts it into the input field
}


// The function that removes the li element (item) from the DOM and the local storage (by clicking the icon)
function removeItem(item) {  
  if (confirm('Are you sure?')) { //A request pops up: The li element will only be deleted after confirmation
    
    // Remove item from DOM
    item.remove();  //To remove the list item element

    // Remove item from local storage
    removeItemFromStorage(item.textContent)

    checkUI();  // Calls the function - Checks whether there are items in the item list when the removeItem function is called
  }
}


// The function that removes the item from local storage
function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage(); // To get and store all items from the local storage

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter(i => i !== item);  // Stores all items except the item to be filtered out in the array

  // Re-set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}


//The function that removes all li element (by clicking the All Clear button)
function clearItems() { 
  if (confirm('Are you sure?')) {
    while (itemList.firstChild) { //Deletes as long as there is a first item in the item list
      itemList.removeChild(itemList.firstChild);
    }

    // Clear from local storage
    localStorage.removeItem('items'); //That will remove the stringified array

    checkUI();  // Calls the function - Checks whether there are items in the item list when the removeItem function is called
  }
}


// The function that allows to filter the items of the item list
function filterItems(e) {
  const items = itemList.querySelectorAll('li');  //All listed items - it has to be in the function scope so that it is requested every time the function is invoked
  const text = e.target.value.toLowerCase();  // The text that will be filtered - toLowerCase() cancels the case sensitivity (upper and lower case)

  items.forEach(item => { // Goes through all items in the item list
    const itemName = item.firstChild.textContent.toLowerCase(); // For each iteration - Takes the item name which is the first child (text node) and sets it to lower case

    if (itemName.indexOf(text) != -1) { //If the text which was typed in matches the item name - if indexOf doen't match it is -1 - this means if it is not equal to -1 the item name matches with the text (filer input)
      item.style.display = 'flex';  // To set the display to flex (default)
    } else {  // If it doesn't match
      item.style.display = 'none';  // Does not show the item
    }
  })
}


// Checks whether items are in the item list
function checkUI() {
  const items = itemList.querySelectorAll('li');  //All listed items - it has to be in the function scope so that it is requested every time the function is invoked
  
  if (items.length === 0) { //If there is no item in the item list
    clearBtn.style.display = 'none';  // Does not show the Clear All button
    itemFilter.style.display = 'none';  // Does not show the filter field
  } else {  //If there is an item in the item list
    clearBtn.style.display = 'block'; // Displays the Clear All button as block
    itemFilter.style.display = 'block'; // Displays the filter field as block    
  }
}


// Initialize app
function init() {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  // itemList.addEventListener('click', removeItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);  // The input-event captures typing
  document.addEventListener('DOMContentLoaded', displayItems);  //Loads all items from local storage when the DOM content is loaded

  checkUI();  //Checks whether there are items in the item list when the page loads
}
init();