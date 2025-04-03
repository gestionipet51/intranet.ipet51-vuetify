<template>
    <div>
      <button @click="authenticate">Autenticar con Google</button>
      <button @click="generatePDF" :disabled="!isAuthenticated">Generar PDF</button>
      <div v-html="documentContent"></div>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import html2pdf from "html2pdf.js";
  import { db } from "../firebase";
  import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
  
  export default {
    setup() {
      const documentContent = ref("");
      const isAuthenticated = ref(false);
      const googleProvider = new GoogleAuthProvider();
  
      const authenticate = async () => {
        const auth = getAuth();
        try {
          const result = await signInWithPopup(auth, googleProvider);
          console.log("Autenticado:", result.user);
          isAuthenticated.value = true;
        } catch (error) {
          console.error("Error al autenticar:", error);
        }
      };
  
      const fetchDocument = async () => {
        const docId = "1nY4WpKm79l-4hhuTY2AuHw7hkWSdLLYV36qJqHCDZ4o"; // Reemplaza con el ID de tu documento
        const token = (await getAuth().currentUser.getIdToken());
  
        const response = await fetch(
          `https://docs.googleapis.com/v1/documents/${docId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        const data = await response.json();
        let content = "";
        data.body.content.forEach((element) => {
          if (element.paragraph) {
            element.paragraph.elements.forEach((textRun) => {
              content += textRun.textRun?.content || "";
            });
            content += "<br/>";
          }
        });
  
        documentContent.value = content;
      };
  
      const replacePlaceholders = async () => {
        const docRef = doc(db, "usuarios", "usuario1");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          let content = documentContent.value;
          const data = docSnap.data();
          content = content.replace("{{nombre}}", data.nombre);
          content = content.replace("{{fecha}}", data.fecha);
          content = content.replace("{{descripcion}}", data.descripcion);
          documentContent.value = content;
        }
      };
  
      const generatePDF = () => {
        replacePlaceholders();
        html2pdf().from(documentContent.value).save("documento.pdf");
      };
  
      return { authenticate, generatePDF, documentContent, isAuthenticated };
    },
  };
  </script>
  