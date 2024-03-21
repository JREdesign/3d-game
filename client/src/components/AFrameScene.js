import React, { useState, useEffect } from "react";
import "aframe"; // A-Frame importado a través de npm

const AFrameScene = () => {
  const [questions, setQuestions] = useState([]); // Estado para almacenar las preguntas
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // Estado para almacenar el índice de la pregunta actual
  const [score, setScore] = useState(0); // Estado para almacenar el marcador
  const [message, setMessage] = useState("¡Bienvenido a Super Quiz TV!"); // Estado para el mensaje de bienvenida
  const [messageColor, setMessageColor] = useState("#FFFFFF"); // Estado para el color del mensaje
  const [buttonText, setButtonText] = useState("Iniciar el juego"); // Estado para el texto del botón
  const [buttonColor, setButtonColor] = useState("#00FF00"); // Estado para el color del botón
  const [showThanksMessage, setShowThanksMessage] = useState(false); // Estado para mostrar el mensaje de agradecimiento
  const [resetGame, setResetGame] = useState(false);

  useEffect(() => {
    // Reproducir el audio al cargar la página
    const audio = new Audio("../audio/concurso.mp3");
    audio.play();

    audio.addEventListener("ended", () => {
      const cameraEl = document.querySelector("[camera]");
      cameraEl.setAttribute("animation", {
        property: "rotation",
        to: "0 180 0",
        dur: 2000, // Duración de la animación en milisegundos
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
      setMessage("¡Bienvenido a Super Quiz TV!");
      setButtonText("Iniciar el juego");
      setButtonColor("#00FF00");
      setResetGame(!resetGame); // Cambiar el estado resetGame para reiniciar el juego
    }, 3000); // La animación dura 3 segundos
  };

  // Función para iniciar el juego
  const handleStartGame = () => {
    // Cambiar el texto y el color del botón
    setButtonText("Salir");
    setButtonColor("#FF0000"); // Color rojo
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

        <a-entity
          id="Avatar-Moha"
          scale="2 2 2"
          animation=""
          position="-1 0 -7.7"
          play
          all-model-animations
          gltf-model="https://cdn.glitch.global/6903e30e-6840-4477-b169-010c06a93a4b/65ef07eefccb0ca0f6263b18.glb?v=1710197331276"
          alt="Avatar-Moha"
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

        {/* Mostrar mensaje de despedida */}
        {showThanksMessage && (
          <a-text
            value="Gracias por participar y hasta la próxima."
            position="4 5 8.7"
            rotation="0 180 0"
            width="12"
            color="#FFD700"
            font="Roboto-Regular-msdf.json"
          ></a-text>
        )}

        {currentQuestionIndex === -1 && (
          <>
            {/* Mensaje de bienvenida */}
            <a-text
              font="Roboto-Regular-msdf.json"
              value={message}
              position="3 4.5 8.7"
              rotation="0 180 0"
              width="12"
              color={messageColor}
            ></a-text>
            {/* Botón de inicio del juego */}
            <a-box
              position="0 3 8.7"
              color={buttonColor}
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
              text=""
              rotation="0 180 0"
            ></a-text>
          </>
        )}

        {!allQuestionsAnswered && currentQuestionIndex !== -1 && (
          <>
            {/* Mostrar la pregunta y las opciones */}
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
                  color="#4CC3D9"
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

        {/* Mostrar mensaje de respuesta */}
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

        {/* Mostrar marcador */}
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

        {/* Botón para salir */}
        {currentQuestionIndex !== -1 && !showThanksMessage && (
          <>
            <a-box
              position="5 1.5 8.7"
              color="#FF0000"
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
              text=""
              rotation="0 180 0"
            ></a-text>
          </>
        )}
      </a-scene>
    </div>
  );
};

export default AFrameScene;
