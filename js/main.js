var baseURL = "data/";
var regexNameLastName = /^[A-ZŠĐŽĆČ][a-zšđžćč]{2,15}(\s[A-ZŠĐŽĆČ][a-zšđžćč]{2,15}){0,2}$/;
var regexAdress = /^[A-z\dŠĐŽĆČšđžćč\.]+(\s[A-z\dŠĐŽĆČšđžćč\.]+)+,(\s?([A-ZŠĐŽĆČ][a-zšđžćč]+)+)+$/;
var regexTelNumber = /^06\d{7,8}$/;
var regEmail = /^[a-z]((\.|-|_)?[a-z0-9]){2,}@[a-z]((\.|-|_)?[a-z0-9]+){2,}\.[a-z]{2,6}$/i;
var dataValid = true;
$(document).ready(function(){

    let location = window.location.pathname;
    callBackAjax(baseURL + "menu.json","get",function(data){
        printMenu(data);
    });
    callBackAjax(baseURL + "brandsIndex.json","get",function(data){
        printBrandsIndex(data);
    });
    callBackAjax(baseURL + "brands.json","get",function(data){
        printBrands(data);
    });

    $("#toggle-button").click(function(){
        $(".navbar")[0].classList.toggle('active');
    });


    if(location.indexOf("index.html") != -1){
        $("#submitNewsletter").click(function(){
            $("#emailPTag").remove();
            let vrednost=$("#emailIndex").val();
            if(vrednost=!"" && regEmail.test(vrednost)){
                $("<p id='emailPTag'class='mt-3 mr-3 float-right'>Uspešno ste poslali email!</p>").insertAfter("#submitNewsletter");
            }
            else{
                $("<p id='emailPTag'class='mt-3 mr-3 float-right'>Niste uneli emial u pravom formatu,pokušajte ponovo!</p>").insertAfter("#submitNewsletter");
            }
        });
    }

    if(location.indexOf("shop.html") != -1){
        filtAndSort();
        $("#sorting").change(filtAndSort);
        $(".cena").change(filtAndSort);
    }

    if(location.indexOf("contact.html") != -1){
        $("#formContactSubmit").click(function(){
            dataValid = true;
            $("#succMsg").remove();
            let firstName = $("#firstName").val();
            let lastName = $("#lastName").val();
            let email = $("#email").val();
            let phone = $("#phone").val();
            let message = $("#message").val();
    
            checkRegex(firstName,"firstName",regexNameLastName,"Ime ne sme biti prazno i mora početi velikim slovom");
            checkRegex(lastName,"lastName",regexNameLastName,"Prezime ne sme biti prazno i mora početi velikim slovom");
            checkRegex(email,"email",regEmail,"Email ne sme biti prazno i mora biti u formi email adrese");
            checkRegex(phone,"phone",regexTelNumber,"Broj telefona ne sme biti prazno i mora sadržati samo cifre");
    
            if(message=="" || message.length<15){
                dataValid=false;
                $("#message").attr("placeholder", "Poruka ne sme biti prazno i mora sadržati više od 15 karaktera");
                $("#message").css({'border':'1px solid #e60000'});
            }
            else{
                $("#message").css({'border':'1px solid #fff'});
            }
            
            if(dataValid){
                console.log("dsad");
                $("<p class='text-center mt-3' id='succMsg'>Poruka je poslata!</p>").insertAfter("#formContact");
            }
            
        });
    }

    if(location.indexOf("cart.html") != -1){
        printCart();
    }
});

function callBackAjax(url,method,result){
    $.ajax({
        "method":method,
        "dataType":"json",
        "url" : url,
        "success":result,
        "error":function(jqXHR, exception){
            var msg = '';
            if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
            msg = 'Time out error.';
            } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
            } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            alert(msg);
            }
           
    });
}

function printMenu(data){
    let print="";
    for(item of data){
        print+=`<li class="nav-item">
        <a class="blackColor nav-link" href="${item.href}">${item.name}</a>
      </li>`
    }
    $("#listaMeni").html(print);
    printNmbrOfItemsInCart();
}

function printBrandsIndex(data){
    let print="";
    for(i=0;i<data.length;i++){
        if(i%2==0){
            print+=`<div class="container-fluid">
            <div class="row">
                <div class="slikaArtikal col-lg-5 d-flex justify-content-center">
                    <img src="img/${data[i].img.src}" class="img-fluid bg-dark" alt="${data[i].img.alt}" />
                </div>
                <div class="tekstArtikal col-lg-7 d-flex flex-column mb-3 justify-content-center text-center">
                    <h1 >${data[i].name}</h1>
                    <h2 >${data[i].text}</h2>
                    <p >${data[i].description}</p>
                    <a href="shop.html">Kupi</a>
                </div>
            </div>
        </div>`
        }
        else{
            print+=`<div class="container-fluid bg-color-black">
            <div class="row">
                <div class="tekstArtikal col-lg-7 d-flex flex-column mt-3 justify-content-center text-center">
                    <h1 class="text-white">${data[i].name}</h1>
                    <h2 class="text-white">${data[i].text}</h2>
                    <p class="text-white">${data[i].description}</p>
                    <a href="shop.html">Kupi</a>
                </div>
                <div class="slikaArtikal col-lg-5 d-flex justify-content-center">
                    <img src="img/${data[i].img.src}" class="img-fluid bg-dark" alt="${data[i].img.alt}" />
                </div>
            </div>
        </div>`
        }
        $("#main").html(print);
    }
}

function printBrands(data){
    let print="";
    for(item of data){
        print+=`<input type="checkbox" value="${item.value}" class="brend" name="chbBrend" />
        <label>${item.name}</label></br>`
    }
    $("#filterBrend").html(print);
    $(".brend").change(filtAndSort);
}
//funkcija ispisuje proizvode ali pre toga vrsi sva filtriranja i sortiranja
function printProducts(data){
    data = filterByBrand(data);
    data = sortByNamePrice(data);
    data = filterByPrice(data);
    let print="";
    if(data.length != 0){
        for(item of data){
            print+=`<div class="col-5 col-md-3 mb-3 pt-2 product">
                <img src="img/${item.img.src}" alt="${item.img.alt}" class="img-fluid ">
                 <p class="border-bottom pb-3">${item.name}</p>
                <div class="pt-2 pb-3 ">
                    <span class="red">${item.price.new} $ </span><br>
                    <span><del>${item.price.old} $ </del></span>
                <div class="cart">
                <button class="addToCart buylink" href="#" data-id="${item.id}">Dodaj u korpu</button>
            </div>
            </div>
        </div>`
       }
       }
       else
       {
       print=`<h2 class="h3 m-auto my-3">Nema artikala u ovoj kategoriji!</h2>`
       }
       $('#products').html(print);
       $('.addToCart').click(addToCart);
       $('.addToCart').click(printNmbrOfItemsInCart);
       $('.addToCart').click(succAdded);
}

function  printNmbrOfItemsInCart(){
    let products = getFromLs("cartProducts");
    let pTag = "";
    if(products != null){
        pTag+=`<p id="pTagCounter">${products.length}</p>`
    }
    else{
        pTag+=`<p id="pTagCounter">0</p>`
    }
    $("#counter").html(pTag);
}

function addToLS(name,value){
    localStorage.setItem(name,JSON.stringify(value));
}

function getFromLs(name){
    return JSON.parse(localStorage.getItem(name));
}

function checkRegex(field,id,regex,placeholder){
    if(!(field!="" && regex.test(field))){
        dataValid=false;
        $("#"+id).attr("placeholder", placeholder);
        $("#"+id).css({'border':'1px solid #e60000'});
    }
    else{
        $("#"+id).css({'border':'1px solid #fff'});
    }
}
//funkcija dohvata proizvode iz jsona i prosledjuje funkciji za ispis proizvoda
function filtAndSort(){
    callBackAjax(baseURL + "products.json","get",function(data){
        printProducts(data);
        addToLS("products",data);
    });
}
//filtriranje po brendu
function filterByBrand(data){
    var selectedBrands = [];
    let brands = document.getElementsByClassName("brend");
    for(let brand of brands){
        if(brand.checked){
            selectedBrands.push(brand.value)
        }
    }
        if(selectedBrands.length!=0){
        return data.filter(function(el){
            if(selectedBrands.includes(el.brand)){
                console.log(el);
                return el;
            }
        });
    }
    else{
        return data;  
    }
}
//sortiranje po ceni,imenu
function sortByNamePrice(data){
    var sortType = $('#sorting').val();
    if(sortType == 'sortByPriceAsc'){
        return data.sort((a,b) => a.price.new > b.price.new ? 1: -1) 
    }
    else if(sortType == 'sortByPriceDesc'){
        return data.sort((a,b) => a.price.new < b.price.new ? 1   : -1)
    }
    else if(sortType == 'sortByName'){
        return data.sort((a,b) => a.name > b.name ? 1 : -1)
    }
    else{
        return data;
    }
}
//filtriranje po ceni
function filterByPrice(data){
    let selectedValue = $("input[name='price']:checked").val();
    if(selectedValue=="nofilter"){
        console.log(selectedValue);
        return data;
    }
    else if(selectedValue){
        let minValue = selectedValue.split("-")[0];
        let maxValue = selectedValue.split("-")[1];
        return data.filter(function(el){
            if(el.price.new <=maxValue && el.price.new>=minValue){
                return el;
            }
        });
    }
    else{
        return data;
    }
}
//dodavanje proizvoda u korpu
function addToCart(){
    let id = $(this).data('id');
    var cartProducts = getFromLs("cartProducts");
    if(cartProducts){
        if(productIsInCart()){
            updateQuantity();
        }
        else{
            addNewItem();
        }
    }
    else{
        addFirst();
    }

    function addFirst(){
        let products = [];
        products[0]={
            id:id,
            quantity:1
        }
        addToLS("cartProducts",products);
    }
    
    function productIsInCart(){
            return cartProducts.filter(e => e.id==id).length;
    }

    function updateQuantity(){
        let products = getFromLs("cartProducts");
        for(let product of products){
            if (product.id==id){
                product.quantity++;
                break;
            }
        }

        addToLS("cartProducts",products);
    }

    function addNewItem(){
        let products = getFromLs("cartProducts");
        products.push({
            id:id,
            quantity:1
        });
        addToLS("cartProducts",products);
    }
}
//funkcija koja obavestava korisnika da je uspesno dodao proizvod u korpu
function succAdded(){
    let button = $(this);
    console.log(button);
    $("<p id='addItemMsg'>Dodali ste proizvod u korpu!</p>").insertAfter(button);
    setTimeout(removeMsg, 1000);
}
//funkcija koja brise poruku o dodatom proizvodu posle sekunde
function removeMsg(){
    $("#addItemMsg").remove();
}
//funckcija proverava da li je korpa prazna ili ne i u odnosu na to ispisuje odgovarajuci sadrzaj
function printCart(){
    let cartProducts = getFromLs("cartProducts");
    if(cartProducts){
        if(cartProducts.length){
            productsInCart();
            $(".quantityInput").change(quantityChange);

        }
        else{
            cartIsEmpty();
        }
    }
    else{
        cartIsEmpty();
    }
}
//prikaz prazne korpe
function cartIsEmpty(){
    $("#cartDiv").html("<div class=' mx-auto d-flex w-75'><img class=' w-50 mx-auto' src='img/emptycart.png' alt='Your cart is empty'></div><h1 class='py-3'>Vaša korpa je prazna</h1>")
}
//prikaz korpe sa proizvodima
function productsInCart(){
    let print= `
        <div id="orderTable">
            <table class="tableAlign">
                <thead id="tableHeader">
                    <tr>
                        <td>Ime Proizvoda</td>
                        <td>Slika</td>
                        <td>Cena</td>
                        <td>Količina</td>
                        <td>Ukupno</td>
                        <td>Ukloni</td>
                    </tr>
                </thead>`;
    let allProducts = getFromLs("products");
    let products = getFromLs("cartProducts");
    allProducts = allProducts.filter(el => {
        for(let p of products){
            if(el.id == p.id) {
                el.quantity = p.quantity;
                    return true;
            }
        }
    });
    for(let obj of allProducts){
        print+=`<tbody>
                    <tr class="tableProduct">
                        <td><h5 class="name">${obj.name}</h5></td>
                        <td><img src="img/${obj.img.src}" alt="${obj.img.alt}" class="img-fluid"></td>
                        <td class="price">$${obj.price.new}</td>
                        <td class="quantity"><input class="formcontrol quantityInput" type="number" value="${obj.quantity}"></td>
                        <td class="productSum">${parseFloat(obj.price.new*obj.quantity)} $</td>
                        <td><button onclick ='removeItem(${obj.id})'class="btn btn-outlinedanger btnRemove">Ukloni</button></td>
                    </tr>
                </tbody>`;
    }
    print+=` </table></div>
        <div class="container mt-5">
            <div class="row">
                <div class="col-12 d-flex flex-column justify-content-center">
                    <p id="totalSum">Račun:${sum(allProducts)}$</p>
                    <button id="purchase" onclick ="buy()">Kupi</button>
                    <button id="removeAll" onclick="removeAll()">Isprazni sve iz korpe</button>
                </div>
            </div>
        </div>`;
 $("#cartDiv").html(print);
}
//funkcija vraca ukupnu cenu proizvoda
function sum(data){
    let sum = 0;
    data.forEach(el =>{
        console.log(el.price.new)
        console.log(el.quantity)
        sum+=parseFloat(el.price.new*el.quantity);
    })
    return sum;
   }
//funckcija prise samo jedan proizvod
function removeItem(id){
    let products = anyInCart();
    products = products.filter(x => x.id != id);
    addToLS("cartProducts",products);
    printCart(products);
    printNmbrOfItemsInCart();
   }
//funkcija proverava da li postoje proizvodi u korpi-u local storage
function anyInCart(){
    return JSON.parse(localStorage.getItem("cartProducts"));
   }
//kolicina proizvoda ne moze biti manja od 0,to proverava ova funkcija i vrsi update ukoliko se kolicina uvecava
function quantityChange(){
    if(this.value > 0 ) {
    update();
    }
    else {
    this.value = 1;
    }
   }
//funkcija uvecava kolicinu proizvoda i racuna ukupnu cenu
function update(){
    let productSum = document.querySelectorAll(".productSum");
    let price = document.querySelectorAll(".price");
    let quantitySum = document.querySelectorAll(".quantityInput");
    let totalSumforAll = document.querySelector("#totalSum");
    let totalSumForOne = 0;
    for(let i=0; i< price.length; i++){
    let priceone = price[i].innerHTML.replace('$','');
    productSum[i].innerHTML = (Number(priceone)*Number(quantitySum[i].value)).toFixed(2) + "$";
   
    totalSumForOne += Number(priceone) * Number(quantitySum[i].value);
    }
    totalSumforAll.innerHTML = "Total Sum:" + parseFloat(totalSumForOne).toFixed(2) + "$";
}
//prilikom kupovine,korisniku se ispisuje alert poruka da je uspesno obavio kupovinu i prazni se korpa
function buy(){
    alert("Vaša porudžbina je zabeležena");
    localStorage.removeItem("cartProducts");
    cartIsEmpty();
    printNmbrOfItemsInCart();
}
//funckija brise sve proizvode iz
function  removeAll(){
    localStorage.removeItem("cartProducts");
    cartIsEmpty();
    printNmbrOfItemsInCart();
}



