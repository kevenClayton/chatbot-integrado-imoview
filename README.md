## Como utilizar o chatbot integrado com o IMOVIEW em seu site

Veja abaixo os passos necessários utilizar o chatbot do Imoview.

### 1º - Importação estilização CSS

Inserir entre as tags **HEAD** o arquivo de estilização do chatbot

Exemplo:

```html {.line-numbers}
<link rel="stylesheet" type="text/css" href="https://app.imoview.com.br/scripts/chatbot.css"/>
```

### 2º - Importação arquivos javascript e execução do chatbot

Copie e cole a linha abaixo em entre as tags **BODY**</br>

```html {.line-numbers}
<script src="https://app.imoview.com.br/scripts/chatbot-imoview.js" type="text/javascript"></script>
```

### 3º - Copie e cole o código abaixo, após a importação do aquivo acima(é necessário informar alguns dados)</br>

Exemplo:

```html {.line-numbers}
<script type="text/javascript">
  IMOVIEW.Exec({
    corFundo: "#533D8B", //Opcional - Cor hexadecimal primária do chat, recomendamos a cor primário do site.
    avatarUrlChat: "http://modelogold.test/assets/img/team-95-1.jpg", //Cole a URL completa do avatar que aparecerá no chat ao abri-lo"
    mensagemChatFechado: "Como podemos <strong>te ajudar</strong> ?", //Texto que irá aparecer para o cliente clicar no chat
    posicao: "direito", //Lado que o botão ficará -- direito ou esquerda
    nomeHeaderChat: "XXX", // Nome que aparecerá do chat ao abri-lo
    rota: "demo", //Rota da imobiliária - é obtido no sistema Imoview clicando no menu canto direito superior e clique em "Detalhes convênio"
  });
</script>
```

**Obs:** o campo rota é obtido no sistema Imoview, clicando no menu canto direito superior e clique em "Detalhes convênio",
