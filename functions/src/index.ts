import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";

admin.initializeApp();

const corsHandler = cors({origin: true});

// Another way to handle CORS if the above doesn't work:
export const checkUsernameAvailabilityHttp = functions.https
  .onRequest((req, res) => {
    corsHandler(req, res, async () => {
      const username = req.body.username;
      const usersRef = admin.firestore().collection("users");
      const q = usersRef.where("username", "==", username);
      const querySnapshot = await q.get();

      res.json({available: querySnapshot.empty});
    });
  });

// Cloud Function to delete user document when user is deleted
export const deleteUserDocument = functions.auth.user().onDelete(async (user) => {
  const uid = user.uid;
  
  try {
    // Reference to the user's document in Firestore
    const userDocRef = admin.firestore().collection("users").doc(uid);
    
    // Check if the document exists
    const doc = await userDocRef.get();
    if (doc.exists) {
      // Delete the document
      await userDocRef.delete();
      console.log(`Successfully deleted user document for UID: ${uid}`);
    } else {
      console.log(`No document found for UID: ${uid}`);
    }
  } catch (error) {
    console.error(`Error deleting user document for UID: ${uid}`, error);
  }
});
