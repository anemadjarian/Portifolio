document.addEventListener("DOMContentLoaded", () => {
  // 1. Configuração da Animação do Canvas (Sparkles Interativos)
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const colors = [
    "#ffadad", "#ffd6a5", "#fdffb6", 
    "#caffbf", "#9bf6ff", "#a0c4ff", 
    "#bdb2ff", "#ffc6ff"
  ];

  // Posição do Mouse
  const mouse = {
    x: null,
    y: null,
    radius: 120 // Raio de influência do mouse
  };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Gera 2 sparkles bônus na posição do mouse ao mover
    for (let i = 0; i < 2; i++) {
      if (sparkles.length < 150) {
        const extraSparkle = new Sparkle();
        extraSparkle.x = mouse.x + (Math.random() - 0.5) * 20;
        extraSparkle.y = mouse.y + (Math.random() - 0.5) * 20;
        extraSparkle.isMouseTrail = true;
        sparkles.push(extraSparkle);
      }
    }
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Sparkle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.baseX = this.x;
      this.baseY = this.y;
      this.size = Math.random() * 3 + 1;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random();
      this.speed = Math.random() * 0.02 + 0.005;
      this.dir = Math.random() > 0.5 ? 1 : -1;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = -(Math.random() * 0.3 + 0.1);
      this.isMouseTrail = false;
    }

    update() {
      // Brilho pulsante
      this.alpha += this.speed * this.dir;
      if (this.alpha >= 1) {
        this.alpha = 1;
        this.dir = -1;
      } else if (this.alpha <= 0) {
        if (this.isMouseTrail) {
          // Remove partículas temporárias geradas pelo mouse
          const index = sparkles.indexOf(this);
          if (index > -1) sparkles.splice(index, 1);
          return;
        }
        this.reset();
      }

      // Movimento contínuo de subida
      this.x += this.vx;
      this.y += this.vy;

      // Interatividade com o Mouse (Repulsão Física)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);

          // Empurra a partícula levemente para longe do mouse
          this.x -= Math.cos(angle) * force * 5;
          this.y -= Math.sin(angle) * force * 5;
        }
      }

      // Reposição nas bordas da tela
      if (this.y < 0) this.y = height;
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      
      // Desenha o brilho em formato de estrela/cruz suave quando próximo do mouse
      if (this.size > 2.5) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Efeito de brilho em cruz nas partículas maiores
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(this.x - this.size * 2, this.y);
        ctx.lineTo(this.x + this.size * 2, this.y);
        ctx.moveTo(this.x, this.y - this.size * 2);
        ctx.lineTo(this.x, this.y + this.size * 2);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Cria a quantidade base de sparkles
  const sparkles = Array.from({ length: 85 }, () => new Sparkle());

  function animate() {
    ctx.clearRect(0, 0, width, height);
    sparkles.forEach((s) => {
      s.update();
      s.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();

  // 2. Filtro de Projetos
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.style.display = "block";
          setTimeout(() => (card.style.opacity = "1"), 50);
        } else {
          card.style.opacity = "0";
          setTimeout(() => (card.style.display = "none"), 300);
        }
      });
    });
  });

  // 3. Simulação do Formulário de Contato
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    formStatus.textContent = "Enviando mensagem...";
    
    setTimeout(() => {
      formStatus.textContent = "Mensagem enviada com sucesso! Em breve entrarei em contato.";
      contactForm.reset();
    }, 1200);
  });
});

// Lógica do Chatbot de IA
const aiToggle = document.getElementById("ai-chat-toggle");
const aiBox = document.getElementById("ai-chat-box");
const aiClose = document.getElementById("ai-chat-close");
const aiInput = document.getElementById("ai-input");
const aiSend = document.getElementById("ai-send-btn");
const aiMessages = document.getElementById("ai-messages");

aiToggle.addEventListener("click", () => aiBox.classList.toggle("hidden"));
aiClose.addEventListener("click", () => aiBox.classList.add("hidden"));

function appendMessage(text, isUser) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${isUser ? "user-msg" : "ai-msg"}`;
  msgDiv.textContent = text;
  aiMessages.appendChild(msgDiv);
  aiMessages.scrollTop = aiMessages.scrollHeight;
}

async function handleAISend() {
  const query = aiInput.value.trim();
  if (!query) return;

  appendMessage(query, true);
  aiInput.value = "";

  // Mensagem de carregamento
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "message ai-msg";
  loadingDiv.textContent = "A pensar...";
  aiMessages.appendChild(loadingDiv);

  // Substitua 'SUA_CHAVE_API_AQUI' pela sua API Key do Google AI Studio
  const API_KEY = "SUA_CHAVE_API_AQUI"; 
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  // Contexto sobre si para instruir a IA
  const promptContexto = `
    És o assistente virtual do portfólio da Ane. 
    Responde de forma amigável, sucinta e profissional em português.
    Informações sobre a Ane:
    - Curso: Ciência da Computação.
    - Habilidades: Java, C, Lógica de Programação, Estruturas de Dados, Vendas Técnicas, Liderança e Oratória.
    - Projetos: Visualizer (Aplicação Web CRUD), Gerenciamento de Cursos (AEDs III), Repositórios de Estudos (AEDs I e II).
    - Pergunta do visitante: "${query}"
  `;
 
    loadingDiv.remove();
    appendMessage("Erro ao ligar ao serviço de IA.", false);
}


aiSend.addEventListener("click", handleAISend);
aiInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleAISend();
});