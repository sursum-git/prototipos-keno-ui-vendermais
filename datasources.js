let itensMenu = [
    {item:1,titulo:"Início",url:"#"},
    {item:2,titulo:"Vendas",url:"#",items:
    [
        {item:2-1,titulo:"Leads",url:"#"},
        {item:2-2,titulo:"Pedidos em aberto",url:"#"},
        {item:2-3,titulo:"Pedidos no tempo",url:"#"},
        {item:2-4,titulo:"Pedidos Com Pendência",url:"#"},
        {item:2-5,titulo:"Carrinho",url:"#"}
    ]
    },
    {item:3,titulo:"NFs",url:"#"},
    {item:4,titulo:"Produtos",url:"#",items:
    [
        {item:4-1,titulo:"Estoque Unificado",url:"#"},
        {item:4-2,titulo:"Estoque PI",url:"#"},
        {item:4-3,titulo:"Estoque PE",url:"#"},
        {item:4-4,titulo:"Em Promoção",url:"#"}
    ]},
    {item:5,titulo:"Notícias",url:"#"},
    {item:10,titulo:"Títulos",url:"#"}
];
/*let localDataSource = new kendo.data.HierarchicalDataSource(
    { data:itensMenu,
    dataTextField:"titulo",
    animation:{
        open:{effects:"slideIn:up"}
    },
    });
localDataSource.load();*/
