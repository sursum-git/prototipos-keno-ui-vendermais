(function ($) {
    // OBS: o patch do $.contains já está no menu principal.

    const LS_LAST_KEY = "consultaFiltro02:last";

    function nowPtBr() {
        try {
            return new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "medium" });
        } catch (e) {
            return new Date().toLocaleString();
        }
    }

    function safeParse(json, fallback) {
        try { return JSON.parse(json); } catch (e) { return fallback; }
    }

    function collectFilters() {
        const texto = $("#fTexto").data("kendoTextBox")?.value() ?? "";
        const cnpj = $("#fCnpj").data("kendoMaskedTextBox")?.value() ?? "";
        const valorMin = $("#fValorMin").data("kendoNumericTextBox")?.value() ?? null;

        const dtIni = $("#fDtIni").data("kendoDatePicker")?.value() ?? null;
        const dtFim = $("#fDtFim").data("kendoDatePicker")?.value() ?? null;

        const status = $("#fStatus").data("kendoDropDownList")?.value() ?? "";
        const vendedor = $("#fVendedor").data("kendoComboBox")?.value() ?? "";

        const tags = $("#fTags").data("kendoMultiSelect")?.value() ?? [];

        const somenteAtivos = $("#fSomenteAtivos").data("kendoSwitch")?.check() ?? false;
        const incluirArquivados = $("#fIncluirArquivados").is(":checked");

        const prioridade = $("input[name='fPrioridade']:checked").val() || "";


        const score = $("#fScore").data("kendoSlider")?.value() ?? 0;

        return {
            texto,
            cnpj,
            valorMin,
            dtIni: dtIni ? dtIni.toISOString() : null,
            dtFim: dtFim ? dtFim.toISOString() : null,
            status,
            vendedor,
            tags,
            somenteAtivos,
            incluirArquivados,
            prioridade,
            score,
            _savedAt: new Date().toISOString()
        };
    }

    function applyFilters(payload) {
        payload = payload || {};

        $("#fTexto").data("kendoTextBox")?.value(payload.texto ?? "");
        $("#fCnpj").data("kendoMaskedTextBox")?.value(payload.cnpj ?? "");
        $("#fValorMin").data("kendoNumericTextBox")?.value(payload.valorMin ?? null);

        $("#fDtIni").data("kendoDatePicker")?.value(payload.dtIni ? new Date(payload.dtIni) : null);
        $("#fDtFim").data("kendoDatePicker")?.value(payload.dtFim ? new Date(payload.dtFim) : null);

        $("#fStatus").data("kendoDropDownList")?.value(payload.status ?? "");
        $("#fVendedor").data("kendoComboBox")?.value(payload.vendedor ?? "");

        $("#fTags").data("kendoMultiSelect")?.value(Array.isArray(payload.tags) ? payload.tags : []);

        $("#fSomenteAtivos").data("kendoSwitch")?.check(!!payload.somenteAtivos);
        $("#fIncluirArquivados").prop("checked", !!payload.incluirArquivados);

        if (payload.prioridade) {
            $("input[name='fPrioridade'][value='" + payload.prioridade + "']").prop("checked", true).trigger("change");
        } else {
            $("input[name='fPrioridade']").prop("checked", false).trigger("change");
        }

        // score (Slider simples)
        const sw = $("#fScore").data("kendoSlider");
        if (sw) sw.value(Number(payload.score ?? 0));
    }

    function saveLast(payload) {
        localStorage.setItem(LS_LAST_KEY, JSON.stringify(payload));
    }

    function loadLast() {
        return safeParse(localStorage.getItem(LS_LAST_KEY), null);
    }

    function openRecoverWindow() {
        const last = loadLast();

        if (!last) {
            kendo.alert("Ainda não existe 'Último filtro'. Clique em Pesquisar primeiro.");
            return;
        }

        const $wnd = $("<div />");

        $wnd.html(
            '<div style="padding:12px;">' +
            '<div style="font-size:12px; opacity:.75; margin-bottom:10px;">' +
            'Último filtro salvo automaticamente em: <b>' +
            kendo.htmlEncode(new Date(last._savedAt || Date.now()).toLocaleString("pt-BR")) +
            "</b></div>" +
            '<div style="display:flex; gap:10px; justify-content:flex-end; margin-top:12px;">' +
            '<button id="btnClearLast">Limpar</button>' +
            '<button id="btnApplyLast">Aplicar</button>' +
            '<button id="btnCloseRecover">Fechar</button>' +
            "</div>" +
            "</div>"
        );

        const win = $wnd.kendoWindow({
            title: "Recuperar filtro",
            modal: true,
            visible: false,
            width: Math.min(560, window.innerWidth - 24),
            maxHeight: Math.min(320, window.innerHeight - 24),
            actions: ["Close"],
            close: function () { this.destroy(); }
        }).data("kendoWindow");

        $("#btnApplyLast", $wnd).kendoButton({
            icon: "check",
            themeColor: "primary",
            click: function () {
                applyFilters(last);
                win.close();
            }
        });

        $("#btnClearLast", $wnd).kendoButton({
            icon: "trash",
            click: function () {
                localStorage.removeItem(LS_LAST_KEY);
                kendo.alert("Último filtro apagado.");
                win.close();
            }
        });

        $("#btnCloseRecover", $wnd).kendoButton({
            click: function () { win.close(); }
        });

        win.center().open();
    }

    function initWidgets() {
        kendo.culture("pt-BR");

        $("#entryTime").text(nowPtBr());

        $("#fTexto").kendoTextBox({ placeholder: "Ex: cliente, pedido, descrição..." });

        $("#fCnpj").kendoMaskedTextBox({ mask: "00.000.000/0000-00" });

        $("#fValorMin").kendoNumericTextBox({ format: "c2", decimals: 2, min: 0 });

        $("#fDtIni").kendoDatePicker({ format: "dd/MM/yyyy" });
        $("#fDtFim").kendoDatePicker({ format: "dd/MM/yyyy" });

        $("#fStatus").kendoDropDownList({
            optionLabel: "Selecione...",
            dataTextField: "text",
            dataValueField: "value",
            dataSource: [
                { text: "Aberto", value: "aberto" },
                { text: "Em andamento", value: "andamento" },
                { text: "Concluído", value: "concluido" },
                { text: "Cancelado", value: "cancelado" }
            ]
        });

        $("#fVendedor").kendoComboBox({
            placeholder: "Digite para buscar...",
            suggest: true,
            dataSource: ["Ana", "Bruno", "Carlos", "Daniela", "Eduardo", "Fernanda"]
        });

        $("#fTags").kendoMultiSelect({
            placeholder: "Selecione tags...",
            dataSource: ["Urgente", "VIP", "Revisar", "Sem estoque", "Atrasado", "Novo cliente"]
        });

        $("#fSomenteAtivos").kendoSwitch({
            checked: true,
            messages: { checked: "Sim", unchecked: "Não" }
        });

        $("#fIncluirArquivados")
            .attr("type", "checkbox")
            .after('<label for="fIncluirArquivados" style="margin-left:8px; cursor:pointer;">Incluir arquivados</label>');

        $("#fPrioridade").html(
            '<label style="margin-right:14px;"><input type="radio" name="fPrioridade" value="baixa"> Baixa</label>' +
            '<label style="margin-right:14px;"><input type="radio" name="fPrioridade" value="media"> Média</label>' +
            '<label style="margin-right:14px;"><input type="radio" name="fPrioridade" value="alta"> Alta</label>'
        );

        // ✅ Score: Slider simples (RangeSlider estava estourando com "type" em alguns builds)
        $("#fScore").kendoSlider({
            min: 0,
            max: 100,
            smallStep: 1,
            largeStep: 10,
            showButtons: true,
            value: 50
        });

        $("#btnPesquisar").kendoButton({
            icon: "search",
            themeColor: "primary",
            click: function () {
                const payload = collectFilters();
                saveLast(payload);
                // Aqui entra sua consulta real (API/DataSource)
            }
        });

        $("#btnRecuperarFiltro").kendoButton({
            icon: "folder-open",
            click: function () { openRecoverWindow(); }
        });

        const last = loadLast();
        if (last) applyFilters(last);
    }

    window.consulta_filtro_02_init = function () {
        initWidgets();
    };

})(jQuery);
