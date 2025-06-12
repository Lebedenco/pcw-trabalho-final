const placeholderCourses = [
  {
    id: 0,
    name: "Desenvolvimento Front-End",
    teacher: "João Silva",
    description:
      "Aprenda do zero e com projetos reais a desenvolver páginas web " +
      "utilizando HTML, CSS e frameworks JavaScript!",
    price: 49.99,
    category: "Tecnologia",
    quantity: 50,
    image: "frontend.jpg",
  },
  {
    id: 1,
    name: "Desenvolvimento Back-End",
    teacher: "José Santos",
    description:
      "Aprenda do zero e com projetos reais a desenvolver suas " +
      "próprias APIs, administrar bancos de dados e a gerenciar seu " +
      "servidor!",
    price: 49.99,
    quantity: 100,
    category: "Tecnologia",
    image: "backend.jpg",
  },
  {
    id: 2,
    name: "Rust Completo",
    teacher: "Rust School",
    description: "Domine a linguagem de programação Rust!",
    price: 35.99,
    category: "Tecnologia",
    quantity: 200,
    image: "rust.png",
  },
  {
    id: 3,
    name: "Inglês para Desenvolvedores",
    teacher: "Michael Smith",
    description: "Curso para desenvolvedores que buscam a fluência no idioma!",
    price: 29.99,
    category: "Idiomas",
    quantity: -1,
    image: "ingles.png",
  },
];

/* ------- */
/* Classes */
/* ------- */

class Course {
  /** @readonly @type {string} Identificador do curso. */
  id;

  /** @type {string} Nome do curso. */
  name;

  /** @type {string} Nome do professor. */
  teacher;

  /** @type {string} Descrição do curso. */
  description;

  /** @type {number} Valor. */
  price;

  /** @type {string} Categoria. */
  category;

  /** @type {number} Quantidade de vagas. */
  quantity;

  /** @type {string} Imagem do curso (nome do arquivo). */
  image;

  /**
   * @param {string} id Identificador do curso.
   * @param {string} name Nome do curso.
   * @param {string} teacher Nome do professor.
   * @param {string} description Descrição do curso.
   * @param {number} price Valor.
   * @param {string} category Categoria.
   * @param {number} quantity Quantidade de vagas.
   * @param {string} image Imagem do curso (nome do arquivo).
   *
   * @returns {Course} Novo curso.
   */
  constructor(
    id,
    name,
    teacher,
    description,
    price,
    category,
    quantity,
    image,
  ) {
    this.id = id;
    this.name = name;
    this.teacher = teacher;
    this.description = description;
    this.price = price;
    this.category = category;
    this.quantity = quantity;
    this.image = image;
  }
}

class State {
  /** @type {Array<Course> | null} Estado dos cursos cadastrados. */
  courseState;

  /**
   * @type {HTMLElement | null} Elemento HTML que corresponde à lista de cursos
   * cadastrados.
   */
  coursesList;

  /** @type {HTMLElement | null} Elemento HTML que corresponde à tag `main`. */
  main;

  /** @type {Course | null} Curso selecionado. */
  selectedCourse;

  /** Inicia o estado vazio.
   * @returns {State} Estado vazio.
   */
  constructor() {
    this.courseState = null;
    this.coursesList = null;
    this.main = null;
    this.selectedCourse = null;
  }

  /**
   * Carrega a lista de cursos.
   *
   * [TESTE] Se não existir, carrega a lista com cursos padrão.
   */
  loadCoursesList = () => {
    const courseStateAsJSON = localStorage.getItem("@pcw-cursos:cursos-1.0.0");

    this.courseState = courseStateAsJSON
      ? JSON.parse(courseStateAsJSON)
      : placeholderCourses;
  };

  /** Inicia o estado global.
   * @returns {State} Estado global.
   */
  init = () => {
    this.loadCoursesList();

    this.coursesList = document.getElementById("coursesList");
    this.main = document.getElementsByTagName("main")[0];

    this.selectedCourse = new Course(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    );

    return this;
  };

  /** Apaga os filhos do elemento HTML.
   * @param {HTMLElement} element Elemento HTML.
   */
  deleteChildren = (element) => {
    let child = element.lastElementChild;

    while (child) {
      element.removeChild(child);

      child = element.lastElementChild;
    }
  };

  /** Salva o estado no `localStorage`. */
  saveState = () => {
    localStorage.setItem(
      "@pcw-cursos:cursos-1.0.0",
      JSON.stringify(this.courseState),
    );

    this.loadCourses();
  };

  /** Filtra os cursos de acordo com a categoria selecionada.
   * @param {string} category Categoria do curso.
   */
  filterCourses = (category) => {
    this.courseState = this.courseState.filter(
      (course) => course.category === category,
    );

    this.loadCourses();
  };

  /** Carrega a lista de cursos cadastrados.
   * - Limpa a lista.
   * - Cria os elementos e os insere.
   * - Se o estado estiver vazio, é inserido uma mensagem que informa isto.
   */
  loadCourses = () => {
    // Deletar os filhos da lista de cursos (limpar)
    this.deleteChildren(this.coursesList);

    // Percorrer estado e inserir na página
    // Exibir mensagem se estiver vazio
    if (this.courseState.length > 0) {
      this.courseState.forEach((course) => {
        const card = document.createElement("div");

        card.classList.add("courseContainer", "card");
        card.innerHTML = `<span
  class="courseCategory"
  onclick="handleFilterCourses('${course.category}')"
>
  ${course.category}
</span>
<div class="course" data-id="${course.id}">
  <img
    class="courseItem courseImg"
    src="../../../images/${course.image}"
    alt="${course.name}"
  />
  <span class="courseItem courseName">${course.name}</span>
  <span class="courseItem courseTeacher">por ${course.teacher}</span>
  <span class="courseItem courseDescription">${course.description}</span>
  
  <button
    class="courseDetailsButton"
    onclick="handleShowCourseDetails(this)"
  >
    + Detalhes
  </button>
</div>`;

        this.coursesList.appendChild(card);
      });
    } else {
      this.coursesList.appendChild(document.createElement("span")).innerHTML =
        "Não há cursos cadastrados.";
    }
  };

  /** Exibe a lista de cursos.
   * - Deleta os filhos do conteúdo principal (`main`).
   * - Adiciona lista de cursos e os carrega.
   */
  showCoursesListPage = () => {
    // Apagar conteúdo da página
    // Resetar lista de cursos (para caso tenha filtrado anteriormente)
    // Adicionar cursos e carregar página.

    this.deleteChildren(this.main);
    this.loadCoursesList();

    this.main.appendChild(this.coursesList);

    this.loadCourses();
  };

  /** Exibe detalhes do curso selecionado.
   * - Deleta os filhos do conteúdo principal (`main`).
   * - Adiciona detalhes do curso à pagina.
   * @param {string} courseId ID do curso.
   */
  showCourseDetails = (courseId) => {
    this.deleteChildren(this.main);

    const course = this.courseState.find((c) => c.id == courseId);
    const courseDiv = document.createElement("div");

    courseDiv.classList.add("card", "courseCard");
    courseDiv.innerHTML = `<h1>${course.name}</h1>
<h3>por ${course.teacher}</h3>
<img src="../../../images/${course.image}"/>
<span>${course.description}</span>
<div class="buyCourse">
  <div>
    <strong>Por apenas: R$${course.price.toString().replace(".", ",")}</strong>
  </div>
  <div>
    <button>Comprar</button>
    <span>
      Vagas disponíveis: ${course.quantity > 0 ? course.quantity : "Ilimitado!"}
    </span>
  </div>
</div>
    `;

    this.main.appendChild(courseDiv);
  };

  /** Exibe cadastro de curso.
   * - Deleta os filhos do conteúdo principal (`main`).
   * - Adiciona formulário à página.
   */
  showAddCoursePage = () => {
    this.deleteChildren(this.main);

    let content = `<form id="addCourseForm" action="" class="card">
  <div class="addCourseFormField">
    <div>
      <label
        class="addCourseFormLabel"
        for="courseNameInput"
      >
        Nome do Curso:
      </label>
        <input
          class="addCourseFormInput"
          type="text"
          name="courseNameInput"
          id="courseNameInput"
          placeholder="Java Completo"
        />
    </div>
    <div>
      <label class="addCourseFormLabel" for="courseTeacherInput">
        Professor:
      </label>
      <input
        class="addCourseFormInput"
        type="text"
        name="courseTeacherInput"
        id="courseTeacherInput"
        placeholder="Prof. Java"
      />
    </div>
  </div>

  <label class="addCourseFormLabel" for="courseDescriptionTextArea">
    Descrição:
  </label>
  <textarea
    class="addCourseFormTextArea"
    name="courseDescriptionTextArea"
    id="courseDescriptionTextArea"
    placeholder="Domine a linguagem de programação Java!"
  ></textarea>

  <div class="addCourseFormField">
    <div>
      <label class="addCourseFormLabel" for="coursePriceInput">Preço:</label>
      <input
        class="addCourseFormInput"
        type="number"
        name="coursePriceInput"
        id="coursePriceInput"
        placeholder="R$ 49,99"
      />
    </div>
    
    <div>
      <label class="addCourseFormLabel" for="courseQuantityInput">
        Quantidade de vagas:
      </label>
      <input
        class="addCourseFormInput"
        type="number"
        name="courseQuantityInput"
        id="courseQuantityInput"
        placeholder="100"
      />
    </div>
  </div>

  <label class="addCourseFormLabel" for="courseCategory">Categoria:</label>
  <select name="courseCategory" id="courseCategory" class="addCourseFormSelect">
    <option value="0" selected disabled>Selecione a categoria</option>
    <option value="1">Tecnologia</option>
    <option value="2">Design</option>
    <option value="3">Idiomas</option>
    <option value="4">Música</option>
    <option value="5">Outros</option>
  </select>

  <label class="addCourseFormLabel" for="courseImage">Imagem:</label>
  
  <div class="card" onclick="handleSelectCourseImage(event)">
    <img src="../../../images/frontend.jpg"/>
    <img src="../../../images/backend.jpg"/>
    <img src="../../../images/c.png"/>
    <img src="../../../images/rust.png"/>
    <img src="../../../images/java.webp"/>
    <img src="../../../images/react.png"/>
    <img src="../../../images/reactnative.png"/>
    <img src="../../../images/ingles.png"/>
  </div>

  <button
    class="addCourseFormButton"
    type="submit"
    onclick="handleAddCourse(event)"
  >
    Adicionar
  </button>
  
  <div id="error" style="text-align: center; color: var(--warn);"></div>
</form>`;

    this.main.innerHTML = content;
  };
}

let state = new State();

/* ------- */
/* Funções */
/* ------- */

// --- Todas as Páginas ---

/** Executada quando o usuário clica no logo do site.
 * - Chama a função do estado que exibe a lista de cursos.
 */
const handleShowCoursesListPage = () => {
  state.showCoursesListPage();
};

/** Executada quando o usuário clica na opção "Adicionar Curso" da barra de
 * navegação.
 * - Chama a função do estado que exibe o cadastro de cursos.
 */
const handleShowAddCoursePage = () => {
  state.showAddCoursePage();
};

// --- Página: Lista de Cursos ---

/** Executada quando o usuário clica em uma categoria na lista de cursos.
 * @param {string} category Categoria do curso.
 */
const handleFilterCourses = (category) => {
  state.filterCourses(category);
};

/** Executada quando o usuário clica no botão "+ Detalhes" de um curso.
 * - Chama a função do estado que exibe os detalhes do curso.
 * @param {HTMLElement} course Elemento HTML que corresponde ao curso selecionado.
 */
const handleShowCourseDetails = (course) => {
  const courseId = course.parentNode.getAttribute("data-id");

  state.showCourseDetails(courseId);
};

// --- Página: Cadastro de Cursos ---

/** Valida as informações inseridas no formulário de cadastro de curso.
 * @param {Course} course Curso a ser validado.
 * @returns {string | null} `null` se tudo OK, ou uma mensagem se algo estiver incorreto.
 */
const checkForm = (course) => {
  if (course.name.length < 4) {
    return "O nome do curso deve ter pelo menos 4 caractéres!";
  }

  if (course.teacher.length < 4) {
    return "O nome do professor deve ter pelo menos 4 caractéres!";
  }

  if (course.description.length < 1) {
    return "A descrição do curso não pode estar vazia!";
  }

  if (!course.price || course.price <= 0) {
    return "O valor do curso deve ser maior que 0 (zero)!";
  }

  if (!course.quantity || course.quantity < -1 || course.quantity >= 301) {
    return "A quantidade de vagas deve ser entre -1 (ilimitado) e 300!";
  }

  if (course.category === "Selecione a categoria") {
    return "Selecione uma categoria!";
  }

  if (!course.image) {
    return "Selecione uma das imagens!";
  }

  return null;
};

/** Executada quando o usuário clica em uma das imagens, durante o cadastro do
 * curso.
 * @param {Event} event.
 */
const handleSelectCourseImage = (event) => {
  state.selectedCourse.image = event.target.src;

  Array.from(event.target.parentNode.children).forEach((child) =>
    child.classList.remove("selectedCourse"),
  );

  event.target.classList.add("selectedCourse");
};

/** Executada quando o usuário clica no botão para adicionar o curso, na página
 * de cadastro.
 * @param {Event} event.
 */
const handleAddCourse = (event) => {
  event.preventDefault();

  const id = state.courseState.length;
  const name = document.getElementById("courseNameInput").value;
  const teacher = document.getElementById("courseTeacherInput").value;

  const description = document.getElementById(
    "courseDescriptionTextArea",
  ).value;

  const price = document.getElementById("coursePriceInput").value;
  const category = document.getElementById("courseCategory");
  const quantity = document.getElementById("courseQuantityInput").value;
  const image = state.selectedCourse.image;

  const course = new Course(
    id,
    name,
    teacher,
    description,
    parseInt(price),
    category.options[category.selectedIndex].text,
    parseInt(quantity),
    image ? image.split("/images/")[1] : null,
  );

  const check = checkForm(course);

  if (!check) {
    state.selectedCourse.image = null;

    state.courseState.push(course);
    state.saveState();

    state.showCoursesListPage();
  } else {
    console.warn("INVÁLIDO!", check);

    const error = document.getElementById("error");

    error.innerHTML = check;
  }
};

/* ------- */
/* Eventos */
/* ------- */

// Ao carregar a página
window.addEventListener("load", () => {
  state = state.init();

  if (!state) {
    console.error("Erro! O estado é nulo.");

    return;
  }

  // Exibir lista de cursos (se lista !== nulo)
  state.coursesList && state.showCoursesListPage();
});
