import * as ImagePicker from "expo-image-picker";

async function takeAvatarPhoto() {
  const {
    status: cameraPerm,
  } = await ImagePicker.requestCameraPermissionsAsync();
  const {
    status: cameraRollPerm,
  } = await ImagePicker.requestCameraRollPermissionsAsync();

  // only if user allows permission to camera AND camera roll
  if (cameraPerm === "granted" && cameraRollPerm === "granted") {
    try {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0,
      });
      if (!pickerResult.cancelled) {
        return pickerResult;
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    Alert.alert(
      "Oops...we need access to your camera and gallery to take photos."
    );
  }
}

async function pickAvatarPhoto() {
  const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
  if (status == "granted") {
    try {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        // mediaTypes: ImagePicker.MediaTypeOptions.Image,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0,
      });
      if (!pickerResult.cancelled) {
        return pickerResult;
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    Alert.alert("Oops...we need access to gallery to upload images.");
  }
}

module.exports = {
  takeAvatarPhoto,
  pickAvatarPhoto,
};
