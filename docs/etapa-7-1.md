# TASK 07.1 — Preservação do SQLite e baseline de migração

**Status: Concluído.**  
**Data: 13/10/2026**  
**Ambiente: Node v24.21.0, npm 11.19.0, Windows**  
**Branch de trabalho: `feat/mongodb-migration`**  

---

## 1. Identificação e versão SQLite de referência

Para viabilizar a futura migração do FeedQR para MongoDB Atlas com garantia de rollback seguro e preservação integral dos dados existentes, foi estabelecido o baseline de referência do sistema e do banco SQLite:

- **Branch de origem:** `main`
- **Branch criada e ativa:** `feat/mongodb-migration` (criada a partir de `main`, sem conflitos e preservando alterações e relatórios locais)
- **Commit exato de referência:** `2bc755c05d28ff79a7f68222662bfd119f6ac9d8`
  - **Autor:** `olucasortiz <lucassas@outlook.com>`
  - **Data:** `Tue Oct 13 11:48:37 2026 -0300`
  - **Mensagem:** `funcionalidades finalizadas, faltando apenas deploy`
- **Banco de dados original:** `prisma/dev.db`
  - **Tamanho:** `176.128 bytes`
  - **Hash SHA-256:** `15207b88446f8be4a86e9defab2995bd444980ce52153a64bf538aaef57500c4`
  - **Total de registros de negócio:** `8` registros
  - **Total de registros de histórico de migrations:** `4` registros

---

## 2. Criação do snapshot consistente

O snapshot foi gerado utilizando a Serialization API nativa do SQLite (`sqlite3_serialize`), acessível no Node 24 via `DatabaseSync.prototype.serialize()`. Esse método extrai a imagem binária completa e consistente do banco em memória sob proteção transacional direta do motor SQLite, sem realizar qualquer escrita no arquivo de origem:

1. **Abertura estritamente somente leitura:** `new DatabaseSync('prisma/dev.db', { readOnly: true })`.
2. **Extração serializada:** `sourceDb.serialize()`.
3. **Persistência privada:** Gravado em `backups/dev_baseline_20261013.db`.
4. **Verificação de identidade binária:**
   - Tamanho do snapshot: `176.128 bytes`.
   - Hash SHA-256 do snapshot: `15207b88446f8be4a86e9defab2995bd444980ce52153a64bf538aaef57500c4` (100% idêntico à origem).
5. **Verificação pós-operação da origem:** O hash de `prisma/dev.db` foi recalculado e permaneceu rigorosamente `15207b88446f8be4a86e9defab2995bd444980ce52153a64bf538aaef57500c4`. O banco original permaneceu intocado.
6. **Metadados técnicos exportados:** O arquivo privado `backups/technical_metadata.json` foi gerado para registrar o baseline técnico, contagens, histórico de migrations e objetos do schema, contendo zero credenciais, hashes de senhas ou dados sensíveis.

---

## 3. Validação do snapshot

O snapshot `backups/dev_baseline_20261013.db` foi aberto e submetido a auditoria completa via `scripts/preserve-sqlite-baseline.js`:

### 3.1. Integridade física e referencial
- `PRAGMA integrity_check`: **`ok`** (1 linha retornada, sem erros de páginas, B-trees ou índices).
- `PRAGMA foreign_key_check`: **`0 violações`** (lista vazia).

### 3.2. Contagem de registros por tabela

| Tabela | Origem (`prisma/dev.db`) | Snapshot (`backups/dev_baseline_20261013.db`) | Status |
| :--- | :---: | :---: | :---: |
| `Empresa` | 1 | 1 | Coincidente |
| `Usuario` | 1 | 1 | Coincidente |
| `Pesquisa` | 1 | 1 | Coincidente |
| `Pergunta` | 5 | 5 | Coincidente |
| `OpcaoPergunta` | 0 | 0 | Coincidente |
| `PontoColeta` | 0 | 0 | Coincidente |
| `Resposta` | 0 | 0 | Coincidente |
| `RespostaPergunta` | 0 | 0 | Coincidente |
| `_prisma_migrations` | 4 | 4 | Coincidente |
| `sqlite_sequence` | 0 | 0 | Coincidente |

### 3.3. Histórico das quatro migrations aplicadas

Todas as quatro migrations presentes na tabela `_prisma_migrations` foram conferidas contra os arquivos físicos de migration do repositório:

1. `20261007220806_init`: checksum `05bd4339295a2f18adee8af54e0996b05f5f0e9b900aaa752b0ed0bd0e9757e2`, 1 etapa aplicada com sucesso.
2. `20261007221304_expandir_modelos`: checksum `7091f6bc53bb099544778c1cf862a6a68ae6f55c875f9d1627585f59f1248183`, 1 etapa aplicada com sucesso.
3. `20261007221725_ponto_token`: checksum `b8828aee29db70eefd8743b6eedb90206eacbec50da5eb007ed386458fc05ae4`, 1 etapa aplicada com sucesso.
4. `20261008120000_resposta_idempotencia`: checksum `7185d515502b20c36077ff55a05e369175c7e221126101bbc24586b36ed47d9b`, 1 etapa aplicada com sucesso.

### 3.4. Comparação integral dos dados de negócio

Todas as linhas das tabelas `Empresa`, `Usuario`, `Pesquisa`, `Pergunta`, `OpcaoPergunta`, `PontoColeta`, `Resposta` e `RespostaPergunta` foram comparadas coluna a coluna entre a origem e o snapshot:
- **Resultado:** 100% idênticas em todas as colunas.
- **Sigilo:** A comparação foi realizada inteiramente em memória. Nenhuma senha, hash bcrypt, email pessoal ou token foi exposto em console, terminal ou artefato de saída.

---

## 4. Proteção contra exposição no Git

O arquivo `.gitignore` foi atualizado para garantir que nenhum backup, snapshot, dump ou metadado sensível possa ser versionado ou publicado:

```gitignore
backups/
*.dump
*.bak
*.snapshot
```

### Verificação operacional
O comando `git check-ignore -v backups/dev_baseline_20261013.db backups/technical_metadata.json` confirmou que os arquivos privados de backup estão ativamente ignorados pelas regras do Git.

---

## 5. Fixtures sintéticas de caracterização

Conforme diagnosticado na TASK 07, o banco original possui apenas perguntas do tipo `ESTRELAS` (4) e `TEXTO` (1), com as tabelas de opções, pontos de coleta e respostas vazias. Para validar a migração de todos os tipos e comportamentos sem poluir a origem, foram construídas fixtures puramente sintéticas:

- **Localização:** `tests/fixtures/syntheticBaseline.js`
- **Teste de validação:** `tests/syntheticBaseline.test.js`

### Cobertura das fixtures sintéticas

1. **Multi-empresa:** 2 empresas distintas (`Empresa Alfa Sintética` e `Empresa Beta Sintética`) e 2 usuários administradores com senhas simuladas.
2. **Ciclo de vida de pesquisas:** Pesquisas nos status `ATIVA`, `RASCUNHO` (incluindo descrição nula para teste de opcionais) e `ENCERRADA`.
3. **Cinco tipos de pergunta:**
   - `ESTRELAS`: Notas 1 a 5, obrigatória e opcional.
   - `NPS`: Notas 0 a 10 (cobrindo detratores, neutros e promotores).
   - `SIM_NAO`: Valores booleanos (0 e 1).
   - `TEXTO`: Textos normais com acentuação UTF-8 (`áéíóúçãõ`) e strings com caracteres especiais/proteção contra injeção de fórmulas CSV (`=HYPERLINK(...)`).
   - `MULTIPLA_ESCOLHA`: Pergunta associada a 3 opções de resposta (`OpcaoPergunta`) com ordens explicitadas (0, 1 e 2).
4. **Pontos de coleta:** Pontos ativos e ponto inativo histórico, com tokens UUID válidos e fixos.
5. **Cenários de resposta:**
   - Respostas originadas de ponto de coleta ativo.
   - Respostas originadas de ponto inativo histórico.
   - Respostas originadas sem ponto de coleta (`pontoColetaId = null`, coleta web direta).
   - Respostas cobrindo perguntas opcionais respondidas e perguntas opcionais puladas.
6. **Idempotência:**
   - Respostas com par único de `idempotencyKey` + `submissionHash`.
   - Múltiplas respostas com `idempotencyKey = null` (comprovando compatibilidade com o índice único do SQLite que aceita múltiplos nulos).
7. **Série temporal:** Respostas distribuídas em múltiplos dias (`2026-10-01`, `2026-10-02`, `2026-10-03`) em UTC para posterior aferição de agrupamento diário.
8. **Integridade estrita:** Todas as fixtures cumprem a constraint `RespostaPergunta_valor_check` (exclusividade do valor tipado) e foram validadas com sucesso em banco descartável em memória (`:memory:`) via Vitest.

---

## 6. Procedimento de recuperação e rollback

### Cenário 1: Restauração da baseline SQLite a partir do snapshot
Caso o banco `prisma/dev.db` seja corrompido, acidentalmente alterado ou precise ser resetado para o estado inicial da migração:

1. **Parar serviços:** Certificar-se de que a API e quaisquer scripts em execução estejam parados.
2. **Verificar o snapshot:**
   ```powershell
   node -e "const fs = require('fs'), crypto = require('crypto'); console.log(crypto.createHash('sha256').update(fs.readFileSync('backups/dev_baseline_20261013.db')).digest('hex'));"
   # Deve retornar: 15207b88446f8be4a86e9defab2995bd444980ce52153a64bf538aaef57500c4
   ```
3. **Copiar o snapshot para dev.db:**
   ```powershell
   Copy-Item backups/dev_baseline_20261013.db prisma/dev.db -Force
   ```
4. **Validar a integridade restaurada:**
   ```powershell
   node scripts/preserve-sqlite-baseline.js
   ```

### Cenário 2: Rollback completo antes de novas gravações no MongoDB
Caso a implementação seja interrompida antes do corte final e de escritas em produção:
1. Retornar a branch para a versão SQLite (`main` ou commit `2bc755c05d28ff79a7f68222662bfd119f6ac9d8`).
2. Garantir `DATABASE_URL="file:./dev.db"`.
3. Executar a suíte de testes SQLite: `npm test`.

### Cenário 3: Rollback após novas gravações no MongoDB
Conforme planejado na TASK 07 (Seção 8), o rollback após o corte de produção não reutiliza o snapshot estático antigo sob risco de perda de dados. O procedimento requer a ferramenta de conversão reversa (TASK 07.8) gerando um **novo arquivo SQLite** reconciliado, mantendo `prisma/dev.db` intacto como histórico.

---

## 7. Arquivos criados e modificados

1. `.gitignore` (modificado): Inclusão de `backups/`, `*.dump`, `*.bak`, `*.snapshot`.
2. `scripts/preserve-sqlite-baseline.js` (criado): Script automatizado para geração e validação do snapshot e metadados técnicos.
3. `tests/fixtures/syntheticBaseline.js` (criado): Conjunto de fixtures sintéticas cobrindo todos os 5 tipos de pergunta, pontos, opções e idempotência.
4. `tests/syntheticBaseline.test.js` (criado): Teste automatizado executado pelo Vitest validando a integridade das fixtures em banco isolado.
5. `docs/etapa-7-1.md` (criado): Este relatório formal de baseline e preservação.
6. `backups/dev_baseline_20261013.db` (criado, privado / ignorado pelo Git): Snapshot íntegro do banco original.
7. `backups/technical_metadata.json` (criado, privado / ignorado pelo Git): Metadados técnicos do banco de dados e histórico de migrations.

---

## 8. Verificações realizadas

- [x] Branch `feat/mongodb-migration` criada sem descartar alterações locais.
- [x] Commit de referência identificado: `2bc755c05d28ff79a7f68222662bfd119f6ac9d8`.
- [x] Snapshot consistente gerado via SQLite Serialization API em arquivo privado.
- [x] Banco de dados original `prisma/dev.db` permaneceu 100% inalterado (SHA-256 verificado antes e depois).
- [x] `PRAGMA integrity_check` executado no snapshot com status `ok`.
- [x] `PRAGMA foreign_key_check` executado no snapshot com `0 violações`.
- [x] Contagem de registros por tabela validada.
- [x] Histórico das 4 migrations validado contra arquivos em disco.
- [x] Comparação integral dos dados de negócio realizada sem exposição de segredos.
- [x] Arquivos de backup, dumps e credenciais confirmados como ignorados no `.gitignore`.
- [x] Fixtures sintéticas implementadas cobrindo os 5 tipos de pergunta, opções, pontos e idempotência.
- [x] Testes automatizados executados e verdes.
- [x] Procedimento de recuperação e rollback documentado.

---

## 9. Próximos passos e restrições

- **A TASK 07.2 NÃO FOI INICIADA.**
- O avanço para a TASK 07.2 (Protótipo MongoDB em replica set isolado) aguarda revisão e aprovação desta entrega.
