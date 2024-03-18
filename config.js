
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js"
import { getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence, browserSessionPersistence, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js"

// ** Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBNkXmGtkdyDnsZfe_jRo1XKIJDT_FSB58",
    authDomain: "myphonebook-a110e.firebaseapp.com",
    projectId: "myphonebook-a110e",
    storageBucket: "myphonebook-a110e.appspot.com",
    messagingSenderId: "460631253685",
    appId: "1:460631253685:web:1c4a37b6aa0dfa9c6814fc"
};

// ** Initialize Firebase
window.app = initializeApp(firebaseConfig);
window.auth = getAuth(app);
export default app;

// ** Login function
export function login() {
    
    const provider = new GoogleAuthProvider();
    
    signInWithPopup(auth, provider)
	.then((result) => {
	    // This gives you a Google Access Token
	    const user = result.user;

	    // Turn off the splash screen
	    document.getElementById('loginscreen').style.display = 'none';
	    
	    // Turn on the main screen
	    document.getElementById('mainscreen').style.display = 'table';
	    // Load app.js
	    const script = document.createElement('script');
	    script.src = './app.js';
	    script.type = 'module';
	    document.body.appendChild(script);
	    
	}).catch((error) => {
	    // Handle Errors here.
	    const errorCode = error.code;
	    const errorMessage = error.message;
	    // The email of the user's account used.
	    //const email = error.customData.email;
	    // The AuthCredential type that was used.
	    const credential = GoogleAuthProvider.credentialFromError(error);
	    // ...
	});
    
}

// ** Logout function
export function logout() {
    
    signOut(auth).then(() => {
	// If sign-out successful put back the splash screen
	document.getElementById('mainscreen').style.display = 'none';
	document.getElementById('loginscreen').style.display = 'table';
	window.location.href = "https://myphonebook-a110e.firebaseapp.com";
	console.log('User logged out.');
    }).catch((error) => {
	// An error happened.
	console.error('Logout error:', error);
    });
    
}


/*
// ** Set local persistence
(async () => {
    await setPersistence(auth, browserLocalPersistence);
})();
*/


// ** Set browser session persistence
setPersistence(auth, browserSessionPersistence)
    .then(() => {
	// Existing and future Auth states are now persisted in the current
	// session only. Closing the window would clear any existing state even
	// if a user forgets to sign out.
	// ...
	// New sign-in will be persisted with session persistence.
	return signInWithPopup(auth, provider)
    })
    .catch((error) => {
	// Handle Errors here.
	const errorCode = error.code;
	const errorMessage = error.message;
    });
