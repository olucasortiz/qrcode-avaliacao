export function pesquisaDto(pesquisa) {
  return {
    titulo: pesquisa.titulo,
    descricao: pesquisa.descricao,
    slug: pesquisa.slug,
    perguntas: pesquisa.perguntas.map(pergunta => ({
      id: pergunta.id,
      texto: pergunta.texto,
      tipo: pergunta.tipo,
      obrigatoria: pergunta.obrigatoria,
      ...(pergunta.tipo === 'MULTIPLA_ESCOLHA' ? {
        opcoes: pergunta.opcoes.map(opcao => ({ id: opcao.id, texto: opcao.texto })),
      } : {}),
    })),
  };
}
