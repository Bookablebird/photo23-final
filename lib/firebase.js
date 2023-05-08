import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import "firebase/compat/database"
import "firebase/compat/storage"
import 'firebase/auth'


const initFirebase = async () => {
  // This check prevents us from initializing more than one app.
  if (!firebase.apps.length) {
    firebase.initializeApp({
      //apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      //databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      //projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      //storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
      apiKey: "AIzaSyD-3ZkDIcPscrFiJyKv_MHD-PQ2iB_bUd0",
      authDomain: "photo23-37548.firebaseapp.com",
      databaseURL: "https://photo23-37548-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "photo23-37548",
      storageBucket: "photo23-37548.appspot.com",
      messagingSenderId: "13831221059",
      appId: "1:13831221059:web:9faf69d5bcf90decfb89f6",
      measurementId: "G-MQHE8KSK3K"
    })
  }
}


// Gets all posts from the database in reverse chronological order.
export const getPosts = async () => {
  // Because our exported functions can be called at any time from
  // any place in our app, we need to make sure we've initialized
  // a Firebase app every time these functions are invoked.
  initFirebase()

 const posts = await firebase
    .database()
    .ref('/posts')
    .orderByChild('dateCreated')
    .once('value')
    .then((snapshot) => {
      const snapshotVal = snapshot.val()

      const result = []
      for (var Id in snapshotVal) {
        const post = snapshotVal[Id]
        result.push(post)
      }

      return result.reverse()
    })

  return posts
}
export const getPostsByUser = async () => {
  // Because our exported functions can be called at any time from
  // any place in our app, we need to make sure we've initialized
  // a Firebase app every time these functions are invoked.
  initFirebase()

 const postsBy = await firebase
    .database()
    .ref(`/posts/`)
    .orderByChild('dateCreated')
    .once('value')
    .then((snapshot) => {
      const snapshotVal = snapshot.val()

      const result = []
      for (var Id in snapshotVal) {
        const post = snapshotVal[Id]
        result.push(post)
      }

      return result.reverse()
    })

  return postsBy
}


export const createPost = async (post) => {
  initFirebase()

  //const dateCreated = new Date().getTime()
  post.dateCreated = firebase.database.ServerValue.TIMESTAMP 

  console.log(post)

  return firebase.database().ref(`/posts/${post.Id}`).set(post)
}

export const uploadPic = async (pic, user) => {
  initFirebase()
  
  await firebase.storage().ref(`/${user.email}/${pic.name}`).put(pic)
  const url = await firebase.storage().ref(`${user.email}`).child(pic.name).getDownloadURL()
  return url
}

export const getPostBySlug = async (Id) => {
  initFirebase()

  return await firebase
    .database()
    .ref(`/posts/${Id}`)
    .once('value')
    .then((snapshot) => snapshot.val())
}

export const onAuthStateChanged = async (callback) => {
  initFirebase()

  return firebase.auth().onAuthStateChanged((user) => callback(user))
}


export const signInWithGoogle = async () => {
  initFirebase()
  //const provider = new GoogleAuthProvider()
  //const auth = firebase.auth()
  //const provider = new firebase.auth().GoogleAuthProvider()
  /*provider.setCustomParameters({
    prompt: "select_account"
  })*/
  var provider = new firebase.auth.GoogleAuthProvider()
  provider.addScope('profile')
  provider.addScope('email')
  firebase.auth().signInWithPopup(provider).then(function(result) {
   // This gives you a Google Access Token.
   var token = result.credential.accessToken
   // The signed-in user info.
   var user = result.user

   console.log(token)
   console.log(user)
  })
}

export const createUser = async (email, password, username) => {
  initFirebase()
  await firebase.auth().createUserWithEmailAndPassword(email, password)
  const currentUser = firebase.auth().currentUser

  return await currentUser.updateProfile({displayName: username})
}

export const updateProfile = async () => {
  initFirebase()
  const currentU = firebase.auth().currentUser
  //const log = await currentU.updateProfile({displayName: "updated"})
  //console.log(log)
  console.log(currentU)

}


export const signIn = async (email, password) => {
  initFirebase()

  return firebase.auth().signInWithEmailAndPassword(email, password)
}

export const signOut = async () => {
  initFirebase()



  return firebase.auth().signOut()
}

export const updatePost = async (post) => {
  initFirebase()

  return firebase.database().ref(`/posts/${post.Id}`).set(post)
}

export const deletePost = async (Id) => {
  initFirebase()

  return firebase.database().ref(`/posts/${Id}`).set(null)
}

