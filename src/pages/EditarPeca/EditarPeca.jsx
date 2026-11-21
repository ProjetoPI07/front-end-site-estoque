import { PageHeader } from "../../components/ui/Card";
import FormularioPeca from "../../components/pecas/FormularioPeca";

export default function EditarPeca() {
  return (
    <div>
      <PageHeader
        sobretitulo="Atualizar inventário"
        titulo="Editar peça"
        subtitulo="Atualize as informações e a quantidade da peça."
      />
      <FormularioPeca modo="edicao" />
    </div>
  );
}
