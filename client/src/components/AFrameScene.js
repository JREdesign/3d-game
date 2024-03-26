import React, { useState, useEffect } from "react";
import "aframe"; // A-Frame importado a través de npm
import "./aframeStyle.css";

const AFrameScene = () => {
  const [questions, setQuestions] = useState([]); // Estado para almacenar las preguntas
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // Estado para almacenar el índice de la pregunta actual
  const [score, setScore] = useState(0); // Estado para almacenar el marcador
  const [level, setLevel] = useState(1); // Estado para almacenar el nivel actual
  const [message, setMessage] = useState("¡Bienvenido a Super Quiz TV!"); // Estado para el mensaje de bienvenida
  const [messageColor, setMessageColor] = useState("#FFFFFF"); // Estado para el color del mensaje
  const [buttonText, setButtonText] = useState("Iniciar el juego"); // Estado para el texto del botón
  const [buttonColor, setButtonColor] = useState("#5dbd5d"); // Estado para el color del botón
  const [showThanksMessage, setShowThanksMessage] = useState(false); // Estado para mostrar el mensaje de agradecimiento
  const [showFelicitacionMessage, setShowFelicitacionMessage] = useState(false); // Estado para mostrar el mensaje de felicitacion
  const [resetGame, setResetGame] = useState(false);
  const [levelTimer, setLevelTimer] = useState(20); // Estado para el temporizador del nivel
  const levelNumber = level;
  const totalLevel = 3;
  const levelCounter = `Nivel : ${levelNumber} / ${totalLevel}`;
  const totalQuestions = Array.isArray(questions)
    ? questions.filter((question) => question.level === level).length
    : 0;
  const questionNumber = currentQuestionIndex + 1;
  const questionCounter = `Pregunta : ${questionNumber} / ${totalQuestions}`;
  const timer = `Te quedan : ${levelTimer} segundos`;

  const allQuestionsAnswered = currentQuestionIndex >= questions.length;
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const loadScript = (src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
      return () => document.body.removeChild(script);
    };
    // Reproducir el audio al cargar la página
    const audio = new Audio("../audio/superquiztv-sintonia.mp3");
    audio
      .play()
      .catch((error) => console.error("Error al reproducir el audio:", error));

    const sceneContainer = document.querySelector("#escena");
    sceneContainer.setAttribute("animation", {
      property: "rotation",
      to: "0 180 0",
      dur: 2000,
    });

    fetchQuestions();
  }, [resetGame, level]); // Agregar resetGame al array de dependencias para que se vuelva a llamar cuando resetGame cambie

  useEffect(() => {
    let intervalId;
    if (levelTimer > 0) {
      intervalId = setInterval(() => {
        setLevelTimer((prevTimer) => prevTimer - 1);
      }, 1000); // Actualizar el temporizador cada segundo
    } else if (levelTimer === 0) {
      handleExit();
    }
    // Limpiar el temporizador cuando el componente se desmonte o cuando se cambie el nivel
    return () => clearInterval(intervalId);
  }, [levelTimer, currentQuestionIndex]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/questions?level=" + level
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const questionsData = await response.json();
      const shuffledQuestions = questionsData.sort(() => Math.random() - 0.5);

      if (Array.isArray(shuffledQuestions)) {
        setQuestions(shuffledQuestions);
        setCurrentQuestionIndex(-1); // Reiniciar el índice de la pregunta actual al obtener nuevas preguntas
      } else {
        console.error(
          "El objeto devuelto no es un array de preguntas:",
          shuffledQuestions
        );
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
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
    // Iniciar el temporizador del nivel
    setLevelTimer(20);
  };

  const handleExit = () => {
    // Mostrar el mensaje de agradecimiento con animación
    setMessage("");
    setQuestions("");
    setButtonText("");

    setShowFelicitacionMessage(false);
    setShowThanksMessage(true);
    setTimeout(() => {
      // Reiniciar el estado después de la animación
      setShowThanksMessage(false);
      setCurrentQuestionIndex(-1);
      setScore(0);
      setLevel(1);
      setMessage("¡Bienvenido a Super Quiz TV!");
      setButtonText("Iniciar el juego");
      setButtonColor("#5dbd5d");
      setResetGame(!resetGame); // Cambiar el estado resetGame para reiniciar el juego
    }, 1500); // La animación dura 1.5 segundos
  };

  // Función para manejar la selección de una opción de respuesta
  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setMessage("¡Respuesta correcta!");
      setMessageColor("#5dbd5d"); // Color verde
      setScore(score + 10); // Sumar 10 puntos al marcador
    } else {
      setMessage("¡Respuesta incorrecta!");
      setMessageColor("#5dbd5d"); // Color rojo
    }
    // Pasar a la siguiente pregunta después de 2 segundos
    setTimeout(() => {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessage(""); // Borrar el mensaje después de 2 segundos
    }, 3000);
  };

  useEffect(() => {
    if (score === 20 && level < totalLevel) {
      setLevel(level + 1); // Pasar al siguiente nivel si el marcador es mayor que 30 y no estamos en el nivel máximo
      setScore(0); // Reiniciar el marcador
      setLevelTimer(20);
      setMessage("Muy Bien");
      setButtonText(`Nivel : ${levelNumber} / ${totalLevel}`);
    } else if (score === 20 && level === totalLevel) {
      setMessage("");
      setQuestions("");
      setShowThanksMessage(false);
      setShowFelicitacionMessage(true); // Mostrar el mensaje de felicitación
      const audio = new Audio("../audio/aplausos-correcta.mp3");
      audio.play();
      setTimeout(() => {
        // Reiniciar el estado después de la animación
        setShowThanksMessage(false);
        setShowFelicitacionMessage(false);
        setCurrentQuestionIndex(-1);
        setScore(0);
        setLevel(1);
        setMessage("¡Bienvenido a Super Quiz TV!");
        setButtonText("Iniciar el juego");
        setButtonColor("#5dbd5d");
        setResetGame(!resetGame); // Cambiar el estado resetGame para reiniciar el juego
      }, 1500); // La animación dura 1.5 segundos
    }
  }, [score]);

  return (
    <div className="aframe-container">
      <a-scene cursor="rayOrigin: mouse">
        <a-entity id="escena">
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
          <a-entity
            id="Camara 1"
            scale="2 2 2"
            position="9.3256 0.08489 -14.20345"
            gltf-model="https://cdn.glitch.global/ca1c16c1-9540-4611-b027-31e90d33a5a0/studio_camera.glb?v=1711369859669"
            rotation="0 -220 0"
          ></a-entity>
          <a-entity
            id="Camara 2"
            scale="2 2 2"
            position="0.43747 -0.055 -15.068"
            gltf-model="https://cdn.glitch.global/ca1c16c1-9540-4611-b027-31e90d33a5a0/studio_camera.glb?v=1711369859669"
            rotation="0 -180 0"
          ></a-entity>
          <a-entity
            id="Camara 3"
            scale="2 2 2"
            position="-8.65632 -0.08253 -15.98713"
            gltf-model="https://cdn.glitch.global/ca1c16c1-9540-4611-b027-31e90d33a5a0/studio_camera.glb?v=1711369859669"
            rotation="0 -140 0"
          ></a-entity>
          <a-entity
            id="Avatar-Moha"
            scale="2 2 2"
            position="-1.6294 0.23964 -8.89422"
            gltf-model="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/moham.glb?v=1711027006919"
            rotation="0 20.47 0"
            animation-mixer=""
          ></a-entity>
          <a-entity
            id="Felipe"
            scale="2 2 2"
            rotation="0 50.566 0"
            position="-5.63886 0.12028 -9.65711"
            animation-mixer=""
            gltf-model="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/superfelics.glb?v=1711022921561"
          ></a-entity>
          <a-image
            id="TV1"
            src="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/Image20240315094940.jpg?v=1710492722845"
            width="3.2"
            height="1.79"
            material=""
            geometry=""
            position="8.97387 3.99994 -22.8838"
            rotation="0 -12.7 0"
            scale="3 3 3"
          ></a-image>
          <a-image
            id="TV2"
            src="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/Image20240315094940.jpg?v=1710492722845"
            width="3.2"
            height="1.79"
            material=""
            geometry=""
            position="-9.16645 4.09355 -23.03905"
            rotation="0 14.93 0"
            scale="3 3 3"
          ></a-image>
          <a-image
            id="TV3"
            src="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/Image20240315094940.jpg?v=1710492722845"
            width="3.2"
            height="1.79"
            material=""
            position="-17.28378 3.22116 -15.78981"
            rotation="0 88.18 0"
            geometry=""
            scale="3 3 3"
          ></a-image>
          <a-image
            id="TV4"
            src="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/Image20240315094940.jpg?v=1710492722845"
            width="3.2"
            height="1.79"
            material=""
            position="17.38511 3.91039 -10.30942"
            rotation="0 269.76 0"
            geometry=""
            scale="3 3 3"
          ></a-image>

          {/* Mostrar mensaje de despedida */}
          {showThanksMessage && (
            <a-text
              value="¡Gracias por participar y hasta la próxima!"
              position="4 5 8.7"
              rotation="0 180 0"
              width="12"
              color="#5dbd5d"
              font="Roboto-Regular-msdf.json"
            ></a-text>
          )}

          {/* Mostrar mensaje de felicitacion */}
          {showFelicitacionMessage && (
            <a-text
              value="¡ Enhorabuena has tarminado todos los niveles !"
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
                position="0 3 8.64"
                width="8"
                align="center"
                text=""
                rotation="0 180 0"
              ></a-text>
            </>
          )}
          {!allQuestionsAnswered && currentQuestionIndex !== -1 && (
            <>
              {/* Mostrar el numero de pregunta */}
              <a-text
                value={questionCounter}
                position="-3.1 1.5 8.7"
                rotation="0 180 0"
                width="8"
                color="#FFF"
                text=""
              ></a-text>
              {/* Mostrar el nivel */}
              <a-text
                value={levelCounter}
                position="3 7 8.7"
                rotation="0 180 0"
                width="8"
                color="#FFF"
                text=""
              ></a-text>
              {/* Mostrar el cronometro */}
              <a-text
                value={timer}
                position="-2 7 8.7"
                rotation="0 180 0"
                width="8"
                color="#FFF"
                text=""
              ></a-text>

              {/* Barras de progreso */}
              <a-plane
                position="2 6.5 8.7"
                rotation="0 180 0"
                width="3" // Ancho total de la barra
                height="0.2"
                color="#FFFFFF" // Establecer el color del fondo blanco
                material="opacity: 0.2" // Ajustar la opacidad si es necesario
              ></a-plane>
              <a-plane
                position={`${0.5 + level / totalLevel} 6.5 8.7`}
                rotation="0 180 0"
                height="0.2"
                color="#5dbd5d"
                width={`${(level / totalLevel) * 3}`} // Ancho ajustado según el progreso del nivel
              ></a-plane>

              <a-plane
                position="-4 6.5 8.7" // Posición ajustada para que el lado izquierdo sea fijo
                rotation="0 180 0"
                width="4" // Ancho total de la barra
                height="0.2"
                color="#FFFFFF" // Establecer el color del fondo blanco
                material="opacity: 0.2" // Ajustar la opacidad si es necesario
              ></a-plane>
              <a-plane
                position={`${-6 + (levelTimer / 20) * 2} 6.5 8.7`}
                rotation="0 180 0"
                width={(levelTimer / 20) * 4} // Ancho ajustado para que la barra disminuya solo por el lado izquierdo
                height="0.2"
                color="#FF0000" // Color de la barra de progreso
              ></a-plane>

              {/* Mostrar la pregunta y las opciones */}
              <a-text
                font="Roboto-Regular-msdf.json"
                value={currentQuestion.text}
                align="center"
                position="0 5.5 8.7"
                rotation="0 180 0"
                width="10"
                color="#7ebfcf"
              ></a-text>
              {currentQuestion.options.map((option, index) => (
                <React.Fragment key={index}>
                  <a-box
                    position={`0 ${4 - index * 0.7} 8.7`}
                    rotation="0 180 0"
                    color="#6f2aa4"
                    width="8"
                    height="0.5"
                    depth="0.1"
                    onClick={() => handleAnswer(option.isCorrect)}
                  ></a-box>
                  <a-text
                    font="Roboto-Regular-msdf.json"
                    rotation="0 180 0"
                    value={option.text}
                    position={`0 ${4 - index * 0.7} 8.64`}
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
              position="2 1.2 8.7"
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
              position="-3 1 8.7"
              rotation="0 180 0"
              width="8"
              color="#FFF"
            ></a-text>
          )}
          {/* Botón para salir */}
          {currentQuestionIndex !== -1 && !showThanksMessage && (
            <>
              <a-box
                position="5 1 8.7"
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
                position="5 1 8.64"
                width="8"
                align="center"
                text=""
                rotation="0 180 0"
              ></a-text>
            </>
          )}
        </a-entity>
      </a-scene>
    </div>
  );
};

export default AFrameScene;
