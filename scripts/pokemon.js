const d = document,
  options = {
    cache: "reload",
  },
  $cardList = d.querySelector(".card__list"),
  $next = d.querySelector(".next"),
  $previous = d.querySelector(".previous");

export const getPokemon = async () => {
  const url = "https://pokeapi.co/api/v2/pokemon",
    data = await fetchFunction(url);
  nextPrevious();
};

const fetchFunction = async (url) => {
  try {
    const data = await fetch(url, options);
    const json = await data.json(),
      results = json.results;

    if (json.next) {
      $next.classList.remove("d-none");
      $next.href = json.next;
    } else {
      $next.classList.add("d-none");
    }

    if (json.previous) {
      $previous.classList.remove("d-none");
      $previous.href = json.previous;
    } else {
      $previous.classList.add("d-none");
    }

    if (!data.ok) throw { status: data.status, info: data.statusText };
    try {
      const combinedDataPokemon = results.map(async (result) => {
        const dataPokemon = (await fetch(result.url, options)) ?? [];
        if (!dataPokemon.ok)
          throw { status: dataPokemon.status, info: dataPokemon.statusText };
        const jsonPokemon = await dataPokemon.json();
        return {
          pokemon: result,
          pokemonData: jsonPokemon,
        };
      });
      buildPokemon(combinedDataPokemon);
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
};

const buildPokemon = async (pokemon) => {
  const $template = d.getElementById("template-card").content,
    $fragment = d.createDocumentFragment(),
    pokemons = await Promise.all(pokemon);
  pokemons.forEach((value) => {
    const { pokemon, pokemonData } = value;

    $template.querySelector("img").src = pokemonData.sprites.front_default;
    $template.querySelector(".card__title").textContent = pokemon.name;
    const $cloneTemplate = d.importNode($template, true);
    $fragment.appendChild($cloneTemplate);
  });

  if ($cardList.hasChildNodes()) {
    $cardList.textContent = "";
  }

  $cardList.appendChild($fragment);
};

const nextPrevious = () => {
  d.addEventListener("click", (e) => {
    if (e.target === $next) {
      console.log("hola");
      e.preventDefault();
      fetchFunction(e.target.href);
    } else if (e.target === $previous) {
      e.preventDefault();
      fetchFunction(e.target.href);
    }
  });
};
