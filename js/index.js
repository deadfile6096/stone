document.getElementById("tg").addEventListener("click", function () {
  const url = "https://x.com/THEFIREANDSTONE"; // Обновленная ссылка на Twitter
  window.open(url, '_blank'); // Открываем в новой вкладке
});


document.addEventListener("DOMContentLoaded", function () {
  // Получаем элементы
  const soundIcon = document.getElementById("sound-icon");
  const audio = document.getElementById("audio");
  // Переменная для отслеживания, был ли звук намеренно выключен пользователем
  let soundMutedByUser = false;

  // Функция для воспроизведения звука
  function playAudio() {
    audio.play();
    soundIcon.querySelector("img").src = "images/voice.png"; // Исправлен путь к иконке
    soundMutedByUser = false;
  }

  // Воспроизведение музыки при клике на любом месте на странице
  document.addEventListener("click", function () {
    // Если музыка еще не начала играть И не была намеренно выключена пользователем, запускаем ее
    if (audio.paused && !soundMutedByUser) {
      playAudio();
    }
  });

  // При клике на иконку звука меняем состояние воспроизведения
  soundIcon.addEventListener("click", function (event) {
    event.stopPropagation(); // Останавливаем распространение клика на весь документ
    if (audio.paused) {
      playAudio(); // Воспроизводим звук
    } else {
      audio.pause(); // Ставим звук на паузу
      soundIcon.querySelector("img").src = "images/mute.png"; // Используем иконку mute.png при выключении звука
      soundMutedByUser = true; // Отмечаем, что звук был намеренно выключен пользователем
    }
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const citizensList = document.getElementById("citizens-list");
  let citizenIndex = 1; // Индекс для имени гражданина
  let citizenGenerationInterval = null; // Интервал для генерации граждан

  // Функция для генерации случайной карточки
  function generateCitizenCard() {
    // Проверяем, что вкладка Homo активна
    if (document.getElementById("citizens").style.display !== "block") {
      return; // Если вкладка не активна, не генерируем Homo
    }
    
    // Ограничиваем количество Homo до 8
    if (userCitizens.length >= 8) {
      return; // Не более 8 Homo в деревне
    }
    
    // Выбираем случайный тип Homo из нашего массива
    const randomTypeIndex = Math.floor(Math.random() * homoTypes.length);
    const homoType = homoTypes[randomTypeIndex];
    
    // Добавляем небольшую случайность к рангу
    const rankVariation = Math.floor(Math.random() * 3) - 1; // -1, 0 или 1
    const rank = Math.max(1, homoType.baseRank + rankVariation); // Минимальный ранг 1
    
    // Создаем нового Homo и добавляем его в список
    const newCitizen = {
      id: 1000 + citizenIndex,
      name: homoType.name,
      image: homoType.image,
      price: rank * 50, // Цена зависит от ранга
      description: homoType.description,
      rank: rank
    };
    
    // Добавляем в список граждан
    userCitizens.push(newCitizen);

    // Создание карточки
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("new-citizen"); // Добавляем класс для анимации

    card.innerHTML = `
      <div class="card-header">
        <img src="${newCitizen.image}" alt="${newCitizen.name}" class="card-image" style="max-width: 100%; max-height: 100px;"/>
        <h3>${newCitizen.name}</h3>
        <p>Rank: ${newCitizen.rank}</p>
      </div>
      <div class="card-info">
        <p>${newCitizen.description}</p>
        <button class="card-btn" data-id="${newCitizen.id}">View Details</button>
      </div>
    `;

    // Добавление карточки в начало списка
    citizensList.prepend(card);
    
    // Добавляем обработчик клика для просмотра деталей
    card.querySelector('.card-btn').addEventListener("click", () => openModal(newCitizen));

    // Удаляем класс анимации через 1 секунду
    setTimeout(() => {
      card.classList.remove("new-citizen");
    }, 1000);

    // Увеличиваем индекс для следующего гражданина
    citizenIndex++;
  }

  // Добавляем обработчики для переключения вкладок
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.addEventListener("click", () => {
      const tabId = item.getAttribute("data-tab");
      
      // Если перешли на вкладку Citizens, запускаем генерацию
      if (tabId === "citizens") {
        // Запускаем генерацию граждан каждые 15 секунд
        if (!citizenGenerationInterval) {
          // Сразу генерируем одного гражданина при переходе на вкладку
          setTimeout(generateCitizenCard, 1000);
          
          // Запускаем интервал
          citizenGenerationInterval = setInterval(generateCitizenCard, 15000);
        }
      } else {
        // Если ушли с вкладки Citizens, останавливаем генерацию
        if (citizenGenerationInterval) {
          clearInterval(citizenGenerationInterval);
          citizenGenerationInterval = null;
        }
      }
    });
  });
});

document.getElementById("create-btn").addEventListener("click", function () {
  // Получаем значения из формы
  const name = document.getElementById("name").value;
  const desc = document.getElementById("desc").value;
  const additional = document.getElementById("additional").value;
  const price = document.getElementById("asdadsdas").value;
  
  // Проверяем, что все поля заполнены
  if (name && desc && price) {
    // Создаем новый товар
    const newItem = {
      id: marketplaceItems.length + 1,
      name: name,
      description: desc,
      additionalInfo: additional,
      price: parseInt(price),
      image: "images/BIT.png",
      creator: "You"
    };
    
    // Добавляем товар на рынок
    marketplaceItems.push(newItem);
    
    // Обновляем отображение рынка
    updateMarketplace();
    
    // Очищаем форму
    document.getElementById("name").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("additional").value = "";
    document.getElementById("asdadsdas").value = "";
    
    // Показываем сообщение об успехе
    showSuccessMessage("Item created successfully!");
  } else {
    // Если не все поля заполнены, показываем сообщение об ошибке
    alert("Please fill in all required fields (Name, Description, Price)");
  }
});

// Функция для получения случайных навыков
function getRandomSkills() {
  const skills = ["Farming", "Mining", "Crafting", "Trading", "Building", "Fishing", "Hunting", "Cooking"];
  const numSkills = Math.floor(Math.random() * 3) + 1; // От 1 до 3 навыков
  const selectedSkills = [];
  
  for (let i = 0; i < numSkills; i++) {
    const randomSkill = skills[Math.floor(Math.random() * skills.length)];
    if (!selectedSkills.includes(randomSkill)) {
      selectedSkills.push(randomSkill);
    }
  }
  
  return selectedSkills.join(", ");
}

// Доступные изображения для аватаров
const images = [
  "images/avatars/lordHunter.png",
  "images/avatars/Dealer.png",
  "images/avatars/saber-toothed tiger.png",
  "images/avatars/saber-toothed tiger-baby.png",
  "images/avatars/Neanderthal.png",
  "images/avatars/Strong Neanderthal.png"
];

// Новые типы и описания Homo
const homoTypes = [
  {
    name: "LordHunter",
    description: "The great and strongest warrior of the first people",
    image: "images/avatars/lordHunter.png",
    baseRank: 8
  },
  {
    name: "Dealer",
    description: "The first person to come up with the idea of ​​selling stones and other junk",
    image: "images/avatars/Dealer.png",
    baseRank: 6
  },
  {
    name: "Saber-toothed tiger",
    description: "The oldest and one of the most ferocious animals",
    image: "images/avatars/saber-toothed tiger.png",
    baseRank: 9
  },
  {
    name: "Saber-toothed tiger-baby",
    description: "Baby of a strong animal, has agility and jumping ability",
    image: "images/avatars/saber-toothed tiger-baby.png",
    baseRank: 5
  },
  {
    name: "Neanderthal",
    description: "The first settler of the planet, has basic survival skills",
    image: "images/avatars/Neanderthal.png",
    baseRank: 4
  },
  {
    name: "Strong Neanderthal",
    description: "A more developed and advanced person",
    image: "images/avatars/Strong Neanderthal.png",
    baseRank: 7
  }
];

// Элементы
const connectButton = document.getElementById("connect-button");
const generateButton = document.getElementById("generate-button");
const addButton = document.getElementById("add-button");
const avatarUpload = document.getElementById("avatar-upload");
const profileStatus = document.getElementById("profile-status");
const connectSound = document.getElementById("connect-sound");
const avatarDiv = document.querySelector(".avatar");
let currentImage = null;

// Массив для пользовательских изображений
let userImages = [];

// Массив английских имен для граждан
const englishNames = [
  "James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles",
  "Christopher", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua",
  "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen",
  "Nancy", "Lisa", "Margaret", "Betty", "Sandra", "Ashley", "Dorothy", "Kimberly", "Emily", "Donna"
];

// Переменная для блокировки генерации
let isAvatarGenerated = false;

// Подключение: проигрывание звука
// Элемент аудио

// Делегирование событий для всех кнопок
document.addEventListener("click", (event) => {
  // Проверяем, является ли цель клика кнопкой
  if (event.target.tagName === "BUTTON") {
    // Создаем новый объект Audio при каждом клике
    const audio = new Audio("media/misc.wav"); // Исправлен путь к звуковому файлу
    audio.play().catch((error) => {
      console.error("Ошибка воспроизведения звука:", error);
    });
  }
});

// Генерация случайного изображения из папки avatars
let citizenCounter = 1; // Счетчик для имени гражданина

generateButton.addEventListener("click", () => {
  // Разрешаем повторную генерацию - убираем ограничение
  // if (isAvatarGenerated) {
  //   return; // Запрещаем повторную генерацию
  // }

  // Выбираем случайный тип Homo из нашего массива
  const randomTypeIndex = Math.floor(Math.random() * homoTypes.length);
  const homoType = homoTypes[randomTypeIndex];
  
  // Добавляем небольшую случайность к рангу
  const rankVariation = Math.floor(Math.random() * 3) - 1; // -1, 0 или 1
  const rank = Math.max(1, homoType.baseRank + rankVariation); // Минимальный ранг 1

  // Отображаем изображение в div.avatar
  avatarDiv.innerHTML = `<img src="${homoType.image}" alt="${homoType.name}" style="max-width: 100%; max-height: 150px;">`;
  currentImage = homoType.image;

  // Создаем нового Homo и добавляем его в список
  const newHomo = {
    id: citizenCounter,
    name: homoType.name,
    image: homoType.image,
    description: homoType.description,
    rank: rank,
    price: rank * 50 // Цена зависит от ранга
  };

  // Увеличиваем счетчик
  citizenCounter++;

  // Добавляем Homo в список
  userCitizens.push(newHomo);

  // Обновляем список Homo
  updateCitizenList();

  // Помечаем, что аватар сгенерирован (оставляем для совместимости)
  isAvatarGenerated = true;
});

// Обработчик кнопки Add для добавления пользовательских изображений
addButton.addEventListener("click", () => {
  // Открываем диалог выбора файла
  avatarUpload.click();
});

// Обработчик загрузки файла
avatarUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    // Создаем URL для загруженного файла
    const imageUrl = URL.createObjectURL(file);
    
    // Добавляем в массив пользовательских изображений
    userImages.push(imageUrl);
    
    // Добавляем в общий массив изображений
    images.push(imageUrl);
    
    // Отображаем загруженное изображение
    currentImage = imageUrl;
    avatarDiv.innerHTML = `<img src="${imageUrl}" alt="Avatar" style="max-width: 100%; max-height: 150px;">`;    
    
    // Показываем уведомление об успешной загрузке
    alert("Изображение успешно добавлено!");
  }
});

let balance = 0;
let selectedItemId = null;
let selectedItemName = null;
let selectedItemPrice = 0;

// User citizens and marketplace items
let userCitizens = [];
let marketplaceItems = [
  {
    id: 1,
    name: "Axe",
    description: "This tool can be used to obtain wood and defend yourself",
    price: 300,
    image: "images/items/axe.png",
  },
  {
    id: 2,
    name: "Spear",
    description: "Excellent weapon for hunting large cattle",
    price: 250,
    image: "images/items/spear.png",
  },
  {
    id: 3,
    name: "Log",
    description: "Resource for building and lighting a fire",
    price: 100,
    image: "images/items/log.png",
  },
  {
    id: 4,
    name: "Tamed-wolf",
    description: "Man's first friend and protector",
    price: 500,
    image: "images/items/tamed-wolf.png",
  },
  {
    id: 5,
    name: "Torch",
    description: "A great opportunity to light up the night!",
    price: 150,
    image: "images/items/torch.png",
  },
  {
    id: 6,
    name: "Wife",
    description: "Helps in the cave, can cook, can give birth",
    price: 800,
    image: "images/items/wife.png",
  },
];

// Update balance display
const balanceDisplay = document.getElementById("balance");

// Switching tabs
document.querySelectorAll(".menu-item").forEach((item) => {
  item.addEventListener("click", () => {
    const tabId = item.getAttribute("data-tab");
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.style.display = tab.id === tabId ? "block" : "none";
    });
  });
});

// Modal handling for item details
const marketplace = document.getElementById("marketplace");
const citizensList = document.getElementById("citizens-list");

// Для открытия модального окна с деталями товара
marketplace.addEventListener("click", (e) => {
  if (e.target.classList.contains("card-btn")) {
    selectedItemId = e.target.getAttribute("data-id");
    selectedItemName = e.target.getAttribute("data-name");
    selectedItemPrice = parseInt(e.target.getAttribute("data-price"));

    const selectedItem = marketplaceItems.find(
      (item) => item.id == selectedItemId
    );

    // Обновляем информацию в модальном окне
    // Заголовок
    document.getElementById("modal-text").textContent = `Details for ${selectedItemName}`;
    
    // Описание
    const modalDesc = document.getElementById("modal-description");
    modalDesc.textContent = selectedItem.description;
    modalDesc.style.color = "#000000";
    modalDesc.style.textShadow = "none";
    modalDesc.style.fontWeight = "bold";
    
    // Цена
    const modalPrice = document.getElementById("modal-price");
    modalPrice.textContent = `Price: $CAVE ${selectedItem.price}`;
    modalPrice.style.color = "#000000";
    modalPrice.style.textShadow = "none";
    
    // Изображение
    document.getElementById("modal-image").src = selectedItem.image || 'images/BIT.png';
    
    // Кнопки
    document.getElementById("buy-btn").style.display = "inline-block";
    document.getElementById("sell-btn").style.display = "none"; // Скрыть кнопку продажи

    // Показываем модальное окно
    document.getElementById("modal").style.display = "flex";
  }
});

// Для закрытия модального окна
document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none"; // Скрываем модальное окно
});

// Buying item from Marketplace
document.getElementById("buy-btn").addEventListener("click", () => {
  if (balance >= selectedItemPrice) {
    balance -= selectedItemPrice;
    balanceDisplay.textContent = balance;

    // Add item to citizens after purchase
    const purchasedItem = marketplaceItems.find(
      (item) => item.id == selectedItemId
    );
    userCitizens.push(purchasedItem);

    // Remove purchased item from marketplace
    marketplaceItems = marketplaceItems.filter(
      (item) => item.id !== selectedItemId
    );

    updateCitizenList();
    updateMarketplace();
    showSuccessMessage(`You bought ${selectedItemName}`);
    document.getElementById("modal").style.display = "none";
  } else {
    showSuccessMessage("Not enough balance!");
  }
});

// Function to update the citizens list
function updateCitizenList() {
  const citizensList = document.getElementById("citizens-list");
  citizensList.innerHTML = ""; // Очистить текущий список

  userCitizens.forEach((citizen) => {
    const card = document.createElement("div");
    card.classList.add("card");

    // Используем ранг из объекта citizen, если он есть, иначе вычисляем из цены
    const rank = citizen.rank || Math.floor((citizen.price || 0) / 50);

    card.innerHTML = `
      <div class="card-header">
        <img src="${citizen.image}" alt="${citizen.name}" class="card-image"/>
        <h3>${citizen.name}</h3>
        <p>Rank: ${rank}</p>
      </div>
      <div class="card-info">
        <p>${citizen.description || 'A homo of CaveCash'}</p>
        <button class="card-btn" data-id="${citizen.id}">View Details</button>
      </div>
    `;

    // Добавляем обработчик клика для просмотра деталей
    card.querySelector('.card-btn').addEventListener("click", () => openModal(citizen));

    // Добавление карточки в список
    citizensList.appendChild(card);
  });
}

// Function to open modal with homo details
function openModal(citizen) {
  // Устанавливаем selectedItemId для корректной работы кнопки Sell
  selectedItemId = citizen.id;
  selectedItemName = citizen.name;
  selectedItemPrice = citizen.price || 0;
  
  // Используем ранг из объекта citizen, если он есть, иначе вычисляем из цены
  const rank = citizen.rank || Math.floor((citizen.price || 0) / 50);
  
  // Устанавливаем заголовок модального окна
  document.getElementById("modal-text").textContent = `Details for ${citizen.name}`;
  
  // Устанавливаем описание
  document.getElementById("modal-description").textContent =
    citizen.description || 'A homo of CaveCash';
  
  // Устанавливаем цену и ранг
  document.getElementById("modal-price").textContent = `Price: $CAVE ${citizen.price || 0} | Rank: ${rank}`;
  
  // Устанавливаем изображение
  document.getElementById("modal-image").src = citizen.image || 'images/BIT.png';
  
  // Скрываем кнопку Buy и показываем кнопку Sell для Homo
  document.getElementById("buy-btn").style.display = "none"; // Hide buy button for homo
  document.getElementById("sell-btn").style.display = "inline-block"; // Show sell button for homo

  // Показываем модальное окно
  document.getElementById("modal").style.display = "flex"; // Remove display: none
}

// Обработчики для закрытия модального окна
document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none"; // Скрываем модальное окно
});

document.getElementById("modal-close").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none"; // Скрываем модальное окно при клике на крестик
});

// Function to update marketplace cards after item buy or sell
function updateMarketplace() {
  const marketplaceContainer = document.getElementById("marketplace-container");
  marketplaceContainer.innerHTML = ""; // Очистить текущий список

  marketplaceItems.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card-header">
        <img src="${item.image}" alt="${item.name}" class="card-image"/>
        <h3>${item.name}</h3>
        <p>Price: $CAVE ${item.price}</p>
      </div>
      <div class="card-info">
        <p>${item.description}</p>
        <button class="card-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">View Details</button>
      </div>
    `;

    marketplaceContainer.appendChild(card);
  });
}

// Display a success message
function showSuccessMessage(message) {
  document.getElementById("success-message").textContent = message;
  document.getElementById("success-modal").style.display = "flex";

  // Автоматически скрыть сообщение через 3 секунды
  setTimeout(() => {
    document.getElementById("success-modal").style.display = "none";
  }, 3000);
}

// Обработчики для закрытия модального окна успеха
document.getElementById("close-success-modal").addEventListener("click", () => {
  document.getElementById("success-modal").style.display = "none";
});

document.getElementById("close-success-btn").addEventListener("click", () => {
  document.getElementById("success-modal").style.display = "none";
});

// Добавляем обработчик для кнопки продажи
document.getElementById("sell-btn").addEventListener("click", () => {
  // Находим гражданина по ID
  const citizenIndex = userCitizens.findIndex(citizen => citizen.id == selectedItemId);
  
  if (citizenIndex !== -1) {
    // Получаем гражданина
    const citizen = userCitizens[citizenIndex];
    
    // Добавляем стоимость к балансу
    balance += citizen.price || 0;
    balanceDisplay.textContent = balance;
    
    // Удаляем гражданина из списка
    userCitizens.splice(citizenIndex, 1);
    
    // Обновляем список граждан
    updateCitizenList();
    
    // Показываем сообщение об успехе
    showSuccessMessage(`You sold ${citizen.name} for $CAVE ${citizen.price || 0}`);    
    document.getElementById("modal").style.display = "none";
  }
});

// Добавляем обработчик для кнопки Connect
document.getElementById("connect-button").addEventListener("click", () => {
  // Имитируем подключение кошелька
  connectSound.play();
  
  // Обновляем статус профиля
  document.getElementById("profile-status").innerHTML = 
    'you homo: <span style="color: green">revived</span>';
  
  // Добавляем начальный баланс
  balance = 1000;
  balanceDisplay.textContent = balance;
  
  // Показываем сообщение об успехе
  showSuccessMessage("Homo revived successfully! You received 1000 $CAVE");
});

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  updateMarketplace();
  updateCitizenList();
});
