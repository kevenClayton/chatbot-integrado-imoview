var IMOVIEW = {

    BaseUrl: (window.location.host.includes('.io') ? "https://api.imoview.com.br/chatbot/Interagir" : 'http://localhost:51472/chatbot/Interagir'),    
    UrlHtml: "chatbot.html",
    Maximado: false,    
    
    DadosSession: function () {
        if (localStorage && localStorage.getItem && localStorage.setItem) {
            var jsonJaSalvo = localStorage.getItem("chatBotImoview"),
                json = jsonJaSalvo ? JSON.parse(jsonJaSalvo) : [];
                json.push(this.guid), localStorage.setItem("chatBotImoview", JSON.stringify(json));
        }
    },

    MascaraMutuario: function(o,f){
        v_obj=o
        v_fun=f
        setTimeout('IMOVIEW.Execmascara()',1)
    },

    Execmascara: function(){
        v_obj.value=v_fun(v_obj.value)
    },

    CpfCnpj: function(v){
        v = v.replace(/\D/g, "")

        if (v.length <= 11) {
        
            //Coloca um ponto entre o terceiro e o quarto dígitos
            v = v.replace(/(\d{3})(\d)/, "$1.$2")
            //Coloca um ponto entre o terceiro e o quarto dígitos
            //de novo (para o segundo bloco de números)
            v = v.replace(/(\d{3})(\d)/, "$1.$2")
            //Coloca um hífen entre o terceiro e o quarto dígitos
            v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        } else {
            //Coloca ponto entre o segundo e o terceiro dígitos
            v = v.replace(/^(\d{2})(\d)/, "$1.$2")
            //Coloca ponto entre o quinto e o sexto dígitos
            v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            //Coloca uma barra entre o oitavo e o nono dígitos
            v = v.replace(/\.(\d{3})(\d)/, ".$1/$2")
            //Coloca um hífen depois do bloco de quatro dígitos
            v = v.replace(/(\d{4})(\d)/, "$1-$2")
        }
      
        return v
    
    },
    
    Telefone: function(v){
        v = v.replace(/\D/g, "")

        if (v.length > 0) {        
            v = v.replace(/\D/g,'')
            v = v.replace(/(\d{2})(\d)/,"($1) $2")
            v = v.replace(/(\d)(\d{4})$/,"$1-$2")    
        } 
      
        return v
    
    },
    FormatarInteiro: function(valor) {
        valor = valor + '';
        if (valor != "") {
            valor = valor.replace(/[\D]+/g, '');
        }
        return (valor == "NaN" || valor == NaN ? '' : valor);
    },
    FormatarMoeda: function(valor) {
        valor = valor + '';
        valor = parseInt(valor.replace(/[\D]+/g, ''));
        valor = valor + '';
        if (valor.length > 2) {
            valor = valor.replace(/([0-9]{2})$/g, ",$1");
        }

        if (valor.length > 6) {
            valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
        }

        return (valor == "NaN" ? 'R$ ' : 'R$ ' +valor);
    },
    FormatarPercentual: function(valor) {
        
        valor = valor + '';
        valor = parseInt(valor.replace(/[\D]+/g, ''));
        valor = valor + '';
        if (valor.length > 2) {
            valor = valor.replace(/([0-9]{2})$/g, ",$1");
        }

        if (valor.length > 6) {
            valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
        }

        return (valor == NaN ? valor+ '%' : '%');
    },
    FormatarValor: function(valor) {
        
        valor = valor + '';
        valor = parseInt(valor.replace(/[\D]+/g, ''));
        valor = valor + '';
        if (valor.length > 2) {
            valor = valor.replace(/([0-9]{2})$/g, ",$1");
        }

        if (valor.length > 6) {
            valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
        }

        return (valor == "NaN" ? ' ' : valor);
    },
    FormatarCep: function(valor) {
        
        var valor= valor.replace(/\D/g,"")                
        valor = valor.replace(/^(\d{5})(\d)/,"$1-$2") 
       return (valor != NaN ? valor : '');
    },
    CarregarConversa: function(constanteAtual = 0, seletorInput = "", valoresAnteriores = "", botao = false, card = false, pagina = 1, ehSelect = false, tipo){
        var valorInput = "";
        var novoValor = "";
        var valoresAnterioresObjeto = new Array();
        // valoresAnterioresObjeto = valoresAnteriores;
        if (seletorInput != "") {
             var itemConteudo = document.querySelector('#'+seletorInput);
        }
       


         if (IMOVIEW.Maximado == false) {
            document.querySelector('.botaoMaximar').addEventListener("click", IMOVIEW.MaximarJanelaChat);  
        }

        if(constanteAtual == 0 && seletorInput == ""){            
            chatInteracoes = document.querySelectorAll('.imoview-group');
            chatInteracoes.forEach(function(chatInteracao){
                chatInteracao.remove()
            });
        }

        if(valoresAnteriores != 0){
            valoresAnteriores = JSON.parse(decodeURIComponent(valoresAnteriores))
            Object.assign(valoresAnterioresObjeto, valoresAnteriores)
        }
        
        if(card == true){
            inputDados = document.querySelector('#'+seletorInput);
            valorInput = inputDados.dataset.codigo;
            label = inputDados.dataset.label;
            
            var novoValor = {
                "constante": inputDados.dataset.constante,
                "label": label,
                "valor": valorInput
            }

            if(botao == false){
                valoresAnterioresObjeto = valoresAnterioresObjeto.filter(item => item.constante != inputDados.dataset.constante)
            }

            valoresAnterioresObjeto.push(novoValor);
            
            IMOVIEW.RetonarSelecionado(label);
        }

        if(seletorInput != "" && botao == false && card == false){
            inputDados = document.querySelector('#'+seletorInput);
            valorInput = (ehSelect ? inputDados.dataset.value : inputDados.value);
            label = (ehSelect ? inputDados.dataset.label : inputDados.placeholder);

            if (valorInput == "") {
                 IMOVIEW.RetornandoAlert('danger', 'Informação obrigatória')
                return false;
            }
            
            var novoValor = {
                "constante": (botao == true ? constanteAtual : inputDados.dataset.constante),
                "label": label,
                "valor": valorInput
            }
            if(botao == false){
                valoresAnterioresObjeto = valoresAnterioresObjeto.filter(item => item.constante != inputDados.dataset.constante)
            }
            valoresAnterioresObjeto.push(novoValor);
            
            IMOVIEW.RetonarSelecionado((ehSelect ? label : valorInput), 'Resposta');

    
        }else if(seletorInput != "" && botao == true){            
            IMOVIEW.RetonarSelecionado(itemConteudo.textContent);
            var contanteLimpar = itemConteudo.dataset.limpar;
            valoresAnterioresObjeto = valoresAnterioresObjeto.filter(item => item.constante != contanteLimpar)
            // htmlSelecionado = '<div class="imoview-group imoview-right"><div class="imoview-container"><div class="imoview-msg"><div class="imoview-bubble" style="background: #4c4c4c;color: white !important;"><div><div><p style="color:white !important;">Selecionado: '+conteudoBotao+'</p></div><div class="imoview-clear"></div></div></div></div></div><div class="imoview-clear"></div></div>';
            // botoesNaTela = document.querySelectorAll('.removerAposClickBotao');
            // botoesNaTela.forEach(function(botaoNaTela){
            //     botaoNaTela.remove()
            // });
            // document.querySelector('.imoview-scrollable').lastElementChild.insertAdjacentHTML("afterend", htmlSelecionado);
        }

        console.log(valorInput);
        console.log('PARAMETROS: ' + constanteAtual, seletorInput, valoresAnteriores);
        
        IMOVIEW.Loading();        
        IMOVIEW.ScrollBottom();

        data = {
            "rota":"demo",
            "paginaAtual": pagina,            
            "constanteAtual": constanteAtual,
            "menus":{             
                "valoresAnteriores": valoresAnterioresObjeto            
            }
        };

        
        fetch(IMOVIEW.BaseUrl, {
            method: 'POST',
            mode: 'cors', // pode ser cors ou basic(default)
            body: JSON.stringify(data),
            redirect: 'follow',
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: new Headers({
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': '/',
                'Origin':'http://modelogold.test/',
                'Referer':'http://modelogold.test/',
                'Connection':'keep-alive',
                'Cache': 'no-cache', //,
            })
          })
          .then(function(response) {
            console.log(response);           
            if(response.status != 200){
                response.text().then((text) => { 
                    retornoJson = JSON.parse(text); 
                    IMOVIEW.RetornandoAlert('danger', retornoJson.mensagem, true);
                    IMOVIEW.RemoverLoading();
                    
                    return false;
                });
            } 
            response.text().then((text) => { 
                try{
                    console.log(text);             
                    retornoJson = JSON.parse(text)
                    console.log(retornoJson);                  
                    var rota = retornoJson.rota;
                    var constanteAtual = retornoJson.constanteAtual;                             
                    var menus = retornoJson.menus;
                    var titulo = retornoJson.menus.titulo;
                    var valoresAnteriores = retornoJson.menus.valoresAnteriores;
                    var proximosValores = retornoJson.menus.proximosValores;           
                    var htmlMensagemPrincipal = "";
                    var htmlBotoes = "";
                    var htmlMensagem = titulo;
                    var htmlInput = "";
                    var htmlAlert = "";
                    var htmlPrincipalAlert = "";
                        
                    var idInput = "id-botao-"+ IMOVIEW.GenareateId() +"0";                    

                    proximosValores.forEach(function(menu){
                        var IdBotaoOpcoes = "id-botao-"+ IMOVIEW.GenareateId() +"0";     
                        var htmlAjuda = "";

                        if(menu.ajuda != "")             {
                            htmlAjuda = '<p class="removerAposClickBotao" style="color: #c9c9c9;word-break: break-word;font-size: 13px !important;"><span style="border: 2px solid;border-radius: 63%;padding:1px 7px;margin-right: 2px;">i</span>'+menu.ajuda+'</p>';
                        }
                        switch (menu.tipoMenu){                    
                          
                            case 'button':
                                constanteAtualBotao = menu.constante;                                
                                htmlBotoes += '<span id="' + IdBotaoOpcoes + '" data-limpar="'+ menu.constanteALimpar +'" class="imoview-opt btn-chatbot-imoview-'+menu.estilo+' removerAposClickBotao" onclick=\"IMOVIEW.CarregarConversa(' + constanteAtualBotao + ', \'' + IdBotaoOpcoes + '\',\'' + (valoresAnteriores == "" ? 0 : encodeURIComponent(JSON.stringify(valoresAnteriores)).replace(/'/g, '')) + '\', true, false, ' + menu.proximaPagina + ')\" style="">' + menu.nome + '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA2IDc5LjE2NDc1MywgMjAyMS8wMi8xNS0xMTo1MjoxMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjMgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkUyQzQwQzVEOEFERTExRURBRDUwOTg5MzQ1MjJFNUFBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkUyQzQwQzVFOEFERTExRURBRDUwOTg5MzQ1MjJFNUFBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTJDNDBDNUI4QURFMTFFREFENTA5ODkzNDUyMkU1QUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTJDNDBDNUM4QURFMTFFREFENTA5ODkzNDUyMkU1QUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6qJ69sAAAA1ElEQVR42qyWPQoCMRBGo+JhLNSbeAVZEZvFg4iNhdtbWngXexE8hFYWO34W4hKTOH8DD0ISeEwmGRKIKCQYgSu4g1VmD5vcwo6+8QRzi6Qf0nHpjIfgAKqgjYx9ABr6jcrzuD64iDibUqKFt8SckSRttUhaRNXRae69OCPtAxOJLO1iD9pINPOWvDlHkqOkrXBiA8bR3EnSVv6xTdSk9qyJSKCRiAVSiUogkagFXIlJwJGYBSVJz0tQkiy9BKUXP+2MW1CDxvsjMQE38ABr67/rJcAAcOPXUw4ZoCcAAAAASUVORK5CYII=" alt="Right Arrow" style="float: right; width: 16px; height: 16px; margin-left: 2px;"></span>' + htmlAjuda;
                                break;
                            case 'card': //card
                                constanteAtualBotao = menu.constante;                                
                                htmlItens = "";
                                
                                if (menu.itens.length > 0) {
                                    menu.itens.forEach(function (item) {
                                        htmlItens += '<span style="color: #c9c9c9;font-size: 13px;margin-right: 10px;display: inline-block;margin-bottom: 10px;"><strong style="color: #c9c9c9;font-size: 13px !important;border: 2px solid;border-radius: 63%;padding:1px 7px;margin-right: 2px;">i</strong>' + item.label + ': <span style="color: #979797 !important">' + item.valor + '</span></span>';
                                    })
                                }

                                htmlBotoes +=
                                    '<span class="card-chatbot-imoview" style="">' +
                                        '<p style="color: #979797 !important;line-height: 18px !important;margin-bottom: 10px;">' +
                                            menu.nome +
                                        '</p>' +
                                        htmlItens +
                                        htmlAjuda+
                                        '<span class="removerAposClickBotao imoview-opt" data-constante="' + menu.constante + '" data-codigo="' + menu.proximoValor + '" data-label="' + menu.nome + '" id="' + IdBotaoOpcoes + '" onclick=\"IMOVIEW.CarregarConversa(' + constanteAtualBotao + ', \'' + IdBotaoOpcoes + '\',\'' + (valoresAnteriores == "" ? 0 : encodeURIComponent(JSON.stringify(valoresAnteriores))) + '\', false, true )\" >Detalhes<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA2IDc5LjE2NDc1MywgMjAyMS8wMi8xNS0xMTo1MjoxMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjMgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkUyQzQwQzVEOEFERTExRURBRDUwOTg5MzQ1MjJFNUFBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkUyQzQwQzVFOEFERTExRURBRDUwOTg5MzQ1MjJFNUFBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTJDNDBDNUI4QURFMTFFREFENTA5ODkzNDUyMkU1QUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTJDNDBDNUM4QURFMTFFREFENTA5ODkzNDUyMkU1QUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6qJ69sAAAA1ElEQVR42qyWPQoCMRBGo+JhLNSbeAVZEZvFg4iNhdtbWngXexE8hFYWO34W4hKTOH8DD0ISeEwmGRKIKCQYgSu4g1VmD5vcwo6+8QRzi6Qf0nHpjIfgAKqgjYx9ABr6jcrzuD64iDibUqKFt8SckSRttUhaRNXRae69OCPtAxOJLO1iD9pINPOWvDlHkqOkrXBiA8bR3EnSVv6xTdSk9qyJSKCRiAVSiUogkagFXIlJwJGYBSVJz0tQkiy9BKUXP+2MW1CDxvsjMQE38ABr67/rJcAAcOPXUw4ZoCcAAAAASUVORK5CYII=" alt="Right Arrow" style="float: right; width: 16px; height: 16px; margin-left: 2px;"></span>' +
                                        '<div class="imoview-clear"></div>'+
                                    '</span>' +
                                    '<div class="imoview-clear"></div>';
                                    break;
                            case 'cardimovel': //card
                                constanteAtualBotao = menu.constante;                                
                                htmlItens = "";
                                
                                if (menu.itens.length > 0) {
                                    menu.itens.forEach(function (item) {
                                        htmlItens += '<span style="color: #c9c9c9;font-size: 13px;margin-right: 10px;display: inline-block;margin-bottom: 10px;"><strong style="color: #c9c9c9;font-size: 13px !important;border: 2px solid;border-radius: 63%;padding:1px 7px;margin-right: 2px;">i</strong>' + item.label + ': <span style="color: #979797 !important">' + item.valor + '</span></span>';
                                    })
                                }

                                htmlBotoes +=
                                    '<span class="card-chatbot-imoview" style="">' +
                                        '<img style="max-width: 100%; width:100%;max-height: 475px;object-fit: cover;" src="'+(menu.url == "" ? '' : menu.url)+'">'+
                                        '<p style="color: #979797 !important;line-height: 18px !important;margin-bottom: 10px;">' +
                                            menu.nome +
                                        '</p>' +
                                        htmlItens +
                                        htmlAjuda+
                                        '<span class="removerAposClickBotao imoview-opt" data-constante="' + menu.constante + '" data-codigo="' + menu.proximoValor + '" data-label="' + menu.nome + '" id="' + IdBotaoOpcoes + '" onclick=\"IMOVIEW.CarregarConversa(' + constanteAtualBotao + ', \'' + IdBotaoOpcoes + '\',\'' + (valoresAnteriores == "" ? 0 : encodeURIComponent(JSON.stringify(valoresAnteriores))) + '\', false, true )\" >Detalhes<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA2IDc5LjE2NDc1MywgMjAyMS8wMi8xNS0xMTo1MjoxMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjMgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkUyQzQwQzVEOEFERTExRURBRDUwOTg5MzQ1MjJFNUFBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkUyQzQwQzVFOEFERTExRURBRDUwOTg5MzQ1MjJFNUFBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTJDNDBDNUI4QURFMTFFREFENTA5ODkzNDUyMkU1QUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTJDNDBDNUM4QURFMTFFREFENTA5ODkzNDUyMkU1QUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6qJ69sAAAA1ElEQVR42qyWPQoCMRBGo+JhLNSbeAVZEZvFg4iNhdtbWngXexE8hFYWO34W4hKTOH8DD0ISeEwmGRKIKCQYgSu4g1VmD5vcwo6+8QRzi6Qf0nHpjIfgAKqgjYx9ABr6jcrzuD64iDibUqKFt8SckSRttUhaRNXRae69OCPtAxOJLO1iD9pINPOWvDlHkqOkrXBiA8bR3EnSVv6xTdSk9qyJSKCRiAVSiUogkagFXIlJwJGYBSVJz0tQkiy9BKUXP+2MW1CDxvsjMQE38ABr67/rJcAAcOPXUw4ZoCcAAAAASUVORK5CYII=" alt="Right Arrow" style="float: right; width: 16px; height: 16px; margin-left: 2px;"></span>' +
                                        '<div class="imoview-clear"></div>'+
                                    '</span>' +
                                    '<div class="imoview-clear"></div>';
                                    break;
                            case 'details': //card
                                constanteAtualBotao = menu.constante;                                
                                htmlItens = "";
                                
                                if(menu.itens.length >0){
                                    menu.itens.forEach(function(item){
                                        htmlItens += '<span style="color: #c9c9c9;font-size: 13px;margin-right: 10px;display: inline-block;margin-bottom: 10px;"><strong style="color: #c9c9c9;font-size: 13px !important;border: 2px solid;border-radius: 63%;padding:1px 7px;margin-right: 2px;">i</strong>'+item.label+': <span style="color: #979797 !important;line-height: 17px !important;word-break: break-word;">'+item.valor+'</span></span>';
                                    })
                                }

                                htmlBotoes +=
                                    '<span class="card-chatbot-imoview limparChat class="limparChat"" style="">' +
                                        (menu.url != "" ?
                                            '<img style="max-width: 100%; width:100%;max-height: 475px;object-fit: cover;" src="' + menu.url  + '">'
                                            : ''
                                        ) +
                                        '<p style="color: #979797 !important;line-height: 18px !important;margin-bottom: 10px;">'+
                                            menu.nome +
                                        '</p>'+
                                        htmlItens +     
                                        htmlAjuda +
                                    '</span>' ;
                                break
                            case 'select':
                                    constanteAtualBotao = menu.constante;                                    
                                    htmlBotoes += '<span id="' + IdBotaoOpcoes + '"  class="imoview-opt removerAposClickBotao" data-constante="' + menu.constante + '"  data-label="' + menu.nome + '" data-value="' + menu.proximoValor + '" onclick=\"IMOVIEW.CarregarConversa(' + constanteAtual + ', \'' + IdBotaoOpcoes + '\',\'' + (valoresAnteriores == "" ? 0 : encodeURIComponent(JSON.stringify(valoresAnteriores))) + '\', false, false, ' + menu.proximaPagina + ', true)\" style="">' + menu.nome + '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAACzSURBVFiF7Ze9DcIwEEY/owgJpDQwAwOwAxUTsACjUadCFGQGsgkdVYpHAxIopsA6x0Lc6+3v+U7+k5xfBZgCB+AGnIDF2AI73rmkSEwMndaS2tEq8WhBy5CkSqRKzIBzRKIDli7hEi7xlQRQA0egjwy0pAdWz9zXk3AvaSupylsfVZKamEBZSrUg12LmxO+J/DvBwz38r8LLPskYvoqTwi2P4k7SJoRwNZzzM5T+mDhW3AFTPw4c5r4MygAAAABJRU5ErkJggg==" alt="Right Arrow" style="float: right; width: 16px; height: 16px; margin-top: 4px; margin-left: 2px;"></span>' + htmlAjuda;
                                break;
                            case 'input': 
                                propriedades = "";
                                //Inserindo as mascáras
                                switch(menu.tipoMascara){
                                    case 'cpf':
                                        propriedades = 'maxlength="18" onkeyup="IMOVIEW.MascaraMutuario(this, IMOVIEW.CpfCnpj)"  onblur="clearTimeout()"';
                                        break;
                                    case 'telefone':
                                        propriedades = 'maxlength="15" onkeyup="IMOVIEW.MascaraMutuario(this, IMOVIEW.Telefone)"  onblur="clearTimeout()"';
                                        break;
                                    case 'moeda':
                                        propriedades = 'onkeyup="IMOVIEW.MascaraMutuario(this, IMOVIEW.FormatarMoeda)"  onblur="clearTimeout()"';
                                        break;
                                    case 'valor':
                                        propriedades = 'onkeyup="IMOVIEW.MascaraMutuario(this, IMOVIEW.FormatarValor)"  onblur="clearTimeout()"';
                                        break;
                                    case 'cep':
                                        propriedades = 'maxlength="9" onkeyup="IMOVIEW.MascaraMutuario(this, IMOVIEW.FormatarCep)"  onblur="clearTimeout()"';
                                        break;
                                    case 'percentual':
                                        propriedades = 'onkeyup="IMOVIEW.MascaraMutuario(this, IMOVIEW.FormatarPercentual)"  onblur="clearTimeout()"';
                                        break;                                    
                                    case 'inteiro':
                                        propriedades = 'onkeyup="IMOVIEW.MascaraMutuario(this, IMOVIEW.FormatarInteiro)"  onblur="clearTimeout()"';
                                        break;                                    
                                    default:
                                        propriedades = "";
                                        break;
                                }
                                htmlInput += '<input onkeypress="javascript: if(event.keyCode == 13) IMOVIEW.CarregarConversa('+constanteAtual+', \'' + idInput + '\' ,\'' +(valoresAnteriores == "" ? 0 : encodeURIComponent(JSON.stringify(valoresAnteriores))) +'\');" class="limparChat input-chat"  id="'+idInput+'" value="'+menu.valorPadrao+'" '+propriedades+' data-constante="'+menu.constante+'" type="text"  autocomplete="name" placeholder="'+menu.nome+'" list="" style="border-color: rgb(76, 175, 80);"><div class="imoview-submit" onclick=\"IMOVIEW.CarregarConversa('+constanteAtual+', \'' + idInput + '\' ,\'' +(valoresAnteriores == "" ? 0 : encodeURIComponent(JSON.stringify(valoresAnteriores))) +'\')\"></div>'+ htmlAjuda;                        
                                break
                            case 'textarea':
                                htmlInput += '<textarea onkeypress="javascript: if(event.keyCode == 13) IMOVIEW.CarregarConversa('+constanteAtual+', \'' + idInput + '\' ,\'' +(valoresAnteriores == "" ? 0 : encodeURIComponent(JSON.stringify(valoresAnteriores))) +'\');" class="limparChat input-chat"  id="' + idInput + '"  data-constante="' + menu.constante + '" placeholder="' + menu.nome + '" style="border-color: rgb(76, 175, 80);">'+menu.valorPadrao+'</textarea><div class="imoview-submit" onclick=\"IMOVIEW.CarregarConversa(' + constanteAtual + ', \'' + idInput + '\' ,\'' + (valoresAnteriores == "" ? 0 : encodeURIComponent(JSON.stringify(valoresAnteriores))) + '\')\"></div>' + htmlAjuda;
                                break;
                            case 'password':
                                htmlInput += '<input  onkeypress="javascript: if(event.keyCode == 13) IMOVIEW.CarregarConversa('+constanteAtual+', \'' + idInput + '\' ,\'' +(valoresAnteriores == "" ? 0 : encodeURIComponent(JSON.stringify(valoresAnteriores))) +'\');" class="limparChat input-chat" id="' + idInput + '" value="" data-constante="' + menu.constante + '" type="password" autocomplete="name" onblur="clearTimeout()" placeholder="' + menu.nome + '" list="" style="border-color: rgb(76, 175, 80);"><div class="imoview-submit" onclick=\"IMOVIEW.CarregarConversa(' + constanteAtual + ', \'' + idInput + '\' ,\'' + (valoresAnteriores == "" ? 0 : encodeURIComponent(JSON.stringify(valoresAnteriores))) + '\')\"></div>' + htmlAjuda;
                                break;
                            case 'file': 
                                htmlBotoes += '<span class="card-chatbot-imoview limparChat" style="display: inline-block;border-radius: 24px!important;margin-left: 12px;margin: 6px 6px 0 0; background: #e3e9ef !important;margin-bottom: 8px;color: #6e6e6e !important;padding: 15px;font-size: 13px !important;"><p style="color: #979797 !important;line-height: 18px !important;">'+menu.nome+'</p><a href="'+menu.url+'" target="_blank" download="'+menu.nome+'" class="imoview-opt">Download<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAACzSURBVFiF7Ze9DcIwEEY/owgJpDQwAwOwAxUTsACjUadCFGQGsgkdVYpHAxIopsA6x0Lc6+3v+U7+k5xfBZgCB+AGnIDF2AI73rmkSEwMndaS2tEq8WhBy5CkSqRKzIBzRKIDli7hEi7xlQRQA0egjwy0pAdWz9zXk3AvaSupylsfVZKamEBZSrUg12LmxO+J/DvBwz38r8LLPskYvoqTwi2P4k7SJoRwNZzzM5T+mDhW3AFTPw4c5r4MygAAAABJRU5ErkJggg==" alt="Right Arrow" style="float: right; width: 16px; height: 16px; margin-top: 4px; margin-left: 2px;"></a></span>' + htmlAjuda;
                                break;
                            case 'alert':  
                                IMOVIEW.RetornandoAlert(menu.estilo, menu.nome);                                                                              
                                break;
                        }
                    });
                        
                        
                        IMOVIEW.RemoverLoading();
                        IMOVIEW.RetornarHtmlMensagemPrincipal(titulo, htmlBotoes);
                        
                        // document.querySelector('.imoview-scrollable').lastElementChild.insertAdjacentHTML("afterend", htmlPrincipalAlert);
                        // document.querySelector('.imoview-group').insertAdjacentHTML("afterend", htmlBotoes);
                        document.querySelector('.imoview-input').innerHTML = "";
                        document.querySelector('.imoview-input').innerHTML = htmlInput;
                    
                        
                    if(constanteAtual > 0 && IMOVIEW.Maximado == false){
                        document.querySelector('.imoview-conversation').style.maxHeight = "550px"
                    } 
                        
                    IMOVIEW.ScrollBottom();
                    
                    if (document.querySelector('.input-chat') != null) {
                        document.querySelector('.input-chat').focus();
                    }

                    }catch (e){
                    console.log(e);
                        IMOVIEW.RetornandoAlert('danger', e.message, true);                                                
                    }
                });

              document.querySelector('.imoview-scrollable').onscroll = (scrool) => {
                    IMOVIEW.ScrollBar();
                  
              }
            // tratar a response
          }); 
        
        
    },
    Loading: function () {
         htmlLoading = 
            '<div class="imoview-group imoview-left loading-chat">'+
                '<div class="imoview-msg-avatar"><img class="imoview-img" src="'+localStorage.getItem("chatBotImoviewAvatarUrl")+'" alt="Avatar"></div>'+
                '<div class="imoview-container">'+
                '<div class="imoview-msg">'+
                    '<div class="imoview-bubble">'+
                        '<div>'+
                            '<div class="imoview-typing-indicator"><span style="background: rgb(170, 170, 170);"></span><span style="background: rgb(170, 170, 170);"></span><span style="background: rgb(170, 170, 170);"></span></div>'+
                            '<div class="imoview-clear"></div>'+
                        '</div>'+
                    '</div>'+                
                '</div>'+
                '</div>'+
                '<div class="imoview-clear"></div>'+
            '</div>';
            document.querySelector('.imoview-scrollable').lastElementChild.insertAdjacentHTML("afterend", htmlLoading);
    },
    RemoverLoading: function () {
        loadingPagina = document.querySelectorAll('.loading-chat');
        loadingPagina.forEach(function(loadingPag){
            loadingPag.remove();
        });
    },
    RetonarSelecionado: function (texto = "", selecionadoOuResposta = "Selecionado") {        
        htmlSelecionado = '<div class="imoview-group imoview-right"><div class="imoview-container"><div class="imoview-msg"><div class="imoview-bubble" style="background: #4c4c4c;color: white !important;"><div><div><p style="color:white !important;">'+selecionadoOuResposta+': '+texto+'</p></div><div class="imoview-clear"></div></div></div></div></div><div class="imoview-clear"></div></div>';
        botoesNaTela = document.querySelectorAll('.removerAposClickBotao');
        botoesNaTela.forEach(function(botaoNaTela){
            botaoNaTela.remove()
        });
        document.querySelector('.imoview-scrollable').lastElementChild.insertAdjacentHTML("afterend", htmlSelecionado);  
    },
    RetornandoAlert: function (tipo, mensagem, retornarBotaoVoltarPrincipal = false) {
       htmlAlert = 
            '<div class="imoview-group imoview-left chat-alert-'+tipo+'">'+
                '<div class="imoview-msg-avatar"><img class="imoview-img" src="'+localStorage.getItem("chatBotImoviewAvatarUrl")+'" alt="Avatar"></div>'+
                    '<div class="imoview-container">'+
                        '<div class="imoview-msg">'+
                            '<div class="imoview-bubble">'+
                                '<div>'+
                                    '<div>'+
                                    '<p>'+ mensagem +'</p>'+
                                    '</div>'+
                                    '<div class="imoview-clear"></div>'+
                                '</div>'+
                        '</div>' +
                        (retornarBotaoVoltarPrincipal ? 
                            '<span id="botaoErroDirecionar" class="imoview-opt btn-chatbot-imoview-dark removerAposClickBotao" onclick=\"IMOVIEW.CarregarConversa(0,\'botaoErroDirecionar\',0, true )\" style="">Voltar ao menu principal<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAACzSURBVFiF7Ze9DcIwEEY/owgJpDQwAwOwAxUTsACjUadCFGQGsgkdVYpHAxIopsA6x0Lc6+3v+U7+k5xfBZgCB+AGnIDF2AI73rmkSEwMndaS2tEq8WhBy5CkSqRKzIBzRKIDli7hEi7xlQRQA0egjwy0pAdWz9zXk3AvaSupylsfVZKamEBZSrUg12LmxO+J/DvBwz38r8LLPskYvoqTwi2P4k7SJoRwNZzzM5T+mDhW3AFTPw4c5r4MygAAAABJRU5ErkJggg==" alt="Right Arrow" style="float: right; width: 16px; height: 16px; margin-top: 4px; margin-left: 2px;"></span>'
                        : '') +
                        '</div>'+
                    '</div>'+
                '<div class="imoview-clear"></div>'+
            '</div>';    
        document.querySelector('.imoview-scrollable').lastElementChild.insertAdjacentHTML("afterend", htmlAlert); 
        IMOVIEW.ScrollBottom();
    },
    
    RetornarHtmlMensagemPrincipal: function (mensagem, botoes) {
        htmlMensagemPrincipal = 
            '<div class="imoview-group imoview-left">'+
                '<div class="imoview-msg-avatar"><img class="imoview-img" src="'+localStorage.getItem("chatBotImoviewAvatarUrl")+'" alt="Avatar"></div>'+
                    '<div class="imoview-container">'+
                        '<div class="imoview-msg">' +
                            (mensagem != null ?
                                '<div class="imoview-bubble">'+
                                    '<div>'+
                                        '<div>'+
                                        '<p>'+ mensagem +'</p>'+
                                        '</div>'+
                                        '<div class="imoview-clear"></div>'+
                                    '</div>'+
                                '</div>' +
                                '<div class="imoview-clear"></div>' : '')+
                            // htmlAlert+                                    
                            botoes+
                        '</div>'+
                    '</div>'+
                '<div class="imoview-clear"></div>'+
            '</div>';

            document.querySelector('.imoview-scrollable').lastElementChild.insertAdjacentHTML("afterend", htmlMensagemPrincipal);
    },

    MostrarConversacao:  function(){
        var ho = "imoview-hidden-slide",
        fo = "imoview-shown-slide",
        yo = "imoview-nodisplay";

        conversacaoSeletor.classList.remove(ho);
        conversacaoSeletor.classList.remove(yo);
        conversacaoSeletor.classList.add(fo);

        fecharConversaSeletor = document.querySelector(".botaoFechar");                
        fecharConversaSeletor.addEventListener("click", IMOVIEW.EsconderConversacao);
        
        IMOVIEW.CarregarConversa();
   
    },
    EsconderConversacao:  function(){
        var ho = "imoview-hidden-slide",
        ka = "imoview-nodisplay",
        fo = "imoview-shown-slide";

        conversacaoSeletor.classList.remove(fo);
        conversacaoSeletor.classList.add(ho);
        conversacaoSeletor.classList.add(ka);
        
        abrirConversaSeletor = document.querySelector(".imoview-chatbot-invite-message, .imoview-avatar");                
        abrirConversaSeletor.addEventListener("click", IMOVIEW.MostrarConversacao);

    },
    PressionarEnter: function (e) {
         if(e.which == 13){
          console.log('a tecla enter foi pressionada');
       }
    },

    MaximarJanelaChat: function () {
        document.querySelector('.imoview-conversation').style.width = "90%";
        document.querySelector('.imoview-conversation').style.maxHeight = "initial";
        document.querySelector('.imoview-conversation').style.transition = "width 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28) 0s";
        document.querySelector('.botaoMaximar').removeEventListener("click", IMOVIEW.MaximarJanelaChat);
        document.querySelector('.botaoMaximar').addEventListener("click", IMOVIEW.MinimizarJanelaChat);
        IMOVIEW.Maximado = true;
    },

    MinimizarJanelaChat: function () {
        document.querySelector('.imoview-conversation').style.width = "";
        document.querySelector('.imoview-conversation').style.maxHeight = "";
        document.querySelector('.imoview-conversation').style.transition = "width 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28) 0s";
        document.querySelector('.botaoMaximar').removeEventListener("click", IMOVIEW.MinimizarJanelaChat);
        document.querySelector('.botaoMaximar').addEventListener("click", IMOVIEW.MaximarJanelaChat);
        IMOVIEW.ScrollBottom();
        IMOVIEW.Maximado = false;
    },

  
    ScrollBottom: function(){
        document.querySelector('.imoview-scrollable').scrollTo(0, document.querySelector('.imoview-scrollable').scrollHeight);
    },
    ScrollBar: function(){
          var t = document.querySelector('.imoview-scrollable').scrollTop,
                        n = document.querySelector('.imoview-scrollable').offsetHeight,
                        e = document.querySelector('.imoview-scrollable').scrollHeight;
                    if (e < n) return;
                    var i = e / n;
                    (document.querySelector('.imoview-handle').style.height = n / i + "px"), (document.querySelector('.imoview-handle').style.top = t / i + "px");
    },
    ReplaceCaracteresEspeciais: function(str){        
        return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
            return '%' + c.charCodeAt(0).toString(16);
        });        
    },
    ScrollIndicador: function(){
        let indicador = document.querySelector('.indicador');
        let altura =   document.querySelector('.imoview-scrollable').scrollHeight - innerHeight;
        document.querySelector('.imoview-scrollable').onscroll = ()=>{
            let progresso = window.pageYOffset / altura * 100;
            indicador.style.width = progresso + "%";
        }
    },
    Exec: function(param, objId) {

        // IMOVIEW.RemoveSpecialCaracter(param);

        var enc = encodeURIComponent(JSON.stringify(param));
        var dataTmp1 = decodeURIComponent(JSON.stringify(enc));
        dataTmp1 = dataTmp1.substr(1, dataTmp1.length - 2);
        var data = JSON.parse(dataTmp1);

        var html = "";
        var elId = IMOVIEW.GenareateId();
        var htmlTemp = "<div id=\"" + elId + "\">...</div>";
        document.write(htmlTemp);
        
      

     
        var elemento = document.getElementById(elId);
        
        var style = '<style>.imoview-input input,textarea{border-color: '+data.corFundo+' !important}.imoview-submit{background-color: '+data.corFundo+'}.imoview-opt{background: '+data.corFundo+';}.imoview-chatbot .imoview-handle{background: '+data.corFundo+' !important;}.imoview-chatbot .imoview-sel.imoview-messages>.imoview-opt{background-image: none !important; background-color: '+data.corFundo+';}.imoview-conversation-header{background-color:'+data.corFundo+';}.imoview-infobar .imoview-avatar::after{border: 2px solid '+data.corFundo+'!important;}.imoview-avatar{background-color:'+data.corFundo+'; background-image: url('+data.avatarUrlChat+');}</style>';
        
        if(data.posicao == '' || data.posicao == 'direito'){
            lado = 'imoview-lado-right';
        }else{
            lado = 'imoview-lado-left';
        }
        var mensagem = data.mensagemChatFechado;
        var nomeHeaderChat = data.nomeHeaderChat;
        var avatarUrlChat = data.avatarUrlChat;
        
        localStorage.setItem("chatBotImoviewAvatarUrl", avatarUrlChat);
        
        fetch(IMOVIEW.UrlHtml).then((response) => {
            response.text().then((text) => { 
                text = text.replace('{{ estilizacao }}',style); // coloca o que vem do parametro               
                text = text.replace('{{ lado }}', lado); // coloca o que vem do parametro               
                text = text.replace('{{ mensagem }}', mensagem); // coloca o que vem do parametro               
                text = text.replace('{{ nomeChat }}', nomeHeaderChat); // coloca o que vem do parametro               
                text = text.replace('{{ urlAvatar }}', avatarUrlChat); // coloca o que vem do parametro               
                elemento.innerHTML = text;
                conversacaoSeletor = document.querySelector(".imoview-conversation");
                
                abrirConversaSeletor = document.querySelector(".imoview-chatbot-invite-message, .imoview-avatar");                
                abrirConversaSeletor.addEventListener("click", IMOVIEW.MostrarConversacao);


             
            });
          });
    },


    GenareateId: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    ReplaceAll: function(str, find, replace) {
        return str.replace(new RegExp(IMOVIEW.EscapeRegExp(find), 'g'), replace);
    },

    EscapeRegExp: function(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    },

    

    

};
