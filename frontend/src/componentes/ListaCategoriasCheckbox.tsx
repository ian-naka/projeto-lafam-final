import type { Categoria, CategoriaDisponivel } from '@lafam/back-front';

interface ListaCategoriasCheckboxProps {
  categoriasDisponiveis: Categoria[];
  categoriaSelecionada: CategoriaDisponivel;
  aoSelecionar: (categoria: CategoriaDisponivel) => void;
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
