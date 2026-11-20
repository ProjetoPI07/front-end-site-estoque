import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { formatarCpf } from "../../utils/mascaras";
import { TextField } from "../../components/ui/Fields";
import Button from "../../components/ui/Button";
import Icon from "../../components/ui/Icon";
import HelpButton from "../../components/layout/HelpButton";
import "./Login.css";

function mascararIdentificador(valor) {
  if (/[^\d.\-/()]/.test(valor)) return valor;
  return formatarCpf(valor);
}

export default function Login() {
  const [identificador, setIdentificador] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const [erros, setErros] = useState({ identificador: false, senha: false });

  const { entrar } = useAuth();
  const { mostrarToast } = useToast();
  const navegar = useNavigate();

  const enviar = (evento) => {
    evento.preventDefault();

    if (entrar(identificador, senha)) {
      navegar("/estoque", { replace: true });
      return;
    }

    setErros({ identificador: true, senha: true });
    mostrarToast("erro", "Dados inválidos");
  };

  return (
    <div className="login">
      <aside className="login__esquerda">
        <div className="login__brilho" aria-hidden="true" />
        <div className="login__anel login__anel--1" aria-hidden="true" />
        <div className="login__anel login__anel--2" aria-hidden="true" />

        <div className="login__selo">
          <img src="/brand/logo-mark-white.png" alt="" />
        </div>

        <div className="login__texto">
          <p className="login__marca">Constru Móveis</p>
          <h1 className="login__titulo">
            Gestão que mantém
            <br />
            tudo em movimento.
          </h1>
          <p className="login__descricao">
            Controle seu estoque com clareza, agilidade e decisões mais
            inteligentes.
          </p>
        </div>

        <p className="login__copyright">© 2026 Constru Móveis</p>
      </aside>

      <section className="login__direita">
        <div className="login__marca-mobile">
          <span className="login__marca-icone">
            <img src="/brand/logo-mark-white.png" alt="" />
          </span>
          <span>Constru Móveis</span>
        </div>

        <div className="login__form">
          <p className="login__eyebrow">Bem-vindo de volta</p>
          <h2 className="login__titulo-form">Acesse sua conta</h2>
          <p className="login__subtitulo">
            Entre com suas credenciais para continuar.
          </p>

          <form onSubmit={enviar} noValidate>
            <div className="login__campos">
              <TextField
                label="E-mail ou CPF"
                placeholder="seu@email.com ou CPF"
                value={identificador}
                onChange={(valor) => {
                  setIdentificador(mascararIdentificador(valor));
                  setErros((atuais) => ({ ...atuais, identificador: false }));
                }}
                erro={erros.identificador}
                autoComplete="username"
                inputMode="email"
              />

              <TextField
                label="Senha"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(valor) => {
                  setSenha(valor);
                  setErros((atuais) => ({ ...atuais, senha: false }));
                }}
                erro={erros.senha}
                revelavel
                autoComplete="current-password"
              />
            </div>

            <div className="login__linha">
              <label className="login__lembrar">
                <input
                  type="checkbox"
                  checked={lembrar}
                  onChange={(evento) => setLembrar(evento.target.checked)}
                />
                <span className="login__caixa" aria-hidden="true">
                  <Icon name="check" size={12} strokeWidth={2.4} />
                </span>
                Lembrar de mim
              </label>

              <a
                className="login__link"
                href="#recuperar"
                onClick={(evento) => evento.preventDefault()}
              >
                Esqueci minha senha
              </a>
            </div>

            <Button
              type="submit"
              icone="arrowRight"
              className="login__entrar"
            >
              Entrar
            </Button>
          </form>
        </div>
      </section>

      <HelpButton />
    </div>
  );
}
