let globalMessages = [];
let nome;

connect();

function request(type, route, data) {
  return type(route, data);
}

function connect() {
  nome = prompt("Qual seu nome?");
  //const nome = 'João';
  console.log(nome);

  const res = request(
    axios.post,
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    { name: nome }
  );
  res
    .then(() => {
      console.log(res);

      getMessages();

      setInterval(() => {
        getMessages();
      }, 3000);

      keepConnection(nome);

      setInterval(() => {
        keepConnection(nome);
      }, 5000);
    })
    .catch((err) => {
      if (err.response.status === 400) {
        alert("Já existe um usuário com esse nome");
        connect();
      } else console.log(err);
    });
}

function getMessages() {
  const res = request(
    axios.get,
    "https://mock-api.driven.com.br/api/v6/uol/messages"
  );
  res
    .then((value) => {
      if (globalMessages.length == 0) {
        globalMessages = value.data;
        renderMessages();
      } else {
        const lastMsg = globalMessages[globalMessages.length - 1];
        let index = -1;
        for (let ii = value.data.length; ii > 0; ii--) {
          if (JSON.stringify(lastMsg) == JSON.stringify(value.data[ii])) {
            if (index != -1) {
              break;
            } else if (ii == value.data.length) {
              break;
            }
            break;
          } else {
            console.log(ii);
            index = ii;
          }
        }
        if (index != -1) {
          console.log(index);
          for (let ii = index; ii < value.data.length; ii++) {
            globalMessages.push(value.data[ii]);
            addMessage(value.data[ii]);
          }
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function addMessage(messageObj) {
  if (
    globalMessages[ii].type === "private_message" &&
    globalMessages[ii].to !== nome
  )
    return;

  let message;
  switch (messageObj.type) {
    case "status":
      {
        message = `
    <div class="time">${messageObj.time}</div>
    <div class="from">${messageObj.from}</div>
    <div class="text">${messageObj.text}</div>`;
      }

      break;
    case "message":
      {
        message = `
    <div class="time">${messageObj.time}</div>
    <div class="from">${messageObj.from}</div>
    <div class="type">para</div>
    <div class="to">${messageObj.to}:</div>
    <div class="text">${messageObj.text}</div>`;
      }

      break;

    case "private_message":
      {
        message = `
    <div class="time">${messageObj.time}</div>
    <div class="from">${messageObj.from}</div>
    <div class="type">reservadamente para</div>
    <div class="to">${messageObj.to}:</div>
    <div class="text">${messageObj.text}</div>`;
      }
      break;

    default:
      break;
  }
  const messagesElement = document.querySelector(".messages");
  const messageType = {
    status: "io-room",
    message: "message",
    privateMessage: "reserved",
  };
  const messageElement = document.createElement("div");
  messageElement.classList.add(messageType[messageObj.type]);
  messageElement.innerHTML = message;
  messagesElement.appendChild(messageElement);

  window.scrollTo(0, document.body.scrollHeight);
}

function renderMessages() {
  for (let ii = 0; ii < globalMessages.length; ii++) {
    if (
      globalMessages[ii].type === "private_message" &&
      globalMessages[ii].to !== nome
    )
      break;

    let message;
    switch (globalMessages[ii].type) {
      case "status":
        {
          message = `
      <div class="time">${globalMessages[ii].time}</div>
      <div class="from">${globalMessages[ii].from}</div>
      <div class="text">${globalMessages[ii].text}</div>`;
        }

        break;
      case "message":
        {
          message = `
      <div class="time">${globalMessages[ii].time}</div>
      <div class="from">${globalMessages[ii].from}</div>
      <div class="type">para</div>
      <div class="to">${globalMessages[ii].to}:</div>
      <div class="text">${globalMessages[ii].text}</div>`;
        }

        break;

      case "private_message":
        {
          message = `
      <div class="time">${globalMessages[ii].time}</div>
      <div class="from">${globalMessages[ii].from}</div>
      <div class="type">reservadamente para</div>
      <div class="to">${globalMessages[ii].to}:</div>
      <div class="text">${globalMessages[ii].text}</div>`;
        }
        break;

      default:
        break;
    }
    const messagesElement = document.querySelector(".messages");
    const messageType = {
      status: "io-room",
      message: "message",
      private_message: "reserved",
    };
    const messageElement = document.createElement("div");
    messageElement.classList.add(messageType[globalMessages[ii].type]);
    messageElement.innerHTML = message;
    messagesElement.appendChild(messageElement);
  }

  window.scrollTo(0, document.body.scrollHeight);
}

function keepConnection(nome) {
  const res = request(
    axios.post,
    "https://mock-api.driven.com.br/api/v6/uol/status",
    { name: nome }
  );
  res
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
}

function quemtanasala(nome) {}
