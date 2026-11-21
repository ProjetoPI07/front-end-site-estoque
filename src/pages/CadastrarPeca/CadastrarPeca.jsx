import { PageHeader } from "../../components/ui/Card";
import FormularioPeca from "../../components/pecas/FormularioPeca";

export default function CadastrarPeca() {
  return (
    <div>
      <PageHeader
        sobretitulo="Novo item"
        titulo="Cadastrar peça"
        subtitulo="Adicione uma nova peça ao seu inventário."
      />
      <FormularioPeca modo="cadastro" />
    </div>
  );
}
