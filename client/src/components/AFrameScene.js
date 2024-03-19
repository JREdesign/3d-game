// AFrameScene.js en la carpeta src/components
import React, { useState, useEffect } from 'react';
import 'aframe'; // A-Frame importado a través de npm

const AFrameScene = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null); // Estado para almacenar la pregunta actual

  useEffect(() => {
    fetch('http://localhost:3001/questions') // Asegúrate de que esta URL es correcta para tu backend
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(questions => {
        if (questions.length > 0) {
          const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
          setCurrentQuestion(randomQuestion);
        }
      })
      .catch(error => console.error('Error fetching questions:', error));
  }, []);

  const handleAnswer = (isCorrect) => {
    console.log(isCorrect ? 'Correct answer!' : 'Wrong answer.');
    // Aquí podrías implementar lógica adicional para manejar la respuesta seleccionada
  };

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
          play-all-model-animations
          gltf-model="https://cdn.glitch.global/6903e30e-6840-4477-b169-010c06a93a4b/65ef07eefccb0ca0f6263b18.glb?v=1710197331276"
          alt="Avatar-Moha"
        ></a-entity>

        <a-entity id="TV-1" 
          geometry="depth: 0.01; height: 1.71; width: 3.1" 
          position="-5.54414 1.414 -1.05" 
          rotation="0 59.99999999999999 0" 
          material="transparent: true; src: https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/Image20240315094940.jpg?v=1710492722845">
        </a-entity>
        <a-entity id="TV-2" 
          geometry="depth: 0.01; width: 3.1; height: 1.71; skipCache: true" 
          position="-1.04996 1.424 -5.54001" 
          rotation="0 -150.03600000000003 0"
          material="transparent: true; src: https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/Image20240315094940.jpg?v=1710492722845">
        </a-entity>
        <a-entity id="TV-3" 
          geometry="skipCache: true; depth: 0.01; height: 1.62; width: 2.95; segmentsHeight: 5; segmentsWidth: 5" 
          position="-5.70752 1.103 2.54339" 
          rotation="0 -44.72 0" visible="" 
          material="src: https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/Image20240315094940.jpg?v=1710492722845">
        </a-entity>
        <a-entity id="Balltoy" 
          animation-mixer="" 
          gltf-model="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/balltoy.glb?v=1710513944202" 
          position="-0.34056 0.97424 0.35578" rotation="0 55.10020524214101 0" 
          scale="0.25 0.25 0.25">
        </a-entity>


        {currentQuestion && (
          <>
            <a-text 
              value={currentQuestion.text} 
              position="1.5 4 8.7" 
              rotation="0 180 0"
              width="6"
              color="#FF0000"
            ></a-text>
            
            {currentQuestion.options.map((option, index) => (
              <React.Fragment key={index}>
                <a-box 
                  position={`-1 ${3 - index * 0.7} 8.7`} 
                  rotation="0 180 0"
                  color="#4CC3D9" 
                  width="4" 
                  height="0.5" 
                  depth="0.1"
                  onClick={() => handleAnswer(option.isCorrect)}
                ></a-box>
                <a-text
                  rotation="0 180 0"
                  value={option.text}
                  position={`-1 ${3 - index * 0.7} 8.65`} // Posición ligeramente adelante del botón
                  width="4"
                  align="center"
                ></a-text>
              </React.Fragment>
            ))}
          </>
        )}
      </a-scene>
    </div>
  );
};

export default AFrameScene;
