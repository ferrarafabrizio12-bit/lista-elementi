import { useContext } from "react";
import { ListaContext } from "./ListaContext";

function Elemento({ id, completed }) {
  const { cancellaElemento, completaElemento } = useContext(ListaContext);

  return (
    <>
    <button onClick={() => cancellaElemento(id)}>
      Cancella
    </button>
    <span>
    <input type="checkbox" checked={completed} onChange={() => completaElemento(id)}></input>
    </span>
    </>
  );

}
export default Elemento;