import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloCunt = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
 console.log("IS THIS WORKING YET")
});

export const nodReceipt = functions.database.ref('/users/{authUserId}//nodSent')
  .onCreate((snapshot, context) => {

    // when someone sends a nod, send a push to the recipient by accessing the original
  console.log("Running nodReceipt")
  const nodRecipient = Object.keys(snapshot.val())[0]
  console.log(`Nod to: ${nodRecipient}`)
  var fcmToken = ""

  const payload = {
    notification: {
      title: "User nodded at yoU!",
      body: "Nod back?",
      sound: "default"
    }
  }

  return admin.database().ref(`/users/${nodRecipient}`).once('value').then(userSnapshot => {
    fcmToken = Object.keys(userSnapshot.child("fcmToken").val())[0];

    console.log(`Got token ${fcmToken} for userId ${nodRecipient}`)

    return admin.messaging().sendToDevice(fcmToken, payload).then(response => {
      console.log(`Nod Push Notification sent to ${fcmToken}`);
    });
  })
})

export const newMessage = functions.database.ref('/messages/{authUserId}/{userId}/{messageId}')
  .onCreate((snapshot, context) => {
  console.log("Running newMessage")

  var fcmToken = ""

  const payload = {
    notification: {
      title: "New message arrived",
      body: "come check it",
      sound: "default"
    }
  }

  return admin.database().ref(`/users/${context.params.userId}`).once('value').then(userSnapshot => {
    fcmToken = Object.keys(userSnapshot.child("fcmToken").val())[0];

    console.log(`Got token ${fcmToken} for userId ${context.params.userId}`)

    return admin.messaging().sendToDevice(fcmToken, payload).then(response => {
      console.log(`Push Notification sent to ${fcmToken}`);
    });
  })

  });

