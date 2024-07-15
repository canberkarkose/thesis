import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";

admin.initializeApp();

const corsHandler = cors({origin: true});

// Cloud Function to check username availability
export const checkUsernameAvailability = functions.https
  .onCall(async (data) => {
    const username = data.username;
    const usersRef = admin.firestore().collection("users");
    const q = usersRef.where("username", "==", username);
    const querySnapshot = await q.get();

    return {available: querySnapshot.empty};
  });

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
