AFRAME.registerComponent('click-handler-centinela1', {
  init: function () {
    var el = this.el;
    el.addEventListener('click', function () {
      showModal('Dron Centinela', 'Un dron centinela, parece está vigilando la entrada al edificio del laboratorio...');
    });
  }
});

AFRAME.registerComponent('click-handler-centinela2', {
  init: function () {
    var el = this.el;
    el.addEventListener('click', function () {
      showModal('Otro dron centinela', 'Este otro centinela vigila los alrededores de la estación...');
    });
  }
});

AFRAME.registerComponent('click-handler-laboratorio', {
  init: function () {
    var el = this.el;
    el.addEventListener('click', function () {
      showModal('Laboratorio espacial','Un laboratorio de investigación espacial. Parece que hay un centinela vigilando cerca posibles intrusiones, no suele ser común en los laboratorios normales, quizás guarde algún secreto...');
    });
  }
});

AFRAME.registerComponent('click-handler-torre', {
  init: function () {
    var el = this.el;
    el.addEventListener('click', function () {
      showModal('Gran torre','Esta gran torre adyacente al laboratorio debe tener algún tipo de uso para las comunicaciones... además parece tener un pequeño helipuerto de drones');
    });
  }
});

AFRAME.registerComponent('click-handler-perseverance', {
  init: function () {
    var el = this.el;
    el.addEventListener('click', function () {
      showModal('Rover averiado','Parece que es el Perseverance, un rover marciano que la humanidad envió a Marte en el año 2020 con la misión de buscar agua y muestras de habitibilidad. Parece que lleva aqui abandonado años...');
    });
  }
});

AFRAME.registerComponent('click-handler-navecargo', {
  init: function () {
    var el = this.el;
    el.addEventListener('click', function () {
      showModal('Nave de carga','Parece una nave de carga. Un tanto antigua a mi parecer, los primeros colonos solian usarla para el transporte de mercancias de manera sencilla. Es posible que pertenezca a este laboratorio...');
    });
  }
});

AFRAME.registerComponent('click-handler-estacion', {
  init: function () {
    var el = this.el;
    el.addEventListener('click', function () {
      showModal('Estación espacial marciana','Una estación espacial, lo mas común por este lado del Sistema solar, suelen contener los barracones del personal y los servicios básicos de soporte vital... Está también rodeada de centinelas, me pregunto por que todo este revuelo en la zona');
    });
  }
});

AFRAME.registerComponent('click-handler-cartel', {
  init: function () {
    var el = this.el;
    el.addEventListener('click', function () {
      showModal('Cartel luminoso','Vaya, parece que Shavare está detrás de todo esto... quién iba a decir que un foro para compartir recursos llegaría a convertirse en la empresa dueña de media galaxia...');
    });
  }
});

AFRAME.registerComponent('click-handler-colonia', {
  init: function () {
    var el = this.el;
    el.addEventListener('click', function () {
      showModal('Ciudad marciana','Esos lejanos domos son de la ciudad marciana de Acheron, una de las primeras colonias del planeta, pero no podemos ir alli ahora... ');
    });
  }
});

AFRAME.registerComponent('click-handler-vertedero', {
  init: function () {
    var el = this.el;
    el.addEventListener('click', function () {
      showModal('Vertedero','Parece un vertedero del laboratorio, se puede observar basura y algunos drones centinela estropeados');
    });
  }
});


// GRAB //

AFRAME.registerComponent('grab', {
  schema: {
    cameraId: { default: 'camera' },
    distance: { default: 3 } // Distancia frente a la cámara
  },
  init: function() {
    this.cameraEl = document.getElementById(this.data.cameraId);
    this.grabbing = false;
    
    this.el.addEventListener('mousedown', () => {
      this.grabbing = true;
      this.el.setAttribute('dynamic-body', {type: 'kinematic'}); // Cambia a kinemático
    });

    this.el.addEventListener('mouseup', () => {
      this.grabbing = false;
      this.el.setAttribute('dynamic-body', {type: 'dynamic'}); // Restaura a dinámico
    });
  },
  tick: function() {
    if (this.grabbing) {
      var camPos = this.cameraEl.getAttribute('position');
      var camDir = this.cameraEl.object3D.getWorldDirection(new THREE.Vector3());
      var newPos = {
        x: camPos.x + camDir.x * this.data.distance,
        y: camPos.y + camDir.y * this.data.distance,
        z: camPos.z + camDir.z * this.data.distance
      };
      this.el.setAttribute('position', newPos);
    }
  }
});


// MODAL //

function showModal(title, content) {
  var modalTitle = document.getElementById('infoModalLabel');
  var modalBody = document.getElementById('modalBody');

  modalTitle.textContent = title;
  modalBody.innerHTML = '<p>' + content + '</p>';

  var infoModal = new bootstrap.Modal(document.getElementById('infoModal'));
  infoModal.show();
}


//COLIDER

// inside an a-frame component - this is straight from the docs
AFRAME.registerComponent('foo', {
  init: function() {
    this.el.addEventListener('collide', function(e) {
      console.log('Player has collided with ', e.detail.body.el);
    });
  }
})