=============================================================================
PASTA PARA SUAS MÚSICAS ROMÂNTICAS (public/audio/)
=============================================================================

Coloque seus arquivos de áudio .mp3 nesta pasta conforme a configuração:

1. era-obvio.mp3   -> [MÚSICA PRINCIPAL DO NÍVEL 4: "Era Óbvio"]
                     Acompanha o ápice da jornada e a declaração final!

2. abertura.mp3    -> Tela inicial de boas-vindas
3. menu.mp3        -> Menu principal da jornada dos níveis
4. nivel1.mp3      -> Música do Nível 1
5. nivel2.mp3      -> Música do Nível 2
6. nivel3.mp3      -> Música do Nível 3

CONFIGURAÇÃO CENTRALIZADA:
Você pode editar esses nomes e caminhos a qualquer momento no arquivo:
src/data/romanticContent.ts

COMO FUNCIONA O SISTEMA:
- Troca suave de música com Fade Out na anterior e Fade In na nova.
- Proteção total contra sobreposição: nunca toca duas músicas ao mesmo tempo.
- Não duplica instâncias ao navegar e voltar para a mesma página.
- Se o arquivo .mp3 ainda não estiver adicionado, o site NÃO quebra e continua
  funcionando perfeitamente (com melodia acústica sutil de teste).
- O botão de silenciar/ativar áudio funciona de maneira integrada em todas as telas.
=============================================================================
