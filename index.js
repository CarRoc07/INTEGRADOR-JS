// TOGGLE CART

const cartIcon = document.getElementById("icon-cart");
const cart = document.querySelector(".cart");
const btnCloseCart = document.querySelector(".btn-close-cart");
const overlay = document.querySelector(".overlay");
const btnOpenMenu = document.getElementById("icon-menu");
const nav = document.querySelector(".nav");

const closeOpenCart = () => {
    if(nav.classList.contains("open-menu")){
        nav.classList.remove("open-menu");
        overlay.classList.remove("show-overlay");
    }
    cart.classList.toggle("open");
    overlay.classList.toggle("show-overlay");
};

btnCloseCart.addEventListener("click", closeOpenCart);
cartIcon.addEventListener("click", closeOpenCart);

// HAMBURGER MENÚ

const openMenu = () => {
    if(cart.classList.contains("open")){
        cart.classList.remove("open");
        overlay.classList.remove("show-overlay");
    }
    nav.classList.toggle("open-menu");
    overlay.classList.toggle("show-overlay");
};

btnOpenMenu.addEventListener("click", openMenu);

// FILTERS

const categoryContainer = document.querySelector(".filter-category-container");
const resultsContainer = document.querySelector(".filtered-results");
let filtersCategory = document.querySelectorAll(".filter-category");

const renderProduct = (product) => {
    let {name,price,img} = product;

    return `<div class="item-container">
        <img src=${img} alt=${name}>
        <h5>${name}</h5>
        <h6>$ ${price}</h6>
        <button class="btn-addToCart" data-name=${name} data-price=${price} data-img=${img} data-quantity=1>Add to Cart</button>
    </div>
    ` 
};

const renderDefault = () => {
    renderFiltersResults(0);

    filtersCategory[0].classList.add("active");
};

const quitClassActive = () =>{
    for (let i = 0; i < filtersCategory.length; i++) {
        filtersCategory[i].classList.remove("active");
    }
};

const renderFiltersResults = (id) => {
    resultsContainer.innerHTML = products[id].map(renderProduct).join("");
};

const filterProduct = (e) => {
    if(!e.target.id) return;

    resultsContainer.innerHTML = "";
    quitClassActive();

    e.target.parentNode.classList.add("active");
    renderFiltersResults(e.target.id);
};

document.addEventListener("DOMContentLoaded", renderDefault);
categoryContainer.addEventListener("click", filterProduct);

// CART & LS

let cartProductsContainer = document.querySelector(".products-container");
const containerTotalCart = document.querySelector(".totalPriceCart");
let total = 0;

let CarritoLS = JSON.parse(localStorage.getItem('Cart')) || [];

const saveLocalStorage = (CarritoLS) => {
    localStorage.setItem('Cart', JSON.stringify(CarritoLS));
};

const renderProductCart = (product) => {
    let {name,price,img,quantity} = product;

    calculateTotalCart(price,quantity,'default');

    return `<div class="product" id=${name}>
        <img src=${img} alt=${name}>
        <h5>$ ${price}</h5>
        <div>
            <button class="btn-deleteUnit ${(quantity != 1) ? '' : 'disabled'}">-</button>
            <input value=${quantity} readonly></input>
            <button class="btn-addUnit">+</button>
        </div>
        <button class="btn-deleteProduct">X</button>
    </div>
    `
};

const renderProductsOfLS = () => {
    for (let i = 0; i < CarritoLS.length; i++) {
        cartProductsContainer.innerHTML += renderProductCart(CarritoLS[i]);
    }
};

const renderProductsCart = (product) => {
    cartProductsContainer.innerHTML += renderProductCart(product);
};

const isExistingProductCart = (product) => {
    let productsOfCart = document.querySelectorAll(".product");

    if(!productsOfCart.length) return false;

    for (let i = 0; i < productsOfCart.length; i++) {
        if(productsOfCart[i].id === product.name){
            addUnitToProductCart(productsOfCart[i]);
            return true;
        }
    }
    return false;
};

const addUnitToProductLS = (product) => {
    CarritoLS.map( (productLS) => {
        if(productLS.name === product){
            productLS.quantity++;
        }
        saveLocalStorage(CarritoLS);
        return;
    })

    CarritoLS.map( (productLS) => {
        if(productLS.name === product.name){
            productLS.quantity++;
        }
        saveLocalStorage(CarritoLS);
        return;
    })
};

const removeUnitToProductLS = (product) => {

    CarritoLS.map( (productLS) => {
        if(productLS.name === product){
            productLS.quantity--;
        }
        saveLocalStorage(CarritoLS);
        return;
    })
    CarritoLS.map( (productLS) => {
        if(productLS.name === product.name){
            productLS.quantity--;
        }
        saveLocalStorage(CarritoLS);
        return;
    })
};

const deleteProductOfLS = (product) => {
    let productsOfLS = CarritoLS;
    CarritoLS = [];

    productsOfLS.map( (productLS) => {
        if(productLS.name !== product){
            CarritoLS = [...CarritoLS,{...productLS}];
        }
    })

    saveLocalStorage(CarritoLS);
};

const addUnitToProductCart = (CartProduct) => {

    addUnitToProductLS(CartProduct.id);
    calculateTotalCart(parseInt(CartProduct.children[1].innerText.slice(2)),CartProduct.children[2].children[1].value,true);

    CartProduct.children[2].children[1].value++;
    CartProduct.children[2].children[0].classList.remove("disabled");
};

const removeUnitToProductCart = (CartProduct) => {

    if(CartProduct.children[2].children[1].value > 1){
        CartProduct.children[2].children[1].value--;
        removeUnitToProductLS(CartProduct.id);
        calculateTotalCart(CartProduct.children[1].innerText.slice(2),CartProduct.children[2].children[1].value,false);
        if(CartProduct.children[2].children[1].value == 1){
            CartProduct.children[2].children[0].classList.add("disabled");
        }
        return;
    }
};

const deleteProductOfCart = (CartProduct) => {
    deleteProductOfLS(CartProduct.id);

    let products = [...cartProductsContainer.children];
    cartProductsContainer.innerHTML = "";

    for(let i = 0; i < products.length; i++){
        if(products[i].id !== CartProduct.id){
            cartProductsContainer.appendChild(products[i]);
        };
    };

    calculateTotalCart(CartProduct.children[1].innerText.slice(2),CartProduct.children[2].children[1].value);
};

const cleanCart = () => {
    CarritoLS = [];
    cartProductsContainer.innerHTML = "";
    saveLocalStorage(CarritoLS);
    resetTotalCart();
};

const calculateTotalCart = (price,quantity,validate) => {
    if(validate === true){
        total += price;
    } else if(validate === false){
        total -= price;
    } else if(validate === 'default'){
        total += (price * quantity);
    } else if(!validate){
        total -= (price * quantity);
    };
    containerTotalCart.innerText = `$ ${total}`;
};

const resetTotalCart = () => {
    containerTotalCart.innerText = `$ 0`;
    total = 0;
};

const selectProductToAdd = (e) =>{
    if(!e.target.classList.contains("btn-addToCart")) return;

    let product = {
        name: e.target.dataset.name,
        price: e.target.dataset.price,
        img: e.target.dataset.img,
        quantity: e.target.dataset.quantity,
    };

    if(!isExistingProductCart(product)){
        renderProductsCart(product);
        CarritoLS = [...CarritoLS, {...product} ];
        saveLocalStorage(CarritoLS);
    };
};

const modifyProductQuantity = (e) => {
    if(e.target.classList.contains("btn-deleteUnit")){
        removeUnitToProductCart(e.target.parentNode.parentNode);
        return;
    };

    if(e.target.classList.contains("btn-addUnit")){
        addUnitToProductCart(e.target.parentNode.parentNode);
        return;
    };

    if(e.target.classList.contains("btn-deleteProduct")){
        if(confirm("¿Desea eliminar este producto del Carrito?")){
            deleteProductOfCart(e.target.parentNode);
            return;
        }
    };

    if(e.target.classList.contains("btn-deleteAllProducts") || e.target.classList.contains("btn-buyCart")){
        if(!cartProductsContainer.children.length) return;
        if(confirm("Esta accion vaciará el carrito. ¿Desea continuar?")){
            cleanCart();
            closeOpenCart();
        }
    };
};

document.addEventListener("DOMContentLoaded", renderProductsOfLS);
resultsContainer.addEventListener("click", selectProductToAdd);
cart.addEventListener("click", modifyProductQuantity);
