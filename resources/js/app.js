import axios from 'axios'
import Noty from 'noty'


let addtoCart=document.querySelectorAll('.add-to-cart');
let cartCounter=document.querySelector('#cartCounter ')
function updateCart(clothes)
{
    axios.post('/update-cart',clothes).then(res=>
    {
        cartCounter.innerText=res.data.totalQty
        new Noty(
            {
                type:'success',
                timeout:500,
                progressBar:false,
                text:'item added to cart'
            }
        ).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            text: 'Something went wrong',
            progressBar: false,
        }).show();
    })
}


addtoCart.forEach((btn)=>
{
    btn.addEventListener('click',(e)=>{
        let clothes=JSON.parse(btn.dataset.clothes)
        updateCart(clothes)
    })
})