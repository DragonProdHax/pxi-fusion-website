function loadFirebase() {
  // Load SweetAlert2 library dynamically
  const sweetAlertScript = document.createElement("script");
  sweetAlertScript.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
  sweetAlertScript.onload = () => {
    // Load Firebase dynamically
    const firebaseScript = document.createElement("script");
    firebaseScript.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js";

    firebaseScript.onload = () => {
      const firestoreScript = document.createElement("script");
      firestoreScript.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js";

      firestoreScript.onload = () => {
        // Firebase configuration
        const firebaseConfig = {
          apiKey: "AIzaSyBnemZzQwby1dBA4zmRjOpmEZ-pKU3EH1Y",
          authDomain: "pxi-fusion-proxy.firebaseapp.com",
          projectId: "pxi-fusion-proxy",
          storageBucket: "pxi-fusion-proxy.firebasestorage.app",
          messagingSenderId: "276346889953",
          appId: "1:276346889953:web:d0a30e46c5f207a0ae79a0",
        };

        // Initialize Firebase
        if (!firebase.apps?.length) {
          firebase.initializeApp(firebaseConfig);
          console.log("Firebase initialized successfully!");
        } else {
          console.log("Firebase already initialized.");
        }

        const db = firebase.firestore();
        console.log("Firestore is ready:", db);

        // Check localStorage first
        const savedExpire = localStorage.getItem("pinExpire");
        const currentTime = new Date().getTime();

        if (savedExpire && new Date(savedExpire).getTime() > currentTime) {
          // Calculate time left from localStorage
          const expireDate = new Date(savedExpire).getTime();
          const timeLeft = expireDate - currentTime;
          const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

          // Show SweetAlert with remaining time
          Swal.fire({
            icon: "success",
            title: "Access Granted!",
            html: `
              <div style="display: flex; flex-direction: column; align-items: center; font-size: 18px;">
                <p style="color: black; font-size: 18px; text-align: center;">
                  Time left: <strong>${hoursLeft} hours and ${minutesLeft} minutes</strong>
                </p>
              </div>
            `,
            confirmButtonText: "Continue",
          });
          return; // Skip Firebase check
        }

        // If not in localStorage, prompt for PIN and check Firebase
        const overlay = document.createElement("div");
        overlay.id = "blur-overlay";
        document.body.appendChild(overlay);

        Swal.fire({
          title: "Enter PIN",
          input: "text",
          inputPlaceholder: "Enter your PIN",
          inputAttributes: {
            style: "font-size: 18px; padding: 10px;",
          },
          showCancelButton: false,
          confirmButtonText: "Submit",
          allowOutsideClick: false,
          allowEscapeKey: false,
          customClass: {
            popup: "swal2-large-popup",
            confirmButton: "swal2-large-confirm",
          },
          preConfirm: (pin) => {
            if (!pin) {
              Swal.showValidationMessage("You must enter a PIN!");
              return false;
            }

            // Return a promise to handle async operations
            return db
              .collection("Pins")
              .doc(pin.trim())
              .get()
              .then((doc) => {
                if (!doc.exists) {
                  throw new Error("PIN not found!");
                }
                const expire = doc.data().Expire;
                if (!expire) {
                  throw new Error("Expire field not found!");
                }

                const expireDate = new Date(expire).getTime();
                const currentTime = new Date().getTime();
                const timeLeft = expireDate - currentTime;

                if (timeLeft <= 0) {
                  throw new Error("This PIN has expired!");
                }

                // Calculate time left
                const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
                const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

                // Save expiration time in localStorage
                localStorage.setItem("pinExpire", expire);

                return { hoursLeft, minutesLeft };
              })
              .catch((error) => {
                Swal.showValidationMessage(error.message);
                return false;
              });
          },
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            const { hoursLeft, minutesLeft } = result.value;

            Swal.fire({
              icon: "success",
              title: "Access Granted!",
              html: `
                <div style="display: flex; flex-direction: column; align-items: center; font-size: 18px;">
                  <img 
                    src="https://cdn.pixabay.com/photo/2013/07/13/11/44/clock-158536_1280.png" 
                    alt="Cartoon Watch" 
                    style="width: 150px; height: 150px; margin-bottom: 20px;"
                  />
                  <p style="color: black; font-size: 18px; text-align: center;">
                    Time left: <strong>${hoursLeft} hours and ${minutesLeft} minutes</strong>
                  </p>
                </div>
              `,
              confirmButtonText: "Continue",
              willClose: () => {
                overlay.remove();
              },
            });
          } else {
            document.getElementById("blur-overlay").style.display = "block";
          }
        });
      };

      document.head.appendChild(firestoreScript);
    };

    document.head.appendChild(firebaseScript);
  };

  document.head.appendChild(sweetAlertScript);

  // Add custom styles for the blur overlay and SweetAlert2
  const style = document.createElement("style");
  style.textContent = `
    #blur-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
      z-index: 9998;
    }
    .swal2-container {
      z-index: 9999 !important;
    }
    .swal2-large-popup {
      width: 500px !important;
      font-size: 18px;
    }
    .swal2-large-confirm {
      font-size: 16px !important;
      padding: 10px 20px !important;
    }
  `;
  document.head.appendChild(style);
}

loadFirebase();
