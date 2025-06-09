// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc, setDoc } = require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCto_EYrJvArNFtVcEmcTsk4-qeCvIcm1E",
  authDomain: "flyy-bb9e7.firebaseapp.com",
  projectId: "flyy-bb9e7",
  storageBucket: "flyy-bb9e7.appspot.com",
  messagingSenderId: "274474888053",
  appId: "1:274474888053:web:8ecc2142171cb9fdb2013c",
  measurementId: "G-4Z80XD30JL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const preMarketCollectionName = "pre-market";
const upstoxTCollectionName = "upstox-token";
const db = getFirestore(app);

const getMarketDataByDate = async (id) => {
  try {
    const d = await getDoc(doc(db, `${preMarketCollectionName}/${id}`));
    const data = d.data();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const saveUpstoxT = async (payload) => {
  try {
    return setDoc(doc(db, upstoxTCollectionName, "token"), payload);
  } catch (err) {
    console.log(err);
  }
};

const getUpstoxT = async () => {
  try {
    const d = await getDoc(doc(db, `${upstoxTCollectionName}/${"token"}`));
    const data = d.data();
    if (data.access_token) {
      saveUpstoxT({});
    }
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// };
const modules = { getMarketDataByDate, saveUpstoxT, getUpstoxT };

module.exports = modules;
