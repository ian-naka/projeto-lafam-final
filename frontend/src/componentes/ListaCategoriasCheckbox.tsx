import type { Categoria } from '../tipos/categoria';

interface ListaCategoriasCheckboxProps {
  categoriasDisponiveis: Categoria[];
  categoriaSelecionada: string;
  aoSelecionar: (categoria: string) => void;
}

const ListaCategoriasCheckbox = ({
  categoriasDisponiveis,
  categoriaSelecionada,
  aoSelecionar,
}: ListaCategoriasCheckboxProps) => {
  return (
    <div className="lista-checkbox">
      {categoriasDisponiveis.map((categoria) => (
        <label key={categoria.slug} className="checkbox-item">
          <input
            type="radio"
            name="categoria"
            checked={categoriaSelecionada === categoria.nome}
            onChange={() => aoSelecionar(categoria.nome)}
          />
          <span>{categoria.nome}</span>
        </label>
      ))}
    </div>
  );
};

export default ListaCategoriasCheckbox;
