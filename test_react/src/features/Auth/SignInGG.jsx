import React from 'react'
import PropTypes from 'prop-types'
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
SignIn.propTypes={

};
// Configure FirebaseUI.
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'redirect',
    signInSuccessUrl: '/',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //   firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    // callbacks: {
    //   // Avoid redirects after sign-in.
    //   signInSuccessWithAuthResult: () => false,
    // },
  };
function SignIn(props) {
    return (
        <div>
            <div className="text-center">
                

                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
                
            </div>
        </div>
    )
}

SignIn.propTypes = {

}

export default SignIn

