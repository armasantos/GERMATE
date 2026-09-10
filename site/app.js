const materials = [
  {code:"MAT-AST-A516-60",name:"Chapa de aço carbono para vaso de pressão",group:"Metálicos",discipline:"Mecânica",className:"Aço carbono",revision:2,status:"ATIVO"},
  {code:"MAT-SS-A312-TP316L",name:"Tubo sem costura em aço inoxidável",group:"Metálicos",discipline:"Tubulação",className:"Aço inoxidável austenítico",revision:1,status:"APROVADO"},
  {code:"MAT-EL-EPX-001",name:"Revestimento epóxi para proteção anticorrosiva",group:"Não metálicos",discipline:"Integridade",className:"Revestimento orgânico",revision:1,status:"EM ANÁLISE"}
];
const rows = document.querySelector("#rows");
const search = document.querySelector("#search");
function render() {
  const term = search.value.toLocaleLowerCase("pt-BR");
  const filtered = materials.filter((item) => [item.code,item.name,item.group,item.discipline,item.className].some((value) => value.toLocaleLowerCase("pt-BR").includes(term)));
  rows.innerHTML = filtered.map((item) => "<tr><td class=\"code\">"+item.code+"</td><td><strong>"+item.name+"</strong><br><span>"+item.group+"</span></td><td>"+item.className+"</td><td>"+item.discipline+"</td><td>Rev. "+item.revision+"</td><td><span class=\"status\">"+item.status+"</span></td></tr>").join("");
  document.querySelector("#count").textContent = materials.length;
}
search.addEventListener("input", render);
document.querySelector("#new-material").addEventListener("click", () => { document.querySelector("#form-wrap").hidden = false; });
document.querySelector("#cancel").addEventListener("click", () => { document.querySelector("#form-wrap").hidden = true; });
document.querySelector("#material-form").addEventListener("submit", (event) => {
  event.preventDefault();
  materials.push({code:document.querySelector("#code").value,name:document.querySelector("#name").value,group:document.querySelector("#group").value,discipline:document.querySelector("#discipline").value,className:document.querySelector("#class-name").value,revision:1,status:"RASCUNHO"});
  event.target.reset(); document.querySelector("#form-wrap").hidden = true; render();
});
render();
