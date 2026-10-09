// ===== 1. Máscaras de CPF, telefone e CEP =====
function mascaraCpf(valor) {
  valor = valor.replace(/\D/g, "").slice(0, 11);
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return valor;
}

function mascaraTelefone(valor) {
  valor = valor.replace(/\D/g, "").slice(0, 11);
  valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
  valor = valor.replace(/(\d{4,5})(\d{4})$/, "$1-$2");
  return valor;
}

function mascaraCep(valor) {
  valor = valor.replace(/\D/g, "").slice(0, 8);
  valor = valor.replace(/^(\d{5})(\d)/, "$1-$2");
  return valor;
}

var mascaras = {
  cpf: mascaraCpf,
  telefone: mascaraTelefone,
  cep: mascaraCep
};

// Aplica a máscara em todo campo que tem o atributo data-mascara
var camposComMascara = document.querySelectorAll("[data-mascara]");
camposComMascara.forEach(function (campo) {
  campo.addEventListener("input", function () {
    var tipo = campo.getAttribute("data-mascara");
    campo.value = mascaras[tipo](campo.value);
  });
});

// A data de nascimento não pode ser no futuro
var campoNascimento = document.getElementById("nascimento");
if (campoNascimento) {
  campoNascimento.max = new Date().toISOString().slice(0, 10);
}

// ===== 2. Novos membros (salvos no navegador com localStorage) =====
function lerMembros() {
  try {
    return JSON.parse(localStorage.getItem("membros")) || [];
  } catch (erro) {
    return [];
  }
}

// Na página de cadastro: guarda só o NOME e vai para a lista
var formulario = document.getElementById("formulario");
if (formulario) {
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    var nome = document.getElementById("nome").value.trim();
    var membros = lerMembros();
    membros.push(nome);
    try {
      localStorage.setItem("membros", JSON.stringify(membros));
    } catch (erro) {
      // se o navegador bloquear o armazenamento, a página continua funcionando
    }
    window.location.href = "membros.html";
  });
}

// Na página de membros: mostra os nomes (os mais novos primeiro)
var listaMembros = document.getElementById("lista-membros");
if (listaMembros) {
  var exemplos = ["Ana Beatriz Souza", "Carlos Eduardo Lima", "Juliana Ferreira", "Rafael Tavares", "Mariana Costa", "Pedro Henrique Alves"];
  var todos = lerMembros().reverse().concat(exemplos);
  todos.forEach(function (nome) {
    var item = document.createElement("li");
    item.textContent = nome; // textContent evita injeção de HTML
    listaMembros.appendChild(item);
  });
}

// ===== 3. Escolha do valor da doação =====
var botoesValor = document.querySelectorAll(".valor");
var textoDoacao = document.getElementById("texto-doacao");
botoesValor.forEach(function (botao) {
  botao.addEventListener("click", function () {
    botoesValor.forEach(function (outro) {
      outro.setAttribute("aria-pressed", "false");
    });
    botao.setAttribute("aria-pressed", "true");
    var valor = botao.getAttribute("data-valor");
    var impacto = botao.querySelector("span").textContent;
    textoDoacao.textContent = "Obrigado! Com R$ " + valor + " você " + impacto + ". Faça o Pix para a chave abaixo.";
  });
});

// ===== 4. Botão que copia a chave Pix =====
var botaoCopiar = document.getElementById("copiar");
if (botaoCopiar) {
  botaoCopiar.addEventListener("click", function () {
    var aviso = document.getElementById("aviso");
    var chave = document.getElementById("pix").textContent;
    navigator.clipboard.writeText(chave).then(
      function () {
        aviso.textContent = "Chave copiada!";
      },
      function () {
        aviso.textContent = "Não foi possível copiar. Copie a chave manualmente.";
      }
    );
  });
}

