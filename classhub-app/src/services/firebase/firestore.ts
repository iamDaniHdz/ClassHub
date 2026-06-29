import firestore from '@react-native-firebase/firestore';

export const testFirestoreWrite = async () => {
  try {
    const docRef = await firestore().collection('test').add({
      message: 'Hola desde ClassHub',
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    console.log('Documento creado con ID:', docRef.id);
  } catch (error) {
    console.error('Error al escribir en Firestore:', error);
  }
};