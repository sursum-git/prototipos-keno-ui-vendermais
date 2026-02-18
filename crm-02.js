window.crm02_init = function () {

    // registra comando antes (mais seguro)
    kendo.ui.taskboard.commands["CustomAddCardCommand"] =
        kendo.ui.taskboard.Command.extend({
            exec: function () {
                this.taskboard.addCard({
                    status: "doing",
                    title: "Add Title",
                    description: "Add Description",
                    category: "green"
                });
                this.taskboard.dataSource.sync();
            }
        });

    $("#taskBoard").kendoTaskBoard({
    toolbar: {
    items: [
{ name: "addColumn",text:"Nível Acompanhamento", icon: "plus-circle" },
{ type: "button", name: "addCard", text: "Novo Cliente", command: "CustomAddCardCommand", icon: "plus", showText: true },
    "spacer",
    "search"
    ]
},
    dataOrderField: "order",
    dataSource: [
{ id: 1, order: 1, title: "Novo Milenio Tecidos",  description: "Entrar em contato pelo numero xxxxxxx para venda de renda",  status: "OPORTUNIDADE", category: "green" },
{ id: 2, order: 2, title: "Sindicato Têxtil de São Bernardo", description: "tentar contato om indicação do Carlos", status: "OPORTUNIDADE", category: "green" },
{ id: 3, order: 3, title: "Moda Silva",  description: "Oferecer novamente o book novo por whatsapp",  status: "A RETORNAR",   category: "red" },
{ id: 4, order: 4, title: "C&S", description: "Tentar desbloquear 100 metros do tecido 562512 ref.001", status: "A RETORNAR",   category: "red" },
{ id: 5, order: 5, title: "J.R.",  description: "Fazer solicitação de devolução do tecido 5487654 que encolheu demais",  status: "POS-VENDA",    category: "blue" }
    ],
    columns: [
{ text: "OPORTUNIDADE",   status: "OPORTUNIDADE" },
{ text: "A RETORNAR", status: "A RETORNAR" },
{ text: "PÓS-VENDA",    status: "POS-VENDA" }
    ]
});
};
