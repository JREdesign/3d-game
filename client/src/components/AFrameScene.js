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
          id="frontal-pres"
          camera="far: 5000; fov: 50; near: 0.600; zoom: 1" 
          position="3.545 1.119 4" 
          wasd-controls="fly: true" 
          rotation="0 45 0" 
          look-controls="enabled: false; magicWindowTrackingEnabled: false" aframe-injected="" 
          data-aframe-inspector-original-camera="">
        </a-entity>

        <a-entity 
          id="front-preguntas"
          camera="far: 5000; near: 0.6; fov: 50" 
          position="1.46958 1.10494 0.42903" 
          wasd-controls="fly: true" 
          rotation="" 
          look-controls="enabled: false; magicWindowTrackingEnabled: false" aframe-injected="" 
          data-aframe-inspector-original-camera=""  
          visible="">
        </a-entity>

        <a-entity 
          id="studio" 
          gltf-model="https://cdn.glitch.global/e498bbac-0930-47bb-9173-5bbd6d2e8538/studio.glb?v=1710409164949" position="0 0 0" 
          scale="1 1 1" 
          rotation="0 45 0">
        </a-entity>
        
        <a-entity
          id="Avatar-Moha"
          scale=".650 .650 .650"
          animation-mixer=""
          position="-0.34056 0.080 0.356"
          rotation="0 55.71 0"
          gltf-model="https://cdn.glitch.global/6903e30e-6840-4477-b169-010c06a93a4b/65ef07eefccb0ca0f6263b18.glb?v=1710197331276"
        ></a-entity>

        <a-entity 
          id="Pikachu" 
          animation-mixer="" 
          gltf-model="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/pickachu.glb?v=1710759330399" scale="0.05 0.05 0.05" 
          position="0.89527 0.64841 -0.09294">
        </a-entity>

        <a-entity 
          id="TV-1" 
          geometry="height: 1.77; width: 3.17; primitive: plane" 
          position="-5.5468 1.36708 -1.04272" 
          rotation="0 59.99999999999999 0" 
          material="transparent: true; src: https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/Image20240315094940.jpg?v=1710492722845">
        </a-entity>

        <a-entity 
          id="TV-2" 
          geometry="width: 3.2; height: 1.79; skipCache: true; primitive: plane" 
          position="-1.04222 1.35412 -5.54001" 
          rotation="0 29.89350000315557 0" 
          material="transparent: true; src: https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/Image20240315094940.jpg?v=1710492722845">
        </a-entity>

        <a-entity 
          id="TV-3" 
          geometry="skipCache: true; height: 1.62; width: 2.95; primitive: plane" position="-5.70752 1.04416 2.4463" 
          rotation="0 132.8 0" 
          visible="" 
          material="src: https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/Image20240315094940.jpg?v=1710492722845; side: double">
        </a-entity>

        <a-entity id="Balltoy" 
          animation-mixer="" 
          gltf-model="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/balltoy.glb?v=1710513944202" 
          position="-1.07 0.97424 1.783" 
          rotation="0 55.10020524214101 0" 
          scale="0.25 0.25 0.25">
        </a-entity>
        
        <a-entity 
          id="presentador-luz"
          light="color: #d9d9d9; angle: 0; castShadow: true" data-aframe-default-light="" 
          aframe-injected=""  
          position="0 2.08609 1.16714">
        </a-entity>

        <a-entity 
          id="camera-1" 
          gltf-model="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/studio-cam.glb?v=1710850093939" scale="0.5 0.5 0.5" 
          position="0.50273 0 5.51023">
        </a-entity>

        <a-entity id="camera-2" 
          gltf-model="https://cdn.glitch.global/8706468d-4e4a-413e-bce6-5e210b1fc903/studio-cam.glb?v=1710850093939" scale="0.5 0.5 0.5" 
          position="5.31759 0 1.62518" 
          rotation="0 90 0">
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
