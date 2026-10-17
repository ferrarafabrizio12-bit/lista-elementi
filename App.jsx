import { useState, useEffect, useReducer, useMemo, useRef } from "react";
import Elemento from "./Elemento";
import AggiungiElemento from "./AggiungiElemento";
import { ListaContext } from "./ListaContext";

function reducer(statoAttuale, azione) {
  switch (azione.type) {
    case "aggiungi":
      return [...statoAttuale, azione.elemento];

    case "cancella":
      return statoAttuale.filter(
        (elemento) => elemento.id !== azione.id
      );

    case "completa":
      return statoAttuale.map((elemento) =>
        elemento.id === azione.id
          ? { ...elemento, completed: !elemento.completed }
          : elemento
      );

    default:
      return statoAttuale;
  }
}

function App() {
  const possibileLista = localStorage.getItem("lista");
  const listaIniziale =
    possibileLista !== null ? JSON.parse(possibileLista) : [];

  const [lista, dispatch] = useReducer(reducer, listaIniziale);
  const [filtro, setFiltro] = useState("tutti");

  const renderCount = useRef(0);
  renderCount.current += 1;

  useEffect(() => {
    localStorage.setItem("lista", JSON.stringify(lista));
  }, [lista]);

  const aggiungiElemento = (testo, descrizione) => {
    if (!testo || !testo.trim()) return;

    const nuovoElemento = {
      id: Date.now(),
      testo: testo.trim(),
      descrizione: descrizione.trim(),
      completed: false,
    };

    dispatch({
      type: "aggiungi",
      elemento: nuovoElemento,
    });
  };

  const cancellaElemento = (id) => {
    dispatch({ type: "cancella", id });
  };

  const completaElemento = (id) => {
    dispatch({ type: "completa", id });
  };

  const listaFiltrata = useMemo(() => {
    if (filtro === "daCompletare") {
      return lista.filter((elemento) => !elemento.completed);
    }

    if (filtro === "completati") {
      return lista.filter((elemento) => elemento.completed);
    }

    return lista;
  }, [lista, filtro]);

  const numeroDaCompletare = lista.filter(
    (elemento) => !elemento.completed
  ).length;

  const numeroCompletati = lista.filter(
    (elemento) => elemento.completed
  ).length;

  const ottieniStile = (nomeFiltro) => ({
    fontWeight: filtro === nomeFiltro ? "bold" : "normal",
    backgroundColor: filtro === nomeFiltro ? "#d1fae5" : "white",
  });

  return (
    <ListaContext.Provider
      value={{ cancellaElemento, completaElemento, aggiungiElemento }}
    >
      <h1>Lista Elementi</h1>

      <AggiungiElemento />

      <button
        style={ottieniStile("tutti")}
        onClick={() => setFiltro("tutti")}
      >
        Tutti: {lista.length}
      </button>

      <button
        style={ottieniStile("daCompletare")}
        onClick={() => setFiltro("daCompletare")}
      >
        Da completare: {numeroDaCompletare}
      </button>

      <button
        style={ottieniStile("completati")}
        onClick={() => setFiltro("completati")}
      >
        Completati: {numeroCompletati}
      </button>

      <ul>
        {listaFiltrata.map((elemento) => (
          <li key={elemento.id}>
            <span
              style={{
                textDecoration: elemento.completed
                  ? "line-through"
                  : "none",
              }}
            >
              <strong>Elemento: </strong>{elemento.testo} <strong>Descrizione: </strong>{elemento.descrizione}
            </span>

            <Elemento
              id={elemento.id}
              completed={elemento.completed}
            />
          </li>
        ))}
      </ul>

      <p>Render eseguiti: {renderCount.current}</p>
    </ListaContext.Provider>
  );
}

export default App;
