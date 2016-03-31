const position = [0, 0];
const velocity = [0, 0];

const spawn = {
  period: 1,
  cooldown: 0,
  entity: {},
};

const spawnee = Object.assign({}, {
  position,
  velocity,
});

const spawner = Object.assign({}, {
  position,
  spawn,
});

let state = {
  'spawner1': Object.assign({}, spawner, {
    spawn: Object.assign({}, spawn, {
      entity: spawnee,
    }),
  }),
};

setTimeout(function tick(then) {
  const now = Date.now();
  const time = (now - (then || now)) / 1000;

  const display = document.getElementById('display');

  const context = {
    time,
    now,
    display,
  };

  const systems = [
    spawns,
    physics,
    visuals,
  ];

  state = systems.reduce(function(state, system) {
    return system(state, context);
  }, state);

  setTimeout(tick, 0, now);
});

function spawns(state, { time, now }) {
  return Object.keys(state).reduce(function(value, key) {
    var entity = state[key];

    var { spawn } = entity;

    if (!spawn) {
      value[key] = entity;
      return value;
    }

    let { cooldown, period } = spawn;

    cooldown -= time;
    if (cooldown <= 0) {
      cooldown += period;
      
      let velocity = [Math.random() * 100, Math.random() * 100];
      let spawnee = Object.assign({}, spawn.entity, {
        velocity,
      });

      value[now] = JSON.parse(JSON.stringify(spawnee));
    }

    spawn = Object.assign({}, spawn, {
      cooldown,
    });

    entity = Object.assign({}, entity, {
      spawn,
    });

    return Object.assign(value, {
      key: entity,
    });
  }, {});
}

function physics(state, { time }) {
  Object.keys(state).forEach(function(key) {
    const entity = state[key];

    const { position, velocity } = entity;
    if (!position || !velocity) {
      return;
    }

    position[0] += velocity[0] * time;
    position[1] += velocity[1] * time;
  });

  return state;
}

function visuals(state, { display }) {
  const vg = display.getContext('2d');
  vg.clearRect(0, 0, display.width, display.height);

  Object.keys(state).forEach(function(key) {
    const entity = state[key];

    const { position } = entity;
    if (!position) {
      return;
    }

    vg.fillRect(position[0], position[1], 10, 10);
  });

  return state;
}

