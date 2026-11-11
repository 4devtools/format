# Controle de Ativo Fixo — versão 2.0.3

## Como publicar
1. Na pasta `inventario/` do repositório, substitua `index.html`, `sw.js` e `manifest.json` pelos novos.
2. Adicione as pastas novas `lib/` (bibliotecas locais) e `img-min/` (miniaturas leves, 557 KB no total).
3. Apague `index.001.html` (versão antiga, sem PWA).
4. Mantenha `imagens/`, `salas/`, `icon-192.png` e `icon-512.png` como estão.
5. No celular, abra o app uma vez com internet. Na primeira abertura ele baixa tudo para funcionar offline.
   Para forçar atualização futura, basta mudar `VERSION` no começo do `sw.js`.

Os dados já salvos no celular (versão anterior) são migrados automaticamente.

## O que mudou
**Fluxo do estagiário:** tela única "Levantar" com Unidade → Sala → Objeto → Escanear. O objeto continua
escolhido até ser trocado, então dá para ler 20 cadeiras seguidas. Se faltar algum passo, o app diz qual e pisca o campo.

**Scanner:** tela cheia, sem escolha entre barras e QR (lê os dois), bipe + vibração + flash verde/laranja,
cartão grande com o resultado, lanterna, tela sempre ligada e botão Voltar do Android fecha a câmera.
Mesmo código na frente da câmera não é contado de novo.

**À prova de erros:** código já lido, código em outra sala (pergunta se move), troca de tipo,
botão Desfazer, confirmações com botões claros, "Apagar sala" exige digitar APAGAR,
não deixa excluir unidade/sala/objeto em uso, "Sem etiqueta" com quantidade.

**Planilha:** mostra o nome e onde o arquivo ficou (Downloads), guarda histórico das últimas 10 planilhas
no próprio celular (baixar de novo / compartilhar), botão Compartilhar (WhatsApp, e-mail, Drive),
aviso de itens ainda não exportados. A planilha leva só o código da imagem, e a importação refaz o vínculo por ID.
Importar mostra uma prévia (novos, repetidos, conflitos) e permite Mesclar ou Substituir; importar o mesmo arquivo duas vezes não duplica nada.
Aceita também planilhas no formato antigo.

**Correções:** IDs duplicados na importação, e-mail/ID de planilha não importados, datas em pt-BR que
não eram comparadas, redesenho que apagava a edição ao abrir o teclado, estado compartilhado entre telas,
texto sem escape (HTML), cache offline que não casava com `?v=`, Tailwind/Material Icons/ZXing/SheetJS
vindos de CDN (agora locais), imagens de 700 KB exibidas a 50 px (agora miniaturas de ~17 KB).

**Novidades de dados:** imagem por sala (pasta `salas/`), estado de conservação, observação, sala "concluída",
responsável, objetos padrão (24) com um toque.
