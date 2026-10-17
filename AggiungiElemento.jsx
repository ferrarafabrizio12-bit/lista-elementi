import { useState, useContext, useRef } from "react";
import { ListaContext } from "./ListaContext";



function AggiungiElemento () {

  const { aggiungiElemento } = useContext(ListaContext);
  const inputRef = useRef(null);
  const [messaggio, setMessaggio] = useState("");
  const [isPending, setIsPending] = useState(false);

  const [form, setForm] = useState({
  testo: "",
  descrizione: ""
  });

  const handleChange = (e) => {
      const {name, value} = e.target;

      setForm((prev) => ({
        ...prev,
        [name]:value
      }));
    };

    const handleSubmit = async (e) => {

      e.preventDefault();
      setMessaggio("");

      if(!form.testo || !form.testo.trim() || !form.descrizione || !form.descrizione.trim()) {
        inputRef.current.focus();
        setIsPending(false);
        setMessaggio("Elemento o Descrizione MANCANTE!");
        return;
      };

      setIsPending(true);
      await new Promise((resolve) => setTimeout(resolve,1000));

      aggiungiElemento(form.testo, form.descrizione);

      setForm({
      testo: "",
      descrizione: ""
      });

      
      setIsPending(false);
      inputRef.current.focus();
      setMessaggio("Elemento aggiunto correttamente.");
    };

  const stato =  isPending ? "Aggiunta in corso..." : "Aggiungi";



  return (

    <>
    <form onSubmit={handleSubmit}>
      <p><input name="testo" value={form.testo} onChange={handleChange} type="text" ref={inputRef} placeholder="Scrivi Elemento" /></p>
      <p><input name="descrizione" value={form.descrizione} onChange={handleChange} type="text" placeholder="Scrivi una descrizione" /></p>
      <p><button type="submit" disabled={isPending}>{stato}</button></p>
    </form>

    <p>{messaggio}</p>
    </>
  );
}

export default AggiungiElemento;