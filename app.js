
import { } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js"
import { collection, getFirestore, addDoc, orderBy, onSnapshot, deleteDoc, doc, query } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js"

const db = getFirestore(window.app);

const table = document.querySelector('.table-body');
const removeTableElementBtn = document.querySelector('.btn-floating');
const firstNameInput = document.querySelector('#first_name');
const lastNameInput = document.querySelector('#last_name');
const companyInput = document.querySelector('#company');
const roleInput = document.querySelector('#role');
const emailInput = document.querySelector('#email');
const phoneNumberInput = document.querySelector('#phone_number');
const submitBtbn = document.querySelector('.my-submit');
const form = document.querySelector('.my-form'); 
const inputField = document.querySelector('.my-input');
const errorParagraph = document.querySelector('.error-paragraph');
const contacts = document.getElementById('contacts');
const searchCont = document.getElementById('searchContact');


// ** Creating and appending a row to the table
//
let renderPerson = (doc) => {
    let iconClasses = ['btn-floating', 'btn-small', 'waves-effect', 'waves-light', 'blue', 'lighten-1'];
    let tr = document.createElement('tr');
    let fNameTd = document.createElement('td');
    let lNameTd = document.createElement('td');
    let cNameTd = document.createElement('td');
    let rNameTd = document.createElement('td');
    let eNameTd = document.createElement('td');
    let phoneTd = document.createElement('td');
    let removeTd = document.createElement('td');
    let removeLink = document.createElement('a');
    let removeIcon = document.createElement('i');
    removeIcon.classList.add('material-icons');
    removeIcon.innerText = "clear"
    removeLink.classList.add(...iconClasses);
    removeLink.appendChild(removeIcon);
    removeTd.appendChild(removeLink);
    fNameTd.innerText = doc.data().firstname;
    lNameTd.innerText = doc.data().lastname;
    cNameTd.innerText = doc.data().company;
    rNameTd.innerText = doc.data().role;
    eNameTd.innerText = doc.data().email;
    phoneTd.innerText = doc.data().phone;
    tr.appendChild(fNameTd);
    tr.appendChild(lNameTd);
    tr.appendChild(cNameTd);
    tr.appendChild(rNameTd);
    tr.appendChild(eNameTd);
    tr.appendChild(phoneTd);
    tr.appendChild(removeTd);
    tr.setAttribute('id', doc.id)
    table.appendChild(tr)
}


// ** Writing data (add a person) to the database
//
let createPerson = async () => {
    try {
	const docRef = await addDoc(collection(db, "phonebook"), {
	    firstname:firstNameInput.value,
	    lastname:lastNameInput.value,
	    company:companyInput.value,
	    role:roleInput.value,
	    email:emailInput.value,
	    phone:phoneNumberInput.value
	});
	console.log("Document written with ID: ", docRef.id);
    } catch (e) {
	console.error("Error adding document: ", e);
    }

}


// ** Error function
//
let showError = () => {
    errorParagraph.classList.remove('hide');
    errorParagraph.innerText = `One or more fields are empty`;
    setTimeout(()=>{
        errorParagraph.classList.add('hide');
    }, 2000)
}


// ** Query and order
//
onSnapshot(query(collection(db, "phonebook"), orderBy('firstname')), (snapshot) => {

    query(collection(db, 'participant'), orderBy('name'))
    let changes = snapshot.docChanges()
    
    changes.forEach(change=>{
        if(change.type == "added"){
            renderPerson(change.doc)
        }
        else if(change.type == "removed"){
            let tr = table.querySelector('[id=' + change.doc.id + ']')
            table.removeChild(tr) 
        }
    }) 
})


// ** Removing data (a person) from the databse
//
table.addEventListener('click', (e)=>{
    if(e.target.classList.contains('material-icons')){
	let trId = e.target.parentElement.parentElement.parentElement.id
	if (confirm("Are you sure you want to delete this contact?") == true){
	    deleteDoc(doc(db, "phonebook", trId))
		.then(()=> console.log(`Document Succesfully Deleted`))
		.catch(e=> console.log(e, 'something happened'));
	}
    }
})


// ** Writing data from FE/UI and calling the create user function when "add user" button gets clicked
//
submitBtbn.addEventListener('click', e=>{
    e.preventDefault();
    if(firstNameInput.value !== "" && lastNameInput.value !== "" && companyInput.value !== "" &&
       roleInput.value !== "" && emailInput.value !== "" && phoneNumberInput.value !== ""){
        createPerson()
        firstNameInput.value =   "";
        lastNameInput.value =    "";
	companyInput.value = "";
	roleInput.value = "";
	emailInput.value = ""
        phoneNumberInput.value = "";
        inputField.blur();  // I'M TRYING TO REMOVE THE FOCUS FROM THE INPUT FIELDS AFTER A USER CLICKS THE SUBMIT BUTTON. DOESN'T WORK LOL
    }
    else{
        showError();
    }
})


// ** Searching function
//
searchCont.addEventListener('keyup', (e)=>{
    
    const table = document.getElementById('contacts');
    var searchValue = e.target.value.toLowerCase(); 
    const rows = Array.from(table.rows);
    
    rows.forEach(row => {
	const cells = Array.from(row.cells);
	const foundInRow = cells.some(cell => cell.innerText.toLowerCase().includes(searchValue));
	row.style.display = foundInRow ? '' : 'none';
    });
    
})

