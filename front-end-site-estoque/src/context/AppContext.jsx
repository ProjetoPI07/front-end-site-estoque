/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  seedCobrancas,
  seedPecas,
  usuarioPrototipo,
} from "../data/seed";
import { credenciaisValidas } from "../utils/validacao";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  const entrar = useCallback((identificador, senha) => {
    if (!credenciaisValidas(identificador, senha)) return false;
    setUsuario(usuarioPrototipo);
    return true;
  }, []);

  const sair = useCallback(() => {
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({ usuario, entrar, sair }),
    [usuario, entrar, sair],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return contexto;
}

const DadosContext = createContext(null);

function proximoId(itens) {
  return itens.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;
}

export function DadosProvider({ children }) {
  const [pecas, setPecas] = useState(seedPecas);
  const [cobrancas, setCobrancas] = useState(seedCobrancas);

  const cadastrarPeca = useCallback((dados) => {
    setPecas((atuais) => {
      const peca = {
        ...dados,
        id: proximoId(atuais),
        valor: Number(dados.valor) || 0,
        quantidade: Number(dados.quantidade) || 0,
        limiteEstoque: Number(dados.limiteEstoque) || 0,
      };
      return [...atuais, peca];
    });
  }, []);

  const editarPeca = useCallback((id, dados) => {
    setPecas((atuais) =>
      atuais.map((peca) =>
        peca.id === id
          ? {
              ...peca,
              ...dados,
              valor: Number(dados.valor) || 0,
              quantidade: Number(dados.quantidade) || 0,
              limiteEstoque: Number(dados.limiteEstoque) || 0,
            }
          : peca,
      ),
    );
  }, []);

  const ajustarQuantidade = useCallback((id, quantidade) => {
    setPecas((atuais) =>
      atuais.map((peca) =>
        peca.id === id ? { ...peca, quantidade: Math.max(0, quantidade) } : peca,
      ),
    );
  }, []);

  const cadastrarCobranca = useCallback((dados) => {
    setCobrancas((atuais) => [
      ...atuais,
      {
        ...dados,
        id: proximoId(atuais),
        parcelasPagas: 0,
      },
    ]);
  }, []);

  const baixarParcela = useCallback((id) => {
    setCobrancas((atuais) =>
      atuais.map((cobranca) =>
        cobranca.id === id
          ? {
              ...cobranca,
              parcelasPagas: Math.min(
                cobranca.parcelas,
                cobranca.parcelasPagas + 1,
              ),
            }
          : cobranca,
      ),
    );
  }, []);

  const baixarTotal = useCallback((id) => {
    setCobrancas((atuais) =>
      atuais.map((cobranca) =>
        cobranca.id === id
          ? { ...cobranca, parcelasPagas: cobranca.parcelas }
          : cobranca,
      ),
    );
  }, []);

  const valor = useMemo(
    () => ({
      pecas,
      cobrancas,
      cadastrarPeca,
      editarPeca,
      ajustarQuantidade,
      cadastrarCobranca,
      baixarParcela,
      baixarTotal,
    }),
    [
      pecas,
      cobrancas,
      cadastrarPeca,
      editarPeca,
      ajustarQuantidade,
      cadastrarCobranca,
      baixarParcela,
      baixarTotal,
    ],
  );

  return (
    <DadosContext.Provider value={valor}>{children}</DadosContext.Provider>
  );
}

export function useDados() {
  const contexto = useContext(DadosContext);
  if (!contexto) {
    throw new Error("useDados deve ser usado dentro de DadosProvider");
  }
  return contexto;
}
