import axios from 'axios'
import Noty from 'noty'
import moment from 'moment'
import { initAdmin } from './admin'

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


const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}






let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step-completed')
       }
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
           }
       }
    })

}

updateStatus(order);


let socket = io()
initAdmin(socket)

if(order) {
    socket.emit('join', `order_${order._id}`)
}


let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
})



