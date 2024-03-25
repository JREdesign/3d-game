import React, { useState, useEffect } from "react";
import "aframe"; // A-Frame importado a través de npm

const AFrameScene = () => {
  const [questions, setQuestions] = useState([]); // Estado para almacenar las preguntas
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // Estado para almacenar el índice de la pregunta actual
  const [score, setScore] = useState(0); // Estado para almacenar el marcador
  const [message, setMessage] = useState("¡Bienvenido a SuperQuizTV!"); // Estado para el mensaje de bienvenida
  const [messageColor, setMessageColor] = useState("#FFFFFF"); // Estado para el color del mensaje
  const [buttonText, setButtonText] = useState("Iniciar el juego"); // Estado para el texto del botón
  // Se mantiene el color del botón de inicio siempre en #1cba6d
  const [buttonColor] = useState("#1cba6d"); // Color fijo para el botón de inicio
  const [showThanksMessage, setShowThanksMessage] = useState(false); // Estado para mostrar el mensaje de agradecimiento
  const [resetGame, setResetGame] = useState(false);

  useEffect(() => {
    const loadScript = (src) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
      return () => document.body.removeChild(script);
    };

    const scripts = [
      "https://unpkg.com/aframe-extras/dist/aframe-extras.loaders.min.js",
      "https://unpkg.com/aframe-environment-component/dist/aframe-environment-component.min.js",
      "https://unpkg.com/aframe-animation-component/dist/aframe-animation-component.min.js",
      "https://cdn.jsdelivr.net/gh/c-frame/aframe-physics-system@v4.2.2/dist/aframe-physics-system.min.js",
    ];

    scripts.forEach(script => loadScript(script));

    // Reproducir el audio al cargar la página
    const audio = new Audio("../audio/superquiztv-sintonia.mp3");
    audio.play().catch(error => console.error("Error al reproducir el audio:", error));

    audio.addEventListener("ended", () => {
      const cameraEl = document.querySelector("[camera]");
      cameraEl.setAttribute("animation", {
        property: "rotation",
        to: "0 180 0",
        dur: 2000,
      });
    });
    // Llamar a la función para obtener las preguntas al cargar el componente
    fetchQuestions();
  }, [resetGame]); // Agregar resetGame al array de dependencias para que se vuelva a llamar cuando resetGame cambie

  // Función para obtener las preguntas del servidor
  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:3001/questions"); // Asegúrate de que esta URL es correcta para tu backend
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Convertir la respuesta a JSON
      const questionsData = await response.json();

      // Actualizar el estado con los datos
      setQuestions(questionsData);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Función para manejar la selección de una opción de respuesta
  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      const audio = new Audio("../audio/aplausos-correcta.mp3");
      audio.play();
      setMessage("¡ Respuesta correcta !");
      setMessageColor("#00FF00"); // Color verde
      setScore(score + 10); // Sumar 10 puntos al marcador
    } else {
      const audio = new Audio("../audio/Respuesta_incorrecta.mp3");
      audio.play();
      setMessage("Respuesta incorrecta.");
      setMessageColor("#FF0000"); // Color rojo
    }
    // Pasar a la siguiente pregunta
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleExit = () => {
    // Mostrar el mensaje de agradecimiento con animación
    setMessage("");
    setQuestions("");

    setShowThanksMessage(true);
    setTimeout(() => {
      // Reiniciar el estado después de la animación
      setShowThanksMessage(false);
      setCurrentQuestionIndex(-1);
      setScore(0);
      setMessage("¡Bienvenido a SuperQuizTV!");
      setButtonText("Iniciar el juego");
      // No es necesario actualizar el color del botón aquí porque ya está fijado a #1cba6d
      setResetGame(!resetGame); // Cambiar el estado resetGame para reiniciar el juego
    }, 3000); // La animación dura 3 segundos
  };

  // Función para iniciar el juego
  const handleStartGame = () => {
    // Cambiar el texto del botón
    setButtonText("Salir");
    // No es necesario cambiar el color del botón aquí porque ya está fijado a #1cba6d
    // Pasar a la primera pregunta
    setCurrentQuestionIndex(0);
    // Limpiar el mensaje de bienvenida
    setMessage("");
  };

  // Verificar si todas las preguntas han sido respondidas
  const allQuestionsAnswered = currentQuestionIndex >= questions.length;
  // Obtener la pregunta actual
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="aframe-container">
      <a-scene cursor="rayOrigin: mouse">
        <a-entity
          id="Studio"
          scale="3 3 3"
          position="0 0 -9"
          play-all-model-animations
          gltf-model="https://cdn.glitch.global/6903e30e-6840-4477-b169-010c06a93a4b/news_broadcast_studio_set_vr_ready.glb?v=1710197418682"
          alt="Studio"
        ></a-entity>

<a-image
          src="../imagenes/pantalla4.png"
          position="0 4 8.8"
          rotation="0 180 0"
          width="3"
          height="2"
          material=""
          geometry=""
          scale="4.53 3.84 1"
        ></a-image>

        <a-entity id="Camara 1" scale="2 2 2" position="9.3256 0.08489 -14.20345" gltf-model="https://cdn.glitch.global/ca1c16c1-9540-4611-b027-31e90d33a5a0/studio_camera.glb?v=1711369859669" rotation="0 -220 0"></a-entity>

        <a-entity id="Camara 2" scale="2 2 2" position="0.43747 -0.055 -15.068" gltf-model="https://cdn.glitch.global/ca1c16c1-9540-4611-b027-31e90d33a5a0/studio_camera.glb?v=1711369859669" rotation="0 -180 0"></a-entity>

        <a-entity id="Camara 3" scale="2 2 2" position="-8.65632 -0.08253 -15.98713" gltf-model="https://cdn.glitch.global/ca1c16c1-9540-4611-b027-31e90d33a5a0/studio_camera.glb?v=1711369859669" rotation="0 -140 0"></a-entity>

        <a-entity id="Avatar-Moha" scale="2 2 2" position="-1.6294 0.23964 -8.89422" gltf-model="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/moham.glb?v=1711027006919" rotation="0 20.47 0" animation-mixer=""></a-entity>
        
        <a-entity id="Felipe" scale="2 2 2" rotation="0 50.566 0" position="-5.63886 0.12028 -9.65711" animation-mixer="" gltf-model="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/superfelics.glb?v=1711022921561"></a-entity>

        <a-image id="TV1" src="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/Image20240315094940.jpg?v=1710492722845" width="3.2" height="1.79" material="" geometry="" position="8.97387 3.99994 -22.8838" rotation="0 -12.7 0" scale="3 3 3"></a-image>

        <a-image id="TV2" src="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/Image20240315094940.jpg?v=1710492722845" width="3.2" height="1.79" material="" geometry="" position="-9.16645 4.09355 -23.03905" rotation="0 14.93 0" scale="3 3 3"></a-image>

        <a-image id="TV3" src="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/Image20240315094940.jpg?v=1710492722845" width="3.2" height="1.79" material="" position="-17.28378 3.22116 -15.78981" rotation="0 88.18 0" geometry="" scale="3 3 3"></a-image>

        <a-image id="TV4" src="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/Image20240315094940.jpg?v=1710492722845" width="3.2" height="1.79" material="" position="17.38511 3.91039 -10.30942" rotation="0 269.76 0" geometry="" scale="3 3 3"></a-image>

        {showThanksMessage && (
          <a-text
            value="¡Gracias por participar y hasta la próxima."
            position="4 5 8.7"
            rotation="0 180 0"
            width="12"
            color="#24cb7a"
            font="Roboto-Regular-msdf.json"
          ></a-text>
        )}

        {currentQuestionIndex === -1 && (
          <>
            <a-text
              font="Roboto-Regular-msdf.json"
              value={message}
              position="3 4.5 8.7"
              rotation="0 180 0"
              width="12"
              color={messageColor}
            ></a-text>
            <a-box
              position="0 3 8.7"
              color={buttonColor} // El color se mantiene en #1cba6d
              width="4"
              height="0.5"
              depth="0.1"
              onClick={handleStartGame}
            ></a-box>
            <a-text
              font="Roboto-Regular-msdf.json"
              value={buttonText}
              color="#FFFFFF"
              position="0 3 8.65"
              width="8"
              align="center"
              rotation="0 180 0"
            ></a-text>
          </>
        )}

        {!allQuestionsAnswered && currentQuestionIndex !== -1 && (
          <>
            <a-text
              font="Roboto-Regular-msdf.json"
              value={currentQuestion.text}
              position="3.5 6 8.7"
              rotation="0 180 0"
              width="10"
              color="#7ebfcf"
            ></a-text>
            {currentQuestion.options.map((option, index) => (
              <React.Fragment key={index}>
                <a-box
                  position={`0 ${4.5 - index * 0.7} 8.7`}
                  rotation="0 180 0"
                  color="#65087c"
                  width="4"
                  height="0.5"
                  depth="0.1"
                  onClick={() => handleAnswer(option.isCorrect)}
                ></a-box>
                <a-text
                  font="Roboto-Regular-msdf.json"
                  rotation="0 180 0"
                  value={option.text}
                  position={`0 ${4.5 - index * 0.7} 8.65`}
                  width="8"
                  align="center"
                ></a-text>
              </React.Fragment>
            ))}
          </>
        )}

        {currentQuestionIndex !== -1 && !showThanksMessage && (
          <a-text
            font="Roboto-Regular-msdf.json"
            value={message}
            position="2 1.5 8.7"
            rotation="0 180 0"
            width="8"
            color={messageColor}
          ></a-text>
        )}

        {currentQuestionIndex !== -1 && !showThanksMessage && (
          <a-text
            font="Roboto-Regular-msdf.json"
            value={`Marcador: ${score} Puntos`}
            position="-3 1.5 8.7"
            rotation="0 180 0"
            width="8"
            color="#FFF"
          ></a-text>
        )}

        {/* Botón para salir. Nota: Este botón solo se muestra cuando hay una pregunta en curso, no afecta el botón de inicio */}
        {currentQuestionIndex !== -1 && !showThanksMessage && (
          <>
            <a-box
              position="5 1.5 8.7"
              color="#FF0000" // Este es el botón de salida, no el de inicio
              width="2"
              height="0.5"
              depth="0.1"
              onClick={handleExit}
            ></a-box>
            <a-text
              font="Roboto-Regular-msdf.json"
              value="Salir"
              color="#FFFFFF"
              position="5 1.5 8.65"
              width="8"
              align="center"
              rotation="0 180 0"
            ></a-text>
          </>
        )}
      </a-scene>
    </div>
  );
};

export default AFrameScene;

