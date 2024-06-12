import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore/lite"

const firebaseConfig = {
  apiKey: "AIzaSyDJR6z-Gl38LzyI8Eq7goQmYlNtpcJWBP4",
  authDomain: "snek-v1.firebaseapp.com",
  projectId: "snek-v1",
  storageBucket: "snek-v1.appspot.com",
  messagingSenderId: "924231091098",
  appId: "1:924231091098:web:2c838c273b8d7fe0a8f023",
}

const app = initializeApp(firebaseConfig)

const database = getFirestore(app)

async function writeHighscore(data: {
  name: string
  score: number
  date: string
}) {
  try {
    const documentReference = await addDoc(
      collection(database, "scoreboard"),
      data
    )
    console.log("Document written with ID:", documentReference.id)
  } catch (error) {
    console.error("Error adding document:", error)
  }
}

const scoreboardLimit = 10

async function getScoreboardData() {
  const querySnapshot = await getDocs(
    query(
      collection(database, "scoreboard"),
      orderBy("score", "desc"),
      limit(scoreboardLimit)
    )
  )

  return querySnapshot.docs.map((document) => document.data())
}

export { writeHighscore, getScoreboardData, scoreboardLimit }
