const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let tissue_counter = $$(".tecido").length;
let extra_counter = $$(".item_extra").length;

let chartCounter = 0;

let currentChartInstance = null;

// Classes
const tecidos = $(".tecidos");
const extras = $(".itens_extras");

// Buttons
const add_tecido = $("#add_tecido");
const add_extra = $("#add_extra");

const calc_cost = $("#calc_cost");

// HTML Elements
const output = $("#output");

add_tecido.addEventListener("click", add_new_tissue);
add_extra.addEventListener("click", add_new_extra);

function add_new_tissue() {
    tissue_counter++;

    let new_form = document.createElement("form");
    new_form.classList.add(`tecido${tissue_counter}`);
    new_form.classList.add("tecido");

    let new_tissue = `
        <fieldset>
            <legend>Tecido ${tissue_counter}</legend>
            <div>
                <label for="nome_tecido">Nome do tecido</label>
                <input type="text" id="nome_tecido" placeholder="Digite o nome do tecido">
            </div>
            <div>
                <label for="largura_tecido">Largura do Tecido (em cm)</label>
                <input type="number" id="largura_tecido" placeholder="Digite a largura do tecido">
            </div>
            <div>
                <label for="comprimento_tecido">Comprimento do Tecido (em cm)</label>
                <input type="number" id="comprimento_tecido" placeholder="Digite o comprimento do tecido">
            </div>
            <div>
                <label for="preco_tecido">Preço pago no Tecido (R$)</label>
                <input type="number" id="preco_tecido" placeholder="Digite o preço pago no tecido">
            </div>
            <div>
                <label for="largura_retirada_tecido">Largura da Área Retirada (em cm)</label>
                <input type="number" id="largura_retirada_tecido" placeholder="Digite a largura retirada">
            </div>
            <div>
                <label for="comprimento_retirado_tecido">Comprimento da Área Retirada (em cm)</label>
                <input type="number" id="comprimento_retirado_tecido" placeholder="Digite o comprimento retirado">
            </div>
        </fieldset>
    `

    new_form.innerHTML = new_tissue;

    tecidos.appendChild(new_form);

    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Novo tecido criado com sucesso!",
        showConfirmButton: true,
        timer: 1500,
        timerProgressBar: true
    });
}

function add_new_extra() {
    extra_counter++;

    let new_form = document.createElement("form");
    new_form.classList.add(`item_extra${extra_counter}`);
    new_form.classList.add("item_extra");

    let new_extra = `
            <fieldset>
                <legend>Item Extra ${extra_counter}</legend>
                <div>
                    <label for="nome_item">Nome do Item</label>
                    <input type="text" id="nome_item" placeholder="Digite o nome do item">
                </div>
                <div>
                    <label for="tipo_unidade">Este item é comprado em Metros ou Unidades?</label>
                    <select id="tipo_unidade" onchange="updateExtra(this);">
                        <option value="null" disabled selected>Escolha a opção</option>
                        <option value="cm">Centímetros</option>
                        <option value="unidade">Unidades</option>
                    </select>
                </div>
            </fieldset>
    `;

    new_form.innerHTML = new_extra;

    extras.appendChild(new_form);

    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Novo item extra criado com sucesso!",
        showConfirmButton: true,
        timer: 1500,
        timerProgressBar: true
    });
}

function updateExtra(e) {
    let new_html = "";

    if (e.value === "cm") {
        new_html = `
                <div>
                    <label for="quantity_bought">Quantidade comprada (em cm)</label>
                    <input type="number" id="quantity_bought" placeholder="Digite a quantidade comprada">
                </div>
                <div>
                    <label for="total_price">Valor pago no total (R$)</label>
                    <input type="number" id="total_price" placeholder="Digite o valor total">
                </div>
                <div>
                    <label for="quantity_used">Quantidade utilizada (em cm)</label>
                    <input type="number" id="quantity_used" placeholder="Digite a quantidade utilizada">
                </div>
        `;
    } else if (e.value === "unidade") {
        new_html = `
                <div>
                    <label for="quantity_bought">Quantidade comprada (em unidades)</label>
                    <input type="number" id="quantity_bought" placeholder="Digite a quantidade em unidades">
                </div>
                <div>
                    <label for="total_price">Valor pago no total (R$)</label>
                    <input type="number" id="total_price" placeholder="Digite o valor total">
                </div>
                <div>
                    <label for="quantity_used">Quantidade utilizada (em unidades)</label>
                    <input type="number" id="quantity_used" placeholder="Digite a quantidade utilizada">
                </div>
        `;
    }
    else {
        return;
    }

    e.parentElement.parentElement.insertAdjacentHTML("beforeend", new_html);

    e.disabled = true;
}

calc_cost.addEventListener("click", calculate_cost);

function calculate_cost() {
    const tissue_quantity = $$(".tecido").length;
    const extra_quantity = $$(".item_extra").length;

    const items = {
        tissues: {},
        extra: {},
        final_ajusts: {
            worker_cost: $("#valor_mao_obra").value,
            profit_percent: $("#porcentagem_lucro").value
        }
    };

    if (tissue_quantity > 0) {
        let tissues = $$(".tecido");

        for (let i = 0; i < tissues.length; i++) {
            let tissueInfo = {
                name: tissues[i].querySelector("#nome_tecido").value,
                width: tissues[i].querySelector("#largura_tecido").value,
                length: tissues[i].querySelector("#comprimento_tecido").value,
                price: tissues[i].querySelector("#preco_tecido").value,
                width_cut: tissues[i].querySelector("#largura_retirada_tecido").value,
                length_cut: tissues[i].querySelector("#comprimento_retirado_tecido").value
            };

            for (key in tissueInfo) {
                if ((isNaN(tissueInfo[key]) && key != "name") || tissueInfo[key] === "") {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Houve um erro, verifique se os tecidos foram configurados corretamente."
                    });
                    return;
                }
            }

            items.tissues[String(i)] = {
                name: tissues[i].querySelector("#nome_tecido").value,
                width: tissues[i].querySelector("#largura_tecido").value,
                length: tissues[i].querySelector("#comprimento_tecido").value,
                price: tissues[i].querySelector("#preco_tecido").value,
                width_cut: tissues[i].querySelector("#largura_retirada_tecido").value,
                length_cut: tissues[i].querySelector("#comprimento_retirado_tecido").value
            };
        }
    }

    if (extra_quantity > 0) {
        let extra_items = $$(".item_extra");

        for (let i = 0; i < extra_items.length; i++) {
            if (extra_items[i].querySelector("#tipo_unidade").value != "cm" && extra_items[i].querySelector("#tipo_unidade").value != "unidade") {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Houve um erro, verifique se os itens extras foram configurados corretamente."
                });
                return;
            }

            let extraItemInfo = {
                name: extra_items[i].querySelector("#nome_item").value,
                unit_type: extra_items[i].querySelector("#tipo_unidade").value,
                quantity_bought: extra_items[i].querySelector("#quantity_bought").value,
                total_price: extra_items[i].querySelector("#total_price").value,
                quantity_used: extra_items[i].querySelector("#quantity_used").value
            };

            for (key in extraItemInfo) {
                if ((key != "name" && key != "unit_type") && (isNaN(extraItemInfo[key]) || extraItemInfo[key] === "")) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Houve um erro, verifique se os itens extras foram configurados corretamente."
                    });
                    return;
                }
            }

            items.extra[String(i)] = {
                name: extra_items[i].querySelector("#nome_item").value,
                unit_type: extra_items[i].querySelector("#tipo_unidade").value,
                quantity_bought: extra_items[i].querySelector("#quantity_bought").value,
                total_price: extra_items[i].querySelector("#total_price").value,
                quantity_used: extra_items[i].querySelector("#quantity_used").value
            };
        }
    }

    if ((isNaN(items.final_ajusts.worker_cost) || items.final_ajusts.worker_cost === "") || (isNaN(items.final_ajusts.profit_percent) || items.final_ajusts.profit_percent === "")) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Houve um erro, verifique se os ajustes finais foram configurados corretamente."
        });
        return;
    }

    let tissues_total_cost = 0;
    let extra_items_total_cost = 0;
    let worker_cost = items.final_ajusts.worker_cost;
    let profit_percent = items.final_ajusts.profit_percent;

    let final_price = 0;

    for (key in items.tissues) {
        let currentTissue = items.tissues[key];
        tissues_total_cost += ((Number(currentTissue.width_cut) * Number(currentTissue.length_cut)) * (Number(currentTissue.price) / (Number(currentTissue.width) * Number(currentTissue.length)))) || 0;

        /*
            name: tissues[i].querySelector("#nome_tecido").value,
            width: tissues[i].querySelector("#largura_tecido").value,
            length: tissues[i].querySelector("#comprimento_tecido").value,
            price: tissues[i].querySelector("#preco_tecido").value,
            width_cut: tissues[i].querySelector("#largura_retirada_tecido").value,
            length_cut: tissues[i].querySelector("#comprimento_retirado_tecido").value
        */
    }

    for (key in items.extra) {
        let currentExtraItem = items.extra[key];

        extra_items_total_cost += (Number(currentExtraItem.quantity_used) * (Number(currentExtraItem.total_price) / Number(currentExtraItem.quantity_bought))) || 0;

        /*
                name: extra_items[i].querySelector("#nome_item").value,
                unit_type: extra_items[i].querySelector("#tipo_unidade").value,
                quantity_bought: extra_items[i].querySelector("#quantity_bought").value,
                total_price: extra_items[i].querySelector("#total_price").value,
                quantity_used: extra_items[i].querySelector("#quantity_used").value
        */
    }

    let tissue_total_cost_p = document.createElement("p");
    tissue_total_cost_p.innerHTML = `<strong>Custo Total dos Tecidos: </strong>${tissues_total_cost.toLocaleString("pt-BR", {currency: "BRL", style: "currency"})}`;

    let extra_items_total_cost_p = document.createElement("p");
    extra_items_total_cost_p.innerHTML = `<strong>Custo Total dos Itens Extras: </strong>${extra_items_total_cost.toLocaleString("pt-BR", {currency: "BRL", style: "currency"})}`;

    let profit_percent_cost = (Number(tissues_total_cost) + Number(extra_items_total_cost)) / 100 * (100 + Number(profit_percent));

    let profit_percent_cost_p = document.createElement("p");
    profit_percent_cost_p.innerHTML = `<strong>Valor com Lucro de ${profit_percent}%: </strong>${profit_percent_cost.toLocaleString("pt-BR", {currency: "BRL", style: "currency"})}`;

    let worker_cost_p = document.createElement("p");
    worker_cost_p.innerHTML = `<strong>Custo da Mão de Obra: </strong>${Number(worker_cost).toLocaleString("pt-BR", {currency: "BRL", style: "currency"})}`;

    let final_price_p = document.createElement("p");
    final_price_p.innerHTML = `<strong>Valor Final para Venda: </strong>${(profit_percent_cost + Number(worker_cost)).toLocaleString("pt-BR", {currency: "BRL", style: "currency"})}`;

    output.innerHTML = "";

    output.appendChild(tissue_total_cost_p);
    output.appendChild(extra_items_total_cost_p);
    output.appendChild(profit_percent_cost_p);
    output.appendChild(worker_cost_p);
    output.appendChild(final_price_p);

    const charts = document.createElement("div");
    charts.classList.add("charts");

    const expensesChart = document.createElement("canvas");
    expensesChart.id = "expensesChart";

    const nextChartButton = document.createElement("button");
    nextChartButton.innerText = "Próximo";
    nextChartButton.id = "nextChart";

    charts.appendChild(expensesChart);

    output.appendChild(charts);

    const expensesConfig = {
        type: "doughnut",
        data: {
            labels: ["Tecidos", "Itens Extras"],
            datasets: [{
                label: "",
                data: [Number(tissues_total_cost), Number(extra_items_total_cost)],
                hoverOffset: 4,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            layout: {
                autoPadding: true,
                padding: 5
            },
            plugins: {
                legend: {
                    position: "top"
                },
                title: {
                    display: true,
                    text: "Principais Despesas"
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.dataset.label}${Number(tooltipItem.raw).toLocaleString("pt-BR", {currency: "BRL", style: "currency"})}`
                        }
                    }
                }
            },
            locale: "pt-BR",
            currency: "BRL"
        }
    };

    const expensesChartInstance = new Chart(expensesChart, expensesConfig);

    currentChartInstance = expensesChartInstance;

    nextChartButton.onclick = function() {
        nextChart(expensesChart, {
            tissue: {
                totalCost: Number(tissues_total_cost),
                tissues: items.tissues
            },
            extra: {
                totalCost: Number(extra_items_total_cost),
                extras: items.extra
            }
        });
    }

    output.appendChild(nextChartButton);
}

function nextChart(ctx, items) {
    let config = {};

    if (chartCounter + 1 == 3) {
        const expensesConfig = {
            type: "doughnut",
            data: {
                labels: ["Tecidos", "Itens Extras"],
                datasets: [{
                    label: "",
                    data: [items.tissue.totalCost, items.extra.totalCost],
                    hoverOffset: 4,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                layout: {
                    autoPadding: true,
                    padding: 5
                },
                plugins: {
                    legend: {
                        position: "top"
                    },
                    title: {
                        display: true,
                        text: "Principais Despesas"
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.dataset.label}${Number(tooltipItem.raw).toLocaleString("pt-BR", {currency: "BRL", style: "currency"})}`
                            }
                        }
                    }
                },
                locale: "pt-BR",
                currency: "BRL"
            }
        };

        config = expensesConfig;

        chartCounter = 0;
    } else if (chartCounter + 1 == 1) {
        let labels = [];
        let data = [];

        for (key in items.tissue.tissues) {
            let currentTissue = items.tissue.tissues[key];

            labels.push(currentTissue.name);

            let price = ((Number(currentTissue.width_cut) * Number(currentTissue.length_cut)) * (Number(currentTissue.price) / (Number(currentTissue.width) * Number(currentTissue.length)))) || 0;

            data.push(price);

            /*
                name: tissues[i].querySelector("#nome_tecido").value,
                width: tissues[i].querySelector("#largura_tecido").value,
                length: tissues[i].querySelector("#comprimento_tecido").value,
                price: tissues[i].querySelector("#preco_tecido").value,
                width_cut: tissues[i].querySelector("#largura_retirada_tecido").value,
                length_cut: tissues[i].querySelector("#comprimento_retirado_tecido").value
            */
        }

        const tissuesExpensesConfig = {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [{
                    label: "",
                    data: data,
                    hoverOffset: 4,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                layout: {
                    autoPadding: true,
                    padding: 5
                },
                plugins: {
                    legend: {
                        position: "top"
                    },
                    title: {
                        display: true,
                        text: "Tecidos Despesas"
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.dataset.label}${Number(tooltipItem.raw).toLocaleString("pt-BR", {currency: "BRL", style: "currency"})}`
                            }
                        }
                    }
                },
                locale: "pt-BR",
                currency: "BRL"
            }
        };

        config = tissuesExpensesConfig;

        chartCounter++;
    }
    else {
        let labels = [];
        let data = [];

        for (key in items.extra.extras) {
            let currentExtraItem = items.extra.extras[key];

            labels.push(currentExtraItem.name);

            let price = (Number(currentExtraItem.quantity_used) * (Number(currentExtraItem.total_price) / Number(currentExtraItem.quantity_bought))) || 0;

            data.push(price);

            /*
                    name: extra_items[i].querySelector("#nome_item").value,
                    unit_type: extra_items[i].querySelector("#tipo_unidade").value,
                    quantity_bought: extra_items[i].querySelector("#quantity_bought").value,
                    total_price: extra_items[i].querySelector("#total_price").value,
                    quantity_used: extra_items[i].querySelector("#quantity_used").value
            */
        }

        const extraExpensesConfig = {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [{
                    label: "",
                    data: data,
                    hoverOffset: 4,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                layout: {
                    autoPadding: true,
                    padding: 5
                },
                plugins: {
                    legend: {
                        position: "top"
                    },
                    title: {
                        display: true,
                        text: "Itens Extras Despesas"
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.dataset.label}${Number(tooltipItem.raw).toLocaleString("pt-BR", {currency: "BRL", style: "currency"})}`
                            }
                        }
                    }
                },
                locale: "pt-BR",
                currency: "BRL"
            }
        };

        config = extraExpensesConfig;

        chartCounter++;
    }

    currentChartInstance.destroy();

    const newChartInstance = new Chart(ctx, config);

    currentChartInstance = newChartInstance;
}